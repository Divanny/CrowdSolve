using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Enums;
using CrowdSolve.Server.Infraestructure;
using CrowdSolve.Server.Models;
using CrowdSolve.Server.Repositories.Autenticación;
using Microsoft.EntityFrameworkCore;

namespace CrowdSolve.Server.Repositories
{
    public class ProcesosRepo : Repository<Procesos, ProcesosModel>
    {
        UsuariosRepo usuariosRepo;
        HistorialCambioEstatusRepo historialCambioEstatusRepo;
        public ClasesProcesoEnum claseProceso { get; set; }
        public int idUsuarioOnline { get; set; }
        public ProcesosRepo(ClasesProcesoEnum ClaseProceso, DbContext dbContext = null, int idUsuarioOnline = 0) : base
        (
            dbContext,
            new ObjectsMapper<ProcesosModel, Procesos>(x => new Procesos()
            {
                idProceso = x.idProceso,
                idUsuario = x.idUsuario,
                idRelacionado = x.idRelacionado,
                idClaseProceso = x.idClaseProceso,
                idEstatusProceso = x.idEstatusProceso,
                idUsuarioAsignado = x.idUsuarioAsignado,
                Fecha = x.Fecha
            }),
            (DB, filter) => from p in DB.Set<Procesos>().Where(cp => ClaseProceso == ClasesProcesoEnum.Todos || cp.idClaseProceso == (int)ClaseProceso).Where(filter)
                            join cp in DB.Set<ClasesProceso>() on p.idClaseProceso equals cp.idClaseProceso
                            join ep in DB.Set<EstatusProceso>() on p.idEstatusProceso equals ep.idEstatusProceso
                            join uaSet in DB.Set<Usuarios>() on p.idUsuarioAsignado equals uaSet.idUsuario into uaLF
                            from ua in uaLF.DefaultIfEmpty()
                            join uSet in DB.Set<Usuarios>() on p.idUsuario equals uSet.idUsuario into uLF
                            from u in uLF.DefaultIfEmpty()
                            select new ProcesosModel()
                            {
                                idProceso = p.idProceso,
                                idUsuario = p.idUsuario,
                                idClaseProceso = p.idClaseProceso,
                                ClaseProceso = cp.Nombre,
                                ClaseProcesoIcono = cp.ClaseIcono,
                                idEstatusProceso = p.idEstatusProceso,
                                EstatusProceso = ep.Nombre,
                                ColorEstatus = ep.Severidad,
                                idUsuarioAsignado = p.idUsuarioAsignado,
                                UsuarioAsignado = ua != null ? ua.NombreUsuario : null,
                                AsignadoAMi = (p.idUsuarioAsignado == idUsuarioOnline) ? true : false,
                                idRelacionado = p.idRelacionado,
                                Fecha = p.Fecha
                            }
        )
        {
            usuariosRepo = new UsuariosRepo(this.dbContext);
            historialCambioEstatusRepo = new HistorialCambioEstatusRepo(this.dbContext);
            this.claseProceso = ClaseProceso;
            this.idUsuarioOnline = idUsuarioOnline;
        }
        public override Procesos Add(ProcesosModel model)
        {
            if (this.claseProceso == ClasesProcesoEnum.Todos) throw new Exception("No puede agregar con la clase de proceso 'Todos'");
            if (model.idRelacionado == 0) throw new Exception($"El '{nameof(model.idRelacionado)}' no ha sido establecido, favor establecer un valor");
            if (model.idEstatusProceso == 0) throw new Exception($"El '{nameof(model.idEstatusProceso)}' no ha sido establecido, favor establecer un valor");

            model.idClaseProceso = (int)claseProceso;
            model.idUsuario = idUsuarioOnline;
            model.Fecha = DateTime.Now;
            var creado = base.Add(model);

            HistorialCambioEstatusModel modelHistEstatus = new HistorialCambioEstatusModel();
            modelHistEstatus.idProceso = creado.idProceso;
            modelHistEstatus.idEstatusProceso = model.idEstatusProceso;
            modelHistEstatus.Fecha = DateTime.Now;
            modelHistEstatus.idUsuario = idUsuarioOnline;
            modelHistEstatus.MotivoCambioEstatus = model.MotivoCambioEstatus;
            historialCambioEstatusRepo.Add(modelHistEstatus);

            return creado;
        }

        public IEnumerable<ClasesProceso> GetClasesProcesos()
        {
            return this.dbContext.Set<ClasesProceso>();
        }
        public IEnumerable<EstatusProceso> GetEstatusProceso()
        {
            return dbContext.Set<EstatusProceso>().Where(x => this.claseProceso == ClasesProcesoEnum.Todos || (int)claseProceso == x.idClaseProceso).ToList();
        }
        public IEnumerable<EstatusProceso> GetEstatusProcesoWithFilter(Func<EstatusProceso, bool> filtro)
        {
            return dbContext.Set<EstatusProceso>().Where(filtro).ToList();
        }
        public ClasesProceso GetClaseProceso()
        {
            return dbContext.Set<ClasesProceso>().Where(x => x.idClaseProceso == (int)this.claseProceso).FirstOrDefault();
        }
        /// <summary>
        /// Cambia el estatus de un proceso
        /// </summary>
        /// <param name="idRelacionado">ID con el que se relaciona el proceso y la entidad que lo generó</param>
        /// <param name="objCambioEstatus">Objeto con la informacion del cambio de estatus (id Estatus, id Motivo CambioEstatus y Comentario)</param>
        public OperationResult CambiarEstatusProceso(int idRelacionado, ProcesosModel objCambioEstatus)
        {
            if (this.claseProceso == ClasesProcesoEnum.Todos) throw new Exception("No puede cambiar estatus proceso con la clase de proceso 'Todos'");

            var model = base.Get(x => x.idRelacionado == idRelacionado).FirstOrDefault();

            if (!String.IsNullOrEmpty(objCambioEstatus.MotivoCambioEstatus))
            {
                objCambioEstatus.MotivoCambioEstatus = objCambioEstatus.MotivoCambioEstatus.Length > 500 ? objCambioEstatus.MotivoCambioEstatus.Substring(0, 500) : objCambioEstatus.MotivoCambioEstatus;
            }

            model.idEstatusProceso = objCambioEstatus.idEstatusProceso;
            model.idUsuarioAsignado = objCambioEstatus.idUsuarioAsignado;
            model.MotivoCambioEstatus = objCambioEstatus.MotivoCambioEstatus;

            base.Edit(model);

            HistorialCambioEstatusModel modelHistEstatus = new HistorialCambioEstatusModel();
            modelHistEstatus.idProceso = model.idProceso;
            modelHistEstatus.idEstatusProceso = objCambioEstatus.idEstatusProceso;
            modelHistEstatus.Fecha = DateTime.Now;
            modelHistEstatus.idUsuario = idUsuarioOnline;
            modelHistEstatus.MotivoCambioEstatus = objCambioEstatus.MotivoCambioEstatus;
            historialCambioEstatusRepo.Add(modelHistEstatus);

            var estatusObj = dbContext.Set<EstatusProceso>().First(x => x.idEstatusProceso == model.idEstatusProceso);

            return new OperationResult(true, $"Éxito al establecer el proceso en estatus \"{estatusObj.Nombre}\"");
        }
        /// <summary>
        /// Cambia el estatus de un proceso y envia una notificacion via correo al destinatario especificado con el asunto especificado y el mensaje especificado
        /// </summary>
        /// <param name="idRelacionado">ID con el que se relaciona el proceso y la entidad que lo generó</param>
        /// <param name="objCambioEstatus">Objeto con la informacion del cambio de estatus (id Estatus, id Motivo CambioEstatus y Comentario)</param>
        /// <param name="Destinatarios"></param>
        /// <param name="Asunto"></param>
        /// <param name="mensaje"></param>
        public OperationResult CambiarEstatusProceso(int idRelacionado, ProcesosModel objCambioEstatus, string[] Destinatarios, string Asunto, string mensaje)
        {
            var result = CambiarEstatusProceso(idRelacionado, objCambioEstatus);
            ClasesProceso clase = this.GetClaseProceso();

            // enviar correo
            throw new NotImplementedException();
        }

        public int BuscarAsignadoA(int idProceso)
        {
            var proceso = base.Get(x => x.idProceso == idProceso).FirstOrDefault();
            if (proceso.idUsuarioAsignado != null)
            {
                return (int)proceso.idUsuarioAsignado;
            }
            else
            {
                return 0;
            }
        }

        public void AsignarProceso(int idProceso, int idUsuario)
        {
            var proceso = base.Get(x => x.idProceso == idProceso).FirstOrDefault();
            proceso.idUsuarioAsignado = idUsuario;
            base.Edit(proceso, proceso.idProceso);
        }
    }
}
