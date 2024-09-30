using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Enums;
using CrowdSolve.Server.Infraestructure;
using CrowdSolve.Server.Models;
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
                NombreUsuario = u.NombreUsuario,
                idPerfil = u.idPerfil,
                idEstatusUsuario = u.idEstatusUsuario,
                Contraseña = u.ContraseñaHashed,
                FechaRegistro = u.FechaRegistro
            }),
            (DB, filter) =>
            {
                return (from u in DB.Set<Usuarios>().Where(filter)
                        join p in DB.Set<Perfiles>() on u.idPerfil equals p.idPerfil
                        join e in DB.Set<EstatusUsuarios>() on u.idEstatusUsuario equals e.idEstatusUsuario
                        join participanteSet in DB.Set<Participantes>() on u.idUsuario equals participanteSet.idUsuario into paLF
                        from pa in paLF.DefaultIfEmpty()
                        join empresaSet in DB.Set<Empresas>() on u.idUsuario equals empresaSet.idUsuario into emLF
                        from em in emLF.DefaultIfEmpty()
                        select new UsuariosModel()
                        {
                            idUsuario = u.idUsuario,
                            NombreUsuario = u.NombreUsuario,
                            ContraseñaHashed = u.Contraseña,
                            idPerfil = u.idPerfil,
                            NombrePerfil = p.Nombre,
                            idEstatusUsuario = u.idEstatusUsuario,
                            NombreEstatusUsuario = e.Nombre,
                            FechaRegistro = u.FechaRegistro,
                            InformacionParticipante = pa,
                            InformacionEmpresa = em,
                            Identificaciones = DB.Set<Identificaciones>().Where(i => i.idUsuario == u.idUsuario).ToList()
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
        public override Usuarios Add(UsuariosModel model)
        {
            using (var trx = dbContext.Database.BeginTransaction())
            {
                try
                {
                    var result = base.Add(model);
                    trx.Commit();
                    return result;
                }
                catch (Exception E)
                {
                    trx.Rollback();
                    throw;
                }
            }
        }

        public override void Edit(UsuariosModel model)
        {
            using (var trx = dbContext.Database.BeginTransaction())
            {
                try
                {
                    var usuario = this.Get(model.idUsuario);

                    if (usuario == null) throw new Exception("El usuario no se ha encontrado");

                    usuario.idPerfil = model.idPerfil;
                    usuario.idEstatusUsuario = model.idEstatusUsuario;

                    if (model.idPerfil == (int)PerfilesEnum.Participante && model.InformacionParticipante != null)
                    {
                        dbContext.Set<Participantes>().Update(model.InformacionParticipante);
                    }
                    else if (model.idPerfil == (int)PerfilesEnum.Empresa && model.InformacionEmpresa != null)
                    {
                        dbContext.Set<Empresas>().Update(model.InformacionEmpresa);
                    }

                    SaveChanges();
                    base.Edit(usuario);

                    trx.Commit();
                }
                catch (Exception E)
                {
                    trx.Rollback();
                    throw;
                }
            }
        }

        public void CompletarInformacion(UsuariosModel model)
        {
            using (var trx = dbContext.Database.BeginTransaction())
            {
                try
                {
                    var usuario = this.Get(x => x.idUsuario == model.idUsuario).FirstOrDefault();

                    if (usuario == null) throw new Exception("El usuario no se ha encontrado");

                    if (model.idPerfil == (int)PerfilesEnum.Participante)
                    {
                        usuario.idEstatusUsuario = (int)EstatusUsuariosEnum.Activo;

                        model.InformacionParticipante.idUsuario = model.idUsuario;

                        dbContext.Set<Participantes>().Add(model.InformacionParticipante);
                    }

                    if (usuario.idPerfil == (int)PerfilesEnum.Empresa)
                    {
                        usuario.idEstatusUsuario = (int)EstatusUsuariosEnum.Pendiente_de_validar;

                        model.InformacionEmpresa.idUsuario = model.idUsuario;

                        dbContext.Set<Empresas>().Add(model.InformacionEmpresa);
                    }

                    SaveChanges();
                    base.Edit(usuario);

                    trx.Commit();
                }
                catch (Exception E)
                {
                    trx.Rollback();
                    throw;
                }
            }

        }
    }
}
