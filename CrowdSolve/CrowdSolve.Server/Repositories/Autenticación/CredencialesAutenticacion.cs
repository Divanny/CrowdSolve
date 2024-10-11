using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Infraestructure;
using CrowdSolve.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CrowdSolve.Server.Repositories.Autenticación
{
    public class CredencialesAutenticacionRepo : Repository<CredencialesAutenticacion, CredencialesAutenticacionModel>
    {
        public CredencialesAutenticacionRepo (DbContext dbContext) : base
        (
            dbContext,
            new ObjectsMapper<CredencialesAutenticacionModel, CredencialesAutenticacion>(c => new CredencialesAutenticacion()
            {
                idCredencial = c.idCredencial,
                idUsuario = c.idUsuario,
                idMetodoAutenticacion = c.idMetodoAutenticacion,
                idExterno = c.idExterno,
                TokenAcceso = c.TokenAcceso
            }),
            (DB, filter) =>
            {
                return (from c in DB.Set<CredencialesAutenticacion>().Where(filter)
                        join metodosAutenticacion in DB.Set<MetodosAutenticacion>() on c.idMetodoAutenticacion equals metodosAutenticacion.idMetodoAutenticacion
                        select new CredencialesAutenticacionModel()
                        {
                            idCredencial = c.idCredencial,
                            idUsuario = c.idUsuario,
                            idMetodoAutenticacion = c.idMetodoAutenticacion,
                            MetodoAutenticacion = metodosAutenticacion.Nombre,
                            idExterno = c.idExterno,
                            TokenAcceso = c.TokenAcceso
                        });
            }
        )
        {

        }
    }
}
