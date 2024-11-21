using CrowdSolve.Server.Entities.CrowdSolve;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace CrowdSolve.Server.Models
{
    public class PerfilesModel
    {
        [Key]
        public int idPerfil { get; set; }

        [Required(ErrorMessage = "El nombre del perfil es requerido")]
        [StringLength(50, ErrorMessage = "El nombre del perfil no puede exceder los 50 carácteres")]
        [Unicode(false)]
        public string? Nombre { get; set; }

        [StringLength(250, ErrorMessage = "La descripción del perfil no puede exceder los 250 carácteres")]
        [Unicode(false)]
        public string? Descripcion { get; set; }
        public bool PorDefecto { get; set; }
        public IEnumerable<Vistas>? Vistas { get; set; }
        public IEnumerable<Usuarios>? Usuarios { get; set; }
    }
}
