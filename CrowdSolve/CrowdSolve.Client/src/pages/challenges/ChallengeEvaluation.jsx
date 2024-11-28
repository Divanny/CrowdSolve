import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import useAxios from '@/hooks/use-axios';
import CompanyEvaluation from '@/components/challenge/CompanyEvaluation';
import UserVoting from '@/components/challenge/UserVoting';
import createEditorToConvertToHtml from '@/hooks/createEditorToConvertToHtml'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TiposEvaluacionEnum from '@/enums/TiposEvaluacionEnum';
import EstatusProcesoEnum from '@/enums/EstatusProcesoEnum';
import ChallengeDetail from '@/components/challenge/ChallengeDetail';
import ChallengeHeader from '@/components/challenge/ChallengeHeader';
import { Skeleton } from '@/components/ui/skeleton';

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

    const convertToHtml = () => {
        const html = editor.api.htmlReact.serialize({
            nodes: editor.children,
            convertNewLinesToHtmlBr: true,
            dndWrapper: (props) => <DndProvider backend={HTML5Backend} {...props} />,
        });
        setHtmlContent(html);
    };

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

            for (const solucion of challengeResponse.data.soluciones) {
                try {
                    const responseAvatarURL = await api.get(`/api/Account/GetAvatar/${solucion.idUsuario}`, { responseType: 'blob', requireLoading: false })
                    const avatarBlob = new Blob([responseAvatarURL.data], { type: responseAvatarURL.headers['content-type'] })
                    solucion.avatarUrl = URL.createObjectURL(avatarBlob)
                }
                catch {
                    solucion.avatarUrl = null
                }
            }
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

    const reloadChallengeData = async () => {
        await fetchChallenge();
    };

    useEffect(() => {
        const canEvaluate = async () => {
            try {
                const response = await api.get(`/api/Desafios/PuedoEvaluar/${challengeId}`, { requireLoading: false });
                if (!response.data.success) {
                    toast.warning("Operación fallida", {
                        description: response.data.message,
                    });
                    navigate(-1);
                }
                else {
                    await fetchChallenge();
                }
            } catch (error) {
                toast.error("Operación fallida", {
                    description: error.response?.data?.message ?? error.message,
                });
                navigate(-1);
            }
        }

        canEvaluate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [challengeId]);

    const getCategoryName = (idCategoria) => {
        const category = relationalObjects.categorias.find(cat => cat.idCategoria === idCategoria);
        return category ? category.nombre : 'Desconocida';
    };

    return (
        <div className="container mx-auto py-8">
            <div className="space-y-6">
                {
                    (!challenge || !currentEvaluationProcess || loading) ? (
                        <div className="flex flex-col items-center gap-4">
                            <Skeleton className="h-64 w-full mb-4" />
                            <Skeleton className="h-52 w-full" />
                        </div>
                    ) : (
                        <>
                            <ChallengeHeader
                                challenge={challenge}
                                htmlContent={htmlContent}
                                getCategoryName={getCategoryName}
                                ChallengeDetail={ChallengeDetail}
                            />
                            {currentEvaluationProcess.idTipoEvaluacion === TiposEvaluacionEnum.Evaluacion_Empresa && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-2xl font-bold">Evaluar soluciones</h2>
                                        <span className="text-sm font-medium">
                                            Finaliza: {new Date(currentEvaluationProcess.fechaFinalizacion).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <CompanyEvaluation solutions={challenge.soluciones} reloadChallengeData={reloadChallengeData} />
                                </div>
                            )}
                            {(currentEvaluationProcess.idTipoEvaluacion === TiposEvaluacionEnum.Voto_Comunidad || currentEvaluationProcess.tipo === TiposEvaluacionEnum.Voto_Comunidad) && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-2xl font-bold">Evaluar soluciones</h2>
                                        <span className="text-sm font-medium">
                                            Finaliza: {new Date(currentEvaluationProcess.fechaFinalizacion).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <UserVoting solutions={challenge.soluciones} />
                                </div>
                            )}
                        </>
                    )
                }
            </div>
        </div>
    );
};

export default ChallengeEvaluation;