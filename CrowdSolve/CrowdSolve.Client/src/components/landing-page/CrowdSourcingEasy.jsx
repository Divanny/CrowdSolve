import { FileUp, ClipboardCheck, UsersRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const CrowdSourcingEasy = () => {
    const { t } = useTranslation();
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
        <section className="bg-accent py-20 md:py-32 relative dark:bg-dot-white/[0.2] bg-dot-black/[0.2]">
            <motion.div
                className="container flex flex-col gap-28"
                variants={containerVariants}
            >
                <div className="flex flex-col gap-6 md:gap-20 z-10">
                    <motion.div className="text-center max-w-3xl mx-auto" variants={itemVariants}>
                        <motion.p className="mb-3 text-xs font-medium uppercase tracking-wider" variants={itemVariants}>
                            {t('CrowdSourcingEasy.sectionLabel')}
                        </motion.p>
                        <motion.h2 className="mb-2.5 text-3xl font-semibold md:text-5xl" variants={itemVariants}>
                            {t('CrowdSourcingEasy.sectionTitle')}
                        </motion.h2>
                        <motion.p className="text-muted-foreground" variants={itemVariants}>
                            {t('CrowdSourcingEasy.sectionDescription')}
                        </motion.p>
                    </motion.div>
                    <motion.div className="grid gap-10 md:grid-cols-3" variants={containerVariants}>
                        <motion.div className="flex flex-col" variants={itemVariants}>
                            <motion.div
                                className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-card"
                                variants={iconVariants}
                            >
                                <FileUp className="size-5" />
                            </motion.div>
                            <motion.h3 className="mb-3 mt-2 text-lg font-semibold" variants={itemVariants}>
                                {t('CrowdSourcingEasy.publishChallenges.title')}
                            </motion.h3>
                            <motion.p className="text-muted-foreground" variants={itemVariants}>
                                {t('CrowdSourcingEasy.publishChallenges.description')}
                            </motion.p>
                        </motion.div>
                        <motion.div className="flex flex-col" variants={itemVariants}>
                            <motion.div
                                className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-card"
                                variants={iconVariants}
                            >
                                <UsersRound className="size-5" />
                            </motion.div>
                            <motion.h3 className="mb-3 mt-2 text-lg font-semibold" variants={itemVariants}>
                                {t('CrowdSourcingEasy.engageCommunity.title')}
                            </motion.h3>
                            <motion.p className="text-muted-foreground" variants={itemVariants}>
                                {t('CrowdSourcingEasy.engageCommunity.description')}
                            </motion.p>
                        </motion.div>
                        <motion.div className="flex flex-col" variants={itemVariants}>
                            <motion.div
                                className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-card"
                                variants={iconVariants}
                            >
                                <ClipboardCheck className="size-5" />
                            </motion.div>
                            <motion.h3 className="mb-3 mt-2 text-lg font-semibold" variants={itemVariants}>
                                {t('CrowdSourcingEasy.evaluateCollaboratively.title')}
                            </motion.h3>
                            <motion.p className="text-muted-foreground" variants={itemVariants}>
                                {t('CrowdSourcingEasy.evaluateCollaboratively.description')}
                            </motion.p>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
            <div className="z-0 absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-accent bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)]"></div>
        </section>
    );
};

export default CrowdSourcingEasy;