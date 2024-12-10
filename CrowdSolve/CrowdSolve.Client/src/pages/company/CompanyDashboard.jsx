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

const CompanyDashboard = () => {
    const { api } = useAxios();
    const navigate = useNavigate();

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
            toast.error('Error al cargar los desafíos, intente nuevamente', {
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
        console.log(desafio);
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
                        toast.error('Error al cargar las evidencias', {
                            description: response.data.message,
                        });
                        return;
                    }

                    uploadedSize += chunk.size;
                    setLoadingProgress(Math.min(80, Math.floor((uploadedSize / totalSize) * 100)));

                    currentPart++;
                }
            }

            toast.success('Evidencias cargadas exitosamente',
                { description: 'Las evidencias de entrega del premio han sido cargadas exitosamente' }
            );

            setPrizeDialogOpen(false);
            fetchChallenges();
            setPrizeEvidences([]);
        }
        catch (error) {
            toast.error('Error al cargar las evidencias', {
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
                toast.success("Operación exitosa", {
                    description: "El desafío ha sido cancelado exitosamente",
                });

                await fetchChallenges();
            } else {
                toast.error("Operación fallida", {
                    description: response.data.message,
                });
            }
        } catch (error) {
            toast.error("Operación fallida", {
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
                toast.success("Evidencia eliminada exitosamente");
                fetchChallenges();
                setPrizeDialogOpen(false);
            } else {
                toast.error("Error al eliminar la evidencia", {
                    description: response.data.message,
                });
            }
        } catch (error) {
            toast.error("Error al eliminar la evidencia", {
                description: error.response?.data?.message ?? error.message,
            });
        }
    };

    const downloadEvidence = async (evidencia) => {
        try {
            const response = await api.get(`/api/Desafios/DescargarEvidencia/${evidencia.idAdjunto}`, { responseType: 'blob' });
            FileSaver.saveAs(response.data, evidencia.nombre);
        } catch (error) {
            toast.error('Operación fallida', {
                description: error.response?.data?.message || 'Ocurrió un error al descargar el archivo',
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
                        <CardTitle>Cargando información del dashboard...</CardTitle>
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
                            title="Total desafíos"
                            value={data.totalDesafios}
                        />
                        <StatCard
                            icon={<Users className="h-4 w-4 text-green-500" />}
                            title="Total participaciones"
                            value={data.totalParticipaciones}
                        />
                        <StatCard
                            icon={<ClipboardCheck className="h-4 w-4 text-yellow-500" />}
                            title="Soluciones sin evaluar"
                            value={data.totalSolucionesSinEvaluar}
                        />
                        <StatCard
                            icon={<AlertCircle className="h-4 w-4 text-red-500" />}
                            title="Desafíos sin validar"
                            value={data.totalDesafiosSinValidar}
                        />
                    </div>


                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl font-bold flex items-center text-foreground">
                                    <BarChart3 className="mr-2 h-5 w-5" />
                                    Desafíos
                                </CardTitle>
                                <Button onClick={() => navigate('/company/challenge/new')} className="flex items-center">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nuevo desafío
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[35%]">Título</TableHead>
                                        <TableHead>Fecha Inicio</TableHead>
                                        <TableHead>Fecha Límite</TableHead>
                                        <TableHead>Estatus</TableHead>
                                        <TableHead>Participaciones</TableHead>
                                        <TableHead>Pendientes</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
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
                                                        <Button variant="ghost" size="sm" tooltip="Cargar evidencias de entrega" className="flex items-center" onClick={() => handlePrizeClick(desafio)}>
                                                            <Upload className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {(desafio.idEstatusDesafio === EstatusProcesoEnum.Desafio_En_evaluacion && desafio.puedoEvaluar) && (
                                                        <Button variant="ghostWarning" size="sm" tooltip="Evaluar soluciones" className="flex items-center" onClick={() => navigate(`/challenge/${desafio.idDesafio}/evaluate`)}>
                                                            <ClipboardCheck className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {desafio.idEstatusDesafio === EstatusProcesoEnum.Desafio_Sin_validar && (
                                                        <Button variant="ghostDestructive" size="sm" tooltip="Cancelar desafío" className="flex items-center" onClick={() => handleCancelClick(desafio)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {desafio.idEstatusDesafio === EstatusProcesoEnum.Desafio_Sin_validar && (
                                                        <Button variant="ghost" size="sm" tooltip="Editar desafío" className="flex items-center" onClick={() => navigate(`/company/challenge/${desafio.idDesafio}/edit`)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {desafio.idEstatusDesafio !== EstatusProcesoEnum.Desafio_Sin_validar && (
                                                        <Button variant="ghost" size="sm" tooltip="Ver detalles" className="flex items-center" onClick={() => navigate(`/company/challenge/${desafio.idDesafio}`)}>
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
                                    ¿Estás seguro de que quieres cancelar este desafío?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Por favor, proporciona un motivo para la cancelación.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <Textarea
                                placeholder="Motivo de cancelación"
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                            />
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={cancelChallenge} disabled={!cancelReason.trim()}>
                                    Confirmar
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
                                        Cargar evidencias de entrega del premio
                                    </div>
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Por favor, sube las evidencias de la entrega del premio.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <FileUploader value={prizeEvidences} onValueChange={setPrizeEvidences} multiple={true} maxFileCount={Infinity} maxSize={1024 * (1024 * 5)} />
                            {challengeToPrize?.evidenciaRecompensa?.length > 0 && (
                                <div className="mt-2">
                                    <Label className="text-sm font-medium text-foreground">Evidencias previas</Label>
                                    <p className="text-xs text-muted-foreground">Estas evidencias están pendientes de validación por un administrador.</p>
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
                                                                tooltip="Eliminar"
                                                            >
                                                                <Trash2 className="size-4" aria-hidden="true" />
                                                                <span className="sr-only">Eliminar archivo</span>
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>¿Estás seguro de que quieres eliminar esta evidencia?</AlertDialogTitle>
                                                                <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeleteEvidence(evidencia)}>Confirmar</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        className="size-7"
                                                        tooltip="Descargar"
                                                        onClick={() => downloadEvidence(evidencia)}
                                                    >
                                                        <Download className="size-4" aria-hidden="true" />
                                                        <span className="sr-only">Descargar archivo</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction disabled={!prizeEvidences.length > 0} onClick={() => handleSubmitEvidence()}>
                                    Confirmar
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