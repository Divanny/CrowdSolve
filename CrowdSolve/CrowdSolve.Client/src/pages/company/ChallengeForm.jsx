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
import { useTranslation } from 'react-i18next';
const { t } = useTranslation();
const formSchema = z.object({
    
    idDesafio: z.number().optional(),
    idUsuarioEmpresa: z.number().optional(),
    idEmpresa: z.number(),
    empresa: z.string().optional(),
    titulo: z.string().min(1, t('challengeForm.messages.tituloRequerido')),
    contenido: z.string().min(1, t('challengeForm.messages.contenidoRequerido')),
    fechaInicio: z.date({ required_error: t('challengeForm.messages.fechaInicioRequerida') }),
    fechaLimite: z.date({ required_error: t('challengeForm.messages.fechaLimiteRequerida') }),
    categorias: z.array(z.object({
        idDesafioCategoria: z.number().optional(),
        idDesafio: z.number().optional(),
        idCategoria: z.number()
    })).min(1, t('challengeForm.messages.categoriasRequeridas')),
    procesoEvaluacion: z.array(z.object({
        idProcesoEvaluacion: z.number().optional(),
        idDesafio: z.number().optional(),
        idTipoEvaluacion: z.number(),
        fechaFinalizacion: z.date()
    })).min(1, t('challengeForm.messages.procesoEvaluacionRequerido')),
    idEstatusDesafio: z.number().optional(),
    estatusDesafio: z.string().optional()
})

export default function ChallengeForm() {
    const { t } = useTranslation();
    const { api } = useAxios()
    const navigate = useNavigate()
    const { challengeId } = useParams()
    const modoEdicion = challengeId !== undefined

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
        const fetchDesafio = async () => {
            try {
                const response = await api.get(`/api/Desafios/GetMiDesafio/${challengeId}`)
                const desafio = response.data
                form.reset({
                    ...desafio,
                    fechaInicio: new Date(desafio.fechaInicio),
                    fechaLimite: new Date(desafio.fechaLimite),
                    procesoEvaluacion: desafio.procesoEvaluacion.map(p => ({
                        ...p,
                        fechaFinalizacion: new Date(p.fechaFinalizacion)
                    })),
                })
            } catch (error) {
                toast.error(t('challengeForm.messages.operacionFallida'), {
                    description: t('challengeForm.messages.errorCargaDesafio'),
                });
                console.error('Error fetching desafio:', error)
            }
        }

        const fetchRelationalObjects = async () => {
            try {
                const response = await api.get('/api/Desafios/GetRelationalObjects')
                const { categorias, tiposEvaluacion } = response.data
                setCategoriasDisponibles(categorias)
                setTiposEvaluacionDisponibles(tiposEvaluacion)
            } catch (error) {
                toast.error(t('challengeForm.messages.operacionFallida'), {
                    description: t('challengeForm.messages.errorCargaObjetosRelacionales'),
                });
                console.error('Error fetching relational objects:', error)
            }
        }

        const fetchData = async () => {
            try {
                if (modoEdicion) await fetchDesafio()
                await fetchRelationalObjects()
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [challengeId, modoEdicion, form])

    const onSubmit = async (data) => {
        try {
            const method = modoEdicion ? 'put' : 'post'
            const response = await api[method]('/api/Desafios', data)
            if (response.data.success) {
                toast.success(t('challengeForm.messages.operacionExitosa'), {
                    description: response.data.message,
                });
                navigate('/company')
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
                toast.warning(t('challengeForm.messages.operacionFallida'), {
                    description: response.data.message,
                });
            }
        } catch (error) {
            toast.error(t('challengeForm.messages.operacionFallida'), {
                description: t('challengeForm.messages.errorGuardarDesafio'),
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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                    {!modoEdicion && <div>
                        <h1 className="text-2xl font-bold">{t('challengeForm.publicarDesafio.titulo')}</h1>
                        <p className="text-muted-foreground">{t('challengeForm.publicarDesafio.descripcion')}</p>
                    </div>}
                    {modoEdicion && <div>
                        <h1 className="text-2xl font-bold">{t('challengeForm.editarDesafio.titulo')}</h1>
                        <p className="text-muted-foreground">{t('challengeForm.editarDesafio.descripcion')}</p>
                    </div>}
                    <div className='flex items-center gap-4'>
                        <Button variant="outline" className="text-sm" onClick={() => navigate(-1)}>
                            <ArrowLeft className="mr-1 h-4 w-4" /> {t('challengeForm.volver')}
                        </Button>
                        <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
                            <SaveIcon className="mr-1 h-4 w-4" /> {t('challengeForm.guardarDesafio')}
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
                                    <FormLabel>{t('challengeForm.tituloDesafio')}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder={t('challengeForm.placeholderTitulo')} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            <FormField
                                control={form.control}
                                name="categorias"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>{t('challengeForm.categorias')}</FormLabel>
                                        {(modoEdicion && categoriasDisponibles.length > 0) &&
                                            <FormControl>
                                                <MultiSelect
                                                    options={categoriasDisponibles.map(c => ({ value: c.idCategoria, label: c.nombre }))}
                                                    onValueChange={(values) => field.onChange(values.map(v => ({ idCategoria: v })))}
                                                    defaultValue={field.value.map(c => c.idCategoria)}
                                                    placeholder={t('challengeForm.seleccionarCategorias')}
                                                    variant="inverted"
                                                    maxCount={6}
                                                />
                                            </FormControl>
                                        }
                                        {(!modoEdicion && categoriasDisponibles.length > 0) &&
                                            <FormControl>
                                                <MultiSelect
                                                    options={categoriasDisponibles.map(c => ({ value: c.idCategoria, label: c.nombre }))}
                                                    onValueChange={(values) => field.onChange(values.map(v => ({ idCategoria: v })))}
                                                    defaultValue={field.value.map(c => c.idCategoria)}
                                                    placeholder={t('challengeForm.seleccionarCategorias')}
                                                    variant="inverted"
                                                    maxCount={6}
                                                />
                                            </FormControl>
                                        }
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="fechaInicio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('challengeForm.fechaInicio')}</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {field.value ? format(field.value, "PPP", { locale: es }) : <span>{t('challengeForm.seleccionarFecha')}</span>}
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
                                        <FormLabel>{t('challengeForm.fechaLimite')}</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {field.value ? format(field.value, "PPP", { locale: es }) : <span>{t('challengeForm.seleccionarFecha')}</span>}
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
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                                        <FormLabel>{t('challengeForm.procesosEvaluacion')}</FormLabel>
                                        <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline">
                                                    <PlusCircle className="mr-1 h-4 w-4" />
                                                    {t('challengeForm.agregarProcesoEvaluacion')}
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>{t('challengeForm.seleccionarProcesoEvaluacion')}</DialogTitle>
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
                                                        <p className="text-muted-foreground">{t('challengeForm.noMasProcesosDisponibles')}</p>
                                                    )}
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <FormControl>
                                        <div className="space-y-4">
                                            {field.value.length === 0 && (
                                                <p className="text-muted-foreground text-center my-2 text-sm sm:text-base">{t('challengeForm.noProcesosAgregados')}</p>
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
                                                                                {tiposEvaluacionDisponibles.find(t => t.idTipoEvaluacion === proceso.idTipoEvaluacion)?.nombre || t('challengeForm.noNombreProceso')}
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
                                    <FormLabel>{t('challengeForm.contenidoDesafio')}</FormLabel>
                                    <FormControl>
                                        <div className='mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border'>
                                            <div className="relative flex size-full min-h-[350px] flex-col p-0 items-start">
                                                <div className="size-full flex flex-col grow bg-card">
                                                    {modoEdicion && field.value != '' && <PlateEditor value={field.value} onChange={({ value }) => field.onChange(JSON.stringify(value))} placeholder={t('challengeForm.placeholderContenido')} />}
                                                    {!modoEdicion && <PlateEditor onChange={({ value }) => field.onChange(JSON.stringify(value))} placeholder={t('challengeForm.placeholderContenido')} />}
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