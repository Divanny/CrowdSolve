using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Infraestructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

builder.Services.AddAuthorization();
builder.Services.AddScoped<Authentication>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();

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
