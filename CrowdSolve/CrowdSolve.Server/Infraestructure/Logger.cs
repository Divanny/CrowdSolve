using Newtonsoft.Json;

namespace CrowdSolve.Server.Infraestructure
{
    /// <summary>
    /// Clase que se encarga de realizar el registro de visitas y errores en la aplicación.
    /// </summary>
    public class Logger
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private int OnlineUserID;
        //private readonly db_CrowdSolveContext _db_CrowdSolveContext;

        /// <summary>
        /// Constructor de la clase Logger.
        /// </summary>
        /// <param name="serviceProvider">Proveedor de servicios.</param>
        /// <param name="userAccessor">Accesor de usuario.</param>
        /// <param name="configuration">Configuración de la aplicación.</param>
        public Logger(IServiceProvider serviceProvider, IUserAccessor userAccessor, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("CrowdSolve");

            //var contextOptions = new DbContextOptionsBuilder<db_CrowdSolveContext>()
            //                        .UseSqlServer(connectionString)
            //                        .Options;

            _httpContextAccessor = serviceProvider.GetRequiredService<IHttpContextAccessor>();
            OnlineUserID = userAccessor.idUsuario;
            //_db_CrowdSolveContext = new db_CrowdSolveContext(contextOptions);
        }

        /// <summary>
        /// Registra una solicitud HTTP en el registro de visitas.
        /// </summary>
        /// <param name="data">Datos de la solicitud HTTP.</param>
        public void LogHttpRequest(object data)
        {
            string DataJSON = data == null ? String.Empty : JsonConvert.SerializeObject(data);
            throw new NotImplementedException();
        }

        /// <summary>
        /// Registra un error en el registro de errores.
        /// </summary>
        /// <param name="ex">Excepción que se produjo.</param>
        public void LogError(Exception ex)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Registra una solicitud HTTP en el registro de visitas.
        /// </summary>
        /// <param name="log">Registro de actividad.</param>
        public void LogHttpRequest(/* LogActividad log */)
        {
            throw new NotImplementedException();
        }
    }
}
