import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Redirige cualquier petición que comience con '/api'
      '/api': {
        target: 'http://localhost:4000', // Al servidor de tu backend
        changeOrigin: true, // Esto es importante para el CORS
        secure: false, // Puedes cambiarlo a 'true' si usas HTTPS
        ws: true,
      },
    },
  },
});
