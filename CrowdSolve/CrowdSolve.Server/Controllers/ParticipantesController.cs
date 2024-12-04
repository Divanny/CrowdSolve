﻿using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Enums;
using CrowdSolve.Server.Infraestructure;
using CrowdSolve.Server.Models;
using CrowdSolve.Server.Repositories.Autenticación;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CrowdSolve.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ParticipantesController : Controller
    {
        private readonly Logger _logger;
        private readonly int _idUsuarioOnline;
        private readonly CrowdSolveContext _crowdSolveContext;
        private readonly ParticipantesRepo _participantesRepo;
        private readonly EmpresasRepo _empresasRepo;
        private readonly UsuariosRepo _usuariosRepo;

        /// <summary>
        /// Constructor de la clase ParticipantesController.
        /// </summary>
        /// <param name="userAccessor"></param>
        /// <param name="crowdSolveContext"></param>
        /// <param name="logger"></param>
        public ParticipantesController(IUserAccessor userAccessor, CrowdSolveContext crowdSolveContext, Logger logger)
        {
            _logger = logger;
            _idUsuarioOnline = userAccessor.idUsuario;
            _crowdSolveContext = crowdSolveContext;
            _participantesRepo = new ParticipantesRepo(crowdSolveContext);
            _empresasRepo = new EmpresasRepo(crowdSolveContext);
            _usuariosRepo = new UsuariosRepo(crowdSolveContext);
        }

        /// <summary>
        /// Obtiene todos los Participantes.
        /// </summary>
        /// <returns>Lista de Participantes.</returns>
        [HttpGet(Name = "GetParticipantes")]
        [Authorize]
        public List<ParticipantesModel> Get()
        {
            List<ParticipantesModel> Participantes = _participantesRepo.Get().ToList();
            return Participantes;
        }

        /// <summary>
        /// Obtiene un participante por su ID.
        /// </summary>
        /// <param name="idParticipante">ID del Participante.</param>
        /// <returns>Participante encontrado.</returns>
        [HttpGet("{idParticipante}", Name = "GetParticipante")]
        [Authorize]
        public ParticipantesModel Get(int idParticipante)
        {
            ParticipantesModel? Participante = _participantesRepo.Get(x => x.idParticipante == idParticipante).FirstOrDefault();

            if (Participante == null) throw new Exception("Este participante no se ha encontrado");

            return Participante;
        }

        /// <summary>
        /// Crea un nuevo Participante.
        /// </summary>
        /// <param name="ParticipantesModel">Datos del Participante a crear.</param>
        /// <returns>Resultado de la operación.</returns>
        [HttpPost(Name = "SaveParticipante")]
        [Authorize]
        public OperationResult Post(ParticipantesModel ParticipantesModel)
        {
            try
            {
                if (_participantesRepo.Any(x => x.idUsuario == _idUsuarioOnline)) return new OperationResult(false, "Este usuario ya tiene información de participante registrada");
                if (_empresasRepo.Any(x => x.idUsuario == _idUsuarioOnline)) return new OperationResult(false, "Este usuario ya tiene un perfil de empresa registrado");

                var usuario = _usuariosRepo.Get(_idUsuarioOnline);
                if (usuario == null) return new OperationResult(false, "Este usuario no se ha encontrado");

                if (usuario.idPerfil != (int)PerfilesEnum.Sin_perfil) return new OperationResult(false, "Este usuario no tiene permisos para registrarse como participante");

                usuario.idPerfil = (int)PerfilesEnum.Participante;
                usuario.idEstatusUsuario = (int)EstatusUsuariosEnum.Activo;

                _usuariosRepo.Edit(usuario);

                var created = _participantesRepo.Add(ParticipantesModel);
                _logger.LogHttpRequest(ParticipantesModel);
                return new OperationResult(true, "Se ha registrado la información del participante exitosamente", created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        /// <summary>
        /// Actualiza una Participante existente.
        /// </summary>
        /// <param name="idParticipante">ID del Participante a actualizar.</param>
        /// <param name="ParticipantesModel">Datos del Participante a actualizar.</param>
        /// <returns>Resultado de la operación.</returns>
        [HttpPut("{idParticipante}", Name = "UpdateParticipante")]
        [Authorize]
        //[AuthorizeByPermission(PermisosEnum.Editar_Participante)]
        public OperationResult Put(int idParticipante, [FromForm] ParticipantesModel ParticipantesModel)
        {
            try
            {
                var Participante = _participantesRepo.Get(x => x.idParticipante == idParticipante).FirstOrDefault();
                if (Participante == null) return new OperationResult(false, "Este participante no se ha encontrado");

                var usuario = _usuariosRepo.Get(Participante.idUsuario);
                if (usuario == null) return new OperationResult(false, "Este usuario no se ha encontrado");

                if (ParticipantesModel.NombreUsuario != usuario.NombreUsuario && _usuariosRepo.Any(x => x.NombreUsuario == ParticipantesModel.NombreUsuario)) return new OperationResult(false, "Este usuario ya existe en el sistema");
                if (ParticipantesModel.CorreoElectronico != usuario.CorreoElectronico && _usuariosRepo.Any(x => x.CorreoElectronico == ParticipantesModel.CorreoElectronico)) return new OperationResult(false, "Este correo electrónico ya está registrado");

                _participantesRepo.Edit(ParticipantesModel);
                _logger.LogHttpRequest(ParticipantesModel);
                return new OperationResult(true, "Se ha editado la información del participante exitosamente", Participante);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        /// <summary>
        /// Actualiza el perfil de un participante.
        /// </summary>
        /// <returns></returns>
        [HttpPut("MiPerfil", Name = "UpdatePerfilParticipante")]
        [Authorize]
        public OperationResult MiPerfil(ParticipantesModel participantesModel)
        {
            try
            {
                var Participante = _participantesRepo.Get(x => x.idUsuario == _idUsuarioOnline).FirstOrDefault();

                if (Participante == null) return new OperationResult(false, "Este participante no se ha encontrado");
                if (participantesModel.idParticipante != Participante.idParticipante) return new OperationResult(false, "No tiene permisos para editar este perfil");

                _participantesRepo.Edit(participantesModel);

                _logger.LogHttpRequest(participantesModel);
                return new OperationResult(true, "Se ha editado su perfil exitosamente", Participante);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        [HttpGet("GetRelationalObjects")]
        [Authorize]
        public object GetRelationalObjects()
        {
            var nivelesEducativos = _crowdSolveContext.Set<NivelesEducativo>(); 
            var estatusUsuarios = _usuariosRepo.GetEstatusUsuarios();

            return new
            {
                nivelesEducativos = nivelesEducativos,
                estatusUsuarios = estatusUsuarios
            };
        }
    }
}
