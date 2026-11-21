import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

const cssTarget = process.env.CSS_TARGET ? process.env.CSS_TARGET.split(',') : undefined;
export default defineConfig({ base: './', plugins: [vue(), tailwindcss()], build: cssTarget ? { cssTarget } : {} });
