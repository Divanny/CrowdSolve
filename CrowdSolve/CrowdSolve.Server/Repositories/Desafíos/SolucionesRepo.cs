using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Enums;
using CrowdSolve.Server.Infraestructure;
using CrowdSolve.Server.Models;
using Microsoft.AspNetCore.Connections.Features;
using Microsoft.EntityFrameworkCore;

namespace CrowdSolve.Server.Repositories.Autenticación
{
    public class SolucionesRepo : Repository<Soluciones, SolucionesModel>
    {
        public ProcesosRepo procesosRepo;
        public AdjuntosRepo adjuntosRepo;
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
                            idProceso = proceso.idProceso,
                            idEstatusProceso = proceso.idEstatusProceso,
                            EstatusProceso = estatusProceso.Nombre,
                            SeveridadEstatusProceso = estatusProceso.Severidad,
                            IconoEstatusProceso = estatusProceso.ClaseIcono,
                            Publica = s.Publica,
                            Puntuacion = s.Puntuacion,
                            Adjuntos = DB.Set<Adjuntos>().Where(a => a.idProceso == proceso.idProceso)
                                         .Select(a => new AdjuntosModel
                                         {
                                             idAdjunto = a.idAdjunto,
                                             idProceso = a.idProceso,
                                             Nombre = a.Nombre,
                                             ContentType = a.ContentType,
                                             Tamaño = a.Tamaño,
                                             FechaSubida = a.FechaSubida,
                                             RutaArchivo = a.RutaArchivo,
                                             idUsuario = a.idUsuario
                                         }).ToList(),
                            MeGusta = DB.Set<VotosUsuarios>().Any(v => v.idSolucion == s.idSolucion && v.idUsuario == idUsuarioEnLinea),
                            CantidadVotos = DB.Set<VotosUsuarios>().Where(v => v.idSolucion == s.idSolucion).Count()
                        });
            }
        )
        {
            procesosRepo = new ProcesosRepo(ClasesProcesoEnum.Solución, dbContext, idUsuarioEnLinea);
            adjuntosRepo = new AdjuntosRepo(dbContext);
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

                    var proceso = procesosRepo.Add(procesoModel);

                    if (model.Adjuntos != null && model.Adjuntos.Count > 0)
                    {
                        foreach (var adjunto in model.Adjuntos)
                        {
                            adjunto.idProceso = proceso.idProceso;
                            adjuntosRepo.Add(adjunto);
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

        public override void Edit(SolucionesModel model)
        {
            using (var trx = dbContext.Database.BeginTransaction())
            {
                try
                {
                    var solucion = this.Get(x => x.idSolucion == model.idSolucion).FirstOrDefault();

                    if (solucion == null)
                    {
                        throw new Exception("No se encontró la solución");
                    }

                    if (model.Adjuntos != null && model.Adjuntos.Count > 0)
                    {
                        var adjuntos = adjuntosRepo.Get(x => x.idProceso == solucion.idProceso).ToList();

                        foreach (var adjunto in adjuntos)
                        {
                            adjuntosRepo.Delete(adjunto.idAdjunto);
                        }

                        foreach (var adjunto in model.Adjuntos)
                        {
                            adjunto.idProceso = solucion.idProceso;
                            adjuntosRepo.Add(adjunto);
                        }
                    }

                    solucion.Titulo = model.Titulo;
                    solucion.Descripcion = model.Descripcion;
                    solucion.ArchivoRuta = model.ArchivoRuta;
                    solucion.Publica = model.Publica;

                    base.Edit(solucion);

                    trx.Commit();
                }
                catch (Exception)
                {
                    trx.Rollback();
                    throw;
                }
            }
        }

        public void PuntuarSolucion(int idSolucion, int? Puntuacion)
        {
            var solucion = this.Get(x => x.idSolucion == idSolucion).FirstOrDefault();
            solucion.Puntuacion = Puntuacion;
            base.Edit(solucion);
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

        public void MeGusta(int idSolucion, int idUsuario)
        {
            var voto = dbContext.Set<VotosUsuarios>().FirstOrDefault(v => v.idSolucion == idSolucion && v.idUsuario == idUsuario);
            if (voto == null)
            {
                dbContext.Set<VotosUsuarios>().Add(new VotosUsuarios
                {
                    idSolucion = idSolucion,
                    idUsuario = idUsuario
                });
            }
            else
            {
                dbContext.Set<VotosUsuarios>().Remove(voto);
            }
            dbContext.SaveChanges();
        }
    }
}
