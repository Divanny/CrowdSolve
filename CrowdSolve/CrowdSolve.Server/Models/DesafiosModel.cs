using CrowdSolve.Server.Entities.CrowdSolve;
using System.ComponentModel.DataAnnotations;

namespace CrowdSolve.Server.Models
{
    public class DesafiosModel
    {
        public int idDesafio { get; set; }
        public int? idUsuarioEmpresa { get; set; }
        public int idEmpresa { get; set; }
        public string? Empresa { get; set; }
        [Required(ErrorMessage = "Debe especificar el título")]
        public string? Titulo { get; set; }
        [Required(ErrorMessage = "Debe especificar el contenido")]
        public string? Contenido { get; set; }
        [Required(ErrorMessage = "Debe especificar la fecha inicio de envío de soluciones")]
        public DateTime FechaInicio { get; set; }
        [Required(ErrorMessage = "Debe especificar la fecha límite de envío de soluciones")]
        public DateTime FechaLimite { get; set; }
        [Required(ErrorMessage = "Debe especificar las categorías")]
        public List<DesafiosCategoria>? Categorias { get; set; }
        public List<SolucionesModel>? Soluciones { get; set; }
        public DateTime? FechaRegistro { get; set; }
        [Required(ErrorMessage = "Debe especificar el proceso de evaluación del desafío")]
        public List<ProcesoEvaluacion>? ProcesoEvaluacion { get; set; }
        public int? idEstatusDesafio { get; set; }
        public string? EstatusDesafio { get; set; }
        public bool? YaParticipo { get; set; }
    }
}
