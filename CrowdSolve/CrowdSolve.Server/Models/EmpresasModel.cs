using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace CrowdSolve.Server.Models
{
    public class EmpresasModel
    {
        public int idEmpresa { get; set; }

        public int idUsuario { get; set; }

        [Required(ErrorMessage = "El nombre de la empresa es requerido")]
        [StringLength(150, ErrorMessage = "El nombre de la empresa no puede exceder los 50 carácteres")]
        [Unicode(false)]
        public string? Nombre { get; set; }

        [Required(ErrorMessage = "El número de teléfono es requerido")]
        [StringLength(20, ErrorMessage = "El número de teléfono no puede exceder los 10 carácteres")]
        [Unicode(false)]
        public string? Telefono { get; set; }

        public string? PaginaWeb { get; set; }
    }
}
