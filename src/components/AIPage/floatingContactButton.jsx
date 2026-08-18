import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'

/**
 * ==================== FloatingContactButton ====================
 * Acceso a contacto persistente mientras se scrollea la página de IA
 * generativa — no duplica el formulario completo (ya existe en
 * ContactForm.jsx, en Home) ni el ícono "¿Hablamos de tu proyecto?" que
 * ya vive en el nav del Hero y en el sidebar de las secciones en
 * construcción; esto es un acceso rápido SIEMPRE visible mientras se
 * scrollea, sin importar en qué sección de la página se esté.
 *
 * Aparece recién después de pasar el Hero (fade+scale simple, sin GSAP:
 * es un toggle binario por umbral de scroll, no algo scrub-eado) — mostrar
 * un botón flotante desde el pixel 0, encima del propio CTA del Hero, se
 * sentía redundante.
 */
const FloatingContactButton = () => {
    const navigate = useNavigate()
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const goToContact = () => navigate('/#contactSection')

    return (
        <button
            onClick={goToContact}
            aria-label="¿Hablamos de tu proyecto?"
            className={`group fixed bottom-5 right-5 md:bottom-8 md:right-8 z-40 flex items-center gap-2.5 rounded-full pl-4 pr-4 md:pr-5 py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-lg shadow-zinc-900/20 dark:shadow-black/40 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer ${visible ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'
                }`}
        >
            <MessageCircle size={18} strokeWidth={2} className="shrink-0 transition-transform duration-300 group-hover:rotate-12" />
            <span className="hidden md:inline text-sm font-semibold whitespace-nowrap">
                ¿Hablamos de tu proyecto?
            </span>
        </button>
    )
}

export default FloatingContactButton
