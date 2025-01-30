import React from 'react';
import { CircleArrowRight, Files, Settings, Users, Zap, Clock, Globe } from 'lucide-react';
import CrowdSolveLogoVertical from '../../assets/CrowdSolveLogoVertical.svg';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const About = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    
    return (
        <section className="pt-24 pb-8">
            <div className="container mx-auto px-4">
                {/* Hero Section */}
                <div className="mb-24 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="md:w-1/2">
                        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                            {t('about.title')}
                        </h1>
                        <p className="mb-8 text-xl text-muted-foreground">
                            {t('about.description')}
                        </p>
                        <Button className="w-full sm:w-auto" onClick={() => navigate('/sign-up')}>
                            {t('Herosection.buttons.join_community')}
                        </Button>
                    </div>
                    <div className="md:w-1/2">
                        <div className="relative h-96 overflow-hidden rounded-2xl">
                            <img
                                src={CrowdSolveLogoVertical || "/placeholder.svg"}
                                alt="CrowdSolve Icon"
                                className="size-full max-h-96 rounded-2xl"
                            />
                        </div>
                    </div>
                </div>
                
                {/* Mission and Vision Section */}
                <div className="mb-24 grid md:grid-cols-2 gap-8">
                    <div className="bg-card rounded-3xl p-8 shadow-lg">
                        <h2 className="mb-6 text-3xl font-bold text-center sm:text-4xl">
                            {t('about.mission')}
                        </h2>
                        <p className="text-xl leading-relaxed">
                            {t('about.mission_description')}
                        </p>
                    </div>
                    <div className="bg-primary text-primary-foreground rounded-3xl p-8 shadow-lg">
                        <h2 className="mb-6 text-3xl font-bold text-center sm:text-4xl">
                            {t('about.vision')}
                        </h2>
                        <p className="text-xl leading-relaxed">
                            {t('about.vision_description')}
                        </p>
                    </div>
                </div>
                
                {/* Features Section */}
                <div className="mb-24">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                            {t('about.section_title')}
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                            {t('about.section_description')}
                        </p>
                    </div>
                    <div className="grid gap-8 md:grid-cols-3">
                        {[
                            { Icon: Files, title: 'about.features.0.title', description: 'about.features.0.description' },
                            { Icon: CircleArrowRight, title: 'about.features.1.title', description: 'about.features.1.description' },
                            { Icon: Settings, title: 'about.features.2.title', description: 'about.features.2.description' },
                            { Icon: Users, title: 'about.features.3.title', description: 'about.features.3.description' },
                            { Icon: Clock, title: 'about.features.4.title', description: 'about.features.4.description' },
                            { Icon: Globe, title: 'about.features.5.title', description: 'about.features.5.description' },
                        ].map((feature, index) => (
                            <div key={index} className="flex flex-col items-center text-center p-6 bg-card rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                    <feature.Icon className="h-8 w-8" />
                                </div>
                                <h3 className="mb-3 text-xl font-semibold">
                                    {t(feature.title)}
                                </h3>
                                <p className="text-muted-foreground">
                                    {t(feature.description)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Stats Section */}
                <div className="mb-12 bg-primary text-primary-foreground rounded-3xl p-12">
                    <h2 className="mb-8 text-3xl font-bold text-center sm:text-4xl">
                        {t('about.stats_title')}
                    </h2>
                    <div className="grid gap-8 md:grid-cols-4">
                        {[
                            { value: '10M+', label: 'about.stats.users' },
                            { value: '50K+', label: 'about.stats.projects' },
                            { value: '99.9%', label: 'about.stats.uptime' },
                            { value: '24/7', label: 'about.stats.support' },
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                                <div className="text-lg">{t(stat.label)}</div>
                            </div>
                        ))}
                    </div>
                </div>
                
            </div>
        </section>
    );
};

export default About;

