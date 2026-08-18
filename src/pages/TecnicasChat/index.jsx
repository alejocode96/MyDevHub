import React from 'react'
import { Sparkles, Wrench } from 'lucide-react'
import InProgressMockup from '../../components/AIPage/inProgressMockup'

/**
 * ==================== TecnicasChat ====================
 * Sección "Técnicas" (02) de la ruta de IA generativa — todavía sin
 * contenido real, usa el shell compartido InProgressMockup (mismo mockup
 * de "pestaña de navegador" que antes vivía acá directo). Antes esta
 * sección mostraba, como placeholder estructural, los 14 conceptos de IA
 * reciclados de Conceptos (con un chat simulado y botón "Empezar") — no
 * tenía sentido mostrar contenido de conceptos en la sección de técnicas,
 * así que se reemplazó por el estado "en construcción" del shell.
 */
const TecnicasChat = () => (
    <InProgressMockup
        sectionId="tecnicasSection"
        eyebrow="02 — TÉCNICAS"
        title="Técnicas de prompting"
        titleDescription="Cómo estructurar instrucciones y sacarle mejores respuestas a un modelo — esta sección todavía está en construcción."
        tabIcon={Sparkles}
        tabLabel="Técnicas"
        bodyIcon={Wrench}
        bodyHeading="Próximamente más información"
        bodyDescription="Estamos preparando el recorrido de técnicas de prompting: cómo estructurar instrucciones y patrones para sacarle mejores respuestas a un modelo. Volvé pronto."
    />
)

export default TecnicasChat
