import { redirect } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import { POCKETBASE_URL } from '$lib/config';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, cookies }) => {
  console.log('🔒 Admin Dashboard Server: Load function called');
  console.log('🔒 Admin Dashboard Server: User:', locals.user?.email);
  console.log('🔒 Admin Dashboard Server: Role:', locals.userRole);
  
  // Middleware should have already checked auth and role
  // This is a safety check
  if (!locals.user) {
    console.log('🔒 Admin Dashboard Server: No user in locals, redirecting to login');
    throw redirect(303, '/auth/login');
  }
  
  if (locals.userRole !== 'admin') {
    console.log('🔒 Admin Dashboard Server: User is not admin, redirecting to dashboard');
    throw redirect(303, '/dashboard');
  }
  
  console.log('🔒 Admin Dashboard Server: Access granted - Loading admin data');
  
  // Create PocketBase instance with auth from cookies
  const pb = new PocketBase(POCKETBASE_URL);
  const authCookie = cookies.get('pb_auth');
  
  if (authCookie) {
    try {
      const authData = JSON.parse(decodeURIComponent(authCookie));
      pb.authStore.save(authData.token, authData.model);
    } catch (error) {
      console.error('🔒 Admin Dashboard Server: Error parsing auth cookie:', error);
    }
  }

  try {
    const profile = locals.userProfile;

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
    
    // If it's a redirect, re-throw it
    if (error.status === 303) {
      throw error;
    }
    
    // Otherwise redirect to regular dashboard
    throw redirect(303, '/dashboard');
  }
};
