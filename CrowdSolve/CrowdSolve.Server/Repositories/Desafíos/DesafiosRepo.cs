using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Enums;
using CrowdSolve.Server.Infraestructure;
using CrowdSolve.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CrowdSolve.Server.Repositories.Autenticación
{
    public class DesafiosRepo : Repository<Desafios, DesafiosModel>
    {
        public ProcesosRepo procesosRepo;
        public ProcesosRepo procesosRepoProcesoEvaluacion;
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
                        join proceso in DB.Set<Procesos>() on d.idDesafio equals proceso.idRelacionado where proceso.idClaseProceso == (int)ClasesProcesoEnum.Desafío
                        join estatusProceso in DB.Set<EstatusProceso>() on proceso.idEstatusProceso equals estatusProceso.idEstatusProceso
                        join categorias in DB.Set<DesafiosCategoria>() on d.idDesafio equals categorias.idDesafio into cLF
                        from c in cLF.DefaultIfEmpty()
                        join procesosEvaluacion in DB.Set<ProcesoEvaluacion>() on d.idDesafio equals procesosEvaluacion.idDesafio into peLF
                        from pe in peLF.DefaultIfEmpty()

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
                            Categorias = cLF.ToList(),
                            ProcesoEvaluacion = peLF.ToList(),
                            idEstatusDesafio = estatusProceso.idEstatusProceso,
                            EstatusDesafio = estatusProceso.Nombre
                        });
            }
        )
        {
            procesosRepo = new ProcesosRepo(ClasesProcesoEnum.Desafío, dbContext, idUsuarioEnLinea);
            procesosRepoProcesoEvaluacion = new ProcesosRepo(ClasesProcesoEnum.Proceso_de_Evaluación, dbContext, idUsuarioEnLinea);
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
                }
                catch (Exception)
                {
                    trx.Rollback();
                    throw;
                }
            }
        }

        public void ValidarDesafio (int idDesafio)
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
    }
}
