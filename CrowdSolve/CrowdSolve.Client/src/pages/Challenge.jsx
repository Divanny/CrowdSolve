"use client"

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from "react-router-dom"
import useAxios from '@/hooks/use-axios'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar, Users, Clock, ArrowLeft } from 'lucide-react'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import createEditorToConvertToHtml from '@/hooks/createEditorToConvertToHtml'

const editor = createEditorToConvertToHtml();

const Challenge = () => {
    const { challengeId } = useParams()
    const { api } = useAxios()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [desafio, setDesafio] = useState(null)
    const [htmlContent, setHtmlContent] = useState('')
    const [relationalObjects, setRelationalObjects] = useState({})

    useEffect(() => {
        const getChallenge = async () => {
            try {
                const [desafioResponse, relationalObjectsResponse] = await Promise.all([
                    api.get(`/api/Desafios/${challengeId}`, { requireLoading: false }),
                    api.get("/api/Desafios/GetRelationalObjects", {
                        requireLoading: false,
                    })
                ])
                const slateContent = JSON.parse(desafioResponse.data.contenido)

                editor.tf.setValue(slateContent)
                convertToHtml();

                const responseAvatarURL = await api.get(`/api/Account/GetAvatar/${desafioResponse.data.idUsuarioEmpresa}`, { responseType: 'blob', requireLoading: false })
                const avatarBlob = new Blob([responseAvatarURL.data], { type: responseAvatarURL.headers['content-type'] })
                const url = URL.createObjectURL(avatarBlob)

                setDesafio({ ...desafioResponse.data, logoEmpresa: url })
                setRelationalObjects(relationalObjectsResponse.data)
            } catch (error) {
                console.error(error)
            }
            setLoading(false)
        }

        getChallenge()

        // eslint-disable-next-line
    }, [challengeId])

    const convertToHtml = () => {
        const html = editor.api.htmlReact.serialize({
            nodes: editor.children,
            convertNewLinesToHtmlBr: true,
            // if you use @udecode/plate-dnd
            dndWrapper: (props) => <DndProvider backend={HTML5Backend} {...props} />,
        });
        setHtmlContent(html);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
    }

    const getCategoryName = (idCategoria) => {
        const category = relationalObjects.categorias.find(cat => cat.idCategoria === idCategoria);
        return category ? category.nombre : 'Desconocida';
    };

    const getStatusName = (idEstatusDesafio) => {
        const status = relationalObjects.estatusDesafios.find(stat => stat.idEstatusProceso === idEstatusDesafio);
        return status ? status.nombre : 'Desconocido';
    };

    const getDaysRemaining = () => {
        const today = new Date();
        const endDate = new Date(desafio.fechaLimite);
        const diffTime = endDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    }

    if (loading) {
        return <LoadingSkeleton />
    }

    if (!desafio) {
        return <div className="text-center text-primary">No se pudo cargar el desafío.</div>
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="container mx-auto px-4 md:px-6 py-8 relative">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="mb-4 text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Volver
                </Button>
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className='flex-1 order-2 lg:order-1'>
                        <Card className="bg-card text-card-foreground p-6 mb-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                                <img
                                    src={desafio.logoEmpresa}
                                    alt={`Logo de ${desafio.empresa}`}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                                <div>
                                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1">
                                        {desafio.titulo}
                                    </h1>
                                    <p className="text-base sm:text-lg text-primary">{desafio.empresa}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {desafio.categorias.map((categoria) => (
                                    <Badge key={categoria.idDesafioCategoria} variant="outline" className="bg-secondary/10">
                                        {getCategoryName(categoria.idCategoria)}
                                    </Badge>
                                ))}
                            </div>
                            <div className="prose prose-invert max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: htmlContent }} className='text-foreground' />
                            </div>
                        </Card>
                    </div>
                    <div className='w-full lg:w-1/3 order-1 lg:order-2'>
                        <Card className="bg-card text-card-foreground p-6 sticky top-8">
                            <h2 className="text-xl font-semibold mb-4 text-foreground">Información del Desafío</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Badge variant="primary" className="bg-primary/10 text-primary hover:bg-primary/20">
                                        {getStatusName(desafio.idEstatusDesafio)}
                                    </Badge>
                                    <span className="text-sm font-medium text-foreground">{getDaysRemaining()} días restantes</span>
                                </div>
                                <div className="bg-background rounded-lg p-4 space-y-3">
                                    <div className="flex items-center text-muted-foreground">
                                        <Calendar className="mr-2 h-5 w-5 text-primary" />
                                        <span className="text-sm"><span className='font-semibold'>Inicio:</span> {formatDate(desafio.fechaInicio)}</span>
                                    </div>
                                    <div className="flex items-center text-muted-foreground">
                                        <Calendar className="mr-2 h-5 w-5 text-primary" />
                                        <span className="text-sm"><span className='font-semibold'>Cierre:</span> {formatDate(desafio.fechaLimite)}</span>
                                    </div>
                                    <div className="flex items-center text-muted-foreground">
                                        <Users className="mr-2 h-5 w-5 text-primary" />
                                        <span className="text-sm">{desafio.soluciones ? desafio.soluciones.length : 0} soluciones enviadas</span>
                                    </div>
                                    <div className="flex items-center text-muted-foreground">
                                        <Clock className="mr-2 h-5 w-5 text-primary" />
                                        <span className="text-sm"><span className='font-semibold'>Registrado:</span> {formatDate(desafio.fechaRegistro)}</span>
                                    </div>
                                </div>
                            </div>
                            <Button className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
                                Participar en el Desafío
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

const LoadingSkeleton = () => (
    <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
            <div className='flex-1'>
                <Skeleton className="h-24 w-full mb-4" />
                <Skeleton className="h-64 w-full" />
            </div>
            <div className='w-full lg:w-1/3'>
                <Skeleton className="h-96 w-full" />
            </div>
        </div>
    </div>
)

export default Challenge