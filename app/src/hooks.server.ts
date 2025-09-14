import type { Handle } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import { POCKETBASE_URL } from '$lib/config';

export const handle: Handle = async ({ event, resolve }) => {
  // Initialize PocketBase for server-side
  const pb = new PocketBase(POCKETBASE_URL);
  
  // Get auth token from cookies
  const authCookie = event.cookies.get('pb_auth');
  
  if (authCookie) {
    try {
      // Load auth state from cookie
      pb.authStore.loadFromCookie(authCookie);
      
      // Verify and refresh if needed
      if (pb.authStore.isValid) {
        await pb.collection('users').authRefresh();
        
        // Set user in locals for use in load functions
        event.locals.user = {
          id: pb.authStore.model?.id,
          email: pb.authStore.model?.email,
          name: pb.authStore.model?.name,
          avatar: pb.authStore.model?.avatar
        };
      }
    } catch (error) {
      // Clear invalid auth
      pb.authStore.clear();
      event.cookies.delete('pb_auth', { path: '/' });
    }
  }
  
  const response = await resolve(event);
  
  // Save auth state to cookie
  if (pb.authStore.isValid) {
    event.cookies.set('pb_auth', pb.authStore.exportToCookie(), {
      path: '/',
      httpOnly: false,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });
  }
  
  return response;
};