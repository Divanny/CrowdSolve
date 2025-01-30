"use client"

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from "react-router-dom"
import useAxios from '@/hooks/use-axios'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar, Users, Clock, ArrowLeft, Send, AlertTriangle } from 'lucide-react'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ChallengeDetail from '@/components/challenge/ChallengeDetail';
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { FileUploader } from '@/components/FileUploader'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import createEditorToConvertToHtml from '@/hooks/createEditorToConvertToHtml'
import { useSelector } from 'react-redux'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import EstatusProcesoEnum from '@/enums/EstatusProcesoEnum';
import PageLoader from '@/components/PageLoader';
import { useTranslation } from 'react-i18next';

const editor = createEditorToConvertToHtml();

const Challenge = () => {
    const { t } = useTranslation();
    const { challengeId } = useParams()
    const { api } = useAxios()
    const navigate = useNavigate()
    const [canEvaluate, setCanEvaluate] = useState(false)
    const [loadingSkeleton, setLoadingSkeleton] = useState(true)
    const [desafio, setDesafio] = useState(null)
    const [htmlContent, setHtmlContent] = useState('')
    const [relationalObjects, setRelationalObjects] = useState({})
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [solutionTitle, setSolutionTitle] = useState('')
    const [solutionDescription, setSolutionDescription] = useState('')
    const [solutionFiles, setSolutionFiles] = useState([])
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const user = useSelector((state) => state.user.user);
    const [loading, setLoading] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);

    const isCompany = user?.informacionEmpresa != null;
    const isChallengeOwner = user?.idUsuario === desafio?.idUsuarioEmpresa;
    const isChallengeInProgress = desafio?.idEstatusDesafio === EstatusProcesoEnum.Desafio_En_progreso;

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

                setDesafio(desafioResponse.data)
                setRelationalObjects(relationalObjectsResponse.data)
            } catch (error) {
                toast.error(t('challenge.errorMessages.challengeLoadError'))
                console.error(error)
            }
            setLoadingSkeleton(false)
        }

        const canEvaluate = async () => {
            try {
                const response = await api.get(`/api/Desafios/PuedoEvaluar/${challengeId}`, { requireLoading: false });
                setCanEvaluate(response.data.success);
            } catch (error) {
                console.error(error);
            }
        }

        getChallenge()
        canEvaluate()

        // eslint-disable-next-line
    }, [challengeId])

    const convertToHtml = () => {
        const html = editor.api.htmlReact.serialize({
            nodes: editor.children,
            convertNewLinesToHtmlBr: true,
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

    const handleSubmitSolution = async (e) => {
        e.preventDefault();
        const maxFileSize = 5 * 1024 * 1024;
        let fileGuids = [];
        let totalSize = solutionFiles.reduce((acc, file) => acc + file.size, 0);
        let uploadedSize = 0;

        setLoading(true);

        try {
            for (const file of solutionFiles) {
                let currentPart = 1;
                const totalParts = Math.ceil(file.size / maxFileSize);
                let guid = null;

                while (currentPart <= totalParts) {
                    const start = (currentPart - 1) * maxFileSize;
                    const end = Math.min(start + maxFileSize, file.size);
                    const chunk = file.slice(start, end);

                    const formData = new FormData();
                    formData.append("filePart", chunk);

                    const response = await api.post(`/api/Soluciones/SubirArchivos/${guid || ''}`, formData, {
                        requireLoading: false,
                        headers: {
                            "Content-Type": "multipart/form-data",
                            "X-File-Name": encodeURI(file.name),
                            "X-Part-Number": currentPart,
                            "X-Last-Part": currentPart === totalParts ? 1 : 0,
                        }
                    });

                    if (response.data.success) {
                        if (response.data.data && currentPart === totalParts) {
                            guid = response.data.data.guid;
                            fileGuids.push(guid);
                        }
                    } else {
                        toast.warning(t('challenge.messages.uploadError'), { description: response.data.message });
                        return;
                    }

                    uploadedSize += chunk.size;
                    setLoadingProgress(Math.min(80, Math.floor((uploadedSize / totalSize) * 100)));

                    currentPart++;
                }
            }

            const solutionData = {
                Titulo: solutionTitle,
                Descripcion: solutionDescription,
                idDesafio: desafio.idDesafio,
                FileGuids: fileGuids
            };

            const response = await api.post("/api/Soluciones", solutionData, { requireLoading: false });

            if (response.data.success) {
                setLoadingProgress(100);
                toast.success(t('challenge.messages.solutionSubmissionSuccess'), { description: t('challenge.messages.solutionSubmitted') });
                setIsDrawerOpen(false);
                setSolutionTitle('');
                setSolutionDescription('');
                setSolutionFiles([]);
                setDesafio({ ...desafio, yaParticipo: true });
            } else {
                toast.warning(t('challenge.messages.solutionSendingError'), { description: response.data.message });
            }
        } catch (error) {
            toast.error(t('challenge.messages.solutionSendingError'), { description: error.message });
        }

        setLoading(false);
    };

    if (loadingSkeleton) {
        return <LoadingSkeleton />
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="container mx-auto px-4 md:px-6 py-8 relative">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="mb-4 text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> {t('challenge.buttons.goBack')}
                </Button>
                {!desafio || !htmlContent ? (
                    <div className='w-full flex flex-col items-center justify-center gap-4 p-8'>
                        <h1 className="text-2xl font-semibold text-center">{t('challenge.alerts.challengeNotFound')}</h1>
                        <p className="text-muted-foreground text-center">{t('challenge.alerts.challengePermissionError')}</p>
                    </div>
                ) : (
                    <div>
                        {canEvaluate && (
                            <Alert className="bg-primary/20 border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                                <div className="flex items-start gap-4">
                                    <AlertTriangle className="h-5 w-5 text-primary mt-1" />
                                    <div>
                                        <AlertTitle className="font-semibold">
                                        {t('challenge.alerts.challengeInEvaluation')}
                                        </AlertTitle>
                                        <AlertDescription className="mt-2">
                                        {t('challenge.alerts.participateInEvaluationAlert')}
                                        </AlertDescription>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => navigate(`/challenge/${challengeId}/evaluate`)}
                                >
                                    {t('challenge.buttons.participateInEvaluation')}
                                </Button>
                            </Alert>
                        )}
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className='flex-1 order-2 lg:order-1'>
                                <Card className="bg-card text-card-foreground p-6 mb-6">
                                    <ChallengeDetail desafio={desafio} htmlContent={htmlContent} getCategoryName={getCategoryName} />
                                </Card>
                            </div>
                            <div className='w-full lg:w-1/3 order-1 lg:order-2'>
                                <Card className="bg-card text-card-foreground p-6 sticky top-8">
                                    <h2 className="text-xl font-semibold mb-4 text-foreground">{t('challenge.info.challengeInfo')}</h2>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <Badge variant="primary" className="bg-primary/10 text-primary hover:bg-primary/20">
                                                {getStatusName(desafio.idEstatusDesafio)}
                                            </Badge>
                                            <span className="text-sm font-medium text-foreground">{getDaysRemaining()} {t('challenge.info.daysRemaining')}</span>
                                        </div>
                                        <div className="bg-background rounded-lg p-4 space-y-3">
                                            <div className="flex items-center text-muted-foreground">
                                                <Calendar className="mr-2 h-5 w-5 text-primary" />
                                                <span className="text-sm"><span className='font-semibold'>{t('challenge.labels.startDate')}</span> {formatDate(desafio.fechaInicio)}</span>
                                            </div>
                                            <div className="flex items-center text-muted-foreground">
                                                <Calendar className="mr-2 h-5 w-5 text-primary" />
                                                <span className="text-sm"><span className='font-semibold'>{t('challenge.labels.endDate')}</span> {formatDate(desafio.fechaLimite)}</span>
                                            </div>
                                            <div className="flex items-center text-muted-foreground">
                                                <Users className="mr-2 h-5 w-5 text-primary" />
                                                <span className="text-sm">{desafio.soluciones ? desafio.soluciones.length : 0} {t('challenge.labels.solutionsSent')}</span>
                                            </div>
                                            <div className="flex items-center text-muted-foreground">
                                                <Clock className="mr-2 h-5 w-5 text-primary" />
                                                <span className="text-sm"><span className='font-semibold'>{t('challenge.labels.registeredDate')}</span> {formatDate(desafio.fechaRegistro)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {isCompany ? (
                                        isChallengeOwner && (
                                            <Button className="w-full mt-6" variant="outline" onClick={() => navigate(`/company/challenge/${challengeId}`)}>
                                                <Users className="mr-2 h-4 w-4" /> {t('challenge.buttons1.viewSolutions')}
                                            </Button>
                                        )
                                    ) : !user ? (
                                        <Button className="w-full mt-6" variant="outline" onClick={() => navigate('/sign-in')}>
                                            {t('challenge.buttons1.signInToParticipate')}
                                        </Button>
                                    ) : (
                                        desafio.yaParticipo ? (
                                            <Button className="w-full mt-6" variant="outline" onClick={() => navigate('/my-solutions')}>
                                                <Users className="mr-2 h-4 w-4" /> {t('challenge.buttons1.viewMySolutionStatus')}
                                            </Button>
                                        ) : (
                                            isChallengeInProgress ? (
                                                isDesktop ? (
                                                    <Dialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                                                        <DialogTrigger asChild>
                                                            <Button className="w-full mt-6">
                                                                <Send className="mr-2 h-4 w-4" /> {t('challenge.buttons1.participateInChallenge')}
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-[625px]">
                                                            <DialogHeader>
                                                                <DialogTitle>{t('challenge.buttons1.participateInChallenge')}</DialogTitle>
                                                                <DialogDescription>{t('challenge.dialogs.participateInChallenge.description')}</DialogDescription>
                                                            </DialogHeader>
                                                            <SolutionForm
                                                                solutionTitle={solutionTitle}
                                                                setSolutionTitle={setSolutionTitle}
                                                                solutionDescription={solutionDescription}
                                                                setSolutionDescription={setSolutionDescription}
                                                                solutionFiles={solutionFiles}
                                                                setSolutionFiles={setSolutionFiles}
                                                                handleSubmitSolution={handleSubmitSolution}
                                                                t={t}
                                                            />
                                                        </DialogContent>
                                                    </Dialog>
                                                ) : (
                                                    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                                                        <DrawerTrigger asChild>
                                                            <Button className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
                                                                <Send className="mr-2 h-4 w-4" /> {t('challenge.dialogs.participateInChallenge.title')}
                                                            </Button>
                                                        </DrawerTrigger>
                                                        <DrawerContent>
                                                            <DrawerHeader className="text-left">
                                                                <DrawerTitle>{t('challenge.dialogs.participateInChallenge.title')}</DrawerTitle>
                                                                <DrawerDescription>{t('challenge.dialogs.participateInChallenge.description')}</DrawerDescription>
                                                            </DrawerHeader>
                                                            <SolutionForm
                                                                className="px-4"
                                                                solutionTitle={solutionTitle}
                                                                setSolutionTitle={setSolutionTitle}
                                                                solutionDescription={solutionDescription}
                                                                setSolutionDescription={setSolutionDescription}
                                                                solutionFiles={solutionFiles}
                                                                setSolutionFiles={setSolutionFiles}
                                                                handleSubmitSolution={handleSubmitSolution}
                                                            t={t}
                                                            />
                                                            <DrawerFooter className="pt-2">
                                                                <DrawerClose asChild>
                                                                    <Button variant="outline">{t('challenge.buttons1.cancel')}</Button>
                                                                </DrawerClose>
                                                            </DrawerFooter>
                                                        </DrawerContent>
                                                    </Drawer>
                                                )
                                            ) : (
                                                <div className="text-center text-muted-foreground mt-6">
                                                    {t('challenge.alerts1.challengeNotInProgress')}
                                                </div>
                                            )
                                        )
                                    )}
                                </Card>
                            </div>
                            {loading && <PageLoader progress={loadingProgress} />}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

const SolutionForm = ({ className, solutionTitle, setSolutionTitle, solutionDescription, setSolutionDescription, solutionFiles, setSolutionFiles, handleSubmitSolution, t }) => (
    <form className={`grid items-start gap-4 ${className}`} onSubmit={handleSubmitSolution}>
        <div className="grid gap-2">
            <Label htmlFor="solutionTitle">{t('challenge.form.solutionTitle.label')}</Label>
            <Input id="solutionTitle" value={solutionTitle} onChange={(e) => setSolutionTitle(e.target.value)} />
        </div>
        <div className="grid gap-2">
            <Label htmlFor="solutionDescription">{t('challenge.form.solutionDescription.label')}</Label>
            <Textarea id="solutionDescription" value={solutionDescription} onChange={(e) => setSolutionDescription(e.target.value)} />
        </div>
        <div className="grid gap-2">
            <Label>{t('challenge.form.files.label')}</Label>
            <FileUploader value={solutionFiles} onValueChange={setSolutionFiles} multiple={true} maxFileCount={Infinity} maxSize={1024 * 1024 * 1024} />
        </div>
        <div className="grid gap-2">
            <p className="text-xs text-muted-foreground">
            {t('challenge.form.termsAndConditions.text')}
            </p>
        </div>
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Send className="h-4 w-4" />
            {t('challenge.buttons1.submitSolution')}
        </Button>
    </form>
)

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