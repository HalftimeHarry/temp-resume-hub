import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: [
      'all',
      '5173--0199459d-ff02-7212-8cfc-8704245d361b.us-east-1-01.gitpod.dev',
      '.gitpod.dev'
    ]
  },
  test: {
    environment: 'happy-dom',
    include: ['src/tests/**/*.{test,spec}.{js,ts}'],
    globals: true,
    setupFiles: ['./src/test-setup.ts']
  }
});