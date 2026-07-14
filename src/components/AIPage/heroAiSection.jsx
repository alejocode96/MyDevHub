import React, { useState, useContext, useRef, useEffect } from 'react'

//contexto
import { MyDevHubContext } from '../../context';

//Iconos
import { Sun, Moon, Logs, ArrowRight, BookOpen, Wrench, FlaskConical, Bot } from "lucide-react";

//animaciones
import { useScrollReveal } from '../../hooks/useScrollReveal';

//imagenes
import logo from "../../assets/landingPage/logo.png"
import iaTools from "../../assets/IA_TOOLS.png"
import iaToolsLight from "../../assets/IA_TOOLS_W.png"

// navegación por scroll (no por hash, por conflicto con HashRouter)
import { scrollToSection } from '../../utils/scrollToSection';

/**
 * Opciones del menú — mismas 4 paradas del recorrido de IA generativa
 * (ajustar los href a los ids reales de cada sección en la página)
 */
const navMenuItems = [
    { name: "Conceptos", href: "#conceptosSection", icon: BookOpen },
    { name: "Técnicas", href: "#tecnicasSection", icon: Wrench },
    { name: "Práctica", href: "#practicaSection", icon: FlaskConical },
    { name: "Asistentes", href: "#asistentesSection", icon: Bot },
];

const HeroAiSection = () => {

    /*obtener thema actual y la funcion toggel desde el contexto global */
    const { theme, toggleTheme } = useContext(MyDevHubContext)
    const { ref, visible } = useScrollReveal({ threshold: 0, rootMargin: '0px', initialDelay: 50 })

    /**Animación de entrada del contenido principal (título+cta e imagen) —
     * mismo hook/patrón que el resto del sitio, con delays escalonados para
     * que aparezcan en secuencia. */
    const heroContent = useScrollReveal({ threshold: 0, rootMargin: '0px' })
    const heroImage = useScrollReveal({ threshold: 0, rootMargin: '0px' })

    /**Estado del menú dropdown (ahora válido para todos los tamaños de ventana) */
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    /**Cierra el dropdown al hacer click fuera */
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNavClick = (e, href) => {
        e.preventDefault();
        setIsMenuOpen(false);
        setTimeout(() => scrollToSection(href), 100);
    };

    return (
        <section className="relative w-full h-screen flex flex-col overflow-hidden px-4 md:px-8 pt-3 pb-4 md:pt-4 md:pb-6">
            {/* bg de fondo — sin cambios */}
            <div className="absolute inset-x-0 top-10 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl bg-white dark:bg-[#09090B]" aria-hidden="true">
                <div
                    className="aspect-[1108/532] h-auto w-[69.25rem] flex-none bg-gradient-to-r from-cyan-500 to-blue-800 opacity-20 dark:opacity-30"
                    style={{ clipPath: "polygon(77.5% 40.13%, 90% 10%, 100% 50%, 95% 80%, 92% 85%, 75% 65%, 61.26% 54.7%, 50% 54.7%, 47.24% 65.81%, 50% 85%, 26.16% 73.91%, 0.1% 100%, 1% 40.13%, 20% 48.75%, 60% 0.25%, 67.5% 32.63%)", }}>
                </div>
            </div>

            {/* svg a cuadros — sin cambios */}
            <svg className="absolute inset-0 -z-5 h-full w-full text-zinc-900/15 dark:text-white/10" width="100%" height="100%" aria-hidden="true" preserveAspectRatio="xMidYMid slice"   >
                <defs>
                    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                        <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>

                    <pattern id="highlightGrid" width="560" height="480" patternUnits="userSpaceOnUse">
                        <rect x="160" y="80" width="80" height="80" fill="rgba(100,100,100,0.2)" className="dark:fill-white/10" />
                        <rect x="400" y="240" width="80" height="80" fill="rgba(100,100,100,0.15)" className="dark:fill-white/8" />
                        <rect x="80" y="320" width="80" height="80" fill="rgba(100,100,100,0.1)" className="dark:fill-white/6" />
                        <rect x="320" y="160" width="80" height="80" fill="rgba(100,100,100,0.12)" className="dark:fill-white/7" />
                        <rect x="480" y="0" width="80" height="80" fill="rgba(100,100,100,0.14)" className="dark:fill-white/9" />
                        <rect x="0" y="240" width="80" height="80" fill="rgba(100,100,100,0.11)" className="dark:fill-white/6" />
                        <rect x="240" y="400" width="80" height="80" fill="rgba(100,100,100,0.13)" className="dark:fill-white/8" />
                    </pattern>

                    <radialGradient id="fade" cx="50%" cy="0%" r="75%">
                        <stop offset="0%" stopColor="white" stopOpacity="1" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </radialGradient>

                    <mask id="fadeMask">
                        <rect width="100%" height="100%" fill="url(#fade)" />
                    </mask>
                </defs>
                <rect width="100%" height="100%" fill="url(#highlightGrid)" mask="url(#fadeMask)" opacity="0.6" className="animate-pulse" />
                <rect width="100%" height="100%" fill="url(#grid)" mask="url(#fadeMask)" />
            </svg>

            {/* NAVBAR integrado — versión compacta (2 botones) para TODOS los tamaños de ventana.
                Ahora vive en el flujo normal (no absolute) y con poco padding, para pegarse
                arriba y no restarle alto disponible a las cards */}
            <nav ref={ref} className={`relative z-[100] w-full flex items-center justify-between flex-shrink-0 transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                <div className="w-full flex items-center justify-between">
                    <img src={logo} alt="Logo AlejoCode" className="h-[28px] md:h-[32px] object-contain"
                        style={{ maskImage: "linear-gradient(to bottom, black 90%, transparent 95%)", WebkitMaskImage: "linear-gradient(to bottom, black 90%, transparent 95%)" }} />

                    <div className="flex items-center gap-2">
                        {/* boton modo dark/light — mismo diseño que la versión mobile original */}
                        <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 ring-1 ring-zinc-200 dark:ring-zinc-800 rounded-xl shadow-sm p-1 flex-shrink-0 transition-all duration-300 ease-out hover:shadow-md hover:bg-zinc-100 hover:dark:bg-zinc-950 hover:ring-zinc-300 hover:dark:ring-zinc-700 active:scale-95 group">
                            <button onClick={toggleTheme} className="rounded-lg transition-all duration-300 p-1.5 text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200" aria-label="Cambiar tema">
                                {theme === "dark"
                                    ? <Sun size={18} strokeWidth={1.5} className="transition-all duration-500 ease-out group-hover:rotate-180 group-hover:scale-110" />
                                    : <Moon size={18} strokeWidth={1.5} className="transition-all duration-500 ease-out group-hover:-rotate-12 group-hover:scale-110" />}
                            </button>
                        </div>

                        {/* menu hamburguesa — mismo diseño, ahora visible siempre */}
                        <div className="relative" ref={dropdownRef}>
                            <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 ring-1 ring-zinc-200 dark:ring-zinc-800 rounded-xl shadow-sm p-1 flex-shrink-0 transition-all duration-300 ease-out hover:shadow-md hover:bg-zinc-100 hover:dark:bg-zinc-950 hover:ring-zinc-300 hover:dark:ring-zinc-700 active:scale-95 group">
                                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="rounded-lg transition-all duration-300 p-1.5 text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200" aria-label="Menu">
                                    <Logs size={18} strokeWidth={1.5} className={`transition-transform duration-300 ${isMenuOpen ? "" : "group-hover:-rotate-3"}`} />
                                </button>
                            </div>

                            <div className={`absolute top-full right-0 mt-2 w-48 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg z-50 py-1 origin-top-right transition-all duration-200 ease-out ${isMenuOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}>
                                {navMenuItems.map((item) => (
                                    <button key={item.name} onClick={(e) => handleNavClick(e, item.href)} className="w-full px-3 py-2 text-left text-zinc-500 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-600 dark:hover:text-white transition-colors duration-200 flex items-center gap-2 text-sm">
                                        <item.icon size={14} strokeWidth={1.5} />
                                        <span>{item.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Contenido principal — centrado en el alto restante, sin scroll.
                Layout 60/40: izquierda título+subtítulo+cta apilados, derecha la imagen.
                El justify-center centra matemáticamente el bloque, pero la imagen (con
                sombras fuertes) pesa visualmente más que el título, así que el espacio
                parejo se siente "pegado abajo". Un pequeño -translate-y corrige ese
                efecto óptico sin romper el centrado real. */}
            <div className="relative z-10 w-full mx-auto flex flex-col flex-1 min-h-0 justify-center">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 sm:gap-6 lg:gap-10 -translate-y-4 md:-translate-y-8">

                    {/* Izquierda: título, subtítulo y cta uno debajo del otro */}
                    <div ref={heroContent.ref} className={`lg:w-[44%] flex flex-col gap-2 sm:gap-4 ${heroContent.anim('0ms').className}`} style={heroContent.anim('0ms').style}>
                        <h1 style={{ fontFamily: "'Orbitron', monospace" }}
                            className="select-none pointer-events-none font-extrabold tracking-tight text-zinc-600 dark:text-white">
                            <span className="block leading-[0.95] lg:whitespace-nowrap text-[clamp(2rem,min(6vw,12vh),5.25rem)]">IA generativa</span>
                            <span className="block leading-[0.95] lg:whitespace-nowrap text-[clamp(2rem,min(6vw,12vh),5.25rem)]">sin humo:</span>
                            <span className="block leading-[1.05] mt-3 text-[clamp(1rem,min(3.2vw,5vh),1.9rem)]">conceptos, técnicas y asistentes reales</span>
                        </h1>

                        <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed max-w-xl">
                            Un recorrido en <span className="text-zinc-700 dark:text-zinc-200 font-semibold">4 pasos</span>: de los conceptos
                            que explican cómo piensa un modelo, a técnicas profesionales de prompting,
                            ejercicios prácticos y la creación de asistentes reales.
                        </p>

                        <button onClick={(e) => handleNavClick(e, '#conceptosSection')}
                            className="group cursor-pointer inline-flex items-center gap-2 sm:gap-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs sm:text-sm font-semibold pl-4 pr-1.5 py-1.5 sm:pl-5 sm:pr-2 sm:py-2 rounded-full w-fit shadow-md shadow-zinc-900/10 dark:shadow-black/30 hover:shadow-xl hover:shadow-zinc-900/20 dark:hover:shadow-black/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300">
                            Empieza por las bases
                            <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/15 dark:bg-zinc-900/10 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-cyan-400 dark:group-hover:bg-cyan-500 group-hover:text-white">
                                <ArrowRight size={12} className="sm:hidden" />
                                <ArrowRight size={15} className="hidden sm:block" />
                            </span>
                        </button>
                    </div>

                    {/* Derecha: imagen de herramientas de IA generativa, grande, centrada y visible.
                        Cambia de versión oscura a clara según el theme activo. El flotante va en
                        la imagen (no en el wrapper) para no chocar con la transform de entrada. */}
                    <div ref={heroImage.ref} className={`lg:w-[56%] flex items-center justify-center ${heroImage.anim('150ms').className}`} style={heroImage.anim('150ms').style}>
                        <img src={theme === "dark" ? iaTools : iaToolsLight} alt="Herramientas de IA generativa: ChatGPT, Claude, Midjourney, DALL-E 3, Runway, ElevenLabs, Notion AI"
                            className="animate-float w-full h-auto max-h-[36vh] sm:max-h-[38vh] md:max-h-[34vh] lg:max-h-[70vh] object-contain rounded-[28px]" />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroAiSection