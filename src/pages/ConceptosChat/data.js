import {
    Sparkles, Shapes, Hash, AlignLeft, Orbit, Thermometer, Coins,
    Ghost, Database, SlidersHorizontal, Bot, Layers, Image, Scale,
    BrainCircuit, ShieldAlert, Wrench,
} from 'lucide-react'

/**
 * Los 14 conceptos agrupados en 4 artículos — la curaduría editorial real
 * (por qué van juntos, en qué orden). Cada ítem conserva su número global
 * 01-14 (por eso "Sesgos" aparece como 14 dentro del Artículo 3, fuera de
 * secuencia local: es el orden narrativo real, no un índice por grupo).
 */
export const ARTICLES = [
    {
        id: 'articulo-1',
        label: 'Los fundamentos',
        icon: Layers,
        why: null,
        items: [
            { id: 'c1', num: 1, title: 'Qué es la IA', icon: Sparkles },
            { id: 'c2', num: 2, title: 'Tipos de IA más allá de la generativa', icon: Shapes },
        ],
    },
    {
        id: 'articulo-2',
        label: 'Cómo "piensa" un modelo por dentro',
        icon: BrainCircuit,
        why: 'Los cuatro explican la mecánica interna de procesamiento — cómo lee, cómo recuerda, cómo entiende significado y cómo controla su variabilidad. Es el "motor" del modelo.',
        items: [
            { id: 'c3', num: 3, title: 'Tokens', icon: Hash },
            { id: 'c4', num: 4, title: 'Ventana de contexto', icon: AlignLeft },
            { id: 'c5', num: 5, title: 'Embeddings', icon: Orbit },
            { id: 'c6', num: 6, title: 'Temperatura y top-p', icon: Thermometer },
        ],
    },
    {
        id: 'articulo-3',
        label: 'Costos, riesgos y cómo mitigarlos',
        icon: ShieldAlert,
        why: 'Costos y alucinaciones son los dos riesgos/limitaciones más prácticos; RAG entra justo después porque es la principal solución técnica a las alucinaciones (arco narrativo natural: problema → causa → solución), y sesgos cierra como la otra limitación importante a tener en cuenta.',
        items: [
            { id: 'c7', num: 7, title: 'Costos por tokens', icon: Coins },
            { id: 'c8', num: 8, title: 'Alucinaciones', icon: Ghost },
            { id: 'c9', num: 9, title: 'RAG', icon: Database },
            { id: 'c14', num: 14, title: 'Sesgos (bias)', icon: Scale },
        ],
    },
    {
        id: 'articulo-4',
        label: 'De la técnica correcta a construir algo real',
        icon: Wrench,
        why: null,
        items: [
            { id: 'c10', num: 10, title: 'Fine-tuning vs Prompting vs RAG', icon: SlidersHorizontal },
            { id: 'c11', num: 11, title: 'Asistentes vs Agentes', icon: Bot },
            { id: 'c12', num: 12, title: 'Modelos multimodales', icon: Layers },
            { id: 'c13', num: 13, title: 'Generar imagen, audio y video', icon: Image },
        ],
    },
]
