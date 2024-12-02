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
    public class DesafiosController : Controller
    {
        private readonly Logger _logger;
        private readonly int _idUsuarioOnline;
        private readonly CrowdSolveContext _crowdSolveContext;
        private readonly DesafiosRepo _desafiosRepo;
        private readonly SolucionesRepo _solucionesRepo;
        private readonly CategoriasRepo _categoriasRepo;
        private readonly UsuariosRepo _usuariosRepo;
        private readonly EmpresasRepo _empresasRepo;
        private readonly Mailing _mailingService;

        /// <summary>
        /// Constructor de la clase SoportesController.
        /// </summary>
        /// <param name="userAccessor"></param>
        /// <param name="crowdSolveContext"></param>
        /// <param name="logger"></param>
        /// <param name="mailing"></param>
        public DesafiosController(IUserAccessor userAccessor, CrowdSolveContext crowdSolveContext, Logger logger, Mailing mailing)
        {
            _logger = logger;
            _idUsuarioOnline = userAccessor.idUsuario;
            _crowdSolveContext = crowdSolveContext;
            _desafiosRepo = new DesafiosRepo(crowdSolveContext, _idUsuarioOnline);
            _solucionesRepo = new SolucionesRepo(crowdSolveContext, _idUsuarioOnline);
            _usuariosRepo = new UsuariosRepo(crowdSolveContext);
            _empresasRepo = new EmpresasRepo(crowdSolveContext);
            _categoriasRepo = new CategoriasRepo(crowdSolveContext);
            _mailingService = mailing;
        }

        /// <summary>
        /// Obtiene todos los desafíos.
        /// </summary>
        /// <returns>Lista de desafíos.</returns>
        [HttpGet(Name = "GetDesafios")]
        [Authorize]
        public List<DesafiosModel> Get()
        {
            List<DesafiosModel> desafios = _desafiosRepo.Get().ToList();
            desafios.ForEach(desafio =>
            {
                desafio.Categorias = _crowdSolveContext.Set<DesafiosCategoria>().Where(x => x.idDesafio == desafio.idDesafio).ToList();
                desafio.ProcesoEvaluacion = _crowdSolveContext.Set<ProcesoEvaluacion>().Where(x => x.idDesafio == desafio.idDesafio).ToList();
                desafio.Soluciones = _solucionesRepo.Get(x => x.idDesafio == desafio.idDesafio).ToList();
            });

            return desafios;
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

                for (int i = 0; i < desafioModel.ProcesoEvaluacion.Count; i++)
                {
                    var procesoEvaluacionActual = desafioModel.ProcesoEvaluacion[i];

                    if (i == desafioModel.ProcesoEvaluacion.Count - 1) break;

                    var procesoEvaluacionSiguiente = desafioModel.ProcesoEvaluacion[i + 1];
                    if (procesoEvaluacionActual.FechaFinalizacion > procesoEvaluacionSiguiente.FechaFinalizacion) return new OperationResult(false, "La fecha de finalización del proceso de evaluación actual no puede ser mayor a la fecha de finalización del proceso de evaluación siguiente");
                    if (procesoEvaluacionSiguiente.FechaFinalizacion - procesoEvaluacionActual.FechaFinalizacion < TimeSpan.FromDays(5)) return new OperationResult(false, "La fecha de finalización del proceso de evaluación siguiente debe ser al menos 5 días después de la fecha de finalización del proceso de evaluación actual");
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

                for (int i = 0; i < desafioModel.ProcesoEvaluacion.Count; i++)
                {
                    var procesoEvaluacionActual = desafioModel.ProcesoEvaluacion[i];

                    if (i == desafioModel.ProcesoEvaluacion.Count - 1) break;

                    var procesoEvaluacionSiguiente = desafioModel.ProcesoEvaluacion[i + 1];
                    if (procesoEvaluacionActual.FechaFinalizacion > procesoEvaluacionSiguiente.FechaFinalizacion) return new OperationResult(false, "La fecha de finalización del proceso de evaluación actual no puede ser mayor a la fecha de finalización del proceso de evaluación siguiente");
                    if (procesoEvaluacionSiguiente.FechaFinalizacion - procesoEvaluacionActual.FechaFinalizacion < TimeSpan.FromDays(5)) return new OperationResult(false, "La fecha de finalización del proceso de evaluación siguiente debe ser al menos 5 días después de la fecha de finalización del proceso de evaluación actual");
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

                if (proceso.idEstatusProceso != (int)(EstatusProcesoEnum.Desafío_Sin_validar)) return new OperationResult(false, "El desafío ya ha sido validado");

                _desafiosRepo.ValidarDesafio(idDesafio);
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

                var solucion = _solucionesRepo.Get(x => x.idDesafio == idDesafio && x.idUsuario == _idUsuarioOnline).FirstOrDefault();

                desafio.YaParticipo = solucion != null;
            }

            desafio.Categorias = _crowdSolveContext.Set<DesafiosCategoria>().Where(x => x.idDesafio == desafio.idDesafio).ToList();
            desafio.ProcesoEvaluacion = _crowdSolveContext.Set<ProcesoEvaluacion>().Where(x => x.idDesafio == desafio.idDesafio).ToList();
            desafio.Soluciones = _solucionesRepo.Get(x => x.idDesafio == desafio.idDesafio).ToList();

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

                return new OperationResult(true, "Se ha cambiado el estatus al desafío exitosamente");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        [HttpGet("GetRelationalObjects", Name = "GetRelationalObjects")]
        public object GetRelationalObjects(bool allEstatuses = false)
        {
            List<int> estatusProcesoEnums = new List<int>();

            if (!allEstatuses)
            {
                estatusProcesoEnums = new List<int>
                {
                    (int)EstatusProcesoEnum.Desafío_Sin_iniciar, //// ELIMINAR ESTE ESTATUS
                    (int)EstatusProcesoEnum.Desafío_En_progreso,
                    (int)EstatusProcesoEnum.Desafío_En_evaluación,
                    (int)EstatusProcesoEnum.Desafío_En_espera_de_entrega_de_premios,
                    (int)EstatusProcesoEnum.Desafío_Finalizado
                };
            }

            return new
            {
                Categorias = _desafiosRepo.GetCategorias(),
                TiposEvaluacion = _desafiosRepo.GetTiposEvaluacion(),
                EstatusDesafios = (allEstatuses) ? _desafiosRepo.GetEstatusDesafios() : _desafiosRepo.GetEstatusDesafios().Where(x => estatusProcesoEnums.Contains(x.idEstatusProceso)),
            };
        }
    }
}
