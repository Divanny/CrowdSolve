using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Infraestructure;
using CrowdSolve.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CrowdSolve.Server.Repositories.Autenticación
{
    public class HistorialCambioEstatusRepo : Repository<HistorialCambioEstatus, HistorialCambioEstatusModel>
    {
        public HistorialCambioEstatusRepo(DbContext dbContext) : base
        (
            dbContext,
            new ObjectsMapper<HistorialCambioEstatusModel, HistorialCambioEstatus>(s => new HistorialCambioEstatus()
            {
                idHistorialCambioEstatus = s.idHistorialCambioEstatus,
                idProceso = s.idProceso,
                idEstatusProceso = s.idEstatusProceso,
                idUsuario = s.idUsuario,
                Fecha = s.Fecha,
                MotivoCambioEstatus = s.MotivoCambioEstatus
            }),
            (DB, filter) =>
            {
                return (from s in DB.Set<HistorialCambioEstatus>().Where(filter)
                        join ep in DB.Set<EstatusProceso>() on s.idEstatusProceso equals ep.idEstatusProceso
                        join u in DB.Set<Usuarios>() on s.idUsuario equals u.idUsuario
                        select new HistorialCambioEstatusModel()
                        {
                            idHistorialCambioEstatus = s.idHistorialCambioEstatus,
                            idProceso = s.idProceso,
                            idEstatusProceso = s.idEstatusProceso,
                            EstatusProceso = ep.Nombre,
                            EstatusIcono = ep.ClaseIcono,
                            EstatusColor = ep.Severidad,
                            idUsuario = s.idUsuario,
                            NombreUsuario = u.NombreUsuario,
                            Fecha = s.Fecha,
                            MotivoCambioEstatus = s.MotivoCambioEstatus
                        });
            }
        )
        {

        }
    }
}
