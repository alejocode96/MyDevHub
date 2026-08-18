import React, { useRef } from 'react'
import { FileText, Image, AudioLines, Video } from 'lucide-react'
import { gsap, useGSAP } from '../../utils/gsap'

/**
 * ==================== PracticaSection ====================
 * Sección "Práctica" (03) de la ruta de IA generativa — todavía sin
 * contenido real, pero con SU PROPIO diseño (no el mockup de chat de
 * Técnicas): acá se va a practicar configuración de herramientas y
 * generación de contenido en distintos formatos, así que el placeholder
 * es una grilla de 4 cards por tipo de contenido (texto/imagen/audio/
 * video) — anticipa la forma real que va a tener la sección en vez de
 * reusar el chat, que no tiene sentido para "practicar con herramientas".
 */

const TOOLS = [
    { id: 'texto', label: 'Texto', icon: FileText },
    { id: 'imagen', label: 'Imagen', icon: Image },
    { id: 'audio', label: 'Audio', icon: AudioLines },
    { id: 'video', label: 'Video', icon: Video },
]

const Badge = ({ children }) => (
    <span
        className="inline-flex w-fit items-center gap-1.5 text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full border text-zinc-500 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700 bg-white/60 dark:bg-zinc-800/60"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
        {children}
    </span>
)

const PracticaSection = () => {
    const sectionRef = useRef(null)
    const gridRef = useRef(null)
    const cardRefs = useRef(new Map())
    const registerCardRef = (id) => (el) => {
        if (el) cardRefs.current.set(id, el)
        else cardRefs.current.delete(id)
    }

    /** Mismo efecto "mini-card 3D" (rotationX + scale) que las cards de
     * aboutSection.jsx y conceptosBentoSection.jsx — un solo trigger con
     * stagger alcanza acá (4 cards, una sola fila en desktop, no varias
     * filas como el bento de Conceptos, así que no hace falta trigger
     * individual por card). */
    useGSAP(() => {
        gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
            const cards = Array.from(cardRefs.current.values())
            gsap.set(cards, { y: 40, opacity: 0, scale: 0.85, rotationX: 20, transformPerspective: 800 })
            gsap.timeline({
                scrollTrigger: { trigger: gridRef.current, start: 'top 85%', end: 'top 58%', scrub: 1 },
            }).to(cards, { y: 0, opacity: 1, scale: 1, rotationX: 0, ease: 'none', duration: 0.4, stagger: 0.12 })
        })
    }, { scope: sectionRef })

    return (
        <section
            ref={sectionRef}
            id="practicaSection"
            className="relative w-full bg-white dark:bg-zinc-950 py-16 md:py-24 px-4 md:px-8"
            style={{ scrollMarginTop: '24px' }}
        >
            <div className="max-w-2xl mx-auto flex flex-col items-center gap-4 text-center mb-12 md:mb-16">
                <span
                    className="font-mono text-sm tracking-widest text-cyan-600 dark:text-cyan-400"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                    03 — PRÁCTICA
                </span>
                <h2
                    className="text-zinc-800 dark:text-white tracking-wide"
                    style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(1.9rem, 4.2vw, 3rem)', fontWeight: 700, lineHeight: 1.15 }}
                >
                    Práctica guiada
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed" style={{ fontFamily: "'Sora', sans-serif" }}>
                    Configurar herramientas reales y usarlas para generar contenido — esta sección todavía está en construcción.
                </p>
            </div>

            <div ref={gridRef} className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
                {TOOLS.map((tool) => (
                    <div
                        key={tool.id}
                        ref={registerCardRef(tool.id)}
                        className="group relative rounded-[24px] overflow-hidden bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 shadow-sm hover:shadow-2xl hover:shadow-cyan-500/[0.08] hover:border-cyan-500/40 transition-all duration-300 p-5 md:p-7 flex flex-col items-center gap-3 text-center"
                    >
                        <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/10 dark:bg-cyan-400/10 text-cyan-600 dark:text-cyan-400 group-hover:scale-105 transition-transform duration-300">
                            <tool.icon size={22} strokeWidth={1.5} />
                        </span>
                        <span className="text-sm md:text-base font-bold text-zinc-800 dark:text-zinc-100" style={{ fontFamily: "'Orbitron', monospace" }}>
                            {tool.label}
                        </span>
                        <Badge>Próximamente</Badge>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default PracticaSection
