import React from 'react'

/**
 * Fondo compartido de las ilustraciones isométricas: dot-grid + anillos
 * concéntricos + glow radial + viñeta. Todo en tokens CSS (--iso-*) para
 * que responda automáticamente al tema claro/oscuro sin recibir colores
 * por props. `active` (hover) intensifica el glow y acelera los anillos.
 */
const IsoBackground = ({ active = false, scale = 1, className = '' }) => {
    const ringSizes = [168, 128, 92, 60].map((s) => Math.round(s * scale))

    return (
        <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
            {/* dot-grid */}
            <div
                className="absolute inset-0"
                style={{ backgroundImage: 'radial-gradient(var(--iso-dot) 1px, transparent 1px)', backgroundSize: '16px 16px' }}
            />

            {/* anillos concéntricos */}
            <div className={`absolute inset-0 flex items-center justify-center ${active ? 'animate-iso-spin-fast' : 'animate-iso-spin-slow'}`}>
                {ringSizes.map((size, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full"
                        style={{ width: size, height: size, border: `1px solid var(--iso-ring-${(i % 3) + 1})` }}
                    />
                ))}
            </div>

            {/* glow radial central, más fuerte en hover */}
            <div
                className="absolute inset-0 transition-[background] duration-500 ease-out"
                style={{ background: `radial-gradient(circle at 50% 55%, var(--iso-glow${active ? '-strong' : ''}) 0%, transparent 62%)` }}
            />

            {/* viñeta hacia el color base, para que se funda con el resto de la card */}
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 38%, transparent 38%, var(--iso-bg) 96%)' }} />
        </div>
    )
}

export default IsoBackground
