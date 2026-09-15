/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand — DEEP BLACK + VIBRANT RED
        ink: {
          DEFAULT: '#0F0F0F',
          950: '#0A0A0A',
          900: '#141414',
          800: '#1B1B1B',
          700: '#262626',
          600: '#303030',
        },
        electric: {
          DEFAULT: '#E50914',
          50: '#FDECEC',
          100: '#FBD7D7',
          200: '#F6ABAB',
          300: '#F07373',
          400: '#E83A3A',
          500: '#E50914',
          600: '#C20E18',
          700: '#A00D15',
          800: '#7E0F15',
          900: '#5C0D11',
        },
        violetglow: '#D32F2F',
        cloud: {
          DEFAULT: '#F5F7FA',
          100: '#EDF0F5',
          200: '#DDE3EC',
          300: '#C2CBD8',
          400: '#9AA6B8',
          500: '#7A8799',
          600: '#5A6575',
          700: '#3E4652',
          800: '#2A303A',
        },
      },
      fontFamily: {
        display: ['"Montserrat"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Display scale tuned for huge hero headlines
        'display-xl': ['clamp(3.25rem, 9vw, 8.5rem)', { lineHeight: '0.98', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2.75rem, 6vw, 5.5rem)', { lineHeight: '1.02', letterSpacing: '-0.025em' }],
        'display-md': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
      },
      maxWidth: {
        content: '72rem',
        readable: '40rem',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(229,9,20,0.22), 0 8px 40px -8px rgba(229,9,20,0.5)',
        'glow-lg': '0 0 0 1px rgba(229,9,20,0.3), 0 20px 70px -12px rgba(229,9,20,0.6)',
        card: '0 24px 60px -24px rgba(0,0,0,0.6)',
        hairline: 'inset 0 1px 0 0 rgba(255,255,255,0.06)',
      },
      backgroundImage: {
        'grid-ink':
          'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
        aurora:
          'radial-gradient(60% 60% at 20% 10%, rgba(229,9,20,0.18) 0%, transparent 60%), radial-gradient(50% 50% at 85% 20%, rgba(211,47,47,0.14) 0%, transparent 55%)',
      },
      animation: {
        'spin-slow': 'spin 22s linear infinite',
        'spin-slower': 'spin 40s linear infinite',
        marquee: 'marquee 40s linear infinite',
        'marquee-reverse': 'marquee-reverse 40s linear infinite',
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
