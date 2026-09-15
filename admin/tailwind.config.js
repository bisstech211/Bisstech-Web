/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#0F0F0F', 950: '#0A0A0A', 900: '#141414', 800: '#1B1B1B' },
        electric: { DEFAULT: '#E50914', 600: '#C20E18' },
        cloud: { 400: '#9AA6B8', 500: '#7A8799' },
      },
    },
  },
  plugins: [],
};
