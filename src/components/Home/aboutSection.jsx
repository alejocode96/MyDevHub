/**
 * @component  AboutSection.jsx
 * @description Componente de sección "Acerca de" que presenta el perfil profesional
 * y las áreas de especialización mediante un diseño de grid con tarjetas interactivas.
 * La sección entera anima como una card 3D scrubbed al scroll (ver useGSAP más abajo).
 * @author Alejandro Galeano
 * @version 3.0.0
 */

import React, { useRef } from 'react'
import { Code2, ChartScatter, MousePointerClick, Zap } from "lucide-react";

// animación — la sección entera es una "card" que se levanta en 3D hacia el
// usuario a medida que se hace scroll (scrubbed, no un play-once), con el
// texto y las 4 mini-cards entrando en su propia secuencia dentro del mismo
// timeline — mismo espíritu que el HeroSection de arriba. El cascade interno
// se ramifica mobile/desktop (ver responsiveMotion en utils/gsap.js): en
// mobile el grid se apila a una sola columna y la sección se vuelve mucho
// más alta que el viewport.
import { gsap, useGSAP, responsiveMotion } from '../../utils/gsap';

const TRANSITION = 'transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)';

const AboutSection = () => {

    const sectionRef = useRef(null)
    const glowRef = useRef(null)
    const titleRef = useRef(null)
    const para1Ref = useRef(null)
    const para2Ref = useRef(null)
    const card1Ref = useRef(null)
    const card2Ref = useRef(null)
    const card3Ref = useRef(null)
    const card4Ref = useRef(null)

    useGSAP(() => {
        const cards = [card1Ref.current, card2Ref.current, card3Ref.current, card4Ref.current]

        // Estado oculto de TODO lo que entra — se aplica de inmediato,
        // antes de que el scroll llegue a la sección (si se hiciera con
        // .from() dentro del timeline, solo el primer target en el
        // stagger se ocultaría al instante; el resto quedaría visible
        // hasta que el scrub los alcanzara).
        const hideAll = () => {
            gsap.set(sectionRef.current, { transformPerspective: 1000, transformOrigin: '50% 100%', rotationX: 18, y: 140, scale: 0.92, opacity: 0 })
            gsap.set([titleRef.current, para1Ref.current, para2Ref.current], { y: 30, opacity: 0 })
            gsap.set(cards, { y: 50, opacity: 0, scale: 0.8, rotationX: 25, transformPerspective: 800 })
        }

        // El grid pasa a 1 columna por debajo de 640px (Tailwind
        // sm:grid-cols-2) y ahí la sección se vuelve mucho más alta que el
        // viewport. Un timeline compartido atado al TOP de la sección (lo
        // que funciona bien en desktop, donde todo cabe junto) falla en
        // mobile: el título está pegado arriba de una sección de 1000px+,
        // así que por scroll normal ya salió de pantalla por arriba mucho
        // antes de que el timeline compartido termine de revelarlo —
        // comprobado con Playwright: opacity todavía en ~0.2 cuando el
        // título ya estaba a punto de desaparecer. En mobile cada pieza usa
        // SU PROPIO trigger (su propia posición), no la de la sección, así
        // que revela exactamente cuando ESA pieza entra en pantalla, sin
        // importar cuántos elementos haya antes ni qué tan alta sea la
        // sección. Sin rotationX/perspective tampoco: en un elemento muy
        // alto y angosto el giro 3D no se lee bien y no aporta nada aquí.
        gsap.matchMedia().add(responsiveMotion(640), (context) => {
            const { isDesktop } = context.conditions

            if (isDesktop) {
                hideAll()

                // Dos fases, cada una con su propio tramo de scroll — si
                // comparten el mismo rango corto se pisan entre sí (la card
                // terminando de girar a la vez que el texto entra) y se
                // siente brusco. Primero se levanta la card (fase corta), y
                // solo cuando ya está casi de frente entra el contenido.
                gsap.timeline({
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 95%', end: 'top 72%', scrub: 1 },
                }).to(sectionRef.current, { rotationX: 0, y: 0, scale: 1, opacity: 1, ease: 'none', duration: 1 })

                gsap.timeline({
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', end: 'top 42%', scrub: 1 },
                })
                    .to(titleRef.current, { y: 0, opacity: 1, ease: 'none', duration: 0.35 }, 0)
                    .to(para1Ref.current, { y: 0, opacity: 1, ease: 'none', duration: 0.35 }, 0.12)
                    .to(para2Ref.current, { y: 0, opacity: 1, ease: 'none', duration: 0.35 }, 0.24)
                    .to(cards, { y: 0, opacity: 1, scale: 1, rotationX: 0, ease: 'none', duration: 0.4, stagger: 0.1 }, 0.36)
                return
            }

            // Mobile — el contenedor conserva el mismo lenguaje "card 3D"
            // que el resto de las secciones (más sutil: menos grados de
            // giro y más perspectiva, porque acá el elemento es mucho más
            // alto y angosto que en desktop — un giro tan pronunciado como
            // el de desktop se ve distorsionado en algo tan alto). El
            // contenido de ADENTRO sigue con reveal simple por su cuenta
            // (ver comentario de arriba de por qué).
            gsap.set(sectionRef.current, { transformPerspective: 1600, transformOrigin: '50% 100%', rotationX: 10, y: 60, scale: 0.95, opacity: 0 })
            gsap.timeline({
                scrollTrigger: { trigger: sectionRef.current, start: 'top 92%', end: 'top 65%', scrub: 1 },
            }).to(sectionRef.current, { rotationX: 0, y: 0, scale: 1, opacity: 1, ease: 'none', duration: 1 })

            const revealOwn = (target, from) => {
                gsap.set(target, from)
                const to = { opacity: 1 }
                if ('y' in from) to.y = 0
                if ('scale' in from) to.scale = 1
                gsap.timeline({
                    scrollTrigger: { trigger: target, start: 'top 88%', end: 'top 55%', scrub: 1 },
                }).to(target, { ...to, ease: 'none', duration: 1 })
            }

            revealOwn(titleRef.current, { y: 24, opacity: 0 })
            revealOwn(para1Ref.current, { y: 24, opacity: 0 })
            revealOwn(para2Ref.current, { y: 24, opacity: 0 })
            cards.forEach((card) => revealOwn(card, { y: 30, opacity: 0, scale: 0.92 }))
        })

        // Parallax conector — el glow decorativo se desplaza más lento
        // que el scroll mientras se atraviesa la sección, dando
        // continuidad con el efecto de dispersión del Hero de arriba
        gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
            gsap.to(glowRef.current, {
                yPercent: 30,
                ease: 'none',
                scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
            })
        })
    }, { scope: sectionRef })

    return (
        <section ref={sectionRef} id='aboutSection' className='relative overflow-hidden bg-gray-50 dark:bg-zinc-900 mb-10 rounded-4xl shadow-[0_2px_8px_0_rgba(99,99,99,0.2)] border border-zinc-300/50 dark:border-zinc-800/50 py-10 px-4 sm:px-6 lg:px-8 will-change-transform' style={{ scrollMarginTop: '24px' }}  >
            {/* Efecto decorativo lateral izquierdo */}
            <div ref={glowRef} className='absolute top-0 left-0 w-[200px] h-[400px] bg-gradient-to-r from-zinc-600 to-zinc-400 opacity-40 dark:from-[#fff]/30 dark:to-[#e9e9e9]/30 dark:opacity-100 pointer-events-none' style={{ maskImage: "radial-gradient(farthest-side at left, white, transparent)", WebkitMaskImage: "radial-gradient(farthest-side at left, white, transparent)" }} />

            <div className='w-[98%] mx-auto place-items-center lg:place-items-stretch relative z-10'>
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-4'>

                    {/* ── Columna izquierda — texto ──────────────────────── */}
                    <div className='lg:col-span-5'>

                        {/* Título — entra cuando él mismo es visible */}
                        <h2 ref={titleRef} className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-zinc-800 dark:text-zinc-50'  >
                            PERFIL PROFESIONAL
                        </h2>

                        {/* Párrafo 1 */}
                        <p ref={para1Ref} className='text-zinc-700 dark:text-zinc-300 text-sm sm:text-md mb-8 leading-relaxed'   >
                            Ingeniero en Sistemas de Información con sólida experiencia en desarrollo full stack,
                            análisis de datos, automatización de procesos e inteligencia artificial aplicada.
                            Orientado a construir soluciones tecnológicas de alto impacto que optimizan la eficiencia
                            operativa, impulsan la transformación digital y respaldan la toma de decisiones estratégicas.
                        </p>

                        {/* Párrafo 2 */}
                        <p ref={para2Ref} className='text-zinc-700 dark:text-zinc-300 text-sm sm:text-md mb-8 leading-relaxed' >
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
                            <div ref={card1Ref} className='will-change-transform' >
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
                            <div ref={card2Ref} className='will-change-transform'   >
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
                            <div ref={card3Ref} className='will-change-transform'    >
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
                            <div ref={card4Ref} className='will-change-transform' >
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