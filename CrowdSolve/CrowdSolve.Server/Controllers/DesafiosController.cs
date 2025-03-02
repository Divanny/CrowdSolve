﻿using AntiVirus;
using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Enums;
using CrowdSolve.Server.Infraestructure;
using CrowdSolve.Server.Models;
using CrowdSolve.Server.Repositories;
using CrowdSolve.Server.Repositories.Autenticación;
using CrowdSolve.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CrowdSolve.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DesafiosController : Controller
    {
        private readonly Logger _logger;
        private readonly int _idUsuarioOnline;
        private readonly CrowdSolveContext _crowdSolveContext;
        private readonly DesafiosRepo _desafiosRepo;
        private readonly AdjuntosRepo _adjuntosRepo;
        private readonly SolucionesRepo _solucionesRepo;
        private readonly HistorialCambioEstatusRepo _historialCambioEstatusRepo;
        private readonly NotificacionesRepo _notificacionesRepo;
        private readonly UsuariosRepo _usuariosRepo;
        private readonly EmpresasRepo _empresasRepo;
        private readonly Mailing _mailingService;
        private readonly Scanner _scanner;
        private readonly FirebaseStorageService _firebaseStorageService;
        private readonly FirebaseTranslationService _translationService;
        private readonly string _idioma;

        /// <summary>
        /// Constructor de la clase SoportesController.
        /// </summary>
        /// <param name="userAccessor"></param>
        /// <param name="crowdSolveContext"></param>
        /// <param name="logger"></param>
        /// <param name="mailing"></param>
        /// <param name="firebaseStorageService"></param>
        public DesafiosController(IUserAccessor userAccessor, CrowdSolveContext crowdSolveContext, Logger logger, Mailing mailing, FirebaseStorageService firebaseStorageService, FirebaseTranslationService translationService, IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _idUsuarioOnline = userAccessor.idUsuario;
            _crowdSolveContext = crowdSolveContext;
            _adjuntosRepo = new AdjuntosRepo(crowdSolveContext);
            _historialCambioEstatusRepo = new HistorialCambioEstatusRepo(crowdSolveContext);
            _notificacionesRepo = new NotificacionesRepo(crowdSolveContext);
            _mailingService = mailing;
            _scanner = new Scanner();
            _firebaseStorageService = firebaseStorageService;
            _translationService = translationService;
            _idioma = httpContextAccessor.HttpContext.Request.Headers["Accept-Language"].ToString() ?? "es";
            _desafiosRepo = new DesafiosRepo(crowdSolveContext, _idUsuarioOnline, _translationService, _idioma);
            _solucionesRepo = new SolucionesRepo(crowdSolveContext, _idUsuarioOnline, _translationService, _idioma);
            _empresasRepo = new EmpresasRepo(crowdSolveContext, _translationService, _idioma);
            _usuariosRepo = new UsuariosRepo(crowdSolveContext, _translationService, _idioma);
        }

        [HttpGet(Name = "GetDesafios")]
        [Authorize]
        public List<DesafiosModel> Get()
        {
            List<DesafiosModel> desafios = _desafiosRepo.Get().ToList();

            desafios.ForEach(desafio =>
            {
                // Asociar categorías
                desafio.Categorias = _crowdSolveContext.Set<DesafiosCategoria>()
                    .Where(x => x.idDesafio == desafio.idDesafio)
                    .ToList();

                // Asociar procesos de evaluación
                desafio.ProcesoEvaluacion = _crowdSolveContext.Set<ProcesoEvaluacion>()
                    .Where(x => x.idDesafio == desafio.idDesafio)
                    .ToList();


                desafio.Soluciones = _solucionesRepo.Get(x => x.idDesafio == desafio.idDesafio).ToList();
                desafio.EstatusDesafio = _translationService.Traducir(desafio.EstatusDesafio, _idioma);

                // Traducir los estatus en las soluciones, si es necesario
                desafio.Soluciones.ForEach(solucion =>
                {
                    solucion.EstatusProceso = _translationService.Traducir(solucion.EstatusProceso, _idioma);
                });
            });

            return desafios;
        }

        /// <summary>
        /// Obtiene un desafío por su ID desde la vista de administrador.
        /// </summary>
        /// <param name="idDesafio">ID del desafío.</param>
        /// <returns>Desafío encontrado.</returns>
        [HttpGet("GetDesafioAdmin/{idDesafio}", Name = "GetDesafioAdmin")]
        [AuthorizeByPermission(PermisosEnum.Administrador_Ver_Desafíos)]
        public IActionResult GetDesafioAdmin(int idDesafio)
        {
            DesafiosModel? desafio = _desafiosRepo.Get(x => x.idDesafio == idDesafio).FirstOrDefault();

            if (desafio == null)
            {
                return NotFound("Desafío no encontrado");
            }

            desafio.Categorias = _crowdSolveContext.Set<DesafiosCategoria>().Where(x => x.idDesafio == desafio.idDesafio).ToList();
            desafio.ProcesoEvaluacion = _crowdSolveContext.Set<ProcesoEvaluacion>().Where(x => x.idDesafio == desafio.idDesafio).ToList();
            desafio.Soluciones = _solucionesRepo.Get(x => x.idDesafio == desafio.idDesafio).ToList();
            desafio.EvidenciaRecompensa = _adjuntosRepo.Get(x => x.idProceso == desafio.idProceso).ToList();

            return Ok(desafio);
        }

        /// <summary>
        /// Obtiene todos los desafíos validados.
        /// </summary>
        /// <returns>Lista de desafíos validados.</returns>
        [HttpGet("GetDesafiosValidados", Name = "GetDesafiosValidados")]
        public List<DesafiosModel> GetDesafiosValidados()
        {
            List<DesafiosModel> desafios = _desafiosRepo.GetDesafiosValidados().ToList();
            desafios.ForEach(desafio =>
            {
                desafio.Categorias = _crowdSolveContext.Set<DesafiosCategoria>().Where(x => x.idDesafio == desafio.idDesafio).ToList();
                desafio.ProcesoEvaluacion = _crowdSolveContext.Set<ProcesoEvaluacion>().Where(x => x.idDesafio == desafio.idDesafio).ToList();
                desafio.Soluciones = _solucionesRepo.Get(x => x.idDesafio == desafio.idDesafio).ToList();
            });

            return desafios;
        }

        /// <summary>
        /// Obtiene un desafío por su ID.
        /// </summary>
        /// <param name="idDesafio">ID del desafío.</param>
        /// <returns>Desafío encontrado.</returns>
        [HttpGet("{idDesafio}", Name = "GetDesafio")]
        public IActionResult Get(int idDesafio)
        {
            DesafiosModel? desafio = _desafiosRepo.GetDesafiosValidados(x => x.idDesafio == idDesafio).FirstOrDefault();

            if (desafio == null)
            {
                return NotFound("Desafío no encontrado");
            }

            if (_idUsuarioOnline != 0)
            {
                var usuario = _usuariosRepo.Get(_idUsuarioOnline);

                if (usuario == null)
                {
                    return NotFound("Usuario no encontrado");
                }

                var solucion = _solucionesRepo.Get(x => x.idDesafio == idDesafio && x.idUsuario == _idUsuarioOnline).FirstOrDefault();

                desafio.YaParticipo = solucion != null;
            }

            desafio.Categorias = _crowdSolveContext.Set<DesafiosCategoria>().Where(x => x.idDesafio == desafio.idDesafio).ToList();
            desafio.ProcesoEvaluacion = _crowdSolveContext.Set<ProcesoEvaluacion>().Where(x => x.idDesafio == desafio.idDesafio).ToList();
            desafio.Soluciones = _solucionesRepo.Get(x => x.idDesafio == desafio.idDesafio).ToList();

            desafio.Soluciones.ForEach(solucion =>
            {
                solucion.EstatusProceso = _translationService.Traducir(solucion.EstatusProceso, _idioma);
            });

            return Ok(desafio);
        }

        /// <summary>
        /// Crea un nuevo desafio.
        /// </summary>
        /// <param name="desafioModel">Datos del desafio a crear.</param>
        /// <returns>Resultado de la operación.</returns>
        [HttpPost(Name = "SaveDesafio")]
        [AuthorizeByPermission(PermisosEnum.Empresa_Crear_Desafio)]
        public OperationResult Post(DesafiosModel desafioModel)
        {
            try
            {
                var usuario = _usuariosRepo.Get(_idUsuarioOnline);
                if (usuario == null) return new OperationResult(false, "Este usuario no se ha encontrado");

                var empresa = _empresasRepo.GetEmpresasActivas(x => x.idUsuario == _idUsuarioOnline).FirstOrDefault();
                if (empresa == null) return new OperationResult(false, "Este usuario no tiene una empresa asociada o la empresa no está activa");

                desafioModel.idEmpresa = empresa.idEmpresa;

                if (desafioModel == null) return new OperationResult(false, "No se proporcionó información del desafio");

                if (desafioModel.Categorias == null || desafioModel.Categorias.Count == 0) return new OperationResult(false, "No se proporcionó información de las categorías del desafio");
                if (desafioModel.ProcesoEvaluacion == null || desafioModel.ProcesoEvaluacion.Count == 0) return new OperationResult(false, "No se proporcionó información del proceso de evaluación del desafio");

                if (desafioModel.FechaInicio - DateTime.Now < TimeSpan.FromDays(5)) return new OperationResult(false, "La fecha de inicio debe ser al menos 5 días después de la fecha actual");
                if (desafioModel.FechaInicio > desafioModel.FechaLimite) return new OperationResult(false, "La fecha de inicio no puede ser mayor a la fecha de fin");
                if (desafioModel.FechaLimite - desafioModel.FechaInicio < TimeSpan.FromDays(5)) return new OperationResult(false, "La fecha de fin debe ser al menos 5 días después de la fecha de inicio");

                if (desafioModel.ProcesoEvaluacion.Any(ProcesoEvaluacion => ProcesoEvaluacion.FechaFinalizacion <= desafioModel.FechaLimite)) return new OperationResult(false, "La fecha de finalización del proceso de evaluación no puede ser menor o igual a la fecha de fin del desafío");
                if (desafioModel.ProcesoEvaluacion.Any(ProcesoEvaluacion => ProcesoEvaluacion.FechaFinalizacion <= DateTime.Now)) return new OperationResult(false, "La fecha de finalización del proceso de evaluación no puede ser menor o igual a la fecha actual");
                if (desafioModel.ProcesoEvaluacion.Any(ProcesoEvaluacion => ProcesoEvaluacion.idTipoEvaluacion == 0)) return new OperationResult(false, "No se proporcionó información del tipo de evaluación del proceso de evaluación");

                DateTime fechaInicioEvaluacion = desafioModel.FechaLimite.AddDays(_desafiosRepo.diasDespuesFechaFinalizacion);

                for (int i = 0; i < desafioModel.ProcesoEvaluacion.Count; i++)
                {
                    var procesoEvaluacionActual = desafioModel.ProcesoEvaluacion[i];
                    procesoEvaluacionActual.FechaInicio = fechaInicioEvaluacion;

                    if (i == desafioModel.ProcesoEvaluacion.Count - 1) break;

                    var procesoEvaluacionSiguiente = desafioModel.ProcesoEvaluacion[i + 1];
                    if (procesoEvaluacionActual.FechaFinalizacion > procesoEvaluacionSiguiente.FechaFinalizacion) return new OperationResult(false, "La fecha de finalización del proceso de evaluación actual no puede ser mayor a la fecha de finalización del proceso de evaluación siguiente");
                    if (procesoEvaluacionSiguiente.FechaFinalizacion - procesoEvaluacionActual.FechaFinalizacion < TimeSpan.FromDays(5)) return new OperationResult(false, "La fecha de finalización del proceso de evaluación siguiente debe ser al menos 5 días después de la fecha de finalización del proceso de evaluación actual");

                    fechaInicioEvaluacion = procesoEvaluacionActual.FechaFinalizacion.AddDays(1);
                }

                var created = _desafiosRepo.Add(desafioModel);
                _logger.LogHttpRequest(desafioModel);
                return new OperationResult(true, "Se ha registrado el desafío exitosamente", created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        /// <summary>
        /// Actualiza un desafío existente.
        /// </summary>
        /// <param name="desafioModel">Datos del desafío a actualizar.</param>
        /// <returns>Resultado de la operación.</returns>
        [HttpPut(Name = "UpdateDesafio")]
        [AuthorizeByPermission(PermisosEnum.Empresa_Editar_Desafio)]
        public OperationResult Put(DesafiosModel desafioModel)
        {
            try
            {
                var desafio = _desafiosRepo.Get(x => x.idDesafio == desafioModel.idDesafio).FirstOrDefault();
                if (desafio == null) return new OperationResult(false, "Este desafío no se ha encontrado");

                var usuario = _usuariosRepo.Get(_idUsuarioOnline);
                var empresa = _empresasRepo.GetByUserId(_idUsuarioOnline);

                if (usuario.idPerfil == (int)PerfilesEnum.Empresa && empresa.idEmpresa != desafio.idEmpresa) return new OperationResult(false, "Este usuario no tiene permisos para editar este desafío");

                var proceso = _desafiosRepo.procesosRepo.Get(x => x.idRelacionado == desafio.idDesafio).FirstOrDefault();
                if (proceso == null) return new OperationResult(false, "No se ha encontrado el proceso relacionado con este desafío");

                if (proceso.idEstatusProceso != (int)(EstatusProcesoEnum.Desafío_Sin_validar)) return new OperationResult(false, "El desafío ya ha sido validado, no se puede editar");

                if (desafioModel.Categorias == null || desafioModel.Categorias.Count == 0) return new OperationResult(false, "No se proporcionó información de las categorías del desafio");
                if (desafioModel.ProcesoEvaluacion == null || desafioModel.ProcesoEvaluacion.Count == 0) return new OperationResult(false, "No se proporcionó información del proceso de evaluación del desafio");

                if (desafioModel.FechaInicio < desafio.FechaInicio) return new OperationResult(false, "La fecha de inicio no puede ser menor a la fecha de inicio original");
                if (desafioModel.FechaInicio > desafioModel.FechaLimite) return new OperationResult(false, "La fecha de inicio no puede ser mayor a la fecha de fin");
                if (desafioModel.FechaLimite - desafioModel.FechaInicio < TimeSpan.FromDays(5)) return new OperationResult(false, "La fecha de fin debe ser al menos 5 días después de la fecha de inicio");

                if (desafioModel.ProcesoEvaluacion.Any(ProcesoEvaluacion => ProcesoEvaluacion.FechaFinalizacion <= desafioModel.FechaLimite)) return new OperationResult(false, "La fecha de finalización del proceso de evaluación no puede ser menor o igual a la fecha de fin del desafío");
                if (desafioModel.ProcesoEvaluacion.Any(ProcesoEvaluacion => ProcesoEvaluacion.FechaFinalizacion <= DateTime.Now)) return new OperationResult(false, "La fecha de finalización del proceso de evaluación no puede ser menor o igual a la fecha actual");
                if (desafioModel.ProcesoEvaluacion.Any(ProcesoEvaluacion => ProcesoEvaluacion.idTipoEvaluacion == 0)) return new OperationResult(false, "No se proporcionó información del tipo de evaluación del proceso de evaluación");

                DateTime fechaInicioEvaluacion = desafioModel.FechaLimite.AddDays(_desafiosRepo.diasDespuesFechaFinalizacion);

                for (int i = 0; i < desafioModel.ProcesoEvaluacion.Count; i++)
                {
                    var procesoEvaluacionActual = desafioModel.ProcesoEvaluacion[i];
                    procesoEvaluacionActual.FechaInicio = fechaInicioEvaluacion;

                    if (i == desafioModel.ProcesoEvaluacion.Count - 1) break;

                    var procesoEvaluacionSiguiente = desafioModel.ProcesoEvaluacion[i + 1];
                    if (procesoEvaluacionActual.FechaFinalizacion > procesoEvaluacionSiguiente.FechaFinalizacion) return new OperationResult(false, "La fecha de finalización del proceso de evaluación actual no puede ser mayor a la fecha de finalización del proceso de evaluación siguiente");
                    if (procesoEvaluacionSiguiente.FechaFinalizacion - procesoEvaluacionActual.FechaFinalizacion < TimeSpan.FromDays(5)) return new OperationResult(false, "La fecha de finalización del proceso de evaluación siguiente debe ser al menos 5 días después de la fecha de finalización del proceso de evaluación actual");

                    fechaInicioEvaluacion = procesoEvaluacionActual.FechaFinalizacion.AddDays(1);
                }

                _desafiosRepo.Edit(desafioModel);
                _logger.LogHttpRequest(desafioModel);
                return new OperationResult(true, "Se ha editado la información del desafío exitosamente", desafioModel);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        /// <summary>
        /// Obtiene los desafíos sin validar.
        /// </summary>
        /// <returns>Desafíos sin validar</returns>
        [HttpGet("GetDesafiosSinValidar", Name = "GetDesafiosSinValidar")]
        [Authorize]
        public List<DesafiosModel> GetDesafiosSinValidar()
        {
            List<DesafiosModel> desafios = _desafiosRepo.GetDesafiosSinValidar().ToList();
            return desafios;
        }

        /// <summary>
        /// Valida un desafío
        /// </summary>
        /// <returns>Resultado de la operación</returns>
        [HttpPut("Validar/{idDesafio}", Name = "ValidarDesafio")]
        [Authorize]
        public OperationResult ValidarDesafio(int idDesafio)
        {
            try
            {
                var desafio = _desafiosRepo.Get(x => x.idDesafio == idDesafio).FirstOrDefault();
                if (desafio == null) return new OperationResult(false, "Este desafío no se ha encontrado");

                var proceso = _desafiosRepo.procesosRepo.Get(x => x.idRelacionado == desafio.idDesafio).FirstOrDefault();
                if (proceso == null) return new OperationResult(false, "No se ha encontrado el proceso relacionado con este desafío");

                if (proceso.idEstatusProceso != (int)EstatusProcesoEnum.Desafío_Sin_validar) return new OperationResult(false, "El desafío ya ha sido validado");

                _desafiosRepo.ValidarDesafio(idDesafio);

                _notificacionesRepo.EnviarNotificacion(
                    desafio.idUsuarioEmpresa ?? 0,
                    "Se ha validado tu desafío",
                    $"El desafío <b>{desafio.Titulo}</b> ha sido validado exitosamente",
                    desafio.idProceso,
                    _crowdSolveContext.Set<Vistas>().Where(x => x.idVista == (int)PermisosEnum.Empresa_Dashboard).FirstOrDefault()?.URL ?? string.Empty
                );

                return new OperationResult(true, "Se ha validado el desafío exitosamente");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        /// <summary>
        /// Rechazar un desafío
        /// </summary>
        /// <returns>Resultado de la operación</returns>
        [HttpPut("Rechazar/{idDesafio}", Name = "RechazarDesafio")]
        [Authorize]
        public OperationResult RechazarDesafio(int idDesafio, string motivo)
        {
            try
            {
                var desafio = _desafiosRepo.Get(x => x.idDesafio == idDesafio).FirstOrDefault();
                if (desafio == null) return new OperationResult(false, "Este desafío no se ha encontrado");

                var proceso = _desafiosRepo.procesosRepo.Get(x => x.idRelacionado == desafio.idDesafio).FirstOrDefault();
                if (proceso == null) return new OperationResult(false, "No se ha encontrado el proceso relacionado con este desafío");

                if (proceso.idEstatusProceso != (int)(EstatusProcesoEnum.Desafío_Sin_validar)) return new OperationResult(false, "El desafío ya ha sido validado");

                _desafiosRepo.RechazarDesafio(idDesafio, motivo);

                _notificacionesRepo.EnviarNotificacion(
                    desafio.idUsuarioEmpresa ?? 0,
                    "Se ha rechazado tu desafío",
                    $"El desafío <b>{desafio.Titulo}</b> ha sido rechazado por el siguiente motivo:<br/>{motivo}",
                    desafio.idProceso,
                    _crowdSolveContext.Set<Vistas>().Where(x => x.idVista == (int)PermisosEnum.Empresa_Dashboard).FirstOrDefault()?.URL ?? string.Empty
                );

                return new OperationResult(true, "Se ha rechazado el desafío exitosamente");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        /// <summary>
        /// Descartar un desafío
        /// </summary>
        /// <returns>Resultado de la operación</returns>
        [HttpPut("Descartar/{idDesafio}", Name = "DescartarDesafio")]
        [Authorize]
        public OperationResult DescartarDesafio(int idDesafio, string motivo)
        {
            try
            {
                var desafio = _desafiosRepo.Get(x => x.idDesafio == idDesafio).FirstOrDefault();
                if (desafio == null) return new OperationResult(false, "Este desafío no se ha encontrado");

                var proceso = _desafiosRepo.procesosRepo.Get(x => x.idRelacionado == desafio.idDesafio).FirstOrDefault();
                if (proceso == null) return new OperationResult(false, "No se ha encontrado el proceso relacionado con este desafío");

                if (proceso.idEstatusProceso != (int)(EstatusProcesoEnum.Desafío_Sin_validar)) return new OperationResult(false, "El desafío ya ha sido validado");

                _desafiosRepo.DescartarDesafio(idDesafio, motivo);
                return new OperationResult(true, "Se ha descartado el desafío exitosamente");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        /// <summary>
        /// Finalizar un desafío por parte de un administrador
        /// </summary>
        /// <param name="idDesafio"></param>
        /// <returns></returns>
        [HttpPut("Finalizar/{idDesafio}", Name = "FinalizarDesafio")]
        [AuthorizeByPermission(PermisosEnum.Administrar_Desafíos)]
        public OperationResult FinalizarDesafio(int idDesafio)
        {
            try
            {
                var desafio = _desafiosRepo.Get(x => x.idDesafio == idDesafio).FirstOrDefault();
                if (desafio == null) return new OperationResult(false, "Este desafío no se ha encontrado");

                var proceso = _desafiosRepo.procesosRepo.Get(x => x.idRelacionado == desafio.idDesafio).FirstOrDefault();
                if (proceso == null) return new OperationResult(false, "No se ha encontrado el proceso relacionado con este desafío");

                if (proceso.idEstatusProceso != (int)(EstatusProcesoEnum.Desafío_En_espera_de_entrega_de_premios)) return new OperationResult(false, "El desafío no se encuentra en espera de entrega de premios");

                _desafiosRepo.FinalizarDesafio(idDesafio);

                _notificacionesRepo.EnviarNotificacion(
                    desafio.idUsuarioEmpresa ?? 0,
                    "Se ha finalizado tu desafío",
                    $"El desafío <b>{desafio.Titulo}</b> ha sido finalizado exitosamente",
                    desafio.idProceso,
                    _crowdSolveContext.Set<Vistas>().Where(x => x.idVista == (int)PermisosEnum.Empresa_Dashboard).FirstOrDefault()?.URL ?? string.Empty
                );

                return new OperationResult(true, "Se ha finalizado el desafío exitosamente");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        /// <summary>
        /// Cargar la evidencia de la entrega de premios de un desafío
        /// </summary>
        /// <param name="filePart"></param>
        /// <param name="idDesafio"></param>
        /// <returns></returns>
        [HttpPost("CargarEvidencia/{idDesafio}", Name = "CargarEvidencia")]
        [AuthorizeByPermission(PermisosEnum.Empresa_Dashboard)]
        public async Task<OperationResult> CargarEvidencia(IFormFile filePart, string idDesafio)
        {
            var tempDir = Path.Combine(Directory.GetCurrentDirectory(), "Temp", "Evidencia Desafios", _idUsuarioOnline.ToString());

            try
            {
                var desafio = _desafiosRepo.Get(x => x.idDesafio == int.Parse(idDesafio)).Where(x => x.idUsuarioEmpresa == _idUsuarioOnline).FirstOrDefault();

                if (desafio == null) return new OperationResult(false, "Este desafío no se ha encontrado");

                if (filePart == null) return new OperationResult(false, "No se ha proporcionado un archivo");

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
                    var finalFilePath = Path.Combine(tempDir, fileName);

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

                    if (_scanner.ScanAndClean(finalFilePath) == ScanResult.VirusFound)
                    {
                        Directory.Delete(tempDir, true);
                        return new OperationResult(false, "Uno o más archivos contienen virus");
                    }

                    var fileNameWithoutExtension = Path.GetFileNameWithoutExtension(fileName);
                    Stream stream = new FileStream(finalFilePath, FileMode.Open);
                    var url = await _firebaseStorageService.UploadFileAsync(stream, $"challenges/{idDesafio}/prize-evidences/{fileNameWithoutExtension}", MimeMapping.MimeUtility.GetMimeMapping(fileName));

                    AdjuntosModel evidencia = new AdjuntosModel
                    {
                        idProceso = desafio.idProceso,
                        Nombre = fileName,
                        Tamaño = new FileInfo(finalFilePath).Length,
                        ContentType = MimeMapping.MimeUtility.GetMimeMapping(fileName),
                        RutaArchivo = url,
                        FechaSubida = DateTime.Now,
                        idUsuario = _idUsuarioOnline
                    };

                    stream.Close();

                    System.IO.File.Delete(finalFilePath);

                    _adjuntosRepo.Add(evidencia);

                    return new OperationResult(true, "Se han subido el archivo al servidor satisfactoriamente");
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
        /// Descarga la evidencia de la entrega de premios de un desafío
        /// </summary>
        /// <param name="idAdjunto"></param>
        /// <returns></returns>
        [HttpGet("DescargarEvidencia/{idAdjunto}", Name = "DescargarEvidencia")]
        [AuthorizeByPermission(PermisosEnum.Empresa_Dashboard)]
        public async Task<IActionResult> DescargarEvidencia(int idAdjunto)
        {
            try
            {
                var adjunto = _adjuntosRepo.Get(x => x.idAdjunto == idAdjunto).FirstOrDefault();

                if (adjunto == null) return NotFound("Este archivo no se ha encontrado");

                var desafio = _desafiosRepo.Get().Where(x => x.idProceso == adjunto.idProceso).FirstOrDefault();

                if (desafio == null) return NotFound("Este desafío no se ha encontrado");

                if (desafio.idUsuarioEmpresa != _idUsuarioOnline) return Unauthorized("Este usuario no tiene permisos para descargar este archivo");

                if (adjunto.RutaArchivo == null) return NotFound("No se ha encontrado el adjunto");

                if (string.IsNullOrEmpty(adjunto.ContentType))
                {
                    return NotFound("El tipo de contenido del adjunto no se ha encontrado");
                }

                var stream = await _firebaseStorageService.GetFileAsync(adjunto.RutaArchivo);
                return File(stream, adjunto.ContentType);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        /// <summary>
        /// Elimina la evidencia de la entrega de premios de un desafío
        /// </summary>
        /// <param name="idAdjunto"></param>
        /// <returns></returns>
        [HttpDelete("EliminarEvidencia/{idAdjunto}", Name = "EliminarEvidencia")]
        [AuthorizeByPermission(PermisosEnum.Empresa_Dashboard)]
        public OperationResult EliminarEvidencia(int idAdjunto)
        {
            try
            {
                var adjunto = _adjuntosRepo.Get(x => x.idAdjunto == idAdjunto).FirstOrDefault();

                if (adjunto == null) return new OperationResult(false, "Este archivo no se ha encontrado");

                var desafio = _desafiosRepo.Get().Where(x => x.idProceso == adjunto.idProceso).FirstOrDefault();

                if (desafio == null) return new OperationResult(false, "Este desafío no se ha encontrado");

                if (desafio.idUsuarioEmpresa != _idUsuarioOnline) return new OperationResult(false, "Este usuario no tiene permisos para eliminar este archivo");

                _adjuntosRepo.Delete(idAdjunto);

                return new OperationResult(true, "Se ha eliminado esta evidencia satisfactoriamente");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }


        /// <summary>
        /// Obtiene la información de un desafío de la empresa actual.
        /// </summary>
        /// <param name="idDesafio"></param>
        /// <returns></returns>
        [HttpGet("GetMiDesafio/{idDesafio}", Name = "GetMiDesafio")]
        [AuthorizeByPermission(PermisosEnum.Empresa_Editar_Desafio, PermisosEnum.Empresa_Ver_Desafio, PermisosEnum.Empresa_Ver_Solucion_Desafio, PermisosEnum.Empresa_Ver_Soluciones_Desafio, PermisosEnum.Empresa_Dashboard)]
        public IActionResult GetMiDesafio(int idDesafio)
        {
            DesafiosModel? desafio = _desafiosRepo.Get(x => x.idDesafio == idDesafio).Where(x => x.idUsuarioEmpresa == _idUsuarioOnline).FirstOrDefault();

            if (desafio == null)
            {
                return NotFound("Desafío no encontrado");
            }

            if (_idUsuarioOnline != 0)
            {
                var usuario = _usuariosRepo.Get(_idUsuarioOnline);

                if (usuario == null)
                {
                    return NotFound("Usuario no encontrado");
                }
            }

            desafio.Categorias = _crowdSolveContext.Set<DesafiosCategoria>().Where(x => x.idDesafio == desafio.idDesafio).ToList();
            desafio.ProcesoEvaluacion = _crowdSolveContext.Set<ProcesoEvaluacion>().Where(x => x.idDesafio == desafio.idDesafio).ToList();
            desafio.Soluciones = _solucionesRepo.Get(x => x.idDesafio == desafio.idDesafio).ToList();

            desafio.Soluciones.ForEach(solucion =>
            {
                solucion.EstatusProceso = _translationService.Traducir(solucion.EstatusProceso, _idioma);
            });

            return Ok(desafio);
        }


        /// <summary>
        /// Indica si el usuario puede participar en el proceso de evaluación de un desafío.
        /// </summary>
        /// <param name="idDesafio"></param>
        /// <returns></returns>
        [HttpGet("PuedoEvaluar/{idDesafio}", Name = "PuedoEvaluarDesafio")]
        public OperationResult PuedoEvaluarDesafio(int idDesafio)
        {
            try
            {
                if (_idUsuarioOnline == 0) return new OperationResult(false, "Debe iniciar sesión para validar el desafío");
                return _desafiosRepo.ValidarUsuarioPuedeEvaluar(idDesafio, _idUsuarioOnline);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        /// <summary>
        /// Cambia el estatus de un desafío
        /// </summary>
        /// <param name="idDesafio"></param>
        /// <param name="cambioEstatusModel"></param>
        /// <returns></returns>
        [HttpPut("CambiarEstatus/{idDesafio}", Name = "CambiarEstatusDesafio")]
        [Authorize]
        public OperationResult CambiarEstatus(int idDesafio, CambioEstatusModel cambioEstatusModel)
        {
            try
            {
                var desafio = _desafiosRepo.Get(x => x.idDesafio == idDesafio).FirstOrDefault();

                if (desafio == null) return new OperationResult(false, "Este desafío no se ha encontrado");

                if (cambioEstatusModel == null)
                    return new OperationResult(false, "No se ha especificado la información del nuevo estatus");

                _desafiosRepo.CambiarEstatus(idDesafio, (EstatusProcesoEnum)cambioEstatusModel.idEstatusProceso, cambioEstatusModel.MotivoCambioEstatus);

                var estatus = _crowdSolveContext.Set<EstatusProceso>().Where(x => x.idEstatusProceso == cambioEstatusModel.idEstatusProceso).FirstOrDefault();

                if (estatus == null) return new OperationResult(false, "El estatus especificado no se ha encontrado");

                string mensajeCambioEstatus = $"El estatus del desafío <b>{desafio.Titulo}</b> ha sido cambiado a <b>{estatus.Nombre}</b>";

                if (estatus.RequiereMotivo)
                {
                    mensajeCambioEstatus = $"El estatus del desafío <b>{desafio.Titulo}</b> ha sido cambiado a <b>{estatus.Nombre}</b> por el siguiente motivo:<br/>{cambioEstatusModel.MotivoCambioEstatus}";
                }

                _notificacionesRepo.EnviarNotificacion(
                    desafio.idUsuarioEmpresa ?? 0,
                    "Se ha cambiado el estatus de tu desafío",
                    mensajeCambioEstatus,
                    desafio.idProceso,
                    _crowdSolveContext.Set<Vistas>().Where(x => x.idVista == (int)PermisosEnum.Empresa_Dashboard).FirstOrDefault()?.URL ?? string.Empty
                );

                return new OperationResult(true, "Se ha cambiado el estatus al desafío exitosamente");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        /// <summary>
        /// Obtiene los desafíos de la landing page
        /// </summary>
        /// <returns></returns>
        [HttpGet("GetDesafiosLandingPage", Name = "GetDesafiosLandingPage")]
        public List<DesafiosModel> GetDesafiosLandingPage()
        {
            List<DesafiosModel> desafios = _desafiosRepo.GetDesafiosValidados().Take(6).ToList();
            desafios.ForEach(desafio =>
            {
                desafio.Categorias = _crowdSolveContext.Set<DesafiosCategoria>().Where(x => x.idDesafio == desafio.idDesafio).ToList();
                desafio.Soluciones = _solucionesRepo.Get(x => x.idDesafio == desafio.idDesafio).ToList();
            });

            return desafios;
        }

        /// <summary>
        /// Obtiene la cantidad de desafios existentes
        /// </summary>
        /// <returns></returns>
        [HttpGet("DesafioDashboardData", Name = "DesafioDashboardData")]
        public object GetDashboardData()
        {
            var desafios = _desafiosRepo.Get().Count();
            return desafios;
        }

        /// <summary>
        /// Obtiene el historial de cambios de estatus de un desafío
        /// </summary>
        /// <param name="idDesafio"></param>
        /// <returns></returns>
        [HttpGet("HistorialCambioEstatus/{idDesafio}", Name = "HistorialCambioEstatus")]
        [AuthorizeByPermission(PermisosEnum.Empresa_Ver_Desafio)]
        public List<HistorialCambioEstatusModel> HistorialCambioEstatus(int idDesafio)
        {
            var desafio = _desafiosRepo.Get(x => x.idDesafio == idDesafio).FirstOrDefault();

            if (desafio == null) return new List<HistorialCambioEstatusModel>();

            return _historialCambioEstatusRepo.Get(x => x.idProceso == desafio.idProceso).ToList();
        }

        [HttpGet("GetRanking/{idDesafio}", Name = "GetRankingDesafio")]
        [Authorize]
        public List<SolucionesModel> GetRanking(int idDesafio)
        {
            var desafio = _desafiosRepo.Get(x => x.idDesafio == idDesafio).FirstOrDefault();

            if (desafio == null) return new List<SolucionesModel>();

            var ranking = _desafiosRepo.GetRanking(idDesafio).ToList();
            return ranking;
        }

        [HttpGet("GetCountForDate", Name = "GetCountForDate")]
        [AuthorizeByPermission(PermisosEnum.Administrador_Dashboard)]
        public object GetCount()
        {
            var desafio = _desafiosRepo.Get().Where(x => x.FechaRegistro != null)
                .GroupBy(x => new
                {
                    Month = x.FechaRegistro.Value.ToString("MMMM"),
                    Year = x.FechaRegistro.Value.Year
                })
                .OrderByDescending(g => g.Key.Year)
                .ThenByDescending(g => g.Key.Month)
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Count = g.Count(),
                })
                .ToList();

            if (desafio == null)
            {
                return NotFound("No Existen Desafios");
            }

            return desafio;
        }

        [HttpGet("GetRelationalObjects", Name = "GetRelationalObjects")]
        public object GetRelationalObjects(bool allEstatuses = false)
        {
            List<int> estatusProcesoEnums = new List<int>();

            if (!allEstatuses)
            {
                estatusProcesoEnums = new List<int>
        {
            (int)EstatusProcesoEnum.Desafío_En_progreso,
            (int)EstatusProcesoEnum.Desafío_En_evaluación,
            (int)EstatusProcesoEnum.Desafío_En_espera_de_entrega_de_premios,
            (int)EstatusProcesoEnum.Desafío_Finalizado
        };
            }

            var categorias = _desafiosRepo.GetCategorias();
            foreach (var categoria in categorias)
            {
                categoria.Nombre = _translationService.Traducir(categoria.Nombre, _idioma);
                categoria.Descripcion = _translationService.Traducir(categoria.Descripcion, _idioma);
            }

            var tiposEvaluaciones = _desafiosRepo.GetTiposEvaluacion();
            foreach (var tipoEvaluacion in tiposEvaluaciones)
            {
                tipoEvaluacion.Nombre = _translationService.Traducir(tipoEvaluacion.Nombre, _idioma);
            }

            var estatusDesafios = _desafiosRepo.GetEstatusDesafios();
            if (!allEstatuses)
            {
                estatusDesafios = estatusDesafios.Where(x => estatusProcesoEnums.Contains(x.idEstatusProceso)).ToList();
            }

            foreach (var estatusDesafio in estatusDesafios)
            {
                estatusDesafio.Nombre = _translationService.Traducir(estatusDesafio.Nombre, _idioma);
            }

            var estatusProcesoEvaluacion = _crowdSolveContext.Set<EstatusProceso>()
                .Where(x => x.idClaseProceso == (int)ClasesProcesoEnum.Proceso_de_Evaluación)
                .ToList();

            foreach (var estatusProceso in estatusProcesoEvaluacion)
            {
                estatusProceso.Nombre = _translationService.Traducir(estatusProceso.Nombre, _idioma);
            }

            return new
            {
                DiasDespuesFechaFinalizacion = _desafiosRepo.diasDespuesFechaFinalizacion,
                Categorias = categorias,
                TiposEvaluacion = tiposEvaluaciones,
                EstatusDesafios = estatusDesafios,
                EstatusProcesoEvaluacion = estatusProcesoEvaluacion
            };
        }

    }
}
