using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace CrowdSolve.Server.Models
{
    public class CredencialesAutenticacionModel
    {
        public int idCredencial { get; set; }

        [Required(ErrorMessage = "El id del usuario es requerido")]
        public int idUsuario { get; set; }

        [Required(ErrorMessage = "El id del método de autenticación es requerido")]
        public int idMetodoAutenticacion { get; set; }
        public string? MetodoAutenticacion { get; set; }

        [Required(ErrorMessage = "El id externo es requerido")]
        public string? idExterno { get; set; }
        public string? TokenAcceso { get; set; }
    }
}
