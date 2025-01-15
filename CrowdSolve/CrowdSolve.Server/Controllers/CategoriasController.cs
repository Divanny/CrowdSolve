using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Enums;
using CrowdSolve.Server.Infraestructure;
using CrowdSolve.Server.Models;
using CrowdSolve.Server.Repositories.Autenticación;
using CrowdSolve.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace CrowdSolve.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriasController : Controller
    {
        private readonly Logger _logger;
        private readonly int _idUsuarioOnline;
        private readonly CrowdSolveContext _crowdSolveContext;
        private readonly CategoriasRepo _categoriasRepo;
        private readonly FirebaseTranslationService _translationService;
        private readonly string _idioma;

        /// <summary>
        /// Constructor de la clase CategoriasController.
        /// </summary>
        /// <param name="userAccessor"></param>
        /// <param name="crowdSolveContext"></param>
        /// <param name="logger"></param>
        public CategoriasController(IUserAccessor userAccessor, CrowdSolveContext crowdSolveContext, Logger logger, Mailing mailing, FirebaseTranslationService translationService, IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _idUsuarioOnline = userAccessor.idUsuario;
            _crowdSolveContext = crowdSolveContext;
            _translationService = translationService;
            _idioma = httpContextAccessor.HttpContext.Request.Headers["Accept-Language"].ToString() ?? "es";
            _categoriasRepo = new CategoriasRepo(crowdSolveContext, _translationService, _idioma);
        }

        /// <summary>
        /// Obtiene todos las categorías.
        /// </summary>
        /// <returns>Lista de Categorias.</returns>
        [HttpGet(Name = "GetCategorias")]
        //[Authorize]
        public List<CategoriasModel> Get()
        {
            List<CategoriasModel> categorias = _categoriasRepo.Get().ToList();
            return categorias;
        }

        /// <summary>
        /// Obtiene una categoría por su ID.
        /// </summary>
        /// <param name="idCategoria">ID de la categoría.</param>
        /// <returns>Categoría encontrada.</returns>
        [HttpGet("{idCategoria}", Name = "GetCategoria")]
        [Authorize]
        public CategoriasModel Get(int idCategoria)
        {
            CategoriasModel? categoria = _categoriasRepo.Get(x => x.idCategoria == idCategoria).FirstOrDefault();

            if (categoria == null) throw new Exception("Esta categoría no se ha podido encontrar");

            return categoria;
        }

        /// <summary>
        /// Crea una nueva categoría.
        /// </summary>
        /// <param name="categoriaModel">Datos de la categoría a crear.</param>
        /// <returns>Resultado de la operación.</returns>
        [HttpPost(Name = "SaveCategoria")]
        [Authorize]
        public OperationResult Post(CategoriasModel categoriaModel)
        {
            try
            {
                if (_categoriasRepo.Any(x => x.Nombre == categoriaModel.Nombre))
                {
                    return new OperationResult(false, "Ya existe una categoría con este nombre");
                }

                var created = _categoriasRepo.Add(categoriaModel);
                _logger.LogHttpRequest(categoriaModel);

                return new OperationResult(true, "Se ha registrado la categoría exitosamente", created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        /// <summary>
        /// Actualiza una categoría existente.
        /// </summary>
        /// <param name="categoriaModel">Datos de la categoría a actualizar.</param>
        /// <returns>Resultado de la operación.</returns>
        [HttpPut(Name = "UpdateCategoria")]
        [Authorize]
        public OperationResult Put(CategoriasModel categoriaModel)
        {
            try
            {
                var categoria = _categoriasRepo.Get(x => x.idCategoria == categoriaModel.idCategoria).FirstOrDefault();

                if (categoria == null) return new OperationResult(false, "Esta categoría no se ha encontrado");

                if (categoria.Nombre != categoriaModel.Nombre && _categoriasRepo.Any(x => x.Nombre == categoriaModel.Nombre)) return new OperationResult(false, "Ya existe una categoría con este nombre");

                _categoriasRepo.Edit(categoriaModel);
                _logger.LogHttpRequest(categoriaModel);
                return new OperationResult(true, "Se ha editado la información de la categoría exitosamente", categoriaModel);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }

        /// <summary>
        /// Elimina una categoría por su ID.
        /// </summary>
        /// <param name="idCategoria">ID de la categoría</param>
        /// <returns>Resultado de la operaicón</returns>
        [HttpDelete("{idCategoria}", Name = "DeleteCategoria")]
        [Authorize]
        public OperationResult Delete(int idCategoria)
        {
            try
            {
                var categoria = _categoriasRepo.Get(x => x.idCategoria == idCategoria).FirstOrDefault();

                if (categoria == null) return new OperationResult(false, "Esta categoría no se ha encontrado");

                if (!_categoriasRepo.CanDelete(idCategoria))
                {
                    return new OperationResult(false, "No se puede eliminar esta categoría porque tiene desafíos asociados");
                }

                return new OperationResult(true, "Se ha eliminado la categoría exitosamente", categoria);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex);
                throw;
            }
        }
    }
}
