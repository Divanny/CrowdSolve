using CrowdSolve.Server.Entities.CrowdSolve;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace CrowdSolve.Server.Models
{
    public class CategoriasModel
    {
        [Key]
        public int idCategoria { get; set; }

        [Required(ErrorMessage = "El nombre es requerido")]
        [StringLength(50, ErrorMessage = "El nombre del perfil no puede exceder los 50 carácteres")]
        [Unicode(false)]
        public string? Nombre { get; set; }

        [StringLength(250, ErrorMessage = "La descripción del perfil no puede exceder los 250 carácteres")]
        [Unicode(false)]
        public string? Descripcion { get; set; }
        public string? Icono { get; set; }
        public int CantidadDesafios { get; set; }
    }
}
