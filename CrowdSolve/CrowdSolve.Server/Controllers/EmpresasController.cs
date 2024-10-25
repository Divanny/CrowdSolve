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
    public class EmpresasController : Controller
    {
        private readonly Logger _logger;
        private readonly int _idUsuarioOnline;
        private readonly CrowdSolveContext _crowdSolveContext;
        private readonly EmpresasRepo _empresasRepo;
        private readonly ParticipantesRepo _participantesRepo;
        private readonly UsuariosRepo _usuariosRepo;
        private readonly FirebaseStorageService _firebaseStorageService;

        /// <summary>
        /// Constructor de la clase EmpresasController.
        /// </summary>
        /// <param name="userAccessor"></param>
        /// <param name="crowdSolveContext"></param>
        /// <param name="logger"></param>
        public EmpresasController(IUserAccessor userAccessor, CrowdSolveContext crowdSolveContext, Logger logger, FirebaseStorageService firebaseStorageService)
        {
            _logger = logger;
            _idUsuarioOnline = userAccessor.idUsuario;
            _crowdSolveContext = crowdSolveContext;
            _empresasRepo = new EmpresasRepo(crowdSolveContext);
            _participantesRepo = new ParticipantesRepo(crowdSolveContext);
            _usuariosRepo = new UsuariosRepo(crowdSolveContext);
            _firebaseStorageService = firebaseStorageService;
        }

        /// <summary>
        /// Obtiene todos los Empresas.
        /// </summary>
        /// <returns>Lista de Empresas.</returns>
        [HttpGet(Name = "GetEmpresas")]
        public List<EmpresasModel> Get()
        {
            List<EmpresasModel> Empresas = _empresasRepo.Get().ToList();
            return Empresas;
        }

        /// <summary>
        /// Obtiene un Empresa por su ID.
        /// </summary>
        /// <param name="idEmpresa">ID del Empresa.</param>
        /// <returns>Empresa encontrado.</returns>
        [HttpGet("{idEmpresa}", Name = "GetEmpresa")]
        public EmpresasModel Get(int idEmpresa)
        {
            EmpresasModel? Empresa = _empresasRepo.Get(x => x.idEmpresa == idEmpresa).FirstOrDefault();

            if (Empresa == null) throw new Exception("Esta empresa no se ha encontrado");

            return Empresa;
        }

        /// <summary>
        /// Crea una nueva empresa.
        /// </summary>
        /// <param name="empresasModel">Datos de la empresa a crear.</param>
        /// <returns>Resultado de la operación.</returns>
        [HttpPost(Name = "SaveEmpresa")]
        [Authorize]
        public OperationResult Post([FromForm] EmpresasModel empresasModel)
        {
            try
            {
                if (_empresasRepo.Any(x => x.Nombre == empresasModel.Nombre)) return new OperationResult(false, "Esta empresa ya existe en el sistema");

                if (_empresasRepo.Any(x => x.idUsuario == empresasModel.idUsuario)) return new OperationResult(false, "Este usuario ya tiene una empresa registrada");

                if (_participantesRepo.Any(x => x.idUsuario == empresasModel.idUsuario)) return new OperationResult(false, "Este usuario ya tiene un perfil de participante registrado");

                var usuario = _usuariosRepo.Get(empresasModel.idUsuario);
                if (usuario == null) return new OperationResult(false, "Este usuario no se ha encontrado");

                usuario.idPerfil = (int)PerfilesEnum.Empresa;
                usuario.idEstatusUsuario = (int)EstatusUsuariosEnum.Pendiente_de_validar;

                if (empresasModel.Avatar != null)
                {
                    var logoUrl = _firebaseStorageService.UploadFileAsync(empresasModel.Avatar.OpenReadStream(), $"companies/{empresasModel.Nombre}/logo", empresasModel.Avatar.ContentType).Result;
                    usuario.AvatarURL = logoUrl;
                }

                _usuariosRepo.Edit(usuario);
                var created = _empresasRepo.Add(empresasModel);
                _logger.LogHttpRequest(empresasModel);
                return new OperationResult(true, "La solicitud de creación de la empresa ha sido enviada. Se validará y activará la cuenta.", created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        /// <summary>
        /// Actualiza una empresa existente.
        /// </summary>
        /// <param name="empresasModel">Datos de la empresa a actualizar.</param>
        /// <returns>Resultado de la operación.</returns>
        [HttpPut(Name = "UpdateEmpresa")]
        [Authorize]
        //[AuthorizeByPermission(PermisosEnum.Editar_Empresa)]
        public OperationResult Put(EmpresasModel empresasModel)
        {
            try
            {
                var Empresa = _empresasRepo.Get(x => x.idEmpresa == empresasModel.idEmpresa).FirstOrDefault();

                if (Empresa == null) return new OperationResult(false, "Esta empresa no se ha encontrado");
                if (Empresa.idUsuario != empresasModel.idUsuario) return new OperationResult(false, "No tienes permisos para editar esta empresa");

                var usuario = _usuariosRepo.Get(empresasModel.idUsuario);
                if (usuario == null) return new OperationResult(false, "Este usuario no se ha encontrado");

                if (empresasModel.Avatar != null)
                {
                    var logoUrl = _firebaseStorageService.UploadFileAsync(empresasModel.Avatar.OpenReadStream(), $"companies/{empresasModel.Nombre}/logo", empresasModel.Avatar.ContentType).Result;
                    usuario.AvatarURL = logoUrl;
                }
                
                _usuariosRepo.Edit(usuario);
                _empresasRepo.Edit(empresasModel);
                _logger.LogHttpRequest(empresasModel);
                return new OperationResult(true, "Se ha editado la información de la empresa exitosamente", Empresa);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        [HttpGet("GetRelationalObjects")]
        public object GetRelationalObjects()
        {
            var tamañosEmpresa = _crowdSolveContext.Set<TamañosEmpresa>();
            var sectores = _crowdSolveContext.Set<Sectores>();

            return new
            {
                tamañosEmpresa = tamañosEmpresa,
                sectores = sectores
            };
        }
    }
}
