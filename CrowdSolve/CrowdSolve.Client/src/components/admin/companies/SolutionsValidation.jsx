"use client"

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, FileIcon, ImageIcon, FileTextIcon, FileArchiveIcon as FileZipIcon, Calendar, Clock, CheckCircle, XCircle, TriangleAlert } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { VisuallyHidden } from '@radix-ui/themes'
import useAxios from '@/hooks/use-axios'
import { toast } from 'sonner'
import EstatusProcesoEnum from '@/enums/EstatusProcesoEnum'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import ProfileHover from '@/components/participants/ProfileHover';
import { useNavigate } from 'react-router-dom'
import * as FileSaver from 'file-saver';

const SolutionsValidation = ({ solutions, reloadChallengeData, canValidate = true }) => {
    const { api } = useAxios()
    const [detalleSolucionDialog, setDetalleSolucionDialog] = useState(false)
    const [solucionSeleccionada, setSolucionSeleccionada] = useState(null)
    const [razonRechazo, setRazonRechazo] = useState('')
    const [selectedEstatus, setSelectedEstatus] = useState(null);
    const [validationError, setValidationError] = useState('');
    const navigate = useNavigate();

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

    const getBadgeVariant = (idEstatusProceso) => {
        switch (idEstatusProceso) {
            case EstatusProcesoEnum.Solucion_Evaluada:
                return 'success';
            case EstatusProcesoEnum.Solucion_Descartada:
                return 'destructive';
            case EstatusProcesoEnum.Solucion_Incompleta:
                return 'warning';
            default:
                return 'secondary';
        }
    };

    const handleCambiarEstatus = async (solucion, idEstatusProceso) => {
        try {
            const payload = {
                idEstatusProceso,
                motivoCambioEstatus: idEstatusProceso === EstatusProcesoEnum.Solucion_Evaluada ? null : razonRechazo
            };
            const response = await api.put(`/api/Soluciones/CambiarEstatus/${solucion.idSolucion}`, payload);

            if (response.data.success) {
                toast.success("Operación exitosa", {
                    description: response.data.message
                });
                setDetalleSolucionDialog(false);
                setRazonRechazo('');
                await reloadChallengeData();
            } else {
                toast.warning("Operación fallida", {
                    description: response.data.message
                });
            }
        } catch (error) {
            toast.error("Operación fallida", {
                description: error.message
            });
        }
    };

    const handleSaveEstatus = async () => {
        if ((selectedEstatus === EstatusProcesoEnum.Solucion_Incompleta || selectedEstatus === EstatusProcesoEnum.Solucion_Descartada) && !razonRechazo) {
            setValidationError('El motivo es requerido para este estatus.');
            return;
        }
        setValidationError('');
        await handleCambiarEstatus(solucionSeleccionada, selectedEstatus);
    };

    const handleDialogOpen = (solucion) => {
        setSolucionSeleccionada(solucion);
        setRazonRechazo('');
    };

    const downloadAdjunto = async (adjunto) => {
        try {
            const response = await api.get(`/api/Soluciones/DescargarAdjunto/${adjunto.idAdjunto}`, { responseType: 'blob' })
            FileSaver.saveAs(response.data, adjunto.nombre);
        } catch (error) {
            toast.error('Operación fallida',
                {
                    description: error.response?.data?.message || 'Ocurrió un error al descargar el archivo'
                }
            )
        }
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Estatus</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {solutions.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5}>
                                <div className="flex flex-col items-center gap-2 my-4">
                                    <span className="text-lg font-semibold">No hay soluciones para validar</span>
                                    <span className="text-muted-foreground">Por favor, vuelve más tarde</span>
                                </div>
                            </TableCell>
                        </TableRow>
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
                                <Badge variant={getBadgeVariant(solucion.idEstatusProceso)}>
                                    {solucion.estatusProceso}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Dialog open={detalleSolucionDialog} onOpenChange={setDetalleSolucionDialog}>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="icon" onClick={() => handleDialogOpen(solucion)}>
                                            <Eye className="h-4 w-4" />
                                            <span className="sr-only">Ver detalles</span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl">
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl font-bold">{solucionSeleccionada?.titulo}</DialogTitle>
                                            <VisuallyHidden>
                                                <DialogDescription>Detalles de la solución</DialogDescription>
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
                                                            <p className="text-sm text-muted-foreground text-left">Autor de la solución</p>
                                                        </div>
                                                    </Button>
                                                </ProfileHover>
                                                <Separator />
                                                <div>
                                                    <Label className="text-lg font-semibold">Descripción</Label>
                                                    <ScrollArea className="h-[200px] w-full rounded-md border p-4 mt-2">
                                                        <p className="text-sm">{solucionSeleccionada?.descripcion}</p>
                                                    </ScrollArea>
                                                </div>
                                                <div>
                                                    <Label className="text-lg font-semibold">Archivos adjuntos</Label>
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
                                                                <Label className="text-sm font-medium">Fecha de envío</Label>
                                                            </div>
                                                            <p className="text-sm">{formatearFecha(solucionSeleccionada?.fechaRegistro)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div>
                                                            <div className='flex items-center gap-1'>
                                                                <Clock className="w-4 h-4 text-muted-foreground" />
                                                                <Label className="text-sm font-medium">Estatus</Label>
                                                            </div>
                                                            <Badge variant={getBadgeVariant(solucionSeleccionada?.idEstatusProceso)} className="mt-1">
                                                                {solucionSeleccionada?.estatusProceso || 'Enviada'}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Separator />
                                                {canValidate && (
                                                    <div className="space-y-4">
                                                        <Label className="text-lg font-semibold">Validación</Label>
                                                        <Select onValueChange={setSelectedEstatus}>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Seleccione un estatus" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value={EstatusProcesoEnum.Solucion_Evaluada}>
                                                                    <Badge variant="success">
                                                                        <div className="flex items-center gap-1">
                                                                            <CheckCircle className="w-4 h-4" />
                                                                            Validar
                                                                        </div>
                                                                    </Badge>
                                                                </SelectItem>
                                                                <SelectItem value={EstatusProcesoEnum.Solucion_Incompleta}>
                                                                    <Badge variant="warning">
                                                                        <div className="flex items-center gap-1">
                                                                            <TriangleAlert className="w-4 h-4" />
                                                                            Incompleta
                                                                        </div>
                                                                    </Badge>
                                                                </SelectItem>
                                                                <SelectItem value={EstatusProcesoEnum.Solucion_Descartada}>
                                                                    <Badge variant="destructive">
                                                                        <div className="flex items-center gap-1">
                                                                            <XCircle className="w-4 h-4" />
                                                                            Descartar
                                                                        </div>
                                                                    </Badge>
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        {(selectedEstatus === EstatusProcesoEnum.Solucion_Incompleta || selectedEstatus === EstatusProcesoEnum.Solucion_Descartada) && (
                                                            <div>
                                                                <Label htmlFor="razon-rechazo">Motivo</Label>
                                                                <Textarea
                                                                    id="razon-rechazo"
                                                                    placeholder="Explique el motivo del cambio de estatus..."
                                                                    value={razonRechazo}
                                                                    onChange={(e) => setRazonRechazo(e.target.value)}
                                                                    className="mt-2"
                                                                />
                                                                {validationError && <p className="text-red-500 text-sm">{validationError}</p>}
                                                            </div>
                                                        )}
                                                        <Button onClick={handleSaveEstatus} className="mt-4">
                                                            Guardar
                                                        </Button>
                                                        {solucionSeleccionada?.idEstatusProceso !== EstatusProcesoEnum.Solucion_Enviada && (
                                                            <p className="text-sm">
                                                                Esta solución ya ha sido {solucionSeleccionada?.estatusProceso.toLowerCase()}.
                                                                {solucionSeleccionada?.razonRechazo && (
                                                                    <>
                                                                        <br />
                                                                        <strong>Motivo:</strong> {solucionSeleccionada.razonRechazo}
                                                                    </>
                                                                )}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="button" variant="secondary" onClick={() => setDetalleSolucionDialog(false)}>
                                                Cerrar
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

export default SolutionsValidation;