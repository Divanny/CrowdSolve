using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Infraestructure;
using CrowdSolve.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CrowdSolve.Server.Repositories.Autenticación
{
    public class IdentificacionesRepo : Repository<Identificaciones, IdentificacionesModel>
    {
        public IdentificacionesRepo(DbContext dbContext) : base
        (
            dbContext,
            new ObjectsMapper<IdentificacionesModel, Identificaciones>(i => new Identificaciones()
            {
                idIdentificacion = i.idIdentificacion,
                idTipoIdentificacion = i.idTipoIdentificacion,
                idUsuario = i.idUsuario,
                Valor = i.Valor
            }),
            (DB, filter) =>
            {
                return (from i in DB.Set<Identificaciones>().Where(filter)
                        join u in DB.Set<Usuarios>() on i.idUsuario equals u.idUsuario
                        join t in DB.Set<TiposIdentificacion>() on i.idTipoIdentificacion equals t.idTipoIdentificacion
                        select new IdentificacionesModel()
                        {
                            idIdentificacion = i.idIdentificacion,
                            idUsuario = u.idUsuario,
                            NombreUsuario = u.NombreUsuario,
                            idTipoIdentificacion = t.idTipoIdentificacion,
                            NombreTipoIdentificacion = t.Nombre,
                            Valor = i.Valor
                        });
            }
        )
        {

        }
    }
}
