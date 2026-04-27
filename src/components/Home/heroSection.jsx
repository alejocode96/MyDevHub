/**
 * @component HeroSection.jsx
 * @description Componente principal de sección hero que presenta el perfil profesional
 * con efectos visuales dinámicos, grid binario animado, consolas de código estilo IDE
 * y soporte completo para tema claro/oscuro.
 * @author Alejandro Galeano - AlejoCode
 * @version 1.0.0
 */

import React from 'react'
import { useContext } from 'react'
//contexto
import { MyDevHubContext } from '../../context'

//image
import personaje from '../../assets/landingPage/Alejandro_Code_Personaje.png'
const HeroSection = () => {

    /*Context*/
    const { theme, setTheme, toggleTheme } = useContext(MyDevHubContext);
    return (
        <section className='h-svh flex flex-col justify-center items-end transition-colors bg-white dark:bg-zinc-950 mt-16 '>
            {/*Contenedor con fondo visual y imagen */}
            <div className="absolute inset-0 w-full h-full flex justify-center overflow-hidden" style={{ maskImage: "linear-gradient(to bottom, black 20%, transparent 95%)", WebkitMaskImage: "linear-gradient(to bottom, black 20%, transparent 95%)", }}  >
                {/* fondo con binarios */}
                <div id="static-binary-grid" className={`static-binary-grid absolute inset-0 w-full h-full ${theme == "light" ? "binary-grid-light" : "binary-grid-dark"}`}></div>
                {/* Degradado vertical para crear profundidad y transición suave  De transparente a semi-opaco en la parte inferior */}
                <div className={`pointer-events-none absolute inset-0 z-20 bg-gradient-to-b from-transparent via-gray-50/20 to-gray-50/50  dark:bg-gradient-to-b dark:from-transparent dark:via-black/20 dark:to-black/50`}></div>
                {/* Efecto de luz radial azul centrado detrás de la imagen Dimensiones: 380x380px Blur: 3xl (48px en Tailwind) Color HSL: Ajustado según tema para mantener el contraste */}
                <div className={`absolute top-1/2 left-1/2 z-30 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-90 bg-[radial-gradient(circle,hsla(206,81.9%,45%,0.8),transparent)] dark:opacity-90 dark:bg-[radial-gradient(circle,hsla(206,81.9%,65.3%,0.6),transparent)]`}></div>
                <img src={personaje} alt="Alejandro Galeano - Ingeniero de Sistemas y Desarrollador" className="relative z-40 h-[80vh] mt-[60px] sm:mt-[70px] md:mt-[90px] mb-[10px] object-contain" style={{ maskImage: "linear-gradient(to bottom, black 90%, transparent 95%)", WebkitMaskImage: "linear-gradient(to bottom, black 90%, transparent 95%)", filter: theme ? "brightness(0.8)" : "brightness(0.5)", }}  ></img>
            </div>

            {/**Consola izquierda */}
            <div className="absolute left-3 sm:left-6 md:left-10 lg:left-12 top-[38%] sm:top-[36%] md:top-[35%] -translate-y-1/2 z-50 w-[120px] sm:w-[180px] md:w-[220px] lg:w-80">
                <div className="backdrop-blur-xl bg-white/10 dark:bg-zinc-900/30  rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 px-2 sm:px-3 py-1 sm:py-1.5 md:py-2 flex items-center gap-1 sm:gap-1.5 border-b border-gray-300/50 dark:border-gray-600/50">
                        <div className="flex gap-0.5 sm:gap-1">
                            <div className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500"></div>
                            <div className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-500"></div>
                            <div className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500"></div>
                        </div>
                        <span className="text-[7px] sm:text-[9px] text-gray-600 dark:text-gray-400 ml-1">profile.jsx</span>
                    </div>
                    <div className="p-2 sm:p-3 md:p-4">
                        <div className="w-16 sm:w-24 md:w-32 h-[1px] bg-blue-500 mb-1.5 sm:mb-2"></div>
                        <h2 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-light mb-1 sm:mb-2 leading-tight text-gray-800 dark:text-zinc-300">
                            <span className="text-blue-600 dark:text-blue-400 text-[8px] sm:text-xs md:text-sm">const</span>{" "}
                            <span className="text-purple-600 dark:text-purple-400 text-[9px] sm:text-xs md:text-sm">role</span>
                            <span className="text-gray-600 dark:text-gray-400 text-[8px] sm:text-xs md:text-sm">=</span>
                            <br></br>
                            <span className="text-emerald-600 dark:text-emerald-400 ml-1 sm:ml-2 block text-[10px] sm:text-base md:text-lg lg:text-xl">"Ingeniero de</span>
                            <span className="text-emerald-600 dark:text-emerald-400 ml-1 sm:ml-2 block text-[10px] sm:text-base md:text-lg lg:text-xl">Sistemas"</span>
                            <span className="text-emerald-600 dark:text-emerald-400 ml-1 sm:ml-2 block text-[10px] sm:text-base md:text-lg lg:text-xl">"& Desarrollador"</span>
                        </h2>
                    </div>
                </div>
            </div>

            {/* consola derecha */}
            <div className='absolute right-3 sm:right-6 md:right-10 lg:right-12 top-[60%] sm:top-[50%] md:top-1/2 -translate-y-1/2 z-50 w-[160px] sm:w-[180px] lg:w-80 '>
                <div className='backdrop-blur-xl bg-white/10 dark:bg-zinc-900/30 rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-xl overflow-hidden'>
                    <div className='bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 px-2 sm:px-3 py-1 sm:py-1.5 md:py-2 flex items-center gap-1 sm:gap-1.5 border-b border-gray-300/50 dark:border-gray-600/50'>
                        <div className='flex gap-0.5 sm:gap-1'>
                            <div className='w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500'></div>
                            <div className='w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-500'></div>
                            <div className='w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500'></div>
                        </div>
                        <span className='text-[7px] sm:text-[9px] text-gray-600 dark:text-gray-400 ml-1'>about.md</span>
                    </div>
                    <div className='p-2 sm:p-3 md:p-4'>
                        <p className='text-[8px] sm:text-[10px] md:text-xs lg:text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 '>
                            <span className='text-gray-500 dark:text-gray-500'>{"//"}</span>{" "}
                            <span className='font-bold text-blue-600 dark:text-blue-400'>¡Hola! Soy Alejandro Galeano</span>
                            <br></br>
                            <span className='text-gray-500 dark:text-gray-500'>{"//"}</span>{" "}
                            ingeniero en Sistemas de Información, desarrollador web y analista
                            de datos, apasionado por crear soluciones orientadas a resultados
                            mediante inteligencia artificial, automatización de procesos y el
                            desarrollo de agentes y asistentes autónomos que mejoran la
                            eficiencia y la experiencia del usuario.
                        </p>
                    </div>
                </div>
            </div>

            <div className='absolute bottom-6 md:bottom-10 left-0 right-0 z-50 flex flex-col justify-center px-4'>
                <p className='relative text-center text-blue-500 text-sm sm:text-base md:text-lg lg:text-xl font-extralight uppercase leading-1.5 tracking-[0.3em] sm:tracking-[0.4em] md:tracking-[0.5em]'>ALEJANDRO GALEANO</p>
                <h1 className={`relative z-10 text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-center font-sans font-bold bg-clip-text text-transparent bg-[radial-gradient(circle_at_center,_#1f2937_0%,_#6b7280_30%,_#d1d5db_80%)] dark:bg-[radial-gradient(circle_at_center,_#ffffff_0%,_#6b7280_30%,_#050607_80%)] `}>DEVELOPER</h1>
            </div>

        </section>
    )
}

export default HeroSection
