using CrowdSolve.Server.Infraestructure;
using Microsoft.EntityFrameworkCore;

namespace CrowdSolve.Server.Repositories
{
    /// <summary>
    /// Creates methos for a crud with the database, but working with a model class
    /// </summary>
    /// <typeparam name="Entity">Type entity</typeparam>
    /// <typeparam name="Model">Type model</typeparam>
    public class Repository<Entity, Model> : IDisposable where Entity : class where Model : class, new()
    {
        /// <summary>
        /// Definition of the method for queryng
        /// </summary>
        /// <param name="context">DB Context</param>
        /// <param name="filter">Filter, for filtering data</param>
        /// <returns></returns>
        public delegate IEnumerable<Model> QueryDelegate(DbContext context, Func<Entity, bool> filter);

        public DbContext dbContext;
        internal ObjectsMapper<Model, Entity> toEntity;
        public QueryDelegate query;
        //internal Logger logger;
        /// <summary>
        /// Creates a new instance of "DbWorker"
        /// </summary>
        /// <param name="dbContext">DB Context</param>
        /// <param name="toEntity">Function to call for perform a Model to entity mapping</param>
        /// <param name="query">Query Expression to call for fetch the data from the database</param>
        public Repository(DbContext dbContext, ObjectsMapper<Model, Entity> toEntity, QueryDelegate query)
        {
            this.dbContext = dbContext;
            this.toEntity = toEntity;
            this.query = query;
            //logger = new Logger(this.dbContext);
        }
        /// <summary>
        /// Creates a new instance of "DbWorker"
        /// </summary>
        /// <param name="dbContext">DB Context</param>
        /// <param name="query">Query Expression to call for fetch the data from the database</param>
        public Repository(DbContext dbContext, QueryDelegate query)
        {
            this.dbContext = dbContext;
            this.query = query;
            //logger = new Logger(this.dbContext);
        }
        /// <summary>
        /// Adds a new item to the database and return inseted element
        /// </summary>
        /// <param name="model">Model</param>
        /// <returns>Entity</returns>
        public virtual Entity Add(Model model)
        {
            if (toEntity == null) throw new Exception("Objects mapper has not been set");
            var entity = toEntity.Map(model);
            dbContext.Set<Entity>().Attach(entity);
            dbContext.Set<Entity>().Add(entity);

            SaveChanges();

            return entity;
        }
        /// <summary>
        /// Edits an item
        /// </summary>
        /// <param name="model">Model</param>
        public virtual void Edit(Model model)
        {
            if (toEntity == null) throw new Exception("Objects mapper has not been set");
            Entity entity = toEntity.Map(model);
            dbContext.Entry(entity).State = EntityState.Modified;

            SaveChanges();
        }
        /// <summary>
        /// Edits an item with its id
        /// </summary>
        /// <param name="model">Model</param>
        public virtual void Edit(Model model, object id)
        {
            if (toEntity == null) throw new Exception("Objects mapper has not been set");
            Entity entity = dbContext.Set<Entity>().Find(id);
            dbContext.Entry(entity).CurrentValues.SetValues(toEntity.Map(model));

            SaveChanges();
        }
        /// <summary>
        /// Deletes an item
        /// </summary>
        /// <param name="model">Model</param>
        public virtual void Delete(int id)
        {
            Entity entity = dbContext.Set<Entity>().Find(id);
            dbContext.Entry(entity).State = EntityState.Deleted;

            SaveChanges();
        }
        /// <summary>
        /// Gets a collection of model type
        /// </summary>
        /// <returns>IEnumerable<typeparamref name="Model"/></returns>
        public virtual IEnumerable<Model> Get()
        {
            return query(this.dbContext, x => true);
        }
        /// <summary>
        /// Gets a collection of model type filtered
        /// </summary>
        /// <returns>IEnumerable<typeparamref name="Model"/></returns>
        public virtual IEnumerable<Model> Get(Func<Entity, bool> filter)
        {
            return query(this.dbContext, filter);
        }
        /// <summary>
        /// Gets a model element from the database
        /// </summary>
        /// <returns>IEnumerable<typeparamref name="Model"/></returns>
        public virtual Model GetFirst(Func<Entity, bool> filter)
        {
            return query(this.dbContext, filter).FirstOrDefault();

        }
        /// <summary>
        /// Gets a entities collection from the database by a filter
        /// </summary>
        /// <returns>IEnumerable<typeparamref name="Entity"/></returns>
        public IEnumerable<Entity> GetEntities()
        {
            return dbContext.Set<Entity>();
        }
        /// <summary>
        /// Gets a entities collection from the database by a filter
        /// </summary>
        /// <returns>IEnumerable<typeparamref name="Entity"/></returns>
        public IEnumerable<Entity> GetEntities(Func<Entity, bool> filter)
        {
            return dbContext.Set<Entity>().Where(filter);
        }
        /// <summary>
        /// Gets a entity element from the database
        /// </summary>
        /// <returns>IEnumerable<typeparamref name="Entity"/></returns>
        public Entity GetFirstEntity(Func<Entity, bool> filter)
        {
            return dbContext.Set<Entity>().Where(filter).FirstOrDefault();
        }
        /// <summary>
        /// Checks if elements exists with the provided filter
        /// </summary>
        /// <param name="filter">Filter</param>
        /// <returns></returns>
        public bool Any(Func<Entity, bool> filter)
        {
            return dbContext.Set<Entity>().AsNoTracking().Any(filter);
        }
        /// <summary>
        /// Save all changes maded to database
        /// </summary>
        public void SaveChanges()
        {
            dbContext.SaveChanges();
        }
        /// <summary>
        /// Clear all changes been tracked
        /// </summary>
        private void DetachAllEntities()
        {
            var changedEntriesCopy = dbContext.ChangeTracker.Entries()
                .Where(e => e.State == EntityState.Added ||
                            e.State == EntityState.Modified ||
                            e.State == EntityState.Deleted)
                .ToList();

            foreach (var entry in changedEntriesCopy)
                entry.State = EntityState.Detached;
        }
        internal int GetPrimaryKeyValue(Entity entity, string IdFieldName)
        {
            var result = entity
                .GetType()
                .GetProperties()
                .Where(a => a.Name == IdFieldName).FirstOrDefault()?.GetValue(entity) ?? null;

            if (result == null) throw new Exception("Primary key could not be found");
            if (!(result is int)) throw new Exception("Primary key is not an integer type");

            return (int)result;
        }
        /// <summary>
        /// Save a Log on DB with the Model
        /// </summary>
        /// <param name="model"></param>
        /// <exception cref="Exception"></exception>
        public virtual void Log(object model)
        {
            //logger.LogHttpRequest(model);
        }
        /// <summary>
        /// Save a Log on DB with the ID
        /// </summary>
        /// <param name="model"></param>
        /// <exception cref="Exception"></exception>
        public virtual void Log(int id)
        {
            //logger.LogHttpRequest(id);
        }
        /// <summary>
        /// Dispose DB Context instance
        /// </summary>
        public void Dispose()
        {
            dbContext.Dispose();
        }
    }

}
