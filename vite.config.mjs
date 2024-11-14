import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig as defineVitestConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true, // Utilisation des globals comme 'describe', 'it', etc.
    environment: 'jsdom', // Si vous testez des composants Vue (ou autre), utilisez jsdom
    setupFiles: ['./src/setupTests.js'], // Si vous avez besoin d'un fichier de configuration (optionnel)
    coverage: {
      provider: 'c8', // Outil de couverture
      reporter: ['text', 'json', 'html'],
    },
  },
});
