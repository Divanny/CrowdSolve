﻿using CrowdSolve.Server.Entities.CrowdSolve;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CrowdSolve.Server.Models
{
    public class UsuariosModel
    {
        public int idUsuario { get; set; }

        [Required(ErrorMessage = "Se debe especificar el perfil")]
        public int idPerfil { get; set; }
        public string? NombrePerfil { get; set; }

        [Required(ErrorMessage = "Se debe especificar el nombre de usuario")]
        [StringLength(50, ErrorMessage = "No puede exceder a los 50 carácteres")]
        [Unicode(false)]
        public string? NombreUsuario { get; set; }
        public string? ContraseñaHashed { get; set; }
        public string? Contraseña { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime FechaRegistro { get; set; }

        [Required(ErrorMessage = "Se debe especificar el estatus del usuario")]
        public int idEstatusUsuario { get; set; }
        public string? NombreEstatusUsuario { get; set; }
        public Participantes? InformacionParticipante { get; set; }
        public Empresas? InformacionEmpresa { get; set; }
        public List<Identificaciones>? Identificaciones { get; set; }
    }
}
