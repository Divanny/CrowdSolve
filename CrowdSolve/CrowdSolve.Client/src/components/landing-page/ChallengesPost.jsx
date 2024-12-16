import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import useAxios from '@/hooks/use-axios';
import { Skeleton } from '@/components/ui/skeleton';

const ChallengesPost = () => {
    const { t } = useTranslation();
    const { api } = useAxios();
    const navigate = useNavigate();

    const [challenges, setChallenges] = useState([]);
    const [relationalObjects, setRelationalObjects] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const [challengeResponse, relationalObjectsResponse] = await Promise.all([
                    api.get(`/api/Desafios/GetDesafiosLandingPage`, { requireLoading: false }),
                    api.get("/api/Desafios/GetRelationalObjects", {
                        requireLoading: false,
                    })
                ])

                const challengesResponse = await Promise.all(challengeResponse.data.map(async (challenge) => {
                    return { ...challenge, fechaInicio: new Date(challenge.fechaInicio), fechaLimite: new Date(challenge.fechaLimite) };
                }));

                setChallenges(challengesResponse);
                setRelationalObjects(relationalObjectsResponse.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchChallenges();
        // eslint-disable-next-line
    }, []);

    function getTimeAgo(date) {
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - date.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 1) return "hace 1 día"
        if (diffDays < 7) return `hace ${diffDays} días`
        if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7)
            return `hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`
        }
        const months = Math.floor(diffDays / 30)
        return `hace ${months} ${months === 1 ? 'mes' : 'meses'}`
    }

    const getCategoryName = (idCategoria) => {
        const category = relationalObjects.categorias.find(cat => cat.idCategoria === idCategoria);
        return category ? category.nombre : 'Desconocida';
    };

    return (
        <motion.section
            className="py-20 md:py-32"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <div className="container flex flex-col items-center gap-16 lg:px-16">
                <motion.div
                    className="text-center"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="mb-6 text-xs font-medium uppercase tracking-wider">
                        {t('challengesPost.sectionLabel')}
                    </p>
                    <h2 className="mb-3 text-pretty text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
                        {t('challengesPost.sectionTitle')}
                    </h2>
                    <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
                        {t('challengesPost.sectionDescription')}
                    </p>
                    <Button variant="link" className="w-full sm:w-auto" onClick={() => navigate('/challenges')}>
                        {t('challengesPost.exploreChallengesButton')}
                        <ArrowRight className="ml-2 size-4" />
                    </Button>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, index) => (
                            <Skeleton key={index} className="h-64 w-full" />
                        ))
                    ) : (
                        challenges && challenges.map((challenge, index) => (
                            <motion.div
                                key={challenge.idDesafio}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card className="group relative">
                                    <Link to={`/challenge/${challenge.idDesafio}`}>
                                        <CardContent className="p-6 space-y-4 flex flex-col justify-between h-full">
                                            <div className="flex flex-col gap-4">
                                                <div className="flex items-center gap-4">
                                                    <img
                                                        src={`/api/Account/GetAvatar/${challenge.idUsuarioEmpresa}`}
                                                        alt={challenge.empresa}
                                                        style={{ width: 50, height: 50 }}
                                                        className="rounded-lg"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold group-hover:text-primary transition-colors truncate">
                                                            {challenge.titulo}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground truncate">
                                                            {challenge.empresa}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge
                                                        variant={challenge.severidadEstatusDesafio}
                                                    >
                                                        {challenge.estatusDesafio}
                                                    </Badge>
                                                    {challenge.categorias.slice(0, 2).map((category) => (
                                                        <Badge key={category.idCategoria} variant="outline">
                                                            {getCategoryName(category.idCategoria)}
                                                        </Badge>
                                                    ))}
                                                    {challenge.categorias.length > 2 && (
                                                        <span className="text-sm text-muted-foreground">
                                                            +{challenge.categorias.length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                <span>{challenge.soluciones.length} soluciones</span>
                                                <span>{getTimeAgo(challenge.fechaInicio)}</span>
                                            </div>
                                        </CardContent>
                                    </Link>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </motion.section>
    );
};

export default ChallengesPost;