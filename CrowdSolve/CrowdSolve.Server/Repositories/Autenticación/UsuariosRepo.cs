using CrowdSolve.Server.Entities.CrowdSolve;
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
                CorreoElectronico = u.CorreoElectronico,
                idPerfil = u.idPerfil,
                idEstatusUsuario = u.idEstatusUsuario,
                Contraseña = u.ContraseñaHashed,
                FechaRegistro = u.FechaRegistro,
                AvatarURL = u.AvatarURL
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
                            CorreoElectronico = u.CorreoElectronico,
                            idPerfil = u.idPerfil,
                            NombrePerfil = p.Nombre,
                            idEstatusUsuario = u.idEstatusUsuario,
                            NombreEstatusUsuario = e.Nombre,
                            FechaRegistro = u.FechaRegistro,
                            ContraseñaHashed = u.Contraseña,
                            InformacionParticipante = pa,
                            InformacionEmpresa = em,
                            AvatarURL = u.AvatarURL
                        });
            }
        )
        {

        }

        public UsuariosModel GetByUsername(string nombreUsuario)
        {
            var usuarioModel = this.Get(x => x.NombreUsuario == nombreUsuario).FirstOrDefault();

            if (usuarioModel == null) return new UsuariosModel();

            usuarioModel.ContraseñaHashed = null;
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
            try
            {
                var result = base.Add(model);
                return result;
            }
            catch (Exception E)
            {
                throw;
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
                    usuario.AvatarURL = model.AvatarURL;

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

        public List<EstatusUsuarios> GetEstatusUsuarios()
        {
            return dbContext.Set<EstatusUsuarios>().ToList();
        }
    }
}
