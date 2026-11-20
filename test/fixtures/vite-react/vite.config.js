import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const cssTarget = process.env.CSS_TARGET ? process.env.CSS_TARGET.split(',') : undefined;
export default defineConfig({ base: './', plugins: [react(), tailwindcss()], build: cssTarget ? { cssTarget } : {} });
