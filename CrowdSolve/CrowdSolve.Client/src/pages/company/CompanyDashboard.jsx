import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from "@/components/ui/badge"
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import useAxios from '@/hooks/use-axios';
import { BarChart3, Users, ClipboardCheck, Calendar, AlertCircle, Plus, Eye, Edit, Trash2, Upload, Gift, ImageIcon, FileTextIcon, FileArchiveIcon as FileZipIcon, FileIcon, Download } from 'lucide-react';
import Icon from '@/components/ui/icon';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Textarea } from '@/components/ui/textarea';
import EstatusProcesoEnum from '@/enums/EstatusProcesoEnum'
import { FileUploader } from '@/components/FileUploader';
import PageLoader from '@/components/PageLoader';
import { formatBytes } from "@/lib/utils"
import * as FileSaver from 'file-saver';
import { useTranslation } from 'react-i18next';

const CompanyDashboard = () => {
    const { api } = useAxios();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [data, setData] = useState({
        empresaInfo: {},
        totalDesafios: 0,
        totalParticipaciones: 0,
        totalSolucionesSinEvaluar: 0,
        totalDesafiosSinValidar: 0,
        desafios: [],
    });

    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [challengeToCancel, setChallengeToCancel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingProgressBar, setLoadingProgressBar] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const [prizeDialogOpen, setPrizeDialogOpen] = useState(false);
    const [challengeToPrize, setChallengeToPrize] = useState(null);
    const [prizeEvidences, setPrizeEvidences] = useState([]);

    const fetchChallenges = async () => {
        try {
            const response = await api.get('/api/Empresas/GetDashboardData');
            setData(response.data);
        } catch (error) {
            toast.error(t('companyDashboard.challenges.loadError'), {
                description: error.message,
            });
            navigate(-1);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelClick = (desafio) => {
        setChallengeToCancel(desafio);
        setCancelDialogOpen(true);
    };

    const handlePrizeClick = (desafio) => {
        setChallengeToPrize(desafio);
        setPrizeDialogOpen(true);
    };

    const handleSubmitEvidence = async () => {
        if (!challengeToPrize || !prizeEvidences.length) return;

        const maxFileSize = 5 * 1024 * 1024;
        let totalSize = prizeEvidences.reduce((acc, file) => acc + file.size, 0);
        let uploadedSize = 0;

        setLoadingProgressBar(true);

        try {
            for (const file of prizeEvidences) {
                let currentPart = 1;
                const totalParts = Math.ceil(file.size / maxFileSize);

                while (currentPart <= totalParts) {
                    const start = (currentPart - 1) * maxFileSize;
                    const end = Math.min(start + maxFileSize, file.size);
                    const chunk = file.slice(start, end);

                    const formData = new FormData();
                    formData.append("filePart", chunk);

                    const response = await api.post(`/api/Desafios/CargarEvidencia/${challengeToPrize.idDesafio}`, formData, {
                        requireLoading: false,
                        headers: {
                            "Content-Type": "multipart/form-data",
                            "X-File-Name": encodeURI(file.name),
                            "X-Part-Number": currentPart,
                            "X-Last-Part": currentPart === totalParts ? 1 : 0,
                        }
                    });

                    if (!response.data.success) {
                        toast.error(t('companyDashboard.challenges.uploadEvidenceError'), {
                            description: response.data.message,
                        });
                        return;
                    }

                    uploadedSize += chunk.size;
                    setLoadingProgress(Math.min(80, Math.floor((uploadedSize / totalSize) * 100)));

                    currentPart++;
                }
            }

            toast.success(t('companyDashboard.challenges.uploadEvidenceSuccess'),
                { description: t('companyDashboard.challenges.uploadEvidenceDescription') }
            );

            setPrizeDialogOpen(false);
            fetchChallenges();
            setPrizeEvidences([]);
        }
        catch (error) {
            toast.error(t('companyDashboard.challenges.uploadEvidenceError'), {
                description: error.message,
            });
        }

        setLoadingProgressBar(false);
    };

    const cancelChallenge = async () => {
        if (!challengeToCancel || !cancelReason.trim()) return;

        try {
            const response = await api.put(`/api/Desafios/Descartar/${challengeToCancel.idDesafio}`, null, {
                params: {
                    motivo: cancelReason,
                },
            });

            if (response.data.success) {
                toast.success(t('companyDashboard.challenges.successToast'), {
                    description: t('companyDashboard.challenges.cancelChallengeSuccess'),
                });

                await fetchChallenges();
            } else {
                toast.error(t('companyDashboard.challenges.cancelChallengeError'), {
                    description: response.data.message,
                });
            }
        } catch (error) {
            toast.error(t('companyDashboard.challenges.cancelChallengeError'), {
                description: error.response?.data?.message ?? error.message,
            });
        } finally {
            setCancelDialogOpen(false);
            setCancelReason('');
            setChallengeToCancel(null);
        }
    };

    const handleDeleteEvidence = async (evidencia) => {
        try {
            const response = await api.delete(`/api/Desafios/EliminarEvidencia/${evidencia.idAdjunto}`);
            if (response.data.success) {
                toast.success(t('companyDashboard.challenges.deleteEvidenceSuccess'));
                fetchChallenges();
                setPrizeDialogOpen(false);
            } else {
                toast.error(t('companyDashboard.challenges.deleteEvidenceError'), {
                    description: response.data.message,
                });
            }
        } catch (error) {
            toast.error(t('companyDashboard.challenges.deleteEvidenceError'), {
                description: error.response?.data?.message ?? error.message,
            });
        }
    };

    const downloadEvidence = async (evidencia) => {
        try {
            const response = await api.get(`/api/Desafios/DescargarEvidencia/${evidencia.idAdjunto}`, { responseType: 'blob' });
            FileSaver.saveAs(response.data, evidencia.nombre);
        } catch (error) {
            toast.error(t('companyDashboard.challenges.cancelChallengeError'), {
                description: error.response?.data?.message || t('companyDashboard.challenges.downloadEvidenceError'),
            });
        }
    };

    const IconoArchivo = ({ tipo }) => {
        switch (tipo) {
            case 'image/png':
            case 'image/jpeg':
            case 'image/gif':
            case 'image/webp':
            case 'image/svg+xml':
                return <ImageIcon />
            case 'application/pdf':
                return <FileTextIcon />
            case 'application/zip':
                return <FileZipIcon />
            default:
                return <FileIcon />
        }
    }

    useEffect(() => {
        fetchChallenges();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = data.desafios.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(data.desafios.length / itemsPerPage)

    return (
        <div className="container mx-auto px-4 py-6 space-y-6">
            {loading ? (
                <Card>
                    <CardHeader>
                        <CardTitle>{t('companyDashboard.loading')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={`/api/Account/GetAvatar/${data.empresaInfo.idUsuario}`} alt={data.empresaInfo.nombre} />
                                <AvatarFallback>{data.empresaInfo.nombre.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-2xl">{data.empresaInfo.nombre}</CardTitle>
                                <CardDescription>{data.empresaInfo.descripcion}</CardDescription>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                        <StatCard
                            icon={<BarChart3 className="h-4 w-4 text-blue-500" />}
                            title={t('companyDashboard.totalChallenges')}
                            value={data.totalDesafios}
                        />
                        <StatCard
                            icon={<Users className="h-4 w-4 text-green-500" />}
                            title={t('companyDashboard.totalParticipations')}
                            value={data.totalParticipaciones}
                        />
                        <StatCard
                            icon={<ClipboardCheck className="h-4 w-4 text-yellow-500" />}
                            title={t('companyDashboard.unevaluatedSolutions')}
                            value={data.totalSolucionesSinEvaluar}
                        />
                        <StatCard
                            icon={<AlertCircle className="h-4 w-4 text-red-500" />}
                            title={t('companyDashboard.unvalidatedChallenges')}
                            value={data.totalDesafiosSinValidar}
                        />
                    </div>


                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl font-bold flex items-center text-foreground">
                                    <BarChart3 className="mr-2 h-5 w-5" />
                                    {t('companyDashboard.unvalidatedChallenges')}
                                </CardTitle>
                                <Button onClick={() => navigate('/company/challenge/new')} className="flex items-center">
                                    <Plus className="mr-2 h-4 w-4" />
                                    {t('companyDashboard.newChallenge')}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[35%]">{t('companyDashboard.title')}</TableHead>
                                        <TableHead>{t('companyDashboard.startDate')}</TableHead>
                                        <TableHead>{t('companyDashboard.deadline')}</TableHead>
                                        <TableHead>{t('companyDashboard.status')}</TableHead>
                                        <TableHead>{t('companyDashboard.participations')}</TableHead>
                                        <TableHead>{t('companyDashboard.pending')}</TableHead>
                                        <TableHead className="text-right">{t('companyDashboard.actions')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentItems.map((desafio) => (
                                        <TableRow key={desafio.idDesafio}>
                                            <TableCell className="font-medium">{desafio.titulo}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                                    {new Date(desafio.fechaInicio).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                                    {new Date(desafio.fechaLimite).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={desafio.severidadEstatusDesafio}
                                                >
                                                    <div className="flex items-center space-x-1 w-auto">
                                                        <Icon name={desafio.iconoEstatusDesafio} size={16} />
                                                        <span>{desafio.estatusDesafio}</span>
                                                    </div>
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{desafio.participaciones}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 w-auto">
                                                    {desafio.solucionesPendientes > 0 &&
                                                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                                                    }
                                                    {desafio.solucionesPendientes ?? 0}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end space-x-2">
                                                    {desafio.idEstatusDesafio === EstatusProcesoEnum.Desafio_En_espera_de_entrega_de_premios && (
                                                        <Button variant="ghost" size="sm" tooltip={t('companyDashboard.uploadEvidence')} className="flex items-center" onClick={() => handlePrizeClick(desafio)}>
                                                            <Upload className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {(desafio.idEstatusDesafio === EstatusProcesoEnum.Desafio_En_evaluacion && desafio.puedoEvaluar) && (
                                                        <Button variant="ghostWarning" size="sm" tooltip={t('companyDashboard.evaluateSolutions')} className="flex items-center" onClick={() => navigate(`/challenge/${desafio.idDesafio}/evaluate`)}>
                                                            <ClipboardCheck className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {desafio.idEstatusDesafio === EstatusProcesoEnum.Desafio_Sin_validar && (
                                                        <Button variant="ghostDestructive" size="sm" tooltip={t('companyDashboard.cancelChallenge')} className="flex items-center" onClick={() => handleCancelClick(desafio)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {desafio.idEstatusDesafio === EstatusProcesoEnum.Desafio_Sin_validar && (
                                                        <Button variant="ghost" size="sm" tooltip={t('companyDashboard.editChallenge')} className="flex items-center" onClick={() => navigate(`/company/challenge/${desafio.idDesafio}/edit`)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {desafio.idEstatusDesafio !== EstatusProcesoEnum.Desafio_Sin_validar && (
                                                        <Button variant="ghost" size="sm" tooltip={t('companyDashboard.viewDetails')} className="flex items-center" onClick={() => navigate(`/company/challenge/${desafio.idDesafio}`)}>
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="mt-4 flex justify-center">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                            />
                                        </PaginationItem>
                                        {[...Array(totalPages)].map((_, i) => (
                                            <PaginationItem key={i}>
                                                <PaginationLink
                                                    onClick={() => setCurrentPage(i + 1)}
                                                    isActive={currentPage === i + 1}
                                                >
                                                    {i + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}
                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </CardContent>
                    </Card>
                    <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                {t('companyDashboard.cancelDialog.title')}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                {t('companyDashboard.cancelDialog.description')}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <Textarea
                                placeholder={t('companyDashboard.cancelDialog.placeholder')}
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                            />
                            <AlertDialogFooter>
                                <AlertDialogCancel>{t('companyDashboard.cancelDialog.cancelButton')}</AlertDialogCancel>
                                <AlertDialogAction onClick={cancelChallenge} disabled={!cancelReason.trim()}>
                                {t('companyDashboard.cancelDialog.confirmButton')}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog open={prizeDialogOpen} onOpenChange={setPrizeDialogOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    <div className="flex items-center gap-2">
                                        <Gift className="h-6 w-6 text-primary" />
                                        {t('companyDashboard.prizeDialog.title')}
                                    </div>
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                {t('companyDashboard.prizeDialog.description')}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <FileUploader value={prizeEvidences} onValueChange={setPrizeEvidences} multiple={true} maxFileCount={Infinity} maxSize={1024 * (1024 * 5)} />
                            {challengeToPrize?.evidenciaRecompensa?.length > 0 && (
                                <div className="mt-2">
                                    <Label className="text-sm font-medium text-foreground">{t('companyDashboard.prizeDialog.previousEvidences.label')}</Label>
                                    <p className="text-xs text-muted-foreground">{t('companyDashboard.prizeDialog.previousEvidences.note')}</p>
                                    <div className="grid grid-cols-1 gap-2 mt-4">
                                        {challengeToPrize.evidenciaRecompensa.map((evidencia, index) => (
                                            <div className="relative flex items-center gap-2.5" key={index}>
                                                <div className="flex flex-1 gap-2.5 items-center">
                                                    <IconoArchivo tipo={evidencia.contentType} />
                                                    <div className="flex w-full flex-col gap-2">
                                                        <div className="flex flex-col gap-px">
                                                            <p className="line-clamp-1 text-sm font-medium text-foreground/80">
                                                                {evidencia.nombre}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {formatBytes(evidencia.tamaño)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                type="button"
                                                                variant="outlineDestructive"
                                                                size="icon"
                                                                className="size-7"
                                                                tooltip={t('companyDashboard.prizeDialog.actions.deleteTooltip')}
                                                            >
                                                                <Trash2 className="size-4" aria-hidden="true" />
                                                                <span className="sr-only">{t('companyDashboard.deleteFile')}</span>
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>{t('companyDashboard.prizeDialog.actions.deleteConfirmation.title')}</AlertDialogTitle>
                                                                <AlertDialogDescription>{t('companyDashboard.prizeDialog.actions.deleteConfirmation.description')}</AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>{t('companyDashboard.prizeDialog.actions.deleteConfirmation.cancelButton')}</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeleteEvidence(evidencia)}>{t('companyDashboard.prizeDialog.actions.deleteConfirmation.confirmButton')}</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        className="size-7"
                                                        tooltip={t('companyDashboard.prizeDialog.actions.downloadTooltip')}
                                                        onClick={() => downloadEvidence(evidencia)}
                                                    >
                                                        <Download className="size-4" aria-hidden="true" />
                                                        <span className="sr-only">{t('companyDashboard.downloadFile')}</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <AlertDialogFooter>
                                <AlertDialogCancel>{t('companyDashboard.prizeDialog.cancelButton')}</AlertDialogCancel>
                                <AlertDialogAction disabled={!prizeEvidences.length > 0} onClick={() => handleSubmitEvidence()}>
                                {t('companyDashboard.prizeDialog.submitButton')}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            )}
            {loadingProgressBar && <PageLoader progress={loadingProgress} />}
        </div>
    );
};

const StatCard = ({ icon, title, value }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

export default CompanyDashboard;