import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: [
      'all',
      '5173-halftimehar-tempresumeh-6rkv9juxpbe.ws-us121.gitpod.io',
      '.gitpod.dev'
    ]
  }
});