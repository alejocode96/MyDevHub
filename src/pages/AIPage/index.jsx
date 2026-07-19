import React, { useLayoutEffect } from 'react'
import HeroAiSection from '../../components/AIPage/heroAiSection'
import ConceptosChat from '../ConceptosChat'

const AIPage = () => {
    /** Salvaguarda redundante al ScrollToTop de App.jsx: si por lo que sea
     *  esta página se monta con scroll heredado de la ruta anterior (ver
     *  App.jsx para el detalle completo del bug), fuerza el tope aquí
     *  también — sin depender de un solo punto de la app para este fix. */
    useLayoutEffect(() => {
        if (window.location.hash) return
        const html = document.documentElement
        const prevScrollBehavior = html.style.scrollBehavior
        html.style.scrollBehavior = 'auto'
        let frame = 0
        const forceTop = () => {
            window.scrollTo(0, 0)
            frame += 1
            const stable = window.scrollY === 0
            if (frame < 24 && !(stable && frame > 4)) {
                requestAnimationFrame(forceTop)
            } else {
                html.style.scrollBehavior = prevScrollBehavior
            }
        }
        forceTop()
    }, [])

    return (
        <main className=''>
            <HeroAiSection />
            <ConceptosChat />
        </main>
    )
}

export default AIPage
