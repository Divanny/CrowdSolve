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

        [Required(ErrorMessage = "La descripción de la empresa es requerida")]
        [StringLength(500, ErrorMessage = "La descripción de la empresa no puede exceder los 500 carácteres")]
        [Unicode(false)]
        public string? Descripcion { get; set; }

        [Required(ErrorMessage = "El número de teléfono es requerido")]
        [StringLength(50, ErrorMessage = "El número de teléfono no puede exceder los 50 carácteres")]
        [Unicode(false)]
        public string? Telefono { get; set; }

        public string? PaginaWeb { get; set; }

        [Required(ErrorMessage = "El tamaño de la empresa es requerido")]
        public int idTamañoEmpresa { get; set; }
        public string? TamañoEmpresa { get; set; }

        [Required(ErrorMessage = "El sector de la empresa es requerido")]
        public int idSector { get; set; }
        public string? Sector { get; set; }

        [Required(ErrorMessage = "La dirección de la empresa es requerida")]
        public string? Direccion { get; set; }

        [Required(ErrorMessage = "El avatar de la empresa es requerido")]
        public IFormFile? Avatar { get; set; }
        public int? CantidadDesafios { get; set; }
        public int? CantidadSoluciones { get; set; }
    }
}
