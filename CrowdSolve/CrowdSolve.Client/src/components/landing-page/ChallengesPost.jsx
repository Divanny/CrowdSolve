import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const challenges = [
    {
        id: 'challenge-1',
        title: 'Desafío de Innovación en Tecnología',
        summary:
            'Participa en nuestro desafío para desarrollar soluciones innovadoras en el campo de la tecnología. ¡Grandes premios para los ganadores!',
        label: 'Tecnología',
        company: 'Tech Innovators Inc.',
        published: '1 Ene 2024',
        href: '#',
        image: 'https://www.shadcnblocks.com/images/block/placeholder-dark-1.svg',
    },
    {
        id: 'challenge-2',
        title: 'Desafío de Sostenibilidad Ambiental',
        summary:
            'Únete a nuestro desafío para crear proyectos que promuevan la sostenibilidad y el cuidado del medio ambiente.',
        label: 'Medio Ambiente',
        company: 'Green Earth Corp.',
        published: '1 Ene 2024',
        href: '#',
        image: 'https://www.shadcnblocks.com/images/block/placeholder-dark-1.svg',
    },
    {
        id: 'challenge-3',
        title: 'Desafío de Innovación en Salud',
        summary:
            'Participa en nuestro desafío para desarrollar soluciones innovadoras en el campo de la salud. ¡Grandes premios para los ganadores!',
        label: 'Salud',
        company: 'Health Innovators Inc.',
        published: '1 Ene 2024',
        href: '#',
        image: 'https://www.shadcnblocks.com/images/block/placeholder-dark-1.svg',
    },
];

const ChallengesPost = () => {
    const { t } = useTranslation();

    return (
        <motion.section
            className="py-32"
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
                    <Button variant="link" className="w-full sm:w-auto">
                    {t('challengesPost.exploreChallengesButton')}
                        <ArrowRight className="ml-2 size-4" />
                    </Button>
                </motion.div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                    {challenges.map((challenge, index) => (
                        <motion.a
                            key={challenge.id}
                            href={challenge.href}
                            className="flex flex-col text-clip rounded-xl border border-border"
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div>
                                <img
                                    src={challenge.image}
                                    alt={challenge.title}
                                    className="aspect-[16/9] size-full object-cover object-center rounded-t-xl"
                                />
                            </div>
                            <div className="px-6 py-8 md:px-8 md:py-10 lg:px-10 lg:py-12">
                                <h3 className="mb-3 text-lg font-semibold md:mb-4 md:text-xl lg:mb-6">
                                    {challenge.title}
                                </h3>
                                <p className="mb-3 text-muted-foreground md:mb-4 lg:mb-6">
                                    {challenge.summary}
                                </p>
                                <p className="flex items-center hover:underline">
                                {t('challengesPost.readMore')}
                                    <ArrowRight className="ml-2 size-4" />
                                </p>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </motion.section>
    );
};

export default ChallengesPost;