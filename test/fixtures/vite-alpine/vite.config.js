import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

const cssTarget = process.env.CSS_TARGET ? process.env.CSS_TARGET.split(',') : undefined;
export default defineConfig({ base: './', plugins: [tailwindcss()], build: cssTarget ? { cssTarget } : {} });
