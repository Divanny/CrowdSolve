"use client"

import { useEffect, useState } from 'react'
import useAxios from '@/hooks/use-axios'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileIcon, ThumbsUpIcon, ImageIcon, FileTextIcon, FileArchiveIcon as FileZipIcon, SearchIcon, Send } from 'lucide-react'
import { toast } from 'sonner'
import Icon from '@/components/ui/icon'
import { Link } from 'react-router-dom'
import * as FileSaver from 'file-saver'
import { useTranslation } from 'react-i18next';

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

const formatearTamaño = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return '0 Byte'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString())
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
}

export default function MySolutions() {
    const { t } = useTranslation();
    const { api } = useAxios()
    const [solutions, setSolutions] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')

    useEffect(() => {
        const fetchSolutions = async () => {
            try {
                const response = await api.get('/api/Soluciones/GetMisSoluciones')
                setSolutions(response.data)
            } catch (error) {
                console.error('Error fetching solutions:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchSolutions()

        // eslint-disable-next-line
    }, [])

    const togglePublicStatus = async (solutionId, currentStatus) => {
        try {
            await api.put(`/api/Soluciones/Publicar/${solutionId}`)
            setSolutions(solutions.map(solution =>
                solution.idSolucion === solutionId ? { ...solution, publica: (currentStatus == null ? false : !currentStatus) } : solution
            ))
        } catch (error) {
            toast.error(t('mySolutions.messages.changeVisibilityError'), { description: error.response?.data?.message })
        }
    }

    const downloadAdjunto = async (adjunto) => {
        try {
            const response = await api.get(`/api/Soluciones/DescargarAdjunto/${adjunto.idAdjunto}`, { responseType: 'blob' })
            FileSaver.saveAs(response.data, adjunto.nombre)
        } catch (error) {
            toast.error(t('mySolutions.messages.downloadError'),
                {
                    description: error.response?.data?.message || t('mySolutions.messages.downloadErrorMessage')
                }
            )
        }
    }

    const filteredSolutions = solutions.filter(solution => {
        const matchesSearch = solution.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            solution.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = filterStatus === 'all' ||
            (filterStatus === 'public' && solution.publica) ||
            (filterStatus === 'private' && !solution.publica)
        return matchesSearch && matchesStatus
    })

    if (loading) {
        return (
            <div className="container space-y-4">
                {[...Array(6)].map((_, index) => (
                    <Card key={index}>
                        <CardContent className="p-4">
                            <Skeleton className="h-6 w-2/3 mb-2" />
                            <Skeleton className="h-4 w-1/2 mb-4" />
                            <Skeleton className="h-20 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-3xl font-bold mb-6 flex items-center">
                <Send className="w-6 h-6 mr-2" />
                {t('mySolutions.titles.mySolutions')}
            </h1>
            <div className="flex justify-between items-center flex-col sm:flex-row mb-4 gap-2">
                <div className="relative w-full sm:w-64">
                    <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                    <Input
                        type="text"
                        placeholder={t('mySolutions.filters.searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t('mySolutions.filters.statusOptions.all')}</SelectItem>
                        <SelectItem value="public">{t('mySolutions.filters.statusOptions.public')}</SelectItem>
                        <SelectItem value="private">{t('mySolutions.filters.statusOptions.private')}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-4">
                {filteredSolutions.map((solution) => (
                    <Card key={solution.idSolucion}>
                        <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                                <div className="flex gap-2 sm:gap-4 items-start sm:items-center w-full sm:w-auto">
                                    <Avatar>
                                        <AvatarImage src={`/api/Account/GetAvatar/${solution.desafio.idUsuarioEmpresa}`} />
                                        <AvatarFallback>{solution.desafio.empresa.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-xl font-semibold truncate">{solution.desafio.titulo}</h2>
                                        <p className="text-sm text-muted-foreground truncate">{solution.titulo}</p>
                                    </div>
                                </div>
                                <Badge variant={solution.severidadEstatusProceso} className="flex gap-1 mt-2 sm:mt-0">
                                    <Icon name={solution.iconoEstatusProceso} size={16} />
                                    {solution.estatusProceso}
                                </Badge>
                            </div>
                            <div className="flex items-center space-x-2 mb-2">
                                <Badge variant={solution.desafio.severidadEstatusDesafio === 'success' ? 'default' : 'secondary'}>
                                    {solution.desafio.estatusDesafio}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 w-full">
                                <div>
                                    <p className="text-xs text-muted-foreground">{t('mySolutions.company')}</p>
                                    <p className="text-sm font-medium truncate">{solution.desafio.empresa}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">{t('mySolutions.submissionDate')}</p>
                                    <p className="text-sm">{new Date(solution.fechaRegistro).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <Badge variant="outline">
                                    <FileIcon className="w-4 h-4 mr-1" />
                                    {solution.adjuntos.length} {t('mySolutions.attachmentLabel')}
                                </Badge>
                                <Badge variant="outline">
                                    <ThumbsUpIcon className="w-4 h-4 mr-1" />
                                    {solution.cantidadVotos} {t('mySolutions.votesLabel')}
                                </Badge>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-between items-center">
                                <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                                    <Switch
                                        id={`public-${solution.idSolucion}`}
                                        checked={solution.publica ?? false}
                                        onCheckedChange={() => togglePublicStatus(solution.idSolucion, solution.publica)}
                                    />
                                    <label
                                        htmlFor={`public-${solution.idSolucion}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {(solution.publica ?? false) ? t('mySolutions.filters.statusOptions.public') : t('mySolutions.filters.statusOptions.private')}
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button variant="ghost">
                                        <Link to={`/challenge/${solution.desafio.idDesafio}`} className="flex items-center space-x-1">
                                        {t('mySolutions.buttons2.viewChallenge')}
                                        </Link>
                                    </Button>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline">{t('mySolutions.buttons2.viewDetails')}</Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>{solution.titulo}</DialogTitle>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <p className="text-sm font-medium col-span-4">{t('mySolutions.dialog.descriptionLabel')}</p>
                                                    <p className="text-sm text-muted-foreground col-span-4">{solution.descripcion}</p>
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <p className="text-sm font-medium col-span-4">{t('mySolutions.dialog.attachmentsLabel')}</p>
                                                    <div className="col-span-4 space-y-2">
                                                        {solution.adjuntos.map((adjunto) => (
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
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

