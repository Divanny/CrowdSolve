using System.ComponentModel.DataAnnotations;

namespace CrowdSolve.Server.Models
{
    public class SoportesModel
    {
        public int idSoporte { get; set; }
        public int? idUsuario { get; set; }
        public string? NombreUsuario { get; set; }
        [Required(ErrorMessage = "El campo Título es obligatorio")]
        public string Titulo { get; set; }

        [Required(ErrorMessage = "El campo Mensaje es obligatorio")]
        public string Mensaje { get; set; }

        public DateTime Fecha { get; set; }

        // Anonymous type properties
        public string? Nombres { get; set; }
        public string? Apellidos { get; set; }

        [EmailAddress(ErrorMessage = "El campo Correo Electrónico no es una dirección de correo válida")]
        public string? CorreoElectronico { get; set; }

        public int? idUsuarioAsignado { get; set; }

        public string? NombreAsignado { get; set; }

        public bool AsignadoAMi {  get; set; }

        public int ? idEstatusProceso { get; set; }

        public string? EstatusProcesoNombre { get; set; }

        public string? Severidad { get; set; }

        public string? ClaseProcesoIcono { get; set; }
    }
}
