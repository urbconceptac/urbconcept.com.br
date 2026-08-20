import { defineConfig } from '@lovable.dev/vite-tanstack-config';

export default defineConfig({
  base: './',
  tanstackStart: {
    spa: true, // Força a compilação em modo SPA estático (sem SSR)
  },
});
