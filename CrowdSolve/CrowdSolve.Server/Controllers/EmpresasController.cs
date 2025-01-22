using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Enums;
using CrowdSolve.Server.Infraestructure;
using CrowdSolve.Server.Models;
using CrowdSolve.Server.Repositories;
using CrowdSolve.Server.Services;
using CrowdSolve.Server.Repositories.Autenticación;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;

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
        private readonly DesafiosRepo _desafiosRepo;
        private readonly SolucionesRepo _solucionesRepo;
        private readonly ParticipantesRepo _participantesRepo;
        private readonly UsuariosRepo _usuariosRepo;
        private readonly AdjuntosRepo _adjuntosRepo;
        private readonly NotificacionesRepo _notificacionesRepo;
        private readonly FirebaseStorageService _firebaseStorageService;
        private readonly FirebaseTranslationService _translationService;
        private readonly string _idioma;

        /// <summary>
        /// Constructor de la clase EmpresasController.
        /// </summary>
        /// <param name="userAccessor"></param>
        /// <param name="crowdSolveContext"></param>
        /// <param name="logger"></param>
        /// <param name="firebaseStorageService"></param>
        public EmpresasController(IUserAccessor userAccessor, CrowdSolveContext crowdSolveContext, Logger logger, FirebaseStorageService firebaseStorageService, FirebaseTranslationService translationService, IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _idUsuarioOnline = userAccessor.idUsuario;
            _crowdSolveContext = crowdSolveContext;
            _adjuntosRepo = new AdjuntosRepo(crowdSolveContext);
            _notificacionesRepo = new NotificacionesRepo(crowdSolveContext);
            _firebaseStorageService = firebaseStorageService;
            _translationService = translationService;
            _idioma = httpContextAccessor.HttpContext.Request.Headers["Accept-Language"].ToString() ?? "es";
            _empresasRepo = new EmpresasRepo(crowdSolveContext, _translationService, _idioma);
            _desafiosRepo = new DesafiosRepo(crowdSolveContext, _idUsuarioOnline, _translationService, _idioma);
            _solucionesRepo = new SolucionesRepo(crowdSolveContext, _idUsuarioOnline, _translationService, _idioma);
            _participantesRepo = new ParticipantesRepo(crowdSolveContext, _translationService, _idioma);
            _usuariosRepo = new UsuariosRepo(crowdSolveContext, _translationService, _idioma);
        }

        /// <summary>
        /// Obtiene todos los Empresas.
        /// </summary>
        /// <returns>Lista de Empresas.</returns>
        [HttpGet(Name = "GetEmpresas")]
        [Authorize]
        // [AuthorizeByPermission(PermisosEnum.Ver_Empresas)]
        public List<EmpresasModel> Get()
        {
            List<EmpresasModel> Empresas = _empresasRepo.Get().ToList();

            Empresas.ForEach(x =>
            {
                x.Sector = _translationService.Traducir(x.Sector, _idioma);
                x.TamañoEmpresa = _translationService.Traducir(x.TamañoEmpresa, _idioma);
                x.EstatusUsuario = _translationService.Traducir(x.EstatusUsuario, _idioma);
            });

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
        //[AuthorizeByPermission(PermisosEnum.Crear_Empresa)]
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
                else
                {
                    return new OperationResult(false, "El logo de la empresa es requerido");
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

        /// <summary>
        /// Obtiene todas las empresas activas.
        /// </summary>
        /// <returns> Lista de empresas activas.</returns>
        [HttpGet("GetEmpresasActivas")]
        public List<EmpresasModel> GetEmpresasActivas()
        {
            var empresas = _empresasRepo.Get().Where(x => x.idEstatusUsuario == (int)EstatusUsuariosEnum.Activo).ToList();
            return empresas;
        }

        /// <summary>
        /// Obtiene todas las empresas pendientes de validar.
        /// </summary>
        /// <returns> Lista de empresas pendientes de validar.</returns>
        [HttpGet("GetEmpresasPendientesValidar")]
        [AuthorizeByPermission(PermisosEnum.Administrar_Empresas, PermisosEnum.Solicitudes_Empresas)]
        public List<EmpresasModel> GetEmpresasPendientesValidar()
        {
            var empresas = _empresasRepo.Get()
                .Where(x => x.idEstatusUsuario == (int)EstatusUsuariosEnum.Pendiente_de_validar)
                .ToList();

            empresas.ForEach(x =>
            {
                x.Sector = _translationService.Traducir(x.Sector, _idioma);
                x.TamañoEmpresa = _translationService.Traducir(x.TamañoEmpresa, _idioma);
                x.EstatusUsuario = _translationService.Traducir(x.EstatusUsuario, _idioma);
            });

            return empresas;
        }

        /// <summary>
        /// Obtiene todas las empresas rechazadas.
        /// </summary>
        /// <returns> Lista de empresas rechazadas.</returns>
        [HttpGet("GetEmpresasRechazadas")]
        [AuthorizeByPermission(PermisosEnum.Administrar_Empresas, PermisosEnum.Solicitudes_Empresas)]
        public List<EmpresasModel> GetEmpresasRechazadas()
        {
            var empresas = _empresasRepo.Get().Where(x => x.idEstatusUsuario == (int)EstatusUsuariosEnum.Empresa_rechazada).ToList();
            return empresas;
        }

        /// <summary>
        /// Aprueba una empresa pendiente de validar.
        /// </summary>
        /// <param name="idEmpresa"></param>
        /// <returns> Resultado de la operación.</returns>
        [HttpPut("Aprobar/{idEmpresa}")]
        [AuthorizeByPermission(PermisosEnum.Solicitudes_Empresas)]
        public OperationResult AprobarEmpresa(int idEmpresa)
        {
            try
            {
                var Empresa = _empresasRepo.Get(x => x.idEmpresa == idEmpresa).FirstOrDefault();

                if (Empresa == null) return new OperationResult(false, "Esta empresa no se ha encontrado");

                var usuario = _usuariosRepo.Get(Empresa.idUsuario);
                if (usuario == null) return new OperationResult(false, "Este usuario no se ha encontrado");

                if (Empresa.idEstatusUsuario != (int)EstatusUsuariosEnum.Pendiente_de_validar)
                {
                    return new OperationResult(false, "Esta empresa no está pendiente de validar");
                }

                usuario.idEstatusUsuario = (int)EstatusUsuariosEnum.Activo;
                _usuariosRepo.Edit(usuario);

                _notificacionesRepo.EnviarNotificacion(
                    Empresa.idUsuario,
                    "Se ha aprobado tu empresa",
                    $"Tu empresa {Empresa.Nombre} ha sido aprobada exitosamente"
                );

                _logger.LogHttpRequest(idEmpresa);
                return new OperationResult(true, "Se ha aprobado la empresa exitosamente", Empresa);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        /// <summary>
        /// Rechaza una empresa pendiente de validar.
        /// </summary>
        /// <param name="idEmpresa"></param>
        /// <returns> Resultado de la operación.</returns>
        [HttpPut("Rechazar/{idEmpresa}")]
        [AuthorizeByPermission(PermisosEnum.Solicitudes_Empresas)]
        public OperationResult RechazarEmpresa(int idEmpresa)
        {
            try
            {
                var Empresa = _empresasRepo.Get(x => x.idEmpresa == idEmpresa).FirstOrDefault();

                if (Empresa == null) return new OperationResult(false, "Esta empresa no se ha encontrado");

                var usuario = _usuariosRepo.Get(Empresa.idUsuario);
                if (usuario == null) return new OperationResult(false, "Este usuario no se ha encontrado");

                if (Empresa.idEstatusUsuario != (int)EstatusUsuariosEnum.Pendiente_de_validar)
                {
                    return new OperationResult(false, "Esta empresa no está pendiente de validar");
                }

                usuario.idEstatusUsuario = (int)EstatusUsuariosEnum.Empresa_rechazada;
                _usuariosRepo.Edit(usuario);

                _notificacionesRepo.EnviarNotificacion(
                    Empresa.idUsuario,
                    "Se ha rechazado tu empresa",
                    $"Tu empresa {Empresa.Nombre} ha sido rechazada"
                );

                _logger.LogHttpRequest(idEmpresa);
                return new OperationResult(true, "Se ha rechazado la empresa exitosamente", Empresa);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        [HttpGet("CantidadEmpresas")]
        [AuthorizeByPermission(PermisosEnum.Administrador_Dashboard)]
        public object GetCantidadEmpresa()
        {
            var empresas = _crowdSolveContext.Set<Empresas>().Count();

            var sectoresEmpresas = _crowdSolveContext.Set<Sectores>().Select(s => new
            {
                s.idSector,
                s.Nombre,
                CantidadSector = _crowdSolveContext.Set<Empresas>().Count(e => e.idSector == s.idSector)
            }).ToList();

            var tamañosEmpresas = _crowdSolveContext.Set<TamañosEmpresa>()
                .Select(t => new
                {
                    t.idTamañoEmpresa,
                    t.Nombre,
                    CantidadTamaño = _crowdSolveContext.Set<Empresas>()
                        .Count(e => e.idTamañoEmpresa == t.idTamañoEmpresa)
                })
                .ToList();

            return new
            {
                cantidadEmpresa = empresas,
                tamañosEmpresa = tamañosEmpresas,
                sectores = sectoresEmpresas
            };
        }

        [HttpGet("GetEmpresasOrdenDesafios", Name = "GetEmpresasOrdenDesafios")]
        [AuthorizeByPermission(PermisosEnum.Administrador_Dashboard)]
        public List<EmpresasModel> GetInOrder()
        {
            // Obtén las empresas y ordénalas por 'cantidadDesafios' en orden descendente
            List<EmpresasModel> empresas = _empresasRepo.Get()
                .OrderByDescending(e => e.CantidadDesafios)
                .Take(10).ToList();
            return empresas;
        }


        [HttpGet("GetDashboardData", Name = "GetDashboardData")]
        [AuthorizeByPermission(PermisosEnum.Empresa_Dashboard)]
        public object GetDashboardData()
        {
            var empresaInfo = _empresasRepo.Get(x => x.idUsuario == _idUsuarioOnline).FirstOrDefault();
            if (empresaInfo == null) throw new Exception("Esta empresa no se ha encontrado");

            var desafios = _desafiosRepo.Get(x => x.idEmpresa == empresaInfo.idEmpresa).ToList();
            var idsDesafios = desafios.Select(x => x.idDesafio).ToList();

            foreach (var desafio in desafios)
            {
                desafio.SolucionesPendientes = _desafiosRepo.GetCantidadSolucionesPendientesDesafio(desafio.idDesafio);
                var resultado = _desafiosRepo.ValidarUsuarioPuedeEvaluar(desafio.idDesafio, _idUsuarioOnline);
                desafio.PuedoEvaluar = resultado.Success;
                desafio.EvidenciaRecompensa = _adjuntosRepo.Get(x => x.idProceso == desafio.idProceso).ToList();
                desafio.EstatusDesafio = _translationService.Traducir(desafio.EstatusDesafio, _idioma);
            }

            return new
            {
                empresaInfo,
                desafios,
                totalDesafios = desafios.Count,
                totalParticipaciones = _solucionesRepo.Get(x => idsDesafios.Contains(x.idDesafio)).Count(),
                totalDesafiosSinValidar = _desafiosRepo.Get(x => x.idEmpresa == empresaInfo.idEmpresa).Where(x => x.idEstatusDesafio == (int)EstatusProcesoEnum.Desafío_Sin_validar).Count(),
                totalSolucionesSinEvaluar = _solucionesRepo.Get(x => idsDesafios.Contains(x.idDesafio)).Where(x => x.idEstatusProceso == (int)EstatusProcesoEnum.Solución_Enviada).Count(),
            };
        }

        /// <summary>
        /// Obtiene los objetos relacionales de la empresa.
        /// </summary>
        [HttpGet("GetRelationalObjects")]
        public object GetRelationalObjects()
        {
            var tamañosEmpresa = _crowdSolveContext.Set<TamañosEmpresa>()
                .Select(te => new TamañosEmpresa
                {
                    idTamañoEmpresa = te.idTamañoEmpresa,
                    Nombre = _translationService.Traducir(te.Nombre, _idioma)
                })
                .ToList();

            var sectores = _crowdSolveContext.Set<Sectores>()
                .Select(s => new Sectores
                {
                    idSector = s.idSector,
                    Nombre = _translationService.Traducir(s.Nombre, _idioma)
                })
                .ToList();

            var estatusUsuarios = _usuariosRepo.GetEstatusUsuarios()
            .Select(e => new EstatusUsuarios
            {
                idEstatusUsuario = e.idEstatusUsuario,
                Nombre = _translationService.Traducir(e.Nombre, _idioma)
            })
            .ToList();

            return new
            {
                TamañosEmpresa = tamañosEmpresa,
                Sectores = sectores,
                estatusUsuarios = estatusUsuarios,
            };
        }
    }
}
