import React, { useRef, useState, useEffect } from 'react'
import { DollarSign, Ghost, FileText, Image, Music, Video, Bot, Zap, ArrowRight } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { scrollToSection } from '../../utils/scrollToSection'
import IsoBackground from './IsoBackground'

/**
 * Hook de tilt 3D en hover — rotación sutil basada en la posición del cursor
 * dentro de la card. Respeta prefers-reduced-motion (se desactiva el tilt,
 * solo queda el fade de useScrollReveal).
 */
const useTilt = (maxTilt = 6) => {
    const ref = useRef(null)
    const [style, setStyle] = useState({ transform: 'perspective(900px) rotateX(0deg) rotateY(0deg)' })
    const reduceMotion = useRef(false)

    useEffect(() => {
        reduceMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }, [])

    const onMouseMove = (e) => {
        if (reduceMotion.current || !ref.current) return
        const rect = ref.current.getBoundingClientRect()
        const px = (e.clientX - rect.left) / rect.width - 0.5
        const py = (e.clientY - rect.top) / rect.height - 0.5
        setStyle({
            transform: `perspective(900px) rotateX(${(-py * maxTilt).toFixed(2)}deg) rotateY(${(px * maxTilt).toFixed(2)}deg) translateZ(0)`,
            transition: 'transform 80ms linear',
        })
    }

    const onMouseLeave = () => {
        setStyle({ transform: 'perspective(900px) rotateX(0deg) rotateY(0deg)', transition: 'transform 400ms cubic-bezier(0.25,0.46,0.45,0.94)' })
    }

    return { ref, style, onMouseMove, onMouseLeave }
}

/* ==================== MARCO COMPARTIDO PARA LOS VISUALES (cards 2-4) ==================== */
/* Usa el mismo fondo (dot-grid + anillos + glow) que la Card 1, en tokens
 * --iso-* que responden al tema claro/oscuro del sitio. */
const VisualFrame = ({ children, active = false, className = '' }) => (
    <div className={`relative w-full h-full overflow-hidden ${className}`} style={{ backgroundColor: 'var(--iso-bg)' }}>
        <IsoBackground active={active} scale={0.75} />
        {children}
    </div>
)

/* ==================== PRIMITIVA ISOMÉTRICA COMPARTIDA (SVG, cards 2-4) ==================== */
/* Genera las 3 caras (top/left/right) de un bloque isométrico a partir de un
 * ancho w (cara superior, rombo 2:1 aprox.) y una altura de extrusión exH.
 * Los colores salen de los tokens --iso-* → coherentes con el tema activo. */
const ISO_H_RATIO = 0.22

const isoBox = (x, y, w, exH) => {
    const h = w * ISO_H_RATIO
    return {
        top: `${x},${y + h / 2} ${x + w / 2},${y} ${x + w},${y + h / 2} ${x + w / 2},${y + h}`,
        left: `${x},${y + h / 2} ${x + w / 2},${y + h} ${x + w / 2},${y + h + exH} ${x},${y + h / 2 + exH}`,
        right: `${x + w / 2},${y + h} ${x + w},${y + h / 2} ${x + w},${y + h / 2 + exH} ${x + w / 2},${y + h + exH}`,
        cx: x + w / 2,
        topY: y,
        h,
        bottomY: y + h + exH,
    }
}

const ISO_PALETTE = {
    neutral: { top: 'var(--iso-neutral-1)', left: 'var(--iso-neutral-2)', right: 'var(--iso-neutral-3)', stroke: 'var(--iso-neutral-2)' },
    accent: { top: 'var(--iso-accent-emissive)', left: 'var(--iso-accent)', right: 'var(--iso-accent)', stroke: 'var(--iso-accent-emissive)' },
}

const IsoFaces = ({ box, tone = 'neutral' }) => {
    const p = ISO_PALETTE[tone]
    return (
        <g>
            <polygon points={box.right} style={{ fill: p.right }} />
            <polygon points={box.left} style={{ fill: p.left }} />
            <polygon points={box.top} style={{ fill: p.top }} />
            <polygon points={box.top} fill="none" style={{ stroke: p.stroke, strokeOpacity: 0.4 }} strokeWidth="1" />
        </g>
    )
}

const IsoGlow = ({ cx, cy, rx = 30, ry = 14 }) => (
    <ellipse cx={cx} cy={cy} rx={rx} ry={ry} style={{ fill: 'var(--iso-accent-emissive)', opacity: 'var(--iso-glow-opacity-strong)', filter: 'blur(10px)' }} />
)

/* ==================== 1 — RADAR CONCÉNTRICO: IA ⊃ ML ⊃ IA GENERATIVA ⊃ LLM ==================== */
/**
 * BadgeVisual — recreación 1:1 de la técnica de DeviceRadarCard: bandas
 * rellenas ordenadas por radio (la más grande atrás), trazo punteado en
 * el borde de cada banda, spotMask + radialGradient recortando el resalte
 * SOLO sobre el anillo enfocado (LLM), glow con blur + mix-blend-mode
 * screen detrás de ese dot, y tags posicionados en %. Colores en tokens
 * --iso-* para responder a claro/oscuro.
 */
const VIEW_W = 640
const VIEW_H = 180
const CENTER = { x: 320, y: 204 } // pivot fuera del canvas (viewBox alto = 180)

const LAYERS = [
    { id: 'ai', label: 'AI', r: 182, angle: 130, active: false, fillVar: '--iso-radar-ring-1', sweepDelay: 0 },
    { id: 'ml', label: 'Machine Learning', r: 150, angle: 55, active: false, fillVar: '--iso-radar-ring-2', sweepDelay: 1.2 },
    { id: 'genai', label: 'Generative AI', r: 120, angle: 105, active: false, fillVar: '--iso-radar-ring-3', sweepDelay: 2.4 },
    { id: 'llm', label: 'LLM', r: 90, angle: 80, active: true, fillVar: '--iso-radar-ring-4', sweepDelay: 3.6 },
]

const arcPoint = (r, angleDeg) => {
    const rad = (angleDeg * Math.PI) / 180
    return { x: CENTER.x + r * Math.cos(rad), y: CENTER.y - r * Math.sin(rad) }
}

const OUTER_R = Math.max(...LAYERS.map((l) => l.r))

/** Desplazamiento propio por tag (no todos centrados igual sobre su dot) —
 * da una sensación más orgánica/dispersa en vez de una columna vertical. */
const TAG_OFFSET = {
    ai: { x: '-72%', y: '-150%' },
    ml: { x: '-22%', y: '-130%' },
    genai: { x: '-68%', y: '-172%' },
    llm: { x: '-50%', y: '-145%' },
}

const BadgeVisual = ({ visible = true, active = false }) => {
    const reduceMotion = useRef(false)
    useEffect(() => {
        reduceMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }, [])
    const sweeping = active && !reduceMotion.current

    const layersWithDot = LAYERS.map((l) => ({ ...l, dot: arcPoint(l.r, l.angle) }))
    const activeLayer = layersWithDot.find((l) => l.active)
    const layersByRadiusDesc = [...layersWithDot].sort((a, b) => b.r - a.r)

    return (
        <div
            className="relative w-full h-full overflow-hidden"
            style={{ opacity: visible ? 1 : 0, transition: 'opacity 500ms ease-out' }}
        >
            {/* capa difuminadora: la ilustración (textura + bandas) se desvanece
                hacia abajo (desde un poco antes de la mitad) para dar continuidad
                con el texto de la card, y también hacia los costados — sin pintar
                un color nuevo, solo recorta opacidad (revela el mismo bg de la
                card, sin corte raro). */}
            <div
                className="absolute inset-0"
                style={{
                    WebkitMaskImage: 'radial-gradient(85% 78% at 50% 34%, black 38%, transparent 92%)',
                    maskImage: 'radial-gradient(85% 78% at 50% 34%, black 38%, transparent 92%)',
                }}
            >
                {/* textura de puntos, arriba a la izquierda */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-40"
                    style={{
                        backgroundImage: 'radial-gradient(var(--iso-dot) 1px, transparent 1px)',
                        backgroundSize: '18px 18px',
                        WebkitMaskImage: 'radial-gradient(ellipse 55% 55% at 10% 10%, black, transparent)',
                        maskImage: 'radial-gradient(ellipse 55% 55% at 10% 10%, black, transparent)',
                    }}
                />

                <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full">
                    <defs>
                        {/* luz circular por capa: radial suave y más grande — alcanza a
                            cubrir parte del círculo siguiente. Caída gradual en 3
                            paradas para que se lea como un resplandor difuso, no como
                            un círculo blanco sólido. Una por capa, para poder "barrer"
                            el foco entre las 4 en hover. */}
                        {layersWithDot.map((l) => (
                            <React.Fragment key={`spot-def-${l.id}`}>
                                <radialGradient
                                    id={`badgeSpotGrad-${l.id}`}
                                    cx={l.dot.x}
                                    cy={l.dot.y}
                                    r={l.r * 1.15}
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
                                    <stop offset="45%" stopColor="#ffffff" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                                </radialGradient>
                                <mask id={`badgeSpotMask-${l.id}`} maskUnits="userSpaceOnUse">
                                    <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill={`url(#badgeSpotGrad-${l.id})`} />
                                </mask>
                            </React.Fragment>
                        ))}
                        <filter id="badgeGlowBlur" x="-150%" y="-150%" width="400%" height="400%">
                            <feGaussianBlur stdDeviation="10" />
                        </filter>
                    </defs>

                    {/* bandas rellenas: la más grande atrás, van tapándose las más chicas */}
                    {layersByRadiusDesc.map((l) => (
                        <circle key={`fill-${l.id}`} cx={CENTER.x} cy={CENTER.y} r={l.r} fill={`var(${l.fillVar})`} />
                    ))}

                    {/* trazo punteado en el borde de cada banda */}
                    {layersWithDot.map((l) => (
                        <circle
                            key={`stroke-${l.id}`}
                            cx={CENTER.x}
                            cy={CENTER.y}
                            r={l.r}
                            fill="none"
                            stroke="var(--iso-text)"
                            strokeOpacity={0.13}
                            strokeWidth={1}
                            strokeDasharray="2.4 6"
                        />
                    ))}

                    {/* resalte del trazo punteado — recortado por la luz circular de
                        la capa enfocada (alcanza al círculo siguiente también),
                        opacidad moderada. Un grupo por posible foco, para poder
                        "barrer" entre los 4 en hover (uno a la vez, igual que LLM). */}
                    {layersWithDot.map((focus) => (
                        <g
                            key={`hl-group-${focus.id}`}
                            style={sweeping
                                ? { opacity: 0, animation: `radar-focus-ring 4.8s ease-in-out ${focus.sweepDelay}s infinite` }
                                : { opacity: focus.active ? 1 : 0, transition: 'opacity 400ms ease-out' }}
                        >
                            {layersWithDot.map((ring) => (
                                <circle
                                    key={`hl-${focus.id}-${ring.id}`}
                                    cx={CENTER.x}
                                    cy={CENTER.y}
                                    r={ring.r}
                                    fill="none"
                                    stroke="var(--iso-text)"
                                    strokeOpacity={0.6}
                                    strokeWidth={1.3}
                                    strokeDasharray="2.4 6"
                                    mask={`url(#badgeSpotMask-${focus.id})`}
                                />
                            ))}
                        </g>
                    ))}

                    {/* glow suave detrás del dot enfocado — blanco, muy difuso (no un
                        círculo sólido). Uno por capa, se "barre" igual que el resalte. */}
                    {layersWithDot.map((l) => (
                        <circle
                            key={`glow-${l.id}`}
                            cx={l.dot.x}
                            cy={l.dot.y}
                            r={20}
                            fill="#ffffff"
                            filter="url(#badgeGlowBlur)"
                            style={{
                                mixBlendMode: 'screen',
                                ...(sweeping
                                    ? { opacity: 0, animation: `radar-focus-glow 4.8s ease-in-out ${l.sweepDelay}s infinite` }
                                    : { opacity: l.active ? 0.35 : 0, transition: 'opacity 400ms ease-out' }),
                            }}
                        />
                    ))}

                    {/* dots de cada capa */}
                    {layersWithDot.map((l) => (
                        <React.Fragment key={`dot-${l.id}`}>
                            <circle
                                cx={l.dot.x}
                                cy={l.dot.y}
                                r={sweeping ? 4.5 : (l.active ? 5.5 : 3.5)}
                                fill={sweeping ? 'var(--iso-text)' : (l.active ? '#ffffff' : 'var(--iso-text)')}
                                style={sweeping
                                    ? { transformOrigin: `${l.dot.x}px ${l.dot.y}px`, opacity: 0.4, animation: `radar-focus-dot 4.8s ease-in-out ${l.sweepDelay}s infinite` }
                                    : { opacity: l.active ? 1 : 0.4, transition: 'opacity 400ms ease-out' }}
                            />
                            <circle
                                cx={l.dot.x}
                                cy={l.dot.y}
                                r={9}
                                fill="none"
                                stroke="#ffffff"
                                strokeWidth={1}
                                style={sweeping
                                    ? { strokeOpacity: 0.5, opacity: 0, animation: `radar-focus-glow 4.8s ease-in-out ${l.sweepDelay}s infinite` }
                                    : { strokeOpacity: 0.5, opacity: l.active ? 1 : 0, transition: 'opacity 400ms ease-out' }}
                            />
                        </React.Fragment>
                    ))}
                </svg>
            </div>

            {/* tags — cada uno con su propio desplazamiento (no todos centrados
                igual sobre su dot), para que se vean más dispersos/orgánicos */}
            {layersWithDot.map((l) => (
                <span
                    key={`tag-${l.id}`}
                    className="absolute whitespace-nowrap rounded-lg border px-3 py-1.5 text-[13px] font-medium backdrop-blur-sm"
                    style={{
                        left: `${(l.dot.x / VIEW_W) * 100}%`,
                        top: `${(l.dot.y / VIEW_H) * 100}%`,
                        transform: `translate(${TAG_OFFSET[l.id].x}, ${TAG_OFFSET[l.id].y})`,
                        background: sweeping ? 'var(--iso-neutral-2)' : (l.active ? 'var(--iso-neutral-1)' : 'var(--iso-neutral-2)'),
                        color: 'var(--iso-text)',
                        borderColor: sweeping ? 'rgba(127,127,127,0.18)' : (l.active ? 'rgba(127,127,127,0.35)' : 'rgba(127,127,127,0.18)'),
                        ...(sweeping
                            ? { opacity: 0.42, animation: `radar-focus-tag 4.8s ease-in-out ${l.sweepDelay}s infinite` }
                            : { opacity: l.active ? 1 : 0.55, transition: 'opacity 400ms ease-out' }),
                    }}
                >
                    {l.label}
                </span>
            ))}
        </div>
    )
}

/* ==================== 2 — CHIP CON TOKENS ENSAMBLÁNDOSE + CONTEXTO ==================== */
const TokensVisual = ({ active }) => {
    const cx = 168
    const chipW = 140, chipY = 96, chipExH = 16
    const chip = isoBox(cx - chipW / 2, chipY, chipW, chipExH)

    const colW = 20, colBottomY = 168, colTotalH = 88, fillPct = 0.62
    const hCol = colW * ISO_H_RATIO
    const fillH = colTotalH * fillPct
    const emptyH = colTotalH - fillH
    const filledY = colBottomY - hCol - fillH
    const emptyY = filledY - hCol - emptyH
    const colX = cx + chipW / 2 + 30
    const filledBox = isoBox(colX, filledY, colW, fillH)
    const emptyBox = isoBox(colX, emptyY, colW, emptyH)

    const tokens = ['El', 'gat-', 'o']

    return (
        <VisualFrame active={active}>
            <svg viewBox="0 0 320 190" className="w-full h-full">
                {tokens.map((t, i) => {
                    const tw = 30
                    const box = isoBox(20 + i * 30, 36 + i * 16, tw, 9)
                    const last = i === tokens.length - 1
                    return (
                        <g key={i}>
                            <IsoFaces box={box} tone={last ? 'accent' : 'neutral'} />
                            <text x={box.cx} y={box.topY + box.h / 2 + 2.5} textAnchor="middle"
                                className={`font-mono font-semibold ${last ? 'fill-zinc-900' : 'fill-zinc-600 dark:fill-zinc-200'}`} style={{ fontSize: 7 }}>
                                {t}
                            </text>
                        </g>
                    )
                })}

                <IsoFaces box={chip} tone="neutral" />
                <line x1={chip.cx - 44} y1={chipY + chip.h / 2} x2={chip.cx + 44} y2={chipY + chip.h / 2} style={{ stroke: 'var(--iso-accent-emissive)', strokeOpacity: 0.35 }} strokeWidth="1" />
                <line x1={chip.cx - 30} y1={chipY + chip.h / 2 + 7} x2={chip.cx + 30} y2={chipY + chip.h / 2 + 7} style={{ stroke: 'var(--iso-accent-emissive)', strokeOpacity: 0.2 }} strokeWidth="1" />

                <IsoFaces box={emptyBox} tone="neutral" />
                <IsoGlow cx={colX + colW / 2} cy={filledY + hCol / 2} rx={colW + 4} ry="8" />
                <IsoFaces box={filledBox} tone="accent" />
                <text x={colX + colW / 2} y={emptyY - 6} textAnchor="middle" className="fill-zinc-500 dark:fill-zinc-400 font-mono" style={{ fontSize: 7 }}>ctx 62%</text>
            </svg>
        </VisualFrame>
    )
}

/* ==================== 3 — GAUGE COSTO/ALUCINACIÓN + LUPA/DOC + BALANZA ==================== */
const CostVisual = ({ active }) => {
    const cx = 148, cy = 66, rx = 50, ry = 25, extH = 16
    const needleAngle = -30
    const rad = (needleAngle * Math.PI) / 180
    const nx = cx + Math.cos(rad) * rx * 0.78
    const ny = cy + Math.sin(rad) * ry * 0.78

    return (
        <VisualFrame active={active}>
            <svg viewBox="0 0 320 190" className="w-full h-full">
                {/* disco/gauge principal */}
                <path d={`M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 0 ${cx + rx} ${cy} L ${cx + rx} ${cy + extH} A ${rx} ${ry} 0 0 1 ${cx - rx} ${cy + extH} Z`} style={{ fill: 'var(--iso-neutral-3)' }} />
                <ellipse cx={cx} cy={cy} rx={rx} ry={ry} style={{ fill: 'var(--iso-neutral-2)', stroke: 'var(--iso-neutral-1)' }} strokeWidth="1" />

                {Array.from({ length: 9 }).map((_, i) => {
                    const a = ((-150 + i * (300 / 8)) * Math.PI) / 180
                    const x1 = cx + Math.cos(a) * (rx - 3), y1 = cy + Math.sin(a) * (ry - 1)
                    const x2 = cx + Math.cos(a) * (rx - 10), y2 = cy + Math.sin(a) * (ry - 4)
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} style={{ stroke: 'var(--iso-text)' }} strokeWidth="1" />
                })}

                <foreignObject x={cx - rx - 4} y={cy - 16} width="16" height="16"><DollarSign size={15} className="text-cyan-600 dark:text-cyan-400" /></foreignObject>
                <foreignObject x={cx + rx - 12} y={cy - 16} width="16" height="16"><Ghost size={15} className="text-zinc-500" /></foreignObject>

                <line x1={cx} y1={cy} x2={nx} y2={ny} style={{ stroke: 'var(--iso-accent-emissive)' }} strokeWidth="2" strokeLinecap="round" />
                <IsoGlow cx={cx} cy={cy} rx="10" ry="7" />
                <circle cx={cx} cy={cy} r="3.5" style={{ fill: 'var(--iso-accent-emissive)' }} />

                {/* lupa sobre documento — detalle secundario */}
                <g transform="translate(30, 122)">
                    <rect x="0" y="0" width="44" height="32" rx="4" style={{ fill: 'var(--iso-neutral-3)', stroke: 'var(--iso-neutral-2)' }} strokeWidth="1" />
                    <line x1="7" y1="8" x2="32" y2="8" style={{ stroke: 'var(--iso-neutral-1)' }} strokeWidth="2" strokeLinecap="round" />
                    <line x1="7" y1="15" x2="28" y2="15" style={{ stroke: 'var(--iso-neutral-1)' }} strokeWidth="2" strokeLinecap="round" />
                    <line x1="7" y1="22" x2="22" y2="22" style={{ stroke: 'var(--iso-neutral-1)' }} strokeWidth="2" strokeLinecap="round" />
                    <circle cx="36" cy="24" r="8" style={{ fill: 'var(--iso-bg)', stroke: 'var(--iso-accent-emissive)' }} strokeWidth="1.6" />
                    <line x1="41.6" y1="29.6" x2="48" y2="36" style={{ stroke: 'var(--iso-accent-emissive)' }} strokeWidth="2.2" strokeLinecap="round" />
                </g>

                {/* balanza desequilibrada — detalle secundario */}
                <g transform="translate(228, 122) rotate(-7 20 13)">
                    <line x1="20" y1="0" x2="20" y2="24" style={{ stroke: 'var(--iso-neutral-1)' }} strokeWidth="2" strokeLinecap="round" />
                    <line x1="2" y1="6" x2="38" y2="6" style={{ stroke: 'var(--iso-neutral-1)' }} strokeWidth="2" strokeLinecap="round" />
                    <line x1="2" y1="6" x2="2" y2="16" style={{ stroke: 'var(--iso-neutral-2)' }} strokeWidth="1.4" />
                    <line x1="38" y1="6" x2="38" y2="12" style={{ stroke: 'var(--iso-neutral-2)' }} strokeWidth="1.4" />
                    <path d="M -6 16 Q 2 24 10 16" fill="none" style={{ stroke: 'var(--iso-text)' }} strokeWidth="1.4" />
                    <path d="M 32 12 Q 38 18 44 12" fill="none" style={{ stroke: 'var(--iso-text)' }} strokeWidth="1.4" />
                </g>
            </svg>
        </VisualFrame>
    )
}

/* ==================== 4 — HUB MULTIMODAL + ASISTENTE VS AGENTE ==================== */
const FlowVisual = ({ active }) => {
    const hub = isoBox(160 - 27, 66, 54, 20)
    const sats = [
        { x: 34, y: 12, w: 58, Icon: FileText },
        { x: 224, y: 12, w: 58, Icon: Image },
        { x: 34, y: 122, w: 58, Icon: Music },
        { x: 224, y: 122, w: 58, Icon: Video },
    ]

    return (
        <VisualFrame active={active}>
            <svg viewBox="0 0 320 190" className="w-full h-full">
                {sats.map((s, i) => {
                    const box = isoBox(s.x, s.y, s.w, 10)
                    return (
                        <g key={i}>
                            <line x1={hub.cx} y1={hub.topY + hub.h / 2} x2={box.cx} y2={box.topY + box.h / 2} style={{ stroke: 'var(--iso-neutral-2)' }} strokeWidth="5" strokeLinecap="round" />
                            <line x1={hub.cx} y1={hub.topY + hub.h / 2} x2={box.cx} y2={box.topY + box.h / 2} style={{ stroke: 'var(--iso-accent-emissive)', strokeOpacity: 0.45 }} strokeWidth="1.5" strokeLinecap="round" />
                            <IsoFaces box={box} tone="neutral" />
                            <foreignObject x={box.cx - 8} y={box.topY + box.h / 2 - 15} width="16" height="16"><s.Icon size={14} className="text-zinc-500 dark:text-zinc-300" /></foreignObject>
                        </g>
                    )
                })}

                <IsoGlow cx={hub.cx} cy={hub.topY + hub.h / 2} rx="32" ry="16" />
                <IsoFaces box={hub} tone="accent" />

                {/* asistente (pasivo) vs agente (con acción) — detalle inferior */}
                <g transform="translate(112, 164)">
                    <rect x="0" y="0" width="38" height="20" rx="7" style={{ fill: 'var(--iso-neutral-3)', stroke: 'var(--iso-neutral-2)' }} strokeWidth="1" />
                    <foreignObject x="10" y="2" width="16" height="16"><Bot size={15} className="text-zinc-500 dark:text-zinc-400" /></foreignObject>

                    <rect x="58" y="0" width="38" height="20" rx="7" style={{ fill: 'var(--iso-accent)', fillOpacity: 0.2, stroke: 'var(--iso-accent-emissive)' }} strokeWidth="1" />
                    <foreignObject x="68" y="2" width="16" height="16"><Bot size={15} className="text-cyan-700 dark:text-cyan-300" /></foreignObject>
                    <circle cx="94" cy="1" r="6.5" style={{ fill: 'var(--iso-accent-emissive)' }} />
                    <foreignObject x="90.5" y="-2.5" width="8" height="8"><Zap size={7} className="text-zinc-900" /></foreignObject>
                </g>
            </svg>
        </VisualFrame>
    )
}

const VISUALS = {
    intro: BadgeVisual,
    tokens: TokensVisual,
    cost: CostVisual,
    flow: FlowVisual,
}

/* ==================== DATA DE LAS 4 CARDS ==================== */
const conceptCards = [
    {
        id: 'que-es-ia',
        number: '01',
        span: 'lg:col-span-3',
        title: 'Qué es realmente la IA (y por qué no es solo ChatGPT)',
        description: 'Aclara de una vez la diferencia real entre IA, machine learning, IA generativa y LLM, con ejemplos claros de clasificación vs. generación. La IA generativa es solo una rama del árbol: dónde aparecen los filtros de spam, las recomendaciones de Netflix o la detección de fraude, y por qué una misma herramienta como Claude o GPT puede usarse tanto para generar contenido como para clasificar correos dentro de un mismo flujo de automatización.',
        visual: 'intro',
    },
    {
        id: 'como-piensa',
        number: '02',
        span: 'lg:col-span-2',
        title: 'Cómo "piensa" un modelo por dentro',
        description: 'Qué son los tokens y por qué determinan directamente el costo, qué es la ventana de contexto y por qué una conversación muy larga puede hacer que el modelo "olvide" algo que ya le dijiste, cómo funcionan los embeddings y las bases de datos vectoriales, y qué controlan realmente la temperatura y el top-p a la hora de decidir qué tan creativa es una respuesta.',
        visual: 'tokens',
    },
    {
        id: 'cuanto-cuesta',
        number: '03',
        span: 'lg:col-span-2',
        title: 'Cuánto cuesta, qué falla y cómo evitarlo',
        description: 'Cómo se calcula en la práctica el costo de usar IA por API y por qué no todos los modelos cuestan lo mismo, qué son las alucinaciones, qué es RAG (y sus distintos tipos) para conectar un modelo a información real y actualizada, y por qué la IA no es neutral: qué son los sesgos, de dónde vienen y cómo detectarlos.',
        visual: 'cost',
    },
    {
        id: 'construir-real',
        number: '04',
        span: 'lg:col-span-3',
        title: 'De elegir la técnica correcta a construir algo real',
        description: 'Cuándo conviene usar prompting, RAG o fine-tuning para personalizar un modelo (y en qué orden probarlos antes de gastar de más), la diferencia real entre un asistente y un agente con ejemplos concretos (GPTs personalizados, Proyectos de Claude, n8n, Claude Code), qué son los modelos multimodales, y cómo se genera imagen, audio y video frente a texto.',
        visual: 'flow',
    },
]

/* ==================== CARD GENÉRICA (1-4) ==================== */
const ConceptCard = ({ card, delay }) => {
    const reveal = useScrollReveal({ threshold: 0.15, rootMargin: '-40px' })
    const tilt = useTilt(4)
    const [hovered, setHovered] = useState(false)
    const Visual = VISUALS[card.visual]

    return (
        <div ref={reveal.ref} className={`${card.span} ${reveal.anim(delay).className}`} style={reveal.anim(delay).style}>
            <div
                ref={tilt.ref}
                onMouseMove={tilt.onMouseMove}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={(e) => { tilt.onMouseLeave(e); setHovered(false) }}
                style={{ ...tilt.style, willChange: 'transform' }}
                className="group relative h-full flex flex-col rounded-[24px] overflow-hidden bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 shadow-sm hover:shadow-2xl hover:shadow-cyan-500/[0.08] hover:border-cyan-500/40 transition-all duration-300"
            >
                <div className={`relative w-full shrink-0 h-[170px] md:h-[190px] ${card.visual === 'intro' ? '' : 'ring-1 ring-inset ring-cyan-500/10'}`}>
                    <Visual active={hovered} visible={reveal.visible} />
                </div>

                <div className="relative flex-1 flex flex-col p-6 md:p-7 pt-5">
                    <span className="font-mono text-xs tracking-widest text-cyan-600 dark:text-cyan-400 mb-1">
                        {card.number}
                    </span>
                    <h3 style={{ fontFamily: "'Orbitron', monospace" }} className="text-lg md:text-xl font-bold leading-snug mb-2 tracking-tight text-zinc-800 dark:text-zinc-50">
                        {card.title}
                    </h3>
                    <p className="text-[13px] md:text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                        {card.description}
                    </p>

                    <button
                        onClick={(e) => { e.preventDefault(); setTimeout(() => scrollToSection('#tecnicasSection'), 100) }}
                        className="group/btn mt-4 inline-flex items-center gap-1.5 self-start text-[13px] font-semibold text-zinc-700 dark:text-zinc-200 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200"
                    >
                        Leer más
                        <ArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </button>
                </div>
            </div>
        </div>
    )
}

/* ==================== SECCIÓN PRINCIPAL ==================== */
const ConceptosIASection = () => {
    const header = useScrollReveal({ threshold: 0, rootMargin: '-40px' })

    return (
        <section id="conceptosSection" className="relative w-full px-4 md:px-8 py-16 md:py-24" style={{ scrollMarginTop: '24px' }}>
            <div ref={header.ref} className={`max-w-6xl mx-auto text-left mb-10 md:mb-14 ${header.anim('0ms').className}`} style={header.anim('0ms').style}>
                <span className="inline-block font-mono text-xs tracking-widest text-cyan-600 dark:text-cyan-400 mb-1">01 — CONCEPTOS</span>
                <h2 style={{ fontFamily: "'Orbitron', monospace" }} className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-800 dark:text-zinc-100 leading-tight tracking-tight">
                    Antes de escribir tu primer prompt: el abecé real de la IA
                </h2>
                <p className="mt-3 text-sm md:text-base text-zinc-500 dark:text-zinc-400 max-w-2xl">
                    Los conceptos que separan a quien usa IA por intuición de quien la usa con criterio.
                </p>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-5">
                {conceptCards.map((card, i) => (
                    <ConceptCard key={card.id} card={card} delay={`${i * 120}ms`} />
                ))}
            </div>
        </section>
    )
}

export default ConceptosIASection