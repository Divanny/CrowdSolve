using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Infraestructure;
using CrowdSolve.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CrowdSolve.Server.Repositories
{
    public class NotificacionesRepo : Repository<Notificaciones, NotificacionesModel>
    {
        public NotificacionesRepo(DbContext dbContext) : base
        (
            dbContext,
            new ObjectsMapper<NotificacionesModel, Notificaciones>(n => new Notificaciones()
            {
                idNotificacion = n.idNotificacion,
                idUsuario = n.idUsuario,
                Titulo = n.Titulo,
                Mensaje = n.Mensaje,
                idProceso = n.idProceso,
                Fecha = n.Fecha,
                UrlRedireccion = n.UrlRedireccion,
                Leido = n.Leido,
                Icono = n.Icono,
                Severidad = n.Severidad
            }),
            (DB, filter) =>
            {
                return (from n in DB.Set<Notificaciones>().Where(filter)
                        join u in DB.Set<Usuarios>() on n.idUsuario equals u.idUsuario
                        join p in DB.Set<Procesos>() on n.idProceso equals p.idProceso into pJoin
                        from p in pJoin.DefaultIfEmpty()
                        select new NotificacionesModel()
                        {
                            idNotificacion = n.idNotificacion,
                            idUsuario = n.idUsuario,
                            NombreUsuario = u.NombreUsuario,
                            Titulo = n.Titulo,
                            Mensaje = n.Mensaje,
                            idProceso = n.idProceso,
                            Severidad = n.Severidad,
                            Icono = n.Icono,
                            Fecha = n.Fecha,
                            UrlRedireccion = n.UrlRedireccion,
                            Leido = n.Leido
                        });
            }
        )
        {

        }

        public List<NotificacionesModel> GetNotificacionesUsuario(int idUsuario)
        {
            return this.Get(x => x.idUsuario == idUsuario).ToList();
        }

        public void EnviarNotificacion(int idUsuario, string titulo, string mensaje, int? idProceso = null, string? urlRedireccion = null)
        {
            string? icono = null;
            string? severidad = null;
            var proceso = this.dbContext.Set<Procesos>().Find(idProceso);

            if (proceso != null)
            {
                var estatusProceso = this.dbContext.Set<EstatusProceso>().Find(proceso.idEstatusProceso);

                icono = (estatusProceso != null) ? estatusProceso.ClaseIcono : null;
                severidad = (estatusProceso != null) ? estatusProceso.Severidad : null;
            }

            var notificacion = new NotificacionesModel
            {
                idUsuario = idUsuario,
                Titulo = titulo,
                Mensaje = mensaje,
                idProceso = idProceso,
                Fecha = DateTime.Now,
                UrlRedireccion = urlRedireccion,
                Leido = false,
                Icono = icono,
                Severidad = severidad
            };

            this.Add(notificacion);
        }
    }
}
