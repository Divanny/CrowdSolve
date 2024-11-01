using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Enums;
using CrowdSolve.Server.Infraestructure;
using CrowdSolve.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CrowdSolve.Server.Repositories.Autenticación
{
    public class SoportesRepo : Repository<Soportes, SoportesModel>
    {
        public ProcesosRepo procesosRepo;
        public SoportesRepo(DbContext dbContext, int idUsuarioEnLinea) : base
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
            procesosRepo = new ProcesosRepo(ClasesProcesoEnum.Soporte, dbContext, idUsuarioEnLinea);
        }
        public override Soportes Add(SoportesModel model)
        {
            using (var trx = dbContext.Database.BeginTransaction())
            {
                try
                {
                    model.Fecha = DateTime.Now;
                    var creado = base.Add(model);

                    ProcesosModel procesoModel = new ProcesosModel
                    {
                        idEstatusProceso = (int)EstatusProcesoEnum.Soporte_Enviada,
                        idUsuario = model.idUsuario ?? 0,
                        idRelacionado = creado.idSoporte,                        
                    };
                    procesosRepo.Add(procesoModel);

                    trx.Commit();
                    return creado;
                }
                catch (Exception ex)
                {
                    trx.Rollback();
                    throw ex;
                }
            }
        }
    }
  
}
