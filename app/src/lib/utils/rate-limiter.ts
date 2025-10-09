/**
 * Client-side rate limiting utility
 * 
 * Note: This is a basic client-side implementation. For production,
 * you should also implement server-side rate limiting using:
 * - Cloudflare Rate Limiting (recommended)
 * - PocketBase middleware
 * - Reverse proxy (nginx, Caddy)
 */

interface RateLimitEntry {
  attempts: number[];
  blocked: boolean;
  blockedUntil?: number;
}

class RateLimiter {
  private storage: Map<string, RateLimitEntry>;
  private readonly STORAGE_KEY = 'rate_limit_data';

  constructor() {
    this.storage = new Map();
    this.loadFromLocalStorage();
  }

  /**
   * Check if an action is rate limited
   * @param key Unique identifier (e.g., 'register:email@example.com' or 'login:192.168.1.1')
   * @param maxAttempts Maximum number of attempts allowed
   * @param windowMs Time window in milliseconds
   * @param blockDurationMs How long to block after exceeding limit
   * @returns true if allowed, false if rate limited
   */
  checkLimit(
    key: string,
    maxAttempts: number,
    windowMs: number,
    blockDurationMs: number = windowMs
  ): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const entry = this.storage.get(key) || { attempts: [], blocked: false };

    // Check if currently blocked
    if (entry.blocked && entry.blockedUntil) {
      if (now < entry.blockedUntil) {
        const retryAfter = Math.ceil((entry.blockedUntil - now) / 1000);
        return { allowed: false, retryAfter };
      } else {
        // Block expired, reset
        entry.blocked = false;
        entry.blockedUntil = undefined;
        entry.attempts = [];
      }
    }

    // Remove attempts outside the time window
    entry.attempts = entry.attempts.filter(time => now - time < windowMs);

    // Check if limit exceeded
    if (entry.attempts.length >= maxAttempts) {
      entry.blocked = true;
      entry.blockedUntil = now + blockDurationMs;
      this.storage.set(key, entry);
      this.saveToLocalStorage();
      
      const retryAfter = Math.ceil(blockDurationMs / 1000);
      return { allowed: false, retryAfter };
    }

    // Record this attempt
    entry.attempts.push(now);
    this.storage.set(key, entry);
    this.saveToLocalStorage();

    return { allowed: true };
  }

  /**
   * Reset rate limit for a specific key
   */
  reset(key: string): void {
    this.storage.delete(key);
    this.saveToLocalStorage();
  }

  /**
   * Clear all rate limit data
   */
  clearAll(): void {
    this.storage.clear();
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  /**
   * Get remaining attempts
   */
  getRemainingAttempts(key: string, maxAttempts: number, windowMs: number): number {
    const entry = this.storage.get(key);
    if (!entry) return maxAttempts;

    const now = Date.now();
    const recentAttempts = entry.attempts.filter(time => now - time < windowMs);
    return Math.max(0, maxAttempts - recentAttempts.length);
  }

  private loadFromLocalStorage(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        this.storage = new Map(Object.entries(parsed));
      }
    } catch (error) {
      console.error('Failed to load rate limit data:', error);
    }
  }

  private saveToLocalStorage(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      const data = Object.fromEntries(this.storage);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save rate limit data:', error);
    }
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

// Preset configurations
export const RATE_LIMITS = {
  REGISTRATION: {
    maxAttempts: 3,
    windowMs: 3600000, // 1 hour
    blockDurationMs: 3600000 // 1 hour
  },
  LOGIN: {
    maxAttempts: 5,
    windowMs: 900000, // 15 minutes
    blockDurationMs: 900000 // 15 minutes
  },
  PASSWORD_RESET: {
    maxAttempts: 3,
    windowMs: 3600000, // 1 hour
    blockDurationMs: 3600000 // 1 hour
  },
  CONTACT_FORM: {
    maxAttempts: 3,
    windowMs: 3600000, // 1 hour
    blockDurationMs: 3600000 // 1 hour
  }
};

/**
 * Helper function to format retry time
 */
export function formatRetryTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
}
