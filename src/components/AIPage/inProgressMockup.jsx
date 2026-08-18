import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import logo from '../../assets/landingPage/logo.png'

/**
 * ==================== InProgressMockup ====================
 * Shell reutilizable de "pestaña de navegador" (mismo mockup que se hizo
 * primero para TecnicasChat) para secciones de la ruta de IA generativa
 * que todavía no tienen contenido real — Técnicas, Práctica, Asistentes.
 * Centraliza el chrome visual (glow azul, pestaña, frame, sidebar,
 * scrollytelling del título y del mockup) para no repetirlo entero cada
 * vez; cada sección solo pasa su copy (eyebrow, título, ícono, mensaje).
 *
 * Cuando una de estas secciones tenga contenido real, deja de usar este
 * shell y arma su propio diseño (como ya pasó con Conceptos).
 */

const clamp01 = (n) => Math.min(1, Math.max(0, n))

/** Scrollytelling real: progreso continuo (0→1) según la posición del
 * elemento en el viewport, entregado en cada frame de scroll. */
const useScrollScrub = (targetRef, onProgress, { startFrac = 0.9, endFrac = 0.45 } = {}) => {
    useEffect(() => {
        const el = targetRef.current
        if (!el) return

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (reduceMotion) {
            onProgress(1)
            return
        }

        let ticking = false
        const compute = () => {
            ticking = false
            const vh = window.innerHeight
            const startY = vh * startFrac
            const endY = vh * endFrac
            const rect = el.getBoundingClientRect()
            const progress = clamp01((startY - rect.top) / (startY - endY))
            onProgress(progress)
        }
        const onScroll = () => {
            if (ticking) return
            ticking = true
            requestAnimationFrame(compute)
        }

        compute()
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onScroll)
        return () => {
            window.removeEventListener('scroll', onScroll)
            window.removeEventListener('resize', onScroll)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
}

/* ==== Hook: revelado por scroll (data-reveal) — CSS global (index.css)
   define [data-reveal="fade-up"] { opacity:0; transform:translateY(12px) }
   y [data-reveal].is-visible { opacity:1; transform:none }. Solo hace
   falta agregar la clase .is-visible acá — nunca pisar opacity/transform
   por inline style, GANA por especificidad y deja todo invisible. */
const useRevealOnScroll = (containerRef) => {
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const nodes = container.querySelectorAll('[data-reveal]')

        if (reduceMotion) {
            nodes.forEach((el) => el.classList.add('is-visible'))
            return
        }

        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible')
                        obs.unobserve(entry.target)
                    }
                })
            },
            { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
        )
        nodes.forEach((el) => observer.observe(el))
        return () => observer.disconnect()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
}

const SidebarIconButton = ({ icon: Icon, label, onClick, size = 16 }) => (
    <button
        onClick={onClick}
        className="group relative flex items-center justify-center w-9 h-9 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-zinc-900/[0.05] dark:hover:bg-white/[0.06] transition-colors duration-150"
        aria-label={label}
    >
        <Icon size={size} />
        <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-medium bg-zinc-800 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-800 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 shadow-lg z-30">
            {label}
        </span>
    </button>
)

const InProgressMockup = ({
    sectionId,
    eyebrow,
    title,
    titleDescription,
    tabIcon: TabIcon,
    tabLabel,
    bodyIcon: BodyIcon,
    bodyHeading,
    bodyDescription,
}) => {
    const navigate = useNavigate()
    const mainRef = useRef(null)

    useRevealOnScroll(mainRef)

    const titleBlockRef = useRef(null)
    const eyebrowRef = useRef(null)
    const titleH2Ref = useRef(null)
    const titleParaRef = useRef(null)

    useScrollScrub(titleBlockRef, (progress) => {
        if (eyebrowRef.current) {
            const p = clamp01(progress / 0.35)
            eyebrowRef.current.style.opacity = p
            eyebrowRef.current.style.transform = `translateX(${(1 - p) * -18}px)`
        }
        if (titleH2Ref.current) {
            const p = clamp01((progress - 0.12) / 0.55)
            titleH2Ref.current.style.opacity = p
            titleH2Ref.current.style.clipPath = `inset(0 ${(1 - p) * 100}% 0 0)`
            titleH2Ref.current.style.filter = `blur(${(1 - p) * 6}px)`
        }
        if (titleParaRef.current) {
            const p = clamp01((progress - 0.5) / 0.5)
            titleParaRef.current.style.opacity = p
            titleParaRef.current.style.transform = `translateY(${(1 - p) * 14}px)`
        }
    }, { startFrac: 0.92, endFrac: 0.58 })

    const frameWrapRef = useRef(null)
    useScrollScrub(frameWrapRef, (progress) => {
        const el = frameWrapRef.current
        if (!el) return
        el.style.opacity = progress
        el.style.transform = `translateY(${(1 - progress) * 64}px) scale(${0.92 + progress * 0.08}) rotateX(${(1 - progress) * 7}deg)`
    }, { startFrac: 0.95, endFrac: 0.42 })

    const goToContact = () => navigate('/#contactSection')

    return (
        <section id={sectionId} className="relative w-full bg-white dark:bg-zinc-950 py-16 md:py-20 px-4 md:px-10" style={{ scrollMarginTop: '24px' }}>
            <div className="max-w-[1200px] mx-auto" style={{ perspective: '1400px' }}>
                <div className="mb-8 md:mb-10" ref={titleBlockRef}>
                    <span
                        ref={eyebrowRef}
                        className="inline-block font-mono text-xs tracking-widest text-cyan-600 dark:text-cyan-400 mb-1"
                        style={{ opacity: 0, transition: 'opacity 150ms linear, transform 150ms linear', willChange: 'opacity, transform' }}
                    >
                        {eyebrow}
                    </span>
                    <h2
                        ref={titleH2Ref}
                        style={{
                            fontFamily: "'Orbitron', monospace",
                            opacity: 0,
                            clipPath: 'inset(0 100% 0 0)',
                            filter: 'blur(6px)',
                            transition: 'opacity 180ms linear, clip-path 180ms linear, filter 180ms linear',
                            willChange: 'opacity, clip-path, filter',
                        }}
                        className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-800 dark:text-zinc-100 leading-tight tracking-tight"
                    >
                        {title}
                    </h2>
                    <p
                        ref={titleParaRef}
                        className="mt-3 text-sm md:text-base text-zinc-500 dark:text-zinc-400 max-w-2xl"
                        style={{ opacity: 0, transition: 'opacity 150ms linear, transform 150ms linear', willChange: 'opacity, transform' }}
                    >
                        {titleDescription}
                    </p>
                </div>

                <div
                    ref={frameWrapRef}
                    className="relative w-full flex flex-col isolate"
                    style={{
                        height: 'min(560px, 70vh)',
                        opacity: 0,
                        transformStyle: 'preserve-3d',
                        transition: 'opacity 150ms linear, transform 150ms linear',
                        willChange: 'opacity, transform',
                    }}
                >
                    <div
                        className="absolute -inset-x-20 -top-12 h-[460px] -z-10 opacity-90 dark:opacity-75 pointer-events-none"
                        style={{
                            background:
                                'radial-gradient(42% 60% at 25% 45%, rgba(6,182,212,0.65), transparent 70%), radial-gradient(46% 65% at 75% 50%, rgba(37,99,235,0.6), transparent 70%), radial-gradient(50% 55% at 50% 90%, rgba(14,165,233,0.5), transparent 70%)',
                        }}
                        aria-hidden="true"
                    />

                    <div className="absolute -bottom-px left-0 right-0 h-2 overflow-hidden [mask-image:linear-gradient(to_right,rgba(217,217,217,0)_0%,#d9d9d9_15%,#d9d9d9_85%,rgba(217,217,217,0)_100%)] z-20 pointer-events-none">
                        <div className="absolute bottom-0 h-px w-32 sm:w-48 md:w-64 animate-chat-streak-left bg-gradient-to-r from-zinc-800/0 via-zinc-800 to-zinc-800/0 dark:from-cyan-400/0 dark:via-cyan-400 dark:to-cyan-400/0" />
                    </div>

                    <div className="relative z-10 flex items-end h-10 shrink-0">
                        <div
                            className="relative flex items-center gap-2 px-3 sm:px-4 h-10 rounded-t-[10px] shrink-0 bg-zinc-200/85 dark:bg-zinc-900/80 backdrop-blur-xl backdrop-saturate-150"
                            style={{ width: 'min(60%, 240px)' }}
                        >
                            <TabIcon size={13} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
                            <span className="text-[13px] font-semibold text-zinc-700 dark:text-zinc-200 shrink-0" style={{ fontFamily: "'Sora', sans-serif" }}>
                                {tabLabel}
                            </span>

                            <span className="absolute bottom-0 -right-6 w-6 h-10 overflow-hidden pointer-events-none" aria-hidden="true">
                                <span className="absolute left-0 bottom-0 w-12 h-12 rounded-full shadow-[-24px_24px_0_0_rgba(228,228,231,0.85)] dark:shadow-[-24px_24px_0_0_rgba(24,24,27,0.8)]" />
                            </span>
                        </div>
                    </div>

                    <div className="mockup-frame relative z-10 w-full flex-1 min-h-0 rounded-b-2xl rounded-tr-2xl overflow-hidden shadow-[0_30px_70px_-20px_rgba(0,0,0,0.3)] dark:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)] bg-zinc-200/85 dark:bg-zinc-900/80 backdrop-blur-xl backdrop-saturate-150 flex flex-col">
                        <div className="shell flex-1 min-h-0 w-full flex flex-col min-[881px]:flex-row">

                            <aside className="sidebar hidden min-[881px]:flex flex-col items-center h-full w-[64px] shrink-0 py-3">
                                <div className="flex items-center justify-center h-8 w-full mb-1">
                                    <img src={logo} alt="Logo AlejoCode" className="w-6 h-6 object-contain shrink-0" />
                                </div>

                                <SidebarIconButton icon={ArrowLeft} label="Volver al portafolio" onClick={() => navigate('/')} />

                                <div className="w-6 border-t border-zinc-200 dark:border-zinc-800/80 my-2" />

                                <div className="flex-1" />

                                <SidebarIconButton icon={MessageCircle} label="¿Hablamos de tu proyecto?" onClick={goToContact} />
                            </aside>

                            <div className="min-[881px]:hidden shrink-0 flex items-center justify-between px-3 py-2 border-b border-zinc-200 dark:border-zinc-800/80">
                                <button onClick={() => navigate('/')} className="shrink-0 p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-900/[0.05] dark:hover:bg-white/[0.06]" aria-label="Volver al portafolio">
                                    <ArrowLeft size={16} />
                                </button>
                                <button onClick={goToContact} className="shrink-0 p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-900/[0.05] dark:hover:bg-white/[0.06]" aria-label="¿Hablamos de tu proyecto?">
                                    <MessageCircle size={16} />
                                </button>
                            </div>

                            <div className="relative flex-1 min-h-0 min-w-0 pl-2 min-[881px]:pl-1 pr-2.5 min-[881px]:pr-3.5 pb-2.5 min-[881px]:pb-3.5 pt-2 min-[881px]:pt-3.5">
                                <div className="relative h-full w-full rounded-2xl overflow-hidden bg-white/90 dark:bg-zinc-950/85 backdrop-blur-xl backdrop-saturate-150">
                                    <main ref={mainRef} className="relative h-full w-full flex items-center justify-center px-6">
                                        <div className="max-w-[440px] mx-auto flex flex-col items-center text-center gap-4">
                                            <span data-reveal="fade-up" className="flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 dark:bg-cyan-400/10 text-cyan-600 dark:text-cyan-400">
                                                <BodyIcon size={24} strokeWidth={1.5} />
                                            </span>
                                            <span
                                                data-reveal="fade-up"
                                                style={{ fontFamily: "'JetBrains Mono', monospace", transitionDelay: '80ms' }}
                                                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] bg-blue-500/10 border border-blue-500/25 text-blue-600 dark:text-blue-400"
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                                En construcción
                                            </span>
                                            <h1
                                                data-reveal="fade-up"
                                                style={{ fontFamily: "'Sora', sans-serif", fontSize: 'clamp(20px, 2.4vw, 26px)', transitionDelay: '140ms' }}
                                                className="font-bold text-zinc-800 dark:text-zinc-50"
                                            >
                                                {bodyHeading}
                                            </h1>
                                            <p
                                                data-reveal="fade-up"
                                                style={{ transitionDelay: '200ms' }}
                                                className="text-[14.5px] leading-relaxed text-zinc-600 dark:text-zinc-300"
                                            >
                                                {bodyDescription}
                                            </p>
                                        </div>
                                    </main>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default InProgressMockup
