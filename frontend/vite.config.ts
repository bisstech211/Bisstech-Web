import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2019',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Manual chunk splitting: keep three.js heavy code out of the main bundle
        manualChunks: {
          three: ['three', '@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
  server: {
    port: 5173,
    open: false,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
