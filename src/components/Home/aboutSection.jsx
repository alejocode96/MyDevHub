/**
 * @component  AboutSection.jsx
 * @description Componente de sección "Acerca de" que presenta el perfil profesional
 * y las áreas de especialización mediante un diseño de grid con tarjetas interactivas.
 * Cada elemento tiene su propio IntersectionObserver para animaciones independientes.
 * @author Alejandro Galeano
 * @version 2.0.0
 */

import React from 'react'
import { Code2, ChartScatter, MousePointerClick, Zap } from "lucide-react";

// Cada llamada a useScrollReveal crea su propio observer independiente
import { useScrollReveal } from '../../hooks/useScrollReveal';

const TRANSITION = 'transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)';

const AboutSection = () => {

    // ── Un observer por elemento ──────────────────────────────────────────
    const title = useScrollReveal()
    const para1 = useScrollReveal()
    const para2 = useScrollReveal()
    const card1 = useScrollReveal()
    const card2 = useScrollReveal()
    const card3 = useScrollReveal()
    const card4 = useScrollReveal()
    // ─────────────────────────────────────────────────────────────────────

    return (
        <section id='aboutSection' className='relative overflow-hidden bg-gray-50 dark:bg-zinc-900 mb-10 rounded-4xl shadow-[0_2px_8px_0_rgba(99,99,99,0.2)] border border-zinc-300/50 dark:border-zinc-800/50 py-10 px-4 sm:px-6 lg:px-8' style={{ scrollMarginTop: '120px' }}  >
            {/* Efecto decorativo lateral izquierdo */}
            <div className='absolute top-0 left-0 w-[200px] h-[400px] bg-gradient-to-r from-zinc-600 to-zinc-400 opacity-40 dark:from-[#fff]/30 dark:to-[#e9e9e9]/30 dark:opacity-100 pointer-events-none' style={{ maskImage: "radial-gradient(farthest-side at left, white, transparent)", WebkitMaskImage: "radial-gradient(farthest-side at left, white, transparent)" }} />

            <div className='w-[98%] mx-auto place-items-center lg:place-items-stretch relative z-10'>
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-4'>

                    {/* ── Columna izquierda — texto ──────────────────────── */}
                    <div className='lg:col-span-5'>

                        {/* Título — entra cuando él mismo es visible */}
                        <h2 ref={title.ref} className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-zinc-800 dark:text-zinc-50 ${title.anim('0ms').className}`} style={title.anim('0ms').style}  >
                            PERFIL PROFESIONAL
                        </h2>

                        {/* Párrafo 1 */}
                        <p ref={para1.ref} className={`text-zinc-700 dark:text-zinc-300 text-sm sm:text-md mb-8 leading-relaxed ${para1.anim('0ms').className}`} style={para1.anim('0ms').style}   >
                            Ingeniero en Sistemas de Información con sólida experiencia en desarrollo full stack,
                            análisis de datos, automatización de procesos e inteligencia artificial aplicada.
                            Orientado a construir soluciones tecnológicas de alto impacto que optimizan la eficiencia
                            operativa, impulsan la transformación digital y respaldan la toma de decisiones estratégicas.
                        </p>

                        {/* Párrafo 2 */}
                        <p ref={para2.ref} className={`text-zinc-700 dark:text-zinc-300 text-sm sm:text-md mb-8 leading-relaxed ${para2.anim('0ms').className}`} style={para2.anim('0ms').style} >
                            He liderado el desarrollo de aplicaciones web, sistemas empresariales y flujos de
                            automatización inteligente, integrando tecnologías como JavaScript, Python, C#, .NET,
                            SQL Server y Power BI. Además, me he desempeñado como mentor de IA Generativa en
                            NODO – EAFIT, formando profesionales en el uso estratégico de modelos de lenguaje e
                            inteligencia artificial aplicada al entorno laboral. Mi enfoque combina pensamiento
                            analítico, arquitectura escalable y visión de negocio para entregar soluciones que
                            generan valor real y medible.
                        </p>

                    </div>

                    {/* ── Columna derecha — cards ────────────────────────── */}
                    <div className='lg:col-span-7'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-4'>

                            {/* Card 1 — Desarrollo Full Stack
                                El ref va en el wrapper externo para no pisar el rotate del hover */}
                            <div ref={card1.ref} className={card1.anim('0ms').className} style={card1.anim('0ms').style}  >
                                <div className='bg-blue-500/10 dark:bg-blue-500/20 text-blue-900 dark:text-blue-100 border border-blue-500/30 dark:border-blue-500/40 rounded-2xl p-5 flex flex-col justify-between min-h-[200px] cursor-pointer shadow-md shadow-blue-500/10 dark:shadow-blue-500/20 will-change-transform' style={{ transform: 'rotate(-3deg)', transition: TRANSITION }} onMouseEnter={e => e.currentTarget.style.transform = 'rotate(-3deg) scale(1.03)'} onMouseLeave={e => e.currentTarget.style.transform = 'rotate(-3deg)'}  >
                                    <div>
                                        <div className='mb-2 text-blue-600 dark:text-blue-400'>
                                            <Code2 strokeWidth={1.5} size={18} />
                                        </div>
                                        <h3 className='text-xl font-semibold mb-3 text-blue-900 dark:text-blue-50'>
                                            Desarrollo Full Stack
                                        </h3>
                                        <p className='text-sm leading-relaxed text-blue-800 dark:text-blue-200'>
                                            Diseño y desarrollo de aplicaciones web robustas y sistemas escalables
                                            con tecnologías modernas. Enfoque en rendimiento, arquitectura limpia y
                                            experiencia de usuario que convierte ideas en productos digitales
                                            funcionales y de alto valor.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2 — Análisis de Datos */}
                            <div ref={card2.ref} className={card2.anim('0ms').className} style={card2.anim('0ms').style}   >
                                <div className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-5 flex flex-col justify-between min-h-[200px] cursor-pointer shadow-md shadow-zinc-200/50 dark:shadow-zinc-950/50 will-change-transform" style={{ transition: TRANSITION }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}   >
                                    <div>
                                        <div className="mb-2 text-zinc-600 dark:text-zinc-300">
                                            <ChartScatter strokeWidth={1.5} size={18} />
                                        </div>
                                        <h3 className="text-xl font-semibold mb-3 text-zinc-900 dark:text-zinc-50">
                                            Análisis de Datos
                                        </h3>
                                        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                                            Transformación de datos en decisiones estratégicas mediante Python,
                                            SQL Server y Power BI. Construcción de dashboards, modelos analíticos
                                            y métricas orientadas al negocio para visualizar el rendimiento y
                                            anticipar oportunidades.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3 — Automatización de Procesos */}
                            <div ref={card3.ref} className={card3.anim('0ms').className} style={card3.anim('0ms').style}    >
                                <div className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-5 flex flex-col justify-between min-h-[200px] cursor-pointer shadow-md shadow-zinc-200/50 dark:shadow-zinc-950/50 will-change-transform" style={{ transition: TRANSITION }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}   >
                                    <div>
                                        <div className="mb-2 text-zinc-600 dark:text-zinc-300">
                                            <Zap strokeWidth={1.5} size={18} />
                                        </div>
                                        <h3 className="text-xl font-semibold mb-3 text-zinc-900 dark:text-zinc-50">
                                            Automatización de Procesos
                                        </h3>
                                        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                                            Implementación de flujos automatizados con Power Automate, n8n, Make
                                            y Zapier para conectar sistemas, eliminar tareas repetitivas y reducir
                                            tiempos operativos. Soluciones que integran aplicaciones, sincronizan
                                            datos y escalan con el negocio sin intervención manual.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 4 — Inteligencia Artificial */}
                            <div ref={card4.ref} className={card4.anim('0ms').className} style={card4.anim('0ms').style} >
                                <div className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-5 flex flex-col justify-between min-h-[200px] cursor-pointer shadow-md shadow-zinc-200/50 dark:shadow-zinc-950/50 will-change-transform" style={{ transition: TRANSITION }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}  >
                                    <div>
                                        <div className="mb-2 text-zinc-600 dark:text-zinc-300">
                                            <MousePointerClick strokeWidth={1.5} size={18} />
                                        </div>
                                        <h3 className="text-xl font-semibold mb-3 text-zinc-900 dark:text-zinc-50">
                                            Inteligencia Artificial Aplicada
                                        </h3>
                                        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                                            Desarrollo de agentes autónomos, asistentes conversacionales y pipelines de IA generativa con LLMs, RAG y function calling. Soluciones que automatizan decisiones complejas, extraen valor de datos no estructurados y se integran de forma nativa en los procesos reales del negocio.                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutSection