"use client"

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import useAxios from '@/hooks/use-axios'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { FileIcon, ImageIcon, FileTextIcon, FileArchiveIcon as FileZipIcon, ThumbsUp, MoreVertical, Loader2 } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslation } from 'react-i18next';
import ProfileHover from "@/components/participants/ProfileHover"
import { useNavigate } from 'react-router-dom'
import * as FileSaver from 'file-saver'

const UserVoting = ({ initialSolutions }) => {
    const { t } = useTranslation();
    const { api } = useAxios()
    const navigate = useNavigate()
    const [solutions, setSolutions] = useState([])
    const [loadingSaveMeGusta, setLoadingSaveMeGusta] = useState(false)

    useEffect(() => {
        const sortedSolutions = [...initialSolutions].sort((a, b) => b.cantidadVotos - a.cantidadVotos)
        setSolutions(sortedSolutions)
    }, [initialSolutions])

    const downloadAdjunto = async (adjunto) => {
        try {
            const response = await api.get(`/api/Soluciones/DescargarAdjunto/${adjunto.idAdjunto}`, { responseType: 'blob' })
            FileSaver.saveAs(response.data, adjunto.nombre)
        } catch (error) {
            toast.error(t('userVoting.descargarAdjuntoError'), {
                description: error.message
            })
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

    const handleLike = async (solution) => {
        if (loadingSaveMeGusta) {
            toast.warning(t('userVoting.Operacionencurso'), {
                description: t('userVoting.esperaOperacion')
            })
        }

        setLoadingSaveMeGusta(true)
        try {
            const updatedSolution = { ...solution, meGusta: !solution.meGusta }
            updatedSolution.cantidadVotos += updatedSolution.meGusta ? 1 : -1

            await api.post(`/api/Soluciones/MeGusta/${solution.idSolucion}`, { requireLoading: false })

            setSolutions(prevSolutions => {
                return prevSolutions.map(s =>
                    s.idSolucion === solution.idSolucion ? updatedSolution : s
                )
            })
        }
        catch (error) {
            toast.error(t('userVoting.operacionFallidaGuardarVoto'), {
                description: error.message
            })
        }
        finally {
            setLoadingSaveMeGusta(false)
        }
    }

    return (
        <div className="flex flex-col gap-4 w-full mx-auto">
            {solutions.length === 0 && (
                <div className="flex flex-col items-center gap-2 my-4">
                    <span className="text-lg font-semibold">{t('userVoting.noHaySolucionesParaEvaluar')}</span>
                    <span className="text-muted-foreground">{t('userVoting.vuelveMasTarde')}</span>
                </div>
            )}
            {solutions.map(solution => (
                <Card key={solution.idSolucion} className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                        <ProfileHover userName={solution.nombreUsuario}>
                            <Button variant="link" className="flex items-center gap-3 mb-4 sm:mb-0 text-normal" onClick={() => navigate(`/profile/${solution.nombreUsuario}`)}>
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={`/api/Account/GetAvatar/${solution.idUsuario}`} alt={solution.nombreUsuario} />
                                    <AvatarFallback>{solution.nombreUsuario.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="font-semibold">{solution.nombreUsuario}</span>
                                    <span className="text-sm text-muted-foreground">
                                        {formatearFecha(solution.fechaRegistro)}
                                    </span>
                                </div>
                            </Button>
                        </ProfileHover>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>{t('userVoting.copiarEnlace')}</DropdownMenuItem>
                                <DropdownMenuItem>{t('userVoting.reportar')}</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="mt-4">
                        <h3 className="text-lg sm:text-xl font-semibold mb-2">{solution.titulo}</h3>
                        <p className="text-sm sm:text-base text-muted-foreground">{solution.descripcion}</p>
                    </div>

                    {solution.adjuntos?.length > 0 && (
                        <div className="mt-6 border rounded-lg divide-y">
                            {solution.adjuntos.map((adjunto) => (
                                <Button
                                    key={adjunto.idAdjunto}
                                    variant="ghost"
                                    className="w-full flex items-center justify-between p-3 h-auto hover:bg-muted"
                                    onClick={() => downloadAdjunto(adjunto)}
                                >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <IconoArchivo tipo={adjunto.contentType} />
                                        <span className="font-medium truncate">{adjunto.nombre}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                        {formatearTamaño(adjunto.tamaño)}
                                    </span>
                                </Button>
                            ))}
                        </div>
                    )}

                    <div className="mt-6 flex items-center justify-between gap-2 border-t pt-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={loadingSaveMeGusta}
                            className={`flex items-center gap-2 ${solution.meGusta ? 'text-primary' : ''}`}
                            onClick={() => handleLike(solution)}
                        >
                            {loadingSaveMeGusta ? (
                                <Loader2 className="h-4 w-4 animate-spin text-muted" />
                            ) : (
                                <ThumbsUp className="w-4 h-4" fill={solution.meGusta ? 'currentColor' : 'none'} />
                            )}
                            <span className="hidden sm:inline">{t('userVoting.meGusta')}</span>
                            <span className="text-sm font-medium">({solution.cantidadVotos})</span>
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            {solution.cantidadVotos} {solution.cantidadVotos === 1 ? t('userVoting.voto') : t('userVoting.votos')}
                        </span>
                    </div>
                </Card>
            ))}
        </div>
    )
}

export default UserVoting