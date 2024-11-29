"use client"

import { toast } from 'sonner'
import useAxios from '@/hooks/use-axios'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { FileIcon, ImageIcon, FileTextIcon, FileArchiveIcon as FileZipIcon, ThumbsUp, MoreVertical } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from 'react'

const UserVoting = ({ solutions }) => {
    const { api } = useAxios()
    const [likedSolutions, setLikedSolutions] = useState({})

    const downloadAdjunto = async (idAdjunto) => {
        try {
            const response = await api.get(`/api/Soluciones/DescargarAdjunto/${idAdjunto}`, { responseType: 'blob' })
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', response.headers['content-disposition'].split('filename=')[1])
            document.body.appendChild(link)
            link.click()
            link.remove()
        }
        catch (error) {
            toast.error("Operación fallida", {
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

    const handleLike = (solutionId) => {
        setLikedSolutions(prev => ({
            ...prev,
            [solutionId]: !prev[solutionId]
        }))
        // Aquí puedes agregar la lógica para enviar el like al servidor
    }

    return (
        <div className="flex flex-col gap-4 w-full mx-auto">
            {solutions.map(solution => (
                <Card key={solution.idSolucion} className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-center gap-3 mb-4 sm:mb-0">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={solution.avatarUrl || `https://robohash.org/${solution.nombreUsuario}`} alt={solution.nombreUsuario} />
                                <AvatarFallback>{solution.nombreUsuario.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="font-semibold">{solution.nombreUsuario}</span>
                                <span className="text-sm text-muted-foreground">
                                    {formatearFecha(solution.fechaRegistro)}
                                </span>
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Copiar enlace</DropdownMenuItem>
                                <DropdownMenuItem>Reportar</DropdownMenuItem>
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
                                    onClick={() => downloadAdjunto(adjunto.idAdjunto)}
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

                    <div className="mt-6 flex items-center gap-2 border-t pt-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`flex items-center gap-2 ${likedSolutions[solution.idSolucion] ? 'text-primary' : ''}`}
                            onClick={() => handleLike(solution.idSolucion)}
                        >
                            <ThumbsUp className="w-4 h-4" fill={likedSolutions[solution.idSolucion] ? 'currentColor' : 'none'} />
                            <span className="hidden sm:inline">Me gusta</span>
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    )
}

export default UserVoting
