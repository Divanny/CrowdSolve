import { CircleArrowRight, Files, Settings } from 'lucide-react';
import CrowdSolveLogoVertical from '@/assets/CrowdSolveLogoVertical.svg';

const About = () => {
    return (
        <section className="pt-24 pb-12">
            <div className="container flex flex-col gap-28">
                <div className="flex flex-col gap-7">
                    <h1 className="text-4xl font-semibold lg:text-7xl">
                        Conectando personas
                    </h1>
                    <p className="max-w-xl text-lg">
                        CrowdSolve es una plataforma diseñada para conectar a personas que buscan resolver problemas de manera colaborativa. Su objetivo es reunir a diferentes tipos de usuarios, como expertos, empresas y participantes interesados en encontrar soluciones innovadoras para desafíos específicos.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <img
                        src={CrowdSolveLogoVertical}
                        alt="CrowdSolve Icon"
                        className="size-full max-h-96 rounded-2xl"
                    />
                    <div className="flex flex-col justify-between gap-10 rounded-2xl bg-card border-card p-10">
                        <p className="text-sm text-muted-foreground">NUESTRA MISIÓN</p>
                        <p className="text-lg">
                            CrowdSolve busca fomentar la colaboración abierta, donde las ideas y las soluciones se compartan y evalúen, permitiendo que los problemas se resuelvan de forma eficiente. Además, se enfoca en crear un espacio donde los usuarios puedan demostrar sus habilidades, trabajar en conjunto, y aportar valor tanto a nivel individual como a nivel organizacional.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col gap-6 md:gap-20">
                    <div className="max-w-xl">
                        <h2 className="mb-2.5 text-3xl font-semibold md:text-5xl">
                            Facilitando la Creación de Soluciones Innovadoras
                        </h2>
                        <p className="text-muted-foreground">
                            Nuestro objetivo es empoderar a equipos y personas para que colaboren y encuentren soluciones innovadoras a desafíos específicos. Aquí es cómo planeamos lograrlo.
                        </p>
                    </div>
                    <div className="grid gap-10 md:grid-cols-3">
                        <div className="flex flex-col">
                            <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-card">
                                <Files className="size-5" />
                            </div>
                            <h3 className="mb-3 mt-2 text-lg font-semibold">
                                Fomentando la Colaboración Abierta
                            </h3>
                            <p className="text-muted-foreground">
                                Creemos que no hay lugar para grandes egos y siempre hay tiempo para ayudarnos mutuamente. Nos esforzamos por dar y recibir retroalimentación, ideas y perspectivas.
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-card">
                                <CircleArrowRight className="size-5" />
                            </div>
                            <h3 className="mb-3 mt-2 text-lg font-semibold">
                                Avanzando con Claridad
                            </h3>
                            <p className="text-muted-foreground">
                                Audazmente, con valentía y con objetivos claros. Buscamos las grandes oportunidades y nos enfocamos en las cosas más importantes en las que trabajar.
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-card">
                                <Settings className="size-5" />
                            </div>
                            <h3 className="mb-3 mt-2 text-lg font-semibold">
                                Optimizando para el Empoderamiento
                            </h3>
                            <p className="text-muted-foreground">
                                Creemos que todos deberían estar empoderados para hacer lo que consideren mejor para los intereses de la empresa.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
