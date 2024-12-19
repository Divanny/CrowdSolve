using CrowdSolve.Server.Entities.CrowdSolve;
using CrowdSolve.Server.Enums;
using CrowdSolve.Server.Infraestructure;
using CrowdSolve.Server.Repositories;
using CrowdSolve.Server.Repositories.Autenticación;

public class Worker : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<Worker> _logger;
    private readonly string[] _errorsNotificationMails;

    public Worker(IServiceProvider serviceProvider, ILogger<Worker> logger, IConfiguration configuration)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
        _errorsNotificationMails = configuration.GetSection("ErrorNotificationMails").Get<string[]>() 
            ?? ["divannyjpm@gmail.com", "divanny@crowdsolve.site"];
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Worker started at: {time}", DateTimeOffset.Now);
        while (!stoppingToken.IsCancellationRequested)
        {
            var horaActual = DateTime.Now;

            if (horaActual.Hour == 2 && horaActual.Minute == 0)
            {
                _logger.LogInformation("Starting task processing at: {time}", DateTimeOffset.Now);
                await ProcessTasksAsync(stoppingToken);
                await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
            }
            else
            {
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }
        _logger.LogInformation("Worker stopped at: {time}", DateTimeOffset.Now);
    }

    private async Task ProcessTasksAsync(CancellationToken stoppingToken)
    {
        using (var scope = _serviceProvider.CreateScope())
        {
            var logger = scope.ServiceProvider.GetRequiredService<Logger>();
            var dbContext = scope.ServiceProvider.GetRequiredService<CrowdSolveContext>();
            var mailingService = scope.ServiceProvider.GetRequiredService<Mailing>();
            var notificacionesRepo = new NotificacionesRepo(dbContext);

            try
            {
                _logger.LogInformation("Processing tasks at: {time}", DateTimeOffset.Now);
                await Task.Run(() => CambiarEstatusDesafiosPorComenzar(dbContext, notificacionesRepo), stoppingToken);
                await Task.Run(() => CambiarEstatusDesafiosPorFinalizar(dbContext, notificacionesRepo), stoppingToken);
                await Task.Run(() => CambiarEstatusDesafiosPorIniciarProcesoEvaluacion(dbContext, notificacionesRepo), stoppingToken);
                await Task.Run(() => CambiarEstatusDesafiosEnEsperaDePremios(dbContext, notificacionesRepo), stoppingToken);
                _logger.LogInformation("Task processing completed at: {time}", DateTimeOffset.Now);
            }
            catch (Exception ex)
            {
                logger.LogError(ex);
                mailingService.SendMail(_errorsNotificationMails, "Error en Worker", ex.Message, MailingUsers.noreply);
            }
        }
    }

    private void CambiarEstatusDesafiosPorComenzar(CrowdSolveContext dbContext, NotificacionesRepo notificacionesRepo)
    {
        DesafiosRepo desafiosRepo = new DesafiosRepo(dbContext, 0);
        var desafiosPorComenzar = desafiosRepo.Get().Where(x => x.idEstatusDesafio == (int)EstatusProcesoEnum.Desafío_Sin_iniciar && x.FechaInicio.Date <= DateTime.Now.Date).ToList();

        foreach (var desafio in desafiosPorComenzar)
        {
            desafiosRepo.CambiarEstatus(desafio.idDesafio, EstatusProcesoEnum.Desafío_En_progreso);

            notificacionesRepo.EnviarNotificacion(
                desafio.idUsuarioEmpresa ?? 0,
                $"Uno de tus desafíos ha empezado",
                $"El desafío <b>{desafio.Titulo}</b> ha cambiado de estatus a <b>En progreso</b>. Los participantes pueden comenzar a enviar sus soluciones.",
                desafio.idProceso,
                dbContext.Set<Vistas>().Where(x => x.idVista == (int)PermisosEnum.Empresa_Dashboard).FirstOrDefault()?.URL ?? string.Empty
            );
        }
    }

    private void CambiarEstatusDesafiosPorFinalizar(CrowdSolveContext dbContext, NotificacionesRepo notificacionesRepo)
    {
        DesafiosRepo desafiosRepo = new DesafiosRepo(dbContext, 0);
        var desafiosPorFinalizar = desafiosRepo.Get().Where(x => x.idEstatusDesafio == (int)EstatusProcesoEnum.Desafío_En_progreso && x.FechaLimite.Date <= DateTime.Now.Date).ToList();

        foreach (var desafio in desafiosPorFinalizar)
        {
            desafiosRepo.CambiarEstatus(desafio.idDesafio, EstatusProcesoEnum.Desafío_En_validación_de_soluciones);

            notificacionesRepo.EnviarNotificacion(
                desafio.idUsuarioEmpresa ?? 0,
                $"Uno de tus desafíos ha llegado a su fecha límite",
                $"El desafío <b>{desafio.Titulo}</b> ha cambiado de estatus a <b>En validación de soluciones</b>. Los participantes han enviado sus soluciones y ahora puedes validarlas.",
                desafio.idProceso,
                dbContext.Set<Vistas>().Where(x => x.idVista == (int)PermisosEnum.Empresa_Dashboard).FirstOrDefault()?.URL ?? string.Empty
            );
        }
    }

    private void CambiarEstatusDesafiosPorIniciarProcesoEvaluacion(CrowdSolveContext dbContext, NotificacionesRepo notificacionesRepo)
    {
        DesafiosRepo desafiosRepo = new DesafiosRepo(dbContext, 0);
        var desafiosPorIniciarProcesoEvaluacion = desafiosRepo.Get().Where(x => x.idEstatusDesafio == (int)EstatusProcesoEnum.Desafío_En_validación_de_soluciones).ToList();

        foreach (var desafio in desafiosPorIniciarProcesoEvaluacion)
        {
            var procesosEvaluacion = desafiosRepo.GetProcesoEvaluacionDesafio(desafio.idDesafio);
            if (procesosEvaluacion.Count() > 0 && procesosEvaluacion.Any(x => x.FechaInicio.Date <= DateTime.Now.Date))
            {
                desafiosRepo.CambiarEstatus(desafio.idDesafio, EstatusProcesoEnum.Desafío_En_evaluación);

                notificacionesRepo.EnviarNotificacion(
                    desafio.idUsuarioEmpresa ?? 0,
                    $"Uno de tus desafíos ha comenzado el proceso de evaluación",
                    $"El desafío <b>{desafio.Titulo}</b> ha cambiado de estatus a <b>En evaluación</b>. El proceso de evaluación ha comenzado y pronto se darán a conocer los resultados.",
                    desafio.idProceso,
                    dbContext.Set<Vistas>().Where(x => x.idVista == (int)PermisosEnum.Empresa_Dashboard).FirstOrDefault()?.URL ?? string.Empty
                );
            }
        }
    }

    private void CambiarEstatusDesafiosEnEsperaDePremios(CrowdSolveContext dbContext, NotificacionesRepo notificacionesRepo)
    {
        DesafiosRepo desafiosRepo = new DesafiosRepo(dbContext, 0);
        var desafiosEnEsperaDePremios = desafiosRepo.Get().Where(x => x.idEstatusDesafio == (int)EstatusProcesoEnum.Desafío_En_evaluación).ToList();

        foreach (var desafio in desafiosEnEsperaDePremios)
        {
            var procesosEvaluacion = desafiosRepo.GetProcesoEvaluacionDesafio(desafio.idDesafio);
            if (procesosEvaluacion.Count() > 0 && procesosEvaluacion.All(x => x.FechaFinalizacion.Date <= DateTime.Now.Date))
            {
                desafiosRepo.CambiarEstatus(desafio.idDesafio, EstatusProcesoEnum.Desafío_En_espera_de_entrega_de_premios);

                notificacionesRepo.EnviarNotificacion(
                    desafio.idUsuarioEmpresa ?? 0,
                    $"Uno de tus desafíos está en espera de premios",
                    $"El desafío <b>{desafio.Titulo}</b> ha cambiado de estatus a <b>En espera de premios</b>. El proceso de evaluación ha finalizado y pronto se darán a conocer los resultados.",
                    desafio.idProceso,
                    dbContext.Set<Vistas>().Where(x => x.idVista == (int)PermisosEnum.Empresa_Dashboard).FirstOrDefault()?.URL ?? string.Empty
                );
            }
        }
    }
}
