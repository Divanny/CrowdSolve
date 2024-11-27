import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import useAxios from '@/hooks/use-axios';
import CompanyEvaluation from '@/components/challenge/CompanyEvaluation';
import UserVoting from '@/components/challenge/UserVoting';
import { Badge } from '@/components/ui/badge';
import createEditorToConvertToHtml from '@/hooks/createEditorToConvertToHtml'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSelector } from 'react-redux';
import TiposEvaluacionEnum from '@/enums/TiposEvaluacionEnum';
import EstatusProcesoEnum from '@/enums/EstatusProcesoEnum';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import ChallengeDetail from '@/components/challenge/ChallengeDetail';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format } from 'date-fns'
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";

const editor = createEditorToConvertToHtml();

const ChallengeEvaluation = () => {
    const { challengeId } = useParams();
    const { api } = useAxios();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [challenge, setChallenge] = useState(null);
    const [currentEvaluationProcess, setCurrentEvaluationProcess] = useState(null);
    const [htmlContent, setHtmlContent] = useState('');
    const [relationalObjects, setRelationalObjects] = useState({})
    const user = useSelector((state) => state.user.user);

    const convertToHtml = () => {
        const html = editor.api.htmlReact.serialize({
            nodes: editor.children,
            convertNewLinesToHtmlBr: true,
            dndWrapper: (props) => <DndProvider backend={HTML5Backend} {...props} />,
        });
        setHtmlContent(html);
    };

    useEffect(() => {
        const fetchChallenge = async () => {
            setLoading(true);

            try {
                const [challengeResponse, relationalObjectsResponse] = await Promise.all([
                    api.get(`/api/Desafios/${challengeId}`, { requireLoading: false }),
                    api.get("/api/Desafios/GetRelationalObjects", {
                        requireLoading: false,
                    })
                ])

                if (challengeResponse.data.idEstatusDesafio !== EstatusProcesoEnum.Desafio_En_evaluacion) {
                    console.log("dsd", challengeResponse.data.idEstatusDesafio)
                    toast.warning("Operación fallida", {
                        description: "El desafío no se encuentra en proceso de evaluación.",
                    });

                    navigate(-1);
                }

                const actualProcesoEvaluacion = challengeResponse.data.procesoEvaluacion
                    .filter((pe) => new Date(pe.fechaFinalizacion) > new Date())
                    .sort((a, b) => new Date(a.fechaFinalizacion) - new Date(b.fechaFinalizacion))[0];

                if (!actualProcesoEvaluacion) {
                    toast.warning("Operación fallida", {
                        description: "No hay un proceso de evaluación actual.",
                    });
                    navigate(-1);
                }

                const slateContent = JSON.parse(challengeResponse.data.contenido)

                editor.tf.setValue(slateContent)
                convertToHtml();

                const responseAvatarURL = await api.get(`/api/Account/GetAvatar/${challengeResponse.data.idUsuarioEmpresa}`, { responseType: 'blob', requireLoading: false })
                const avatarBlob = new Blob([responseAvatarURL.data], { type: responseAvatarURL.headers['content-type'] })
                const url = URL.createObjectURL(avatarBlob)

                setChallenge({ ...challengeResponse.data, logoEmpresa: url })
                setRelationalObjects(relationalObjectsResponse.data)
                setCurrentEvaluationProcess(actualProcesoEvaluacion);

            } catch (error) {
                toast.error("Operación fallida", {
                    description: error.response?.data?.message ?? error.message,
                });
                navigate(-1);
            }

            setLoading(false);
        };

        fetchChallenge();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [challengeId]);

    if (!challenge || !currentEvaluationProcess || loading) {
        return null;
    }

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
        const endDate = new Date(challenge.fechaLimite);
        const diffTime = endDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    }

    return (
        <div className="container mx-auto py-8">
            <div className="space-y-6">
                <Card className="w-full">
                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <img
                            src={challenge.logoEmpresa}
                            alt={`Logo de ${challenge.empresa}`}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                            <CardTitle className="sm:text-lg lg:text-xl font-bold text-foreground mb-1">
                                <div className="flex flex-wrap gap-2">
                                    {challenge.titulo}
                                    <div className="flex items-center gap-2">
                                        {challenge.categorias.map((categoria) => (
                                            <Badge key={categoria.idDesafioCategoria} variant="outline" >
                                                {getCategoryName(categoria.idCategoria)}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardTitle>
                            <p className="text-sm sm:text-base text-primary">{challenge.empresa}</p>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Mostrar detalles o información básica del desafío */}

                        <p className="text-sm text-muted-foreground">
                            Fecha de inicio: {new Date(challenge.fechaInicio).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Fecha límite: {new Date(challenge.fechaLimite).toLocaleDateString()}
                        </p>

                        {/* ----------- */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline">Ver contenido del desafío</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                                <div className="mt-4">
                                    <ChallengeDetail
                                        desafio={challenge}
                                        htmlContent={htmlContent}
                                        getCategoryName={getCategoryName}
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
                {currentEvaluationProcess.idTipoEvaluacion === TiposEvaluacionEnum.Evaluacion_Empresa && <CompanyEvaluation solutions={challenge.soluciones} challengeId={challengeId}/>}
                {(currentEvaluationProcess.idTipoEvaluacion === TiposEvaluacionEnum.Voto_Comunidad || currentEvaluationProcess.tipo === currentEvaluationProcess.idTipoEvaluacion === TiposEvaluacionEnum.Voto_Comunidad) && <UserVoting solutions={challenge.soluciones} />}
            </div>
        </div>
    );
};

export default ChallengeEvaluation;