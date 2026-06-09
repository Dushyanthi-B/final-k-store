import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: '/final-k-store/',
  plugins: [react()],
  server: {
    port: 5173, // Desired port
    strictPort: false, // Allows Vite to automatically try another port if 5173 is in use
  },
});
