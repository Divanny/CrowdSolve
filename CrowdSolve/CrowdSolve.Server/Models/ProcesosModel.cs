using CrowdSolve.Server.Entities.CrowdSolve;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CrowdSolve.Server.Models
{
    public class ProcesosModel
    {
        public ProcesosModel()
        {

        }
        public ProcesosModel(Enums.EstatusProcesoEnum estatus)
        {
            this.idEstatusProceso = (int)estatus;
        }
        public ProcesosModel(Enums.EstatusProcesoEnum estatus, int asignadoA)
        {
            this.idEstatusProceso = (int)estatus;
            this.idUsuarioAsignado = asignadoA;
        }
        public ProcesosModel(Enums.EstatusProcesoEnum estatus, string motivo)
        {
            this.idEstatusProceso = (int)estatus;
            this.MotivoCambioEstatus = motivo;
        }
        public int idProceso { get; set; }
        public int idUsuario { get; set; }
        public int idRelacionado { get; set; }
        public string MotivoCambioEstatus { get; set; }
        public int idClaseProceso { get; set; }
        public string ClaseProceso { get; set; }
        public string ClaseProcesoIcono { get; set; }
        public int idEstatusProceso { get; set; }
        public string EstatusProceso { get; set; }
        public string? ColorEstatus { get; set; }
        public int? idUsuarioAsignado { get; set; }
        public string? UsuarioAsignado { get; set; }
        public bool AsignadoAMi { get; set; }
        public DateTime Fecha { get; set; }
    }
}
