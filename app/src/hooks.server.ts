import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import { POCKETBASE_URL } from '$lib/config';

export const handle: Handle = async ({ event, resolve }) => {
  console.log('🔒 Hooks: Processing request for:', event.url.pathname);
  
  // Initialize PocketBase for server-side
  const pb = new PocketBase(POCKETBASE_URL);
  
  // Get auth token from cookies
  const authCookie = event.cookies.get('pb_auth');
  
  console.log('🔒 Hooks: Auth cookie exists?', !!authCookie);
  console.log('🔒 Hooks: Auth cookie value:', authCookie ? authCookie.substring(0, 50) + '...' : 'none');
  console.log('🔒 Hooks: All cookies:', event.request.headers.get('cookie'));
  
  if (authCookie) {
    try {
      // Parse and load auth state from cookie
      console.log('🔒 Hooks: Loading auth from cookie...');
      const authData = JSON.parse(decodeURIComponent(authCookie));
      console.log('🔒 Hooks: Parsed auth data, has token:', !!authData.token);
      
      // Save to PocketBase auth store
      pb.authStore.save(authData.token, authData.model);
      console.log('🔒 Hooks: Auth loaded, isValid:', pb.authStore.isValid);
      
      // Verify and refresh if needed
      if (pb.authStore.isValid) {
        await pb.collection('users').authRefresh();
        
        // Set user in locals for use in load functions
        if (pb.authStore.model?.id && pb.authStore.model?.email) {
          event.locals.user = {
            id: pb.authStore.model.id,
            email: pb.authStore.model.email,
            name: pb.authStore.model.name,
            avatar: pb.authStore.model.avatar
          };
          
          console.log('🔒 Hooks: User authenticated:', event.locals.user.email);
          
          // Fetch user profile to get role
          try {
            const profiles = await pb.collection('user_profiles').getFullList({
              filter: `user = "${event.locals.user.id}"`
            });
            
            if (profiles.length > 0) {
              const profile = profiles[0];
              event.locals.userProfile = profile;
              event.locals.userRole = profile.role;
              
              console.log('🔒 Hooks: User role:', event.locals.userRole);
              console.log('🔒 Hooks: User plan:', profile.plan);
              
              // Role-based redirects
              const path = event.url.pathname;
              
              // If admin tries to access regular dashboard, redirect to admin dashboard
              if (event.locals.userRole === 'admin' && path === '/dashboard') {
                console.log('🔒 Hooks: Admin accessing /dashboard, redirecting to /dashboard/admin');
                throw redirect(303, '/dashboard/admin');
              }
              
              // If non-admin tries to access admin dashboard, redirect to regular dashboard
              if (event.locals.userRole !== 'admin' && path.startsWith('/dashboard/admin')) {
                console.log('🔒 Hooks: Non-admin trying to access admin area, redirecting to /dashboard');
                throw redirect(303, '/dashboard');
              }
            } else {
              console.log('🔒 Hooks: No profile found for user');
            }
          } catch (profileError: any) {
            // Don't fail the request if profile fetch fails, unless it's a redirect
            if (profileError.status === 303) {
              throw profileError;
            }
            console.error('🔒 Hooks: Error fetching profile:', profileError.message);
          }
        }
      } else {
        // Clear cookie if auth is not valid
        event.cookies.delete('pb_auth', { path: '/' });
      }
    } catch (error: any) {
      // Re-throw redirects
      if (error.status === 303) {
        throw error;
      }
      
      // Clear invalid auth
      pb.authStore.clear();
      event.cookies.delete('pb_auth', { path: '/' });
      console.error('🔒 Hooks: Auth error:', error.message);
    }
  }
  
  // Save auth state to cookie before resolving the response
  if (pb.authStore.isValid) {
    event.cookies.set('pb_auth', pb.authStore.exportToCookie(), {
      path: '/',
      httpOnly: false,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });
  }
  
  const response = await resolve(event);
  
  return response;
};