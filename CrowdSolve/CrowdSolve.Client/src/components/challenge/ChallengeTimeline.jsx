import { CheckCircle, Clock, XCircle, Award, SearchCheck, BadgeAlert, Loader, Ban, Trash2, FileCheck2, AlertCircle } from 'lucide-react';
import EstatusProcesoEnum from '@/enums/EstatusProcesoEnum';
import { useTranslation } from 'react-i18next';


const ChallengeTimeline = ({ currentStatus }) => {
    const { t } = useTranslation();

    const getTimelineSteps = (currentStatus) => {
        const steps = [
            { status: EstatusProcesoEnum.Desafio_Sin_validar, label: t('challengetimelineSteps.Desafio_Sin_validar.label'), icon: BadgeAlert, color: 'primary' },
            { status: EstatusProcesoEnum.Desafio_Sin_iniciar, label: t('challengetimelineSteps.Desafio_Sin_iniciar.label'), icon: Clock, color: 'primary' },
            { status: EstatusProcesoEnum.Desafio_En_progreso, label: t('challengetimelineSteps.Desafio_En_progreso.label'), icon: Loader, color: 'primary' },
            { status: EstatusProcesoEnum.Desafio_En_validación_de_soluciones, label: 'Validación de soluciones', icon: FileCheck2, color: 'primary' },
            { status: EstatusProcesoEnum.Desafio_En_evaluacion, label: t('challengetimelineSteps.Desafio_En_evaluacion.label'), icon: SearchCheck, color: 'primary' },
            { status: EstatusProcesoEnum.Desafio_En_espera_de_entrega_de_premios, label: t('challengetimelineSteps.Desafio_En_espera_de_entrega_de_premios.label'), icon: Award, color: 'primary' },
            { status: EstatusProcesoEnum.Desafio_Finalizado, label: t('challengetimelineSteps.Desafio_Finalizado.label'), icon: CheckCircle, color: 'success' },
        ];

        if (currentStatus === EstatusProcesoEnum.Desafio_Rechazado) {
            steps[0] = { status: EstatusProcesoEnum.Desafio_Rechazado, label: 'Rechazado', icon: Ban, color: 'destructive' };
        } else if (currentStatus === EstatusProcesoEnum.Desafio_Descartado) {
            steps[0] = { status: EstatusProcesoEnum.Desafio_Descartado, label: 'Descartado', icon: Trash2, color: 'destructive' };
        }

        return steps;
    };
    
    const timelineSteps = getTimelineSteps(currentStatus);

    const getCurrentStepIndex = () => {
        if (currentStatus === EstatusProcesoEnum.Desafio_Cancelado) {
            return -1;
        }
        return timelineSteps.findIndex(step => step.status === currentStatus);
    };

    const calculateProgressWidth = () => {
        const currentIndex = getCurrentStepIndex();
        if (currentIndex === -1) return '0%';

        if (currentIndex === 0) return '3%';

        const totalSteps = timelineSteps.length - 1;
        const progress = (currentIndex / totalSteps) * 100;

        return `${progress * 0.96}%`;
    };

    return (
        <div className="w-full py-4">
            <div className="relative">
                {/* Barra de fondo */}
                <div className="absolute w-full h-1 bg-muted top-1/2 transform -translate-y-1/2">
                    {/* Barra de progreso */}
                    <div
                        className="absolute h-full bg-primary transition-all duration-300 ease-in-out origin-left"
                        style={{ width: calculateProgressWidth() }}
                    />
                </div>

                {/* Puntos de estado */}
                <div className="flex justify-between relative">
                    {timelineSteps.map((step, index) => {
                        const currentIndex = getCurrentStepIndex();
                        const isActive = index <= currentIndex;
                        const isCurrent = index === currentIndex;
                        const StepIcon = step.icon;

                        return (
                            <div key={step.status} className="flex flex-col items-center">
                                <div
                                    className={`
                    w-8 h-8 rounded-full flex items-center justify-center z-10 
                    transition-all duration-300 ease-in-out
                    ${isActive
                                            ? isCurrent
                                                ? `bg-primary ring-4 ring-primary/30 scale-110`
                                                : `bg-primary`
                                            : 'bg-muted'
                                        }
                  `}
                                >
                                    <StepIcon
                                        className={`
                      w-5 h-5 transition-colors duration-300
                      ${isActive ? `text-primary-foreground` : 'text-muted-foreground'}
                    `}
                                    />
                                </div>
                                <span
                                    className={`
                    mt-2 text-xs font-medium transition-all duration-300 -mb-4
                    ${isCurrent
                                            ? 'text-primary font-semibold scale-105'
                                            : isActive
                                                ? 'text-foreground'
                                                : 'text-muted-foreground'
                                        }
                  `}
                                >
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Estado sin validar */}
            {currentStatus === EstatusProcesoEnum.Desafio_Sin_validar && (
                <div className="mt-4 text-center">
                    <div className="inline-flex items-center justify-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-warning">
                            <AlertCircle className="w-5 h-5 text-warning-foreground" />
                        </div>
                        <span className="text-sm font-medium text-warning">
                            El desafío aún no ha sido validado por la administración.
                        </span>
                    </div>
                </div>
            )}

            {/* Estado cancelado */}
            {currentStatus === EstatusProcesoEnum.Desafio_Cancelado && (
                <div className="mt-4 text-center">
                    <div className="inline-flex items-center justify-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-destructive">
                            <XCircle className="w-5 h-5 text-destructive-foreground" />
                        </div>
                        <span className="text-sm font-medium text-destructive">
                            {t('challengetimelineSteps.currentStatus.Desafio_Cancelado')}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChallengeTimeline;