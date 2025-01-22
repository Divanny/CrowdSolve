using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Infraestructure;
using CrowdSolve.Server.Services;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Reflection;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "CrowdSolve", Version = "v0.0.2" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                Array.Empty<string>()
            }
        });

    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath);
});

builder.Services.AddDbContext<CrowdSolveContext>(options => {
    options.UseSqlServer(builder.Configuration.GetConnectionString("CrowdSolve"));
    options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
});

builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

builder.Services.AddScoped<IUserAccessor>(provider => {
    IHttpContextAccessor? context = provider.GetService<IHttpContextAccessor>();

    int uid = Convert.ToInt32(context?.HttpContext?.User.Claims.FirstOrDefault(c => c.Type == "idUsuario")?.Value);

    return new UserAccessor
    {
        idUsuario = uid
    };
});

builder.Services.AddScoped<Logger>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(o =>
{
    o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey
        (Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ClockSkew = TimeSpan.Zero,
        RequireExpirationTime = true,
    };
});

builder.Services.AddMvcCore().ConfigureApiBehaviorOptions(options => {
    options.InvalidModelStateResponseFactory = (errorContext) =>
    {
        Dictionary<string, string> Errors = new Dictionary<string, string>();

        foreach (var modelStateEntry in errorContext.ModelState)
        {
            foreach (var error in modelStateEntry.Value.Errors)
            {
                Errors.Add(modelStateEntry.Key, error.ErrorMessage);
            }
        }

        return new BadRequestObjectResult(new OperationResult(false, "Los datos ingresados no son válidos", Errors));
    };
});

FirebaseApp.Create(new AppOptions()
{
    Credential = GoogleCredential.FromFile("crowdsolve-e4ade-firebase-adminsdk-4q77k-452ab49a66.json")
});

builder.Services.AddAuthorization();

builder.Services.AddScoped<Authentication>();
builder.Services.AddScoped<Mailing>();
builder.Services.AddScoped<FirebaseStorageService>();
builder.Services.AddScoped<FirebaseTranslationService>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();

builder.Services.AddHostedService<Worker>();

builder.Services.Configure<IISServerOptions>(options => options.MaxRequestBodySize = int.MaxValue);
builder.Services.Configure<KestrelServerOptions>(options =>
{
    options.Limits.MaxRequestBodySize = int.MaxValue;
});
builder.Services.Configure<FormOptions>(x =>
{
    x.ValueLengthLimit = int.MaxValue;
    x.MultipartBodyLengthLimit = int.MaxValue;
    x.MultipartBoundaryLengthLimit = int.MaxValue;
    x.MultipartHeadersCountLimit = int.MaxValue;
    x.MultipartHeadersLengthLimit = int.MaxValue;
});


var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
