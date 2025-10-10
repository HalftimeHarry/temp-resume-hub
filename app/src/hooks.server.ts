import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import { POCKETBASE_URL } from '$lib/config';
import { getSession, saveSession, clearSession, shouldRefreshSession } from '$lib/server/session';

export const handle: Handle = async ({ event, resolve }) => {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`🔒 [${requestId}] Hooks: Processing request for:`, event.url.pathname);
  
  // Initialize PocketBase for server-side
  const pb = new PocketBase(POCKETBASE_URL);
  
  // Get auth token from cookies
  const authCookie = event.cookies.get('pb_auth');
  
  console.log(`🔒 [${requestId}] Auth cookie exists?`, !!authCookie);
  if (authCookie) {
    console.log(`🔒 [${requestId}] Cookie value preview:`, authCookie.substring(0, 50));
  } else {
    console.log(`🔒 [${requestId}] ❌ NO AUTH COOKIE - User will be logged out`);
  }
  
  if (authCookie) {
    try {
      // Parse and load auth state from cookie
      console.log(`🔒 [${requestId}] Loading auth from cookie...`);
      
      // The cookie is in JSON format: {token, model}
      const authData = JSON.parse(authCookie);
      pb.authStore.save(authData.token, authData.model);
      console.log(`🔒 [${requestId}] Auth loaded, isValid:`, pb.authStore.isValid);
      
      // Only refresh auth if token is close to expiring (within 5 minutes)
      // This prevents excessive refresh calls on every request
      if (pb.authStore.isValid) {
        const token = pb.authStore.token;
        let shouldRefresh = false;
        
        if (token) {
          try {
            // Decode JWT to check expiration
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiresAt = payload.exp * 1000; // Convert to milliseconds
            const now = Date.now();
            const fiveMinutes = 5 * 60 * 1000;
            
            // Refresh if token expires in less than 5 minutes
            shouldRefresh = (expiresAt - now) < fiveMinutes;
            
            if (shouldRefresh) {
              console.log(`🔒 [${requestId}] Token expiring soon, refreshing...`);
            } else {
              console.log(`🔒 [${requestId}] Token valid, skipping refresh`);
            }
          } catch (e) {
            // If we can't decode the token, try to refresh
            shouldRefresh = true;
          }
        }
        
        if (shouldRefresh) {
          try {
            await pb.collection('users').authRefresh();
          } catch (refreshError: any) {
            // Don't fail on auto-cancellation during refresh
            if (refreshError.message && refreshError.message.includes('autocancelled')) {
              console.log(`🔒 [${requestId}] Auth refresh auto-cancelled, continuing with existing auth`);
            } else {
              console.error(`🔒 [${requestId}] ⚠️ Auth refresh error:`, refreshError.message, 'Status:', refreshError.status);
              // Only clear auth if it's a real auth error (401, 403)
              if (refreshError.status === 401 || refreshError.status === 403) {
                console.error(`🔒 [${requestId}] ❌ CLEARING AUTH due to ${refreshError.status} error`);
                throw refreshError;
              }
            }
          }
        }
        
        // Set user in locals for use in load functions
        if (pb.authStore.model?.id && pb.authStore.model?.email) {
          event.locals.user = {
            id: pb.authStore.model.id,
            email: pb.authStore.model.email,
            name: pb.authStore.model.name,
            avatar: pb.authStore.model.avatar
          };
          
          console.log('🔒 Hooks: User authenticated:', event.locals.user.email);
          
          // Try to get profile from session first
          const userId = event.locals.user.id;
          let session = getSession(event.cookies);
          
          // If session exists and matches current user, use it
          if (session && session.userId === userId) {
            console.log(`🔒 [${requestId}] Using session data for user`);
            
            event.locals.userProfile = {
              id: session.profileId,
              user: session.userId,
              role: session.role,
              plan: session.plan,
              first_name: session.name.split(' ')[0] || '',
              last_name: session.name.split(' ').slice(1).join(' ') || ''
            };
            event.locals.userRole = session.role;
            
            // Refresh session if it's getting old
            if (shouldRefreshSession(session)) {
              console.log(`🔒 [${requestId}] Session needs refresh, fetching fresh profile`);
              try {
                const profiles = await pb.collection('user_profiles').getFullList({
                  filter: `user = "${userId}"`
                });
                
                if (profiles.length > 0) {
                  const profile = profiles[0];
                  event.locals.userProfile = profile;
                  event.locals.userRole = profile.role;
                  
                  // Update session
                  saveSession(event.cookies, {
                    userId: userId,
                    email: event.locals.user.email,
                    name: event.locals.user.name,
                    role: profile.role,
                    plan: profile.plan,
                    profileId: profile.id,
                    timestamp: Date.now()
                  });
                  
                  console.log(`🔒 [${requestId}] Session refreshed`);
                }
              } catch (refreshError: any) {
                // If refresh fails, keep using existing session
                console.log(`🔒 [${requestId}] Session refresh failed, using cached data`);
              }
            }
          } else {
            // No session or session mismatch, fetch from database
            console.log(`🔒 [${requestId}] No valid session, fetching profile from database`);
            
            try {
              const profiles = await pb.collection('user_profiles').getFullList({
                filter: `user = "${userId}"`
              });
              
              if (profiles.length > 0) {
                const profile = profiles[0];
                event.locals.userProfile = profile;
                event.locals.userRole = profile.role;
                
                // Save to session
                saveSession(event.cookies, {
                  userId: userId,
                  email: event.locals.user.email,
                  name: event.locals.user.name,
                  role: profile.role,
                  plan: profile.plan,
                  profileId: profile.id,
                  timestamp: Date.now()
                });
                
                console.log(`🔒 [${requestId}] Profile fetched and saved to session`);
              }
            } catch (profileError: any) {
              console.error(`🔒 [${requestId}] Error fetching profile:`, profileError.message);
            }
          }
          
          if (event.locals.userProfile && event.locals.userRole) {
            console.log(`🔒 [${requestId}] User role:`, event.locals.userRole);
            console.log(`🔒 [${requestId}] User plan:`, event.locals.userProfile.plan);
            
            try {
              
              // Role-based redirects
              const path = event.url.pathname;
              
              // Protect admin routes - only admins can access /admin
              if (event.locals.userRole !== 'admin' && path.startsWith('/admin')) {
                console.log(`🔒 [${requestId}] Non-admin trying to access admin area, redirecting to /dashboard`);
                throw redirect(303, '/dashboard');
              }
            } catch (redirectError: any) {
              // Re-throw redirects
              if (redirectError.status === 303) {
                throw redirectError;
              }
              console.error(`🔒 [${requestId}] Error in redirect logic:`, redirectError.message);
            }
          } else {
            console.log(`🔒 [${requestId}] No profile found for user`);
            clearSession(event.cookies);
          }
        }
      } else {
        // Clear cookie if auth is not valid
        console.log(`🔒 [${requestId}] ❌ Auth not valid, clearing cookies`);
        event.cookies.delete('pb_auth', { path: '/' });
        clearSession(event.cookies);
      }
    } catch (error: any) {
      // Re-throw redirects
      if (error.status === 303) {
        throw error;
      }
      
      // Don't clear auth on transient errors like auto-cancellation
      if (error.message && error.message.includes('autocancelled')) {
        console.log(`🔒 [${requestId}] Request auto-cancelled, preserving auth state`);
      } else if (error.status === 401 || error.status === 403) {
        // Only clear auth on actual authentication errors
        console.error(`🔒 [${requestId}] ❌ CLEARING AUTH - Authentication failed (${error.status}):`, error.message);
        pb.authStore.clear();
        event.cookies.delete('pb_auth', { path: '/' });
        clearSession(event.cookies);
      } else {
        // Log other errors but don't clear auth
        console.error(`🔒 [${requestId}] ⚠️ Non-auth error (preserving auth):`, error.message);
      }
    }
  }
  
  // Note: Cookie is set client-side by auth.ts
  // We don't set it server-side to avoid format conflicts
  
  const response = await resolve(event);
  
  return response;
};