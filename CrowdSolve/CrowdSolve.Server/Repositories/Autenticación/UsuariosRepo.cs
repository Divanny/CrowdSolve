using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Infraestructure;
using Microsoft.EntityFrameworkCore;

namespace CrowdSolve.Server.Repositories.Autenticación
{
    public class UsuariosRepo : Repository<Usuarios, UsuariosModel>
    {
        public UsuariosRepo(DbContext dbContext) : base
        (
            dbContext,
            new ObjectsMapper<UsuariosModel, Usuarios>(u => new Usuarios()
            {
                idUsuario = u.idUsuario,
                Nombres = u.Nombres,
                Cedula = u.Cedula,
                Apellidos = u.Apellidos,
                NombreUsuario = u.NombreUsuario,
                idPerfil = u.idPerfil,
                Activo = u.Activo,
                FechaCrea = u.FechaCrea,
                idSupervisor = u.idSupervisor,
                idDivision = u.idDivision,
            }),
        (DB, filter) =>
        {
            return (from u in DB.Set<Usuarios>().Where(filter)
                    join p in DB.Set<Perfiles>() on u.idPerfil equals p.idPerfil
                    join supervisorSet in DB.Set<Usuarios>() on u.idSupervisor equals supervisorSet.idUsuario into sLF
                    from s in sLF.DefaultIfEmpty()
                    join digitadorSet in DB.Set<Divisiones>() on u.idDivision equals digitadorSet.idDivision into dLF
                    from d in dLF.DefaultIfEmpty()
                    select new UsuariosModel()
                    {
                        idUsuario = u.idUsuario,
                        Nombres = u.Nombres,
                        Apellidos = u.Apellidos,
                        NombreUsuario = u.NombreUsuario,
                        Cedula = u.Cedula,
                        idPerfil = u.idPerfil,
                        NombrePerfil = p.Nombre ?? "",
                        FechaCrea = u.FechaCrea,
                        Activo = u.Activo,
                        idSupervisor = u.idSupervisor,
                        Supervisor = s?.NombreUsuario ?? "",
                        idDivision = u.idDivision,
                        Division = d?.Nombre ?? "",
                    });
        }
        )
        {

        }

        public UsuariosModel GetByUsername(string nombreUsuario)
        {
            return this.Get(x => x.NombreUsuario == nombreUsuario).FirstOrDefault();
        }

        public UsuariosModel Get(int id)
        {
            var result = base.Get(a => a.idUsuario == id).FirstOrDefault();

            if (result != null)
            {
                return result;
            }

            return null;
        }

        public override void Edit(UsuariosModel model)
        {
            using (var trx = dbContext.Database.BeginTransaction())
            {
                try
                {
                    base.Edit(model);

                    var institucionesAsociadasSet = dbContext.Set<InstitucionesUsuario>();
                    if (model.InstitucionesAsociadas != null)
                    {
                        institucionesAsociadasSet.RemoveRange(institucionesAsociadasSet.Where(p => p.idUsuario == model.idUsuario));

                        if (model.InstitucionesAsociadas.Count > 0)
                        {
                            foreach (Instituciones i in model.InstitucionesAsociadas.Where(x => x.idInstitucion == 0))
                            {
                                dbContext.Set<Instituciones>().Add(i);
                                dbContext.SaveChanges();
                            }

                            institucionesAsociadasSet.AddRange(model.InstitucionesAsociadas.Select(i => new InstitucionesUsuario()
                            {
                                idUsuario = model.idUsuario,
                                idInstitucion = i.idInstitucion
                            }));
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
        public override Usuarios Add(UsuariosModel model)
        {
            using (var trx = dbContext.Database.BeginTransaction())
            {
                try
                {
                    var result = base.Add(model);

                    var institucionesAsociadasSet = dbContext.Set<InstitucionesUsuario>();
                    if (model.InstitucionesAsociadas != null && model.InstitucionesAsociadas.Count() > 0)
                    {
                        foreach (Instituciones i in model.InstitucionesAsociadas.Where(x => x.idInstitucion == 0))
                        {
                            dbContext.Set<Instituciones>().Add(i);
                            dbContext.SaveChanges();
                        }

                        institucionesAsociadasSet.AddRange(model.InstitucionesAsociadas.Select(i => new InstitucionesUsuario()
                        {
                            idUsuario = result.idUsuario,
                            idInstitucion = i.idInstitucion
                        }));

                        SaveChanges();
                    }

                    trx.Commit();
                    return result;
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
                    dbContext.Set<InstitucionesUsuario>().RemoveRange(dbContext.Set<InstitucionesUsuario>().Where(x => x.idUsuario == id));
                    base.Delete(id);
                    trx.Commit();
                }
                catch (Exception E)
                {
                    trx.Rollback();
                    throw E;
                }
            }
        }
        public AdUser? GetADUser(string UserName)
        {
            ADRepository adRepository = new ADRepository();

            return (adRepository.GetUserData(UserName.ToLower()));
        }
        public IEnumerable<UsuariosModel> GetAsesores()
        {
            return this.Get(x => x.idPerfil == (int)PerfilesEnum.Asesor);
        }

        public IEnumerable<UsuariosModel> GetSupervisores()
        {
            return this.Get(x => x.idPerfil == (int)PerfilesEnum.Supervisor);
        }

        public IEnumerable<Divisiones> GetDivisiones()
        {
            return dbContext.Set<Divisiones>();
        }
    }

}
