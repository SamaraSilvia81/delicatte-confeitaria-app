/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './*.html',
    './src/**/*.{html,js}',
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        crimson:  { DEFAULT: '#860120', dark: '#5c0116', light: '#a8012a' },
        blush:    { DEFAULT: '#fad1da', soft: '#fde8ee' },
        cream:    { DEFAULT: '#fffbef', dark: '#f5eedc' },
        sage:     { DEFAULT: '#828f58', dark: '#5f6a3e' },
        void:     { DEFAULT: '#06040c', mid: '#0f0b18', surface: '#1a1425' },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'crimson-sm': '0 1px 3px rgba(134,1,32,.08), 0 1px 2px rgba(134,1,32,.04)',
        'crimson-md': '0 4px 16px rgba(134,1,32,.10), 0 2px 6px rgba(134,1,32,.06)',
        'crimson-lg': '0 12px 40px rgba(134,1,32,.14), 0 4px 12px rgba(134,1,32,.08)',
        'crimson-glow': '0 0 30px rgba(134,1,32,.25)',
      },
      animation: {
        'drift-slow': 'drift 12s ease-in-out infinite alternate',
        'skeleton':   'skeleton-wave 1.5s infinite',
        'fade-up':    'fadeUp .5s ease forwards',
        'spin-slow':  'spin .8s linear infinite',
      },
      keyframes: {
        drift: {
          'from': { transform: 'translate(0,0) scale(1)' },
          'to':   { transform: 'translate(30px,20px) scale(1.08)' },
        },
        'skeleton-wave': {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        fadeUp: {
          'from': { opacity: '0', transform: 'translateY(16px)' },
          'to':   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
