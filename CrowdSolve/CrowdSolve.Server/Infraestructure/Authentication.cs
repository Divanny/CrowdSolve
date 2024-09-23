using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Enums;
using CrowdSolve.Server.Models;
using CrowdSolve.Server.Repositories.Autenticación;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

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

        /// <summary>
        /// Constructor de la clase Authentication.
        /// </summary>
        /// <param name="CrowdSolveContext">Contexto de la base de datos de CrowdSolve.</param>
        /// <param name="configuration">Configuración de la aplicación.</param>
        public Authentication(CrowdSolveContext CrowdSolveContext, IConfiguration configuration, IPasswordHasher passwordHasher)
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
        }

        /// <summary>
        /// Método para iniciar sesión.
        /// </summary>
        /// <param name="credentials">Credenciales de inicio de sesión.</param>
        /// <returns>Resultado de la operación de inicio de sesión.</returns>
        public OperationResult LogIn(Credentials credentials)
        {
            OperationResult logInResult;
            if (credentials == null) return new OperationResult(false, "Credenciales no proporcionadas", false);
            if (string.IsNullOrEmpty(credentials.Username)) return new OperationResult(false, "Nombre de usuario no proporcionado", false);
            if (string.IsNullOrEmpty(credentials.Password)) return new OperationResult(false, "Contraseña no proporcionada", false);

            if (IsDevelopmentEnvironment())
            {
                if (_testUsers.ContainsKey(credentials.Username) && _testUsers[credentials.Username] == credentials.Password)
                {
                    return new OperationResult(true, "Inicio de sesión exitoso", null, TokenGenerator(credentials.Username, 1, 1));
                }
            }

            var usuario = _usuariosRepo.GetByUsername(credentials.Username);

            if (usuario == null)
            {
                return new OperationResult(false, "Usuario o contraseña incorrectos");
            }

            if (!_passwordHasher.Check(usuario.ContraseñaHashed ?? "", credentials.Password))
            {
                return new OperationResult(false, "Usuario o contraseña incorrectos");
            }

            List<Vistas> vistas = _perfilesRepo.GetPermisos(Convert.ToInt32(usuario.idPerfil)).ToList();

            string token = TokenGenerator(credentials.Username, usuario.idUsuario, usuario.idPerfil);

            var data = new
            {
                usuario = usuario,
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

            var usuario = _usuariosRepo.Add(new UsuariosModel()
            {
                idPerfil = idPerfilPorDefecto,
                NombreUsuario = credentials.Username,
                FechaRegistro = DateTime.Now,
                ContraseñaHashed = _passwordHasher.Hash(credentials.Password),
                idEstatusUsuario = (int)EstatusUsuariosEnum.Activo
            });

            List<Vistas> vistas = _perfilesRepo.GetPermisos(Convert.ToInt32(usuario.idPerfil)).ToList();

            string token = TokenGenerator(credentials.Username, usuario.idUsuario, usuario.idPerfil);

            var data = new
            {
                usuario = usuario,
                vistas = vistas
            };

            return new OperationResult(true, "Usuario registrado con éxito", data, token);
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
                Expires = DateTime.UtcNow.AddMinutes(30),
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
