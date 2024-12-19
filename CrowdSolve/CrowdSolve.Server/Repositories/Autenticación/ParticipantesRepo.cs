﻿using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Infraestructure;
using CrowdSolve.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CrowdSolve.Server.Repositories.Autenticación
{
    public class ParticipantesRepo : Repository<Participantes, ParticipantesModel>
    {
        public UsuariosRepo usuariosRepo;
        public ParticipantesRepo(DbContext dbContext) : base
        (
            dbContext,
            new ObjectsMapper<ParticipantesModel, Participantes>(p => new Participantes()
            {
                idParticipante = p.idParticipante,
                idUsuario = p.idUsuario,
                Nombres = p.Nombres,
                Apellidos = p.Apellidos,
                FechaNacimiento = p.FechaNacimiento,
                Telefono = p.Telefono,
                idNivelEducativo = p.idNivelEducativo,
                DescripcionPersonal = p.DescripcionPersonal
            }),
            (DB, filter) =>
            {
                return (from p in DB.Set<Participantes>().Where(filter)
                        join usuario in DB.Set<Usuarios>() on p.idUsuario equals usuario.idUsuario
                        join estatusUsuario in DB.Set<EstatusUsuarios>() on usuario.idEstatusUsuario equals estatusUsuario.idEstatusUsuario
                        join nivelEducativo in DB.Set<NivelesEducativo>() on p.idNivelEducativo equals nivelEducativo.idNivelEducativo
                        join solucionesSet in DB.Set<Soluciones>() on p.idUsuario equals solucionesSet.idUsuario into soLF
                        from so in soLF.DefaultIfEmpty()

                        select new ParticipantesModel()
                        {
                            idParticipante = p.idParticipante,
                            idUsuario = p.idUsuario,
                            NombreUsuario = usuario.NombreUsuario,
                            FechaRegistro = usuario.FechaRegistro,
                            CorreoElectronico = usuario.CorreoElectronico,
                            Nombres = p.Nombres,
                            Apellidos = p.Apellidos,
                            FechaNacimiento = p.FechaNacimiento,
                            Telefono = p.Telefono,
                            idNivelEducativo = p.idNivelEducativo,
                            NivelEducativo = nivelEducativo.Nombre,
                            DescripcionPersonal = p.DescripcionPersonal,
                            idEstatusUsuario = usuario.idEstatusUsuario,
                            EstatusUsuario = estatusUsuario.Nombre
                        });
            }
        )
        {
            usuariosRepo = new UsuariosRepo(dbContext);
        }

        public ParticipantesModel GetByUserId(int idUsuario)
        {
            var participanteModel = this.Get(x => x.idUsuario == idUsuario).FirstOrDefault();

            if (participanteModel == null) return new ParticipantesModel();

            return participanteModel;
        }

        public override void Edit(ParticipantesModel model)
        {
            try
            {
                var participante = this.Get(x => x.idUsuario == model.idUsuario).FirstOrDefault();
                var usuario = usuariosRepo.Get(x => x.idUsuario == model.idUsuario).FirstOrDefault();

                if (participante == null) throw new Exception("Este participante no se ha encontrado");
                if (usuario == null) throw new Exception("Este usuario no se ha encontrado");

                participante.Nombres = model.Nombres;
                participante.Apellidos = model.Apellidos;
                participante.Telefono = model.Telefono;
                participante.FechaNacimiento = model.FechaNacimiento;
                participante.idNivelEducativo = model.idNivelEducativo;
                participante.DescripcionPersonal = model.DescripcionPersonal;

                base.Edit(participante, participante.idParticipante);
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
