﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace CrowdSolve.Server.Entities.CrowdSolve;

public partial class CrowdSolveContext : DbContext
{
    public CrowdSolveContext(DbContextOptions<CrowdSolveContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Categorias> Categorias { get; set; }

    public virtual DbSet<ClasesProceso> ClasesProceso { get; set; }

    public virtual DbSet<ComentariosProceso> ComentariosProceso { get; set; }

    public virtual DbSet<CredencialesAutenticacion> CredencialesAutenticacion { get; set; }

    public virtual DbSet<Desafios> Desafios { get; set; }

    public virtual DbSet<DesafiosCategoria> DesafiosCategoria { get; set; }

    public virtual DbSet<Empresas> Empresas { get; set; }

    public virtual DbSet<EstatusProceso> EstatusProceso { get; set; }

    public virtual DbSet<EstatusUsuarios> EstatusUsuarios { get; set; }

    public virtual DbSet<HistorialCambioEstatus> HistorialCambioEstatus { get; set; }

    public virtual DbSet<LogActividades> LogActividades { get; set; }

    public virtual DbSet<LogErrores> LogErrores { get; set; }

    public virtual DbSet<MetodosAutenticacion> MetodosAutenticacion { get; set; }

    public virtual DbSet<NivelesEducativo> NivelesEducativo { get; set; }

    public virtual DbSet<Notificaciones> Notificaciones { get; set; }

    public virtual DbSet<Participantes> Participantes { get; set; }

    public virtual DbSet<Perfiles> Perfiles { get; set; }

    public virtual DbSet<PerfilesVistas> PerfilesVistas { get; set; }

    public virtual DbSet<ProcesoEvaluacion> ProcesoEvaluacion { get; set; }

    public virtual DbSet<Procesos> Procesos { get; set; }

    public virtual DbSet<Sectores> Sectores { get; set; }

    public virtual DbSet<Soluciones> Soluciones { get; set; }

    public virtual DbSet<Soportes> Soportes { get; set; }

    public virtual DbSet<TamañosEmpresa> TamañosEmpresa { get; set; }

    public virtual DbSet<TiposEvaluacion> TiposEvaluacion { get; set; }

    public virtual DbSet<Usuarios> Usuarios { get; set; }

    public virtual DbSet<Vistas> Vistas { get; set; }

    public virtual DbSet<VotosUsuarios> VotosUsuarios { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Categorias>(entity =>
        {
            entity.HasKey(e => e.idCategoria);

            entity.Property(e => e.ClaseIcono)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Descripcion)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.Nombre)
                .IsRequired()
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<ClasesProceso>(entity =>
        {
            entity.HasKey(e => e.idClaseProceso);

            entity.Property(e => e.ClaseIcono)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Descripcion)
                .IsRequired()
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Nombre)
                .IsRequired()
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<ComentariosProceso>(entity =>
        {
            entity.HasKey(e => e.idComentario);

            entity.Property(e => e.Comentario)
                .IsRequired()
                .HasMaxLength(250)
                .IsUnicode(false);
        });

        modelBuilder.Entity<CredencialesAutenticacion>(entity =>
        {
            entity.HasKey(e => e.idCredencial);

            entity.Property(e => e.TokenAcceso).IsUnicode(false);
            entity.Property(e => e.idExterno)
                .HasMaxLength(256)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Desafios>(entity =>
        {
            entity.HasKey(e => e.idDesafio);

            entity.Property(e => e.Contenido)
                .IsRequired()
                .IsUnicode(false);
            entity.Property(e => e.FechaLimite).HasColumnType("datetime");
            entity.Property(e => e.FechaRegistro).HasColumnType("datetime");
            entity.Property(e => e.Titulo)
                .IsRequired()
                .HasMaxLength(150)
                .IsUnicode(false);
        });

        modelBuilder.Entity<DesafiosCategoria>(entity =>
        {
            entity.HasKey(e => e.idDesafioCategoria);
        });

        modelBuilder.Entity<Empresas>(entity =>
        {
            entity.HasKey(e => e.idEmpresa);

            entity.Property(e => e.Direccion)
                .IsRequired()
                .IsUnicode(false);
            entity.Property(e => e.Nombre)
                .IsRequired()
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.PaginaWeb).IsUnicode(false);
            entity.Property(e => e.Telefono)
                .IsRequired()
                .HasMaxLength(20)
                .IsUnicode(false);
        });

        modelBuilder.Entity<EstatusProceso>(entity =>
        {
            entity.HasKey(e => e.idEstatusProceso);

            entity.Property(e => e.ClaseIcono)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Descripcion)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Nombre)
                .IsRequired()
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Severidad)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<EstatusUsuarios>(entity =>
        {
            entity.HasKey(e => e.idEstatusUsuario);

            entity.Property(e => e.Descripcion)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Nombre)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<HistorialCambioEstatus>(entity =>
        {
            entity.HasKey(e => e.idHistorialCambioEstatus);

            entity.Property(e => e.Fecha).HasColumnType("datetime");
            entity.Property(e => e.MotivoCambioEstatus)
                .HasMaxLength(500)
                .IsUnicode(false);
        });

        modelBuilder.Entity<LogActividades>(entity =>
        {
            entity.HasKey(e => e.idLogActividad);

            entity.Property(e => e.Data)
                .IsRequired()
                .IsUnicode(false);
            entity.Property(e => e.Fecha).HasColumnType("datetime");
            entity.Property(e => e.Metodo)
                .IsRequired()
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.URL)
                .IsRequired()
                .HasMaxLength(500)
                .IsUnicode(false);
        });

        modelBuilder.Entity<LogErrores>(entity =>
        {
            entity.HasKey(e => e.idLogError);

            entity.Property(e => e.Fecha).HasColumnType("datetime");
            entity.Property(e => e.Fuente)
                .IsRequired()
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.Mensaje)
                .IsRequired()
                .IsUnicode(false);
            entity.Property(e => e.StackTrace)
                .IsRequired()
                .IsUnicode(false);
        });

        modelBuilder.Entity<MetodosAutenticacion>(entity =>
        {
            entity.HasKey(e => e.idMetodoAutenticacion);

            entity.Property(e => e.Descripcion)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Nombre)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<NivelesEducativo>(entity =>
        {
            entity.HasKey(e => e.idNivelEducativo);

            entity.Property(e => e.Nombre)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Notificaciones>(entity =>
        {
            entity.HasKey(e => e.idNotificacion);

            entity.Property(e => e.Fecha).HasColumnType("datetime");
            entity.Property(e => e.Mensaje)
                .IsRequired()
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Titulo)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Participantes>(entity =>
        {
            entity.HasKey(e => e.idParticipante);

            entity.Property(e => e.Apellidos)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.DescripcionPersonal)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.Nombres)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Telefono)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Perfiles>(entity =>
        {
            entity.HasKey(e => e.idPerfil);

            entity.Property(e => e.Descripcion)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Nombre)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<PerfilesVistas>(entity =>
        {
            entity.HasKey(e => e.idPerfilVista);
        });

        modelBuilder.Entity<ProcesoEvaluacion>(entity =>
        {
            entity.HasKey(e => e.idProcesoEvaluacion);

            entity.Property(e => e.FechaFinalizacion).HasColumnType("datetime");
        });

        modelBuilder.Entity<Procesos>(entity =>
        {
            entity.HasKey(e => e.idProceso);

            entity.Property(e => e.Fecha).HasColumnType("datetime");
        });

        modelBuilder.Entity<Sectores>(entity =>
        {
            entity.HasKey(e => e.idSector);

            entity.Property(e => e.Nombre)
                .IsRequired()
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Soluciones>(entity =>
        {
            entity.HasKey(e => e.idSolucion).HasName("PK_Soluciones_1");

            entity.Property(e => e.ArchivoRuta)
                .IsRequired()
                .IsUnicode(false);
            entity.Property(e => e.FechaRegistro).HasColumnType("datetime");
        });

        modelBuilder.Entity<Soportes>(entity =>
        {
            entity.HasKey(e => e.idSoporte);

            entity.Property(e => e.Fecha).HasColumnType("datetime");
            entity.Property(e => e.Mensaje)
                .IsRequired()
                .IsUnicode(false);
            entity.Property(e => e.Titulo)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<TamañosEmpresa>(entity =>
        {
            entity.HasKey(e => e.idTamañoEmpresa);

            entity.Property(e => e.Descripcion)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.Nombre)
                .IsRequired()
                .HasMaxLength(40)
                .IsUnicode(false);
        });

        modelBuilder.Entity<TiposEvaluacion>(entity =>
        {
            entity.HasKey(e => e.idTipoEvaluacion);

            entity.Property(e => e.Nombre)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Usuarios>(entity =>
        {
            entity.HasKey(e => e.idUsuario);

            entity.Property(e => e.Contraseña)
                .HasMaxLength(256)
                .IsUnicode(false);
            entity.Property(e => e.CorreoElectronico)
                .IsRequired()
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.FechaRegistro).HasColumnType("datetime");
            entity.Property(e => e.NombreUsuario)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Vistas>(entity =>
        {
            entity.HasKey(e => e.idVista);

            entity.Property(e => e.ClaseIcono)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Nombre)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.URL)
                .IsRequired()
                .IsUnicode(false);
        });

        modelBuilder.Entity<VotosUsuarios>(entity =>
        {
            entity.HasKey(e => e.idVotoUsuario);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}