using System.ComponentModel.DataAnnotations;

namespace CrowdSolve.Server.Models
{
    public class CambioEstatusModel
    {
        [Required(ErrorMessage = "Debe especificar el nuevo estatus")]
        [Range(1, int.MaxValue, ErrorMessage = "Debe especifciar el nuevo estatus")]
        public int idEstatusProceso { get; set; }
        public string? EstatusProceso { get; set; }
        public int idRelacionado { get; set; }
        public string? MotivoCambioEstatus { get; set; }
    }
}
