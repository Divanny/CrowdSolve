"use client"

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, Trophy, FileIcon, ImageIcon, FileTextIcon, FileArchiveIcon as FileZipIcon } from 'lucide-react'
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import useAxios from '@/hooks/use-axios'
import { toast } from 'sonner'
import { Badge } from "@/components/ui/badge"
import ProfileHover from '@/components/participants/ProfileHover'
import { useNavigate } from 'react-router-dom'
import * as FileSaver from 'file-saver';

const SolutionRanking = ({ idDesafio }) => {
    const { api } = useAxios()
    const navigate = useNavigate()
    const [solutions, setSolutions] = useState([])
    const [detalleSolucionDialog, setDetalleSolucionDialog] = useState(false)
    const [solucionSeleccionada, setSolucionSeleccionada] = useState(null)

    useEffect(() => {
        fetchRanking()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idDesafio])

    const fetchRanking = async () => {
        try {
            const response = await api.get(`/api/Desafios/GetRanking/${idDesafio}`)
            setSolutions(response.data)
        } catch (error) {
            toast.error("Error al cargar el ranking", {
                description: error.response?.data?.message ?? error.message,
            })
        }
    }

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

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const handleDialogOpen = (solucion) => {
        setSolucionSeleccionada(solucion)
        setDetalleSolucionDialog(true)
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="">Posición</TableHead>
                        <TableHead className="">Usuario</TableHead>
                        <TableHead className="">Título</TableHead>
                        {
                            solutions.length > 0 && solutions[0].puntuacion != null && <TableHead className="text-center">Puntuación</TableHead>
                        }
                        {
                            solutions.length > 0 && solutions[0].cantidadVotosComunidad != null && <TableHead className="text-center">Votos Comunidad</TableHead>
                        }
                        {
                            solutions.length > 0 && solutions[0].cantidadVotosParticipantes != null && <TableHead className="text-center">Votos Participantes</TableHead>
                        }
                        <TableHead className="text-center">Puntuación final</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {solutions.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7}>
                                <div className="flex flex-col items-center gap-2 my-4">
                                    <span className="text-lg font-semibold">No hay soluciones para mostrar</span>
                                    <span className="text-muted-foreground">El ranking aún no está disponible</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                    {solutions.map((solucion, index) => (
                        <TableRow key={solucion.idSolucion} className='text-card-foreground'>
                            <TableCell className="w-16">
                                <div className="flex items-center justify-center">
                                    {index < 3 ? (
                                        <Trophy className={`h-6 w-6 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-amber-600'}`} />
                                    ) : (
                                        <span>{index + 1}</span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="w-48">
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
                            <TableCell >{solucion.titulo}</TableCell>
                            {solucion.puntuacion != null && <TableCell className="w-24 text-center">{solucion.puntuacion}</TableCell>}
                            {solucion.cantidadVotosComunidad != null && <TableCell className="w-24 text-center">{solucion.cantidadVotosComunidad}</TableCell>}
                            {solucion.cantidadVotosParticipantes != null && <TableCell className="w-24 text-center">{solucion.cantidadVotosParticipantes}</TableCell>}
                            <TableCell className="w-40 text-center">
                                <Badge variant="secondary">{solucion.puntuacionFinal} / {solucion.puntuacionMaxima}</Badge>
                            </TableCell>
                            <TableCell className="w-20 text-right">
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
                                                    <div>
                                                        <Label className="text-sm font-medium">Fecha de envío</Label>
                                                        <p className="text-sm">{solucionSeleccionada && formatearFecha(solucionSeleccionada.fechaRegistro)}</p>
                                                    </div>
                                                    {solucion.puntuacion != null && <div>
                                                        <Label className="text-sm font-medium">Puntuación de la empresa</Label>
                                                        <p className="text-sm">{solucionSeleccionada?.puntuacion}</p>
                                                    </div>}
                                                    {solucion.cantidadVotosComunidad != null && <div>
                                                        <Label className="text-sm font-medium">Votos de la comunidad</Label>
                                                        <p className="text-sm">{solucionSeleccionada?.cantidadVotosComunidad}</p>
                                                    </div>}
                                                    {solucion.cantidadVotosParticipantes != null && <div>
                                                        <Label className="text-sm font-medium">Votos de participantes</Label>
                                                        <p className="text-sm">{solucionSeleccionada?.cantidadVotosParticipantes}</p>
                                                    </div>}
                                                    {solucionSeleccionada?.puntuacionFinal != null && <div>
                                                        <Label className="text-sm font-medium">Puntuación final</Label>
                                                        <p className="text-sm">{solucionSeleccionada?.puntuacionFinal} / {solucionSeleccionada?.puntuacionMaxima}</p>
                                                    </div>}
                                                </div>
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
    )
}

export default SolutionRanking