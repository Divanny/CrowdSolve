using CrowdSolve.Server.Entities.CrowdSolve;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace CrowdSolve.Server.Infraestructure
{
    /// <summary>
    /// Clase que se encarga de realizar el registro de las actividades y errores en la aplicación.
    /// </summary>
    public class Logger
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private int OnlineUserID;
        private readonly CrowdSolveContext _CrowdSolveContext;

        /// <summary>
        /// Constructor de la clase Logger.
        /// </summary>
        /// <param name="serviceProvider">Proveedor de servicios.</param>
        /// <param name="userAccessor">Accesor de usuario.</param>
        /// <param name="configuration">Configuración de la aplicación.</param>
        public Logger(IServiceProvider serviceProvider, IUserAccessor userAccessor, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("CrowdSolve");

            var contextOptions = new DbContextOptionsBuilder<CrowdSolveContext>()
                                    .UseSqlServer(connectionString)
                                    .Options;

            _httpContextAccessor = serviceProvider.GetRequiredService<IHttpContextAccessor>();
            OnlineUserID = userAccessor.idUsuario;
            _CrowdSolveContext = new CrowdSolveContext(contextOptions);
        }

        /// <summary>
        /// Registra una solicitud HTTP en alguna actividad.
        /// </summary>
        /// <param name="data">Datos de la solicitud HTTP.</param>
        public void LogHttpRequest(object data)
        {
            LogActividades log = new()
            {
                URL = _httpContextAccessor.HttpContext.Request.Path,
                idUsuario = OnlineUserID,
                Metodo = _httpContextAccessor.HttpContext.Request.Method,
                Fecha = DateTime.Now,
                Data = data == null ? String.Empty : JsonConvert.SerializeObject(data)
            };

            _CrowdSolveContext.Set<LogActividades>().Add(log);
            _CrowdSolveContext.SaveChanges();
        }

        /// <summary>
        /// Registra un error en el registro de errores.
        /// </summary>
        /// <param name="ex">Excepción que se produjo.</param>
        public void LogError(Exception ex)
        {
            LogErrores log = new()
            {
                idUsuario = OnlineUserID,
                Fecha = DateTime.Now,
                Mensaje = ex.Message,
                StackTrace = ex.StackTrace,
                Fuente = ex.Source
            };

            _CrowdSolveContext.Set<LogErrores>().Add(log);
            _CrowdSolveContext.SaveChanges();
        }

        /// <summary>
        /// Registra una solicitud HTTP en alguna actividad.
        /// </summary>
        /// <param name="log">Registro de actividad.</param>
        public void LogHttpRequest(LogActividades log)
        {
            _CrowdSolveContext.Set<LogActividades>().Add(log);
            _CrowdSolveContext.SaveChanges();
        }
    }
}
