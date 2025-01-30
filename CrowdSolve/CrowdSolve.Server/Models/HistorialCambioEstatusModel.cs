namespace CrowdSolve.Server.Models
{
    public class HistorialCambioEstatusModel
    {
        public int idHistorialCambioEstatus { get; set; }
        public int idProceso { get; set; }
        public int idUsuario { get; set; }
        public string? NombreUsuario { get; set; }
        public int idRelacionado { get; set; }
        public int idEstatusProceso { get; set; }
        public string? EstatusProceso { get; set; }
        public string? EstatusIcono { get; set; }
        public string? EstatusColor { get; set; }
        public string? MotivoCambioEstatus { get; set; }
        public DateTime Fecha { get; set; }
    }
}
