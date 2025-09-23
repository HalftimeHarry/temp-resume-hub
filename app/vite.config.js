import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// Derive Gitpod HMR host if running in Gitpod
const GITPOD_URL = process.env.GITPOD_WORKSPACE_URL;
/** @type {import('vite').HmrOptions | undefined} */
let hmr;
if (GITPOD_URL) {
  try {
    const host = new URL(GITPOD_URL).host; // e.g. halftimehar-tempresumeh-xxxxx.ws-us121.gitpod.io
    hmr = {
      protocol: 'wss',
      clientPort: 443,
      host: `5173-${host}` // e.g. 5173-<workspace>.gitpod.io
    };
  } catch (e) {
    // noop – fallback to default HMR
  }
}

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr,
    allowedHosts: [
      'all',
      '.gitpod.io',
      '.gitpod.dev',
      '5173-halftimehar-tempresumeh-6rkv9juxpbe.ws-us121.gitpod.io'
    ]
  },
  base: '/'
});