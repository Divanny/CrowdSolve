namespace CrowdSolve.Server.Models
{
    public class NotificacionesModel
    {
        public int idNotificacion { get; set; }
        public int idUsuario { get; set; }
        public string? NombreUsuario { get; set; }
        public string? Titulo { get; set; }
        public string? Mensaje { get; set; }
        public int? idProceso { get; set; }
        public string? Severidad { get; set; }
        public string? Icono { get; set; }
        public DateTime Fecha { get; set; }
        public string? UrlRedireccion { get; set; }
        public bool Leido { get; set; }
    }
}