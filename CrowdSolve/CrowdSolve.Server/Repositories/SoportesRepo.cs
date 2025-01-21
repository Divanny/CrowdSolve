using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Enums;
using CrowdSolve.Server.Infraestructure;
using CrowdSolve.Server.Models;
using CrowdSolve.Server.Services;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace CrowdSolve.Server.Repositories.Autenticación
{
    public class SoportesRepo : Repository<Soportes, SoportesModel>
    {
        public ProcesosRepo procesosRepo;
        private readonly FirebaseTranslationService _translationService;
        private readonly string _idioma;
        public SoportesRepo(DbContext dbContext, int idUsuarioEnLinea, FirebaseTranslationService? translationService = null, string? idioma = null) : base
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
                        join procesosSet in DB.Set<Procesos>().Where(p => p.idClaseProceso == (int)ClasesProcesoEnum.Soporte) on s.idSoporte equals procesosSet.idRelacionado into pLF
                        from p in pLF.DefaultIfEmpty()
                        join estatusProcesosSet in DB.Set<EstatusProceso>() on p.idEstatusProceso equals estatusProcesosSet.idEstatusProceso into epLF
                        from ep in epLF.DefaultIfEmpty()
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
                            CorreoElectronico = (u == null) ? s.CorreoElectronico : u.CorreoElectronico,
                            idUsuarioAsignado = p != null ? p.idUsuarioAsignado : null,
                            NombreAsignado = p != null ? DB.Set<Usuarios>().Where(x => x.idUsuario == p.idUsuarioAsignado).Select(x => x.NombreUsuario).FirstOrDefault() : null,
                            AsignadoAMi = idUsuarioEnLinea == (p != null ? p.idUsuarioAsignado : null),
                            idEstatusProceso = p != null ? p.idEstatusProceso : null,
                            EstatusProcesoNombre=p!=null? ep.Nombre:null,
                            Severidad= p != null ? ep.Severidad : null,
                            ClaseProcesoIcono=p!=null?ep.ClaseIcono : null,

                        })
                        .OrderBy(p => p.idEstatusProceso == (int)EstatusProcesoEnum.Soporte_Enviada ? 0 
                        : p.idEstatusProceso == (int)EstatusProcesoEnum.Soporte_En_progreso ? 1
                        : p.idEstatusProceso == (int)EstatusProcesoEnum.Soporte_Finalizada ? 2 : 3)
                        .ThenByDescending(p => p.Fecha);

            }
        )
        {
            procesosRepo = new ProcesosRepo(ClasesProcesoEnum.Soporte, dbContext, idUsuarioEnLinea, _translationService, _idioma);
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
