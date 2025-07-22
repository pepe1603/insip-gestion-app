/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // ¡Esto es vital para tu funcionalidad de tema oscuro!
  theme: {
    extend: {
      colors: {
        'empresarial-300': '#9ABF49',
        'empresarial-200': '#A6BF6F',
        'empresarial-100': '#C7D9A0',
        'empresarial-50': '#F2F2F2',
        'dark-space': {
          50:  '#e6e6f2', // El más claro
          100: '#cccce6',
          200: '#9999cc',
          300: '#6666b3',
          400: '#333399',
          500: '#1f1f7a', // Considerado el tono "base" para la generación automática
          600: '#16165c',
          700: '#0f0f45',
          800: '#0a0a2d',
          900: '#0b0123', // Tu color original (el más oscuro)
        },
      }
    },
  },
  plugins: [], // Puedes añadir plugins como @tailwindcss/forms aquí si los necesitas
}