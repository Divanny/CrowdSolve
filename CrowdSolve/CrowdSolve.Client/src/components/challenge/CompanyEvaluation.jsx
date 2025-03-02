"use client"

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, FileIcon, ImageIcon, FileTextIcon, FileArchiveIcon as FileZipIcon, Calendar, Clock, Star } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import { VisuallyHidden } from '@radix-ui/themes'
import useAxios from '@/hooks/use-axios';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom'
import ProfileHover from '../participants/ProfileHover'
import * as FileSaver from 'file-saver'

const CompanyEvaluation = ({ solutions, reloadChallengeData }) => {
    const { t } = useTranslation();
    const { api } = useAxios()
    const [puntuaciones, setPuntuaciones] = useState({})
    const [detalleSolucionDialog, setDetalleSolucionDialog] = useState(false)
    const [solucionSeleccionada, setSolucionSeleccionada] = useState(null)
    const navigate = useNavigate()

    const handlePuntuacionChange = (idSolucion, value) => {
        setPuntuaciones(prev => ({ ...prev, [idSolucion]: value[0] }))
    }

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatearTamaño = (bytes) => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        if (bytes === 0) return '0 Byte'
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString())
        return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
    }

    const IconoArchivo = ({ tipo }) => {
        switch (tipo) {
            case 'image/png':
            case 'image/jpeg':
            case 'image/gif':
            case 'image/webp':
            case 'image/svg+xml':
                return <ImageIcon className="w-4 h-4" />
            case 'application/pdf':
                return <FileTextIcon className="w-4 h-4" />
            case 'application/zip':
                return <FileZipIcon className="w-4 h-4" />
            default:
                return <FileIcon className="w-4 h-4" />
        }
    }

    const getBadgeVariant = (puntuacion) => {
        if (puntuacion >= 75) return 'success';
        if (puntuacion >= 50) return 'warning';
        if (puntuacion > 0) return 'destructive';
        return 'secondary';
    };

    const handleGuardarPuntuacion = async (solucion) => {
        try {
            const response = await api.put(`/api/Soluciones/Puntuar/${solucion.idSolucion}`, { ...solucion, puntuacion: puntuaciones[solucion.idSolucion] })

            if (response.data.success) {
                toast.success(t('companyEvaluation.messages.operationSuccessful'), {
                    description: response.data.message
                });
                setDetalleSolucionDialog(false);
                await reloadChallengeData();
            }
            else {
                toast.warning(t('companyEvaluation.messages.operationFailed'), {
                    description: response.data.message
                });
            }
        }
        catch (error) {
            toast.error(t('companyEvaluation.messages.operationFailed'), {
                description: error.message
            });
        }
    };

    const handleDialogOpen = (solucion) => {
        setSolucionSeleccionada(solucion);
        setPuntuaciones(prev => ({ ...prev, [solucion.idSolucion]: solucion.puntuacion || 0 }));
    };

    const downloadAdjunto = async (adjunto) => {
        try {
            const response = await api.get(`/api/Soluciones/DescargarAdjunto/${adjunto.idAdjunto}`, { responseType: 'blob' })
            FileSaver.saveAs(response.data, adjunto.nombre);
        } catch (error) {
            toast.error(t('companyEvaluation.messages.operationFailed'), {
                description: error.message
            });
        }
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t('companyEvaluation.fields.user')}</TableHead>
                        <TableHead>{t('companyEvaluation.fields.title')}</TableHead>
                        <TableHead>{t('companyEvaluation.fields.date')}</TableHead>
                        <TableHead>{t('companyEvaluation.fields.status')}</TableHead>
                        <TableHead>{t('companyEvaluation.fields.rating')}</TableHead>
                        <TableHead className="text-right">{t('companyEvaluation.fields.tableActions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {solutions.length === 0 && (
                        <div className="flex flex-col items-center gap-2 my-4">
                            <span className="text-lg font-semibold">{t('companyEvaluation.messages.noSolutionsToEvaluate')}</span>
                            <span className="text-muted-foreground">{t('companyEvaluation.messages.pleaseComeBackLater')}</span>
                        </div>
                    )}
                    {solutions.map((solucion) => (
                        <TableRow key={solucion.idSolucion}>
                            <TableCell>
                                <ProfileHover userName={solucion.nombreUsuario}>
                                    <Button variant="link" className="flex items-center space-x-2 text-normal" onClick={() => navigate(`/profile/${solucion.nombreUsuario}`)}>
                                        <Avatar>
                                            <AvatarImage src={`/api/Account/GetAvatar/${solucion.idUsuario}`} alt={solucion.nombreUsuario} />
                                            <AvatarFallback>{solucion.nombreUsuario.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span>{solucion.nombreUsuario}</span>
                                    </Button>
                                </ProfileHover>
                            </TableCell>
                            <TableCell>{solucion.titulo}</TableCell>
                            <TableCell>{formatearFecha(solucion.fechaRegistro)}</TableCell>
                            <TableCell>
                                <Badge variant="outline">{solucion.estatusProceso}</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant={getBadgeVariant(solucion.puntuacion)}>
                                    {solucion.puntuacion || t('companyEvaluation.statuses.notEvaluated')}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Dialog open={detalleSolucionDialog} onOpenChange={setDetalleSolucionDialog}>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="icon" onClick={() => handleDialogOpen(solucion)}>
                                            <Eye className="h-4 w-4" />
                                            <span className="sr-only">{t('companyEvaluation.buttons.viewDetails')}</span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl" onOpenAutoFocus={(event) => event.preventDefault()}>
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl font-bold">{solucionSeleccionada?.titulo}</DialogTitle>
                                            <VisuallyHidden>
                                                <DialogDescription>{t('companyEvaluation.messages.solutionDetails')}</DialogDescription>
                                            </VisuallyHidden>
                                        </DialogHeader>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                                            <div className="md:col-span-2 space-y-6">
                                                <ProfileHover userName={solucionSeleccionada?.nombreUsuario}>
                                                    <Button variant="link" className="flex items-center space-x-4 text-normal" onClick={() => navigate(`/profile/${solucionSeleccionada?.nombreUsuario}`)}>
                                                        <Avatar className="w-16 h-16">
                                                            <AvatarImage src={`/api/Account/GetAvatar/${solucionSeleccionada?.idUsuario}`} alt={solucionSeleccionada?.nombreUsuario} />
                                                            <AvatarFallback>{solucionSeleccionada?.nombreUsuario.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div className='flex flex-col justify-start'>
                                                            <p className="text-lg font-semibold text-left">{solucionSeleccionada?.nombreUsuario}</p>
                                                            <p className="text-sm text-muted-foreground text-left">{t('companyEvaluation.messages.authorOfSolution')}</p>
                                                        </div>
                                                    </Button>
                                                </ProfileHover>
                                                <Separator />
                                                <div>
                                                    <Label className="text-lg font-semibold">{t('companyEvaluation.messages.description')}</Label>
                                                    <ScrollArea className="h-[200px] w-full rounded-md border p-4 mt-2">
                                                        <p className="text-sm">{solucionSeleccionada?.descripcion}</p>
                                                    </ScrollArea>
                                                </div>
                                                <div>
                                                    <Label className="text-lg font-semibold">{t('companyEvaluation.messages.attachedFiles')}</Label>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                                        {solucionSeleccionada?.adjuntos.map((adjunto) => (
                                                            <Button
                                                                key={adjunto.idAdjunto}
                                                                variant="outline"
                                                                size="sm"
                                                                className="flex items-center justify-start space-x-2 w-full"
                                                                onClick={() => downloadAdjunto(adjunto)}
                                                            >
                                                                <IconoArchivo tipo={adjunto.contentType} />
                                                                <span className="truncate flex-1">{adjunto.nombre}</span>
                                                                <span className="text-xs text-muted-foreground whitespace-nowrap">{formatearTamaño(adjunto.tamaño)}</span>
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="bg-muted p-4 rounded-lg space-y-4">
                                                    <div className="flex items-center space-x-2">
                                                        <div>
                                                            <div className='flex items-center gap-1'>
                                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                                <Label className="text-sm font-medium">{t('companyEvaluation.messages.sendDate')}</Label>
                                                            </div>
                                                            <p className="text-sm">{formatearFecha(solucionSeleccionada?.fechaRegistro)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div>
                                                            <div className='flex items-center gap-1'>
                                                                <Clock className="w-4 h-4 text-muted-foreground" />
                                                                <Label className="text-sm font-medium">{t('companyEvaluation.fields.status')}</Label>
                                                            </div>
                                                            <Badge variant="outline" className="mt-1">{solucionSeleccionada?.estatusProceso}</Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Separator />
                                                <div className="space-y-4">
                                                    <Label htmlFor={`puntuacion-${solucionSeleccionada?.idSolucion}`} className="text-lg font-semibold flex items-center gap-2">
                                                        <Star className="w-5 h-5 text-primary" />
                                                        {t('companyEvaluation.messages.rating')}
                                                    </Label>
                                                    <div className="flex items-center space-x-4">
                                                        <Slider
                                                            id={`puntuacion-${solucionSeleccionada?.idSolucion}`}
                                                            max={100}
                                                            step={1}
                                                            value={[puntuaciones[solucionSeleccionada?.idSolucion] || 0]}
                                                            onValueChange={(value) => handlePuntuacionChange(solucionSeleccionada?.idSolucion, value)}
                                                            className="flex-1"
                                                        />
                                                        <span className="font-bold text-lg w-12 text-center">
                                                            {puntuaciones[solucionSeleccionada?.idSolucion] || 0}
                                                        </span>
                                                    </div>
                                                    <Button onClick={() => handleGuardarPuntuacion(solucionSeleccionada)} className="w-full">
                                                        {t('companyEvaluation.messages.saveRating')}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="button" variant="secondary" onClick={() => setDetalleSolucionDialog(false)}>
                                                {t('companyEvaluation.buttons.close')}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default CompanyEvaluation;