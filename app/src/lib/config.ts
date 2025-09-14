import { env } from '$env/dynamic/public';
import { dev } from '$app/environment';

// PocketBase configuration
export const POCKETBASE_URL = env.PUBLIC_POCKETBASE_URL || 'http://localhost:8080';

// App configuration
export const APP_URL = env.PUBLIC_APP_URL || (dev ? 'http://localhost:5173' : 'https://digitalresumehub.com');

// API endpoints
export const API_ENDPOINTS = {
  health: `${POCKETBASE_URL}/api/health`,
  users: `${POCKETBASE_URL}/api/collections/users`,
  resumes: `${POCKETBASE_URL}/api/collections/resumes`,
  auth: `${POCKETBASE_URL}/api/collections/users/auth-with-password`,
  refresh: `${POCKETBASE_URL}/api/collections/users/auth-refresh`
} as const;

// App settings
export const APP_CONFIG = {
  name: 'Digital Resume Hub',
  description: 'Create and share professional resumes online',
  version: '1.0.0',
  author: 'Digital Resume Hub Team'
} as const;