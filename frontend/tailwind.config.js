/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand — BISSTECH WHITE + COFFEE/WARM BROWN theme
        coffee: {
          DEFAULT: '#6f4e37',
          50: '#fdfcf8',
          100: '#faf5ee',
          200: '#f2e9da',
          300: '#e5d4bf',
          400: '#d4ba9b',
          500: '#c09d73',
          600: '#a68059',
          700: '#8a6645',
          800: '#6f4e37',
          900: '#5c3d2d',
          950: '#321f13',
        },
        espresso: {
          DEFAULT: '#3d2b1f',
          50: '#f8f5f0',
          100: '#ede6db',
          200: '#d9c9af',
          300: '#c1a583',
          400: '#a88460',
          500: '#967151',
          600: '#7d5e45',
          700: '#654c3a',
          800: '#533f32',
          900: '#45352a',
          950: '#241b15',
        },
        gold: {
          DEFAULT: '#c9a962',
          50: '#fdfcf5',
          100: '#faf6e5',
          200: '#f3eab5',
          300: '#eadc83',
          400: '#e0c952',
          500: '#d5b62d',
          600: '#c9a962',
          700: '#a6863d',
          800: '#866a35',
          900: '#6e5630',
          950: '#3b2e14',
        },
        // Neutral warm grays for subtle UI elements
        warm: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#1a1a1a',
          950: '#0a0a0a',
        },
      },
      fontFamily: {
        display: ['"Manrope"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Display scale tuned for Manrope — premium, professional sizing
        'display-xl': ['clamp(3rem, 7vw, 5.5rem)', { lineHeight: '1.02', letterSpacing: '-0.025em', fontWeight: '800' }],
        'display-lg': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.015em', fontWeight: '700' }],
        'display-sm': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '600' }],
      },
      maxWidth: {
        content: '72rem',
        readable: '40rem',
      },
      boxShadow: {
        'glow': '0 0 0 1px rgba(111,78,55,0.15), 0 8px 40px -8px rgba(111,78,55,0.25)',
        'glow-lg': '0 0 0 1px rgba(111,78,55,0.2), 0 20px 70px -12px rgba(111,78,55,0.35)',
        'glow-coffee': '0 0 0 1px rgba(111,78,55,0.15), 0 8px 40px -8px rgba(61,43,31,0.25)',
        'glow-coffee-lg': '0 0 0 1px rgba(111,78,55,0.2), 0 20px 70px -12px rgba(61,43,31,0.35)',
        'card-light': '0 2px 12px -2px rgba(61,43,31,0.08), 0 8px 30px -8px rgba(61,43,31,0.12)',
        'card-light-hover': '0 4px 20px -4px rgba(61,43,31,0.1), 0 16px 40px -12px rgba(61,43,31,0.15)',
        hairline: 'inset 0 1px 0 0 rgba(61,43,31,0.08)',
      },
      backgroundImage: {
        'grid-cream':
          'linear-gradient(to right, rgba(61,43,31,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(61,43,31,0.04) 1px, transparent 1px)',
        'coffee-gradient':
          'radial-gradient(60% 60% at 20% 10%, rgba(111,78,55,0.08) 0%, transparent 60%), radial-gradient(50% 50% at 85% 20%, rgba(61,43,31,0.06) 0%, transparent 55%)',
      },
      animation: {
        'spin-slow': 'spin 22s linear infinite',
        'spin-slower': 'spin 40s linear infinite',
        marquee: 'marquee 40s linear infinite',
        'marquee-reverse': 'marquee-reverse 40s linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
        float: 'float 7s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 5s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'marquee-vertical': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
};