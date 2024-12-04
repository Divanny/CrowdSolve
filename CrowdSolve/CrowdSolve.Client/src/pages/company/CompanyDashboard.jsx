import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from "@/components/ui/badge"
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import useAxios from '@/hooks/use-axios';
import { BarChart3, Users, ClipboardCheck, Calendar, AlertCircle, Plus, Eye, Edit, Trash2 } from 'lucide-react';
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
} from "@/components/ui/alert-dialog"
import { Textarea } from '@/components/ui/textarea';
import EstatusProcesoEnum from '@/enums/EstatusProcesoEnum'

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
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    const fetchChallenges = async () => {
        try {
            const response = await api.get('/api/Empresas/GetDashboardData');

            const { empresaInfo } = response.data;
            const responseAvatarURL = await api.get(`/api/Account/GetAvatar/${empresaInfo.idUsuario}`, { responseType: 'blob', requireLoading: false });
            const avatarBlob = new Blob([responseAvatarURL.data], { type: responseAvatarURL.headers['content-type'] });
            const url = URL.createObjectURL(avatarBlob);
            setData({ ...response.data, empresaInfo: { ...empresaInfo, avatarURL: url } });
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
                                <AvatarImage src={data.empresaInfo.avatarURL} alt={data.empresaInfo.nombre} />
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
                                    Desafíos Activos
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
                                                    {desafio.idEstatusDesafio === EstatusProcesoEnum.Desafio_Sin_validar && (
                                                        <Button variant="ghost" size="sm" severity="destructive" className="flex items-center" onClick={() => handleCancelClick(desafio)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {desafio.idEstatusDesafio === EstatusProcesoEnum.Desafio_Sin_validar && (
                                                        <Button variant="ghost" size="sm" className="flex items-center" onClick={() => navigate(`/company/challenge/${desafio.idDesafio}/edit`)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {desafio.idEstatusDesafio !== EstatusProcesoEnum.Desafio_Sin_validar && (
                                                        <Button variant="ghost" size="sm" className="flex items-center" onClick={() => navigate(`/company/challenge/${desafio.idDesafio}`)}>
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
                </>
            )}
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