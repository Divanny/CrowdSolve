"use client"

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, Trophy } from 'lucide-react'
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import useAxios from '@/hooks/use-axios'
import { toast } from 'sonner'
import { Badge } from "@/components/ui/badge"

const SolutionRanking = ({ idDesafio }) => {
    const { api } = useAxios()
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

            for (const solucion of response.data) {
                try {
                    const responseAvatarURL = await api.get(`/api/Account/GetAvatar/${solucion.idUsuario}`, { responseType: 'blob', requireLoading: false })
                    if (responseAvatarURL.status == 200) {
                        const avatarBlob = new Blob([responseAvatarURL.data], { type: responseAvatarURL.headers['content-type'] })
                        solucion.avatarUrl = URL.createObjectURL(avatarBlob)
                    }
                }
                catch {
                    solucion.avatarUrl = null
                }
            }

            setSolutions(response.data)
        } catch (error) {
            toast.error("Error al cargar el ranking", {
                description: error.response?.data?.message ?? error.message,
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
                                <div className="flex items-center space-x-2">
                                    <Avatar>
                                        <AvatarImage src={solucion.avatarUrl || `https://robohash.org/${solucion.nombreUsuario}`} alt={solucion.nombreUsuario} />
                                        <AvatarFallback>{solucion.nombreUsuario.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span>{solucion.nombreUsuario}</span>
                                </div>
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
                                                <div className="flex items-center space-x-4">
                                                    <Avatar className="w-16 h-16">
                                                        <AvatarImage src={solucionSeleccionada?.avatarUrl || `https://robohash.org/${solucionSeleccionada?.nombreUsuario}`} alt={solucionSeleccionada?.nombreUsuario} />
                                                        <AvatarFallback>{solucionSeleccionada?.nombreUsuario.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-lg font-semibold">{solucionSeleccionada?.nombreUsuario}</p>
                                                        <p className="text-sm text-muted-foreground">Autor de la solución</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label className="text-lg font-semibold">Descripción</Label>
                                                    <ScrollArea className="h-[200px] w-full rounded-md border p-4 mt-2">
                                                        <p className="text-sm">{solucionSeleccionada?.descripcion}</p>
                                                    </ScrollArea>
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