"use client";

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import useAxios from '@/hooks/use-axios';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Users, Clock, ArrowLeft, Eye, Ban, CircleCheck, CircleAlert } from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ChallengeDetail from '@/components/challenge/ChallengeDetail';
import createEditorToConvertToHtml from '@/hooks/createEditorToConvertToHtml';
import Icon from '@/components/ui/icon';
import { Timeline, TimelineItem, TimelineHeader, TimelineTitle, TimelineTime, TimelineDescription } from '@/components/ui/timeline';
import PrizeEvidenceDialog from '@/components/admin/challenges/PrizeEvidenceDialog';
import EstatusProcesoEnum from '@/enums/EstatusProcesoEnum';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from '@/components/ui/textarea';
import SolutionRanking from '@/components/challenge/SolutionRanking';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const editor = createEditorToConvertToHtml();

const AdminChallengeDetails = () => {
    const { challengeId } = useParams();
    const { api } = useAxios();
    const navigate = useNavigate();
    const [loadingSkeleton, setLoadingSkeleton] = useState(true);
    const [desafio, setDesafio] = useState(null);
    const [htmlContent, setHtmlContent] = useState('');
    const [relationalObjects, setRelationalObjects] = useState({});
    const [rejectionReason, setRejectionReason] = useState("");
    const [isRankingDialogOpen, setIsRankingDialogOpen] = useState(false);

    useEffect(() => {
        const getChallenge = async () => {
            try {
                const [desafioResponse, relationalObjectsResponse] = await Promise.all([
                    api.get(`/api/Desafios/GetDesafioAdmin/${challengeId}`, { requireLoading: false }),
                    api.get("/api/Desafios/GetRelationalObjects", {
                        requireLoading: false,
                        params: { allEstatuses: true },
                    })
                ]);
                const slateContent = JSON.parse(desafioResponse.data.contenido);

                editor.tf.setValue(slateContent);
                convertToHtml();

                setDesafio(desafioResponse.data);
                setRelationalObjects(relationalObjectsResponse.data);
            } catch (error) {
                toast.error("No se pudo cargar el desafío.");
                console.error(error);
            }
            setLoadingSkeleton(false);
        };

        getChallenge();

        // eslint-disable-next-line
    }, [challengeId]);

    const validateChallenge = async () => {
        try {
            const response = await api.put(`/api/Desafios/Validar/${challengeId}`);
            if (response.data.success) {
                toast.success('Operación exitosa', response.data.message);
                navigate('/admin/challenges');
            }
            else {
                toast.error('Error al validar el desafío', response.data.message);
            }
        } catch (error) {
            toast.error('Error al validar el desafío', {
                description: error.response?.data?.message ?? error.message,
            });
        }
    };

    const rejectChallenge = async () => {
        try {
            const response = await api.put(`/api/Desafios/Rechazar/${challengeId}`, null, {
                params: { motivo: rejectionReason }
            });
            if (response.data.success) {
                toast.success('Operación exitosa', response.data.message);
                navigate('/admin/challenges');
            }
            else {
                toast.error('Error al rechazar el desafío', response.data.message);
            }
        } catch (error) {
            toast.error('Error al rechazar el desafío', {
                description: error.response?.data?.message ?? error.message,
            });
        }
    };

    const convertToHtml = () => {
        const html = editor.api.htmlReact.serialize({
            nodes: editor.children,
            convertNewLinesToHtmlBr: true,
            dndWrapper: (props) => <DndProvider backend={HTML5Backend} {...props} />,
        });
        setHtmlContent(html);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const getCategoryName = (idCategoria) => {
        const category = relationalObjects.categorias.find(cat => cat.idCategoria === idCategoria);
        return category ? category.nombre : 'Desconocida';
    };

    const getEvaluationStatus = (procesoEvaluacion) => {
        const today = new Date();
        const startDate = new Date(procesoEvaluacion.fechaInicio);
        const endDate = new Date(procesoEvaluacion.fechaFinalizacion);

        console.log(relationalObjects.estatusProcesoEvaluacion);

        if (today < startDate) {
            return relationalObjects.estatusProcesoEvaluacion.find(status => status.idEstatusProceso === EstatusProcesoEnum.Proceso_de_Evaluacion_No_iniciado);
        } else if (today >= startDate && today <= endDate) {
            return relationalObjects.estatusProcesoEvaluacion.find(status => status.idEstatusProceso === EstatusProcesoEnum.Proceso_de_Evaluacion_En_progreso);
        } else {
            return relationalObjects.estatusProcesoEvaluacion.find(status => status.idEstatusProceso === EstatusProcesoEnum.Proceso_de_Evaluacion_Finalizado);
        }
    };

    const getEvaluationTypeName = (idTipoEvaluacion) => {
        const evaluationType = relationalObjects.tiposEvaluacion.find(type => type.idTipoEvaluacion === idTipoEvaluacion);
        return evaluationType ? evaluationType.nombre : 'Desconocido';
    };

    if (loadingSkeleton) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="relative">
            <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mb-4 text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver
            </Button>
            {!desafio || !htmlContent ? (
                <div className='w-full flex flex-col items-center justify-center gap-4 p-8'>
                    <h1 className="text-2xl font-semibold text-center">Desafío no encontrado</h1>
                    <p className="text-muted-foreground text-center">El desafío que buscas no existe o no tienes permisos para verlo.</p>
                </div>
            ) : (
                <div className="flex flex-col xl:flex-row gap-8">
                    <div className='flex-1 order-2 xl:order-1'>
                        <Card className="bg-card text-card-foreground p-6 mb-6">
                            <ChallengeDetail desafio={desafio} htmlContent={htmlContent} getCategoryName={getCategoryName} />
                        </Card>
                    </div>
                    <div className='w-full xl:w-1/3 order-1 xl:order-2'>
                        <Card className="bg-card text-card-foreground p-6 sticky top-8">
                            <div className="flex flex-col sm:flex-row flex-wrap gap-2 justify-between sm:items-center mb-4">
                                <h2 className="text-xl font-semibold">Información del Desafío</h2>
                                <Badge variant={desafio.severidadEstatusDesafio}>
                                    <Icon name={desafio.iconoEstatusDesafio} className="mr-2 h-4 w-4" />
                                    {desafio.estatusDesafio}
                                </Badge>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-background rounded-lg p-4 space-y-3">
                                    <div className="flex items-center text-muted-foreground">
                                        <Calendar className="mr-2 h-5 w-5 text-primary" />
                                        <span className="text-sm"><span className='font-semibold'>Inicio:</span> {formatDate(desafio.fechaInicio)}</span>
                                    </div>
                                    <div className="flex items-center text-muted-foreground">
                                        <Calendar className="mr-2 h-5 w-5 text-primary" />
                                        <span className="text-sm"><span className='font-semibold'>Cierre:</span> {formatDate(desafio.fechaLimite)}</span>
                                    </div>
                                    <div className="flex items-center text-muted-foreground">
                                        <Users className="mr-2 h-5 w-5 text-primary" />
                                        <span className="text-sm">{desafio.soluciones ? desafio.soluciones.length : 0} soluciones enviadas</span>
                                    </div>
                                    <div className="flex items-center text-muted-foreground">
                                        <Clock className="mr-2 h-5 w-5 text-primary" />
                                        <span className="text-sm"><span className='font-semibold'>Registrado:</span> {formatDate(desafio.fechaRegistro)}</span>
                                    </div>
                                </div>
                            </div>

                            {desafio.idEstatusDesafio == EstatusProcesoEnum.Desafio_En_espera_de_entrega_de_premios && (
                                <PrizeEvidenceDialog evidence={desafio.evidenciaRecompensa} challengeId={desafio.idDesafio}>
                                    <Button className="w-full mt-6" variant="outline">
                                        <Eye className="mr-2 h-4 w-4" /> Ver evidencia de premios
                                    </Button>
                                </PrizeEvidenceDialog>
                            )}

                            {desafio.idEstatusDesafio == EstatusProcesoEnum.Desafio_Sin_validar && (
                                <div className='flex flex-col sm:flex-row gap-4 mt-6'>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button className="w-full order-1 sm:order-2" size="sm">
                                                <CircleCheck className="h-4 w-4" />
                                                Validar Desafío
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-80">
                                            <div className='flex gap-2 items-center'>
                                                <CircleAlert className="text-primary" />
                                                <span className='text-sm'>¿Estás seguro de que deseas validar este desafío?</span>
                                            </div>
                                            <div className='flex gap-2 mt-4 justify-end'>
                                                <Button size="sm" variant="outline">
                                                    Cancelar
                                                </Button>
                                                <Button size="sm" onClick={validateChallenge}>
                                                    Validar
                                                </Button>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button className="w-full order-2 sm:order-1" size="sm" variant="ghostDestructive">
                                                <Ban className="h-4 w-4" />
                                                Rechazar Desafío
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-80">
                                            <div className='flex gap-2 items-center'>
                                                <CircleAlert className="text-primary" />
                                                <span className='text-sm'>¿Estás seguro de que deseas rechazar este desafío?</span>
                                            </div>
                                            <Textarea
                                                className="w-full mt-2 p-2"
                                                placeholder="Motivo de rechazo"
                                                value={rejectionReason}
                                                onChange={(e) => setRejectionReason(e.target.value)}
                                            />
                                            <div className='flex gap-2 mt-4 justify-end'>
                                                <Button size="sm" variant="outline">
                                                    Cancelar
                                                </Button>
                                                <Button size="sm" onClick={rejectChallenge}>
                                                    Rechazar
                                                </Button>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            )}

                            {(desafio.idEstatusDesafio === EstatusProcesoEnum.Desafio_En_evaluacion ||
                                desafio.idEstatusDesafio === EstatusProcesoEnum.Desafio_Finalizado ||
                                desafio.idEstatusDesafio === EstatusProcesoEnum.Desafio_En_espera_de_entrega_de_premios) &&
                                (
                                    <Dialog open={isRankingDialogOpen} onOpenChange={setIsRankingDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button className="w-full mt-6" variant="outline">
                                                Ver Ranking de Soluciones
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[625px]">
                                            <DialogHeader>
                                                <DialogTitle>Ranking de Soluciones</DialogTitle>
                                            </DialogHeader>
                                            <SolutionRanking idDesafio={desafio.idDesafio} />
                                        </DialogContent>
                                    </Dialog>
                                )
                            }
                        </Card>

                        <Card className="bg-card text-card-foreground p-6 mt-6">
                            <h2 className="text-xl font-semibold mb-4">Proceso de evaluación</h2>
                            <Timeline>
                                {desafio.procesoEvaluacion.map((proceso, index) => {
                                    const status = getEvaluationStatus(proceso);
                                    return (
                                        <TimelineItem key={index}>
                                            <TimelineHeader>
                                                <TimelineTitle className="text-sm font-medium">{getEvaluationTypeName(proceso.idTipoEvaluacion)}</TimelineTitle>
                                                <TimelineTime variant={status.severidad}>
                                                    <Icon name={status.claseIcono} className="mr-2 h-4 w-4" />
                                                    {status.nombre}
                                                </TimelineTime>
                                            </TimelineHeader>
                                            <TimelineDescription className="text-sm text-muted-foreground">
                                                {formatDate(proceso.fechaInicio)} - {formatDate(proceso.fechaFinalizacion)}
                                            </TimelineDescription>
                                        </TimelineItem>
                                    );
                                })}
                            </Timeline>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

const LoadingSkeleton = () => (
    <div className="flex flex-col xl:flex-row gap-8">
        <div className='flex-1'>
            <Skeleton className="h-24 w-full mb-4" />
            <Skeleton className="h-64 w-full" />
        </div>
        <div className='w-full xl:w-1/3'>
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full mt-6" />
        </div>
    </div>
);

export default AdminChallengeDetails;