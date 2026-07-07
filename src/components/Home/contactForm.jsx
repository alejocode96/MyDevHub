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

import React, { useState } from 'react';
import { Mail, X, Send, User, MessageSquare, Clock, MessageCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

// animación
import { useScrollReveal } from '../../hooks/useScrollReveal';

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

    // ── Un observer por columna, con delays escalonados por elemento ───────
    const { ref: leftRef, anim: leftAnim } = useScrollReveal();
    const { ref: formRef, anim: formAnim } = useScrollReveal();
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
        <section id="contactSection" className="pt-8 h-auto relative" style={{ scrollMarginTop: '24px' }}>
            <div className="relative mx-auto mt-16 max-w-full p-4 sm:p-6 pb-8 pt-16 lg:px-8">
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
                            className="aspect-[1108/532] h-auto w-[69.25rem] flex-none bg-gradient-to-r from-cyan-500 to-blue-800 opacity-20 dark:opacity-20"
                            style={{ clipPath: "polygon(77.5% 40.13%, 90% 10%, 100% 50%, 95% 80%, 92% 85%, 75% 65%, 61.26% 54.7%, 50% 54.7%, 47.24% 65.81%, 50% 85%, 26.16% 73.91%, 0.1% 100%, 1% 40.13%, 20% 48.75%, 60% 0.25%, 67.5% 32.63%)" }}>
                        </div>
                    </div>

                    {/* Contenido principal */}
                    <div className="relative z-10 mx-auto w-full">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

                            {/* Columna izquierda - Información, más angosta para darle más ancho al formulario */}
                            <div ref={leftRef} className="lg:col-span-5 flex flex-col items-center text-center">
                                <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full mb-4 shadow-lg shadow-blue-500/50 ${leftAnim('0ms').className}`} style={leftAnim('0ms').style}>
                                    <Mail className="w-7 h-7 text-white" />
                                </div>

                                <h2 className={`leading-tight bg-gradient-to-br from-gray-600 to-gray-900 dark:from-white dark:to-zinc-500 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl ${leftAnim('100ms').className}`} style={leftAnim('100ms').style}>
                                    ¿Listo para trabajar juntos?
                                </h2>

                                <p className={`mt-3 max-w-sm text-sm sm:text-base text-zinc-700 dark:text-zinc-400/80 ${leftAnim('200ms').className}`} style={leftAnim('200ms').style}>
                                    Cuéntame sobre tu proyecto y hagamos realidad esas ideas.
                                    Estoy aquí para ayudarte a crear soluciones innovadoras.
                                </p>

                                {/* Redes sociales */}
                                <div className={`mt-5 flex items-center gap-3 ${leftAnim('300ms').className}`} style={leftAnim('300ms').style}>
                                    <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="flex items-center justify-center w-9 h-9 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-blue-500 hover:text-blue-600 dark:hover:border-cyan-400 dark:hover:text-cyan-400 transition-colors duration-200">
                                        <GithubIcon className="w-4 h-4" />
                                    </a>
                                    <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex items-center justify-center w-9 h-9 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-blue-500 hover:text-blue-600 dark:hover:border-cyan-400 dark:hover:text-cyan-400 transition-colors duration-200">
                                        <LinkedinIcon className="w-4 h-4" />
                                    </a>
                                </div>

                                {/* Contacto directo por correo, de baja jerarquía frente al formulario */}
                                <a
                                    href={`mailto:${EMAIL_DESTINO}`}
                                    className={`mt-4 inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors duration-200 ${leftAnim('400ms').className}`}
                                    style={leftAnim('400ms').style}
                                >
                                    <Mail className="w-3.5 h-3.5" />
                                    ¿Prefieres escribir directo? Envíame un correo
                                </a>
                            </div>

                            {/* Columna derecha - Formulario, más ancha */}
                            <div ref={formRef} className="lg:col-span-7">
                                <form onSubmit={handleEmailSubmit} noValidate className={`bg-zinc-200/50 dark:bg-zinc-800/50 backdrop-blur-lg rounded-md p-5 sm:p-6 shadow-2xl border border-zinc-300 dark:border-zinc-800 ${formAnim('100ms').className}`} style={formAnim('100ms').style}>

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
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
                                    <div className="mb-4">
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
                                    <div className="mb-4">
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
