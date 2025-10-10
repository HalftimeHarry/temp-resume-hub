import { redirect } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import { POCKETBASE_URL } from '$lib/config';
import type { PageServerLoad } from './$types';
import { getSession } from '$lib/server/session';

export const load: PageServerLoad = async ({ locals, cookies }) => {
  console.log('🔒 Admin Dashboard Server: Load function called');
  console.log('🔒 Admin Dashboard Server: User:', locals.user?.email);
  console.log('🔒 Admin Dashboard Server: Role:', locals.userRole);
  
  // Check if user is authenticated
  if (!locals.user) {
    console.log('🔒 Admin Dashboard Server: No user in locals, redirecting to login');
    throw redirect(303, '/auth/login');
  }
  
  // Create PocketBase instance with auth from cookies
  const pb = new PocketBase(POCKETBASE_URL);
  const authCookie = cookies.get('pb_auth');
  
  if (authCookie) {
    try {
      // The cookie is in JSON format: {token, model}
      const authData = JSON.parse(authCookie);
      pb.authStore.save(authData.token, authData.model);
    } catch (error) {
      console.error('🔒 Admin Dashboard Server: Error loading auth from cookie:', error);
      // Continue without PocketBase auth - we have locals.user from hooks
    }
  }

  try {
    // Get role from locals (set by hooks with session data)
    let profile = locals.userProfile;
    let userRole = locals.userRole;
    
    // If not in locals, try session
    if (!userRole) {
      const session = getSession(cookies);
      if (session && session.userId === locals.user.id) {
        console.log('🔒 Admin Dashboard Server: Using session data');
        userRole = session.role;
        profile = {
          id: session.profileId,
          user: session.userId,
          role: session.role,
          plan: session.plan
        };
      }
    }
    
    // Check if user is admin
    if (userRole !== 'admin') {
      console.log('🔒 Admin Dashboard Server: User is not admin (role:', userRole, '), redirecting to dashboard');
      throw redirect(303, '/dashboard');
    }
    
    console.log('🔒 Admin Dashboard Server: Access granted - Loading admin data');

    // Load admin dashboard data
    console.log('🔒 Admin Dashboard Server: Loading admin dashboard data...');
    const [users, allProfiles, recentActivity] = await Promise.all([
      // Get all users
      pb.collection('users').getList(1, 50, {
        sort: '-created'
      }),
      // Get all profiles
      pb.collection('user_profiles').getList(1, 50, {
        sort: '-created',
        expand: 'user'
      }),
      // Get recent resumes (if you have a resumes collection)
      pb.collection('resumes').getList(1, 20, {
        sort: '-updated',
        expand: 'user'
      }).catch(() => ({ items: [], totalItems: 0 }))
    ]);
    
    console.log('🔒 Admin Dashboard Server: Data loaded successfully');
    console.log('🔒 Admin Dashboard Server: Users:', users.totalItems);
    console.log('🔒 Admin Dashboard Server: Profiles:', allProfiles.totalItems);
    console.log('🔒 Admin Dashboard Server: Recent activity:', recentActivity.totalItems);

    // Calculate statistics
    const stats = {
      totalUsers: users.totalItems,
      totalProfiles: allProfiles.totalItems,
      activeUsers: allProfiles.items.filter(p => p.active).length,
      verifiedUsers: allProfiles.items.filter(p => p.verified).length,
      proUsers: allProfiles.items.filter(p => p.plan === 'pro').length,
      enterpriseUsers: allProfiles.items.filter(p => p.plan === 'enterprise').length,
      totalResumes: recentActivity.totalItems
    };

    console.log('🔒 Admin Dashboard Server: Statistics calculated:', stats);
    console.log('🔒 Admin Dashboard Server: Returning data to client');

    return {
      profile,
      users: users.items,
      profiles: allProfiles.items,
      recentActivity: recentActivity.items,
      stats
    };
  } catch (error: any) {
    console.error('🔒 Admin Dashboard Server: ERROR:', error);
    console.error('🔒 Admin Dashboard Server: Error type:', error.constructor.name);
    console.error('🔒 Admin Dashboard Server: Error status:', error.status);
    console.error('🔒 Admin Dashboard Server: Error message:', error.message);
    
    // If it's a redirect, re-throw it
    if (error.status === 303) {
      throw error;
    }
    
    // Don't redirect on auto-cancellation - return empty data instead
    if (error.message && error.message.includes('autocancelled')) {
      console.log('🔒 Admin Dashboard Server: Request auto-cancelled, returning empty data');
      return {
        profile: locals.userProfile || null,
        users: [],
        profiles: [],
        recentActivity: [],
        stats: {
          totalUsers: 0,
          totalProfiles: 0,
          activeUsers: 0,
          verifiedUsers: 0,
          proUsers: 0,
          enterpriseUsers: 0,
          totalResumes: 0
        }
      };
    }
    
    // Only redirect to dashboard on real errors
    console.error('🔒 Admin Dashboard Server: Redirecting to dashboard due to error');
    throw redirect(303, '/dashboard');
  }
};
