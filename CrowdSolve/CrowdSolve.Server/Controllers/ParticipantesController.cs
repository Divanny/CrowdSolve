using CrowdSolve.Server.Entities.CrowdSolve;
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
        /// <param name="ParticipantesModel">Datos de la Participante a crear.</param>
        /// <returns>Resultado de la operación.</returns>
        [HttpPost(Name = "SaveParticipante")]
        [Authorize]
        public OperationResult Post(ParticipantesModel ParticipantesModel)
        {
            try
            {
                if (_participantesRepo.Any(x => x.idUsuario == ParticipantesModel.idUsuario)) return new OperationResult(false, "Este usuario ya tiene información de participante registrada");
                if (_empresasRepo.Any(x => x.idUsuario == ParticipantesModel.idUsuario)) return new OperationResult(false, "Este usuario ya tiene un perfil de empresa registrado");

                var usuario = _usuariosRepo.Get(ParticipantesModel.idUsuario);
                if (usuario == null) return new OperationResult(false, "Este usuario no se ha encontrado");

                usuario.idPerfil = (int)PerfilesEnum.Participante;
                usuario.idEstatusUsuario = (int)EstatusUsuariosEnum.Activo;

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
        /// <param name="ParticipantesModel">Datos de la Participante a actualizar.</param>
        /// <returns>Resultado de la operación.</returns>
        [HttpPut(Name = "UpdateParticipante")]
        [Authorize]
        //[AuthorizeByPermission(PermisosEnum.Editar_Participante)]
        public OperationResult Put(ParticipantesModel ParticipantesModel)
        {
            try
            {
                var Participante = _participantesRepo.Get(x => x.idParticipante == ParticipantesModel.idParticipante).FirstOrDefault();

                if (Participante == null) return new OperationResult(false, "Este participante no se ha encontrado");
                if (Participante.idUsuario != ParticipantesModel.idUsuario) return new OperationResult(false, "No tienes permisos para editar este participante");

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

        [HttpGet("GetRelationalObjects")]
        [Authorize]
        public object GetRelationalObjects()
        {
            var nivelesEducativos = _crowdSolveContext.Set<NivelesEducativo>(); 

            return new
            {
                nivelesEducativos = nivelesEducativos
            };
        }
    }
}
