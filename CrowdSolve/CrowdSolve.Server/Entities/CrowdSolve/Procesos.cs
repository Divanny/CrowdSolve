﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace CrowdSolve.Server.Entities.CrowdSolve;

public partial class Procesos
{
    public int idProceso { get; set; }

    public int idUsuario { get; set; }

    public int idRelacionado { get; set; }

    public int idEstatusProceso { get; set; }

    public int idClaseProceso { get; set; }

    public DateTime Fecha { get; set; }
}