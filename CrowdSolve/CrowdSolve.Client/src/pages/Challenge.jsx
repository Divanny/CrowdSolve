import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import useAxios from '@/hooks/use-axios'
import { Card } from '@/components/ui/card';

const Challenge = () => {
    const { challengeId } = useParams();
    const { api } = useAxios();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [desafio, setDesafio] = useState(null);
    const [htmlContent, setHtmlContent] = useState('');

    useEffect(() => {
        const getChallenge = async () => {
            try {
                const response = await api.get(`/api/Desafios/${challengeId}`);

                const slateContent = JSON.parse(response.data.contenido);
                const htmlContent = slateContent.map((block) => block.children.map((child) => child.text).join('')).join('\n');
                setHtmlContent(htmlContent);

                const responseAvatarURL = await api.get(`/api/Account/GetAvatar/${response.data.idUsuarioEmpresa}`, { responseType: 'blob', requireLoading: false });
                const avatarBlob = new Blob([responseAvatarURL.data], { type: responseAvatarURL.headers['content-type'] });
                const url = URL.createObjectURL(avatarBlob);

                response.data.logoEmpresa = url;
                setDesafio(response.data);
            } catch (error) {
                console.log(error);
                console.error(error);
            }
            setLoading(false);
        };

        getChallenge();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [challengeId]);

    return (
        <div className="min-h-screen bg-background text-foreground py-4">
            <div className="container mx-auto px-4 md:px-6 py-12 relative z-20">
                <div className="flex flex-col lg:flex-row gap-8">
                    {!loading && <div className='flex-1'>
                        <div className="flex items-center align-items-center gap-2">
                            <img
                                src={desafio.logoEmpresa}
                                alt={`Logo de ${desafio.empresa}`}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                                <h1 className="text-xl lg:text-2xl font-semibold group-hover:text-primary transition-colors">
                                    {desafio.titulo}
                                </h1>
                                <p className="text-sm text-muted-foreground">{desafio.empresa}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                        </div>
                    </div>}
                    {!loading && <div className='w-full lg:w-1/3'>
                        <Card className="rounded-lg p-4">
                            <h2 className="text-lg font-bold text-primary">Detalles del desafío</h2>
                        </Card>
                    </div>}
                </div>
            </div>
        </div>
    );
};

export default Challenge;