namespace CrowdSolve.Server.Models;

public partial class AdjuntosModel
{
    public int idAdjunto { get; set; }

    public int idProceso { get; set; }

    public string? Nombre { get; set; }

    public string? ContentType { get; set; }

    public long Tamaño { get; set; }

    public DateTime FechaSubida { get; set; }

    public string? RutaArchivo { get; set; }

    public int? idUsuario { get; set; }
    public string? NombreUsuario { get; set; }
}