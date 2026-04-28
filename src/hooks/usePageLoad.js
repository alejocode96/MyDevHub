// src/hooks/usePageLoad.js

import { useState, useEffect } from 'react'

/**
 * @hook usePageLoad
 *
 * Custom hook que genera animaciones de entrada suaves al montar un componente.
 * Funciona activando un estado `loaded` un tick después del primer render,
 * lo que garantiza que el navegador ya pintó el estado inicial (invisible)
 * antes de transicionar al estado final (visible).
 *
 * @param {number} delay - Milisegundos a esperar antes de activar las animaciones.
 *                         Por defecto 50ms — suficiente para garantizar el primer paint.
 *
 * @returns {{ loaded: boolean, anim: Function }}
 *
 * @example
 * const { anim } = usePageLoad()
 *
 * <div className={anim('200ms').className} style={anim('200ms').style}>
 *   Contenido
 * </div>
 */
export const usePageLoad = (delay = 50) => {

  /**
   * `loaded` arranca en false (elementos invisibles).
   * Cambia a true después del delay, disparando las transiciones CSS.
   */
  const [loaded, setLoaded] = useState(false)

  /**
   * Se ejecuta una sola vez al montar el componente (array de deps vacío).
   * El setTimeout garantiza que React ya hizo el primer render con
   * opacity-0 antes de cambiar a opacity-100, haciendo la transición visible.
   * El return limpia el timeout si el componente se desmonta antes de que dispare.
   */
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), delay)
    return () => clearTimeout(t)
  }, [])

  /**
   * @function anim
   * Genera las clases de Tailwind y el style de delay para un elemento animado.
   *
   * @param {string} transitionDelay - Delay CSS del elemento individual, ej: '200ms'.
   *                                   Permite escalonar la entrada de cada elemento.
   * @param {'fadeUp' | 'fadeOnly'}  type - Tipo de animación:
   *   - 'fadeUp'   → aparece + sube suavemente (default, para cards, textos, consolas)
   *   - 'fadeOnly' → solo aparece sin moverse (ideal para fondos e imágenes de fondo)
   *
   * @returns {{ className: string, style: object }}
   *
   * @example
   * // Elemento que sube al entrar, con 300ms de delay
   * <div className={anim('300ms').className} style={anim('300ms').style} />
   *
   * // Fondo que solo hace fade, sin movimiento
   * <div className={anim('0ms', 'fadeOnly').className} style={anim('0ms', 'fadeOnly').style} />
   */
  const anim = (transitionDelay = '0ms', type = 'fadeUp') => {

    // Clases base que siempre se aplican — definen duración y curva de la transición
    const base = 'transition-all duration-700 ease-out'

    // Estado inicial → final cuando loaded cambia a true
    const fadeUp   = loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
    const fadeOnly = loaded ? 'opacity-100'                : 'opacity-0'

    return {
      // className se pasa junto a las clases propias del elemento
      className: `${base} ${type === 'fadeOnly' ? fadeOnly : fadeUp}`,
      // style se pasa en el atributo style — Tailwind no soporta delays dinámicos
      style: { transitionDelay },
    }
  }

  // Exponemos loaded por si necesitas condicionar algo más en el componente
  return { loaded, anim }
}