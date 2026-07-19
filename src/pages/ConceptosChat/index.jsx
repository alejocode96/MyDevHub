import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageCircle, Sparkles } from 'lucide-react'
import { ARTICLES } from './data'
import logo from '../../assets/landingPage/logo.png'

/* Flechita del <select> como background-image (en vez de un ícono de lucide
   superpuesto) — mismo truco que los selects del panel admin de referencia,
   con el color de acento cyan del sitio en vez del gris/oliva del original. */
const SELECT_CHEVRON = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2306b6d4' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`

/**
 * ==================== ConceptosChat — shell estructural ====================
 * Interfaz tipo chat (Claude/ChatGPT), presentada dentro de un contenedor
 * "pestaña de navegador" (tab arriba-izquierda + cuerpo con esquina superior
 * izquierda recta donde se conecta la pestaña). El sidebar es AHORA
 * netamente decorativo — solo íconos fijos, sin hover, sin acordeón, sin
 * click-to-navigate. La navegación entre los 14 conceptos vive en un
 * <select> nativo dentro de la pestaña (con <optgroup> por artículo).
 *
 * ---- Paleta (tokens ya usados en el resto del sitio, mapeados a roles) ----
 *   fondo general (body/sección) → bg-white dark:bg-zinc-950
 *   fondo pestaña + frame + sidebar → zinc-100/60 dark:zinc-900/60 (glass,
 *                                 backdrop-blur, deja ver el glow azul detrás)
 *   fondo del panel de chat    → bg-white dark:bg-zinc-950 — MISMO tono que
 *                                 el fondo general (no el del frame), para
 *                                 reproducir en oscuro la misma relación de
 *                                 contraste que en claro (frame=zinc-100 es
 *                                 el tono "distinto" entre dos zonas blancas;
 *                                 en oscuro, frame=zinc-900 es el tono
 *                                 "distinto" entre dos zonas zinc-950).
 *   acento primario             → cyan-500 / cyan-400
 *   acento secundario           → blue-600 / blue-400
 *   texto primario               → zinc-800 / zinc-50
 *   texto secundario/muted       → zinc-500 / zinc-400
 *   borde sutil                   → zinc-200 / zinc-800/80
 *
 * ---- Mecanismo (documentado aquí para que la siguiente pasada lo respete) ----
 *   1. Cada tema es un "turno": <div id="cN" className="turn"> con burbuja
 *      de usuario + burbuja de asistente (avatar 28x28 + contenido).
 *      Cualquier hijo puede llevar data-reveal="fade-up|scale-in|slide-left
 *      |pulse" + transitionDelay inline para el stagger.
 *   2. Un IntersectionObserver agrega `.is-visible` a cada [data-reveal] la
 *      primera vez que entra en viewport (useRevealOnScroll). Con
 *      prefers-reduced-motion, se marcan todos visibles de inmediato.
 *   3. Un segundo IntersectionObserver (rootMargin '-20% 0px -70% 0px')
 *      vigila cada .turn y actualiza `activeItemId` — se usa para: (a) el
 *      valor seleccionado del <select>, y (b) el resaltado pasivo del
 *      ícono de artículo correspondiente en el sidebar decorativo.
 *   4. Elegir una opción en el <select> → scrollIntoView({block:'start'})
 *      sobre el .turn correspondiente, dentro de .main-chat.
 *   5. El indicador de "escribiendo" (3 puntos) solo en el PRIMER turno.
 *   6. El sidebar NO tiene estado propio: es una lista fija de íconos
 *      (logo, volver, 4 artículos decorativos, contacto). Solo "volver" y
 *      "contacto" son interactivos (navegación real); los 4 íconos de
 *      artículo son <span> sin onClick, puramente ilustrativos.
 */

const clamp01 = (n) => Math.min(1, Math.max(0, n))

/**
 * @hook useScrollScrub
 *
 * Scrollytelling real: a diferencia de useScrollReveal (dispara UNA vez al
 * entrar, con IntersectionObserver + transición CSS de duración fija), este
 * hook calcula un PROGRESO continuo (0→1) a partir de la posición real del
 * elemento en el viewport, y lo entrega en cada frame de scroll vía un
 * callback — la animación avanza y retrocede exactamente en sync con el
 * scroll (si el usuario sube, se revierte), en vez de dispararse una sola
 * vez y listo.
 *
 * progress = 0 cuando el top del elemento está en `startFrac` del alto del
 * viewport; progress = 1 cuando llega a `endFrac`. Fuera de ese rango queda
 * clamped a 0 o 1.
 *
 * Muta estilos DIRECTO en el DOM vía refs dentro del callback (no setState)
 * para no re-renderizar el árbol completo en cada tick de scroll.
 *
 * @param {React.RefObject} targetRef  — elemento cuya posición se mide
 * @param {(progress: number) => void} onProgress — corre en cada frame de scroll
 * @param {{ startFrac?: number, endFrac?: number }} options
 */
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

/* ==================== Hook: revelado por scroll (data-reveal) ==================== */
const useRevealOnScroll = (containerRef, deps = []) => {
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
    }, deps)
}

/* ==================== Sub-componentes visuales (chat) ==================== */

const TypingIndicator = () => (
    <div className="flex items-center gap-2 mb-4 text-zinc-400 dark:text-zinc-600" aria-hidden="true">
        <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
            ))}
        </div>
        <span className="text-xs">Preparando el recorrido…</span>
    </div>
)

const UserBubble = ({ text }) => (
    <div className="flex justify-end mb-3" data-reveal="fade-up">
        <div className="max-w-[80%] rounded-3xl rounded-tr-md px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 text-[14px] leading-relaxed shadow-sm">
            {text}
        </div>
    </div>
)

const AssistantAvatar = () => (
    <div className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-sm">
        <Sparkles size={13} className="text-white" strokeWidth={2.5} />
    </div>
)

const AssistantBubble = ({ item, delay = 0 }) => {
    const Icon = item.icon
    return (
        <div className="flex items-start gap-2.5" data-reveal="fade-up" style={{ transitionDelay: `${delay}ms` }}>
            <AssistantAvatar />
            <div className="max-w-[80%] rounded-3xl rounded-tl-md px-4 py-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-500/10 dark:bg-cyan-400/10 text-cyan-600 dark:text-cyan-400 shrink-0">
                        <Icon size={15} strokeWidth={2} />
                    </span>
                    <span className="text-[13px] font-semibold text-zinc-700 dark:text-zinc-200">{item.title}</span>
                </div>
                <p className="text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                    Contenido de ejemplo — este bloque se reemplazará con la
                    explicación real de <strong className="text-zinc-800 dark:text-zinc-100">“{item.title}”</strong> en
                    la siguiente iteración.
                </p>
            </div>
        </div>
    )
}

/* Ícono del sidebar con tooltip propio (en vez de depender del title nativo
   del navegador, que aparece tarde y sin estilo) — un tag que se desliza
   desde el ícono al hacer hover, mostrando qué hace la acción. */
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

const ArticleDivider = ({ article, index }) => {
    const Icon = article.icon
    return (
        <div className="flex items-start gap-2.5 mb-6 mt-2" data-reveal="fade-up">
            <span className="shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-blue-500/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400">
                <Icon size={15} strokeWidth={2} />
            </span>
            <div>
                <p className="text-[11px] uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    Artículo {index + 1}
                </p>
                <h2 className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-100 mb-1.5">{article.label}</h2>
                {article.why && (
                    <p className="text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400 max-w-[520px]">{article.why}</p>
                )}
            </div>
        </div>
    )
}

/* ==================== Página principal ==================== */
const ConceptosChat = () => {
    const navigate = useNavigate()

    const [activeItemId, setActiveItemId] = useState(null)

    const mainChatRef = useRef(null)
    const turnRefs = useRef({})

    useRevealOnScroll(mainChatRef)

    /** Scrollytelling del título: un solo progreso (0→1) calculado sobre el
     *  bloque completo, repartido en sub-rangos por elemento para que el
     *  eyebrow, el h2 (wipe con blur) y el párrafo se vayan revelando en
     *  cascada A MEDIDA que se hace scroll — no de una vez. */
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

    /** Scrollytelling del mockup: un único progreso mueve/escala/inclina y
     *  desvanece TODO el bloque (pestaña + frame + glow) como una sola
     *  pieza que "aterriza" — traslada desde abajo, escala desde 0.9 y
     *  endereza una inclinación 3D (rotateX) a medida que se asienta. */
    const frameWrapRef = useRef(null)

    useScrollScrub(frameWrapRef, (progress) => {
        const el = frameWrapRef.current
        if (!el) return
        el.style.opacity = progress
        el.style.transform = `translateY(${(1 - progress) * 64}px) scale(${0.92 + progress * 0.08}) rotateX(${(1 - progress) * 7}deg)`
    }, { startFrac: 0.95, endFrac: 0.42 })

    /** Sincroniza `activeItemId` con el turno más visible — alimenta el
     *  valor del <select> y el resaltado pasivo del ícono de artículo. */
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveItemId(entry.target.id)
                })
            },
            { root: mainChatRef.current, rootMargin: '-20% 0px -70% 0px', threshold: 0 }
        )

        ARTICLES.forEach((article) => {
            article.items.forEach((item) => {
                const node = turnRefs.current[item.id]
                if (node) observer.observe(node)
            })
        })

        return () => observer.disconnect()
    }, [])

    const activeArticleId = useMemo(() => {
        const found = ARTICLES.find((article) => article.items.some((item) => item.id === activeItemId))
        return found?.id ?? null
    }, [activeItemId])

    const scrollToTurn = (id) => {
        turnRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const goToContact = () => navigate('/#contactSection')

    const NavSelect = ({ className = '' }) => (
        <select
            value={activeItemId ?? ''}
            onChange={(e) => scrollToTurn(e.target.value)}
            className={`h-7 min-w-0 rounded-lg text-[12px] font-medium outline-none cursor-pointer border border-zinc-200/80 dark:border-zinc-700/70 bg-white/70 dark:bg-zinc-800/70 text-zinc-700 dark:text-zinc-200 transition-colors duration-150 focus:border-cyan-500 dark:focus:border-cyan-400 focus:bg-white dark:focus:bg-zinc-800 ${className}`}
            style={{
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                backgroundImage: SELECT_CHEVRON,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 8px center',
                paddingLeft: 10,
                paddingRight: 26,
            }}
            aria-label="Ir a un concepto"
        >
            <option value="" disabled>Ir a un concepto…</option>
            {ARTICLES.flatMap((article) => article.items)
                .sort((a, b) => a.num - b.num)
                .map((item) => (
                    <option key={item.id} value={item.id}>
                        {String(item.num).padStart(2, '0')} — {item.title}
                    </option>
                ))}
        </select>
    )

    return (
        <section id="conceptosSection" className="relative w-full bg-white dark:bg-zinc-950 py-16 md:py-20 px-4 md:px-10" style={{ scrollMarginTop: '24px' }}>
            <div className="max-w-[1200px] mx-auto" style={{ perspective: '1400px' }}>
                {/* ==================== Título — scrollytelling: eyebrow, h2 (wipe+blur)
                    y párrafo se revelan en cascada según el progreso de scroll real
                    del bloque, no con un fade disparado una sola vez. Ver
                    useScrollScrub más arriba. ==================== */}
                <div className="mb-8 md:mb-10" ref={titleBlockRef}>
                    <span
                        ref={eyebrowRef}
                        className="inline-block font-mono text-xs tracking-widest text-cyan-600 dark:text-cyan-400 mb-1"
                        style={{ opacity: 0, transition: 'opacity 150ms linear, transform 150ms linear', willChange: 'opacity, transform' }}
                    >
                        01 — CONCEPTOS
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
                        Antes de escribir tu primer prompt: el abecé real de la IA
                    </h2>
                    <p
                        ref={titleParaRef}
                        className="mt-3 text-sm md:text-base text-zinc-500 dark:text-zinc-400 max-w-2xl"
                        style={{ opacity: 0, transition: 'opacity 150ms linear, transform 150ms linear', willChange: 'opacity, transform' }}
                    >
                        Los conceptos que separan a quien usa IA por intuición de quien la usa con criterio.
                    </p>
                </div>

                {/* ==================== Contenedor "pestaña de navegador" ====================
                    Wrapper exterior NO recorta overflow, para que el glow azul y las
                    líneas de luz de los bordes no se corten. Es flex-col: la pestaña
                    arriba + el cuerpo (frame) abajo, ocupando el resto del alto.

                    Scrollytelling: todo el bloque (pestaña + frame + glow) es UNA
                    sola pieza que "aterriza" con el scroll — traslada desde abajo,
                    escala desde 0.92 y endereza una inclinación 3D, con opacidad
                    atada al mismo progreso (por eso el glow, que es hijo, se
                    desvanece junto con el resto sin necesitar su propio cálculo). */}
                {/* isolate: crea un contexto de apilamiento propio para este
                    bloque — sin esto, el z-index negativo del glow "se escapa"
                    hacia arriba y termina pintándose detrás del propio
                    background-color de la <section>, quedando invisible aunque
                    su geometría y color sean correctos (confirmado forzando
                    z-index:999 sobre el mismo degradado: se ve perfecto). */}
                <div
                    ref={frameWrapRef}
                    className="relative w-full flex flex-col isolate"
                    style={{
                        height: 'min(760px, 84vh)',
                        opacity: 0,
                        transformStyle: 'preserve-3d',
                        transition: 'opacity 150ms linear, transform 150ms linear',
                        willChange: 'opacity, transform',
                    }}
                >
                    {/* sombra azul difusa — SOLO arriba (donde está la pestaña tipo
                        navegador). Notoria en ambos temas — en claro necesita más
                        intensidad que en oscuro para leerse igual de fuerte (un
                        mismo alpha se percibe más pálido sobre fondo blanco que
                        sobre fondo casi negro). Sin filter:blur (blur + overflow-
                        hidden sobre la misma caja diluye el color hasta volverlo
                        invisible; la suavidad viene solo de los "transparent 70%"
                        del degradado). */}
                    <div
                        className="absolute -inset-x-20 -top-12 h-[460px] -z-10 opacity-90 dark:opacity-75 pointer-events-none"
                        style={{
                            background:
                                'radial-gradient(42% 60% at 25% 45%, rgba(6,182,212,0.65), transparent 70%), radial-gradient(46% 65% at 75% 50%, rgba(37,99,235,0.6), transparent 70%), radial-gradient(50% 55% at 50% 90%, rgba(14,165,233,0.5), transparent 70%)',
                        }}
                        aria-hidden="true"
                    />

                    {/* luz que recorre el borde — SOLO abajo, recorrido completo
                        (borde a borde), trazo angosto, lento. Vive FUERA del frame
                        recortado para no cortarse contra su overflow-hidden. */}
                    <div className="absolute -bottom-px left-0 right-0 h-2 overflow-hidden [mask-image:linear-gradient(to_right,rgba(217,217,217,0)_0%,#d9d9d9_15%,#d9d9d9_85%,rgba(217,217,217,0)_100%)] z-20 pointer-events-none">
                        <div className="absolute bottom-0 h-px w-32 sm:w-48 md:w-64 animate-chat-streak-left bg-gradient-to-r from-zinc-800/0 via-zinc-800 to-zinc-800/0 dark:from-cyan-400/0 dark:via-cyan-400 dark:to-cyan-400/0" />
                    </div>

                    {/* ==================== Pestaña (tab) ==================== */}
                    <div className="relative z-10 flex items-end h-10 shrink-0">
                        <div
                            className="relative flex items-center gap-2 px-3 sm:px-4 h-10 rounded-t-[10px] shrink-0 bg-zinc-200/85 dark:bg-zinc-900/80 backdrop-blur-xl backdrop-saturate-150"
                            style={{ width: 'min(80%, 420px)' }}
                        >
                            <Sparkles size={13} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
                            <span className="hidden sm:inline text-[13px] font-semibold text-zinc-700 dark:text-zinc-200 shrink-0" style={{ fontFamily: "'Sora', sans-serif" }}>
                                Conceptos
                            </span>
                            <div className="w-px h-4 bg-zinc-300/70 dark:bg-zinc-700/70 shrink-0" />
                            <NavSelect className="flex-1" />

                            {/* "oreja" que conecta la pestaña con el cuerpo, mismo truco
                                que el chrome-tab de referencia (círculo vía box-shadow) */}
                            <span className="absolute bottom-0 -right-6 w-6 h-10 overflow-hidden pointer-events-none" aria-hidden="true">
                                <span className="absolute left-0 bottom-0 w-12 h-12 rounded-full shadow-[-24px_24px_0_0_rgba(228,228,231,0.85)] dark:shadow-[-24px_24px_0_0_rgba(24,24,27,0.8)]" />
                            </span>
                        </div>
                    </div>

                    {/* ==================== Cuerpo (frame) ====================
                        SIN borde propio a propósito: el borde de la pestaña +
                        la "oreja" ya trazan el contorno completo de la silueta.
                        Si el cuerpo también llevara borde, la costura entre
                        pestaña y cuerpo se ve como una línea suelta y rompe la
                        forma unificada. */}
                    <div
                        className="mockup-frame relative z-10 w-full flex-1 min-h-0 rounded-b-2xl rounded-tr-2xl overflow-hidden shadow-[0_30px_70px_-20px_rgba(0,0,0,0.3)] dark:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)] bg-zinc-200/85 dark:bg-zinc-900/80 backdrop-blur-xl backdrop-saturate-150 flex flex-col"
                    >
                        <div className="shell flex-1 min-h-0 w-full flex flex-col min-[881px]:flex-row">

                            {/* ==================== SIDEBAR (desktop: netamente decorativo) ==================== */}
                            <aside className="sidebar hidden min-[881px]:flex flex-col items-center h-full w-[64px] shrink-0 py-3">
                                <div className="flex items-center justify-center h-8 w-full mb-1">
                                    <img src={logo} alt="Logo AlejoCode" className="w-6 h-6 object-contain shrink-0" />
                                </div>

                                <SidebarIconButton icon={ArrowLeft} label="Volver al portafolio" onClick={() => navigate('/')} />

                                <div className="w-6 border-t border-zinc-200 dark:border-zinc-800/80 my-2" />

                                {/* íconos de artículo — puramente ilustrativos, sin onClick;
                                    la navegación real vive en el <select> de la pestaña. */}
                                <div className="flex flex-col items-center gap-1.5 flex-1">
                                    {ARTICLES.map((article) => {
                                        const Icon = article.icon
                                        const isActive = article.id === activeArticleId
                                        return (
                                            <span
                                                key={article.id}
                                                title={article.label}
                                                className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-300 ${isActive ? 'bg-cyan-500/[0.14] text-cyan-600 dark:text-cyan-400' : 'text-zinc-400 dark:text-zinc-600'
                                                    }`}
                                            >
                                                <Icon size={17} />
                                            </span>
                                        )
                                    })}
                                </div>

                                <SidebarIconButton icon={MessageCircle} label="¿Hablamos de tu proyecto?" onClick={goToContact} />
                            </aside>

                            {/* ==================== Barra mobile: volver + contacto ==================== */}
                            <div className="min-[881px]:hidden shrink-0 flex items-center justify-between px-3 py-2 border-b border-zinc-200 dark:border-zinc-800/80">
                                <button onClick={() => navigate('/')} className="shrink-0 p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-900/[0.05] dark:hover:bg-white/[0.06]" aria-label="Volver al portafolio">
                                    <ArrowLeft size={16} />
                                </button>
                                <button onClick={goToContact} className="shrink-0 p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-900/[0.05] dark:hover:bg-white/[0.06]" aria-label="¿Hablamos de tu proyecto?">
                                    <MessageCircle size={16} />
                                </button>
                            </div>

                            {/* ==================== PANEL DE CHAT — card inset, flota
                                sobre el frame dejando un margen muy corto ==================== */}
                            <div className="relative flex-1 min-h-0 min-w-0 pl-2 min-[881px]:pl-1 pr-2.5 min-[881px]:pr-3.5 pb-2.5 min-[881px]:pb-3.5 pt-2 min-[881px]:pt-3.5">
                                {/* card visual: bordes redondeados + overflow-hidden vive AQUÍ
                                    (no en <main>), así el scrollbar nativo/custom queda
                                    recortado limpiamente contra la esquina redondeada en vez
                                    de "salirse" de la curva. Mismo blur que la pestaña/frame,
                                    sin borde duro (para no crear un corte lineal). En claro,
                                    blanco de verdad (el frame ahora es gris zinc-200, así
                                    contrastan); en oscuro, un punto más oscuro que el frame
                                    (zinc-950 en vez de zinc-900) para distinguir el área de
                                    contenido del "marco" que la rodea. */}
                                <div className="relative h-full w-full rounded-2xl overflow-hidden bg-white/90 dark:bg-zinc-950/85 backdrop-blur-xl backdrop-saturate-150">
                                    <main
                                        ref={mainChatRef}
                                        className="main-chat custom-scroll relative h-full w-full overflow-y-auto"
                                        style={{ scrollBehavior: 'smooth' }}
                                    >
                                        <div className="max-w-[720px] mx-auto px-[18px] min-[881px]:px-8 pt-8 min-[881px]:pt-12 pb-[120px]">
                                            <div className="block-heading mb-8">
                                                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 mb-3 text-[11px] bg-blue-500/10 border border-blue-500/25 text-blue-600 dark:text-blue-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                    El abecé de la IA
                                                </span>
                                                <h1 className="font-bold text-zinc-800 dark:text-zinc-50" style={{ fontFamily: "'Sora', sans-serif", fontSize: 'clamp(22px, 2.6vw, 28px)' }}>
                                                    El abecé real de la IA, explicado paso a paso
                                                </h1>
                                            </div>

                                            {ARTICLES.map((article, ai) => (
                                                <React.Fragment key={article.id}>
                                                    <ArticleDivider article={article} index={ai} />
                                                    {article.items.map((item, i) => (
                                                        <div key={item.id} id={item.id} ref={(el) => { turnRefs.current[item.id] = el }} className="turn scroll-mt-8 mb-10">
                                                            {ai === 0 && i === 0 && <TypingIndicator />}
                                                            <UserBubble text={item.title} />
                                                            <AssistantBubble item={item} delay={120} />
                                                        </div>
                                                    ))}
                                                </React.Fragment>
                                            ))}

                                            {/* CTA de contacto — solo visible en mobile, al final del flujo */}
                                            <div className="min-[881px]:hidden mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800/80">
                                                <button onClick={goToContact} className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200">
                                                    ¿Hablamos de tu proyecto?
                                                </button>
                                            </div>
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

export default ConceptosChat
