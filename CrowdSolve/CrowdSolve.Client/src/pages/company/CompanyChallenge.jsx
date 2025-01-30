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
import { ArrowLeft, Edit, AlertCircle, XCircle, Slash } from 'lucide-react';
import EstatusProcesoEnum from '@/enums/EstatusProcesoEnum';
import SolutionsValidation from '@/components/admin/companies/SolutionsValidation';
import ChallengeTimeline from '@/components/challenge/ChallengeTimeline';
import SolutionRanking from '@/components/challenge/SolutionRanking';
import { useTranslation } from 'react-i18next';

const editor = createEditorToConvertToHtml();

const CompanyChallenge = () => {
    const { t } = useTranslation();
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

            setChallenge(challengeResponse.data)
            setRelationalObjects(relationalObjectsResponse.data)
        } catch (error) {
            toast.error(t('companyChallenge.operationFailed'), {
                description: error.response?.data?.message ?? error.message,
            });
            navigate(-1);
        }

        setLoading(false);
    };

    useEffect(() => {
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
                                    {t('companyChallenge.back')}
                                </Button>
                                {challenge.idEstatusDesafio === EstatusProcesoEnum.Desafio_Sin_validar && (
                                    <Button onClick={() => navigate(`/company/challenge/${challenge.idDesafio}/edit`)}>
                                        <Edit className='me-1' size={16} />
                                        {t('companyChallenge.edit')}
                                    </Button>
                                )}
                            </div>
                            <ChallengeTimeline currentStatus={challenge.idEstatusDesafio} />
                            <ChallengeHeader
                                challenge={challenge}
                                htmlContent={htmlContent}
                                getCategoryName={getCategoryName}
                                ChallengeDetail={ChallengeDetail}
                            />
                            {
                                challenge.idEstatusDesafio === EstatusProcesoEnum.Desafio_Sin_validar ? (
                                    <div className='w-full'>
                                        <div className="flex flex-col items-center gap-2 my-4">
                                            <AlertCircle className="text-warning" size={24} />
                                            <span className="text-lg font-semibold">{t('companyChallenge.unvalidatedChallenge')}</span>
                                            <span className="text-muted-foreground">{t('companyChallenge.unvalidatedChallengeDescription')}</span>
                                        </div>
                                    </div>
                                ) : challenge.idEstatusDesafio === EstatusProcesoEnum.Desafio_Rechazado ? (
                                    <div className='w-full'>
                                        <div className="flex flex-col items-center gap-2 my-4">
                                            <XCircle className="text-destructive" size={24} />
                                            <span className="text-lg font-semibold">{t('companyChallenge.rejectedChallenge')}</span>
                                            <span className="text-muted-foreground">{t('companyChallenge.rejectedChallengeDescription')}</span>
                                        </div>
                                    </div>
                                ) : challenge.idEstatusDesafio === EstatusProcesoEnum.Desafio_Descartado ? (
                                    <div className='w-full'>
                                        <div className="flex flex-col items-center gap-2 my-4">
                                            <Slash className="text-destructive" size={24} />
                                            <span className="text-lg font-semibold">{t('companyChallenge.discardedChallenge')}</span>
                                            <span className="text-muted-foreground">{t('companyChallenge.discardedChallengeDescription')}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-2xl font-bold">{t('companyChallenge.solutions')}</h2>
                                        </div>
                                        {
                                            (challenge.idEstatusDesafio === EstatusProcesoEnum.Desafio_En_evaluacion ||
                                                challenge.idEstatusDesafio === EstatusProcesoEnum.Desafio_Finalizado ||
                                                challenge.idEstatusDesafio === EstatusProcesoEnum.Desafio_En_espera_de_entrega_de_premios) ? (
                                                <SolutionRanking idDesafio={challenge.idDesafio} />
                                            ) : <SolutionsValidation solutions={challenge.soluciones} reloadChallengeData={fetchChallenge} canValidate={challenge.idEstatusDesafio === EstatusProcesoEnum.Desafio_En_progreso} />
                                        }
                                    </div>
                                )
                            }
                        </>
                    )
                }
            </div>
        </div>
    );
};

export default CompanyChallenge;