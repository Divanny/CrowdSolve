'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Card } from '@/components/ui/card'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { CalendarIcon, GripVertical, SaveIcon, PlusCircle, ArrowLeft, X } from "lucide-react"
import { format, addDays } from "date-fns"
import { es } from "date-fns/locale"
import { useNavigate } from 'react-router-dom'

const tiposEvaluacionInicial = [
    { id: 'empresa', label: 'Evaluación por parte de la empresa' },
    { id: 'participantes', label: 'Evaluación por parte de los participantes del desafío' },
    { id: 'comunidad', label: 'Evaluación por parte de la comunidad global' },
]

const categoriasDisponibles = [
    "Tecnología", "Diseño", "Marketing", "Sostenibilidad", "Innovación", "Salud"
]

export default function ChallengeForm() {
    const navigate = useNavigate()
    
    const [titulo, setTitulo] = useState('')
    const [categorias, setCategorias] = useState([])
    const [fechaLimite, setFechaLimite] = useState(null)
    const [procesosEvaluacion, setProcesosEvaluacion] = useState([])
    const [tiposEvaluacionDisponibles, setTiposEvaluacionDisponibles] = useState(tiposEvaluacionInicial)
    const [dialogoAbierto, setDialogoAbierto] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log({ titulo, categorias, fechaLimite, procesosEvaluacion })
    }

    const agregarProcesoEvaluacion = (tipoId) => {
        const nuevoProceso = {
            id: Date.now(),
            tipo: tipoId,
            fechaLimite: addDays(fechaLimite || new Date(), 7),
        }
        setProcesosEvaluacion([...procesosEvaluacion, nuevoProceso])
        setTiposEvaluacionDisponibles(tiposEvaluacionDisponibles.filter(tipo => tipo.id !== tipoId))
        setDialogoAbierto(false)
    }

    const eliminarProcesoEvaluacion = (id) => {
        const procesoEliminado = procesosEvaluacion.find(proceso => proceso.id === id)
        setProcesosEvaluacion(procesosEvaluacion.filter(proceso => proceso.id !== id))
        if (procesoEliminado) {
            const tipoEvaluacion = tiposEvaluacionInicial.find(tipo => tipo.id === procesoEliminado.tipo)
            setTiposEvaluacionDisponibles([...tiposEvaluacionDisponibles, tipoEvaluacion])
        }
    }

    const actualizarFechaProcesoEvaluacion = (id, nuevaFecha) => {
        setProcesosEvaluacion(procesosEvaluacion.map(proceso =>
            proceso.id === id ? { ...proceso, fechaLimite: nuevaFecha } : proceso
        ))
    }

    const onDragEnd = (result) => {
        if (!result.destination) return
        const items = Array.from(procesosEvaluacion)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)
        setProcesosEvaluacion(items)
    }

    return (
        <div className="container mx-auto py-8">
            <div className="mx-auto space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <div>
                        <h1 className="text-2xl font-bold">Publicar desafío</h1>
                        <p className="text-muted-foreground">Complete el formulario para publicar un nuevo desafío</p>
                    </div>
                    <div className='flex items-center gap-4'>
                        <Button variant="outline" className="text-sm" onClick={() => navigate(-1)}>
                            <ArrowLeft className="mr-1 h-4 w-4" /> Volver
                        </Button>
                        <Button type="submit" onClick={handleSubmit}>
                            <SaveIcon className="mr-1 h-4 w-4" /> Guardar Desafío
                        </Button>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-2">
                        <Label htmlFor="titulo">Título del Desafío</Label>
                        <Input
                            id="titulo"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            placeholder="Ingrese el título del desafío"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="categorias">Categorías</Label>
                            <Select
                                onValueChange={(value) => setCategorias([...categorias, value])}
                                value={undefined}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Seleccione las categorías" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoriasDisponibles.map((categoria) => (
                                        <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {categorias.map((categoria) => (
                                    <Badge key={categoria} variant="secondary" className="text-xs">
                                        {categoria}
                                        <button
                                            className="ml-1 text-xs"
                                            onClick={() => setCategorias(categorias.filter(c => c !== categoria))}
                                        >
                                            ×
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fechaLimite">Fecha Límite Principal</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={`w-full justify-start text-left font-normal ${!fechaLimite && "text-muted-foreground"}`}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {fechaLimite ? format(fechaLimite, "PPP", { locale: es }) : <span>Seleccione una fecha</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={fechaLimite}
                                        onSelect={setFechaLimite}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                            <Label className="text-lg font-semibold">Procesos de Evaluación</Label>
                            <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
                                <DialogTrigger asChild>
                                    <Button variant="outline">
                                        <PlusCircle className="mr-1 h-4 w-4" />
                                        Agregar Proceso de Evaluación
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Seleccionar Proceso de Evaluación</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        {tiposEvaluacionDisponibles.map((tipo) => (
                                            <Button
                                                key={tipo.id}
                                                onClick={() => agregarProcesoEvaluacion(tipo.id)}
                                                variant="outline"
                                                className="justify-start"
                                            >
                                                {tipo.label}
                                            </Button>
                                        ))}
                                        {tiposEvaluacionDisponibles.length === 0 && (
                                            <p className="text-muted-foreground">No hay más procesos de evaluación disponibles</p>
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {procesosEvaluacion.length === 0 && (
                            <p className="text-muted-foreground text-center my-2">No hay procesos de evaluación agregados</p>
                        )}

                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="procesos">
                                {(provided) => (
                                    <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                        {procesosEvaluacion.map((proceso, index) => (
                                            <Draggable key={proceso.id} draggableId={proceso.id.toString()} index={index}>
                                                {(provided) => (
                                                    <Card ref={provided.innerRef} {...provided.draggableProps} className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 p-3 rounded">
                                                        <span {...provided.dragHandleProps} className="cursor-move">
                                                            <GripVertical className="h-5 w-5" />
                                                        </span>
                                                        <span className="flex-grow text-sm sm:text-base">{tiposEvaluacionInicial.find(t => t.id === proceso.tipo).label}</span>
                                                        <div className="flex items-center space-x-2 w-full sm:w-auto">
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                                                        {format(proceso.fechaLimite, "dd/MM/yyyy")}
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-0">
                                                                    <Calendar
                                                                        mode="single"
                                                                        selected={proceso.fechaLimite}
                                                                        onSelect={(date) => actualizarFechaProcesoEvaluacion(proceso.id, date)}
                                                                        initialFocus
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                            <Button variant="ghost" size="sm" onClick={() => eliminarProcesoEvaluacion(proceso.id)}>
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </Card>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </ul>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-lg font-semibold" htmlFor="contenido">Contenido del Desafío</Label>
                        <div className="border-2 border-dashed border-input rounded-md p-4 min-h-[200px] sm:min-h-[300px] flex items-center justify-center bg-background">
                            <span className="text-muted-foreground text-center">Área del Editor de Texto (Plate.js)</span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}