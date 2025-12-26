import { useAppContext } from "../../context/AppContext";
import { useState } from "react";
import { Sun, Moon } from "lucide-react";
//imagenes
import AlejandroPersonaje from "../../assets/Alejandro_Code_Personaje.png";

const Home = () => {
    const { theme, setTheme } = useAppContext();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    const isLight = theme === "light";

    return (
        <>
            {/* Navbar */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xs border-b transition-colors ${isLight ? "bg-white/1 border-gray-200" : "bg-black/1 border-white/10"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div
                            className={`font-bold text-xl ${isLight ? "text-gray-900" : "text-white"
                                }`}
                        >
                            AG<span className="text-blue-500">.</span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex space-x-8 items-center">
                            <a
                                href="#home"
                                className={`transition-colors ${isLight
                                        ? "text-gray-600 hover:text-gray-900"
                                        : "text-gray-300 hover:text-white"
                                    }`}
                            >
                                Home
                            </a>
                            <a
                                href="#about"
                                className={`transition-colors ${isLight
                                        ? "text-gray-600 hover:text-gray-900"
                                        : "text-gray-300 hover:text-white"
                                    }`}
                            >
                                About
                            </a>
                            <a
                                href="#projects"
                                className={`transition-colors ${isLight
                                        ? "text-gray-600 hover:text-gray-900"
                                        : "text-gray-300 hover:text-white"
                                    }`}
                            >
                                Projects
                            </a>
                            <a
                                href="#contact"
                                className={`transition-colors ${isLight
                                        ? "text-gray-600 hover:text-gray-900"
                                        : "text-gray-300 hover:text-white"
                                    }`}
                            >
                                Contact
                            </a>

                            {/* Theme Toggle Button */}
                            <button
                                onClick={toggleTheme}
                                className={`p-2 rounded-lg transition-all ${isLight
                                        ? "bg-gray-100 hover:bg-gray-200 text-gray-900"
                                        : "bg-white/10 hover:bg-white/20 text-white"
                                    }`}
                                aria-label="Toggle theme"
                            >
                                {isLight ? <Moon size={20} /> : <Sun size={20} />}
                            </button>
                        </div>

                        {/* Mobile Menu Button & Theme Toggle */}
                        <div className="md:hidden flex items-center space-x-2">
                            <button
                                onClick={toggleTheme}
                                className={`p-2 rounded-lg transition-all ${isLight
                                        ? "bg-gray-100 hover:bg-gray-200 text-gray-900"
                                        : "bg-white/10 hover:bg-white/20 text-white"
                                    }`}
                                aria-label="Toggle theme"
                            >
                                {isLight ? <Moon size={20} /> : <Sun size={20} />}
                            </button>

                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className={`p-2 ${isLight ? "text-gray-900" : "text-white"}`}
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    {menuOpen ? (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {menuOpen && (
                        <div className="md:hidden pb-4">
                            <a
                                href="#home"
                                className={`block py-2 transition-colors ${isLight
                                        ? "text-gray-600 hover:text-gray-900"
                                        : "text-gray-300 hover:text-white"
                                    }`}
                            >
                                Home
                            </a>
                            <a
                                href="#about"
                                className={`block py-2 transition-colors ${isLight
                                        ? "text-gray-600 hover:text-gray-900"
                                        : "text-gray-300 hover:text-white"
                                    }`}
                            >
                                About
                            </a>
                            <a
                                href="#projects"
                                className={`block py-2 transition-colors ${isLight
                                        ? "text-gray-600 hover:text-gray-900"
                                        : "text-gray-300 hover:text-white"
                                    }`}
                            >
                                Projects
                            </a>
                            <a
                                href="#contact"
                                className={`block py-2 transition-colors ${isLight
                                        ? "text-gray-600 hover:text-gray-900"
                                        : "text-gray-300 hover:text-white"
                                    }`}
                            >
                                Contact
                            </a>
                        </div>
                    )}
                </div>
            </nav>

            <section
                className={`h-dvh flex flex-col justify-center items-end transition-colors ${isLight ? "bg-gray-50" : "bg-zinc-950"
                    }`}
            >
                <div
                    className="absolute inset-0 w-full h-full flex justify-center overflow-hidden"
                    style={{
                        maskImage: "linear-gradient(to bottom, black 20%, transparent 95%)",
                        WebkitMaskImage:
                            "linear-gradient(to bottom, black 10%, transparent 95%)",
                    }}
                >
                    {/* Grid binario - ahora ocupa todo el espacio y está detrás */}
                    <div
                        id="static-binary-grid"
                        className={`static-binary-grid absolute inset-0 w-full h-full ${isLight ? "binary-grid-light" : "binary-grid-dark"
                            }`}
                    />

                    {/* Overlay */}
                    <div
                        className={`pointer-events-none absolute inset-0 z-20 ${isLight
                                ? "bg-gradient-to-b from-transparent via-gray-50/20 to-gray-50/50"
                                : "bg-gradient-to-b from-transparent via-black/20 to-black/50"
                            }`}
                    ></div>

                    {/* Halo */}
                    <div
                        className={`absolute top-1/2 left-1/2 z-30 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${isLight
                                ? "opacity-90 bg-[radial-gradient(circle,hsla(206,81.9%,45%,0.8),transparent)]"
                                : "opacity-90 bg-[radial-gradient(circle,hsla(206,81.9%,65.3%,0.6),transparent)]"
                            }`}
                    ></div>

                    {/* Personaje */}
                    <img
                        src={AlejandroPersonaje}
                        alt="imagen"
                        className="relative z-40 h-[80vh] mt-[90px] mb-[10px] object-contain"
                        style={{
                            maskImage:
                                "linear-gradient(to bottom, black 90%, transparent 95%)",
                            WebkitMaskImage:
                                "linear-gradient(to bottom, black 90%, transparent 95%)",
                            filter: isLight ? "brightness(0.8)" : "brightness(0.5)",
                        }}
                    />
                </div>

                {/* Texto izquierdo */}
                <div className="absolute left-4 md:left-10 top-[35%] -translate-y-1/2 z-50 max-w-[200px] md:max-w-xs">
                    {/* Línea azul superior */}
                    <div className="w-38 h-[1px] bg-blue-500 mb-0"></div>
                    <h2
                        className={`text-2xl md:text-3xl font-light mb-2 ${isLight ? "text-gray-800" : "text-white"
                            }`}
                    >
                        Ingeniero de Sistemas <br />& Desarrollador
                    </h2>
                </div>

                {/* Texto derecho */}
                <div className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-50 max-w-[200px] md:max-w-xs">
                    <p
                        className={`text-xs md:text-sm leading-relaxed ${isLight ? "text-gray-600" : "text-gray-300"
                            }`}
                    >
                        Hi, I'm Ivan, a graphic designer, product designer and brand
                        illustrator passionate about crafting result driven designs and
                        giving your products an interesting story and voice.
                    </p>
                </div>

                <div className="absolute bottom-10 left-0 right-0 z-50 flex flex-col justify-center px-4">
                    <p className="relative text-center text-blue-500 text-xl font-extralight uppercase leading-1.5 tracking-[0.5em]">
                        ALEJANDRO GALEANO
                    </p>
                    <h1
                        className={`relative z-10 text-lg md:text-8xl text-center font-sans font-bold bg-clip-text text-transparent ${isLight
                                ? "bg-[radial-gradient(circle_at_center,_#1f2937_0%,_#6b7280_30%,_#d1d5db_80%)]"
                                : "bg-[radial-gradient(circle_at_center,_#ffffff_0%,_#6b7280_30%,_#050607_80%)]"
                            }`}
                    >
                        DEVELOPER
                    </h1>
                </div>
            </section>
        </>
    );
};

export default Home;
