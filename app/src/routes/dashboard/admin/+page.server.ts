import { redirect } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // Check if user is authenticated
  if (!pb.authStore.isValid || !pb.authStore.model) {
    throw redirect(303, '/auth/login');
  }

  const userId = pb.authStore.model.id;

  try {
    // Load user profile to check role
    const profiles = await pb.collection('user_profiles').getFullList({
      filter: `user = "${userId}"`
    });

    if (profiles.length === 0) {
      throw redirect(303, '/dashboard');
    }

    const profile = profiles[0];

    // Check if user has admin role
    if (profile.role !== 'admin') {
      console.warn(`Access denied: User ${userId} attempted to access admin dashboard with role: ${profile.role}`);
      throw redirect(303, '/dashboard');
    }

    // Load admin dashboard data
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

    return {
      profile,
      users: users.items,
      profiles: allProfiles.items,
      recentActivity: recentActivity.items,
      stats
    };
  } catch (error: any) {
    console.error('Error loading admin dashboard:', error);
    
    // If it's a redirect, re-throw it
    if (error.status === 303) {
      throw error;
    }
    
    // Otherwise redirect to regular dashboard
    throw redirect(303, '/dashboard');
  }
};
