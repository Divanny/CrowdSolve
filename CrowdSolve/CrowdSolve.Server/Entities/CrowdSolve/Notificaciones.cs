﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace CrowdSolve.Server.Entities.CrowdSolve;

public partial class Notificaciones
{
    public int idNotificacion { get; set; }

    public int idUsuario { get; set; }

    public string Titulo { get; set; }

    public string Mensaje { get; set; }

    public int idProceso { get; set; }

    public DateTime Fecha { get; set; }
}