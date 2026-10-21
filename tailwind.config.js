/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Tokens de Blue Velvet — Coctelería de Autor
        noche: '#080D19',
        panel: '#0F172A',
        superficie: '#172033',
        'superficie-profunda': '#0D1525',
        borde: '#263247',
        'borde-tenue': 'rgba(153, 168, 194, 0.2)',
        oro: '#D4AF37',
        champan: '#F3D57B',
        texto: '#F7F5EE',
        'texto-secundario': '#9AA5B7',
        'texto-tenue': '#657187',
        esmeralda: '#34D399',
        'esmeralda-claro': '#6EE7B7',
        carmesi: '#FB7185',
        'carmesi-claro': '#FDA4AF',
        ambar: '#F59E0B',
        azul: '#60A5FA',

        // Compatibilidad previa
        'velvet-900': '#080D19',
        'velvet-800': '#0F172A',
        'velvet-blue': '#1e3a8a',
        'velvet-gold': '#D4AF37',
        'velvet-gold-light': '#F3D57B',
        'velvet-gold-dark': '#aa831b',
        'velvet-navy': '#0c142c',
        'velvet-muted': '#9AA5B7',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'velvet-gradient': 'linear-gradient(135deg, #080D19 0%, #0F172A 50%, #080D19 100%)',
        'gold-gradient': 'linear-gradient(135deg, #F3D57B 0%, #D4AF37 50%, #C99D24 100%)',
        'gold-button': 'linear-gradient(135deg, #F3D57B, #C99D24)',
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(212, 175, 55, 0.35)',
        'velvet-card': '0 24px 55px rgba(0, 0, 0, 0.35)',
        'panel-lujo': '0 24px 55px rgba(0, 0, 0, 0.2)',
      },
      borderRadius: {
        asimetrico: '4px 18px 4px 18px',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
