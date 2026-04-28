// src/hooks/useScrollReveal.js
import { useState, useEffect, useRef } from 'react'

/**
 * @hook useScrollReveal
 *
 * Hook unificado de animaciones de entrada.
 * Funciona tanto al cargar la página como cada vez que
 * el elemento entra al viewport al hacer scroll.
 *
 * Reemplaza completamente a usePageLoad — misma API,
 * úsalo en cualquier componente sin distinción.
 *
 * @param {object} options
 * @param {number} options.threshold  — % visible para disparar (default 0.15)
 * @param {string} options.rootMargin — margen de entrada (default '-50px')
 *
 * @returns {{ ref, anim, visible }}
 *
 * @example
 * const { ref, anim } = useScrollReveal()
 * <section ref={ref}>
 *   <h2 className={anim('200ms').className} style={anim('200ms').style} />
 * </section>
 */
export const useScrollReveal = ({ threshold = 0.15, rootMargin = '-50px' } = {}) => {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // true al entrar, false al salir → el efecto se repite siempre
        setVisible(entry.isIntersecting)
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const anim = (transitionDelay = '0ms', type = 'fadeUp') => {
    const base = 'transition-all duration-700 ease-out'
    const fadeUp   = visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
    const fadeOnly = visible ? 'opacity-100'                : 'opacity-0'
    return {
      className: `${base} ${type === 'fadeOnly' ? fadeOnly : fadeUp}`,
      style: { transitionDelay },
    }
  }

  return { ref, anim, visible }
}