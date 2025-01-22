using CrowdSolve.Server.Entities.CrowdSolve;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;
using System.ComponentModel.DataAnnotations;

namespace CrowdSolve.Server.Models
{
    public class ParticipantesModel
    {
        public int idParticipante { get; set; }

        public int idUsuario { get; set; }
        public string? NombreUsuario { get; set; }

        [Required(ErrorMessage = "El nombre del participante es requerido")]
        [StringLength(50, ErrorMessage = "El nombre del participante no puede exceder los 50 carácteres")]
        [Unicode(false)]
        public string? Nombres { get; set; }

        [Required(ErrorMessage = "El nombre del participante es requerido")]
        [StringLength(50, ErrorMessage = "El nombre del participante no puede exceder los 50 carácteres")]
        [Unicode(false)]
        public string? Apellidos { get; set; }

        [Required(ErrorMessage = "El número de teléfono es requerido")]
        [StringLength(50, ErrorMessage = "El número de teléfono no puede exceder los 50 carácteres")]
        [Unicode(false)]
        public string? Telefono { get; set; }

        [Required(ErrorMessage = "La fecha de nacimiento del participante es requerida")]
        public DateOnly FechaNacimiento { get; set; }

        [Required(ErrorMessage = "El nivel educativo del participante es requerido")]
        public int idNivelEducativo { get; set; }
        public string? NivelEducativo { get; set; }

        [Required(ErrorMessage = "La descripción personal del participante es requerida")]
        [StringLength(500, ErrorMessage = "La descripción personal del participante no puede exceder los 500 carácteres")]
        [Unicode(false)]
        public string? DescripcionPersonal { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public string? CorreoElectronico { get; set; }
        public IFormFile? Avatar { get; set; }
        public int? idEstatusUsuario { get; set; }
        public string? EstatusUsuario { get; set; }
        [SwaggerIgnore]
        public List<SolucionesModel>? Soluciones { get; set; }

        public int idPerfil { get; set; }
    }
}
