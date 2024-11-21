import { CircleArrowRight, Files, Settings } from 'lucide-react';
import CrowdSolveLogoVertical from '@/assets/CrowdSolveLogoVertical.svg';
import { useTranslation } from 'react-i18next';

const About = () => {
    const { t } = useTranslation();
    
    return (
        <section className="pt-24 pb-12">
            <div className="container flex flex-col gap-28">
                <div className="flex flex-col gap-7">
                    <h1 className="text-4xl font-semibold lg:text-7xl">
                        {t('about.title')}
                    </h1>
                    <p className="max-w-xl text-lg">
                        {t('about.description')}
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <img
                        src={CrowdSolveLogoVertical}
                        alt="CrowdSolve Icon"
                        className="size-full max-h-96 rounded-2xl"
                    />
                    <div className="flex flex-col justify-between gap-10 rounded-2xl bg-card border-card p-10">
                        <p className="text-sm text-muted-foreground">{t('about.mission')}</p>
                        <p className="text-lg">
                            {t('about.mission_description')}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col gap-6 md:gap-20">
                    <div className="max-w-xl">
                        <h2 className="mb-2.5 text-3xl font-semibold md:text-5xl">
                            {t('about.section_title')}
                        </h2>
                        <p className="text-muted-foreground">
                            {t('about.section_description')}
                        </p>
                    </div>
                    <div className="grid gap-10 md:grid-cols-3">
                        <div className="flex flex-col">
                            <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-card">
                                <Files className="size-5" />
                            </div>
                            <h3 className="mb-3 mt-2 text-lg font-semibold">
                                {t('about.features.0.title')}
                            </h3>
                            <p className="text-muted-foreground">
                                {t('about.features.0.description')}
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-card">
                                <CircleArrowRight className="size-5" />
                            </div>
                            <h3 className="mb-3 mt-2 text-lg font-semibold">
                                {t('about.features.1.title')}
                            </h3>
                            <p className="text-muted-foreground">
                                {t('about.features.1.description')}
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-card">
                                <Settings className="size-5" />
                            </div>
                            <h3 className="mb-3 mt-2 text-lg font-semibold">
                                {t('about.features.2.title')}
                            </h3>
                            <p className="text-muted-foreground">
                                {t('about.features.2.description')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
