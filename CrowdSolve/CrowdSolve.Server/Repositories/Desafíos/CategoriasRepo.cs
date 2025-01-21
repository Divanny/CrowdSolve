using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Infraestructure;
using CrowdSolve.Server.Models;
using CrowdSolve.Server.Services;
using Microsoft.EntityFrameworkCore;

namespace CrowdSolve.Server.Repositories.Autenticación
{
    public class CategoriasRepo : Repository<Categorias, CategoriasModel>
    {
        private readonly FirebaseTranslationService _translationService;
        private readonly string _idioma;
        public CategoriasRepo(DbContext dbContext, FirebaseTranslationService translationService, string idioma) : base
        (
            dbContext,
            new ObjectsMapper<CategoriasModel, Categorias>(p => new Categorias()
            {
                idCategoria = p.idCategoria,
                Nombre = p.Nombre,
                Descripcion = p.Descripcion,
                ClaseIcono = p.Icono
            }),
                    (DB, filter) => (from p in DB.Set<Categorias>().Where(filter)
                                     select new CategoriasModel()
                                     {
                                         idCategoria = p.idCategoria,
                                         Nombre = p.Nombre,
                                         Descripcion = p.Descripcion,
                                         CantidadDesafios = dbContext.Set<DesafiosCategoria>().Count(x => x.idCategoria == p.idCategoria),
                                     })
        )
        {
            _translationService = translationService;
            _idioma = idioma;
        }

        public override IEnumerable<CategoriasModel> Get(Func<Categorias, bool> filter = null)
        {
            var categorias = base.Get(filter).ToList();
            foreach (var categoria in categorias)
            {
                categoria.Nombre = _translationService.Traducir(categoria.Nombre, _idioma);
                categoria.Descripcion = _translationService.Traducir(categoria.Descripcion, _idioma);
            }
            return categorias;
        }

        public CategoriasModel Get(int Id)
        {
            var model = base.Get(p => p.idCategoria == Id).FirstOrDefault();
            if (model != null)
            {
                model.Nombre = _translationService.Traducir(model.Nombre, _idioma);
                model.Descripcion = _translationService.Traducir(model.Descripcion, _idioma);
            }
            return model;
        }

        public bool CanDelete(int id)
        {
            return !dbContext.Set<DesafiosCategoria>().Any(x => x.idCategoria == id);
        }
    }
}
