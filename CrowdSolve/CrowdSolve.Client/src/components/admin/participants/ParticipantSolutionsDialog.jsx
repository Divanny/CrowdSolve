import { useEffect, useState } from "react"
import useAxios from "@/hooks/use-axios"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import Icon from '@/components/ui/icon'
import { Link } from 'react-router-dom'
import { FileIcon, ThumbsUpIcon, ImageIcon, FileTextIcon, FileArchiveIcon as FileZipIcon, SearchIcon } from 'lucide-react'
import { toast } from "sonner";
import * as FileSaver from 'file-saver'
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTranslation } from 'react-i18next'

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

export function ParticipantSolutionsDialog({ isOpen, onClose, participant }) {
    const { t } = useTranslation();
    const { api } = useAxios();
    const [loading, setLoading] = useState(true);
    const [solutions, setSolutions] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const fetchSolutions = async () => {
            setLoading(true)
            try {
                const response = await api.get(`/api/Participantes/GetSolucionesParticipante/${participant.idParticipante}`, { requireLoading: false })
                setSolutions(response.data)
            } catch (error) {
                console.error('Error fetching solutions:', error)
            } finally {
                setLoading(false)
            }
        }

        if (isOpen && participant) {
            fetchSolutions()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, participant])

    const downloadAdjunto = async (adjunto) => {
        try {
            const response = await api.get(`/api/Soluciones/DescargarAdjunto/${adjunto.idAdjunto}`, { responseType: 'blob' })
            FileSaver.saveAs(response.data, adjunto.nombre)
        } catch (error) {
            toast.error(t('ParticipantSolutionsDialog.downloadError.title'),
                {
                    description: error.response?.data?.message || t('ParticipantSolutionsDialog.downloadError.description')
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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-fit" aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>{t('ParticipantSolutionsDialog.title')} {participant.nombreUsuario}</DialogTitle>
                </DialogHeader>
                <div className="flex justify-between items-center flex-col sm:flex-row gap-2">
                    <div className="relative w-full sm:w-64">
                        <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                        <Input
                            type="text"
                            placeholder={t('ParticipantSolutionsDialog.searchPlaceholder')}
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
                            <SelectItem value="all">{t('ParticipantSolutionsDialog.statusOptions.all')}</SelectItem>
                            <SelectItem value="public">{t('ParticipantSolutionsDialog.statusOptions.public')}</SelectItem>
                            <SelectItem value="private">{t('ParticipantSolutionsDialog.statusOptions.private')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <ScrollArea className="max-h-[70vh]">
                    {loading ? (
                        <div className="space-y-4">
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
                    ) : (
                        <>
                            {!loading && filteredSolutions.length === 0 && (
                                <div className="text-center text-muted-foreground">
                                    {t('ParticipantSolutionsDialog.noSolutions')}
                                </div>
                            )}
                            {!loading && filteredSolutions.length > 0 && (
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
                                                        <p className="text-xs text-muted-foreground">{t('ParticipantSolutionsDialog.solutionDetails.company')}</p>
                                                        <p className="text-sm font-medium truncate">{solution.desafio.empresa}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">{t('ParticipantSolutionsDialog.solutionDetails.submissionDate')}</p>
                                                        <p className="text-sm">{new Date(solution.fechaRegistro).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    <Badge variant="outline">
                                                        <FileIcon className="w-4 h-4 mr-1" />
                                                        {solution.adjuntos.length} {t('ParticipantSolutionsDialog.solutionDetails.submissionDate')}
                                                    </Badge>
                                                    <Badge variant="outline">
                                                        <ThumbsUpIcon className="w-4 h-4 mr-1" />
                                                        {solution.cantidadVotos} {t('ParticipantSolutionsDialog.solutionDetails.votes')}
                                                    </Badge>
                                                </div>
                                                <div className="flex flex-col sm:flex-row justify-between items-center">
                                                    <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                                                        <Switch
                                                            id={`public-${solution.idSolucion}`}
                                                            checked={solution.publica ?? false}
                                                        />
                                                        <label
                                                            htmlFor={`public-${solution.idSolucion}`}
                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                        >
                                                            {(solution.publica ?? false) ? t('ParticipantSolutionsDialog.publicLabel') : t('ParticipantSolutionsDialog.privateLabel')}
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Button variant="ghost">
                                                            <Link to={`/challenge/${solution.desafio.idDesafio}`} className="flex items-center space-x-1">
                                                            {t('ParticipantSolutionsDialog.viewChallenge')}
                                                            </Link>
                                                        </Button>
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button variant="outline">{t('ParticipantSolutionsDialog.viewDetails')}</Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="sm:max-w-[425px]">
                                                                <DialogHeader>
                                                                    <DialogTitle>{solution.titulo}</DialogTitle>
                                                                </DialogHeader>
                                                                <div className="grid gap-4 py-4">
                                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                                        <p className="text-sm font-medium col-span-4">{t('ParticipantSolutionsDialog.dialog.descriptionTitle')}</p>
                                                                        <p className="text-sm text-muted-foreground col-span-4">{solution.descripcion}</p>
                                                                    </div>
                                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                                        <p className="text-sm font-medium col-span-4">{t('ParticipantSolutionsDialog.dialog.attachmentsTitle')}</p>
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
                            )}
                        </>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}