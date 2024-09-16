using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Infraestructure;
using CrowdSolve.Server.Models;
using CrowdSolve.Server.Repositories.Autenticación;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CrowdSolve.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        private readonly Authentication _authentication;
        private readonly Logger _logger;
        private readonly int _idUsuarioOnline;
        private readonly IPasswordHasher _passwordHasher;
        private readonly UsuariosRepo _usuariosRepo;
        private readonly PerfilesRepo _perfilesRepo;
        public AccountController(IUserAccessor userAccessor, CrowdSolveContext crowdSolveContext, Authentication authentication, Logger logger, IPasswordHasher passwordHasher)
        {
            _authentication = authentication;
            _logger = logger;
            _idUsuarioOnline = userAccessor.idUsuario;
            _passwordHasher = passwordHasher;
            _usuariosRepo = new UsuariosRepo(crowdSolveContext);
        }

        /// <summary>
        /// Obtiene los datos del usuario y las vistas permitidas.
        /// </summary>
        /// <returns>Un objeto que contiene el usuario y las vistas permitidas.</returns>
        [HttpGet(Name = "GetUserData")]
        [Authorize]
        public object GetUserData()
        {
            return new
            {
                idUsuario = _idUsuarioOnline
            };
        }

        /// <summary>
        /// Registro de usuario con las credenciales proporcionadas.
        /// </summary>
        /// <param name="credentials">Las credenciales de registro.</param>
        /// <returns>El resultado de la operación de registro.</returns>
        [HttpPost("Registro", Name = "Registro")]
        [AllowAnonymous]
        public OperationResult Registro(Credentials credentials)
        {
            try
            {
                // Validaciones de Credenciales
                if (credentials == null) return new OperationResult(false, "Credenciales no proporcionadas", false);
                if (string.IsNullOrEmpty(credentials.Username)) return new OperationResult(false, "Nombre de usuario no proporcionado", false);
                if (string.IsNullOrEmpty(credentials.Password)) return new OperationResult(false, "Contraseña no proporcionada", false);

                if (_usuariosRepo.Any(x => x.NombreUsuario == credentials.Username))
                {
                    return new OperationResult(false, "Este usuario ya existe");
                }

                // Validaciones de Contraseña
                if (credentials.Password.Length < 8)
                {
                    return new OperationResult(false, "La contraseña debe tener al menos 8 caracteres");
                }

                if (!credentials.Password.Any(char.IsUpper))
                {
                    return new OperationResult(false, "La contraseña debe tener al menos una letra mayúscula");
                }

                if (!credentials.Password.Any(char.IsLower))
                {
                    return new OperationResult(false, "La contraseña debe tener al menos una letra minúscula");
                }

                if (!credentials.Password.Any(char.IsDigit))
                {
                    return new OperationResult(false, "La contraseña debe tener al menos un número");
                }

                // Registro de Usuario
                var idPerfilPorDefecto = _perfilesRepo.GetPerfilDefault();

                _usuariosRepo.Add(new UsuariosModel()
                {

                    idPerfil = idPerfilPorDefecto,
                    NombreUsuario = credentials.Username,
                    FechaRegistro = DateTime.Now,
                    ContraseñaHashed = _passwordHasher.Hash(credentials.Password)
                });

                _logger.LogHttpRequest(credentials);
                return new OperationResult(true, "si");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                return new OperationResult(false, ex.Message);
            }
        }

        /// <summary>
        /// Inicia sesión con las credenciales proporcionadas.
        /// </summary>
        /// <param name="credentials">Las credenciales de inicio de sesión.</param>
        /// <returns>El resultado de la operación de inicio de sesión.</returns>
        [HttpPost(Name = "InicioSesion")]
        [AllowAnonymous]
        public OperationResult InicioSesion(Credentials credentials)
        {
            try
            {
                OperationResult result = _authentication.LogIn(credentials);
                _logger.LogHttpRequest(result.Data);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                return new OperationResult(false, ex.Message);
            }
        }
    }
}
