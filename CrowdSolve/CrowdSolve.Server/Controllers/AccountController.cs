using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Enums;
using CrowdSolve.Server.Infraestructure;
using CrowdSolve.Server.Models;
using CrowdSolve.Server.Repositories.Autenticación;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

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
        private readonly FirebaseStorageService _firebaseStorageService;
        private readonly Mailing _mailingService;
        
        public AccountController(IUserAccessor userAccessor, CrowdSolveContext crowdSolveContext, Authentication authentication, Logger logger, FirebaseStorageService firebaseStorageService, Mailing mailing)
        {
            _authentication = authentication;
            _logger = logger;
            _idUsuarioOnline = userAccessor.idUsuario;
            _usuariosRepo = new UsuariosRepo(crowdSolveContext);
            _perfilesRepo = new PerfilesRepo(crowdSolveContext);
            _firebaseStorageService = firebaseStorageService;
            _mailingService = mailing;
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
            usuario.ContraseñaHashed = null;

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

                string mailBody = $@"
                    <h1>¡Bienvenido a CrowdSolve!</h1>
                    <p>Estamos encantados de informarte que tu registro en nuestra plataforma ha sido exitoso.</p>
                    <p>A continuación, los detalles de tu cuenta:</p>
                    <ul>
                        <li><b>Nombre:</b> {credentials.Username}</li>
                        <li><b>Correo electrónico:</b> {credentials.Email}</li>
                    </ul>
                    <p>Ahora puedes acceder a nuestra plataforma y comenzar a disfrutar de todas las herramientas y recursos que hemos preparado para ti.</p>
                    <p>Si tienes alguna pregunta o necesitas ayuda para comenzar, no dudes en contactarnos respondiendo a este correo.</p>
                    <p>¡Gracias por unirte a CrowdSolve!</p>
                ";

                _mailingService.SendMail([credentials.Email], "¡Bienvenido a CrowdSolve!", mailBody, MailingUsers.noreply);

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
            if (request == null || string.IsNullOrEmpty(request.Code))
                return BadRequest(new { success = false, message = "Código de token de Google no proporcionado." });
                
            var result = await _authentication.GoogleLogin(request.Code);

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

        /// <summary>
        /// Envia un correo electrónico con un enlace para restablecer la contraseña.
        /// </summary>
        /// <param name="email">El correo electrónico del usuario.</param>
        /// <returns>El resultado de la operación.</returns>
        [Route("ForgotPassword/{email}")]
        [HttpGet]
        [AllowAnonymous]
        public OperationResult ForgotPassword(string email)
        {
            try
            {
                if (string.IsNullOrEmpty(email))
                {
                    return new OperationResult(false, "No se proporcionó un correo electrónico.");
                }

                var usuario = _usuariosRepo.Get(x => x.CorreoElectronico == email).FirstOrDefault();

                if (usuario == null)
                {
                    return new OperationResult(false, "El correo electrónico no está registrado.");
                }

                var result = _authentication.ForgotPassword(usuario);

                _logger.LogHttpRequest(new { success = true, userName = usuario.NombreUsuario, correo = usuario.CorreoElectronico });
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                return new OperationResult(false, ex.Message);
            }
        }

        /// <summary>
        /// Verifica el código de verificación para restablecer la contraseña.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [Route("VerifyCode", Name = "VerifyCode")]
        [HttpPost]
        [AllowAnonymous]
        public OperationResult VerifyCode(CodeVerificationRequest request)
        {
            try
            {
                if (request == null || string.IsNullOrEmpty(request.Code))
                {
                    return new OperationResult(false, "No se proporcionó un código.");
                }

                var usuario = _usuariosRepo.Get(request.idUsuario);

                if (usuario == null)
                {
                    return new OperationResult(false, "El usuario no existe.");
                }

                var result = _authentication.VerifyCode(usuario, request.Code);

                _logger.LogHttpRequest(new { success = true, userName = usuario.NombreUsuario, correo = usuario.CorreoElectronico, codigo = request.Code });
                return result;

            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                return new OperationResult(false, ex.Message);
            }
        }

        /// <summary>
        /// Restablece la contraseña del usuario.
        /// </summary>
        /// <param name="request">Solicitud de restablecimiento de contraseña.</param>
        /// <returns>El resultado de la operación.</returns>
        [Route("ResetPassword", Name = "ResetPassword")]
        [HttpPost]
        [Authorize]
        public OperationResult ResetPassword(ResetPasswordRequest request)
        {
            try
            {
                if (request == null || string.IsNullOrEmpty(request.Password) || string.IsNullOrEmpty(request.ConfirmPassword))
                {
                    return new OperationResult(false, "No se proporcionó una contraseña.");
                }

                var usuario = _usuariosRepo.Get(_idUsuarioOnline);

                if (usuario == null)
                {
                    return new OperationResult(false, "El usuario no existe.");
                }

                var result = _authentication.ResetPassword(usuario, request.Password, request.ConfirmPassword);

                _logger.LogHttpRequest(new { success = true, userName = usuario.NombreUsuario, correo = usuario.CorreoElectronico });
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                return new OperationResult(false, ex.Message);
            }
        }

        /// <summary>
        /// Obtiene el avatar de un usuario.
        /// </summary>
        /// <param name="idUsuario">ID del usuario.</param>
        /// <returns>Avatar del usuario.</returns>
        [HttpGet("GetAvatar/{idUsuario}", Name = "GetAvatar")]
        public async Task<IActionResult> GetAvatar(int idUsuario){
            var usuario = _usuariosRepo.Get(idUsuario);
            if (usuario == null) return NotFound();

            if (string.IsNullOrEmpty(usuario.AvatarURL)) return NoContent();

            if (usuario.AvatarURL.Contains("http"))
            {
                return Redirect(usuario.AvatarURL);
            }

            var stream = await _firebaseStorageService.GetFileAsync(usuario.AvatarURL);
            return File(stream, "image/jpeg");
        }

        public class GoogleLoginRequest
        {
            public string? Code { get; set; }
        }

        public class CodeVerificationRequest
        {
            public int idUsuario { get; set; }
            public string? Code { get; set; }
        }

        public class ResetPasswordRequest
        {
            public string? Password { get; set; }
            public string? ConfirmPassword { get; set; }
        }
    }
}
