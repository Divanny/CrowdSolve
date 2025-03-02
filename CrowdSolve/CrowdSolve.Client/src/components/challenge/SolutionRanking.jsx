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
import { useTranslation } from 'react-i18next';
import ProfileHover from '@/components/participants/ProfileHover'
import { useNavigate } from 'react-router-dom'
import * as FileSaver from 'file-saver';
import { Skeleton } from '@/components/ui/skeleton'

const SolutionRanking = ({ idDesafio }) => {
    const { t } = useTranslation();
    const { api } = useAxios()
    const navigate = useNavigate()
    const [solutions, setSolutions] = useState([])
    const [detalleSolucionDialog, setDetalleSolucionDialog] = useState(false)
    const [loading, setLoading]  = useState(false)
    const [solucionSeleccionada, setSolucionSeleccionada] = useState(null)

    useEffect(() => {
        fetchRanking()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idDesafio])

    const fetchRanking = async () => {
        setLoading(true)
        try {
            const response = await api.get(`/api/Desafios/GetRanking/${idDesafio}`)
            setSolutions(response.data)
        } catch (error) {
            toast.error(t('solutionRanking.Erroralcargarelranking'), {
                description: error.response?.data?.message ?? error.message,
            })
        }
        setLoading(false)
    }

    const downloadAdjunto = async (adjunto) => {
        try {
            const response = await api.get(`/api/Soluciones/DescargarAdjunto/${adjunto.idAdjunto}`, { responseType: 'blob' })
            FileSaver.saveAs(response.data, adjunto.nombre);
        } catch (error) {
            toast.error(t('solutionRanking.error.title'),
                {
                    description: error.response?.data?.message || t('solutionRanking.error.descriptionFallback')
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
                        <TableHead className="">{t('solutionRanking.Posición')}</TableHead>
                        <TableHead className="">{t('solutionRanking.Usuario')}</TableHead>
                        <TableHead className="">{t('solutionRanking.Título')}</TableHead>
                        {
                            solutions.length > 0 && solutions[0].puntuacion != null && <TableHead className="text-center">{t('solutionRanking.Puntuación')}</TableHead>
                        }
                        {
                            solutions.length > 0 && solutions[0].cantidadVotosComunidad != null && <TableHead className="text-center">{t('solutionRanking.VotosComunidad')}</TableHead>
                        }
                        {
                            solutions.length > 0 && solutions[0].cantidadVotosParticipantes != null && <TableHead className="text-center">{t('solutionRanking.VotosParticipantes')}</TableHead>
                        }
                        <TableHead className="text-center">{t('solutionRanking.Puntuaciónfinal')}</TableHead>
                        <TableHead className="text-right">{t('solutionRanking.Acciones')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading && (
                        <TableRow>
                            <TableCell colSpan={7}>
                                <div className="flex flex-col items-center gap-2 my-4">
                                    <Skeleton className="h-6 w-24" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                    {(solutions.length === 0 && !loading) && (
                        <TableRow>
                            <TableCell colSpan={7}>
                                <div className="flex flex-col items-center gap-2 my-4">
                                    <span className="text-lg font-semibold">{t('solutionRanking.Nohaysolucionesparamostrar')}</span>
                                    <span className="text-muted-foreground">{t('solutionRanking.Elrankingaúnnoestádisponible')}</span>
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
                                            <span className="sr-only">{t('solutionRanking.Verdetalles')}</span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl" onOpenAutoFocus={(event) => event.preventDefault()}>
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
                                                            <p className="text-sm text-muted-foreground text-left">{t('solutionRanking.Autordelasolución')}</p>
                                                        </div>
                                                    </Button>
                                                </ProfileHover>
                                                <div>
                                                    <Label className="text-lg font-semibold">{t('solutionRanking.Descripción')}</Label>
                                                    <ScrollArea className="h-[200px] w-full rounded-md border p-4 mt-2">
                                                        <p className="text-sm">{solucionSeleccionada?.descripcion}</p>
                                                    </ScrollArea>
                                                </div>
                                                <div>
                                                    <Label className="text-lg font-semibold">{t('solutionRanking.attachments')}</Label>
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
                                                        <Label className="text-sm font-medium">{t('solutionRanking.Fechadeenvío')}</Label>
                                                        <p className="text-sm">{solucionSeleccionada && formatearFecha(solucionSeleccionada.fechaRegistro)}</p>
                                                    </div>
                                                    {solucion.puntuacion != null && <div>
                                                        <Label className="text-sm font-medium">{t('solutionRanking.Puntuacióndelaempresa')}</Label>
                                                        <p className="text-sm">{solucionSeleccionada?.puntuacion}</p>
                                                    </div>}
                                                    {solucion.cantidadVotosComunidad != null && <div>
                                                        <Label className="text-sm font-medium">{t('solutionRanking.Votosdelacomunidad')}</Label>
                                                        <p className="text-sm">{solucionSeleccionada?.cantidadVotosComunidad}</p>
                                                    </div>}
                                                    {solucion.cantidadVotosParticipantes != null && <div>
                                                        <Label className="text-sm font-medium">{t('solutionRanking.Votosdeparticipantes')}</Label>
                                                        <p className="text-sm">{solucionSeleccionada?.cantidadVotosParticipantes}</p>
                                                    </div>}
                                                    {solucionSeleccionada?.puntuacionFinal != null && <div>
                                                        <Label className="text-sm font-medium">{t('solutionRanking.Puntuaciónfinaldelasolución')}</Label>
                                                        <p className="text-sm">{solucionSeleccionada?.puntuacionFinal} / {solucionSeleccionada?.puntuacionMaxima}</p>
                                                    </div>}
                                                </div>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="button" variant="secondary" onClick={() => setDetalleSolucionDialog(false)}>
                                                {t('solutionRanking.Cerrar')}
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