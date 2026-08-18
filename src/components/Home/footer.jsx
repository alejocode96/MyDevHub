/**
 * @component Footer.jsx
 * @description Pie de página simple: logo, copyright y accesos directos a redes/contacto.
 * Se mantiene minimalista a propósito: la navegación ya vive en el navbar y el contacto
 * completo ya está resuelto en ContactForm justo arriba, así que el footer solo cierra
 * la página sin repetir información.
 * @author Alejandro Galeano - AlejoCode
 * @version 2.0.0
 */

import React, { useRef } from 'react';
import { Mail, MessageCircle } from 'lucide-react';

// íconos de marca y datos de contacto compartidos
import { GithubIcon, LinkedinIcon } from '../icons/brandIcons';
import { EMAIL_DESTINO, WHATSAPP_NUMERO, GITHUB_URL, LINKEDIN_URL } from '../../data/contact';

// animación — cierre sutil, una sola vez (el footer es de baja jerarquía;
// nada de scrub ni 3D aquí, solo un fade-up leve que remata la página)
import { useGSAP, scrollReveal } from '../../utils/gsap';

// imagen
import logo from '../../assets/landingPage/logo.png';

const Footer = () => {
    const anioActual = new Date().getFullYear();
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMERO}`;

    const footerRef = useRef(null)
    const brandRef = useRef(null)
    const linksRef = useRef(null)

    useGSAP(() => {
        scrollReveal([brandRef.current, linksRef.current], {
            trigger: footerRef.current, once: true, start: 'top 95%',
            stagger: 0.08, duration: 0.5, from: { y: 12, opacity: 0 },
        })
    }, { scope: footerRef })

    return (
        <footer ref={footerRef} className="relative border-t border-zinc-200 dark:border-zinc-900 bg-gray-50 dark:bg-zinc-950">
            <div className="w-[98%] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">

                {/* Logo + copyright */}
                <div ref={brandRef} className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
                    <img src={logo} alt="Logo AlejoCode" className="h-7 object-contain" />
                    <span className="text-xs text-zinc-500 dark:text-zinc-500">
                        © {anioActual} Alejandro Galeano. Todos los derechos reservados.
                    </span>
                </div>

                {/* Accesos rápidos */}
                <div ref={linksRef} className="flex items-center gap-3">
                    <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="flex items-center justify-center w-9 h-9 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-blue-500 hover:text-blue-600 dark:hover:border-cyan-400 dark:hover:text-cyan-400 transition-colors duration-200">
                        <GithubIcon className="w-4 h-4" />
                    </a>
                    <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex items-center justify-center w-9 h-9 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-blue-500 hover:text-blue-600 dark:hover:border-cyan-400 dark:hover:text-cyan-400 transition-colors duration-200">
                        <LinkedinIcon className="w-4 h-4" />
                    </a>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex items-center justify-center w-9 h-9 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-blue-500 hover:text-blue-600 dark:hover:border-cyan-400 dark:hover:text-cyan-400 transition-colors duration-200">
                        <MessageCircle className="w-4 h-4" />
                    </a>
                    <a href={`mailto:${EMAIL_DESTINO}`} aria-label="Correo" className="flex items-center justify-center w-9 h-9 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-blue-500 hover:text-blue-600 dark:hover:border-cyan-400 dark:hover:text-cyan-400 transition-colors duration-200">
                        <Mail className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
