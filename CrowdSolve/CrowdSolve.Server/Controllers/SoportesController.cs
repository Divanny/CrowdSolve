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
    public class SoportesController : Controller
    {
        private readonly Logger _logger;
        private readonly int _idUsuarioOnline;
        private readonly CrowdSolveContext _crowdSolveContext;
        private readonly SoportesRepo _soportesRepo;
        private readonly ProcesosRepo _procesosRepo;
        private readonly UsuariosRepo _usuariosRepo;
        private readonly Mailing _mailingService;
        private readonly FirebaseTranslationService _translationService;
        private readonly string _idioma;

        /// <summary>
        /// Constructor de la clase SoportesController.
        /// </summary>
        /// <param name="userAccessor"></param>
        /// <param name="crowdSolveContext"></param>
        /// <param name="logger"></param>
        /// <param name="mailing"></param>
        public SoportesController(IUserAccessor userAccessor, CrowdSolveContext crowdSolveContext, Logger logger, Mailing mailing, FirebaseTranslationService translationService, IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _idUsuarioOnline = userAccessor.idUsuario;
            _crowdSolveContext = crowdSolveContext;
            _mailingService = mailing;
            _translationService = translationService;
            _idioma = httpContextAccessor.HttpContext.Request.Headers["Accept-Language"].ToString() ?? "es";
            _procesosRepo = new ProcesosRepo(ClasesProcesoEnum.Soporte, crowdSolveContext, _idUsuarioOnline, _translationService, _idioma);
            _soportesRepo = new SoportesRepo(crowdSolveContext, _idUsuarioOnline, _translationService, _idioma);
            _usuariosRepo = new UsuariosRepo(crowdSolveContext, _translationService, _idioma);
        }

        /// <summary>
        /// Obtiene todos los Soportes.
        /// </summary>
        /// <returns>Lista de Soportes.</returns>
        [HttpGet(Name = "GetSoportes")]
        [Authorize]
        public List<SoportesModel> Get()
        {
            List<SoportesModel> soportes = _soportesRepo.Get().ToList();

            soportes.ForEach(x =>
            {
                x.EstatusProcesoNombre = _translationService.Traducir(x.EstatusProcesoNombre, _idioma);
            });
            return soportes;
        }

        /// <summary>
        /// Obtiene un soporte por su ID.
        /// </summary>
        /// <param name="idSoporte">ID del soporte.</param>
        /// <returns>soporte encontrado.</returns>
        [HttpGet("{idSoporte}", Name = "GetSoporte")]
        [Authorize]
        public SoportesModel Get(int idSoporte)
        {
            SoportesModel? soporte = _soportesRepo.Get(x => x.idSoporte == idSoporte).FirstOrDefault();

            if (soporte == null) throw new Exception("Esta solicitud de soporte no se ha encontrado");

            return soporte;
        }

        /// <summary>
        /// Crea una nueva solicitud de soporte (solo para usuarios en línea).
        /// </summary>
        /// <param name="soporteModel">Datos de la solicitud de soporte a crear.</param>
        /// <returns>Resultado de la operación.</returns>
        [HttpPost(Name = "SaveSoporte")]
        [Authorize]
        public OperationResult Post(SoportesModel soporteModel)
        {
            try
            {
                var usuario = _usuariosRepo.Get(_idUsuarioOnline);
                if (usuario == null) return new OperationResult(false, "Este usuario no se ha encontrado");

                soporteModel.Fecha = DateTime.Now;

                var created = _soportesRepo.Add(soporteModel);
                _logger.LogHttpRequest(soporteModel);
                return new OperationResult(true, "Se ha registrado la información del soporte exitosamente", created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        /// <summary>
        /// Actualiza una soporte existente.
        /// </summary>
        /// <param name="soporteModel">Datos del soporte a actualizar.</param>
        /// <returns>Resultado de la operación.</returns>
        [HttpPut(Name = "UpdateSoporte")]
        [Authorize]
        public OperationResult Put(SoportesModel soporteModel)
        {
            try
            {
                var soporte = _soportesRepo.Get(x => x.idSoporte == soporteModel.idSoporte).FirstOrDefault();

                if (soporte == null) return new OperationResult(false, "Esta solicitud de soporte no se ha encontrado");
                if (soporte.idUsuario != soporteModel.idUsuario) return new OperationResult(false, "No tienes permisos para editar este soporte");

                _soportesRepo.Edit(soporteModel);
                _logger.LogHttpRequest(soporteModel);
                return new OperationResult(true, "Se ha editado la información de la solicitud de soporte exitosamente", soporte);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        /// <summary>
        /// Crea una solicitud de soporte a través de contactanos.
        /// </summary>
        /// <param name="soporteModel">Datos de la solicitud de soporte a crear.</param>
        /// <returns>Resultado de la operación.</returns>
        [HttpPost("Contactanos", Name = "Contactanos")]
        [AllowAnonymous]
        public OperationResult Contactanos(SoportesModel soporteModel)
        {
            try
            {
                if (soporteModel == null) return new OperationResult(false, "No se proporcionó información del soporte");

                Dictionary<string, string> errors = new Dictionary<string, string>();

                if (string.IsNullOrEmpty(soporteModel.Nombres))
                {
                    errors.Add("Nombres", "No se proporcionó el nombre del usuario");
                }

                if (string.IsNullOrEmpty(soporteModel.Apellidos))
                {
                    errors.Add("Apellidos", "No se proporcionó el apellido del usuario");
                }

                if (string.IsNullOrEmpty(soporteModel.CorreoElectronico))
                {
                    errors.Add("CorreoElectronico", "No se proporcionó el correo electrónico del usuario");
                }

                if (errors.Count > 0) return new OperationResult(false, "Se encontraron errores en la información proporcionada", errors);

                soporteModel.Fecha = DateTime.Now;
                soporteModel.idUsuario = _idUsuarioOnline;
                var created = _soportesRepo.Add(soporteModel);
                _logger.LogHttpRequest(soporteModel);

                string mailBody = $@"
                    <h1>Gracias por contactarnos</h1>
                    <p>Hemos recibido tu mensaje y uno de nuestros representantes se pondrá en contacto contigo lo antes posible.</p>
                    <p>A continuación, un resumen de tu solicitud:</p>
                    <ul>
                        <li><b>Nombre:</b> {soporteModel.Nombres} {soporteModel.Apellidos}</li>
                        <li><b>Correo electrónico:</b> {soporteModel.CorreoElectronico}</li>
                        <li><b>Mensaje:</b> {soporteModel.Mensaje}</li>
                    </ul>
                    <p>Mientras tanto, si tienes alguna pregunta adicional o deseas agregar más información, no dudes en responder a este correo.</p>
                    <p>¡Gracias nuevamente por confiar en nosotros!</p>";

                _mailingService.SendMail([soporteModel.CorreoElectronico], "Gracias por contactarnos - Hemos recibido tu mensaje", mailBody, MailingUsers.noreply);

                return new OperationResult(true, "Se ha registrado la información del soporte exitosamente", created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        /// <summary>
        /// Me asigna una solicitud de soporte.
        /// </summary>
        /// <param name="idSoporte">ID de la solicitud de soporte.</param>
        /// <returns>Resultado de la operación.</returns>
        [HttpPut("AsignarMe/{idSoporte}")]
        [AuthorizeByPermission(PermisosEnum.Solicitudes_Soportes)]
        public OperationResult AsignarUsuario(int idSoporte)
        {
            try
            {
                var Proceso = _procesosRepo.Get(x => x.idRelacionado == idSoporte).FirstOrDefault();

                if (Proceso == null) return new OperationResult(false, "Esta solicitud de soporte no se ha encontrado");

                if (Proceso.idEstatusProceso != (int)EstatusProcesoEnum.Soporte_Enviada)
                {
                    return new OperationResult(false, "Esta solicitud no está en estado Enviado");
                }

                if (Proceso.idUsuarioAsignado != null)
                {
                    return new OperationResult(false, "Esta solicitud ya esta asignada");
                }

                Proceso.idUsuarioAsignado = _idUsuarioOnline;
                Proceso.idEstatusProceso = (int)EstatusProcesoEnum.Soporte_En_progreso;
                _procesosRepo.Edit(Proceso);

                var soporte = _soportesRepo.Get(x => x.idSoporte == Proceso.idRelacionado).FirstOrDefault();

                string mailBodyEnProceso = $@"
                    <h1>Solicitud de Soporte en Proceso</h1>
                    <p>Tu solicitud está siendo procesada y estamos trabajando en ella con dedicación.</p>
                    <p>Uno de nuestros representantes está a cargo de tu caso y se asegurará de mantenerte informado sobre cualquier actualización.</p>
                    <p>A continuación, un resumen de tu solicitud:</p>
                    <ul>
                        <li><b>Nombre:</b> {soporte.Nombres} {soporte.Apellidos}</li>
                        <li><b>Correo electrónico:</b> {soporte.CorreoElectronico}</li>
                        <li><b>Mensaje:</b> {soporte.Mensaje}</li>
                        <li><b>Fecha Solicitud:</b> {soporte.Fecha}</li>

                    </ul>
                    <p>Si tienes alguna consulta adicional o deseas proporcionar más detalles, no dudes en responder a este correo.</p>
                    <p>¡Gracias por confiar en nosotros!</p>";

                _mailingService.SendMail([soporte.CorreoElectronico], "Gracias por contactarnos - Hemos recibido tu mensaje", mailBodyEnProceso, MailingUsers.noreply);

                _logger.LogHttpRequest(idSoporte);
                return new OperationResult(true, "Se ha asignado la solicitud exitosamente", Proceso);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        /// <summary>
        /// Finaliza una solicitud de soporte.
        /// </summary>
        /// <param name="idSoporte"></param>
        /// <returns></returns>
        [HttpPut("Finalizar/{idSoporte}")]
        [AuthorizeByPermission(PermisosEnum.Solicitudes_Soportes)]
        public OperationResult FinalizarSoporte(int idSoporte)
        {
            try
            {
                var Proceso = _procesosRepo.Get(x => x.idRelacionado == idSoporte).FirstOrDefault();

                if (Proceso == null) return new OperationResult(false, "Esta solicitud de soporte no se ha encontrado");


                if (Proceso.idUsuarioAsignado == null)
                {
                    return new OperationResult(false, "Esta solicitud no esta asignada");
                }

                //var usuarioAsignado = _usuariosRepo.Get(x => x.idUsuario == idUsuarioAsignado).FirstOrDefault();
                if (Proceso.idUsuarioAsignado != _idUsuarioOnline) return new OperationResult(false, "Este usuario no posee este soporte asignado asi que no puede finalizarlo");


                if (Proceso.idEstatusProceso != (int)EstatusProcesoEnum.Soporte_En_progreso)
                {
                    return new OperationResult(false, "Esta solicitud no está en estado En Progreso");
                }

                Proceso.idEstatusProceso = (int)EstatusProcesoEnum.Soporte_Finalizada;
                _procesosRepo.Edit(Proceso);

                var soporte = _soportesRepo.Get(x => x.idSoporte == Proceso.idRelacionado).FirstOrDefault();

                string mailBodySolucionada = $@"
                    <h1>Solicitud de Soporte Solucionada</h1>
                    <p>Nos complace informarte que hemos finalizado el procesamiento de tu solicitud.</p>
                    <p>El representante asignado a tu caso ha confirmado que la situación ha sido resuelta satisfactoriamente y ha sido finalizado en la fecha de {DateTime.Now}.</p>
                    <p>A continuación, un resumen de tu solicitud:</p>
                    <ul>
                        <li><b>Nombre:</b> {soporte.Nombres} {soporte.Apellidos}</li>
                        <li><b>Correo electrónico:</b> {soporte.CorreoElectronico}</li>
                        <li><b>Mensaje:</b> {soporte.Mensaje}</li>
                        <li><b>Fecha Solicitud:</b> {soporte.Fecha}</li>
                    </ul>
                    <p>Si tienes alguna otra consulta o necesitas asistencia adicional, estamos a tu disposición.</p>
                    <p>¡Gracias por permitirnos ayudarte!</p>";


                _mailingService.SendMail([soporte.CorreoElectronico], "Gracias por contactarnos - Hemos recibido tu mensaje", mailBodySolucionada, MailingUsers.noreply);

                _logger.LogHttpRequest(idSoporte);
                return new OperationResult(true, "Se ha asignado la solicitud exitosamente", Proceso);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        /// <summary>
        /// Descarta una solicitud de soporte.
        /// </summary>
        /// <param name="idSoporte"></param>
        /// <returns></returns>
        [HttpPut("Descartar/{idSoporte}")]
        [AuthorizeByPermission(PermisosEnum.Solicitudes_Soportes)]
        public OperationResult DescartarSoporte(int idSoporte)
        {
            try
            {
                var Proceso = _procesosRepo.Get(x => x.idRelacionado == idSoporte).FirstOrDefault();

                if (Proceso == null) return new OperationResult(false, "Esta solicitud de soporte no se ha encontrado");

                if (Proceso.idUsuarioAsignado == null)
                {
                    return new OperationResult(false, "Esta solicitud no esta asignada");
                }

                //var usuarioAsignado = _usuariosRepo.Get(x => x.idUsuario == idUsuarioAsignado).FirstOrDefault();
                if (Proceso.idUsuarioAsignado != _idUsuarioOnline) return new OperationResult(false, "Este usuario no posee este soporte asignado asi que no puede descartarse");


                if (Proceso.idEstatusProceso != (int)EstatusProcesoEnum.Soporte_En_progreso)
                {
                    return new OperationResult(false, "Esta solicitud no está en estado En Progreso");
                }

                Proceso.idEstatusProceso = (int)EstatusProcesoEnum.Soporte_Descartada;
                _procesosRepo.Edit(Proceso);

                var soporte = _soportesRepo.Get(x => x.idSoporte == Proceso.idRelacionado).FirstOrDefault();

                string mailBodyDescartada = $@"
                    <h1>Solicitud de Soporte Descartada</h1>
                    <p>Después de analizar tu solicitud detenidamente, lamentamos informarte que no será posible realizarla.</p>
                    <p>Estamos disponible para aclarar cualquier duda que tengas sobre esta decisión.</p>
                    <p>A continuación, un resumen de tu solicitud:</p>
                    <ul>
                        <li><b>Nombre:</b> {soporte.Nombres} {soporte.Apellidos}</li>
                        <li><b>Correo electrónico:</b> {soporte.CorreoElectronico}</li>
                        <li><b>Mensaje:</b> {soporte.Mensaje}</li>
                    </ul>
                    <p>Agradecemos tu comprensión y estamos a tu disposición para ayudarte con cualquier otra consulta que puedas tener.</p>
                    <p>Gracias por contactarnos.</p>";


                _mailingService.SendMail([soporte.CorreoElectronico], "Gracias por contactarnos - Hemos recibido tu mensaje", mailBodyDescartada, MailingUsers.noreply);

                _logger.LogHttpRequest(idSoporte);
                return new OperationResult(true, "Se ha asignado la solicitud exitosamente", Proceso);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        /// <summary>
        /// Obtiene los objetos relacionales para la vista de soportes.
        /// </summary>
        /// <returns></returns>
        [HttpGet("GetRelationalObjects")]
        public object GetRelationalObjects()
        {
            var estatus = _crowdSolveContext.Set<EstatusProceso>().Where(u=>u.idClaseProceso==(int)ClasesProcesoEnum.Soporte)
                .Select(s => new EstatusProceso
                {
                    Nombre = _translationService.Traducir(s.Nombre, _idioma)
                })
                .ToList(); ;

            var usuarios = _crowdSolveContext.Set<Usuarios>().Where(u=>u.idPerfil==(int)PerfilesEnum.Administrador);


            return new
            {
                estatusProcesos = estatus,
                usuariosAdmin =  usuarios
            };
        }
    }
}
