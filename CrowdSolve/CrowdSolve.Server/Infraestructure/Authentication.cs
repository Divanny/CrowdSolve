﻿using CrowdSolve.Server.Models;
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
        //private readonly db_CrowdSolveContext _dbCrowdSolveContext;

        /// <summary>
        /// Constructor de la clase Authentication.
        /// </summary>
        /// <param name="db_CrowdSolveContext">Contexto de la base de datos de CrowdSolve.</param>
        /// <param name="configuration">Configuración de la aplicación.</param>
        public Authentication(/*db_RegistroVisitasContext db_CrowdSolveContext,*/ IConfiguration configuration)
        {
            //_dbCrowdSolveContext = db_CrowdSolveContext;
            _configuration = configuration;
            _testUsers = new Dictionary<string, string>
            {
                { "admin", "Pruebas2024" },
                { "participante", "Pruebas2024" },
                { "empresa", "Pruebas2024" }
            };
        }

        /// <summary>
        /// Método para iniciar sesión.
        /// </summary>
        /// <param name="credentials">Credenciales de inicio de sesión.</param>
        /// <returns>Resultado de la operación de inicio de sesión.</returns>
        public OperationResult LogIn(Credentials credentials)
        {
            if (IsDevelopmentEnvironment())
            {
                if (_testUsers.ContainsKey(credentials.Username) && _testUsers[credentials.Username] == credentials.Password)
                {
                    return new OperationResult(true, "Inicio de sesión exitoso", null, TokenGenerator(credentials.Username, 1, 1));
                }
            }

            throw new NotImplementedException();
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
