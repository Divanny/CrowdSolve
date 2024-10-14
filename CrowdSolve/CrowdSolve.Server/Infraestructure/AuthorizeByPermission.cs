using CrowdSolve.Server.Repositories.Autenticación;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Enums;

namespace CrowdSolve.Server.Infraestructure
{
    /// <summary>
    /// Clase que implementa la interfaz IAuthorizationFilter y se utiliza para autorizar el acceso a recursos en función de los permisos del usuario.
    /// </summary>
    public sealed class AuthorizeByPermission : Attribute, IAuthorizationFilter
    {
        /// <summary>
        /// Los permisos requeridos para acceder al recurso.
        /// </summary>
        public PermisosEnum[] Permisos { get; set; }

        /// <summary>
        /// Indica si se permite cualquier rol para acceder al recurso.
        /// </summary>
        public bool AllowAnyRole { get; set; }

        /// <summary>
        /// Indica si el usuario está autenticado.
        /// </summary>
        public bool IsAuthenticated;

        private CrowdSolveContext _CrowdSolveContext;

        /// <summary>
        /// Constructor de la clase AuthorizeByPermission.
        /// </summary>
        /// <param name="permisos">Los permisos requeridos para acceder al recurso.</param>
        public AuthorizeByPermission(params PermisosEnum[] permisos)
        {
            Permisos = permisos;
        }

        /// <summary>
        /// Método que se ejecuta durante la autorización y verifica si el usuario está autorizado para acceder al recurso.
        /// </summary>
        /// <param name="context">El contexto de autorización.</param>
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            if (!IsAuthorized(context)) HandleUnauthorizedRequest(context);
        }

        /// <summary>
        /// Verifica si el usuario está autorizado para acceder al recurso.
        /// </summary>
        /// <param name="context">El contexto de autorización.</param>
        /// <returns>True si el usuario está autorizado, False en caso contrario.</returns>
        private bool IsAuthorized(AuthorizationFilterContext context)
        {
            if (context != null)
            {
                var User = context.HttpContext?.User;

                if (User == null || !User.Identity.IsAuthenticated)
                {
                    IsAuthenticated = false;
                    return false;
                }

                IsAuthenticated = true;

                if (AllowAnyRole) return true;

                var configuration = context?.HttpContext?.RequestServices.GetService<IConfiguration>();
                var connectionString = configuration?.GetConnectionString("CrowdSolve");

                var contextOptions = new DbContextOptionsBuilder<CrowdSolveContext>().UseSqlServer(connectionString).Options;

                _CrowdSolveContext = new CrowdSolveContext(contextOptions);

                int idUsuario = Convert.ToInt32(User.Claims.FirstOrDefault(c => c.Type == "idUsuario")?.Value);

                using (PerfilesRepo PR = new PerfilesRepo(_CrowdSolveContext))
                {
                    return PR.CanAccess(idUsuario, Permisos.Select(a => (int)a).ToArray());
                }
            }
            return false;
        }

        /// <summary>
        /// Maneja las solicitudes no autorizadas.
        /// </summary>
        /// <param name="context">El contexto de autorización.</param>
        private void HandleUnauthorizedRequest(AuthorizationFilterContext context)
        {
            if (context != null)
            {
                var User = context.HttpContext?.User;

                if (User == null || !User.Identity.IsAuthenticated)
                {
                    context.Result = new UnauthorizedResult();
                }
                else
                {
                    context.Result = new ForbidResult();
                }
            }
        }
    }

}
