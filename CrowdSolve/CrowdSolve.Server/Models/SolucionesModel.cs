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

    public string[]? FileGuids { get; set; }

    public DateTime FechaRegistro { get; set; }

    public string? ArchivoRuta { get; set; }

    public int idProceso { get; set; }
    public int idEstatusProceso { get; set; }

    public string? EstatusProceso { get; set; }
    public string? SeveridadEstatusProceso { get; set; }
    public string? IconoEstatusProceso { get; set; }

    public bool? Publica { get; set; }

    public int? Puntuacion { get; set; }

    public bool? MeGusta { get; set; }

    public int? CantidadVotos { get; set; }

    public int? CantidadVotosComunidad { get; set; }
    
    public int? CantidadVotosParticipantes { get; set; }

    public int? PuntuacionFinal { get; set; }

    public int? PuntuacionMaxima { get; set; }

    public DesafiosModel? Desafio { get; set; }
    
    public List<AdjuntosModel>? Adjuntos { get; set; }
}