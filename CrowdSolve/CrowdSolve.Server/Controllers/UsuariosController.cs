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

            foreach (var usuario in usuarios)
            {
                usuario.ContraseñaHashed = null;
            }

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

            if (usuario == null) throw new Exception("Este usuario no se ha encontrado");

            usuario.ContraseñaHashed = null;
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

                if (usuario.NombreUsuario != usuariosModel.NombreUsuario && _usuariosRepo.Any(x => x.NombreUsuario == usuariosModel.NombreUsuario)) return new OperationResult(false, "Este usuario ya existe en el sistema");

                if (usuario.CorreoElectronico != usuariosModel.CorreoElectronico && _usuariosRepo.Any(x => x.CorreoElectronico == usuariosModel.CorreoElectronico)) return new OperationResult(false, "Este correo electrónico ya está registrado");

                if (usuario.idPerfil != usuariosModel.idPerfil)
                {
                    var perfil = _perfilesRepo.Get(usuariosModel.idPerfil);
                    if (perfil == null) return new OperationResult(false, "Este perfil no se ha encontrado");
                }

                usuario.NombreUsuario = usuariosModel.NombreUsuario;
                usuario.CorreoElectronico = usuariosModel.CorreoElectronico;
                usuario.idPerfil = usuariosModel.idPerfil;
                usuario.idEstatusUsuario = usuariosModel.idEstatusUsuario;
                usuario.AvatarURL = usuariosModel.AvatarURL;

                _usuariosRepo.Edit(usuario);
                _logger.LogHttpRequest(usuariosModel);

                usuario.ContraseñaHashed = null;
                return new OperationResult(true, "Usuario editado exitosamente", usuario);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        /// <summary>
        /// Obtiene los estatus de los usuarios.
        /// </summary>
        [HttpGet("GetEstatusUsuarios", Name = "GetEstatusUsuarios")]
        [Authorize]
        public List<EstatusUsuarios> GetEstatusUsuarios()
        {
            return _usuariosRepo.GetEstatusUsuarios();
        }
    }
}
