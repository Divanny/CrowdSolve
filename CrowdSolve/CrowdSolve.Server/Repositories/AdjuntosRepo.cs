using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Infraestructure;
using CrowdSolve.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CrowdSolve.Server.Repositories
{
    public class AdjuntosRepo : Repository<Adjuntos, AdjuntosModel>
    {
        public AdjuntosRepo(DbContext dbContext) : base
        (
            dbContext,
            new ObjectsMapper<AdjuntosModel, Adjuntos>(a => new Adjuntos()
            {
                idAdjunto = a.idAdjunto,
                idProceso = a.idProceso,
                Nombre = a.Nombre,
                idUsuario = a.idUsuario,
                Tamaño = a.Tamaño,
                ContentType = a.ContentType,
                FechaSubida = a.FechaSubida,
                RutaArchivo = a.RutaArchivo
            }),
            (DB, filter) =>
            {
                return (from a in DB.Set<Adjuntos>().Where(filter)
                        join u in DB.Set<Usuarios>() on a.idUsuario equals u.idUsuario
                        select new AdjuntosModel()
                        {
                            idAdjunto = a.idAdjunto,
                            idProceso = a.idProceso,
                            Nombre = a.Nombre,
                            idUsuario = a.idUsuario,
                            Tamaño = a.Tamaño,
                            ContentType = a.ContentType,
                            FechaSubida = a.FechaSubida,
                            RutaArchivo = a.RutaArchivo,
                            NombreUsuario = u.NombreUsuario
                        });
            }
        )
        {

        }
    }
}
