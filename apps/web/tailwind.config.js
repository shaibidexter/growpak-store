/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}",
    "../../packages/ui/src/**/*.{html,ts,scss}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        earth: {
          50: '#fdfbf7',
          100: '#f7f2ea',
          200: '#ede2d3',
          300: '#decbb4',
          400: '#cbb092',
          500: '#b99573',
          600: '#aa7e5e',
          700: '#8d644d',
          800: '#735241',
          900: '#5f4337',
        },
        whatsapp: '#25D366',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        urdu: ["'Noto Nastaliq Urdu'", "'Jameel Noori Nastaleeq'", 'serif'],
      },
    },
  },
  plugins: [],
}
