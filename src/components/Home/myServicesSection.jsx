/**
 * @component MyServicesSection.jsx
 * @version 4.6.0 — scroll reveal animations
 */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import services from "../../data/services.json";
import AIGenerativaBento from "../BentoCards/AIGenerativaBento";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const BENTO_MAP = {
    AIGenerativaBento: AIGenerativaBento,
};

const TRANSITION = "transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 300ms ease";

const CARD_HEIGHT = 360;
const VISUAL_HEIGHT = 185;

const SHADOW_REST = "0 2px 12px 0 rgba(0,0,0,0.08), 0 1px 3px 0 rgba(0,0,0,0.05)";
const SHADOW_HOVER = "0 12px 32px 0 rgba(0,0,0,0.13), 0 2px 8px 0 rgba(0,0,0,0.08)";

// ==================== DOT PATTERN ====================
function DotPatternCanvas({ opacityTop = 0.13, opacityBottom = 0.01 }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const draw = () => {
            const ctx = canvas.getContext("2d");
            const W = canvas.offsetWidth;
            const H = canvas.offsetHeight;
            if (!W || !H) return;
            canvas.width = W;
            canvas.height = H;
            const SPACE = 18;
            const cols = Math.ceil(W / SPACE) + 1;
            const rows = Math.ceil(H / SPACE) + 1;
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const t = r / rows;
                    const alpha = opacityTop + (opacityBottom - opacityTop) * t;
                    ctx.beginPath();
                    ctx.arc(c * SPACE, r * SPACE, 1.1, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(128,128,128,${alpha.toFixed(2)})`;
                    ctx.fill();
                }
            }
        };

        const timer = setTimeout(draw, 20);
        const ro = new ResizeObserver(draw);
        if (canvas.parentElement) ro.observe(canvas.parentElement);
        return () => { clearTimeout(timer); ro.disconnect(); };
    }, [opacityTop, opacityBottom]);

    return (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block pointer-events-none" />
    );
}

// ==================== PLACEHOLDER VISUAL ====================
function PlaceholderVisual() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={{ background: "rgba(161,161,170,0.18)" }}>
            <style>{`
                @media (prefers-color-scheme: dark) {
                    .placeholder-inner { background: rgba(9,9,11,0.45) !important; }
                }
            `}</style>
            <div className="placeholder-inner w-full h-full flex flex-col items-center justify-center gap-3" style={{ background: "rgba(161,161,170,0.18)" }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="opacity-30">
                    <path d="M14 3v10m0 0 4-4m-4 4-4-4" stroke="currentColor" strokeWidth="1.6"
                        strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500 dark:text-zinc-400" />
                    <path d="M4 18v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4" stroke="currentColor"
                        strokeWidth="1.6" strokeLinecap="round" className="text-zinc-500 dark:text-zinc-400" />
                </svg>
                <span className="text-[10px] tracking-[0.5px] uppercase text-zinc-400 dark:text-zinc-500">
                    Proyectos en camino
                </span>
            </div>
        </div>
    );
}

// ==================== BENTO CARD ====================
function BentoCard({ service, onClick, animRef, animClassName, animStyle }) {
    const BentoVisual = BENTO_MAP[service.bentocard] || null;
    const FADE_LIGHT = "rgba(244,244,245,1)";
    const FADE_DARK = "rgba(39,39,42,1)";

    return (
        // wrapper externo recibe el ref del reveal para no interferir con el transform de hover
        <div ref={animRef} className={`flex-shrink-0 ${animClassName}`} style={animStyle}>
            <div onClick={() => onClick(service.id, service.active)} className={`relative overflow-hidden rounded-[20px] flex flex-col bg-gray-100 dark:bg-zinc-800 will-change-transform ${service.active ? "cursor-pointer" : "cursor-default"}`} style={{ height: CARD_HEIGHT, transition: TRANSITION, border: "1px solid rgba(0,0,0,0.06)", boxShadow: SHADOW_REST, }} onMouseEnter={e => { if (service.active) { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = SHADOW_HOVER; } }} onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0px)"; e.currentTarget.style.boxShadow = SHADOW_REST; }}  >
                <DotPatternCanvas opacityTop={0.13} opacityBottom={0.01} />

                {/* Área visual */}
                <div className="relative z-[1] w-full flex-shrink-0 overflow-hidden rounded-t-[20px]" style={{ height: VISUAL_HEIGHT }}>
                    {BentoVisual ? <BentoVisual /> : <PlaceholderVisual />}
                    <div className="absolute bottom-0 left-0 right-0 pointer-events-none dark:hidden" style={{ height: 64, background: `linear-gradient(to bottom, transparent, ${FADE_LIGHT})` }} />
                    <div className="absolute bottom-0 left-0 right-0 pointer-events-none hidden dark:block" style={{ height: 64, background: `linear-gradient(to bottom, transparent, ${FADE_DARK})` }} />
                </div>

                {/* Contenido textual */}
                <div className="relative z-[2] px-5 pb-6 pt-3 flex flex-col flex-1">
                    <h3 className="font-bold text-zinc-800 dark:text-zinc-50 mb-2 leading-tight tracking-tight" style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.25rem)" }}  >
                        {service.title}
                    </h3>
                    <div className="w-full h-px bg-zinc-200 dark:bg-white/[0.07] mb-3" />
                    <p className="text-[12.5px] leading-[1.65] text-zinc-500 dark:text-zinc-400" style={{ display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }} >
                        {service.description}
                    </p>
                </div>
            </div>
        </div>
    );
}

// ==================== COMPONENTE PRINCIPAL ====================
const MyServicesSection = () => {
    const navigate = useNavigate();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [slidesPerView, setSlidesPerView] = useState(3);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [translateX, setTranslateX] = useState(0);
    const [startTime, setStartTime] = useState(0);

    const carouselRef = useRef(null);
    const isDraggingRef = useRef(false);

    // ── Scroll reveal observers ──────────────────────────────────────────
    const panel = useScrollReveal();
    const dots = useScrollReveal();
    // Un observer por card — hasta 8 servicios cubiertos
    const cardReveal = [
        useScrollReveal(),
        useScrollReveal(),
        useScrollReveal(),
        useScrollReveal(),
        useScrollReveal(),
        useScrollReveal(),
        useScrollReveal(),
        useScrollReveal(),
    ];
    // ────────────────────────────────────────────────────────────────────

    const maxIndex = Math.max(0, services.length - slidesPerView);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setSlidesPerView(3);
            else if (window.innerWidth >= 768) setSlidesPerView(2);
            else setSlidesPerView(1);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const maxPossible = Math.max(0, services.length - slidesPerView);
        if (currentIndex > maxPossible) setCurrentIndex(maxPossible);
    }, [slidesPerView, currentIndex]);

    const nextSlide = () => setCurrentIndex(p => p >= maxIndex ? 0 : p + 1);
    const prevSlide = () => setCurrentIndex(p => p <= 0 ? maxIndex : p - 1);

    const handleMouseDown = (e) => {
        if (e.target.tagName === "BUTTON" || e.target.closest("button")) return;
        setIsDragging(true);
        isDraggingRef.current = true;
        setStartX(e.pageX);
        setStartTime(Date.now());
        setTranslateX(0);
        e.preventDefault();
    };

    const handleMouseMove = (e) => {
        if (!isDraggingRef.current) return;
        e.preventDefault();
        setTranslateX(Math.max(-200, Math.min(200, e.pageX - startX)));
    };

    const handleMouseUp = () => {
        if (!isDraggingRef.current) return;
        setIsDragging(false);
        isDraggingRef.current = false;
        const elapsed = Date.now() - startTime;
        const velocity = Math.abs(translateX) / elapsed;
        if (Math.abs(translateX) < 5 && elapsed < 200) { setTranslateX(0); return; }
        const threshold = velocity > 0.5 ? 50 : 100;
        if (translateX > threshold && currentIndex > 0) prevSlide();
        else if (translateX < -threshold && currentIndex < maxIndex) nextSlide();
        setTranslateX(0);
    };

    const handleMouseLeave = () => { if (isDragging) handleMouseUp(); };

    const handleTouchStart = (e) => {
        setStartX(e.touches[0].clientX);
        setStartTime(Date.now());
        setTranslateX(0);
    };

    const handleTouchMove = (e) => {
        const diff = e.touches[0].clientX - startX;
        setTranslateX(Math.max(-200, Math.min(200, diff)));
        if (Math.abs(diff) > 10) e.preventDefault();
    };

    const handleTouchEnd = () => {
        const elapsed = Date.now() - startTime;
        const velocity = Math.abs(translateX) / elapsed;
        const threshold = velocity > 0.5 ? 30 : 50;
        if (translateX > threshold && currentIndex > 0) prevSlide();
        else if (translateX < -threshold && currentIndex < maxIndex) nextSlide();
        setTranslateX(0);
    };

    const getTransformValue = () => {
        if (!carouselRef.current) return "translateX(0px)";
        const containerWidth = carouselRef.current.offsetWidth;
        const GAP = 16;
        const cardWidth = (containerWidth - (slidesPerView - 1) * GAP) / slidesPerView;
        const offset = currentIndex * (cardWidth + GAP);
        return `translateX(${-offset + translateX}px)`;
    };

    const handleCardClick = (serviceId, isActive) => {
        if (isDragging || Math.abs(translateX) > 5) return;
        if (isActive) navigate(`/services/${serviceId}`);
    };

    return (
        <section id="myServicesSection" className="relative w-full mb-10 overflow-x-hidden" style={{ scrollMarginTop: "24px" }} >
            {/* Panel lateral decorativo — entra desde la izquierda */}
            <div ref={panel.ref} className={`overflow-hidden absolute top-20 h-[660px] sm:h-[610px] md:bottom-0 left-0 w-[85%] sm:w-[80%] lg:w-1/2 bg-gray-50 dark:bg-zinc-900 shadow-[0_2px_8px_0_rgba(99,99,99,0.2)] dark:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5),0_32px_64px_-8px_rgba(0,0,0,0.35)] border border-zinc-200/50 dark:border-zinc-800/50 z-0 rounded-tr-[2rem] rounded-br-[2rem] sm:rounded-tr-[3rem] sm:rounded-br-[3rem] ${panel.anim('0ms').className}`} style={panel.anim('0ms').style}   >
                <div className="absolute top-0 right-0 w-[200px] h-[400px] bg-gradient-to-r from-zinc-600 to-zinc-400 opacity-40 dark:from-[#fff]/30 dark:to-[#e9e9e9]/30 dark:opacity-100 pointer-events-none" style={{ maskImage: "radial-gradient(farthest-side at right, white, transparent)", WebkitMaskImage: "radial-gradient(farthest-side at right, white, transparent)", }} />
                <div className="w-[85%] sm:w-[90%] ml-6 sm:ml-8 md:ml-10 mr-4 sm:mr-6 md:mr-10 my-6 sm:my-8 md:my-10 relative z-10 pb-3 border-b border-zinc-300 dark:border-zinc-700">
                    <div className="md:items-start md:justify-between md:gap-6">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-700 dark:text-zinc-100">
                            MIS <span>SERVICIOS</span>
                        </h2>
                        <p className="max-w-md text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 text-justify mt-2 sm:mt-3">
                            Desarrollo soluciones digitales integrando software, análisis de datos e inteligencia artificial para generar impacto real en los negocios.
                        </p>
                    </div>
                </div>
                <svg aria-hidden="true" className="absolute bottom-0 right-0 h-[70%] w-full fill-black/[0.02] stroke-black/[0.05] dark:fill-white/[0.01] dark:stroke-white/[0.03] pointer-events-none" style={{ transform: "skewY(-12deg)", transformOrigin: "bottom right" }} >
                    <defs>
                        <pattern id="grid_pattern_right" width="45" height="38" patternUnits="userSpaceOnUse">
                            <path d="M.5 38V.5H48" fill="none" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid_pattern_right)" />
                    <g opacity="0.4">
                        <rect width="44" height="39" x="92" y="38" fill="currentColor" className="text-zinc-400/20 dark:text-zinc-600/20" />
                        <rect width="44" height="39" x="182" y="114" fill="currentColor" className="text-zinc-400/20 dark:text-zinc-600/20" />
                        <rect width="44" height="39" x="135" y="190" fill="currentColor" className="text-zinc-400/20 dark:text-zinc-600/20" />
                    </g>
                </svg>
            </div>

            {/* Contenedor dots + carrusel */}
            <div className="ml-6 sm:ml-8 md:ml-10 pr-6 sm:pr-8 md:pr-10 relative mb-12 sm:mb-16 md:mb-20 pt-60 pb-12 sm:pb-16 md:pb-20">

                {/* Dots — entran con pequeño delay tras el panel */}
                {maxIndex > 0 && (
                    <div ref={dots.ref} className={`flex items-center gap-2 mt-4 mb-6 ${dots.anim('100ms').className}`} style={dots.anim('100ms').style} >
                        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                            <button key={i} onClick={() => setCurrentIndex(i)} className={`h-2 rounded-full transition-all duration-300 ${i === currentIndex ? "w-8 bg-zinc-600 dark:bg-zinc-300" : "w-2 bg-zinc-300 dark:bg-zinc-600 hover:bg-zinc-400 dark:hover:bg-zinc-500"}`} aria-label={`Ir al slide ${i + 1}`} />
                        ))}
                    </div>
                )}

                {/* Carrusel */}
                <div className="relative w-full">
                    <div style={{ clipPath: "inset(-16px -12px -16px -12px)", padding: "16px 12px", margin: "-16px -12px", }}>
                        <div ref={carouselRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} className="select-none w-full" style={{ cursor: isDragging ? "grabbing" : "grab" }}  >
                            <div className="flex gap-4" style={{ transform: getTransformValue(), transition: isDragging ? "none" : "transform 300ms ease-out", }}  >
                                {services.map((service, index) => {
                                    const reveal = cardReveal[index] ?? cardReveal[0];
                                    // Cada card entra con un pequeño delay escalonado
                                    const delay = `${150 + index * 80}ms`;
                                    return (
                                        <BentoCard key={service.id} service={service} onClick={handleCardClick} animRef={reveal.ref} animClassName={reveal.anim(delay).className} animStyle={{ ...reveal.anim(delay).style, width: `calc((100% - ${(slidesPerView - 1) * 16}px) / ${slidesPerView})`, }} />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default MyServicesSection;