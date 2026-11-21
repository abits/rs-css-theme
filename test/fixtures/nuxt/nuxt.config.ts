import tailwindcss from '@tailwindcss/vite';

// CSS_TARGET selects a diagnostic build target; unset means the Nuxt default.
const cssTarget = process.env.CSS_TARGET ? process.env.CSS_TARGET.split(',') : undefined;

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()], build: cssTarget ? { cssTarget } : {} },
});
