using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Enums;
using CrowdSolve.Server.Infraestructure;
using CrowdSolve.Server.Models;
using CrowdSolve.Server.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace CrowdSolve.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificacionesController : Controller
    {
        private readonly NotificacionesRepo _notificacionesRepo;
        private readonly int _idUsuarioOnline;

        /// <summary>
        /// Constructor de la clase.
        /// </summary>
        /// <param name="userAccessor">Accesor de usuario.</param>
        /// <param name="crowdSolveContext">Contexto de CrowdSolve.</param>
        /// <returns>Una nueva instancia de la clase <see cref="NotificacionesController"/>.</returns>
        public NotificacionesController(IUserAccessor userAccessor, CrowdSolveContext crowdSolveContext)
        {
            _idUsuarioOnline = userAccessor.idUsuario;
            _notificacionesRepo = new NotificacionesRepo(crowdSolveContext);
        }

        /// <summary>
        /// Obtiene las notificaciones del usuario en línea.
        /// </summary>
        /// <returns>Lista de notificaciones.</returns>
        [HttpGet("MisNotificaciones", Name = "GetMisNotificaciones")]
        [AuthorizeByPermission(PermisosEnum.Notificaciones)]
        public List<NotificacionesModel> GetMisNotificaciones()
        {
            return _notificacionesRepo.GetNotificacionesUsuario(_idUsuarioOnline);
        }

        /// <summary>
        /// Obtiene el conteo de notificaciones no leídas del usuario en línea.
        /// </summary>
        /// <returns>Conteo de notificaciones no leídas.</returns>
        [HttpGet("Count", Name = "GetNotificationCount")]
        [AuthorizeByPermission(PermisosEnum.Notificaciones)]
        public ActionResult<int> GetNotificationCount()
        {
            try
            {
                var count = _notificacionesRepo.Get(x => x.idUsuario == _idUsuarioOnline && !x.Leido).Count();
                return Ok(new { count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Marca notificaciones como leídas.
        /// </summary>
        /// <param name="ids">Identificadores de las notificaciones.</param>
        /// <returns>Resultado de la operación.</returns>
        [HttpPut("MarcarLeido", Name = "MarcarLeido")]
        [AuthorizeByPermission(PermisosEnum.Notificaciones)]
        public OperationResult MarcarLeido([FromBody] List<int> ids)
        {
            try
            {
                if (ids == null || !ids.Any()) return new OperationResult(false, "No se proporcionaron identificadores de notificaciones.");

                var notificaciones = _notificacionesRepo.Get(x => ids.Contains(x.idNotificacion) && x.idUsuario == _idUsuarioOnline).ToList();
                if (!notificaciones.Any()) return new OperationResult(false, "No se encontraron notificaciones.");

                CambiarLeido(notificaciones, true);
                return new OperationResult(true, "Notificaciones marcadas como leídas.");
            }
            catch (Exception ex)
            {
                return new OperationResult(false, ex.Message);
            }
        }

        /// <summary>
        /// Marca todas las notificaciones como leídas.
        /// </summary>
        /// <returns>Resultado de la operación.</returns>
        [HttpPut("MarcarTodasLeidas", Name = "MarcarTodasLeidas")]
        [AuthorizeByPermission(PermisosEnum.Notificaciones)]
        public OperationResult MarcarTodasLeidas()
        {
            try
            {
                var notificaciones = _notificacionesRepo.Get(x => x.idUsuario == _idUsuarioOnline && x.Leido == false).ToList();
                CambiarLeido(notificaciones, true);

                return new OperationResult(true, "Notificaciones marcadas como leídas.");
            }
            catch (Exception ex)
            {
                return new OperationResult(false, ex.Message);
            }
        }

        /// <summary>
        /// Marca notificaciones como no leídas.
        /// </summary>
        /// <param name="ids">Identificadores de las notificaciones.</param>
        /// <returns>Resultado de la operación.</returns>
        [HttpPut("MarcarNoLeido", Name = "MarcarNoLeido")]
        [AuthorizeByPermission(PermisosEnum.Notificaciones)]
        public OperationResult MarcarNoLeido([FromBody] List<int> ids)
        {
            try
            {
                if (ids == null || !ids.Any()) return new OperationResult(false, "No se proporcionaron identificadores de notificaciones.");

                var notificaciones = _notificacionesRepo.Get(x => ids.Contains(x.idNotificacion) && x.idUsuario == _idUsuarioOnline).ToList();
                if (!notificaciones.Any()) return new OperationResult(false, "No se encontraron notificaciones.");

                CambiarLeido(notificaciones, false);
                return new OperationResult(true, "Notificaciones marcadas como no leídas.");
            }
            catch (Exception ex)
            {
                return new OperationResult(false, ex.Message);
            }
        }

        /// <summary>
        /// Marca todas las notificaciones como no leídas.
        /// </summary>
        /// <returns>Resultado de la operación.</returns>
        [HttpPut("MarcarTodasNoLeidas", Name = "MarcarTodasNoLeidas")]
        [AuthorizeByPermission(PermisosEnum.Notificaciones)]
        public OperationResult MarcarTodasNoLeidas()
        {
            try
            {
                var notificaciones = _notificacionesRepo.Get(x => x.idUsuario == _idUsuarioOnline && x.Leido == true).ToList();
                CambiarLeido(notificaciones, false);

                return new OperationResult(true, "Notificaciones marcadas como no leídas.");
            }
            catch (Exception ex)
            {
                return new OperationResult(false, ex.Message);
            }
        }

        /// <summary>
        /// Elimina una notificación.
        /// </summary>
        /// <param name="idNotificacion">Identificador de la notificación.</param>.
        /// <returns>Resultado de la operación.</returns>
        [HttpDelete("EliminarNotificacion/{idNotificacion}", Name = "EliminarNotificacion")]
        [AuthorizeByPermission(PermisosEnum.Notificaciones)]
        public OperationResult EliminarNotificacion(int idNotificacion)
        {
            try
            {
                if (idNotificacion <= 0) return new OperationResult(false, "El identificador de la notificación no es válido.");

                var notificacion = _notificacionesRepo.Get(x => x.idNotificacion == idNotificacion && x.idUsuario == _idUsuarioOnline).FirstOrDefault();
                if (notificacion == null) return new OperationResult(false, "No se encontró la notificación.");

                _notificacionesRepo.Delete(notificacion.idNotificacion);
                return new OperationResult(true, "Notificación eliminada.");
            }
            catch (Exception ex)
            {
                return new OperationResult(false, ex.Message);
            }
        }

        private void CambiarLeido(List<NotificacionesModel> notificaciones, bool leido)
        {
            foreach (var notificacion in notificaciones)
            {
                notificacion.Leido = leido;
                _notificacionesRepo.Edit(notificacion);
            }
        }
    }
}