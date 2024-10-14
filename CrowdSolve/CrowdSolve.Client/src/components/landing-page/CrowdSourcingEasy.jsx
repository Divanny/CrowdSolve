import { FileUp, ClipboardCheck, UsersRound } from 'lucide-react';
import { motion } from 'framer-motion';
import ScrollAnimationWrapper from '../ScrollAnimationWrapper';

const CrowdSourcingEasy = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
            },
        },
    };

    const iconVariants = {
        hidden: { scale: 0, rotate: -180 },
        visible: {
            scale: 1,
            rotate: 0,
            transition: {
                type: 'spring',
                stiffness: 260,
                damping: 20,
            },
        },
    };

    return (
        <section className="bg-accent py-32">
            <ScrollAnimationWrapper>
                <motion.div
                    className="container flex flex-col gap-28"
                    variants={containerVariants}
                >
                    <div className="flex flex-col gap-6 md:gap-20">
                        <motion.div className="text-center max-w-3xl mx-auto" variants={itemVariants}>
                            <motion.p className="mb-3 text-xs font-medium uppercase tracking-wider" variants={itemVariants}>
                                ¿Cómo funciona?
                            </motion.p>
                            <motion.h2 className="mb-2.5 text-3xl font-semibold md:text-5xl" variants={itemVariants}>
                                El crowdsourcing es fácil
                            </motion.h2>
                            <motion.p className="text-muted-foreground" variants={itemVariants}>
                                CrowdSolve simplifica el proceso de crowdsourcing en tres fases claves: publicación del desafío, participación de la comunidad y evaluación colaborativa.
                            </motion.p>
                        </motion.div>
                        <motion.div className="grid gap-10 md:grid-cols-3" variants={containerVariants}>
                            <motion.div className="flex flex-col" variants={itemVariants}>
                                <motion.div
                                    className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-accent"
                                    variants={iconVariants}
                                >
                                    <FileUp className="size-5" />
                                </motion.div>
                                <motion.h3 className="mb-3 mt-2 text-lg font-semibold" variants={itemVariants}>
                                    Publicar desafíos
                                </motion.h3>
                                <motion.p className="text-muted-foreground" variants={itemVariants}>
                                    Describe tu problema e invita a la comunidad CrowdSolve a brindar soluciones innovadoras.
                                </motion.p>
                            </motion.div>
                            <motion.div className="flex flex-col" variants={itemVariants}>
                                <motion.div
                                    className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-accent"
                                    variants={iconVariants}
                                >
                                    <UsersRound className="size-5" />
                                </motion.div>
                                <motion.h3 className="mb-3 mt-2 text-lg font-semibold" variants={itemVariants}>
                                    Involucrar a la comunidad
                                </motion.h3>
                                <motion.p className="text-muted-foreground" variants={itemVariants}>
                                    Acceda a una red global de solucionadores de problemas y colabore en las mejores soluciones.
                                </motion.p>
                            </motion.div>
                            <motion.div className="flex flex-col" variants={itemVariants}>
                                <motion.div
                                    className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-accent"
                                    variants={iconVariants}
                                >
                                    <ClipboardCheck className="size-5" />
                                </motion.div>
                                <motion.h3 className="mb-3 mt-2 text-lg font-semibold" variants={itemVariants}>
                                    Evaluar colaborativamente
                                </motion.h3>
                                <motion.p className="text-muted-foreground" variants={itemVariants}>
                                    Revisar las soluciones propuestas y seleccionar las más prometedoras a través de un proceso colaborativo.
                                </motion.p>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </ScrollAnimationWrapper>
        </section>
    );
};

export default CrowdSourcingEasy;