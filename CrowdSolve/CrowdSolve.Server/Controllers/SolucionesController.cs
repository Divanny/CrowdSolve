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
    public class SolucionesController : Controller
    {
        private readonly Logger _logger;
        private readonly int _idUsuarioOnline;
        private readonly CrowdSolveContext _crowdSolveContext;
        private readonly SolucionesRepo _solucionesRepo;
        private readonly DesafiosRepo _desafiosRepo;
        private readonly UsuariosRepo _usuariosRepo;
        private readonly Mailing _mailingService;
        private readonly FirebaseStorageService _firebaseStorageService;

        /// <summary>
        /// Constructor de la clase SoportesController.
        /// </summary>
        /// <param name="userAccessor"></param>
        /// <param name="crowdSolveContext"></param>
        /// <param name="logger"></param>
        /// <param name="mailing"></param>.
        /// <param name="firebaseStorageService"></param>
        public SolucionesController(IUserAccessor userAccessor, CrowdSolveContext crowdSolveContext, Logger logger, Mailing mailing, FirebaseStorageService firebaseStorageService)
        {
            _logger = logger;
            _idUsuarioOnline = userAccessor.idUsuario;
            _crowdSolveContext = crowdSolveContext;
            _solucionesRepo = new SolucionesRepo(crowdSolveContext, _idUsuarioOnline);
            _desafiosRepo = new DesafiosRepo(crowdSolveContext, _idUsuarioOnline);
            _usuariosRepo = new UsuariosRepo(crowdSolveContext);
            _mailingService = mailing;
            _firebaseStorageService = firebaseStorageService;
        }

        /// <summary>
        /// Obtiene todas las soluciones.
        /// </summary>
        /// <returns>Lista de soluciones.</returns>
        [HttpGet(Name = "GetSoluciones")]
        [Authorize]
        public List<SolucionesModel> Get()
        {
            List<SolucionesModel> soluciones = _solucionesRepo.Get().ToList();
            return soluciones;
        }

        /// <summary>
        /// Obtiene todas las soluciones de un desafío.
        /// </summary>
        /// <param name="idDesafio">ID del desafío.</param>
        /// <returns>Lista de soluciones del desafio.</returns>
        [HttpGet("GetSolucionesDesafio/{idDesafio}", Name = "GetSolucionesDesafio")]
        [Authorize]
        public List<SolucionesModel> GetSolucionesDesafio(int idDesafio)
        {
            List<SolucionesModel> soluciones = _solucionesRepo.Get(x => x.idDesafio == idDesafio).ToList();
            return soluciones;
        }

        /// <summary>
        /// Obtiene una solución por su ID.
        /// </summary>
        /// <param name="idSolucion">ID de la solución.</param>
        /// <returns>Solución encontrada.</returns>
        [HttpGet("{idSolucion}", Name = "GetSolucion")]
        [Authorize]
        public IActionResult Get(int idSolucion)
        {
            SolucionesModel? solucion = _solucionesRepo.Get(x => x.idSolucion == idSolucion).FirstOrDefault();

            if (solucion == null)
            {
                return NotFound("Solución no encontrada");
            }

            return Ok(solucion);
        }

        /// <summary>
        /// Guarda una nueva solución.
        /// </summary>
        /// <param name="solucionesModel">Datos de la solución a crear.</param>
        /// <returns>Resultado de la operación.</returns>
        [HttpPost(Name = "SaveSolucion")]
        [Authorize]
        public async Task<OperationResult> Post([FromForm]SolucionesModel solucionesModel)
        {
            try
            {
                var usuario = _usuariosRepo.Get(_idUsuarioOnline);
                if (usuario == null) return new OperationResult(false, "Este usuario no se ha encontrado");

                if (!_desafiosRepo.GetDesafiosEnProgreso().Any(x => x.idDesafio == solucionesModel.idDesafio))
                {
                    return new OperationResult(false, "No se puede enviar una solución a un desafío que no está en progreso");
                }

                solucionesModel.idUsuario = _idUsuarioOnline;

                if (_solucionesRepo.Any(x => x.idDesafio == solucionesModel.idDesafio && x.idUsuario == _idUsuarioOnline))
                {
                    return new OperationResult(false, "Ya ha enviado una solución a este desafío");
                }

                if (solucionesModel.Archivos == null || solucionesModel.Archivos.Length == 0) return new OperationResult(false, "Debe proporcionar al menos un archivo");

                else
                {
                    List<AdjuntosSoluciones> adjuntos = new List<AdjuntosSoluciones>();

                    foreach (var archivo in solucionesModel.Archivos)
                    {
                        var fileNameWithoutExtension = Path.GetFileNameWithoutExtension(archivo.FileName);
                        var logoUrl = await _firebaseStorageService.UploadFileAsync(archivo.OpenReadStream(), $"challenges/{solucionesModel.idDesafio}/solutions/{usuario.idUsuario}/{fileNameWithoutExtension}", archivo.ContentType);

                        adjuntos.Add(new AdjuntosSoluciones
                        {
                            Nombre = archivo.FileName,
                            Tamaño = archivo.Length,
                            ContentType = archivo.ContentType,
                            RutaArchivo = logoUrl,
                            FechaSubida = DateTime.Now
                        });
                    }

                    solucionesModel.Adjuntos = adjuntos;
                }

                var created = _solucionesRepo.Add(solucionesModel);
                _logger.LogHttpRequest(solucionesModel);
                return new OperationResult(true, "Se ha enviado la solución exitosamente", created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        /// <summary>
        /// Actualiza una solución existente.
        /// </summary>
        /// <param name="idSolucion">ID de la solución a actualizar.</param>
        /// <param name="solucionesModel">Datos de la solución a actualizar.</param>
        /// <returns>Resultado de la operación.</returns>
        [HttpPut("{idSolucion}", Name = "UpdateSolucion")]
        [Authorize]
        public async Task<OperationResult> Put(int idSolucion, [FromForm]SolucionesModel solucionesModel)
        {
            try
            {
                var solucion = _solucionesRepo.Get(x => x.idSolucion == idSolucion).FirstOrDefault();
                if (solucion == null) return new OperationResult(false, "Esta solución no se ha encontrado");

                if (solucion.idUsuario != _idUsuarioOnline) return new OperationResult(false, "No tiene permiso para editar esta solución");

                var usuario = _usuariosRepo.Get(_idUsuarioOnline);
                if (usuario == null) return new OperationResult(false, "Este usuario no se ha encontrado");

                if (!_desafiosRepo.GetDesafiosEnProgreso().Any(x => x.idDesafio == solucionesModel.idDesafio))
                {
                    return new OperationResult(false, "No se puede editar una solución de un desafío que no está en progreso");
                }

                solucionesModel.idUsuario = _idUsuarioOnline;

                if (solucionesModel.Archivos != null && solucionesModel.Archivos.Length > 0)
                {
                    List<AdjuntosSoluciones> adjuntos = new List<AdjuntosSoluciones>();

                    if (solucion.Adjuntos != null && solucion.Adjuntos.Count > 0)
                    { 
                        foreach (var adjunto in solucion.Adjuntos)
                        {
                            await _firebaseStorageService.DeleteFileAsync(adjunto.RutaArchivo);
                        }                    
                    }

                    foreach (var archivo in solucionesModel.Archivos)
                    {
                        var fileNameWithoutExtension = Path.GetFileNameWithoutExtension(archivo.FileName);
                        var logoUrl = await _firebaseStorageService.UploadFileAsync(archivo.OpenReadStream(), $"challenges/{solucionesModel.idDesafio}/solutions/{usuario.idUsuario}/{fileNameWithoutExtension}", archivo.ContentType);

                        adjuntos.Add(new AdjuntosSoluciones
                        {
                            idSolucion = solucionesModel.idSolucion,
                            Nombre = archivo.FileName,
                            Tamaño = archivo.Length,
                            ContentType = archivo.ContentType,
                            RutaArchivo = logoUrl,
                            FechaSubida = DateTime.Now
                        });
                    }

                    solucionesModel.Adjuntos = adjuntos;
                }

                _solucionesRepo.Edit(solucionesModel);
                _logger.LogHttpRequest(solucionesModel);
                return new OperationResult(true, "Se ha editado la información de la solución exitosamente", solucionesModel);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        /// <summary>
        /// Convertir solución en pública.
        /// </summary>
        [HttpPut("Publicar/{idSolucion}", Name = "PublicarSolucion")]
        [Authorize]
        public OperationResult Publicar(int idSolucion)
        {
            try
            {
                var solucion = _solucionesRepo.Get(x => x.idSolucion == idSolucion).FirstOrDefault();
                if (solucion == null) return new OperationResult(false, "Esta solución no se ha encontrado");

                if (solucion.idUsuario != _idUsuarioOnline) return new OperationResult(false, "No tiene permiso para editar esta solución");

                solucion.Publica = true;
                _solucionesRepo.Edit(solucion);
                _logger.LogHttpRequest(solucion);
                return new OperationResult(true, "Se ha publicado la solución exitosamente", solucion);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        [HttpGet("GetMisSoluciones", Name = "GetMisSoluciones")]
        [Authorize]
        public List<SolucionesModel> GetMisSoluciones()
        {
            List<SolucionesModel> soluciones = _solucionesRepo.Get(x => x.idUsuario == _idUsuarioOnline).ToList();
            return soluciones;
        }

        [HttpGet("GetSolucionesUsuario", Name = "GetSolucionesUsuario")]
        [AllowAnonymous]
        public List<SolucionesModel> GetSolucionesUsuario(int idUsuario)
        {
            List<SolucionesModel> soluciones = _solucionesRepo.Get(x => x.idUsuario == idUsuario && x.Publica == true).ToList();
            return soluciones;
        }
    }
}
