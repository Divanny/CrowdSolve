using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Enums;
using CrowdSolve.Server.Infraestructure;
using CrowdSolve.Server.Models;
using CrowdSolve.Server.Repositories.Autenticación;
using CrowdSolve.Server.Services;
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
        private readonly SolucionesRepo _solucionesRepo;
        private readonly DesafiosRepo _desafiosRepo;
        private readonly FirebaseStorageService _firebaseStorageService;
        private readonly FirebaseTranslationService _translationService;
        private readonly string _idioma;

        /// <summary>
        /// Constructor de la clase ParticipantesController.
        /// </summary>
        /// <param name="userAccessor"></param>
        /// <param name="crowdSolveContext"></param>
        /// <param name="logger"></param>
        /// <param name="firebaseStorageService"></param>
        public ParticipantesController(IUserAccessor userAccessor, CrowdSolveContext crowdSolveContext, Logger logger, FirebaseStorageService firebaseStorageService, FirebaseTranslationService translationService, IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _idUsuarioOnline = userAccessor.idUsuario;
            _crowdSolveContext = crowdSolveContext;
            //_empresasRepo = new EmpresasRepo(crowdSolveContext);
            _solucionesRepo = new SolucionesRepo(crowdSolveContext, _idUsuarioOnline, _translationService, _idioma);
            _desafiosRepo = new DesafiosRepo(crowdSolveContext, _idUsuarioOnline, _translationService, _idioma);
            _firebaseStorageService = firebaseStorageService;
            _translationService = translationService;
            _idioma = httpContextAccessor.HttpContext.Request.Headers["Accept-Language"].ToString() ?? "es";
            _participantesRepo = new ParticipantesRepo(crowdSolveContext, _translationService, _idioma);
            _empresasRepo = new EmpresasRepo(crowdSolveContext, _translationService, _idioma);
            _usuariosRepo = new UsuariosRepo(crowdSolveContext, _translationService, _idioma);
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

            Participantes.ForEach(x =>
            {
                
                x.NivelEducativo = _translationService.Traducir(x.NivelEducativo, _idioma);
                x.EstatusUsuario= _translationService.Traducir(x.EstatusUsuario, _idioma);
            });

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
        public OperationResult Post([FromForm] ParticipantesModel ParticipantesModel)
        {
            try
            {
                if (_participantesRepo.Any(x => x.idUsuario == _idUsuarioOnline)) return new OperationResult(false, "Este usuario ya tiene información de participante registrada");
                if (_empresasRepo.Any(x => x.idUsuario == _idUsuarioOnline)) return new OperationResult(false, "Este usuario ya tiene un perfil de empresa registrado");

                var usuario = _usuariosRepo.Get(_idUsuarioOnline);
                if (usuario == null) return new OperationResult(false, "Este usuario no se ha encontrado");

                if (usuario.idPerfil != (int)PerfilesEnum.Sin_perfil) return new OperationResult(false, "Este usuario no tiene permisos para registrarse como participante");

                if (ParticipantesModel.FechaNacimiento > DateOnly.FromDateTime(DateTime.Now)) return new OperationResult(false, "La fecha de nacimiento no puede ser mayor a la fecha actual");

                var age = DateTime.Now.Year - ParticipantesModel.FechaNacimiento.Year;
                if (ParticipantesModel.FechaNacimiento.ToDateTime(TimeOnly.MinValue) > DateTime.Now.AddYears(-age)) age--;
                if (age < 14) return new OperationResult(false, "El participante debe tener al menos 14 años");

                usuario.idPerfil = (int)PerfilesEnum.Participante;
                usuario.idEstatusUsuario = (int)EstatusUsuariosEnum.Activo;

                if (ParticipantesModel.Avatar != null)
                {
                    var logoUrl = _firebaseStorageService.UploadFileAsync(ParticipantesModel.Avatar.OpenReadStream(), $"profile-pictures/{usuario.NombreUsuario}/avatar.jpeg", ParticipantesModel.Avatar.ContentType).Result;
                    usuario.AvatarURL = logoUrl;
                }

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
        [AuthorizeByPermission(PermisosEnum.Administrar_Participantes)]
        public OperationResult Put(int idParticipante, [FromForm] ParticipantesModel ParticipantesModel)
        {
            using (var trx = _crowdSolveContext.Database.BeginTransaction())
            {
                try
                {
                    var Participante = _participantesRepo.Get(x => x.idParticipante == idParticipante).FirstOrDefault();
                    if (Participante == null) return new OperationResult(false, "Este participante no se ha encontrado");

                    var usuario = _usuariosRepo.Get(Participante.idUsuario);
                    if (usuario == null) return new OperationResult(false, "Este usuario no se ha encontrado");

                    if (ParticipantesModel.NombreUsuario != usuario.NombreUsuario && _usuariosRepo.Any(x => x.NombreUsuario == ParticipantesModel.NombreUsuario)) return new OperationResult(false, "Este usuario ya existe en el sistema");
                    if (ParticipantesModel.CorreoElectronico != usuario.CorreoElectronico && _usuariosRepo.Any(x => x.CorreoElectronico == ParticipantesModel.CorreoElectronico)) return new OperationResult(false, "Este correo electrónico ya está registrado");

                    if (ParticipantesModel.Avatar != null)
                    {
                        var logoUrl = _firebaseStorageService.UploadFileAsync(ParticipantesModel.Avatar.OpenReadStream(), $"profile-pictures/{usuario.NombreUsuario}/avatar.jpeg", ParticipantesModel.Avatar.ContentType).Result;
                        usuario.AvatarURL = logoUrl;
                    }

                    usuario.NombreUsuario = ParticipantesModel.NombreUsuario;
                    usuario.CorreoElectronico = ParticipantesModel.CorreoElectronico;
                    usuario.idEstatusUsuario = ParticipantesModel.idEstatusUsuario ?? usuario.idEstatusUsuario;
                    usuario.idPerfil = ParticipantesModel.idPerfil;

                    _usuariosRepo.Edit(usuario);
                    _participantesRepo.Edit(ParticipantesModel);

                    _logger.LogHttpRequest(ParticipantesModel);
                    trx.Commit();
                    return new OperationResult(true, "Se ha editado la información del participante exitosamente", Participante);
                }
                catch (Exception ex)
                {
                    trx.Rollback();
                    _logger.LogError(ex);
                    throw;
                }
            }
        }

        /// <summary>
        /// Obtiene la información del perfil del participante en línea.
        /// </summary>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        [HttpGet("MiPerfil", Name = "GetMiPerfil")]
        [AuthorizeByPermission(PermisosEnum.Mi_perfil)]
        public ParticipantesModel MiPerfil()
        {
            var Participante = _participantesRepo.Get(x => x.idUsuario == _idUsuarioOnline).FirstOrDefault();
            if (Participante == null) throw new Exception("Este participante no se ha encontrado");
            Participante.Soluciones = _solucionesRepo.Get(x => x.idUsuario == _idUsuarioOnline && x.Publica == true).ToList();
            return Participante;
        }

        /// <summary>
        /// Obtiene la información del perfil público de un participante.
        /// </summary>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        [HttpGet("PerfilPublico/{nombreUsuario}", Name = "GetPerfilPublico")]
        public ParticipantesModel GetPerfilPublico(string nombreUsuario)
        {
            var usuario = _usuariosRepo.Get(x => x.NombreUsuario == nombreUsuario).FirstOrDefault();
            if (usuario == null) throw new Exception("Este usuario no se ha encontrado");

            var Participante = _participantesRepo.Get(x => x.idUsuario == usuario.idUsuario).FirstOrDefault();
            if (Participante == null) throw new Exception("Este participante no se ha encontrado");

            Participante.Soluciones = _solucionesRepo.Get(x => x.idUsuario == usuario.idUsuario && x.Publica == true).ToList();
            return Participante;
        }

        /// <summary>
        /// Actualiza el perfil de un participante.
        /// </summary>
        /// <returns></returns>
        [HttpPut("MiPerfil", Name = "UpdatePerfilParticipante")]
        [AuthorizeByPermission(PermisosEnum.Mi_perfil)]
        public OperationResult MiPerfil([FromForm] ParticipantesModel participantesModel)
        {
            using (var trx = _crowdSolveContext.Database.BeginTransaction())
            {
                try
                {
                    var Participante = _participantesRepo.Get(x => x.idUsuario == _idUsuarioOnline).FirstOrDefault();

                    if (Participante == null) return new OperationResult(false, "Este participante no se ha encontrado");
                    if (participantesModel.idParticipante != Participante.idParticipante) return new OperationResult(false, "No tiene permisos para editar este perfil");

                    var usuario = _usuariosRepo.Get(participantesModel.idUsuario);
                    if (usuario == null) return new OperationResult(false, "Este usuario no se ha encontrado");

                    if (participantesModel.Avatar != null)
                    {
                        var logoUrl = _firebaseStorageService.UploadFileAsync(participantesModel.Avatar.OpenReadStream(), $"profile-pictures/{usuario.NombreUsuario}/avatar.jpeg", participantesModel.Avatar.ContentType).Result;
                        usuario.AvatarURL = logoUrl;
                        _usuariosRepo.Edit(usuario);
                    }

                    _participantesRepo.Edit(participantesModel);

                    _logger.LogHttpRequest(participantesModel);
                    trx.Commit();
                    return new OperationResult(true, "Se ha editado su perfil exitosamente", Participante);
                }
                catch (Exception ex)
                {
                    trx.Rollback();
                    _logger.LogError(ex);
                    throw;
                }
            }
        }

        /// <summary>
        /// Obtiene las soluciones de un participante por su ID desde la vista de administrador.
        /// </summary>
        /// <param name="idParticipante">ID del participante.</param>
        /// <returns></returns>
        [HttpGet("GetSolucionesParticipante/{idParticipante}", Name = "GetSolucionesParticipante")]
        [AuthorizeByPermission(PermisosEnum.Administrar_Participantes)]
        public List<SolucionesModel> GetSolucionesParticipante(int idParticipante)
        {
            var participante = _participantesRepo.Get(x => x.idParticipante == idParticipante).FirstOrDefault();

            if (participante == null) throw new Exception("Este participante no se ha encontrado");

            var soluciones = _solucionesRepo.Get(x => x.idUsuario == participante.idUsuario).ToList();

            foreach (var solucion in soluciones)
            {
                solucion.Desafio = _desafiosRepo.Get(x => x.idDesafio == solucion.idDesafio).FirstOrDefault();
                solucion.CantidadVotos = _crowdSolveContext.Set<VotosUsuarios>().Count(x => x.idSolucion == solucion.idSolucion);
            }

            return soluciones;
        }

        [HttpGet("GetRelationalObjects")]
        [Authorize]
        public object GetRelationalObjects()
        {

            var nivelesEducativos = _crowdSolveContext.Set<NivelesEducativo>()
            .Select(te => new NivelesEducativo
            {
                idNivelEducativo = te.idNivelEducativo,
                Nombre = _translationService.Traducir(te.Nombre, _idioma)
            })
            .ToList();

            var estatusUsuarios = _usuariosRepo.GetEstatusUsuarios()
            .Select(e => new EstatusUsuarios
            {
                idEstatusUsuario = e.idEstatusUsuario,
                Nombre = _translationService.Traducir(e.Nombre, _idioma)
            })
            .ToList();

            return new
            {
                nivelesEducativos = nivelesEducativos,
                estatusUsuarios = estatusUsuarios,
                perfilesUsuarios = perfilesUsuarios
            };
        }
    }
}
