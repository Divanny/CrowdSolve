using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Enums;
using CrowdSolve.Server.Models;
using CrowdSolve.Server.Repositories.Autenticación;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Google.Apis.Auth;
using System.Linq.Expressions;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Util.Store;

namespace CrowdSolve.Server.Infraestructure
{
    /// <summary>
    /// Clase que maneja la autenticación de usuarios.
    /// </summary>
    public class Authentication
    {
        private readonly IConfiguration _configuration;
        private readonly Dictionary<string, string> _testUsers;
        private readonly CrowdSolveContext _CrowdSolveContext;
        private readonly IPasswordHasher _passwordHasher;
        private readonly UsuariosRepo _usuariosRepo;
        private readonly PerfilesRepo _perfilesRepo;
        private readonly CredencialesAutenticacionRepo _credencialesAutenticacionRepo;
        private readonly Mailing _mailingService;
        /// <summary>
        /// Constructor de la clase Authentication.
        /// </summary>
        /// <param name="CrowdSolveContext">Contexto de la base de datos de CrowdSolve.</param>
        /// <param name="configuration">Configuración de la aplicación.</param>
        public Authentication(CrowdSolveContext CrowdSolveContext, IConfiguration configuration, IPasswordHasher passwordHasher, Mailing mailingService)
        {
            _CrowdSolveContext = CrowdSolveContext;
            _configuration = configuration;
            _testUsers = new Dictionary<string, string>
            {
                { "admin", "Pruebas2024" },
                { "participante", "Pruebas2024" },
                { "empresa", "Pruebas2024" }
            };
            _passwordHasher = passwordHasher;
            _usuariosRepo = new UsuariosRepo(CrowdSolveContext);
            _perfilesRepo = new PerfilesRepo(CrowdSolveContext);
            _credencialesAutenticacionRepo = new CredencialesAutenticacionRepo(CrowdSolveContext);
            _mailingService = mailingService;
        }

        /// <summary>
        /// Método para iniciar sesión.
        /// </summary>
        /// <param name="credentials">Credenciales de inicio de sesión.</param>
        /// <returns>Resultado de la operación de inicio de sesión.</returns>
        public OperationResult SignIn(Credentials credentials)
        {
            if (credentials == null) return new OperationResult(false, "Credenciales no proporcionadas", false);
            if (string.IsNullOrEmpty(credentials.Username)) return new OperationResult(false, "Nombre de usuario o correo electrónico no proporcionado", false);
            if (string.IsNullOrEmpty(credentials.Password)) return new OperationResult(false, "Contraseña no proporcionada", false);

            if (IsDevelopmentEnvironment())
            {
                if (_testUsers.ContainsKey(credentials.Username) && _testUsers[credentials.Username] == credentials.Password)
                {
                    return new OperationResult(true, "Inicio de sesión exitoso", null, TokenGenerator(credentials.Username, 1, 1));
                }
            }

            var usuario = _CrowdSolveContext.Set<Usuarios>().Where(x => x.NombreUsuario.Equals(credentials.Username) || x.CorreoElectronico.Equals(credentials.Username)).FirstOrDefault();

            if (usuario == null)
            {
                return new OperationResult(false, "Usuario o contraseña incorrectos");
            }

            var credenciales = _credencialesAutenticacionRepo.Get().FirstOrDefault(x => x.idUsuario == usuario.idUsuario);

            if (usuario.Contraseña == null && credenciales != null)
            {
                return new OperationResult(false, $"Este usuario se registró con {credenciales.MetodoAutenticacion}, inicie sesión con {credenciales.MetodoAutenticacion}");
            }

            if (!_passwordHasher.Check(usuario.Contraseña ?? "", credentials.Password))
            {
                return new OperationResult(false, "Usuario o contraseña incorrectos");
            }

            List<Vistas> vistas = _perfilesRepo.GetPermisos(Convert.ToInt32(usuario.idPerfil)).ToList();

            string token = TokenGenerator(usuario.NombreUsuario, usuario.idUsuario, usuario.idPerfil);

            var data = new
            {
                usuario = _usuariosRepo.GetByUsername(usuario.NombreUsuario),
                vistas = vistas
            };

            return new OperationResult(true, "Éxito al iniciar sesión", data, token);
        }

        /// <summary>
        /// Método para registrar un nuevo usuario.
        /// </summary>
        /// <param name="credentials"></param>
        /// <returns></returns>
        public OperationResult SignUp(Credentials credentials)
        {
            using (var transaction = _CrowdSolveContext.Database.BeginTransaction())
            {
                try
                {
                    // Validaciones de Credenciales
                    if (credentials == null) return new OperationResult(false, "Credenciales no proporcionadas", false);
                    if (string.IsNullOrEmpty(credentials.Username)) return new OperationResult(false, "Nombre de usuario no proporcionado", false);
                    if (string.IsNullOrEmpty(credentials.Email)) return new OperationResult(false, "Correo electrónico no proporcionado", false);
                    if (string.IsNullOrEmpty(credentials.Password)) return new OperationResult(false, "Contraseña no proporcionada", false);

                    if (_usuariosRepo.Any(x => x.NombreUsuario == credentials.Username))
                    {
                        return new OperationResult(false, "Este usuario ya existe");
                    }

                    if (_usuariosRepo.Any(x => x.CorreoElectronico == credentials.Email))
                    {
                        return new OperationResult(false, "Este correo electrónico ya está registrado");
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

                    var usuario = _usuariosRepo.Add(new UsuariosModel()
                    {
                        idPerfil = idPerfilPorDefecto,
                        NombreUsuario = credentials.Username,
                        CorreoElectronico = credentials.Email,
                        FechaRegistro = DateTime.Now,
                        ContraseñaHashed = _passwordHasher.Hash(credentials.Password),
                        idEstatusUsuario = (int)EstatusUsuariosEnum.Incompleto
                    });

                    List<Vistas> vistas = _perfilesRepo.GetPermisos(Convert.ToInt32(usuario.idPerfil)).ToList();

                    string token = TokenGenerator(credentials.Username, usuario.idUsuario, usuario.idPerfil);

                    var data = new
                    {
                        usuario = _usuariosRepo.GetByUsername(credentials.Username),
                        vistas = vistas
                    };

                    transaction.Commit();

                    return new OperationResult(true, "Usuario registrado con éxito", data, token);
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return new OperationResult(false, ex.Message);
                }
            }
        }

        /// <summary>
        /// Método para iniciar sesión con Google.
        /// </summary>
        /// <param name="code">Token de Google.</param>
        /// <returns>Resultado de la operación de inicio de sesión.</returns>
        public async Task<OperationResult> GoogleLogin(string code)
        {
            if (string.IsNullOrEmpty(code))
                return new OperationResult(false, "Token de Google no proporcionado", false);

            GoogleJsonWebSignature.Payload payload;
            try
            {
                var flow = new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
                {
                    ClientSecrets = new ClientSecrets
                    {
                        ClientId = _configuration["Google:ClientId"],
                        ClientSecret = _configuration["Google:ClientSecret"]
                    },
                    Scopes = new[] { "email", "profile" },
                    DataStore = new FileDataStore("Google.Apis.Auth")
                });

                var token = await flow.ExchangeCodeForTokenAsync(
                    "user",
                    code,
                    "postmessage",
                    CancellationToken.None);

                var settings = new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new List<string?>() { _configuration["Google:ClientId"] }
                };

                payload = await GoogleJsonWebSignature.ValidateAsync(token.IdToken, settings);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al validar el token de Google", ex);
            }

            using (var trx = _CrowdSolveContext.Database.BeginTransaction())
            {
                try
                {
                    var email = payload.Email;
                    var googleUserId = payload.Subject;
                    var name = payload.Name;

                    var cred = _credencialesAutenticacionRepo.Get().FirstOrDefault(c => c.idExterno == googleUserId && c.idMetodoAutenticacion == (int)MetodosAutenticacionEnum.Google);

                    Usuarios usuario;
                    if (cred != null)
                    {
                        usuario = _CrowdSolveContext.Set<Usuarios>().Where(x => x.idUsuario == cred.idUsuario).FirstOrDefault();
                    }
                    else
                    {
                        usuario = _CrowdSolveContext.Usuarios.FirstOrDefault(u => u.CorreoElectronico == email);

                        if (usuario == null)
                        {
                            usuario = _usuariosRepo.Add(new UsuariosModel()
                            {
                                idPerfil = _perfilesRepo.GetPerfilDefault(),
                                NombreUsuario = name,
                                CorreoElectronico = email,
                                FechaRegistro = DateTime.UtcNow,
                                idEstatusUsuario = (int)EstatusUsuariosEnum.Incompleto,
                                AvatarURL = payload.Picture
                            });
                        }

                        var nuevaCredencial = _credencialesAutenticacionRepo.Add(new CredencialesAutenticacionModel()
                        {
                            idUsuario = usuario.idUsuario,
                            idMetodoAutenticacion = (int)MetodosAutenticacionEnum.Google,
                            idExterno = googleUserId
                        });
                    }

                    string token = TokenGenerator(usuario.NombreUsuario, usuario.idUsuario, usuario.idPerfil);

                    List<Vistas> vistas = _perfilesRepo.GetPermisos(Convert.ToInt32(usuario.idPerfil)).ToList();

                    var data = new
                    {
                        usuario = _usuariosRepo.GetByUsername(usuario.NombreUsuario),
                        vistas = vistas
                    };

                    trx.Commit();

                    return new OperationResult(true, "Inicio de sesión exitoso con Google", data, token);
                }
                catch (Exception ex)
                {
                    trx.Rollback();
                    return new OperationResult(false, ex.Message);
                }
            }
        }

        /// <summary>
        /// Método para recuperar la contraseña de un usuario.
        /// </summary>
        /// <param name="usuario"></param>
        /// <returns></returns>
        public OperationResult ForgotPassword(UsuariosModel usuario)
        {
            try
            {
                var usuarioDB = _CrowdSolveContext.Set<Usuarios>().Where(x => x.idUsuario == usuario.idUsuario).FirstOrDefault();

                var credenciales = _credencialesAutenticacionRepo.Get().FirstOrDefault(x => x.idUsuario == usuario.idUsuario);

                if (usuarioDB.Contraseña == null && credenciales != null)
                {
                    return new OperationResult(false, $"Este usuario se registró con {credenciales.MetodoAutenticacion}, inicie sesión con {credenciales.MetodoAutenticacion}");
                }

                string codigo = OTP.GenerateOTP();

                if (_CrowdSolveContext.CodigosVerificacion.Any(x => x.idUsuario == usuario.idUsuario))
                {
                    _CrowdSolveContext.CodigosVerificacion.RemoveRange(_CrowdSolveContext.CodigosVerificacion.Where(x => x.idUsuario == usuario.idUsuario));
                }

                _CrowdSolveContext.CodigosVerificacion.Add(new CodigosVerificacion()
                {
                    idUsuario = usuario.idUsuario,
                    Codigo = _passwordHasher.Hash(codigo),
                    Fecha = DateTime.Now
                });

                _CrowdSolveContext.SaveChanges();

                _mailingService.SendForgotPasswordMail(usuario.CorreoElectronico, codigo);
                
                return new OperationResult(true, "Se ha enviado un correo con el código para restablecer la contraseña", usuario);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al enviar el código de verificación", ex);
            }
        }

        /// <summary>
        /// Verifica el código de verificación para restablecer la contraseña.
        /// </summary>
        /// <param name="usuario"></param>
        /// <param name="codigo"></param>
        /// <returns></returns>
        public OperationResult VerifyCode(UsuariosModel usuario, string codigo)
        {
            try
            {
                if (usuario != null)
                {
                    var codigoVerificacion = _CrowdSolveContext.CodigosVerificacion.Where(x => x.idUsuario == usuario.idUsuario).OrderByDescending(x => x.idCodigoVerificacion).FirstOrDefault();

                    if (codigoVerificacion == null)
                        return new OperationResult(false, "No se ha encontrado un código de verificación para este usuario");

                    if (codigo == null || codigo.Length != 6)
                        return new OperationResult(false, "El código de verificación no es válido");

                    if (!_passwordHasher.Check(codigoVerificacion.Codigo, codigo))
                    {
                        return new OperationResult(false, "Código de verificación incorrecto");
                    }

                    if (codigoVerificacion.Fecha != null && codigoVerificacion.Fecha.AddMinutes(15) < DateTime.Now)
                        return new OperationResult(false, "El código de verificación ha expirado");

                    return new OperationResult(true, "Código de verificación correcto", TokenGenerator(usuario.NombreUsuario, usuario.idUsuario, usuario.idPerfil));
                }
                else
                {
                    return new OperationResult(false, "Usuario no encontrado");
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al verificar el código de verificación", ex);
            }
        }

        /// <summary>
        /// Restablece la contraseña de un usuario.
        /// </summary>
        /// <param name="usuario"></param>
        /// <param name="password"></param>
        /// <param name="confirmPassword"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public OperationResult ResetPassword(UsuariosModel usuario, string password, string confirmPassword)
        {
            try
            {
                if (usuario != null)
                {
                    if (password == null || password.Length < 8)
                        return new OperationResult(false, "La contraseña debe tener al menos 8 caracteres");

                    if (!password.Any(char.IsUpper))
                        return new OperationResult(false, "La contraseña debe tener al menos una letra mayúscula");

                    if (!password.Any(char.IsLower))
                        return new OperationResult(false, "La contraseña debe tener al menos una letra minúscula");

                    if (!password.Any(char.IsDigit))
                        return new OperationResult(false, "La contraseña debe tener al menos un número");

                    if (password != confirmPassword)
                        return new OperationResult(false, "Las contraseñas no coinciden");

                    var usuarioDB = _CrowdSolveContext.Usuarios.FirstOrDefault(x => x.idUsuario == usuario.idUsuario);

                    if (usuarioDB == null)
                        return new OperationResult(false, "Usuario no encontrado");

                    if (usuarioDB.Contraseña == null)
                        return new OperationResult(false, "Este usuario no tiene una contraseña establecida");

                    if (_passwordHasher.Check(usuarioDB.Contraseña, password))
                        return new OperationResult(false, "La nueva contraseña no puede ser igual a la anterior");

                    usuarioDB.Contraseña = _passwordHasher.Hash(password);

                    _CrowdSolveContext.Usuarios.Update(usuarioDB);

                    _CrowdSolveContext.CodigosVerificacion.RemoveRange(_CrowdSolveContext.CodigosVerificacion.Where(x => x.idUsuario == usuario.idUsuario));

                    _CrowdSolveContext.SaveChanges();

                    return new OperationResult(true, "Contraseña restablecida con éxito");
                }
                else
                {
                    return new OperationResult(false, "Usuario no encontrado");
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al restablecer la contraseña", ex);
            }
        }

        /// <summary>
        /// Genera un token de autenticación.
        /// </summary>
        /// <param name="UserName">Nombre de usuario.</param>
        /// <param name="idUsuario">ID de usuario.</param>
        /// <param name="idPerfil">ID de perfil.</param>
        /// <returns>Token de autenticación.</returns>
        private string TokenGenerator(string UserName, int idUsuario, int idPerfil)
        {
            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("Id", Guid.NewGuid().ToString()),
                    new Claim("idUsuario", idUsuario.ToString()),
                    new Claim(ClaimTypes.Role, idPerfil.ToString() ?? ""),
                    new Claim(JwtRegisteredClaimNames.Sub, UserName),
                    new Claim(JwtRegisteredClaimNames.Email, UserName),
                    new Claim(JwtRegisteredClaimNames.Jti,
                    Guid.NewGuid().ToString())
                }),
                Expires = DateTime.UtcNow.AddMinutes(90),
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = new SigningCredentials
                (new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha512Signature)
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var stringToken = tokenHandler.WriteToken(token);

            return stringToken;
        }



        /// <summary>
        /// Verifica si el entorno de desarrollo está activo.
        /// </summary>
        /// <returns>true si el entorno de desarrollo está activo, false en caso contrario.</returns>
        private bool IsDevelopmentEnvironment()
        {
            string environment = _configuration["Environment"];
            return environment == "Development";
        }
    }
}
