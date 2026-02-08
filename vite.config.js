import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import strip from '@rollup/plugin-strip';

export default defineConfig({
  plugins: [
    vue(),
    process.env.NODE_ENV === 'production' && strip({
      debugger: true,
      functions: ['console.warn', 'console.error'],
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});