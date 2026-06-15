/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Warm, energetic wellness palette
        cream: {
          50: '#fffdf8',
          100: '#fdf8ee',
          200: '#f7ecd7',
        },
        sage: {
          50: '#f0f7ef',
          100: '#dcecd9',
          200: '#bcdbb5',
          300: '#93c389',
          400: '#66a85c',
          500: '#479040',
          600: '#357531',
          700: '#2b5d29',
          800: '#264a25',
          900: '#213d21',
        },
        terracotta: {
          50: '#fef3ef',
          100: '#fde2d7',
          200: '#fbc3ae',
          300: '#f79a79',
          400: '#f26c43',
          500: '#e64a1f',
          600: '#d23612',
          700: '#ae2912',
          800: '#8c2416',
          900: '#732216',
        },
        amber: {
          50: '#fff8eb',
          100: '#ffedc7',
          200: '#ffd989',
          300: '#ffc04d',
          400: '#ffa51f',
          500: '#f98307',
          600: '#dd6002',
          700: '#b74106',
          800: '#94330c',
          900: '#7a2b0d',
        },
        ink: {
          DEFAULT: '#2a2723',
          muted: '#7a756c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Slightly larger, more confident type scale
        xs: ['0.8125rem', { lineHeight: '1.1rem' }],
        sm: ['0.9375rem', { lineHeight: '1.4rem' }],
        base: ['1.0625rem', { lineHeight: '1.6rem' }],
      },
      boxShadow: {
        soft: '0 4px 20px -6px rgba(79, 70, 160, 0.16)',
        lift: '0 14px 40px -10px rgba(79, 70, 160, 0.28)',
        glow: '0 8px 28px -6px rgba(124, 92, 246, 0.5)',
      },
      backgroundImage: {
        // Reframe identity: calm dusk gradient for primary actions.
        'calm-gradient': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 55%, #a855f7 100%)',
        'dawn-gradient': 'linear-gradient(135deg, #818cf8 0%, #c4b5fd 100%)',
        // Kept for "lighter / positive" states and warm accents.
        'sage-gradient': 'linear-gradient(135deg, #66a85c 0%, #357531 100%)',
        sunrise: 'linear-gradient(135deg, #ffc04d 0%, #f26c43 50%, #e64a1f 100%)',
        'flame-gradient': 'linear-gradient(135deg, #f98307 0%, #e64a1f 55%, #d23612 100%)',
      },
      borderWidth: {
        DEFAULT: '1px',
        0: '0',
        2: '2px',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.3)' },
          '100%': { transform: 'scale(1)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'check-in': {
          '0%': { transform: 'scale(0.4)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'gradient-pan': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(120%)' },
        },
      },
      animation: {
        pop: 'pop 0.45s ease-out',
        'fade-up': 'fade-up 0.4s ease-out both',
        'check-in': 'check-in 0.25s ease-out',
        float: 'float 9s ease-in-out infinite',
        'float-slow': 'float 13s ease-in-out infinite',
        'gradient-pan': 'gradient-pan 6s ease infinite',
        shimmer: 'shimmer 2.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
