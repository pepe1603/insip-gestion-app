import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import tailwindcss from '@tailwindcss/vite' // <-- ELIMINA ESTA LÍNEA
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // tailwindcss(), // <-- ELIMINA ESTA LÍNEA si no se usa la verison 4 de Tailwind CSS
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'), // Tu alias está perfecto aquí
    },
  },
})