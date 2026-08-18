/**
 * @file gsap.js
 * @description Punto único de registro de plugins GSAP para toda la app —
 * evita registrar ScrollTrigger/useGSAP por separado en cada componente (y
 * el riesgo de que alguno se quede sin el guard de prefers-reduced-motion).
 * Toda sección del Home importa gsap/ScrollTrigger/useGSAP desde aquí, nunca
 * directo de 'gsap' — es el único lugar donde se hace registerPlugin.
 */
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Reveal on scroll — respeta prefers-reduced-motion (mismo criterio que
 * [data-reveal] en index.css: si el usuario lo pide, no se anima nada y el
 * contenido queda visible tal cual). Por defecto se re-dispara cada vez que
 * el trigger entra/sale del viewport en cualquier sentido (replica el
 * comportamiento del viejo useScrollReveal, que reevaluaba en cada cruce);
 * con once:true corre una sola vez — usado donde el reveal convive con
 * gestos de drag/swipe (ver myServicesSection.jsx) y un replay accidental
 * causaba saltos de página.
 *
 * Usa gsap.set() + .to() en vez de .from(): con .from() dentro de un
 * timeline con stagger, GSAP solo renderiza el estado inicial del target
 * en la posición 0 del timeline al crearlo — los targets que arrancan más
 * tarde (stagger > 0) se quedan visibles con su estilo por defecto hasta
 * que el timeline los alcanza. gsap.set() aplica el estado oculto a TODOS
 * los targets de inmediato, sin importar su posición en el stagger.
 */
export const scrollReveal = (targets, {
    trigger,
    start = 'top 78%',
    end,
    stagger = 0.12,
    from = { y: 24, opacity: 0 },
    duration = 0.7,
    ease = 'power3.out',
    once = false,
} = {}) => {
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(targets, from)

        const to = { opacity: 1 }
        for (const key of ['x', 'y', 'xPercent', 'yPercent', 'scale', 'rotate']) {
            if (key in from) to[key] = key === 'scale' ? 1 : 0
        }

        gsap.timeline({
            scrollTrigger: {
                trigger,
                start,
                end,
                once,
                toggleActions: once ? 'play none none none' : 'play reverse play reverse',
            },
        }).to(targets, { ...to, duration, ease, stagger })
    })
}

/**
 * Media queries para ramificar una animación en desktop vs. mobile, ambas
 * ya con el guard de prefers-reduced-motion incluido — usar con
 * gsap.matchMedia().add(responsiveMotion(bp), (context) => { const
 * { isDesktop } = context.conditions; ... }).
 *
 * Por qué hace falta: las secciones "card 3D" (About/Articles/Contact)
 * tienen grids que se apilan en una sola columna en mobile (Tailwind
 * grid-cols-1 → sm/md/lg:grid-cols-N), y ahí la sección se vuelve mucho
 * más alta que el viewport. Si el tramo de scroll del cascade interno
 * fuera igual de corto que en desktop (una fracción chica del alto del
 * viewport), el scrub del cascade terminaría — según el top de la
 * sección — mucho antes de que el usuario llegue a scrollear lo
 * suficiente para ver las cards de más abajo: aparecerían "ya listas",
 * sin efecto visible. `breakpoint` debe coincidir con el breakpoint de
 * Tailwind que hace apilar ESE grid en particular (640/768/1024 según el
 * componente), no un valor genérico.
 */
export const responsiveMotion = (breakpoint = 768) => ({
    isDesktop: `(prefers-reduced-motion: no-preference) and (min-width: ${breakpoint}px)`,
    isMobile: `(prefers-reduced-motion: no-preference) and (max-width: ${breakpoint - 1}px)`,
})

export { gsap, ScrollTrigger, useGSAP }
