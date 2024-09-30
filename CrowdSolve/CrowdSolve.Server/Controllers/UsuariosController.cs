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
    public class UsuariosController : Controller
    {
        private readonly Logger _logger;
        private readonly int _idUsuarioOnline;
        private readonly CrowdSolveContext _crowdSolveContext;
        private readonly UsuariosRepo _usuariosRepo;
        private readonly PerfilesRepo _perfilesRepo;

        /// <summary>
        /// Constructor de la clase UsuariosController.
        /// </summary>
        /// <param name="userAccessor"></param>
        /// <param name="crowdSolveContext"></param>
        /// <param name="logger"></param>
        public UsuariosController(IUserAccessor userAccessor, CrowdSolveContext crowdSolveContext, Logger logger)
        {
            _logger = logger;
            _idUsuarioOnline = userAccessor.idUsuario;
            _crowdSolveContext = crowdSolveContext;
            _usuariosRepo = new UsuariosRepo(crowdSolveContext);
            _perfilesRepo = new PerfilesRepo(crowdSolveContext);
        }

        /// <summary>
        /// Obtiene todos los usuarios.
        /// </summary>
        /// <returns>Lista de usuarios.</returns>
        [HttpGet(Name = "GetUsuarios")]
        [Authorize]
        public List<UsuariosModel> Get()
        {
            List<UsuariosModel> usuarios = _usuariosRepo.Get().ToList();
            return usuarios;
        }

        /// <summary>
        /// Obtiene un usuario por su ID.
        /// </summary>
        /// <param name="idUsuario">ID del usuario.</param>
        /// <returns>Usuario encontrado.</returns>
        [HttpGet("{idUsuario}", Name = "GetUsuario")]
        [Authorize]
        public UsuariosModel Get(int idUsuario)
        {
            UsuariosModel usuario = _usuariosRepo.Get(idUsuario);
            return usuario;
        }

        /// <summary>
        /// Crea un nuevo usuario.
        /// </summary>
        /// <param name="usuariosModel">Datos del usuario a crear.</param>
        /// <returns>Resultado de la operación.</returns>
        [HttpPost(Name = "SaveUsuario")]
        //[AuthorizeByPermission(PermisosEnum.Nuevo_Usuario)]
        public OperationResult Post(UsuariosModel usuariosModel)
        {
            try
            {
                if (_usuariosRepo.Any(x => x.NombreUsuario == usuariosModel.NombreUsuario)) return new OperationResult(false, "Este usuario ya existe en el sistema");

                usuariosModel.FechaRegistro = DateTime.Now;

                var created = _usuariosRepo.Add(usuariosModel);
                _logger.LogHttpRequest(usuariosModel);
                return new OperationResult(true, "Usuario creado exitosamente", created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        /// <summary>
        /// Actualiza un usuario existente.
        /// </summary>
        /// <param name="usuariosModel">Datos del usuario a actualizar.</param>
        /// <returns>Resultado de la operación.</returns>
        [HttpPut(Name = "UpdateUsuario")]
        //[AuthorizeByPermission(PermisosEnum.Editar_Usuario)]
        public OperationResult Put(UsuariosModel usuariosModel)
        {
            try
            {
                var usuario = _usuariosRepo.Get(x => x.idUsuario == usuariosModel.idUsuario).FirstOrDefault();

                if (usuario == null) return new OperationResult(false, "El usuario no se ha encontrado");

                _usuariosRepo.Edit(usuariosModel);
                _logger.LogHttpRequest(usuariosModel);
                return new OperationResult(true, "Usuario editado exitosamente", usuario);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        /// <summary>
        /// Completar la información de un usuario.
        /// </summary>
        /// <param name="usuariosModel"></param>
        /// <returns></returns>
        [Authorize]
        [HttpPut("CompletarInformacion", Name = "CompletarInformacion")]
        public OperationResult CompletarInformacionParticipante(UsuariosModel usuariosModel)
        {
            try
            {
                var usuario = _usuariosRepo.Get(x => x.idUsuario == usuariosModel.idUsuario).FirstOrDefault();

                if (usuario == null) return new OperationResult(false, "El usuario no se ha encontrado");

                if (usuario.idEstatusUsuario != (int)EstatusUsuariosEnum.Incompleto) return new OperationResult(false, "El usuario no tiene información pendiente de completar");

                _usuariosRepo.CompletarInformacion(usuariosModel);
                _logger.LogHttpRequest(usuariosModel);

                return new OperationResult(true, "Información completada exitosamente", usuario);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }
    }
}
