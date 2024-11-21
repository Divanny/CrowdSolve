using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Enums;
using CrowdSolve.Server.Infraestructure;
using CrowdSolve.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CrowdSolve.Server.Repositories.Autenticación
{
    public class SolucionesRepo: Repository<Soluciones, SolucionesModel>
    {
        public ProcesosRepo procesosRepo;
        public int _idUsuarioEnLinea;
        public SolucionesRepo(DbContext dbContext, int idUsuarioEnLinea) : base
        (
            dbContext,
            new ObjectsMapper<SolucionesModel, Soluciones>(s => new Soluciones()
            {
                idSolucion = s.idSolucion,
                idDesafio = s.idDesafio,
                idUsuario = s.idUsuario,
                Titulo = s.Titulo,
                Descripcion = s.Descripcion,
                FechaRegistro = s.FechaRegistro,
                ArchivoRuta = s.ArchivoRuta,
                Publica = s.Publica,
                Puntuacion = s.Puntuacion
            }),
            (DB, filter) =>
            {
                return (from s in DB.Set<Soluciones>().Where(filter)
                        join usuario in DB.Set<Usuarios>() on s.idUsuario equals usuario.idUsuario
                        join proceso in DB.Set<Procesos>() on s.idSolucion equals proceso.idRelacionado
                        where proceso.idClaseProceso == (int)ClasesProcesoEnum.Solución
                        join estatusProceso in DB.Set<EstatusProceso>() on proceso.idEstatusProceso equals estatusProceso.idEstatusProceso

                        select new SolucionesModel()
                        {
                            idSolucion = s.idSolucion,
                            idDesafio = s.idDesafio,
                            idUsuario = s.idUsuario,
                            NombreUsuario = usuario.NombreUsuario,
                            Titulo = s.Titulo,
                            Descripcion = s.Descripcion,
                            FechaRegistro = s.FechaRegistro,
                            ArchivoRuta = s.ArchivoRuta,
                            idEstatusProceso = proceso.idEstatusProceso,
                            EstatusProceso = estatusProceso.Nombre,
                            Publica = s.Publica,
                            Puntuacion = s.Puntuacion
                        });
            }
        )
        {
            procesosRepo = new ProcesosRepo(ClasesProcesoEnum.Solución, dbContext, idUsuarioEnLinea);
            _idUsuarioEnLinea = idUsuarioEnLinea;
        }
        public override Soluciones Add(SolucionesModel model)
        {
            using (var trx = dbContext.Database.BeginTransaction())
            {
                try
                {
                    model.FechaRegistro = DateTime.Now;
                    model.idUsuario = _idUsuarioEnLinea;

                    var creado = base.Add(model);

                    ProcesosModel procesoModel = new ProcesosModel
                    {
                        idEstatusProceso = (int)EstatusProcesoEnum.Solución_Enviada,
                        idUsuario = _idUsuarioEnLinea,
                        idRelacionado = creado.idSolucion,
                    };

                    procesosRepo.Add(procesoModel);
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

        public override void Edit(SolucionesModel model)
        {
            using (var trx = dbContext.Database.BeginTransaction())
            {
                try
                {
                    var desafio = this.Get(x => x.idDesafio == model.idDesafio).FirstOrDefault();

                    if (desafio == null)
                    {
                        throw new Exception("No se encontró el desafío");
                    }

                    desafio.Titulo = model.Titulo;
                    desafio.Descripcion = model.Descripcion;
                    desafio.ArchivoRuta = model.ArchivoRuta;
                    desafio.Publica = model.Publica;

                    base.Edit(desafio);

                    trx.Commit();
                }
                catch (Exception)
                {
                    trx.Rollback();
                    throw;
                }
            }
        }

        public void CambiarEstatus(int idSolucion, EstatusProcesoEnum estatus, string? motivo)
        {
            if (motivo == null)
            {
                procesosRepo.CambiarEstatusProceso(idSolucion, new ProcesosModel(estatus));
            }
            else
            {
                procesosRepo.CambiarEstatusProceso(idSolucion, new ProcesosModel(estatus, motivo));
            }
        }
    }
}
