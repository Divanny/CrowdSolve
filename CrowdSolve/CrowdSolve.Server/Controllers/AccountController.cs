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
        private readonly UsuariosRepo _usuariosRepo;
        private readonly PerfilesRepo _perfilesRepo;

        public AccountController(IUserAccessor userAccessor, CrowdSolveContext crowdSolveContext, Authentication authentication, Logger logger)
        {
            _authentication = authentication;
            _logger = logger;
            _idUsuarioOnline = userAccessor.idUsuario;
            _usuariosRepo = new UsuariosRepo(crowdSolveContext);
            _perfilesRepo = new PerfilesRepo(crowdSolveContext);
        }

        /// <summary>
        /// Obtiene los datos del usuario y las vistas permitidas.
        /// </summary>
        /// <returns>Un objeto que contiene el usuario y las vistas permitidas.</returns>
        [HttpGet(Name = "GetUserData")]
        [Authorize]
        public object GetUserData()
        {
            UsuariosModel usuario = _usuariosRepo.Get(_idUsuarioOnline);
            List<Vistas> vistas = _perfilesRepo.GetPermisos(Convert.ToInt32(usuario.idPerfil)).ToList();

            var data = new
            {
                usuario = usuario,
                vistas = vistas
            };

            return data;
        }

        /// <summary>
        /// Registro de usuario con las credenciales proporcionadas.
        /// </summary>
        /// <param name="credentials">Las credenciales de registro.</param>
        /// <returns>El resultado de la operación de registro.</returns>
        [HttpPost("SignUp", Name = "SignUp")]
        [AllowAnonymous]
        public OperationResult SignUp(Credentials credentials)
        {
            try
            {
                if (credentials == null)
                {
                    return new OperationResult(false, "No se proporcionaron credenciales.");
                }

                if (string.IsNullOrEmpty(credentials.Username) || string.IsNullOrEmpty(credentials.Email) || string.IsNullOrEmpty(credentials.Password))
                {
                    return new OperationResult(false, "Los datos ingresados no son válidos");
                }

                OperationResult result = _authentication.SignUp(credentials);
                _logger.LogHttpRequest(result.Data);
                return result;
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
        [HttpPost("SignIn", Name = "SignIn")]
        [AllowAnonymous]
        public OperationResult SignIn(Credentials credentials)
        {
            try
            {
                OperationResult result = _authentication.SignIn(credentials);
                _logger.LogHttpRequest(result.Data);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                return new OperationResult(false, ex.Message);
            }
        }

        /// <summary>
        /// Endpoint para iniciar sesión con Google.
        /// </summary>
        /// <param name="request">Solicitud de inicio de sesión con Google.</param>
        /// <returns>Resultado de la operación.</returns>
        [HttpPost("GoogleLogin", Name = "GoogleLogin")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Token))
                return BadRequest(new { success = false, message = "Token de Google no proporcionado." });

            var result = await _authentication.GoogleLogin(request.Token);

            if (result.Success)
            {
                return Ok(new
                {
                    success = true,
                    message = result.Message,
                    data = result.Data,
                    token = result.Token
                });
            }
            else
            {
                return BadRequest(new { success = false, message = result.Message });
            }
        }

        [HttpGet("MailTest", Name = "MailTest")]
        [AllowAnonymous]
        public OperationResult MailTest()
        {
            try
            {
                Mailing.SendMail(["divannyjpm@gmail.com"], "Probando CrowdSolve email", "Prueba", Enums.MailingUsers.noreply);
                return new OperationResult(true, "Correo enviado correctamente");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        public class GoogleLoginRequest
        {
            public string? Token { get; set; }
        }
    }
}
