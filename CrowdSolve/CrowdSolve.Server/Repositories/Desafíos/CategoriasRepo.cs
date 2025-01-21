using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Infraestructure;
using CrowdSolve.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace CrowdSolve.Server.Repositories.Autenticación
{
    public class CategoriasRepo : Repository<Categorias, CategoriasModel>
    {
        public CategoriasRepo(DbContext dbContext) : base
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
                                         Icono = p.ClaseIcono
                                     })
        )
        {
        }

        public CategoriasModel Get(int Id)
        {
            var model = base.Get(p => p.idCategoria == Id).FirstOrDefault();
            return model;
        }
        public bool CanDelete(int id)
        {
            return !dbContext.Set<DesafiosCategoria>().Any(x => x.idCategoria == id);
        }
    }
}
