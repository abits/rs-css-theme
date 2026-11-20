import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// The raised target keeps light-dark() intact, as the README requires.
export default defineConfig({
  base: './',
  plugins: [tailwindcss()],
  build: { cssTarget: ['chrome123', 'safari17.5', 'firefox120'] },
});
