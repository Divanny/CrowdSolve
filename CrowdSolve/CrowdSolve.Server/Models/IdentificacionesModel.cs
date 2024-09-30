using System.ComponentModel.DataAnnotations;

namespace CrowdSolve.Server.Models
{
    public class IdentificacionesModel
    {
        public int idIdentificacion { get; set; }

        [Required(ErrorMessage = ("Debe especificar el usuario"))]
        public int idUsuario { get; set; }
        public string? NombreUsuario { get; set; }

        [Required(ErrorMessage = ("Debe especificar el tipo de identificación"))]
        public int idTipoIdentificacion { get; set; }
        public string? NombreTipoIdentificacion { get; set; }

        [Required(ErrorMessage = ("Debe especificar el valor de la identificación"))]
        public string? Valor { get; set; }
    }
}