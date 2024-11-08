using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Infraestructure;
using CrowdSolve.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CrowdSolve.Server.Repositories.Autenticación
{
    public class PerfilesRepo : Repository<Perfiles, PerfilesModel>
    {
        public PerfilesRepo(DbContext dbContext) : base
        (
            dbContext,
            new ObjectsMapper<PerfilesModel, Perfiles>(p => new Perfiles()
            {
                idPerfil = p.idPerfil,
                Nombre = p.Nombre,
                Descripcion = p.Descripcion
            }),
                    (DB, filter) => (from p in DB.Set<Perfiles>().Where(filter)
                                     select new PerfilesModel()
                                     {
                                         idPerfil = p.idPerfil,
                                         Nombre = p.Nombre,
                                         Descripcion = p.Descripcion
                                     })
        )
        {
        }

        public PerfilesModel Get(int Id)
        {
            var model = base.Get(p => p.idPerfil == Id).FirstOrDefault();
            return model;
        }
        public IEnumerable<Vistas> GetPermisos(int idPerfil)
        {
            var idsPermisos = dbContext.Set<PerfilesVistas>().Where(p => p.idPerfil == idPerfil).Select(x => x.idVista);

            var vistas = GetPermisos();

            return vistas.Where(x => idsPermisos.Contains(x.idVista)).ToList();
        }
        public IEnumerable<Vistas> GetPermisos()
        {
            var vistas = dbContext.Set<Vistas>();
            return vistas;
        }
        public IEnumerable<UsuariosModel> GetUsuarios(int idPerfil)
        {
            UsuariosRepo usuariosRepo = new UsuariosRepo(dbContext);
            var listUsuarios = usuariosRepo.Get(x => x.idPerfil == idPerfil);
            return listUsuarios;
        }
        public override Perfiles Add(PerfilesModel model)
        {
            using (var trx = dbContext.Database.BeginTransaction())
            {
                try
                {
                    Perfiles created = base.Add(model);

                    var permisosSet = dbContext.Set<PerfilesVistas>();
                    if (model.Vistas != null && model.Vistas.Count() > 0)
                    {
                        var newPermisos = model.Vistas;
                        if (newPermisos != null)
                        {
                            permisosSet.AddRange(newPermisos.Select(p => new PerfilesVistas()
                            {
                                idPerfil = created.idPerfil,
                                idVista = p.idVista
                            }));

                            foreach (var p in newPermisos)
                            {
                                var VistasHijos = dbContext.Set<Vistas>().Where(x => x.idVistaPadre == p.idVista).ToList();
                                permisosSet.AddRange(VistasHijos.Select(v => new PerfilesVistas()
                                {
                                    idPerfil = created.idPerfil,
                                    idVista = v.idVista
                                }));
                            }
                            SaveChanges();
                        }
                    }

                    if (model.Usuarios != null && model.Usuarios.Count() > 0)
                    {
                        var usuariosIds = model.Usuarios.Select(u => u.idUsuario);
                        var usuariosDarPerfil = dbContext.Set<Usuarios>().Where(u => usuariosIds.Contains(u.idUsuario)).ToList();

                        foreach (var udp in usuariosDarPerfil)
                        {
                            udp.idPerfil = model.idPerfil;
                            dbContext.Entry(udp).State = EntityState.Modified;
                        }

                        SaveChanges();
                    }

                    trx.Commit();
                    return created;
                }
                catch (Exception E)
                {
                    trx.Rollback();
                    throw E;
                }
            }
        }
        public override void Edit(PerfilesModel model)
        {
            using (var trx = dbContext.Database.BeginTransaction())
            {
                try
                {
                    base.Edit(model);

                    var permisosSet = dbContext.Set<PerfilesVistas>();
                    if (model.Vistas != null && model.Vistas.Count() > 0)
                    {
                        permisosSet.RemoveRange(permisosSet.Where(p => p.idPerfil == model.idPerfil));

                        var newPermisos = model.Vistas;
                        if (newPermisos != null)
                        {
                            permisosSet.AddRange(newPermisos.Select(p => new PerfilesVistas()
                            {
                                idPerfil = model.idPerfil,
                                idVista = p.idVista
                            }));

                            foreach (var p in newPermisos)
                            {
                                var VistasHijos = dbContext.Set<Vistas>().Where(x => x.idVistaPadre == p.idVista).ToList();

                                permisosSet.AddRange(VistasHijos.Select(v => new PerfilesVistas()
                                {
                                    idPerfil = model.idPerfil,
                                    idVista = v.idVista
                                }));
                            }
                        }
                        SaveChanges();
                    }

                    if (model.Usuarios != null && model.Usuarios.Count() > 0)
                    {
                        var usuariosIds = model.Usuarios.Select(u => u.idUsuario);
                        var usuariosDarPerfil = dbContext.Set<Usuarios>().Where(u => usuariosIds.Contains(u.idUsuario)).ToList();

                        foreach (var udp in usuariosDarPerfil)
                        {
                            udp.idPerfil = model.idPerfil;
                            dbContext.Entry(udp).State = EntityState.Modified;
                        }

                        SaveChanges();
                    }

                    trx.Commit();
                }
                catch (Exception E)
                {
                    trx.Rollback();
                    throw E;
                }
            }
        }
        public override void Delete(int id)
        {
            using (var trx = dbContext.Database.BeginTransaction())
            {
                try
                {
                    base.Delete(id);
                    var PVSet = dbContext.Set<PerfilesVistas>();
                    PVSet.RemoveRange(PVSet.Where(a => a.idPerfil == id));
                    SaveChanges();

                    trx.Commit();
                }
                catch (Exception ex)
                {
                    trx.Rollback();
                    throw ex;
                }
            }
        }
        public int[] VistasIdsCanAccess(int idUsuario)
        {
            var vistasPermitidas = (from u in dbContext.Set<Usuarios>().Where(u1 => u1.idUsuario == idUsuario)
                                    join pv in dbContext.Set<PerfilesVistas>() on u.idPerfil equals pv.idPerfil
                                    select pv.idVista).ToArray();
            return vistasPermitidas;
        }
        public bool CanAccess(int idUsuario, int idVista)
        {
            var PVSet = from u in dbContext.Set<Usuarios>().Where(u => u.idUsuario == idUsuario)
                        join pv in dbContext.Set<PerfilesVistas>().Where(a => a.idVista == idVista) on u.idPerfil equals pv.idPerfil
                        select pv;

            return PVSet.Any();
        }
        public bool CanAccess(int idUsuario, int[] idVistas)
        {
            var PVSet = from u in dbContext.Set<Usuarios>().Where(u => u.idUsuario == idUsuario)
                        join pv in dbContext.Set<PerfilesVistas>().Where(a => idVistas.Contains(a.idVista)) on u.idPerfil equals pv.idPerfil
                        select pv;

            return PVSet.Any();
        }
        public bool CanDelete(int id)
        {
            return !dbContext.Set<Usuarios>().Any(a => a.idPerfil == id);
        }
        public IEnumerable<Vistas> GetVistas()
        {
            return dbContext.Set<Vistas>()/*.OrderBy(x => x.Orden)*/;
        }
        public int GetPerfilDefault()
        {
            var perfilDefault = base.Get(x => x.PorDefecto == true).First();
            return perfilDefault.idPerfil;
        }
    }
}
