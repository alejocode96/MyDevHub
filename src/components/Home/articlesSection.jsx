import React, { useRef } from 'react'
import { Clock, BookOpen, ArrowUpRight } from 'lucide-react';
import articlesData from '../../data/featured.json'
import { useNavigate } from 'react-router-dom';
import { assetUrl } from '../../utils/assetUrl';

// animación — la sección entera es una "card" 3D que se levanta hacia el
// usuario a medida que se hace scroll (scrubbed), con el título, la
// descripción y las 4 cards entrando en su propia secuencia dentro del
// mismo timeline — misma técnica y mismos valores que AboutSection, para
// mantener continuidad visual entre secciones.
import { gsap, useGSAP, responsiveMotion } from '../../utils/gsap';

// ─── Helper imagen o gradiente ────────────────────────────────────────────────
const getBgStyle = (image) => {
    if (!image) return {};
    const isUrl = image.startsWith('/') || image.startsWith('http') || image.startsWith('data:');
    return isUrl
        ? { backgroundImage: `url(${assetUrl(image)})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : { background: image };
};

// ─── Display articles ─────────────────────────────────────────────────────────
const getDisplayArticles = () => {
    const constructionArticle = {
        id: "const",
        title: " Próximo Artículo",
        category: "Próximamente",
        description: "Nuevo contenido en camino. este atento a nuestras próximas publicaciones.",
        image: "linear-gradient(135deg,rgba(37,37,79,1) 0%, rgba(0,0,0,1) 100%)",
        publicationDate: "Pendiente",
        active: false,
    }

    const articles = articlesData.filter(article => article.active);
    while (articles.length < 4) {
        articles.push({
            ...constructionArticle,
            id: `const-${articles.length}`
        });
    }

    return articles;
}

const articles = getDisplayArticles();

// ─── Card Tipo 1: Imagen arriba ───────────────────────────────────────────────
const ArticleCardType1 = ({ article }) => {
    const navigate = useNavigate();

    const handleRead = () => {
        if (article.active && article.href) navigate(article.href);
    }

    return (
        <div onClick={handleRead} className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-md bg-[#f4f4f5] dark:bg-zinc-800 transition-all duration-300 h-full hover:shadow-lg hover:-translate-y-1">
            <div className="p-3">
                <div className="h-48 w-full relative overflow-hidden rounded-xl" style={getBgStyle(article.image)}>
                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-full text-[10px] font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                            <BookOpen className='w-2.5 h-2.5'></BookOpen>
                            {article.category}
                        </span>
                        <span className="px-2 py-0.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-full text-[10px] font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                            <Clock className='w-2.5 h-2.5'></Clock>
                            {article.publicationDate}
                        </span>
                    </div>
                    {!article.active && (
                        <div className="absolute inset-0 dark:bg-black/60 bg-gray-200/60 backdrop-blur-sm flex items-center justify-center rounded-xl">
                            <div className="text-center px-4">
                                <div className='w-10 h-10 mx-auto mb-2 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center'>
                                    <BookOpen className="w-5 h-5 text-white" />
                                </div>
                                <p className='text-xs font-semibold text-white uppercase tracking-wider'>En construcción</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>


            <div className='px-4 pb-4 flex flex-col'>
                <div>
                    <div className="flex items-center gap-1 mb-1.5">
                        <span className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide line-clamp-1">{article.type}</span>
                    </div>
                    <h3 className='text-base font-bold text-zinc-800 dark:text-zinc-100 mb-1.5 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300'>
                        {article.title}
                    </h3>

                    <div className='w-full h-px bg-zinc-200 dark:bg-zinc-700 mb-2'></div>
                    <p className='text-xs text-zinc-500 dark:text-zinc-400 mb-4 line-clamp-3'>
                        {article.description}
                    </p>
                </div>
                <div className='flex items-center justify-start mt-auto'>
                    <button onClick={(e) => { e.stopPropagation(); handleRead(); }} disabled={!article.active} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-all duration-300 ${article.active ? "bg-zinc-200 dark:bg-zinc-700 hover:bg-blue-600 dark:hover:bg-blue-500 text-zinc-900 dark:text-zinc-100 hover:text-white dark:hover:text-white shadow-md hover:shadow-lg" : "bg-zinc-300 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-500 cursor-not-allowed"}`}>
                        {article.active ? "Leer más" : "Próximamente"}
                        {article.active && <ArrowUpRight className='w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-0.5 transition-transform duration-300'></ArrowUpRight>}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Card Tipo 2: Imagen a la derecha ─────────────────────────────────────────
const ArticleCardType2 = ({ article }) => {
    const navigate = useNavigate();

    const handleRead = () => {
        if (article.active && article.href) navigate(article.href);
    }

    return (
    <div onClick={handleRead} className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-md bg-[#f4f4f5] dark:bg-zinc-800 transition-all duration-300 h-full hover:shadow-lg hover:-translate-y-1 flex flex-row-reverse">
        <div className="w-1/2 p-3">
            <div className="h-full w-full min-h-[140px] relative overflow-hidden rounded-xl" style={getBgStyle(article.image)}>
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
                <div className="absolute top-2 left-2 right-2 flex flex-col gap-1.5 items-start">
                    <span className="px-2 py-0.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-full text-[10px] font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                        <BookOpen className="w-2.5 h-2.5" />
                        {article.category}
                    </span>
                    {article.active && (
                        <span className="px-2 py-0.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-full text-[10px] font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {article.publicationDate}
                        </span>
                    )}
                </div>
                {!article.active && (
                    <div className="absolute inset-0 bg-gray-200/60 dark:bg-black/60 rounded-xl backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center px-4">
                            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-xs hidden md:flex font-semibold text-white uppercase tracking-wider">En construcción</p>
                        </div>
                    </div>
                )}
            </div>
        </div>

        <div className="w-1/2 p-4 flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-1 mb-1.5">
                    <span className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide line-clamp-1">{article.type}</span>
                </div>
                <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-100 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {article.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-3">{article.description}</p>
            </div>
            <div className="mt-auto">
                <button onClick={(e) => { e.stopPropagation(); handleRead(); }} disabled={!article.active} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-all duration-300 w-fit ${article.active ? "bg-zinc-200 dark:bg-zinc-700 hover:bg-blue-600 dark:hover:bg-blue-500 text-zinc-900 dark:text-zinc-100 hover:text-white dark:hover:text-white shadow-md hover:shadow-lg" : "bg-zinc-300 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-500 cursor-not-allowed"}`}  >
                    {article.active ? "Leer más" : "Próximamente"}
                    {article.active && <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />}
                </button>
            </div>
        </div>
    </div>
    )
}

// ─── Card Tipo 3: Contenido sobre la imagen ───────────────────────────────────
const ArticleCardType3 = ({ article }) => {
    const navigate = useNavigate();

    const handleRead = () => {
        if (article.active && article.href) navigate(article.href);
    }

    return (
    <div onClick={handleRead} className="relative group cursor-pointer rounded-xl overflow-hidden shadow-md transition-all duration-300 h-full hover:shadow-lg hover:-translate-y-1" style={getBgStyle(article.image)}>
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/60" />
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
            <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-[10px] font-semibold text-white flex items-center gap-1">
                <BookOpen className="w-2.5 h-2.5" />
                {article.category}
            </span>
            {article.active && (
                <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-[10px] font-medium text-white/90 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {article.publicationDate}
                </span>
            )}
        </div>
        {!article.active && (
            <div className="absolute inset-0 bg-gray-200/60 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-20 rounded-xl">
                <div className="text-center px-4">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs font-semibold text-white uppercase tracking-wider">En construcción</p>
                </div>
            </div>
        )}
        <div className="relative z-10 p-4 h-full flex flex-col justify-between pt-12">
            <div>
                <div className="flex items-center gap-1 mb-1.5">
                    <span className="text-[10px] font-semibold text-white/90 uppercase tracking-wide line-clamp-1">{article.type}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2 line-clamp-1">{article.title}</h3>
                <p className="text-xs text-white/80 mb-3 line-clamp-3">{article.description}</p>
            </div>
            <div className="mt-auto">
                <button onClick={(e) => { e.stopPropagation(); handleRead(); }} disabled={!article.active} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-all duration-300 w-fit ${article.active ? "bg-white text-zinc-900 hover:bg-zinc-100 shadow-md hover:shadow-lg" : "bg-white/30 text-white/50 cursor-not-allowed"}`}  >
                    {article.active ? "Leer más" : "Próximamente"}
                    {article.active && <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />}
                </button>
            </div>
        </div>
    </div>
    )
}

const ArticlesSection = () => {
    const sectionRef = useRef(null)
    const blobLeftRef = useRef(null)
    const blobRightRef = useRef(null)
    const titleRef = useRef(null)
    const descRef = useRef(null)
    const card1Ref = useRef(null)
    const card2Ref = useRef(null)
    const card3Ref = useRef(null)
    const card4Ref = useRef(null)

    useGSAP(() => {
        const cards = [card1Ref.current, card2Ref.current, card3Ref.current, card4Ref.current]

        // Estado oculto de todo lo que entra, aplicado de inmediato
        // (ver el mismo criterio explicado en AboutSection)
        const hideAll = () => {
            gsap.set(sectionRef.current, { transformPerspective: 1000, transformOrigin: '50% 100%', rotationX: 18, y: 140, scale: 0.92, opacity: 0 })
            gsap.set([titleRef.current, descRef.current], { y: 30, opacity: 0 })
            gsap.set(cards, { y: 50, opacity: 0, scale: 0.8, rotationX: 25, transformPerspective: 800 })
        }

        // El layout pasa a una sola columna (las 4 cards apiladas) por
        // debajo de 768px (Tailwind md:flex-row) y ahí la sección se vuelve
        // mucho más alta que el viewport. Un timeline compartido atado al
        // TOP de la sección falla en ese caso — mismo problema medido en
        // AboutSection: el título queda pegado arriba de una sección muy
        // alta y por scroll normal ya sale de pantalla antes de que el
        // timeline compartido termine de revelarlo. En mobile cada pieza
        // usa SU PROPIO trigger, así que revela exactamente cuando ESA
        // pieza entra en pantalla.
        gsap.matchMedia().add(responsiveMotion(768), (context) => {
            const { isDesktop } = context.conditions

            if (isDesktop) {
                hideAll()

                gsap.timeline({
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 140%', end: 'top 90%', scrub: 1 },
                }).to(sectionRef.current, { rotationX: 0, y: 0, scale: 1, opacity: 1, ease: 'none', duration: 1 })

                gsap.timeline({
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 115%', end: 'top 55%', scrub: 1 },
                })
                    .to(titleRef.current, { y: 0, opacity: 1, ease: 'none', duration: 0.35 }, 0)
                    .to(descRef.current, { y: 0, opacity: 1, ease: 'none', duration: 0.35 }, 0.12)
                    .to(cards, { y: 0, opacity: 1, scale: 1, rotationX: 0, ease: 'none', duration: 0.4, stagger: 0.1 }, 0.3)
                return
            }

            // Mobile — el contenedor conserva el mismo lenguaje "card 3D"
            // que el resto de las secciones (más sutil: menos grados y más
            // perspectiva, porque acá el elemento es mucho más alto y
            // angosto que en desktop). Arranca temprano ('top 140%') para
            // absorber el espacio vacío antes de esta sección (ver
            // comentario del parallax, más abajo). El contenido de ADENTRO
            // sigue con reveal simple por su cuenta (ver AboutSection).
            gsap.set(sectionRef.current, { transformPerspective: 1600, transformOrigin: '50% 100%', rotationX: 10, y: 60, scale: 0.95, opacity: 0 })
            gsap.timeline({
                scrollTrigger: { trigger: sectionRef.current, start: 'top 140%', end: 'top 95%', scrub: 1 },
            }).to(sectionRef.current, { rotationX: 0, y: 0, scale: 1, opacity: 1, ease: 'none', duration: 1 })

            const revealOwn = (target, { start = 'top 88%', end = 'top 55%', ...from }) => {
                gsap.set(target, from)
                const to = { opacity: 1 }
                if ('y' in from) to.y = 0
                if ('scale' in from) to.scale = 1
                gsap.timeline({
                    scrollTrigger: { trigger: target, start, end, scrub: 1 },
                }).to(target, { ...to, ease: 'none', duration: 1 })
            }

            revealOwn(titleRef.current, { y: 24, opacity: 0 })
            revealOwn(descRef.current, { y: 24, opacity: 0 })
            cards.forEach((card) => revealOwn(card, { y: 30, opacity: 0, scale: 0.92 }))
        })

        // Parallax conector — los dos blobs decorativos se mueven en
        // direcciones opuestas mientras se atraviesa la sección, dando
        // continuidad con el resto de las secciones del Home
        gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
            const st = { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 }
            gsap.to(blobLeftRef.current, { yPercent: -20, ease: 'none', scrollTrigger: st })
            gsap.to(blobRightRef.current, { yPercent: 20, ease: 'none', scrollTrigger: st })
        })
    }, { scope: sectionRef })

    return (
        <section ref={sectionRef} id="articlesSection" className="relative overflow-hidden bg-gray-50 dark:bg-zinc-900 mb-10 rounded-4xl shadow-[0_2px_8px_0_rgba(99,99,99,0.2)] border border-zinc-200/50 dark:border-zinc-800/50 py-12 px-4 sm:px-6 lg:px-8 will-change-transform" style={{ scrollMarginTop: '24px' }}>
            <div ref={blobLeftRef} className="absolute -bottom-30 -left-5 w-[200px] h-[400px] bg-gradient-to-r from-zinc-600 to-zinc-400 opacity-40 dark:from-[#fff]/30 dark:to-[#e9e9e9]/30 dark:opacity-100 pointer-events-none" style={{ maskImage: "radial-gradient(farthest-side at left, white, transparent)", WebkitMaskImage: "radial-gradient(farthest-side at left, white, transparent)" }} />
            <div ref={blobRightRef} className="absolute top-0 right-0 w-[200px] h-[400px] bg-gradient-to-r from-zinc-600 to-zinc-400 opacity-40 dark:from-[#fff]/30 dark:to-[#e9e9e9]/30 dark:opacity-100 pointer-events-none" style={{ maskImage: "radial-gradient(farthest-side at right, white, transparent)", WebkitMaskImage: "radial-gradient(farthest-side at right, white, transparent)" }} />
            <div className='w-[98%] mx-auto relative z-10 pb-2 border-b border-zinc-300 dark:border-zinc-700'>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between md:gap-6">
                    <h2 ref={titleRef} className='text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-700 dark:text-zinc-100'>
                        PUBLICACIONES
                    </h2>
                    <p ref={descRef} className='max-w-md text-xs text-zinc-600 dark:text-zinc-300 text-justify'>
                        Explora guías paso a paso, artículos técnicos y tutoriales prácticos
                        para mejorar tus habilidades en desarrollo y tecnología.
                    </p>
                </div>
            </div>

            <div className="w-[98%] mx-auto place-items-center lg:place-items-stretch relative z-10">
                {/* ── Layout principal ── */}
                <div className='flex flex-col md:flex-row gap-4 md:h-[450px] pt-6'>
                    {/* Card 1 — ocupa toda la altura en desktop */}
                    <div ref={card1Ref} className='w-full md:w-[45%] md:h-full will-change-transform'>
                        <ArticleCardType1 article={articles[0]} />
                    </div>

                    {/* Columna derecha */}
                    <div className="w-full md:w-[55%] flex flex-col gap-4">

                        {/* Card 2 */}
                        <div ref={card2Ref} className='md:h-[48%] will-change-transform'>
                            <ArticleCardType2 article={articles[1]} />
                        </div>

                        {/* Cards 3 y 4 */}
                        <div className="flex flex-col sm:flex-row gap-4 md:h-[48%]">

                            <div ref={card3Ref} className='sm:w-1/2 md:h-full will-change-transform'>
                                {/* Desktop → Type3, Mobile → Type1 */}
                                <div className="hidden md:block h-full">
                                    <ArticleCardType3 article={articles[2]} />
                                </div>
                                <div className="block md:hidden">
                                    <ArticleCardType1 article={articles[2]} />
                                </div>
                            </div>

                            <div ref={card4Ref} className='sm:w-1/2 md:h-full will-change-transform'>
                                {/* Desktop → Type3, Mobile → Type2 */}
                                <div className="hidden md:block h-full">
                                    <ArticleCardType3 article={articles[3]} />
                                </div>
                                <div className="block md:hidden">
                                    <ArticleCardType2 article={articles[3]} />
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default ArticlesSection
