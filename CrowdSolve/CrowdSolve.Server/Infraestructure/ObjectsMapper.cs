namespace CrowdSolve.Server.Infraestructure
{
    /// <summary>
    /// Maps an object properties to another object
    /// </summary>
    /// <typeparam name="tIn">Type in</typeparam>
    /// <typeparam name="tOut">Type Result</typeparam>
    public class ObjectsMapper<tIn, tOut> where tOut : class
    {
        public delegate tOut MapCallback(tIn tIn);
        private MapCallback MapCB;
        /// <summary>
        /// Constructor, requires a mapping callback
        /// </summary>
        /// <param name="MapCB">Mapping callback</param>
        public ObjectsMapper(MapCallback MapCB)
        {
            this.MapCB = MapCB;
        }
        /// <summary>
        /// Makes a mapping
        /// </summary>
        /// <param name="tIn">Type in</param>
        /// <returns>Type result</returns>
        public tOut Map(tIn tIn)
        {
            return this.MapCB(tIn);
        }
        /// <summary>
        /// Makes a mapping
        /// </summary>
        /// <param name="tIn">Type in</param>
        /// <returns>Type result</returns>
        public IEnumerable<tOut> Map(IEnumerable<tIn> tIn)
        {
            return tIn.Select(a => this.Map(a));
        }
    }

}
