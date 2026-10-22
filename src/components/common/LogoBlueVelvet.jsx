import React, { useState } from 'react';

/**
 * Rutas de búsqueda prioritarias para el logotipo oficial de Blue Velvet
 */
const POSIBLES_RUTAS_LOGO = [
  '/logo.png',
  '/logo.svg',
  '/logo.webp',
  '/logo.jpg',
  '/src/assets/logo.png',
  '/src/assets/logo.svg',
  '/src/assets/logo.webp',
  '/src/assets/logo.jpg',
];

/**
 * Logotipo Oficial de Blue Velvet con detección automática de formatos y fallback vectorial de lujo
 * @param {{ tamano?: number, clase?: string }} props
 */
export default function LogoBlueVelvet({ tamano = 48, clase = '' }) {
  const [indiceRuta, setIndiceRuta] = useState(0);

  const manejarError = () => {
    setIndiceRuta((prev) => prev + 1);
  };

  if (indiceRuta < POSIBLES_RUTAS_LOGO.length) {
    return (
      <img
        src={POSIBLES_RUTAS_LOGO[indiceRuta]}
        onError={manejarError}
        alt="Blue Velvet — Coctelería de Autor"
        style={{
          width: `${tamano}px`,
          height: `${tamano}px`,
          objectFit: 'contain',
          filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.25))',
        }}
        className={`rounded-lg transition-transform ${clase}`}
      />
    );
  }

  // Fallback vectorial de lujo (Monograma Dorado BV sobre terciopelo nocturno)
  return (
    <div
      style={{
        width: `${tamano}px`,
        height: `${tamano}px`,
        filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.25))',
      }}
      className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#10192e] to-[#080d19] border border-oro/40 shadow-gold-glow shrink-0 select-none ${clase}`}
    >
      <span className="font-serif italic font-bold text-oro tracking-wider text-xl leading-none">
        BV
      </span>
      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-champan animate-pulse shadow-sm" />
    </div>
  );
}
