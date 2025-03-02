import React, { useState, useEffect } from 'react'
import { ArrowRight, Globe, Sparkles, Users } from 'lucide-react'
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion'
import GirlImage from '@/assets/landing-page/girl-image.jpg'
import KidImage from '@/assets/landing-page/kid-image.jpg'
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MagneticButton from '@/components/ui/magnetic-button';

const HeroSection = () => {
    const [currentDesign, setCurrentDesign] = useState(0)
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDesign((prev) => (prev + 1) % 3)
        }, 5000)

        return () => clearInterval(timer)
    }, [])

    const designs = [
        {
            icon: Globe,
            text: t('Herosection.designs.globalCommunity'),
            gradient: 'from-[#9F5638] to-[#EF8535]',
        },
        {
            icon: Sparkles,
            text: t('Herosection.designs.innovation'),
            gradient: 'from-[#9F5638] to-[#EF8535]',
        },
        {
            icon: Users,
            text: t('Herosection.designs.collaboration'),
            gradient: 'from-[#9F5638] to-[#EF8535]',
        },
    ]

    return (
        <section className="container my-8 lg:my-0 grid items-center gap-8 lg:grid-cols-2">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center text-center lg:mx-auto lg:items-start lg:px-0 lg:text-left"
            >
                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="my-6 text-pretty text-3xl font-bold lg:text-5xl"
                >
                    {t('Herosection.title')}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mb-8 max-w-xl text-muted-foreground lg:text-lg"
                >
                    {t('Herosection.description')}
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start"
                >
                    <Button className="w-full sm:w-auto" onClick={() => navigate('/company/challenge/new')}>
                        <ArrowRight className="mr-2 size-4" />
                        {t('Herosection.buttons.post_challenge')}
                    </Button>
                    <MagneticButton>
                        <Button variant="outline" className="w-full sm:w-auto" onClick={() => navigate('/sign-up')}>
                            {t('Herosection.buttons.join_community')}
                        </Button>
                    </MagneticButton>
                </motion.div>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative aspect-[3/4]"
            >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.svg
                        animate={{ rotate: 360 }}
                        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        viewBox="0 0 800 800"
                        className="size-full opacity-50"
                    >
                        {Array.from(Array(720).keys()).map((dot, index, array) => {
                            const angle = 0.2 * index
                            const scalar = 40 + index * (360 / array.length)
                            const x = Math.round(Math.cos(angle) * scalar)
                            const y = Math.round(Math.sin(angle) * scalar)

                            return (
                                <circle
                                    key={index}
                                    r={(3 * index) / array.length}
                                    cx={400 + x}
                                    cy={400 + y}
                                    opacity={1 - Math.sin(angle)}
                                    fill="#9F5638"
                                />
                            )
                        })}
                    </motion.svg>
                </div>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="absolute left-[8%] top-[10%] flex aspect-[5/6] w-[38%] flex-col justify-between rounded-lg border border-border bg-cover bg-center p-4 text-white overflow-hidden"
                    style={{
                        backgroundImage: `url(${KidImage})`,
                        boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.5)'
                    }}
                >
                    <div className="text-sm sm:text-2xl font-bold">{t('Herosection.card_texts.innovation.title')}</div>
                    <div className="text-xs sm:text-sm">{t('Herosection.card_texts.innovation.subtitle')}</div>
                </motion.div>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentDesign}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.5 }}
                        className={`absolute right-[12%] top-[20%] flex aspect-square w-2/6 sm:w-1/5 flex-col items-center justify-center rounded-lg border border-[#9F5638] bg-gradient-to-br ${designs[currentDesign].gradient} p-2 text-center text-white shadow-lg`}
                    >
                        {React.createElement(designs[currentDesign].icon, { className: "mb-1 size-4 sm:size-8" })}
                        <span className="text-xs font-semibold">{designs[currentDesign].text}</span>
                    </motion.div>
                </AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="absolute bottom-[24%] right-[24%] flex aspect-[5/6] w-[38%] flex-col justify-end rounded-lg border border-border bg-cover bg-center p-4 text-white overflow-hidden"
                    style={{
                        backgroundImage: `url(${GirlImage})`,
                        boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.5)'
                    }}
                >
                    <div className="text-sm sm:text-xl font-semibold">{t('Herosection.card_texts.solutions.title')}</div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default HeroSection;