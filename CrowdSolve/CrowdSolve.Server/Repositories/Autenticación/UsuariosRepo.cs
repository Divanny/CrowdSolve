﻿using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Infraestructure;
using CrowdSolve.Server.Models;
using CrowdSolve.Server.Services;
using Microsoft.EntityFrameworkCore;

namespace CrowdSolve.Server.Repositories.Autenticación
{
    public class UsuariosRepo : Repository<Usuarios, UsuariosModel>
    {
        private readonly FirebaseTranslationService _translationService;
        private readonly string _idioma;

        public UsuariosRepo(DbContext dbContext, FirebaseTranslationService? translationService = null, string? idioma = null) : base
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
            _translationService = translationService;
            _idioma = idioma;
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

        public override IEnumerable<UsuariosModel> Get(Func<Usuarios, bool> filter = null)
        {
            var usuarios = base.Get(filter).ToList();
            foreach (var usuario in usuarios)
            {
                usuario.NombreEstatusUsuario = _translationService.Traducir(usuario.NombreEstatusUsuario, _idioma);
            }
            return usuarios;
        }

        public override Usuarios Add(UsuariosModel model)
        {
            try
            {
                var result = base.Add(model);
                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public override void Edit(UsuariosModel model)
        {
            try
            {
                var usuario = this.Get(model.idUsuario);

                if (usuario == null) throw new Exception("El usuario no se ha encontrado");

                if (usuario.NombreUsuario != model.NombreUsuario && this.Any(x => x.NombreUsuario == model.NombreUsuario)) throw new Exception("Este usuario ya existe en el sistema");
                if (usuario.CorreoElectronico != model.CorreoElectronico && this.Any(x => x.CorreoElectronico == model.CorreoElectronico)) throw new Exception("Este correo electrónico ya está registrado");

                if (usuario.idPerfil != model.idPerfil)
                {
                    var perfil = dbContext.Set<Perfiles>().Find(model.idPerfil);
                    if (perfil == null) throw new Exception("Este perfil no se ha encontrado");
                }

                usuario.NombreUsuario = model.NombreUsuario;
                usuario.CorreoElectronico = model.CorreoElectronico;
                usuario.idPerfil = model.idPerfil;
                usuario.idEstatusUsuario = model.idEstatusUsuario;
                usuario.AvatarURL = model.AvatarURL;

                base.Edit(usuario);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<EstatusUsuarios> GetEstatusUsuarios()
        {
            return dbContext.Set<EstatusUsuarios>().ToList();
        }

        public List<Perfiles> GetPerfilesUsuarios()
        {
            return dbContext.Set<Perfiles>().ToList();
        }
    }
}
