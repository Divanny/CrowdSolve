using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Enums;
using CrowdSolve.Server.Infraestructure;
using CrowdSolve.Server.Models;
using Microsoft.AspNetCore.Connections.Features;
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
                            idEstatusProceso = proceso.idEstatusProceso,
                            EstatusProceso = estatusProceso.Nombre,
                            Publica = s.Publica,
                            Puntuacion = s.Puntuacion,
                            Adjuntos = DB.Set<AdjuntosSoluciones>().Where(a => a.idSolucion == s.idSolucion).ToList(),
                            MeGusta = DB.Set<VotosUsuarios>().Any(v => v.idSolucion == s.idSolucion && v.idUsuario == idUsuarioEnLinea),
                            CantidadVotos = DB.Set<VotosUsuarios>().Where(v => v.idSolucion == s.idSolucion).Count()
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

                    if (model.Adjuntos != null && model.Adjuntos.Count > 0)
                    {
                        foreach (var adjuntos in model.Adjuntos)
                        {
                            adjuntos.idSolucion = creado.idSolucion;
                        }

                        dbContext.Set<AdjuntosSoluciones>().AddRange(model.Adjuntos);
                    }

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
                    var solucion = this.Get(x => x.idSolucion == model.idSolucion).FirstOrDefault();

                    if (solucion == null)
                    {
                        throw new Exception("No se encontró la solución");
                    }

                    if (model.Adjuntos != null && model.Adjuntos.Count > 0)
                    {
                        dbContext.Set<AdjuntosSoluciones>().RemoveRange(dbContext.Set<AdjuntosSoluciones>().Where(x => x.idSolucion == model.idSolucion));


                        foreach (var adjuntos in model.Adjuntos)
                        {
                            adjuntos.idSolucion = model.idSolucion;
                        }

                        dbContext.Set<AdjuntosSoluciones>().AddRange(model.Adjuntos);
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
