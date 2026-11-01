import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        formulario: resolve(__dirname, 'formulario.html'),
        encuesta: resolve(__dirname, 'encuesta.html'),
        resultado: resolve(__dirname, 'resultado.html'),
        panel: resolve(__dirname, 'panel.html'),
      },
    },
  },
});
