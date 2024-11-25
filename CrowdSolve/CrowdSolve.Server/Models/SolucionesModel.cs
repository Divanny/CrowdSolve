using CrowdSolve.Server.Entities.CrowdSolve;
using System.ComponentModel.DataAnnotations;

namespace CrowdSolve.Server.Models;

public class SolucionesModel
{
    public int idSolucion { get; set; }

    [Required(ErrorMessage = "Debe especificar el desafío al que pertenece la solución")]
    [Range(1, int.MaxValue, ErrorMessage = "Debe especificar el desafío al que pertenece la solución")]
    public int idDesafio { get; set; }

    public int idUsuario { get; set; }

    public string? NombreUsuario { get; set; }

    [Required(ErrorMessage = "Debe especificar el título")]
    public string? Titulo { get; set; }

    [Required(ErrorMessage = "Debe especificar la descripción")]
    public string? Descripcion { get; set; }

    public IFormFile[]? Archivos { get; set; }

    public DateTime FechaRegistro { get; set; }

    public string? ArchivoRuta { get; set; }

    public int idEstatusProceso { get; set; }

    public string? EstatusProceso { get; set; }

    public bool? Publica { get; set; }

    public int? Puntuacion { get; set; }
    public List<AdjuntosSoluciones>? Adjuntos { get; set; }
}