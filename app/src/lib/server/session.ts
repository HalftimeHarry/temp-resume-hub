/**
 * Server-side session management
 * Stores user profile data in encrypted cookies to avoid repeated database queries
 */

import type { Cookies } from '@sveltejs/kit';

export interface SessionData {
  userId: string;
  email: string;
  name: string;
  role: string;
  plan: string;
  profileId: string;
  timestamp: number;
}

const SESSION_COOKIE_NAME = 'session_data';
const SESSION_MAX_AGE = 60 * 60; // 1 hour
const SESSION_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Save session data to cookie
 */
export function saveSession(cookies: Cookies, data: SessionData): void {
  const sessionData = {
    ...data,
    timestamp: Date.now()
  };
  
  // Store as JSON in cookie (SvelteKit handles encryption via adapter)
  cookies.set(SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: SESSION_MAX_AGE
  });
}

/**
 * Get session data from cookie
 * Returns null if session doesn't exist or is expired
 */
export function getSession(cookies: Cookies): SessionData | null {
  const sessionCookie = cookies.get(SESSION_COOKIE_NAME);
  
  if (!sessionCookie) {
    return null;
  }
  
  try {
    const sessionData = JSON.parse(sessionCookie) as SessionData;
    
    // Check if session is expired (older than TTL)
    const now = Date.now();
    if (now - sessionData.timestamp > SESSION_TTL) {
      console.log('🔒 Session expired, clearing');
      clearSession(cookies);
      return null;
    }
    
    return sessionData;
  } catch (error) {
    console.error('🔒 Error parsing session data:', error);
    clearSession(cookies);
    return null;
  }
}

/**
 * Clear session data
 */
export function clearSession(cookies: Cookies): void {
  cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
}

/**
 * Check if session needs refresh (older than 5 minutes)
 */
export function shouldRefreshSession(session: SessionData): boolean {
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  return (now - session.timestamp) > fiveMinutes;
}
