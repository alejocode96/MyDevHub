/**
 * @component ContactForm.jsx
 * @description Sección de contacto: un único formulario cuyos datos se pueden enviar
 * por correo (vía Formspree, sin depender de que el visitante tenga un cliente de
 * correo configurado) o por WhatsApp (abre un chat con el mensaje ya redactado).
 * Si el envío por correo falla, se le indica al usuario que escriba por WhatsApp.
 * Diseño compacto: pensado para caber en una sola pantalla en desktop.
 * @author Alejandro Galeano - AlejoCode
 * @version 1.4.0
 */

import React, { useState, useRef } from 'react';
import { Mail, X, Send, User, MessageSquare, Clock, MessageCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

// animación — reveal en cascada + parallax conector con la sección anterior
import { gsap, useGSAP, responsiveMotion } from '../../utils/gsap';

// íconos de marca y datos de contacto compartidos
import { GithubIcon, LinkedinIcon } from '../icons/brandIcons';
import { EMAIL_DESTINO, WHATSAPP_NUMERO, GITHUB_URL, LINKEDIN_URL } from '../../data/contact';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xjgqdvnp';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        asunto: '',
        mensaje: ''
    });

    const [errors, setErrors] = useState({});
    // Canal/resultado del último intento de envío ('correo' | 'correo-error' | 'whatsapp' | null)
    const [canalEnviado, setCanalEnviado] = useState(null);
    const [enviandoCorreo, setEnviandoCorreo] = useState(false);

    // ── El bloque completo se levanta en 3D con el scroll (mismo lenguaje
    // que About/Services/Articles), y DENTRO de esa misma entrada, todo el
    // componente se anima pieza por pieza — es un formulario, así que la
    // metáfora es que se "arma" a medida que aparece: ícono, título,
    // párrafo y redes a la izquierda, luego cada campo del formulario
    // (Nombre+Correo, Asunto, Mensaje, botones) entra por su cuenta a la
    // derecha, como si se fuera completando. El ícono de correo además
    // queda con un pulso continuo una vez visible. ─────────────────────────
    const sectionRef = useRef(null)
    const blobRef = useRef(null)
    const contentRef = useRef(null)
    const leftColRef = useRef(null)
    const iconWrapRef = useRef(null)
    const headingRef = useRef(null)
    const paraRef = useRef(null)
    const socialRef = useRef(null)
    const mailtoRef = useRef(null)
    const formRef = useRef(null)
    const rowNameEmailRef = useRef(null)
    const asuntoRef = useRef(null)
    const mensajeRef = useRef(null)
    const actionsRef = useRef(null)

    useGSAP(() => {
        const socialIcons = socialRef.current.children
        const formFields = [rowNameEmailRef.current, asuntoRef.current, mensajeRef.current, actionsRef.current]

        // El layout pasa a una sola columna por debajo de 1024px (Tailwind
        // lg:grid-cols-12) — bastante antes que el resto de las secciones,
        // porque acá hasta tablets en landscape apilan. Igual que en
        // About/Articles: un cascade compartido atado al TOP de la sección
        // no sirve una vez que la sección se vuelve mucho más alta que el
        // viewport — comprobado con Playwright: en mobile, "acciones" (el
        // botón de envío) ya estaba en opacity ~1 la primera vez que
        // entraba en pantalla, es decir que el cascade lo daba por
        // terminado ANTES de que el usuario llegara a verlo por scroll
        // normal. En mobile cada pieza usa su propio trigger.
        gsap.matchMedia().add(responsiveMotion(1024), (context) => {
            const { isDesktop } = context.conditions

            if (isDesktop) {
                // Estado oculto inmediato — el bloque completo Y cada pieza
                // con su propio movimiento (y + scale, algunas con rotate)
                // — no solo un fade: el desplazamiento del contenedor es
                // grande (140px) y si las piezas de adentro solo se movían
                // 16-20px, ese movimiento quedaba "tapado" por el del
                // contenedor y se sentía como si nada de adentro animara.
                // Mismo criterio de intensidad que las mini-cards de
                // AboutSection (y + scale marcados).
                gsap.set(contentRef.current, { transformPerspective: 1000, transformOrigin: '50% 100%', rotationX: 18, y: 140, scale: 0.92, opacity: 0 })
                // La columna izquierda es su propio contenedor — mismo
                // criterio que el form: además de que cada pieza de adentro
                // (ícono, título, párrafo, redes, mailto) anima por su
                // cuenta, el contenedor que las agrupa también entra como
                // mini-card 3D, para que quede simétrico con el form
                gsap.set(leftColRef.current, { y: 36, scale: 0.96, rotationX: 16, transformPerspective: 900, transformOrigin: '50% 100%', opacity: 0 })
                gsap.set(iconWrapRef.current, { y: -30, rotate: -25, scale: 0.5, opacity: 0 })
                gsap.set(headingRef.current, { y: 34, scale: 0.94, opacity: 0 })
                gsap.set(paraRef.current, { y: 30, scale: 0.96, opacity: 0 })
                gsap.set(mailtoRef.current, { y: 24, opacity: 0 })
                gsap.set(socialIcons, { scale: 0.3, opacity: 0 })
                // El form (la card con sombra y borde) entra como una
                // mini-card 3D más, mismo lenguaje que las de AboutSection
                gsap.set(formRef.current, { y: 36, scale: 0.96, rotationX: 16, transformPerspective: 900, transformOrigin: '50% 100%', opacity: 0 })
                gsap.set(formFields, { y: 34, opacity: 0, scale: 0.93 })

                // Levante 3D del bloque — rápido, solo establece el plano
                gsap.timeline({
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 95%', end: 'top 70%', scrub: 1 },
                }).to(contentRef.current, { rotationX: 0, y: 0, scale: 1, opacity: 1, ease: 'none', duration: 1 })

                // Ensamblaje pieza por pieza — columna izquierda primero,
                // formulario campo a campo después, en un rango de scroll
                // más generoso para que el stagger se sienta sin atropello
                gsap.timeline({
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 88%', end: 'top 38%', scrub: 1 },
                })
                    .to(leftColRef.current, { y: 0, scale: 1, rotationX: 0, opacity: 1, ease: 'none', duration: 0.35 }, 0)
                    .to(iconWrapRef.current, { y: 0, rotate: 0, scale: 1, opacity: 1, ease: 'none', duration: 0.35 }, 0.05)
                    .to(headingRef.current, { y: 0, scale: 1, opacity: 1, ease: 'none', duration: 0.3 }, 0.1)
                    .to(paraRef.current, { y: 0, scale: 1, opacity: 1, ease: 'none', duration: 0.3 }, 0.18)
                    .to(socialIcons, { scale: 1, opacity: 1, ease: 'none', duration: 0.25, stagger: 0.06 }, 0.28)
                    .to(mailtoRef.current, { y: 0, opacity: 1, ease: 'none', duration: 0.25 }, 0.4)
                    .to(formRef.current, { y: 0, scale: 1, rotationX: 0, opacity: 1, ease: 'none', duration: 0.3 }, 0.45)
                    .to(formFields, { y: 0, opacity: 1, scale: 1, ease: 'none', duration: 0.35, stagger: 0.13 }, 0.55)
            } else {
                // Mobile — el contenedor conserva el mismo lenguaje "card
                // 3D" (más sutil que en desktop, ver AboutSection), y cada
                // pieza de adentro revela atada a SU PROPIA posición.
                gsap.set(contentRef.current, { transformPerspective: 1600, transformOrigin: '50% 100%', rotationX: 10, y: 60, scale: 0.95, opacity: 0 })
                gsap.timeline({
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 92%', end: 'top 65%', scrub: 1 },
                }).to(contentRef.current, { rotationX: 0, y: 0, scale: 1, opacity: 1, ease: 'none', duration: 1 })

                const revealOwn = (target, from) => {
                    gsap.set(target, from)
                    const to = { opacity: 1 }
                    if ('y' in from) to.y = 0
                    if ('scale' in from) to.scale = 1
                    if ('rotate' in from) to.rotate = 0
                    if ('rotationX' in from) to.rotationX = 0
                    gsap.timeline({
                        scrollTrigger: { trigger: target, start: 'top 88%', end: 'top 55%', scrub: 1 },
                    }).to(target, { ...to, ease: 'none', duration: 1 })
                }

                // La columna izquierda es su propio contenedor acá también,
                // simétrico con el form (ver comentario en la rama desktop)
                revealOwn(leftColRef.current, { y: 20, scale: 0.95, rotationX: 12, transformPerspective: 900, transformOrigin: '50% 100%', opacity: 0 })
                revealOwn(iconWrapRef.current, { y: -16, rotate: -18, opacity: 0 })
                revealOwn(headingRef.current, { y: 20, opacity: 0 })
                revealOwn(paraRef.current, { y: 20, opacity: 0 })
                Array.from(socialIcons).forEach((icon) => revealOwn(icon, { scale: 0.4, opacity: 0 }))
                revealOwn(mailtoRef.current, { y: 20, opacity: 0 })
                // El form (la card con sombra y borde) entra como mini-card
                // 3D acá también, mismo criterio que en desktop
                revealOwn(formRef.current, { y: 20, scale: 0.95, rotationX: 12, transformPerspective: 900, transformOrigin: '50% 100%', opacity: 0 })
                formFields.forEach((field) => revealOwn(field, { y: 24, opacity: 0, scale: 0.96 }))
            }
        })

        // Detalle vivo — el ícono de correo respira suavemente en loop,
        // sin depender del scroll (GSAP repeat + yoyo, no usado en el
        // resto de la página hasta ahora)
        gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
            gsap.to(iconWrapRef.current, { scale: 1.08, duration: 1.6, ease: 'sine.inOut', repeat: -1, yoyo: true })

            // Parallax conector — la figura de fondo se desplaza con el
            // scroll, dando continuidad al cerrar la página
            gsap.to(blobRef.current, {
                yPercent: -15,
                ease: 'none',
                scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
            })
        })
    }, { scope: sectionRef })
    // ─────────────────────────────────────────────────────────────────────

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Limpiar error del campo cuando el usuario escribe
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Validar formulario (los mismos campos son obligatorios sin importar el canal elegido)
    const validateForm = () => {
        const newErrors = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        }

        if (!formData.correo.trim()) {
            newErrors.correo = 'El correo es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo.trim())) {
            newErrors.correo = 'Ingresa un correo válido';
        }

        if (!formData.asunto.trim()) {
            newErrors.asunto = 'El asunto es requerido';
        }

        if (!formData.mensaje.trim()) {
            newErrors.mensaje = 'El mensaje es requerido';
        } else if (formData.mensaje.trim().length < 10) {
            newErrors.mensaje = 'El mensaje debe tener al menos 10 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Limpia el formulario y muestra el aviso de confirmación del canal usado.
    // Si el correo falló, se conservan los datos para que el usuario no los pierda al reintentar.
    const finalizarEnvio = (canal) => {
        setCanalEnviado(canal);

        if (canal !== 'correo-error') {
            setTimeout(() => {
                setFormData({ nombre: '', correo: '', asunto: '', mensaje: '' });
                setErrors({});
            }, 500);
        }

        setTimeout(() => setCanalEnviado(null), 7000);
    };

    // Enviar por correo: manda los datos a Formspree por AJAX (no depende de que el
    // visitante tenga un cliente de correo configurado). Si falla, se le sugiere WhatsApp.
    const handleEmailSubmit = async (e) => {
        e.preventDefault();

        if (enviandoCorreo || !validateForm()) {
            return;
        }

        setEnviandoCorreo(true);

        try {
            const respuesta = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    name: formData.nombre,
                    email: formData.correo,
                    _subject: formData.asunto,
                    message: formData.mensaje,
                }),
            });

            finalizarEnvio(respuesta.ok ? 'correo' : 'correo-error');
        } catch {
            finalizarEnvio('correo-error');
        } finally {
            setEnviandoCorreo(false);
        }
    };

    // Enviar por WhatsApp: arma el mensaje con los datos del formulario, ya con formato
    const handleWhatsappSubmit = () => {
        if (!validateForm()) {
            return;
        }

        const mensaje = `Hola Alejandro, mi nombre es ${formData.nombre}.\n\n*Correo:* ${formData.correo}\n*Asunto:* ${formData.asunto}\n\n${formData.mensaje}`;
        const whatsappLink = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;

        window.open(whatsappLink, '_blank', 'noopener,noreferrer');
        finalizarEnvio('whatsapp');
    };

    return (
        <section ref={sectionRef} id="contactSection" className="pt-8 h-auto relative" style={{ scrollMarginTop: '24px' }}>
            <div ref={contentRef} className="relative mx-auto mt-16 max-w-full p-4 sm:p-6 pb-8 pt-16 lg:px-8 will-change-transform">
                {/* Línea superior fina */}
                <div aria-hidden="true" className="user-select-none center pointer-events-none absolute -top-0.5 left-1/2 h-px w-4/5 max-w-[500px] -translate-x-1/2 -translate-y-1/2 transform-gpu [background:linear-gradient(90deg,rgba(0,0,0,0)_0%,rgba(2,132,199,0.65)_50%,rgba(0,0,0,0)_100%)]"></div>

                {/* Línea inferior fina, cierra la sección igual que empieza */}
                <div aria-hidden="true" className="user-select-none center pointer-events-none absolute -bottom-0.5 left-1/2 h-px w-4/5 max-w-[500px] -translate-x-1/2 translate-y-1/2 transform-gpu [background:linear-gradient(90deg,rgba(0,0,0,0)_0%,rgba(2,132,199,0.65)_50%,rgba(0,0,0,0)_100%)]"></div>

                {/* efecto linea */}
                <div aria-hidden="true" className="user-select-none center pointer-events-none absolute -top-1 left-1/2 h-[200px] w-full max-w-[300px] -translate-x-1/2 -translate-y-1/2 transform-gpu bg-[conic-gradient(from_90deg_at_50%_50%,#52525b00_50%,white_50%),radial-gradient(rgba(82,82,91,0.06)_0%,transparent_70%)] dark:[background:conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#09090b_50%),radial-gradient(rgba(200,200,200,0.05)_0%,transparent_70%)] md:max-w-[600px]"></div>

                <div className="relative isolate bg-white dark:bg-[#09090B]">

                    {/* Patrón SVG de fondo */}
                    <svg className="absolute inset-0 -z-10 h-full w-full dark:stroke-white/50 stroke-zinc-400 [mask-image:radial-gradient(40%_80%_at_center,black,transparent)]" aria-hidden="true">
                        <defs>
                            <pattern id="cta" width="80" height="80" x="50%" y="-1" patternUnits="userSpaceOnUse">
                                <path d="M.5 200V.5H200" fill="none"></path>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" strokeWidth="0" fill="url(#cta)" />
                    </svg>

                    {/* Fondo de figura decorativa */}
                    <div className="absolute inset-0 flex transform-gpu justify-center overflow-hidden blur-3xl bg-white dark:bg-[#09090B]" aria-hidden="true">
                        <div
                            ref={blobRef}
                            className="aspect-[1108/532] h-auto w-[69.25rem] flex-none bg-gradient-to-r from-cyan-500 to-blue-800 opacity-20 dark:opacity-20"
                            style={{ clipPath: "polygon(77.5% 40.13%, 90% 10%, 100% 50%, 95% 80%, 92% 85%, 75% 65%, 61.26% 54.7%, 50% 54.7%, 47.24% 65.81%, 50% 85%, 26.16% 73.91%, 0.1% 100%, 1% 40.13%, 20% 48.75%, 60% 0.25%, 67.5% 32.63%)" }}>
                        </div>
                    </div>

                    {/* Contenido principal */}
                    <div className="relative z-10 mx-auto w-full">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

                            {/* Columna izquierda - Información, más angosta para darle más ancho al formulario */}
                            <div ref={leftColRef} className="lg:col-span-5 flex flex-col items-center text-center will-change-transform">
                                <div ref={iconWrapRef} className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full mb-4 shadow-lg shadow-blue-500/50 will-change-transform">
                                    <Mail className="w-7 h-7 text-white" />
                                </div>

                                <h2 ref={headingRef} className="leading-tight bg-gradient-to-br from-gray-600 to-gray-900 dark:from-white dark:to-zinc-500 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
                                    ¿Listo para trabajar juntos?
                                </h2>

                                <p ref={paraRef} className="mt-3 max-w-sm text-sm sm:text-base text-zinc-700 dark:text-zinc-400/80">
                                    Cuéntame sobre tu proyecto y hagamos realidad esas ideas.
                                    Estoy aquí para ayudarte a crear soluciones innovadoras.
                                </p>

                                {/* Redes sociales */}
                                <div ref={socialRef} className="mt-5 flex items-center gap-3">
                                    <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="flex items-center justify-center w-9 h-9 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-blue-500 hover:text-blue-600 dark:hover:border-cyan-400 dark:hover:text-cyan-400 transition-colors duration-200">
                                        <GithubIcon className="w-4 h-4" />
                                    </a>
                                    <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex items-center justify-center w-9 h-9 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-blue-500 hover:text-blue-600 dark:hover:border-cyan-400 dark:hover:text-cyan-400 transition-colors duration-200">
                                        <LinkedinIcon className="w-4 h-4" />
                                    </a>
                                </div>

                                {/* Contacto directo por correo, de baja jerarquía frente al formulario */}
                                <a
                                    ref={mailtoRef}
                                    href={`mailto:${EMAIL_DESTINO}`}
                                    className="mt-4 inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors duration-200"
                                >
                                    <Mail className="w-3.5 h-3.5" />
                                    ¿Prefieres escribir directo? Envíame un correo
                                </a>
                            </div>

                            {/* Columna derecha - Formulario, más ancha */}
                            <div ref={formRef} className="lg:col-span-7 will-change-transform">
                                <form onSubmit={handleEmailSubmit} noValidate className="bg-zinc-200/50 dark:bg-zinc-800/50 backdrop-blur-lg rounded-md p-5 sm:p-6 shadow-2xl border border-zinc-300 dark:border-zinc-800">

                                    {/* Aviso de confirmación, distinto según el canal y resultado del envío */}
                                    {canalEnviado && (
                                        <div role="status" className={`mb-4 flex items-start gap-2 rounded-md border px-4 py-2.5 text-sm ${canalEnviado === 'correo-error' ? 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400' : 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400'}`}>
                                            {canalEnviado === 'correo-error'
                                                ? <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                                : <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                                            <span>
                                                {canalEnviado === 'correo' && 'Tu mensaje fue enviado correctamente. Te responderé pronto.'}
                                                {canalEnviado === 'correo-error' && 'No se pudo enviar el correo. Por favor, escríbeme por WhatsApp con el botón de abajo.'}
                                                {canalEnviado === 'whatsapp' && 'Se abrió WhatsApp con tu mensaje listo para enviar.'}
                                            </span>
                                        </div>
                                    )}

                                    {/* Campos Nombre y Correo, uno al lado del otro desde sm para acortar el formulario */}
                                    <div ref={rowNameEmailRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label htmlFor="nombre" className="block mb-1.5 text-sm font-medium text-start text-zinc-700 dark:text-zinc-300">
                                                Nombre
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                                    <User className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                                                </div>
                                                <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} aria-invalid={!!errors.nombre} aria-describedby={errors.nombre ? 'nombre-error' : undefined} className={`block w-full ps-10 pe-3 py-2.5 bg-zinc-100 dark:bg-zinc-900 border ${errors.nombre ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-zinc-300 dark:border-zinc-800 focus:ring-blue-500 focus:border-blue-500'} text-zinc-900 dark:text-zinc-100 text-sm rounded-md shadow-xs placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none focus:ring-2`} placeholder="Tu nombre" />
                                            </div>
                                            {errors.nombre && (
                                                <p id="nombre-error" className="text-red-500 text-xs mt-2 flex items-center">
                                                    <X className="w-3 h-3 mr-1" />
                                                    {errors.nombre}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="correo" className="block mb-1.5 text-sm font-medium text-start text-zinc-700 dark:text-zinc-300">
                                                Tu correo
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                                    <Mail className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                                                </div>
                                                <input type="email" id="correo" name="correo" value={formData.correo} onChange={handleChange} aria-invalid={!!errors.correo} aria-describedby={errors.correo ? 'correo-error' : undefined} className={`block w-full ps-10 pe-3 py-2.5 bg-zinc-100 dark:bg-zinc-900 border ${errors.correo ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-zinc-300 dark:border-zinc-800 focus:ring-blue-500 focus:border-blue-500'} text-zinc-900 dark:text-zinc-100 text-sm rounded-md shadow-xs placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none focus:ring-2`} placeholder="tucorreo@ejemplo.com" />
                                            </div>
                                            {errors.correo && (
                                                <p id="correo-error" className="text-red-500 text-xs mt-2 flex items-center">
                                                    <X className="w-3 h-3 mr-1" />
                                                    {errors.correo}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Campo Asunto */}
                                    <div ref={asuntoRef} className="mb-4">
                                        <label htmlFor="asunto" className="block mb-1.5 text-sm font-medium text-start text-zinc-700 dark:text-zinc-300">
                                            Asunto
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                                <MessageSquare className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                                            </div>
                                            <input type="text" id="asunto" name="asunto" value={formData.asunto} onChange={handleChange} aria-invalid={!!errors.asunto} aria-describedby={errors.asunto ? 'asunto-error' : undefined} className={`block w-full ps-10 pe-3 py-2.5 bg-zinc-100 dark:bg-zinc-900 border ${errors.asunto ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-zinc-300 dark:border-zinc-800 focus:ring-blue-500 focus:border-blue-500'} text-zinc-900 dark:text-zinc-100 text-sm rounded-md shadow-xs placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none focus:ring-2`} placeholder="¿De qué quieres hablar?" />
                                        </div>
                                        {errors.asunto && (
                                            <p id="asunto-error" className="text-red-500 text-xs mt-2 flex items-center">
                                                <X className="w-3 h-3 mr-1" />
                                                {errors.asunto}
                                            </p>
                                        )}
                                    </div>

                                    {/* Campo Mensaje */}
                                    <div ref={mensajeRef} className="mb-4">
                                        <label htmlFor="mensaje" className="block mb-1.5 text-sm font-medium text-start text-zinc-700 dark:text-zinc-300">
                                            Mensaje
                                        </label>
                                        <div className="relative">
                                            <div className="absolute top-3 start-0 flex ps-3 pointer-events-none">
                                                <Mail className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                                            </div>
                                            <textarea id="mensaje" name="mensaje" value={formData.mensaje} onChange={handleChange} rows="3" aria-invalid={!!errors.mensaje} aria-describedby={errors.mensaje ? 'mensaje-error' : undefined} className={`block w-full ps-10 pe-3 py-2.5 bg-zinc-100 dark:bg-zinc-900 border ${errors.mensaje ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-zinc-300 dark:border-zinc-800 focus:ring-blue-500 focus:border-blue-500'} text-zinc-900 dark:text-zinc-100 text-sm rounded-md shadow-xs placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none focus:ring-2 resize-none`} placeholder="Cuéntame los detalles de tu proyecto o consulta..." />
                                        </div>
                                        {errors.mensaje && (
                                            <p id="mensaje-error" className="text-red-500 text-xs mt-2 flex items-center">
                                                <X className="w-3 h-3 mr-1" />
                                                {errors.mensaje}
                                            </p>
                                        )}
                                    </div>

                                    {/* Acciones — botón de envío, señal de respuesta, canal alterno */}
                                    <div ref={actionsRef}>
                                        {/* Botón Enviar por correo */}
                                        <button type="submit" disabled={enviandoCorreo} className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold py-2.5 px-6 rounded-md transform hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-blue-500/30 flex items-center justify-center group disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed">
                                            <Send className={`w-5 h-5 mr-2 transition-transform ${enviandoCorreo ? 'animate-pulse' : 'group-hover:translate-x-1'}`} />
                                            {enviandoCorreo ? 'Enviando...' : 'Enviar por Correo'}
                                        </button>

                                        {/* Señal de expectativa de respuesta */}
                                        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-500">
                                            <Clock className="w-3.5 h-3.5" />
                                            Normalmente respondo en menos de 24h
                                        </p>

                                        {/* Divisor */}
                                        <div className="my-3 flex items-center gap-3">
                                            <span className="h-px flex-1 bg-zinc-300 dark:bg-zinc-700"></span>
                                            <span className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-500">o</span>
                                            <span className="h-px flex-1 bg-zinc-300 dark:bg-zinc-700"></span>
                                        </div>

                                        {/* Canal alterno - WhatsApp, usa los mismos datos y validación del formulario */}
                                        <button
                                            type="button"
                                            onClick={handleWhatsappSubmit}
                                            className="w-full border border-zinc-300 dark:border-zinc-700 hover:border-green-500 dark:hover:border-green-500 text-zinc-700 dark:text-zinc-300 hover:text-green-600 dark:hover:text-green-400 font-medium py-2 px-6 rounded-md transition-colors duration-300 flex items-center justify-center gap-2 text-sm"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            Enviar por WhatsApp
                                        </button>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>


                </div>
            </div>
        </section>
    );
};

export default ContactForm;
