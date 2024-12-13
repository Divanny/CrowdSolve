using AntiVirus;
using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Enums;
using CrowdSolve.Server.Infraestructure;
using CrowdSolve.Server.Models;
using CrowdSolve.Server.Repositories;
using CrowdSolve.Server.Repositories.Autenticación;
using Google.Apis.Requests.Parameters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage.Json;
using System.Reflection.Metadata.Ecma335;

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
        private readonly AdjuntosRepo _adjuntosRepo;
        private readonly NotificacionesRepo _notificacionesRepo;
        private readonly DesafiosRepo _desafiosRepo;
        private readonly UsuariosRepo _usuariosRepo;
        private readonly Mailing _mailingService;
        private readonly FirebaseStorageService _firebaseStorageService;
        private readonly Scanner _scanner;
        private readonly string _filesTempDir;

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
            _adjuntosRepo = new AdjuntosRepo(crowdSolveContext);
            _desafiosRepo = new DesafiosRepo(crowdSolveContext, _idUsuarioOnline);
            _usuariosRepo = new UsuariosRepo(crowdSolveContext);
            _notificacionesRepo = new NotificacionesRepo(crowdSolveContext);
            _filesTempDir = Path.Combine(Directory.GetCurrentDirectory(), "Temp", "Soluciones");
            _scanner = new Scanner();
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
        /// Sube los archivos de una solución por medio de streaming
        /// </summary>
        /// <param name="filePart"></param>
        /// <param name="guid"></param>
        /// <returns></returns>
        [HttpPost("SubirArchivos/{guid?}", Name = "SubirArchivos")]
        [AuthorizeByPermission(PermisosEnum.Ver_Desafio)]
        public OperationResult Subir([FromForm] IFormFile filePart, string? guid = null)
        {
            var tempDir = Path.Combine(_filesTempDir, _idUsuarioOnline.ToString());

            try
            {
                var fileName = Request.Headers["X-File-Name"].ToString();

                Directory.CreateDirectory(tempDir);

                var currentPart = int.Parse(Request.Headers["X-Part-Number"].ToString());

                Directory.CreateDirectory(Path.Combine(tempDir, "Partes"));

                var tempFilePath = Path.Combine(tempDir, "Partes", $"{fileName}.part{currentPart}");

                using (var fileStream = new FileStream(tempFilePath, FileMode.Create))
                {
                    filePart.CopyTo(fileStream);
                }

                if (Utils.IsLastPart(Request.Headers))
                {
                    guid ??= Guid.NewGuid().ToString();

                    string finalFileDir = Path.Combine(tempDir, guid);

                    Directory.CreateDirectory(finalFileDir);

                    var finalFilePath = Path.Combine(finalFileDir, fileName);

                    using (var finalFileStream = new FileStream(finalFilePath, FileMode.Create))
                    {
                        for (int i = 1; i <= currentPart; i++)
                        {
                            var partFilePath = Path.Combine(tempDir, "Partes", $"{fileName}.part{i}");
                            using (var partFileStream = new FileStream(partFilePath, FileMode.Open))
                            {
                                partFileStream.CopyTo(finalFileStream);
                            }
                        }
                    }

                    Directory.Delete(Path.Combine(tempDir, "Partes"), true);

                    return new OperationResult(true, "Se ha subido el archivo al servidor satisfactoriamente", new { GUID = guid });
                }

                return new OperationResult(true, "Se ha subido una parte");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                Directory.Delete(tempDir, true);
                throw;
            }
        }

        /// <summary>
        /// Guarda una nueva solución.
        /// </summary>
        /// <param name="solucionesModel">Datos de la solución a crear.</param>
        /// <returns>Resultado de la operación.</returns>
        [HttpPost(Name = "SaveSolucion")]
        [Authorize]
        public async Task<OperationResult> Post([FromBody] SolucionesModel solucionesModel)
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

                if (solucionesModel.FileGuids == null || solucionesModel.FileGuids.Length == 0) return new OperationResult(false, "Debe proporcionar al menos un archivo");

                List<AdjuntosModel> adjuntos = new List<AdjuntosModel>();

                foreach (var guid in solucionesModel.FileGuids)
                {
                    var tempDir = Path.Combine(_filesTempDir, _idUsuarioOnline.ToString(), guid);
                    if (!Directory.Exists(tempDir)) return new OperationResult(false, $"No se encontró el archivo temporal con GUID: {guid}");

                    foreach (var filePath in Directory.EnumerateFiles(tempDir))
                    {
                        if (_scanner.ScanAndClean(filePath) == ScanResult.VirusFound)
                        {
                            Directory.Delete(tempDir, true);
                            return new OperationResult(false, "Uno o más archivos contienen virus");
                        }

                        var fileName = Path.GetFileName(filePath);
                        var fileNameWithoutExtension = Path.GetFileNameWithoutExtension(fileName);
                        Stream stream = new FileStream(filePath, FileMode.Open);
                        var url = await _firebaseStorageService.UploadFileAsync(stream, $"challenges/{solucionesModel.idDesafio}/solutions/{usuario.idUsuario}/{fileNameWithoutExtension}", MimeMapping.MimeUtility.GetMimeMapping(fileName));

                        adjuntos.Add(new AdjuntosModel
                        {
                            Nombre = fileName,
                            Tamaño = new FileInfo(filePath).Length,
                            ContentType = MimeMapping.MimeUtility.GetMimeMapping(fileName),
                            RutaArchivo = url,
                            FechaSubida = DateTime.Now,
                            idUsuario = _idUsuarioOnline
                        });

                        stream.Close();

                        System.IO.File.Delete(filePath);
                    }

                    Directory.Delete(tempDir);
                }

                solucionesModel.Adjuntos = adjuntos;

                var created = _solucionesRepo.Add(solucionesModel);
                _logger.LogHttpRequest(solucionesModel);
                return new OperationResult(true, "Se ha enviado la solución exitosamente", created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);

                if (solucionesModel.FileGuids != null && solucionesModel.FileGuids.Length > 0)
                {
                    foreach (var guid in solucionesModel.FileGuids)
                    {
                        var tempDir = Path.Combine(_filesTempDir, _idUsuarioOnline.ToString(), guid);
                        if (Directory.Exists(tempDir))
                        {
                            Directory.Delete(tempDir, true);
                        }
                    }
                }
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
        public async Task<OperationResult> Put(int idSolucion, [FromBody] SolucionesModel solucionesModel)
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

                if (solucionesModel.FileGuids != null && solucionesModel.FileGuids.Length > 0)
                {
                    List<AdjuntosModel> adjuntos = new List<AdjuntosModel>();

                    if (solucion.Adjuntos != null && solucion.Adjuntos.Count > 0)
                    {
                        foreach (var adjunto in solucion.Adjuntos)
                        {
                            await _firebaseStorageService.DeleteFileAsync(adjunto.RutaArchivo);
                        }
                    }

                    foreach (var guid in solucionesModel.FileGuids)
                    {
                        var tempDir = Path.Combine(_filesTempDir, _idUsuarioOnline.ToString(), guid);
                        if (!Directory.Exists(tempDir)) return new OperationResult(false, $"No se encontró el archivo temporal con GUID: {guid}");

                        foreach (var filePath in Directory.EnumerateFiles(tempDir))
                        {
                            if (_scanner.ScanAndClean(filePath) == ScanResult.VirusFound)
                            {
                                Directory.Delete(tempDir, true);
                                return new OperationResult(false, "Uno o más archivos contienen virus");
                            }

                            var fileName = Path.GetFileName(filePath);
                            var fileNameWithoutExtension = Path.GetFileNameWithoutExtension(fileName);
                            Stream stream = new FileStream(filePath, FileMode.Open);
                            var url = await _firebaseStorageService.UploadFileAsync(stream, $"challenges/{solucionesModel.idDesafio}/solutions/{usuario.idUsuario}/{fileNameWithoutExtension}", MimeMapping.MimeUtility.GetMimeMapping(fileName));

                            adjuntos.Add(new AdjuntosModel
                            {
                                idProceso = solucion.idProceso,
                                Nombre = fileName,
                                Tamaño = new FileInfo(filePath).Length,
                                ContentType = MimeMapping.MimeUtility.GetMimeMapping(fileName),
                                RutaArchivo = url,
                                FechaSubida = DateTime.Now
                            });

                            stream.Close();

                            System.IO.File.Delete(filePath);
                        }

                        Directory.Delete(tempDir);
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
                if (solucionesModel.FileGuids != null && solucionesModel.FileGuids.Length > 0)
                {
                    foreach (var guid in solucionesModel.FileGuids)
                    {
                        var tempDir = Path.Combine(_filesTempDir, _idUsuarioOnline.ToString(), guid);
                        if (Directory.Exists(tempDir))
                        {
                            Directory.Delete(tempDir, true);
                        }
                    }
                }
                throw;
            }
        }

        /// <summary>
        /// Le agrega una puntuación del 1 al 100 a una solución. Proceso de Evaluación por puntuación de Empresa.
        /// </summary>
        /// <param name="idSolucion"></param>
        /// <param name="solucionModel"></param>
        /// <returns></returns>
        [HttpPut("Puntuar/{idSolucion}", Name = "PuntuarSolucion")]
        [Authorize]
        public OperationResult Puntuar(int idSolucion, SolucionesModel solucionModel)
        {
            try
            {
                var solucion = _solucionesRepo.Get(x => x.idSolucion == idSolucion).FirstOrDefault();
                if (solucion == null) return new OperationResult(false, "Esta solución no se ha encontrado");

                var desafio = _desafiosRepo.Get(x => x.idDesafio == solucionModel.idDesafio).FirstOrDefault();
                if (desafio == null) return new OperationResult(false, "Este desafío no se ha encontrado");

                var usuario = _usuariosRepo.Get(_idUsuarioOnline);
                if (usuario == null) return new OperationResult(false, "Este usuario no se ha encontrado");

                var puedeEvaluar = _desafiosRepo.ValidarUsuarioPuedeEvaluar(desafio.idDesafio, _idUsuarioOnline);

                if (!puedeEvaluar.Success) return puedeEvaluar;

                if (solucionModel.Puntuacion < 0 || solucionModel.Puntuacion > 100) return new OperationResult(false, "La puntuación debe ser entre 0 y 100");

                _solucionesRepo.PuntuarSolucion(idSolucion, solucionModel.Puntuacion);

                _notificacionesRepo.EnviarNotificacion(
                    solucion.idUsuario, 
                    "Solución evaluada", 
                    $"Tu solución al desafío {desafio.Titulo} ha sido evaluada con una puntuación de <b>{solucionModel.Puntuacion}</b>.", 
                    solucion.idProceso,
                    _crowdSolveContext.Set<Vistas>().Where(x => x.idVista == (int)PermisosEnum.Mis_Soluciones).FirstOrDefault()?.URL ?? string.Empty
                );

                _logger.LogHttpRequest(solucionModel);
                return new OperationResult(true, "Se ha agregado la puntuación a la solución exitosamente", solucionModel);
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

                solucion.Publica = !(solucion.Publica ?? false);
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

        /// <summary>
        /// Agrega un voto a una solución
        /// </summary>
        /// <param name="idSolucion"></param>
        /// <returns></returns>
        [HttpPost("MeGusta/{idSolucion}", Name = "MeGusta")]
        [AuthorizeByPermission(PermisosEnum.Evaluar_Desafío)]
        public OperationResult MeGusta(int idSolucion)
        {
            try
            {
                var solucion = _solucionesRepo.Get(x => x.idSolucion == idSolucion).FirstOrDefault();
                if (solucion == null) return new OperationResult(false, "Esta solución no se ha encontrado");

                if (solucion.idUsuario != _idUsuarioOnline) return new OperationResult(false, "No tiene permiso para editar esta solución");

                _solucionesRepo.MeGusta(idSolucion, _idUsuarioOnline);
                _logger.LogHttpRequest(idSolucion);
                return new OperationResult(true, "Se ha guardado el voto a la solución exitosamente", solucion);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        /// <summary>
        /// Descarga un archivo adjunto de una solución
        /// </summary>
        /// <param name="idAdjunto"></param>
        /// <returns></returns>
        [HttpGet("DescargarAdjunto/{idAdjunto}")]
        [Authorize]
        public async Task<IActionResult> DescargarAdjunto(int idAdjunto)
        {
            try
            {
                var adjunto = _adjuntosRepo.Get().Where(x => x.idAdjunto == idAdjunto).FirstOrDefault();

                if (adjunto == null) return NotFound("No se ha encontrado el adjunto");
                if (adjunto.RutaArchivo == null) return NotFound("No se ha encontrado el adjunto");

                var stream = await _firebaseStorageService.GetFileAsync(adjunto.RutaArchivo);

                _logger.LogHttpRequest(adjunto);
                return File(stream, adjunto.ContentType);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        /// <summary>
        /// Obtiene todas las soluciones enviadas por el usuario que está en línea
        /// </summary>
        /// <returns></returns>
        [HttpGet("GetMisSoluciones", Name = "GetMisSoluciones")]
        [Authorize]
        public List<SolucionesModel> GetMisSoluciones()
        {
            List<SolucionesModel> soluciones = _solucionesRepo.Get(x => x.idUsuario == _idUsuarioOnline).ToList();

            foreach (var solucion in soluciones)
            {
                solucion.Desafio = _desafiosRepo.Get(x => x.idDesafio == solucion.idDesafio).FirstOrDefault();
                solucion.CantidadVotos = _crowdSolveContext.Set<VotosUsuarios>().Count(x => x.idSolucion == solucion.idSolucion);
            }

            return soluciones;
        }

        /// <summary>
        /// Obtiene todas las soluciones enviadas por el usuario que se está consultando. (Solo las públicas)
        /// </summary>
        /// <param name="idUsuario"></param>
        /// <returns></returns>
        [HttpGet("GetSolucionesUsuario", Name = "GetSolucionesUsuario")]
        [AllowAnonymous]
        public List<SolucionesModel> GetSolucionesUsuario(int idUsuario)
        {
            List<SolucionesModel> soluciones = _solucionesRepo.Get(x => x.idUsuario == idUsuario && x.Publica == true).ToList();
            return soluciones;
        }

        /// <summary>
        /// Obtiene la cantidad de soluciones enviadas
        /// </summary>
        [HttpGet("GetCantidadSoluciones", Name = "GetCantidadSoluciones")]
        [AuthorizeByPermission(PermisosEnum.Administrador_Dashboard)]
        public object GetCantidadSoluciones()
        {
            var soluciones = _solucionesRepo.Get().Count();

            return new
            {
                soluciones
            };
        }

        /// <summary>
        /// Cambia el estatus de una solución
        /// </summary>
        /// <param name="idSolucion"></param>
        /// <param name="cambioEstatusModel"></param>
        /// <returns></returns>
        [HttpPut("CambiarEstatus/{idSolucion}", Name = "CambiarEstatusSolucion")]
        [Authorize]
        public OperationResult CambiarEstatus(int idSolucion, CambioEstatusModel cambioEstatusModel)
        {
            try
            {
                var solucion = _solucionesRepo.Get(x => x.idSolucion == idSolucion).FirstOrDefault();

                if (solucion == null) return new OperationResult(false, "Esta solución no se ha encontrado");

                if (cambioEstatusModel == null)
                    return new OperationResult(false, "No se ha especificado la información del nuevo estatus");

                _solucionesRepo.CambiarEstatus(idSolucion, (EstatusProcesoEnum)cambioEstatusModel.idEstatusProceso, cambioEstatusModel.MotivoCambioEstatus);

                var desafio = _desafiosRepo.Get(x => x.idDesafio == solucion.idDesafio).FirstOrDefault();
                var estatus = _crowdSolveContext.Set<EstatusProceso>().FirstOrDefault(x => x.idEstatusProceso == cambioEstatusModel.idEstatusProceso);

                _notificacionesRepo.EnviarNotificacion(
                    solucion.idUsuario, 
                    "Estatus de solución cambiado", 
                    $"El estatus de tu solución al desafío {desafio?.Titulo} ha sido cambiado a <b>{estatus?.Nombre}</b>.", 
                    solucion.idProceso,
                    _crowdSolveContext.Set<Vistas>().Where(x => x.idVista == (int)PermisosEnum.Mis_Soluciones).FirstOrDefault()?.URL ?? string.Empty
                );

                _logger.LogHttpRequest(cambioEstatusModel);
                return new OperationResult(true, "Se ha cambiado el estatus a la solución exitosamente");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }
    }
}
