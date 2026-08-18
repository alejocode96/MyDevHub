import React, { useRef } from 'react'
import { Bot, Target, Plug, Rocket, ArrowRight } from 'lucide-react'
import { gsap, useGSAP } from '../../utils/gsap'

/**
 * ==================== AsistentesSection ====================
 * Sección "Asistentes" (04) de la ruta de IA generativa — todavía sin
 * contenido real, pero con SU PROPIO diseño (ni el chat de Técnicas ni
 * la grilla de herramientas de Práctica): una card central tipo
 * "blueprint" con el ícono del asistente y, debajo, el proceso de
 * armado en 3 pasos (definir → conectar → desplegar) — anticipa que
 * esta sección va a tratar sobre CONSTRUIR un asistente, no sobre
 * conversar con uno ni sobre practicar con herramientas sueltas.
 *
 * El usuario no dio detalle del contenido real de esta sección todavía
 * (a diferencia de Práctica) — el copy es un placeholder genérico
 * inferido del propio texto del Hero ("la creación de asistentes
 * reales"), pendiente de que se defina el contenido real más adelante.
 */

const STEPS = [
    { id: 1, label: 'Definí el objetivo', icon: Target },
    { id: 2, label: 'Conectá tus herramientas', icon: Plug },
    { id: 3, label: 'Desplegalo', icon: Rocket },
]

const Badge = ({ children }) => (
    <span
        className="inline-flex w-fit items-center gap-1.5 text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full border text-zinc-500 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700 bg-white/60 dark:bg-zinc-800/60"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
        {children}
    </span>
)

const AsistentesSection = () => {
    const sectionRef = useRef(null)
    const cardRef = useRef(null)
    const stepsRef = useRef(null)

    /** Mismo efecto "mini-card 3D" que el resto del sitio para la card
     * central; los 3 pasos hacen su propio fade-up en cascada, un poco
     * después (empiezan a los 0.3 del timeline) para que se sientan como
     * el contenido "de adentro" de la card, no la card misma. */
    useGSAP(() => {
        gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
            gsap.set(cardRef.current, { y: 50, opacity: 0, scale: 0.9, rotationX: 16, transformPerspective: 900 })
            gsap.set(stepsRef.current.children, { y: 16, opacity: 0 })

            gsap.timeline({
                scrollTrigger: { trigger: cardRef.current, start: 'top 85%', end: 'top 55%', scrub: 1 },
            })
                .to(cardRef.current, { y: 0, opacity: 1, scale: 1, rotationX: 0, ease: 'none', duration: 0.7 }, 0)
                .to(stepsRef.current.children, { y: 0, opacity: 1, ease: 'none', duration: 0.3, stagger: 0.1 }, 0.35)
        })
    }, { scope: sectionRef })

    return (
        <section
            ref={sectionRef}
            id="asistentesSection"
            className="relative w-full bg-white dark:bg-zinc-950 py-16 md:py-24 px-4 md:px-8"
            style={{ scrollMarginTop: '24px' }}
        >
            <div className="max-w-2xl mx-auto flex flex-col items-center gap-4 text-center mb-12 md:mb-16">
                <span
                    className="font-mono text-sm tracking-widest text-cyan-600 dark:text-cyan-400"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                    04 — ASISTENTES
                </span>
                <h2
                    className="text-zinc-800 dark:text-white tracking-wide"
                    style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(1.9rem, 4.2vw, 3rem)', fontWeight: 700, lineHeight: 1.15 }}
                >
                    Asistentes reales
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed" style={{ fontFamily: "'Sora', sans-serif" }}>
                    De la idea a un asistente funcionando, integrado con tus propias herramientas y datos — esta sección todavía está en construcción.
                </p>
            </div>

            <div
                ref={cardRef}
                className="relative max-w-xl mx-auto rounded-[32px] border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900 shadow-sm p-8 md:p-12 flex flex-col items-center text-center gap-5"
            >
                <span className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 dark:bg-cyan-400/10 text-cyan-600 dark:text-cyan-400">
                    <span className="absolute inset-0 rounded-2xl border border-cyan-500/25 dark:border-cyan-400/25 animate-pulse" aria-hidden="true" />
                    <Bot size={28} strokeWidth={1.5} />
                </span>

                <Badge>En construcción</Badge>

                <h3
                    className="font-bold text-zinc-800 dark:text-zinc-50"
                    style={{ fontFamily: "'Sora', sans-serif", fontSize: 'clamp(20px, 2.4vw, 26px)' }}
                >
                    Próximamente más información
                </h3>
                <p className="text-[14.5px] leading-relaxed text-zinc-600 dark:text-zinc-300 max-w-md">
                    Estamos preparando el recorrido para armar asistentes reales, conectados a tus propias herramientas y datos. Volvé pronto.
                </p>

                {/* Proceso de armado — 3 pasos, mismo lenguaje visual (tags
                    redondeados) que el resto del sitio, con flechas
                    conectoras entre cada uno. Se apila en mobile. */}
                <div ref={stepsRef} className="flex flex-col sm:flex-row items-center gap-2 sm:gap-2.5 mt-2">
                    {STEPS.map((step, i) => (
                        <React.Fragment key={step.id}>
                            <div className="inline-flex items-center gap-2 rounded-full pl-2 pr-3.5 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/10 dark:bg-cyan-400/10 text-cyan-600 dark:text-cyan-400">
                                    <step.icon size={13} strokeWidth={2} />
                                </span>
                                <span className="text-[12.5px] font-medium text-zinc-600 dark:text-zinc-300 whitespace-nowrap">{step.label}</span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <ArrowRight size={14} className="text-zinc-300 dark:text-zinc-700 rotate-90 sm:rotate-0 shrink-0" />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default AsistentesSection
