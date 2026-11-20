import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// base './' lets the built page load from file:// in the browser check.
// CSS_TARGET selects a diagnostic build target; unset means Vite's default.
const cssTarget = process.env.CSS_TARGET ? process.env.CSS_TARGET.split(',') : undefined;

export default defineConfig({
  base: './',
  plugins: [tailwindcss()],
  build: cssTarget ? { cssTarget } : {},
});
