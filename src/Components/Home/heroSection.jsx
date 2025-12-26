import { useAppContext } from "../../context/AppContext";
import { useState } from "react";
import { Sun, Moon } from "lucide-react";
//imagenes
import AlejandroPersonaje from "../../assets/Alejandro_Code_Personaje.png";

const HeroSection = () => {
  
  const { theme, setTheme } = useAppContext();
  const isLight = theme === "light";
  return (
    <>
      <section className={`h-dvh flex flex-col justify-center items-end transition-colors ${isLight ? "bg-gray-50" : "bg-zinc-950" }`}>
        <div className="absolute inset-0 w-full h-full flex justify-center overflow-hidden" style={{ maskImage: "linear-gradient(to bottom, black 20%, transparent 95%)", WebkitMaskImage: "linear-gradient(to bottom, black 20%, transparent 95%)", }}>
            {/* Grid binario - ahora ocupa todo el espacio y está detrás */}
            <div id="static-binary-grid" className={`static-binary-grid absolute inset-0 w-full h-full ${isLight ? "binary-grid-light" : "binary-grid-dark" }`}></div>
            {/* Overlay */}
            <div className={`pointer-events-none absolute inset-0 z-20 ${isLight? "bg-gradient-to-b from-transparent via-gray-50/20 to-gray-50/50" : "bg-gradient-to-b from-transparent via-black/20 to-black/50" }`}></div>
            {/* Halo - responsive sizing */}
            <div className={`absolute top-1/2 left-1/2 z-30 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${isLight ? "opacity-90 bg-[radial-gradient(circle,hsla(206,81.9%,45%,0.8),transparent)]" : "opacity-90 bg-[radial-gradient(circle,hsla(206,81.9%,65.3%,0.6),transparent)]" }`}></div>
            {/* Imagen - responsive height and positioning */}
            <img src={AlejandroPersonaje} alt="imagen" className="relative z-40 h-[80vh] mt-[60px] sm:mt-[70px] md:mt-[90px] mb-[10px] object-contain" style={{ maskImage: "linear-gradient(to bottom, black 90%, transparent 95%)", WebkitMaskImage: "linear-gradient(to bottom, black 90%, transparent 95%)", filter: isLight ? "brightness(0.8)" : "brightness(0.5)", }}></img>
        </div>

         {/* Texto izquierdo - responsive positioning and sizing */}
        <div className="absolute left-3 sm:left-6 md:left-10 lg:left-12 top-[30%] sm:top-[32%] md:top-[35%] -translate-y-1/2 z-50 max-w-[160px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-xs">
            {/* Línea azul superior - responsive width */}
            <div className="w-20 sm:w-28 md:w-38 h-[1px] bg-blue-500 mb-0"></div>
            <h2 className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-light mb-2 leading-tight ${isLight ? "text-gray-800" : "text-white" }`}>
                Ingeniero de Sistemas <br />& Desarrollador
            </h2>
        </div>

        {/* Texto derecho - responsive positioning and sizing */}
        <div className="absolute right-3 sm:right-6 md:right-10 lg:right-12 top-[48%] sm:top-[50%] md:top-1/2 -translate-y-1/2 z-50 max-w-[160px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-xs">
            <p className={`text-[10px] sm:text-xs md:text-sm leading-relaxed ${isLight ? "text-gray-600" : "text-gray-300"}`}>
                <span className="font-bold">¡Hola! Soy Alejandro Galeano</span>, ingeniero en Sistemas de Información, desarrollador web y analista de datos, apasionado por crear soluciones orientadas a resultados mediante inteligencia artificial, automatización de procesos y el desarrollo de agentes y asistentes autónomos que mejoran la eficiencia y la experiencia del usuario.
            </p>
        </div>

        {/* Bottom text - responsive sizing and spacing */}
        <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 left-0 right-0 z-50 flex flex-col justify-center px-4">
            <p className="relative text-center text-blue-500 text-sm sm:text-base md:text-lg lg:text-xl font-extralight uppercase leading-1.5 tracking-[0.3em] sm:tracking-[0.4em] md:tracking-[0.5em]">
                ALEJANDRO GALEANO
            </p>
            <h1 className={`relative z-10 text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-center font-sans font-bold bg-clip-text text-transparent ${isLight ? "bg-[radial-gradient(circle_at_center,_#1f2937_0%,_#6b7280_30%,_#d1d5db_80%)]" : "bg-[radial-gradient(circle_at_center,_#ffffff_0%,_#6b7280_30%,_#050607_80%)]" }`}>
                DEVELOPER
            </h1>
        </div>
      </section>
    </>
  );
};

export default HeroSection;