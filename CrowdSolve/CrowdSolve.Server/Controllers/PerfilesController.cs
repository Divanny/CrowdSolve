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
    public class PerfilesController : Controller
    {
        private readonly Logger _logger;
        private readonly int _idUsuarioOnline;
        private readonly CrowdSolveContext _crowdSolveContext;
        private readonly PerfilesRepo _perfilesRepo;
        private readonly FirebaseStorageService _firebaseStorageService;
        private readonly FirebaseTranslationService _translationService;
        private readonly string _idioma;

        /// <summary>
        /// Constructor de la clase PerfilesController.
        /// </summary>
        /// <param name="userAccessor"></param>
        /// <param name="crowdSolveContext"></param>
        /// <param name="logger"></param>
        /// <param name="firebaseStorageService"></param>
        public PerfilesController(IUserAccessor userAccessor, CrowdSolveContext crowdSolveContext, Logger logger, FirebaseStorageService firebaseStorageService, FirebaseTranslationService translationService, IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _idUsuarioOnline = userAccessor.idUsuario;
            _crowdSolveContext = crowdSolveContext;
            _firebaseStorageService = firebaseStorageService;
            _translationService = translationService;
            _idioma = httpContextAccessor.HttpContext.Request.Headers["Accept-Language"].ToString() ?? "es";
            _perfilesRepo = new PerfilesRepo(crowdSolveContext, _translationService, _idioma);
        }

        /// <summary>
        /// Obtiene todos los perfiles.
        /// </summary>
        /// <returns>Lista de Perfiles.</returns>
        [HttpGet(Name = "GetPerfiles")]
        [Authorize]
        public List<PerfilesModel> Get()
        {
            List<PerfilesModel> perfiles = _perfilesRepo.Get().ToList();

            perfiles.ForEach(x =>
            {
                x.Nombre = _translationService.Traducir(x.Nombre, _idioma);

                var vistas = _perfilesRepo.GetPermisos(x.idPerfil).ToList();
                vistas.ForEach(v => v.Nombre = _translationService.Traducir(v.Nombre, _idioma));

                x.Vistas = vistas; 
            });

            return perfiles;
        }

        /// <summary>
        /// Obtiene un perfil por su ID.
        /// </summary>
        /// <param name="idPerfil">ID del perfil.</param>
        /// <returns>Perfil encontrado.</returns>
        [HttpGet("{idPerfil}", Name = "GetPerfil")]
        [Authorize]
        public PerfilesModel Get(int idPerfil)
        {
            PerfilesModel? perfil = _perfilesRepo.Get(x => x.idPerfil == idPerfil).FirstOrDefault();

            if (perfil == null) throw new Exception("Este perfil no se ha podido encontrar");
            perfil.Vistas = _perfilesRepo.GetPermisos(perfil.idPerfil).ToList();

            return perfil;
        }

        /// <summary>
        /// Crea un nuevo perfil.
        /// </summary>
        /// <param name="perfilModel">Datos del perfil a crear.</param>
        /// <returns>Resultado de la operación.</returns>
        [HttpPost(Name = "SavePerfil")]
        [Authorize]
        [Obsolete("Este método está obsoleto, los perfiles no se deben crear")]
        public OperationResult Post(PerfilesModel perfilModel)
        {
            try
            {
                if (_perfilesRepo.Any(x => x.Nombre == perfilModel.Nombre))
                {
                    return new OperationResult(false, "Ya existe un perfil con este nombre");
                }

                var created = _perfilesRepo.Add(perfilModel);
                _logger.LogHttpRequest(perfilModel);

                return new OperationResult(true, "Se ha registrado el perfil exitosamente", created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        /// <summary>
        /// Actualiza los perfiles existentes.
        /// </summary>
        /// <param name="perfilesModel">Datos de los perfiles a actualizar.</param>
        /// <returns>Resultado de la operación.</returns>
        [HttpPut(Name = "UpdatePerfil")]
        [Authorize]
        public OperationResult Put(List<PerfilesModel> perfilesModel)
        {
            try
            {
                if (perfilesModel.Count == 0) return new OperationResult(false, "No se ha enviado información para actualizar");

                foreach (var perfilModel in perfilesModel) {
                    var perfil = _perfilesRepo.Get(x => x.idPerfil == perfilModel.idPerfil).FirstOrDefault();

                    if (perfil == null) return new OperationResult(false, $"El perfil '{perfilModel.Nombre}' no se ha encontrado");

                    if (perfil.Nombre != perfilModel.Nombre && _perfilesRepo.Any(x => x.Nombre == perfilModel.Nombre)) return new OperationResult(false, $"Ya existe un perfil con el nombre '{perfilModel.Nombre}'");
                    
                    _perfilesRepo.Edit(perfilModel);
                }

                _logger.LogHttpRequest(perfilesModel);
                return new OperationResult(true, "Se ha editado la información de los perfiles exitosamente", perfilesModel);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        /// <summary>
        /// Elimina un perfil por su ID.
        /// </summary>
        /// <param name="idPerfil">ID de la perfil</param>
        /// <returns>Resultado de la operaicón</returns>
        [HttpDelete("{idPerfil}", Name = "DeletePerfil")]
        [Authorize]
        [Obsolete("Este método está obsoleto, los perfiles no se deben eliminar")]
        public OperationResult Delete(int idPerfil)
        {
            try
            {
                var perfil = _perfilesRepo.Get(x => x.idPerfil == idPerfil).FirstOrDefault();

                if (perfil == null) return new OperationResult(false, "Este perfil no se ha encontrado");

                if (!_perfilesRepo.CanDelete(idPerfil))
                {
                    return new OperationResult(false, "No se puede eliminar este perfil porque tiene usuarios asociados");
                }

                return new OperationResult(true, "Se ha eliminado el perfil exitosamente", perfil);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        /// <summary>
        /// Obtiene los permisos de las vistas.
        /// </summary>
        /// <returns></returns>
        [HttpGet("GetPermisos", Name = "GetPermisos")]
        [Authorize]
        public List<Vistas> GetPermisos()
        {
            return _perfilesRepo.GetPermisos().ToList();
        }
    }
}
