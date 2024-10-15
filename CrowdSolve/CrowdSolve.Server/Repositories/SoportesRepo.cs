using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Infraestructure;
using CrowdSolve.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CrowdSolve.Server.Repositories.Autenticación
{
    public class SoportesRepo : Repository<Soportes, SoportesModel>
    {
        public SoportesRepo(DbContext dbContext) : base
        (
            dbContext,
            new ObjectsMapper<SoportesModel, Soportes>(s => new Soportes()
            {
                idSoporte = s.idSoporte,
                idUsuario = s.idUsuario,
                Titulo = s.Titulo,
                Mensaje = s.Mensaje,
                Fecha = s.Fecha,
                Nombres = s.Nombres,
                Apellidos = s.Apellidos,
                CorreoElectronico = s.CorreoElectronico
            }),
            (DB, filter) =>
            {
                return (from s in DB.Set<Soportes>().Where(filter)
                        join usuariosSet in DB.Set<Usuarios>() on s.idUsuario equals usuariosSet.idUsuario into uLF
                        from u in uLF.DefaultIfEmpty()
                        select new SoportesModel()
                        {
                            idSoporte = s.idSoporte,
                            idUsuario = s.idUsuario,
                            NombreUsuario = (u == null) ? null : u.NombreUsuario,
                            Titulo = s.Titulo,
                            Mensaje = s.Mensaje,
                            Fecha = s.Fecha,
                            Nombres = s.Nombres,
                            Apellidos = s.Apellidos,
                            CorreoElectronico = (u == null) ? s.CorreoElectronico : u.CorreoElectronico
                        });
            }
        )
        {

        }
    }
}
