/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0a0606',
          900: '#0a0606',
          800: '#14090a',
          700: '#1e1012',
          600: '#2a1619',
        },
        maroon: {
          DEFAULT: '#5e1220',
          50: '#fbf3f4',
          100: '#f3dde0',
          200: '#e3a7ad',
          300: '#cf6a76',
          400: '#a83244',
          500: '#7d1a2c',
          600: '#5e1220',
          700: '#480c18',
          800: '#340810',
          900: '#220509',
        },
        gold: {
          DEFAULT: '#d4af37',
          50: '#fdf8ec',
          100: '#faedc8',
          200: '#f3d98c',
          300: '#ecc45a',
          400: '#d4af37',
          500: '#b8932a',
          600: '#8f6f1f',
          700: '#6a521a',
          800: '#4a3a17',
          900: '#2e2410',
        },
        ivory: {
          DEFAULT: '#f7f1e6',
          50: '#fdfaf4',
          100: '#f7f1e6',
          200: '#efe4cf',
          300: '#e4d2b0',
          400: '#d3ba8a',
          500: '#bfa067',
        },
        // event accents
        haldi: {
          DEFAULT: '#e8a82b',
          light: '#f6d27a',
          deep: '#a8741a',
        },
        sangeet: {
          DEFAULT: '#8b5cf6',
          light: '#c4b5fd',
          deep: '#5b21b6',
        },
        mehandi: {
          DEFAULT: '#2f7d4f',
          light: '#7cc098',
          deep: '#1a5230',
        },
        baraat: {
          DEFAULT: '#b91c1c',
          light: '#f87171',
          deep: '#7f1010',
        },
        reception: {
          DEFAULT: '#c9a227',
          light: '#e6cd7a',
          deep: '#8a6b14',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['Marcellus', '"Cormorant Garamond"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(212, 175, 55, 0.45)',
        'glow-lg': '0 0 80px -10px rgba(212, 175, 55, 0.6)',
        'inner-gold': 'inset 0 0 30px -10px rgba(212, 175, 55, 0.35)',
      },
      backgroundImage: {
        'gold-sheen':
          'linear-gradient(110deg, transparent 25%, rgba(236,196,90,0.5) 50%, transparent 75%)',
      },
      keyframes: {
        floatUp: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.9' },
          '90%': { opacity: '0.9' },
          '100%': { transform: 'translateY(-120vh) rotate(360deg)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 30px -10px rgba(212,175,55,0.5)' },
          '50%': { boxShadow: '0 0 60px -8px rgba(212,175,55,0.85)' },
        },
        meshShift: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(3%, -2%) scale(1.05)' },
          '66%': { transform: 'translate(-2%, 3%) scale(0.98)' },
        },
      },
      animation: {
        floatUp: 'floatUp 14s linear infinite',
        shimmer: 'shimmer 6s linear infinite',
        glowPulse: 'glowPulse 4s ease-in-out infinite',
        meshShift: 'meshShift 18s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
