import React, { useRef } from 'react'
import { Brain, MessageSquareText, Gauge, CircleDollarSign, Workflow, ShieldCheck, ArrowUpRight } from 'lucide-react'
import { gsap, useGSAP, responsiveMotion } from '../../utils/gsap'

/**
 * ==================== ConceptosBentoSection ====================
 * Sección debajo del Hero de IA generativa: a la izquierda el
 * "landing spot" — #neuron-landing-spot — donde la neurona animada del
 * Hero aterriza al final de su scroll (ver heroAiSection.jsx, que mide
 * este elemento por id para calcular la posición/tamaño final del
 * vuelo); a la derecha el título, la etiqueta y el párrafo de
 * descripción. Debajo de ambos, la grilla de 6 cards (bento asimétrico,
 * CSS Grid) con los 14 conceptos agrupados en 6 bloques temáticos — los
 * "Temas" de cada card se muestran como tags (no como lista), para que
 * las cards con muchos temas (ej. card 2, 8 temas) no se disparen de
 * alto. Cada card tiene su propio reveal 3D (rotationX + scale, ver
 * useGSAP) — mismo efecto que las cards de aboutSection.jsx.
 *
 * El id de la sección (conceptosSection) se mantiene igual al que usaba
 * la página de Conceptos anterior para no romper el link "Conceptos"
 * del menú del Hero.
 */

const CARD_SHELL =
    'group relative rounded-[24px] overflow-hidden bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 shadow-sm hover:shadow-2xl hover:shadow-cyan-500/[0.08] hover:border-cyan-500/40 transition-all duration-300 p-6 md:p-8 flex flex-col gap-4'

const Badge = ({ children }) => (
    <span
        className="inline-flex w-fit items-center gap-1.5 text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full border text-zinc-500 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700 bg-white/60 dark:bg-zinc-800/60"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
        {children}
    </span>
)

const Tag = ({ children }) => (
    <span className="inline-flex items-center text-[11px] leading-none font-medium px-2.5 py-1.5 rounded-full bg-cyan-500/[0.08] dark:bg-cyan-400/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/15 dark:border-cyan-400/20">
        {children}
    </span>
)

// Spans sobre una grilla de 12 columnas — 5/7, 7/5, 6/6 por fila: la
// diferencia entre la card angosta y la ancha de cada par es solo de
// ~17 puntos (42% vs 58%), no una diferencia grande tipo 70/30, así el
// contenido de NINGUNA card queda apretado. Igual ninguna fila repite
// la disposición de la anterior (antes con 2/4 el salto era 33 vs 67%,
// demasiado — cards angostas quedaban muy chicas).
const cards = [
    {
        id: 1, num: '01', icon: Brain, span: 'sm:col-span-5',
        title: 'Fundamentos de la IA',
        description: 'La base antes de todo lo demás: qué es realmente la IA, de qué está hecha, sus cuatro grandes ramas, y la diferencia entre una IA que predice y una que crea.',
        topics: ['¿Qué es la Inteligencia Artificial?', 'Los pilares de la IA', 'Las cuatro disciplinas de la IA', 'IA predictiva vs. IA generativa'],
    },
    {
        id: 2, num: '02', icon: MessageSquareText, span: 'sm:col-span-7',
        title: 'Cómo las máquinas entienden el lenguaje',
        description: 'El recorrido completo que hace un texto desde que lo escribís hasta que un modelo lo "entiende" — tokens, vectores, embeddings y la arquitectura que hace posible que mantenga una conversación coherente.',
        topics: ['Cómo las máquinas representan el lenguaje', '¿Qué es un token?', '¿Qué es un vector?', 'Embeddings', 'Espacio vectorial y similitud', 'Búsqueda semántica y RAG', 'NLP y modelos de lenguaje', 'Arquitectura de los LLM'],
    },
    {
        id: 3, num: '03', icon: Gauge, span: 'sm:col-span-7',
        title: 'Cómo se comporta un modelo al generar',
        description: 'Los parámetros y límites que explican por qué un modelo a veces "olvida" cosas, por qué a veces es predecible y otras veces creativo, y por qué a veces inventa información con total seguridad.',
        topics: ['Ventana de contexto', 'Temperatura y top-p', 'Alucinaciones'],
    },
    {
        id: 4, num: '04', icon: CircleDollarSign, span: 'sm:col-span-5',
        title: 'Costos, personalización y datos reales',
        description: 'Cómo se paga realmente usar IA, las distintas formas de conectarla a tu propia información, y cuándo conviene personalizar un modelo en vez de solo darle mejores instrucciones.',
        topics: ['Costos por tokens', 'RAG en profundidad', 'Fine-tuning vs. Prompting vs. RAG'],
    },
    {
        id: 5, num: '05', icon: Workflow, span: 'sm:col-span-6',
        title: 'De conversar a actuar',
        description: 'El salto de una IA que solo responde preguntas a una que ejecuta tareas por su cuenta — y cómo ya no se limita a texto, sino que también ve, escucha y genera imagen, audio y video.',
        topics: ['Asistentes vs. Agentes', 'Modelos multimodales', 'Análisis vs. generación de imágenes, audio y video'],
    },
    {
        id: 6, num: '06', icon: ShieldCheck, span: 'sm:col-span-6',
        title: 'Pensamiento crítico',
        description: 'Para cerrar: por qué ninguna IA es tan neutral como parece, de dónde vienen sus sesgos, y cómo detectarlos antes de confiar ciegamente en una respuesta.',
        topics: ['Sesgos (bias)'],
    },
]

const ConceptCard = ({ card, innerRef }) => (
    <div ref={innerRef} className={`${CARD_SHELL} ${card.span} min-h-[180px]`}>
        <div className="flex items-start justify-between gap-3">
            {/* Título pegado al badge del número (misma fila) en vez de en
                su propia línea — ahorra alto para que la card no crezca de
                más aunque tenga descripción + tags + botón. */}
            <div className="flex items-center gap-2.5 min-w-0">
                <Badge>{card.num}</Badge>
                <h3
                    className="text-base md:text-lg font-bold text-zinc-800 dark:text-zinc-100 leading-snug"
                    style={{ fontFamily: "'Orbitron', monospace" }}
                >
                    {card.title}
                </h3>
            </div>
            <card.icon size={18} strokeWidth={1.5} className="shrink-0 text-zinc-400 dark:text-zinc-600 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors duration-300" />
        </div>
        <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400" style={{ fontFamily: "'Inter', sans-serif" }}>
            {card.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
            {card.topics.map((topic) => (
                <Tag key={topic}>{topic}</Tag>
            ))}
        </div>
        {/* Ver más — mismo estilo de botón sólido que las CTA de las cards
            de servicios (myServicesSection.jsx), no un link de texto (se
            confundía con un tag más). Todavía no hay una página de
            detalle por concepto (se borró la vieja página de Conceptos
            con ese contenido), así que por ahora no redirige a ningún
            lado real; queda lista para enlazar en cuanto exista ese
            destino. */}
        <button
            type="button"
            className="w-fit inline-flex items-center justify-center gap-1.5 mt-1 px-3 py-2 rounded-lg text-[11.5px] font-semibold bg-zinc-800 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-cyan-600 dark:hover:bg-cyan-500 dark:hover:text-white transition-colors duration-200"
        >
            Ver más
            <ArrowUpRight size={13} strokeWidth={2} />
        </button>
    </div>
)

const ConceptosBentoSection = () => {
    const sectionRef = useRef(null)
    const landingSpotRef = useRef(null)
    const landingGlowRef = useRef(null)
    const textBlockRef = useRef(null)
    // Map (no array reseteado en cada render, que ESLint marca como "no
    // accesses a ref during render") — el callback ref solo corre en el
    // commit, nunca durante el render en sí.
    const cardRefs = useRef(new Map())
    const registerCardRef = (id) => (el) => {
        if (el) cardRefs.current.set(id, el)
        else cardRefs.current.delete(id)
    }

    /** El bloque de texto (etiqueta + título + párrafo) Y el glow del
     * landing spot arrancan invisibles y aparecen recién CUANDO la
     * neurona termina de aterrizar — no antes, mientras todavía está en
     * vuelo. Como el texto vive AL LADO del landing spot (misma fila,
     * no muy por encima como el viejo encabezado independiente), ambos
     * llegan a la vista al mismo tiempo que la neurona: no hay riesgo de
     * que queden invisibles mientras el usuario ya los está viendo (eso
     * sí pasaba con el encabezado anterior, más arriba en la página —
     * confirmado con Playwright). Usa el mismo #neuron-landing-spot que
     * heroAiSection.jsx toma como endTrigger (`end:'center center'`),
     * así que el progress 0 de este trigger coincide con el instante
     * exacto en que la neurona llega. El glow es un <div> separado
     * DETRÁS del landing spot (no el propio #neuron-landing-spot, que
     * heroAiSection.jsx mide por su rect — animarle opacity no afecta esa
     * medición, pero se mantiene aparte para que quede clarísimo cuál es
     * cuál). */
    useGSAP(() => {
        gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
            const targets = [textBlockRef.current, landingGlowRef.current]
            gsap.set(targets, { opacity: 0 })
            gsap.set(textBlockRef.current, { y: 12 })
            gsap.to(targets, {
                opacity: 1,
                y: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: landingSpotRef.current,
                    start: 'center center',
                    end: 'center 35%',
                    scrub: 1,
                },
            })

            // El glow no puede quedar estático detrás de una imagen que sigue
            // en movimiento (flota) — "respira" (scale) todo el tiempo, que es
            // el movimiento que de verdad se nota en un blob desenfocado (a
            // blur-md, rotar un gradiente casi no se percibe: el blur diluye
            // la dirección) + una rotación lenta de fondo. Como arranca en
            // opacity 0, nada de esto se ve antes del aterrizaje.
            gsap.to(landingGlowRef.current, {
                scale: 1.06,
                duration: 2.2,
                yoyo: true,
                repeat: -1,
                ease: 'sine.inOut',
            })
            gsap.to(landingGlowRef.current, {
                rotate: 360,
                duration: 14,
                repeat: -1,
                ease: 'none',
            })
        })

        // Scrollytelling de las 6 cards — mismo efecto "mini-card 3D" que
        // usan las cards de aboutSection.jsx (rotationX 25→0 + scale
        // 0.8→1, scrub, perspectiva propia por card) en vez de un fade
        // simple, para que se sienta consistente con el resto del sitio.
        //
        // A diferencia de About (una sola fila de 4 cards, cabe en un
        // tramo corto de scroll), esta grilla tiene 3 FILAS — un solo
        // trigger compartido para las 6 (atado a la grilla completa)
        // hacía que el timeline terminara mientras solo las primeras dos
        // estaban a la vista: las de más abajo llegaban "ya listas", sin
        // efecto visible. Por eso cada card tiene su PROPIO trigger, en
        // desktop también (no solo mobile) — se dispara justo cuando ESA
        // card entra en pantalla, sin importar cuántas filas haya antes.
        gsap.matchMedia().add(responsiveMotion(640), (context) => {
            const { isDesktop } = context.conditions
            const cardEls = Array.from(cardRefs.current.values())

            cardEls.forEach((card) => {
                if (isDesktop) {
                    gsap.set(card, { y: 50, opacity: 0, scale: 0.8, rotationX: 25, transformPerspective: 800 })
                    gsap.timeline({
                        scrollTrigger: { trigger: card, start: 'top 90%', end: 'top 62%', scrub: 1 },
                    }).to(card, { y: 0, opacity: 1, scale: 1, rotationX: 0, ease: 'none', duration: 1 })
                } else {
                    // Sin rotationX en mobile: en una card angosta se ve
                    // distorsionado (mismo criterio que about/articles).
                    gsap.set(card, { y: 30, opacity: 0, scale: 0.92 })
                    gsap.timeline({
                        scrollTrigger: { trigger: card, start: 'top 88%', end: 'top 55%', scrub: 1 },
                    }).to(card, { y: 0, opacity: 1, scale: 1, ease: 'none', duration: 1 })
                }
            })
        })
    }, { scope: sectionRef })

    return (
        <section
            ref={sectionRef}
            id="conceptosSection"
            className="relative w-full bg-white dark:bg-zinc-950 py-16 md:py-24 px-4 md:px-8"
            style={{ scrollMarginTop: '24px' }}
        >
            <div className="relative max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
                    {/* Izquierda — landing spot de la neurona animada del Hero.
                        Antes esta columna era 50% del grid (md:grid-cols-2): la
                        imagen, mucho más angosta que esa mitad, dejaba un hueco
                        enorme entre ella y el título de al lado (que arrancaba
                        recién en el borde de SU 50%). Con flex + shrink-0 esta
                        columna mide solo lo que la imagen necesita, así el texto
                        (flex-1) puede empezar justo después, con el gap de
                        arriba como única separación. md:ml-4/8: un poco de aire
                        respecto del margen izquierdo de la página, sin llegar a
                        que la sombra (más chica, 110%) se salga de ese margen.
                        En mobile se apila y se mantiene centrada. */}
                    <div className="relative flex items-center justify-center shrink-0 min-h-[240px] md:min-h-[300px] md:ml-4 lg:ml-8">
                        {/* La neurona del Hero aterriza acá (ver heroAiSection.jsx,
                            busca este id vía getElementById para calcular
                            posición/tamaño final del vuelo). Es "relative" para
                            que el glow de adentro (absolute + translate) quede
                            centrado exacto sobre ESTE elemento — antes el glow
                            era hermano suyo dentro de un flex, y el centrado por
                            defecto de un absolute como flex item no coincidía
                            con la posición real del spot (se veían corridos). */}
                        <div
                            id="neuron-landing-spot"
                            ref={landingSpotRef}
                            aria-hidden="true"
                            className="relative w-44 h-44 sm:w-52 sm:h-52 md:w-64 md:h-64"
                        >
                            {/* Glow del aterrizaje — invisible hasta que la neurona
                                se posiciona (ver useGSAP arriba), no antes. 110%
                                del tamaño del spot, centrado exacto sobre él. */}
                            <div
                                ref={landingGlowRef}
                                aria-hidden="true"
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-700/20 blur-md"
                            />
                        </div>
                    </div>

                    {/* Derecha — etiqueta, título y párrafo de descripción.
                        flex-1 min-w-0: ocupa todo el espacio que la columna de
                        la imagen (shrink-0, ancho fijo a su contenido) deja
                        libre, en vez de un 50% rígido. */}
                    <div ref={textBlockRef} className="flex-1 min-w-0 flex flex-col gap-3 text-center md:text-left">
                        <span
                            className="inline-block md:self-start mx-auto md:mx-0 font-mono text-sm tracking-widest text-cyan-600 dark:text-cyan-400"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                            01 — CONCEPTOS
                        </span>
                        <h2
                            className="text-zinc-800 dark:text-white tracking-wide"
                            style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(1.9rem, 4.2vw, 3.2rem)', fontWeight: 700, lineHeight: 1.15 }}
                        >
                            Antes de escribir tu primer prompt: el abecé real de la IA
                        </h2>
                        <p
                            className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed"
                            style={{ fontFamily: "'Sora', sans-serif" }}
                        >
                            Los conceptos que separan a quien usa IA por intuición de quien la usa con criterio.
                        </p>
                    </div>
                </div>

                {/* Grilla de 6 cards — sin acordeón, siempre visible justo debajo.
                    12 columnas: ver comentario junto al array `cards` sobre los
                    spans (5/7/6), pensados para que la diferencia de ancho entre
                    cards sea moderada y nunca se apriete el contenido. */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 md:gap-5 mt-10 md:mt-14">
                    {cards.map((card) => (
                        <ConceptCard key={card.id} card={card} innerRef={registerCardRef(card.id)} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ConceptosBentoSection
