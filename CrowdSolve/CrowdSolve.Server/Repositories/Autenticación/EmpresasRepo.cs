using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Infraestructure;
using CrowdSolve.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CrowdSolve.Server.Repositories.Autenticación
{
    public class EmpresasRepo : Repository<Empresas, EmpresasModel>
    {
        public EmpresasRepo(DbContext dbContext) : base
        (
            dbContext,
            new ObjectsMapper<EmpresasModel, Empresas>(e => new Empresas()
            {
                idEmpresa = e.idEmpresa,
                idUsuario = e.idUsuario,
                Nombre = e.Nombre,
                Telefono = e.Telefono,
                PaginaWeb = e.PaginaWeb,
                idSector = e.idSector,
                idTamañoEmpresa = e.idTamañoEmpresa,
                Direccion = e.Direccion
            }),
            (DB, filter) =>
            {
                return (from e in DB.Set<Empresas>().Where(filter)
                        join TamañosEmpresa in DB.Set<TamañosEmpresa>() on e.idTamañoEmpresa equals TamañosEmpresa.idTamañoEmpresa
                        join Sector in DB.Set<Sectores>() on e.idSector equals Sector.idSector
                        select new EmpresasModel()
                        {
                            idEmpresa = e.idEmpresa,
                            idUsuario = e.idUsuario,
                            Nombre = e.Nombre,
                            Telefono = e.Telefono,
                            Direccion = e.Direccion,
                            PaginaWeb = e.PaginaWeb,
                            idTamañoEmpresa = e.idTamañoEmpresa,
                            TamañoEmpresa = TamañosEmpresa.Nombre,
                            idSector = e.idSector,
                            Sector = Sector.Nombre
                        });
            }
        )
        {

        }
    }
}
