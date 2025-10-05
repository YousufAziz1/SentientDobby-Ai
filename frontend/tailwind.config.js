/******** Tailwind config ********/
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81'
        },
        accent: {
          500: '#F43F5E',
          600: '#E11D48'
        }
      },
      boxShadow: {
        soft: '0 2px 10px rgba(0,0,0,0.06)',
        card: '0 8px 30px rgba(0,0,0,0.07)'
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(180deg, rgba(99,102,241,0.15), rgba(244,63,94,0.08))',
        'hero-gradient-dark': 'linear-gradient(180deg, rgba(99,102,241,0.15), rgba(244,63,94,0.12))'
      }
    }
  },
  plugins: []
};
