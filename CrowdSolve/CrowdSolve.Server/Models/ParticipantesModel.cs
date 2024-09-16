using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace CrowdSolve.Server.Models
{
    public class ParticipantesModel
    {
        public int idParticipante { get; set; }

        public int idUsuario { get; set; }

        [Required(ErrorMessage = "El nombre del participante es requerido")]
        [StringLength(50, ErrorMessage = "El nombre del participante no puede exceder los 50 carácteres")]
        [Unicode(false)]
        public string? Nombres { get; set; }

        [Required(ErrorMessage = "El nombre del participante es requerido")]
        [StringLength(50, ErrorMessage = "El nombre del participante no puede exceder los 50 carácteres")]
        [Unicode(false)]
        public string? Apellidos { get; set; }

        [Required(ErrorMessage = "La fecha de nacimiento del participante es requerida")]
        public DateOnly FechaNacimiento { get; set; }
    }
}
