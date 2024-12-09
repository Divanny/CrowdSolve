using CrowdSolve.Server.Controllers;
using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Enums;
using CrowdSolve.Server.Infraestructure;
using CrowdSolve.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.Internal;
using System.Numerics;

namespace CrowdSolve.Server.Repositories.Autenticación
{
    public class DesafiosRepo : Repository<Desafios, DesafiosModel>
    {
        public ProcesosRepo procesosRepo;
        public ProcesosRepo procesosRepoProcesoEvaluacion;
        public UsuariosRepo usuariosRepo;
        public int _idUsuarioEnLinea;
        public DesafiosRepo(DbContext dbContext, int idUsuarioEnLinea) : base
        (
            dbContext,
            new ObjectsMapper<DesafiosModel, Desafios>(d => new Desafios()
            {
                idDesafio = d.idDesafio,
                idEmpresa = d.idEmpresa,
                Titulo = d.Titulo,
                Contenido = d.Contenido,
                FechaRegistro = d.FechaRegistro ?? DateTime.Now,
                FechaInicio = d.FechaInicio,
                FechaLimite = d.FechaLimite
            }),
            (DB, filter) =>
            {
                return (from d in DB.Set<Desafios>().Where(filter)
                        join empresa in DB.Set<Empresas>() on d.idEmpresa equals empresa.idEmpresa
                        join usuario in DB.Set<Usuarios>() on empresa.idUsuario equals usuario.idUsuario
                        join proceso in DB.Set<Procesos>() on d.idDesafio equals proceso.idRelacionado
                        where proceso.idClaseProceso == (int)ClasesProcesoEnum.Desafío
                        join estatusProceso in DB.Set<EstatusProceso>() on proceso.idEstatusProceso equals estatusProceso.idEstatusProceso

                        select new DesafiosModel()
                        {
                            idDesafio = d.idDesafio,
                            idUsuarioEmpresa = usuario.idUsuario,
                            idEmpresa = d.idEmpresa,
                            Empresa = empresa.Nombre,
                            Titulo = d.Titulo,
                            Contenido = d.Contenido,
                            FechaInicio = d.FechaInicio,
                            FechaLimite = d.FechaLimite,
                            FechaRegistro = d.FechaRegistro,
                            idProceso = proceso.idProceso,
                            idEstatusDesafio = estatusProceso.idEstatusProceso,
                            EstatusDesafio = estatusProceso.Nombre,
                            SeveridadEstatusDesafio = estatusProceso.Severidad,
                            IconoEstatusDesafio = estatusProceso.ClaseIcono,
                            Participaciones = DB.Set<Soluciones>().Count(x => x.idDesafio == d.idDesafio)
                        });
            }
        )
        {
            procesosRepo = new ProcesosRepo(ClasesProcesoEnum.Desafío, dbContext, idUsuarioEnLinea);
            procesosRepoProcesoEvaluacion = new ProcesosRepo(ClasesProcesoEnum.Proceso_de_Evaluación, dbContext, idUsuarioEnLinea);
            usuariosRepo = new UsuariosRepo(dbContext);
            _idUsuarioEnLinea = idUsuarioEnLinea;
        }
        public override Desafios Add(DesafiosModel model)
        {
            using (var trx = dbContext.Database.BeginTransaction())
            {
                try
                {
                    model.FechaRegistro = DateTime.Now;
                    var creado = base.Add(model);

                    ProcesosModel procesoModel = new ProcesosModel
                    {
                        idEstatusProceso = (int)EstatusProcesoEnum.Desafío_Sin_validar,
                        idUsuario = _idUsuarioEnLinea,
                        idRelacionado = creado.idDesafio,
                    };
                    procesosRepo.Add(procesoModel);

                    if (model.Categorias != null && model.Categorias.Count > 0)
                    {
                        foreach (var categoria in model.Categorias)
                        {
                            dbContext.Set<DesafiosCategoria>().Add(new DesafiosCategoria
                            {
                                idDesafio = creado.idDesafio,
                                idCategoria = categoria.idCategoria
                            });

                            dbContext.SaveChanges();
                        }
                    }

                    if (model.ProcesoEvaluacion != null && model.ProcesoEvaluacion.Count > 0)
                    {
                        foreach (var procesoEvaluacion in model.ProcesoEvaluacion)
                        {
                            procesoEvaluacion.idDesafio = creado.idDesafio;
                            procesoEvaluacion.idProcesoEvaluacion = 0;
                            var procesoEvaluacionCreado = dbContext.Set<ProcesoEvaluacion>().Add(procesoEvaluacion);

                            dbContext.SaveChanges();

                            int procesoEvaluacionId = procesoEvaluacionCreado.Entity.idProcesoEvaluacion;

                            ProcesosModel procesoModelEvaluacion = new ProcesosModel
                            {
                                idEstatusProceso = (int)EstatusProcesoEnum.Proceso_de_Evaluación_No_iniciado,
                                idUsuario = _idUsuarioEnLinea,
                                idRelacionado = procesoEvaluacionId,
                            };

                            procesosRepoProcesoEvaluacion.Add(procesoModelEvaluacion);
                        }
                    }

                    trx.Commit();
                    return creado;
                }
                catch (Exception)
                {
                    trx.Rollback();
                    throw;
                }
            }
        }

        public override void Edit(DesafiosModel model)
        {
            using (var trx = dbContext.Database.BeginTransaction())
            {
                try
                {
                    var desafio = this.Get(x => x.idDesafio == model.idDesafio).FirstOrDefault();
                    base.Edit(model);

                    if (model.Categorias != null && model.Categorias.Count > 0)
                    {
                        var desafioCategorias = dbContext.Set<DesafiosCategoria>().Where(x => x.idDesafio == model.idDesafio).ToList();
                        dbContext.Set<DesafiosCategoria>().RemoveRange(desafioCategorias);
                        dbContext.SaveChanges();

                        foreach (var categoria in model.Categorias)
                        {
                            dbContext.Set<DesafiosCategoria>().Add(new DesafiosCategoria
                            {
                                idDesafio = model.idDesafio,
                                idCategoria = categoria.idCategoria
                            });

                            dbContext.SaveChanges();
                        }
                    }

                    if (model.ProcesoEvaluacion != null && model.ProcesoEvaluacion.Count > 0)
                    {
                        var procesoEvaluacionDesafio = dbContext.Set<ProcesoEvaluacion>().Where(x => x.idDesafio == model.idDesafio).ToList();
                        dbContext.Set<ProcesoEvaluacion>().RemoveRange(procesoEvaluacionDesafio);
                        dbContext.SaveChanges();

                        foreach (var idProceso in procesoEvaluacionDesafio)
                        {
                            var proceso = procesosRepoProcesoEvaluacion.Get(x => x.idRelacionado == idProceso.idProcesoEvaluacion).FirstOrDefault();

                            if (proceso != null)
                            {
                                procesosRepoProcesoEvaluacion.Delete(proceso.idProceso);
                            }
                        }

                        foreach (var procesoEvaluacion in model.ProcesoEvaluacion)
                        {
                            procesoEvaluacion.idDesafio = model.idDesafio;
                            procesoEvaluacion.idProcesoEvaluacion = 0;
                            var procesoEvaluacionCreado = dbContext.Set<ProcesoEvaluacion>().Add(procesoEvaluacion);

                            dbContext.SaveChanges();

                            int procesoEvaluacionId = procesoEvaluacionCreado.Entity.idProcesoEvaluacion;

                            ProcesosModel procesoModelEvaluacion = new ProcesosModel
                            {
                                idEstatusProceso = (int)EstatusProcesoEnum.Proceso_de_Evaluación_No_iniciado,
                                idUsuario = _idUsuarioEnLinea,
                                idRelacionado = procesoEvaluacionId,
                            };

                            procesosRepoProcesoEvaluacion.Add(procesoModelEvaluacion);
                        }
                    }

                    trx.Commit();
                }
                catch (Exception)
                {
                    trx.Rollback();
                    throw;
                }
            }
        }

        public void ValidarDesafio(int idDesafio)
        {
            procesosRepo.CambiarEstatusProceso(idDesafio, new ProcesosModel(EstatusProcesoEnum.Desafío_Sin_iniciar));
        }

        public void RechazarDesafio(int idDesafio, string motivo)
        {
            procesosRepo.CambiarEstatusProceso(idDesafio, new ProcesosModel(EstatusProcesoEnum.Desafío_Rechazado, motivo));
        }

        public void DescartarDesafio(int idDesafio, string motivo)
        {
            procesosRepo.CambiarEstatusProceso(idDesafio, new ProcesosModel(EstatusProcesoEnum.Desafío_Descartado, motivo));
        }

        public OperationResult ValidarUsuarioPuedeEvaluar(int idDesafio, int idUsuario)
        {
            var desafio = this.Get(x => x.idDesafio == idDesafio).FirstOrDefault();
            if (desafio == null) return new OperationResult(false, "Este desafío no se ha encontrado");

            if (desafio.idEstatusDesafio != (int)EstatusProcesoEnum.Desafío_En_evaluación) return new OperationResult(false, "Este desafío no está en proceso de evaluación");

            var procesoEvaluacion = this.GetProcesoEvaluacionDesafio(idDesafio);
            if (procesoEvaluacion == null || procesoEvaluacion.Count == 0) return new OperationResult(false, "No se ha encontrado información del proceso de evaluación del desafío");

            var procesoEvaluacionActual = procesoEvaluacion.OrderBy(x => x.FechaFinalizacion).FirstOrDefault(x => x.FechaFinalizacion >= DateTime.Now);
            if (procesoEvaluacionActual == null) return new OperationResult(false, "No se ha encontrado información del proceso de evaluación actual");

            var usuario = usuariosRepo.Get(idUsuario);
            if (usuario == null) return new OperationResult(false, "Este usuario no se ha encontrado");

            if (procesoEvaluacionActual.idTipoEvaluacion == (int)TiposEvaluacionEnum.Evaluación_de_la_Empresa && desafio.idUsuarioEmpresa != idUsuario) return new OperationResult(false, "Este usuario no tiene permiso para evaluar este desafío");

            if (procesoEvaluacionActual.idTipoEvaluacion == (int)TiposEvaluacionEnum.Voto_de_Participantes_del_Desafío && !dbContext.Set<Soluciones>().Any(x => x.idUsuario == idUsuario && x.idDesafio == idDesafio)) return new OperationResult(false, "Este usuario no ha participado en este desafío para evaluar");

            if (procesoEvaluacionActual.idTipoEvaluacion == (int)TiposEvaluacionEnum.Voto_de_Comunidad && dbContext.Set<Soluciones>().Any(x => x.idUsuario == idUsuario && x.idDesafio == idDesafio)) return new OperationResult(false, "Este usuario ha participado en este desafío, solo usuarios de la comunidad externos a participantes");

            return new OperationResult(true, "Puede evaluar el desafío");
        }

        public List<SolucionesModel> GetRanking(int idDesafio)
        {
            var desafio = this.Get(x => x.idDesafio == idDesafio).FirstOrDefault();
            if (desafio == null) return new List<SolucionesModel>();

            var procesoEvaluacion = this.GetProcesoEvaluacionDesafio(idDesafio);
            if (procesoEvaluacion == null || procesoEvaluacion.Count == 0) return new List<SolucionesModel>();

            SolucionesRepo solucionesRepo = new SolucionesRepo(dbContext, _idUsuarioEnLinea);
            var solucionesDesafio = solucionesRepo.Get(x => x.idDesafio == idDesafio).ToList();
            List<int> idsUsuariosParticipantesDesafio = solucionesDesafio.Select(x => x.idUsuario).ToList();

            foreach (var solucion in solucionesDesafio)
            {
                if (procesoEvaluacion.Any(x => x.idTipoEvaluacion == (int)TiposEvaluacionEnum.Voto_de_Comunidad))
                {
                    solucion.CantidadVotosComunidad = dbContext.Set<VotosUsuarios>().Count(x => x.idSolucion == solucion.idSolucion && !idsUsuariosParticipantesDesafio.Contains(x.idUsuario));
                }

                if (procesoEvaluacion.Any(x => x.idTipoEvaluacion == (int)TiposEvaluacionEnum.Voto_de_Participantes_del_Desafío))
                {
                    solucion.CantidadVotosParticipantes = dbContext.Set<VotosUsuarios>().Count(x => x.idSolucion == solucion.idSolucion && idsUsuariosParticipantesDesafio.Contains(x.idUsuario));
                }

                int puntuacionEmpresa = solucion.Puntuacion ?? 0;
                int puntuacionComunidad = solucion.CantidadVotosComunidad ?? 0;
                int puntuacionParticipantes = solucion.CantidadVotosParticipantes ?? 0;

                int ponderacionEmpresa = 70, ponderacionComunidad = 20, ponderacionParticipantes = 10;

                int ponderacionPuntuacionFinal = (int)(
                    (puntuacionEmpresa * (ponderacionEmpresa / 100.0)) +
                    (puntuacionComunidad * (ponderacionComunidad / 100.0)) +
                    (puntuacionParticipantes * (ponderacionParticipantes / 100.0))
                );

                int puntuacionMaxima = 0;

                if (procesoEvaluacion.Any(x => x.idTipoEvaluacion == (int)TiposEvaluacionEnum.Voto_de_Comunidad)) puntuacionMaxima += ponderacionComunidad;
                else solucion.CantidadVotosComunidad = null;

                if (procesoEvaluacion.Any(x => x.idTipoEvaluacion == (int)TiposEvaluacionEnum.Voto_de_Participantes_del_Desafío)) puntuacionMaxima += ponderacionParticipantes;
                else solucion.CantidadVotosParticipantes = null;

                if (procesoEvaluacion.Any(x => x.idTipoEvaluacion == (int)TiposEvaluacionEnum.Evaluación_de_la_Empresa)) puntuacionMaxima += ponderacionEmpresa;
                else solucion.Puntuacion = null;

                solucion.PuntuacionFinal = ponderacionPuntuacionFinal;
                solucion.PuntuacionMaxima = puntuacionMaxima;
            }

            return solucionesDesafio.OrderByDescending(x => x.PuntuacionFinal).ToList();
        }

        public IEnumerable<Categorias> GetCategorias()
        {
            return dbContext.Set<Categorias>().ToList();
        }

        public List<ProcesoEvaluacion> GetProcesosEvaluacion()
        {
            var procesosEvaluacion = dbContext.Set<ProcesoEvaluacion>().ToList();
            return procesosEvaluacion;
        }

        public List<TiposEvaluacion> GetTiposEvaluacion()
        {
            var tiposEvaluacion = dbContext.Set<TiposEvaluacion>().ToList();
            return tiposEvaluacion;
        }

        public List<ProcesoEvaluacion> GetProcesoEvaluacionDesafio(int idDesafio)
        {
            var procesoEvaluacion = dbContext.Set<ProcesoEvaluacion>().Where(x => x.idDesafio == idDesafio).ToList();
            return procesoEvaluacion;
        }

        public List<DesafiosModel> GetDesafiosValidados(Func<Desafios, bool>? filter = null)
        {
            List<int> estatusProcesoEnums = new List<int>
            {
                #warning Quitar este estatus luego de hacer el crud de validación de desafío
                (int)EstatusProcesoEnum.Desafío_Sin_iniciar,
                (int)EstatusProcesoEnum.Desafío_En_progreso,
                (int)EstatusProcesoEnum.Desafío_En_evaluación,
                (int)EstatusProcesoEnum.Desafío_En_espera_de_entrega_de_premios,
                (int)EstatusProcesoEnum.Desafío_Finalizado
            };

            var idRelacionados = procesosRepo.Get(x => estatusProcesoEnums.Contains(x.idEstatusProceso)).Select(x => x.idRelacionado).ToList();
            var desafios = filter != null ? this.Get(x => idRelacionados.Contains(x.idDesafio) && filter(x)).ToList() : this.Get(x => idRelacionados.Contains(x.idDesafio)).ToList();
            return desafios;
        }

        public List<DesafiosModel> GetDesafiosEnProgreso()
        {
            var idRelacionados = procesosRepo.Get(x => x.idEstatusProceso == (int)EstatusProcesoEnum.Desafío_En_progreso).Select(x => x.idRelacionado).ToList();
            var desafios = this.Get(x => idRelacionados.Contains(x.idDesafio)).ToList();
            return desafios;
        }

        public List<DesafiosModel> GetDesafiosSinValidar()
        {
            var idRelacionados = procesosRepo.Get(x => x.idEstatusProceso == (int)EstatusProcesoEnum.Desafío_Sin_validar).Select(x => x.idRelacionado).ToList();
            var desafios = this.Get(x => idRelacionados.Contains(x.idDesafio)).ToList();
            return desafios;
        }

        public List<EstatusProceso> GetEstatusDesafios()
        {
            var estatusesProceso = procesosRepo.GetEstatusProceso().ToList();
            return estatusesProceso;
        }

        public int GetCantidadSolucionesPendientesDesafio(int idDesafio)
        {
            int solucionesPendientes = (
                from s in dbContext.Set<Soluciones>()
                join p in dbContext.Set<Procesos>() on s.idSolucion equals p.idRelacionado
                where p.idClaseProceso == (int)ClasesProcesoEnum.Solución && p.idEstatusProceso == (int)EstatusProcesoEnum.Solución_Enviada && s.idDesafio == idDesafio
                select s
            ).Count();

            return solucionesPendientes;
        }

        public void CambiarEstatus(int idDesafio, EstatusProcesoEnum estatus, string? motivo)
        {
            if (motivo == null)
            {
                procesosRepo.CambiarEstatusProceso(idDesafio, new ProcesosModel(estatus));
            }
            else
            {
                procesosRepo.CambiarEstatusProceso(idDesafio, new ProcesosModel(estatus, motivo));
            }
        }
    }
}
