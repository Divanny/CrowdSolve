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
    public class SoportesController : Controller
    {
        private readonly Logger _logger;
        private readonly int _idUsuarioOnline;
        private readonly CrowdSolveContext _crowdSolveContext;
        private readonly SoportesRepo _soportesRepo;
        private readonly UsuariosRepo _usuariosRepo;
        private readonly Mailing _mailingService;

        /// <summary>
        /// Constructor de la clase SoportesController.
        /// </summary>
        /// <param name="userAccessor"></param>
        /// <param name="crowdSolveContext"></param>
        /// <param name="logger"></param>
        /// <param name="mailing"></param>
        public SoportesController(IUserAccessor userAccessor, CrowdSolveContext crowdSolveContext, Logger logger, Mailing mailing)
        {
            _logger = logger;
            _idUsuarioOnline = userAccessor.idUsuario;
            _crowdSolveContext = crowdSolveContext;
            _soportesRepo = new SoportesRepo(crowdSolveContext, _idUsuarioOnline);
            _usuariosRepo = new UsuariosRepo(crowdSolveContext);
            _mailingService = mailing;
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
    }
}
