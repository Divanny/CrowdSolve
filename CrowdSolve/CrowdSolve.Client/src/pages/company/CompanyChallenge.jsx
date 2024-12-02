import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import useAxios from '@/hooks/use-axios';
import createEditorToConvertToHtml from '@/hooks/createEditorToConvertToHtml'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ChallengeDetail from '@/components/challenge/ChallengeDetail';
import ChallengeHeader from '@/components/challenge/ChallengeHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import EstatusProcesoEnum from '@/enums/EstatusProcesoEnum';
import SolutionsValidation from '@/components/admin/companies/SolutionsValidation';

const editor = createEditorToConvertToHtml();

const CompanyChallenge = () => {
    const { challengeId } = useParams();
    const { api } = useAxios();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [challenge, setChallenge] = useState(null);
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


    useEffect(() => {
        const fetchChallenge = async () => {
            setLoading(true);

            try {
                const [challengeResponse, relationalObjectsResponse] = await Promise.all([
                    api.get(`/api/Desafios/GetMiDesafio/${challengeId}`, { requireLoading: false }),
                    api.get("/api/Desafios/GetRelationalObjects", {
                        requireLoading: false,
                    })
                ])

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

    const getCategoryName = (idCategoria) => {
        const category = relationalObjects.categorias.find(cat => cat.idCategoria === idCategoria);
        return category ? category.nombre : 'Desconocida';
    };

    return (
        <div className="container mx-auto py-8">
            <div className="space-y-6">
                {
                    (!challenge || loading) ? (
                        <div className="flex flex-col items-center gap-4">
                            <Skeleton className="h-64 w-full mb-4" />
                            <Skeleton className="h-52 w-full" />
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-center">
                                <Button onClick={() => navigate(-1)} variant="ghost">
                                    <ArrowLeft className='me-1' size={16} />
                                    Volver
                                </Button>
                                {challenge.idEstatusDesafio === EstatusProcesoEnum.Desafio_Sin_validar && (
                                    <Button onClick={() => navigate(`/company/challenge/${challenge.idDesafio}/edit`)}>
                                        <Edit className='me-1' size={16} />
                                        Editar
                                    </Button>
                                )}
                            </div>
                            <ChallengeHeader
                                challenge={challenge}
                                htmlContent={htmlContent}
                                getCategoryName={getCategoryName}
                                ChallengeDetail={ChallengeDetail}
                            />
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold">Soluciones</h2>
                                </div>
                                <SolutionsValidation solutions={challenge.soluciones} />
                            </div>
                        </>
                    )
                }
            </div>
        </div>
    );
};

export default CompanyChallenge;