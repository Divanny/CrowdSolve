'use client'

import { useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card } from '@/components/ui/card'
import { MultiSelect } from '@/components/ui/multi-select'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { CalendarIcon, GripVertical, SaveIcon, PlusCircle, ArrowLeft, X } from "lucide-react"
import { toast } from "sonner";
import { format, addDays } from "date-fns"
import { es } from "date-fns/locale"
import { useNavigate, useParams } from 'react-router-dom'
import { PlateEditor } from '@/components/ui/plate-editor'
import useAxios from "@/hooks/use-axios"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
    idDesafio: z.number().optional(),
    idUsuarioEmpresa: z.number().optional(),
    idEmpresa: z.number(),
    empresa: z.string().optional(),
    titulo: z.string().min(1, "Debe especificar el título"),
    contenido: z.string().min(1, "Debe especificar el contenido"),
    fechaInicio: z.date({ required_error: "Debe especificar la fecha inicio de envío de soluciones" }),
    fechaLimite: z.date({ required_error: "Debe especificar la fecha límite de envío de soluciones" }),
    categorias: z.array(z.object({
        idDesafioCategoria: z.number().optional(),
        idDesafio: z.number().optional(),
        idCategoria: z.number()
    })).min(1, "Debe especificar las categorías"),
    procesoEvaluacion: z.array(z.object({
        idProcesoEvaluacion: z.number().optional(),
        idDesafio: z.number().optional(),
        idTipoEvaluacion: z.number(),
        fechaFinalizacion: z.date()
    })).min(1, "Debe especificar el proceso de evaluación del desafío"),
    idEstatusDesafio: z.number().optional(),
    estatusDesafio: z.string().optional()
})

export default function ChallengeForm() {
    const { api } = useAxios()
    const navigate = useNavigate()
    const { id } = useParams()
    const modoEdicion = id !== undefined

    const [categoriasDisponibles, setCategoriasDisponibles] = useState([])
    const [tiposEvaluacionDisponibles, setTiposEvaluacionDisponibles] = useState([])
    const [dialogoAbierto, setDialogoAbierto] = useState(false)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            idDesafio: 0,
            idUsuarioEmpresa: 0,
            idEmpresa: 0,
            empresa: '',
            titulo: '',
            contenido: '',
            fechaInicio: new Date(),
            fechaLimite: new Date(),
            categorias: [],
            procesoEvaluacion: [],
            idEstatusDesafio: 0,
            estatusDesafio: ''
        }
    })

    useEffect(() => {
        const fetchRelationalObjects = async () => {
            try {
                const response = await api.get('/api/Desafios/GetRelationalObjects')
                const { categorias, tiposEvaluacion } = response.data
                setCategoriasDisponibles(categorias)
                setTiposEvaluacionDisponibles(tiposEvaluacion)
            } catch (error) {

                console.error('Error fetching relational objects:', error)
            }
        }

        fetchRelationalObjects()

        if (modoEdicion) {
            const fetchDesafio = async () => {
                try {
                    const response = await api.get(`/api/Desafios/${id}`)
                    const desafio = response.data
                    console.log(desafio);
                    form.reset({
                        ...desafio,
                        fechaInicio: new Date(desafio.fechaInicio),
                        fechaLimite: new Date(desafio.fechaLimite),
                        procesoEvaluacion: desafio.procesoEvaluacion.map(p => ({
                            ...p,
                            fechaFinalizacion: new Date(p.fechaFinalizacion)
                        })),
                    })
                    console.log(form.getValues('categorias'));
                } catch (error) {
                    console.error('Error fetching desafio:', error)
                }
            }
            fetchDesafio()
        }
    }, [id, modoEdicion, form])

    const onSubmit = async (data) => {
        try {
            const method = modoEdicion ? 'put' : 'post'
            const response = await api[method]('/api/Desafios', data)
            if (response.data.success) {
                toast.success("Operación exitosa", {
                    description: response.data.message,
                });
                navigate(-1)
            } else {
                // Handle validation errors
                if (response.data.errors) {
                    const errors = response.data.errors
                    Object.keys(errors).forEach(key => {
                        form.setError(key, {
                            type: 'manual',
                            message: errors[key]
                        })
                    })
                }
                toast.warning("Operación fallida", {
                    description: response.data.message,
                });
            }
        } catch (error) {
            toast.error("Operación errónea", {
                description: "Ocurrió un error al guardar el desafío",
            });
            console.error('Error saving desafio:', error)
        }
    }

    const agregarProcesoEvaluacion = (tipoId) => {
        const procesoEvaluacion = form.getValues('procesoEvaluacion')
        const nuevoProceso = {
            idProcesoEvaluacion: tipoId, // Temporary ID
            idDesafio: form.getValues('idDesafio'),
            idTipoEvaluacion: tipoId,
            fechaFinalizacion: addDays(form.getValues('fechaLimite') || new Date(), 7),
        }
        form.setValue('procesoEvaluacion', [...procesoEvaluacion, nuevoProceso], { shouldValidate: true })
        setDialogoAbierto(false)
    }

    const eliminarProcesoEvaluacion = (id) => {
        const procesoEvaluacion = form.getValues('procesoEvaluacion')
        form.setValue('procesoEvaluacion', procesoEvaluacion.filter(proceso => proceso.idProcesoEvaluacion !== id), { shouldValidate: true })
    }

    const actualizarFechaProcesoEvaluacion = (id, nuevaFecha) => {
        const procesoEvaluacion = form.getValues('procesoEvaluacion')
        form.setValue('procesoEvaluacion', procesoEvaluacion.map(proceso =>
            proceso.idProcesoEvaluacion === id ? { ...proceso, fechaFinalizacion: nuevaFecha } : proceso
        ))
    }

    const onDragEnd = (result) => {
        if (!result.destination) return
        const procesoEvaluacion = form.getValues('procesoEvaluacion')
        const items = Array.from(procesoEvaluacion)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)
        form.setValue('procesoEvaluacion', items)
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
                        <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
                            <SaveIcon className="mr-1 h-4 w-4" /> Guardar Desafío
                        </Button>
                    </div>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="titulo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Título del Desafío</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Ingrese el título del desafío" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <FormField
                                control={form.control}
                                name="categorias"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Categorías</FormLabel>
                                        <FormControl>
                                            <MultiSelect
                                                options={categoriasDisponibles.map(c => ({ value: c.idCategoria, label: c.nombre }))}
                                                onValueChange={(values) => field.onChange(values.map(v => ({ idCategoria: v })))}
                                                value={field.value.map(c => c.idCategoria)}
                                                placeholder="Seleccione las categorías"
                                                variant="inverted"
                                                maxCount={6}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="fechaInicio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fecha de inicio</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {field.value ? format(field.value, "PPP", { locale: es }) : <span>Seleccione una fecha</span>}
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="fechaLimite"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fecha límite</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {field.value ? format(field.value, "PPP", { locale: es }) : <span>Seleccione una fecha</span>}
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="procesoEvaluacion"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex justify-between items-center mb-2">
                                        <FormLabel>Procesos de Evaluación</FormLabel>
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
                                                    {tiposEvaluacionDisponibles.filter(tipo => !field.value.some(p => p.idTipoEvaluacion === tipo.idTipoEvaluacion))
                                                        .map((tipo) => (
                                                            <Button
                                                                key={tipo.idTipoEvaluacion}
                                                                onClick={() => agregarProcesoEvaluacion(tipo.idTipoEvaluacion)}
                                                                variant="outline"
                                                                className="justify-start"
                                                            >
                                                                {tipo.nombre}
                                                            </Button>
                                                        ))}
                                                    {tiposEvaluacionDisponibles.filter(tipo => !field.value.some(p => p.idTipoEvaluacion === tipo.idTipoEvaluacion)).length === 0 && (
                                                        <p className="text-muted-foreground">No hay más procesos de evaluación disponibles</p>
                                                    )}
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <FormControl>
                                        <div className="space-y-4">
                                            {field.value.length === 0 && (
                                                <p className="text-muted-foreground text-center my-2 text-sm sm:text-base">No hay procesos de evaluación agregados</p>
                                            )}

                                            <DragDropContext onDragEnd={onDragEnd}>
                                                <Droppable droppableId="procesos">
                                                    {(provided) => (
                                                        <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                                            {field.value.map((proceso, index) => (
                                                                <Draggable key={proceso.idProcesoEvaluacion} draggableId={proceso.idProcesoEvaluacion.toString()} index={index}>
                                                                    {(provided) => (
                                                                        <Card ref={provided.innerRef} {...provided.draggableProps} className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 p-3 rounded">
                                                                            <span {...provided.dragHandleProps} className="cursor-move">
                                                                                <GripVertical className="h-5 w-5" />
                                                                            </span>
                                                                            <span className="flex-grow text-sm sm:text-base">
                                                                                {tiposEvaluacionDisponibles.find(t => t.idTipoEvaluacion === proceso.idTipoEvaluacion)?.nombre || 'Proceso sin nombre'}
                                                                            </span>
                                                                            <div className="flex items-center space-x-2 w-full sm:w-auto">
                                                                                <Popover>
                                                                                    <PopoverTrigger asChild>
                                                                                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                                                                            {format(proceso.fechaFinalizacion, "dd/MM/yyyy")}
                                                                                        </Button>
                                                                                    </PopoverTrigger>
                                                                                    <PopoverContent className="w-auto p-0">
                                                                                        <Calendar
                                                                                            mode="single"
                                                                                            selected={proceso.fechaFinalizacion}
                                                                                            onSelect={(date) => actualizarFechaProcesoEvaluacion(proceso.idProcesoEvaluacion, date)}
                                                                                            initialFocus
                                                                                        />
                                                                                    </PopoverContent>
                                                                                </Popover>
                                                                                <Button variant="ghost" size="sm" onClick={() => eliminarProcesoEvaluacion(proceso.idProcesoEvaluacion)}>
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
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="contenido"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contenido del Desafío</FormLabel>
                                    <FormControl>
                                        <div className='mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border'>
                                            <div className="relative flex size-full min-h-[350px] flex-col p-0 items-start">
                                                <div className="size-full grow bg-card">
                                                    <PlateEditor value={field.value} onChange={({ value }) => field.onChange(JSON.stringify(value))} placeholder="Ingrese el contenido del desafío" />
                                                </div>
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </div>
        </div>
    )
}