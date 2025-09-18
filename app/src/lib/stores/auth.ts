// Authentication store for Digital Resume Hub
import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { pb } from '$lib/pocketbase';
import type { User } from '$lib/types/resume';

// Auth state store
export const currentUser = writable<User | null>(null);
export const isAuthenticated = writable<boolean>(false);
export const isLoading = writable<boolean>(true);

// Type conversion helper
function convertToUser(record: any): User {
  return {
    id: record.id,
    email: record.email || '',
    name: record.name,
    username: record.username || '',
    avatar: record.avatar,
    plan: record.plan || 'free',
    created: record.created,
    updated: record.updated
  };
}

// Initialize auth state
if (browser) {
  // Check if user is already authenticated
  if (pb.authStore.isValid && pb.authStore.model) {
    currentUser.set(convertToUser(pb.authStore.model));
    isAuthenticated.set(true);
  }
  
  // Listen for auth changes
  pb.authStore.onChange((auth) => {
    if (auth && pb.authStore.model) {
      currentUser.set(convertToUser(pb.authStore.model));
      isAuthenticated.set(true);
    } else {
      currentUser.set(null);
      isAuthenticated.set(false);
    }
  });
  
  isLoading.set(false);
}

// Auth functions
export const authService = {
  // Register new user
  async register(email: string, password: string, name: string, username: string) {
    try {
      const userData = {
        email,
        password,
        passwordConfirm: password,
        name,
        username,
        plan: 'free'
      };

      const user = await pb.collection('users').create(userData);
      
      // Send verification email
      await pb.collection('users').requestVerification(email);
      
      return { success: true, user };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.message || 'Registration failed' 
      };
    }
  },

  // Login user
  async login(email: string, password: string) {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      
      currentUser.set(convertToUser(authData.record));
      isAuthenticated.set(true);
      
      return { success: true, user: authData.record };
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      };
    }
  },

  // Logout user
  async logout() {
    try {
      pb.authStore.clear();
      currentUser.set(null);
      isAuthenticated.set(false);
      
      return { success: true };
    } catch (error: any) {
      console.error('Logout error:', error);
      return { 
        success: false, 
        error: error.message || 'Logout failed' 
      };
    }
  },

  // Request password reset
  async requestPasswordReset(email: string) {
    try {
      await pb.collection('users').requestPasswordReset(email);
      return { success: true };
    } catch (error: any) {
      console.error('Password reset error:', error);
      return { 
        success: false, 
        error: error.message || 'Password reset request failed' 
      };
    }
  },

  // Confirm password reset
  async confirmPasswordReset(token: string, password: string) {
    try {
      await pb.collection('users').confirmPasswordReset(token, password, password);
      return { success: true };
    } catch (error: any) {
      console.error('Password reset confirmation error:', error);
      return { 
        success: false, 
        error: error.message || 'Password reset confirmation failed' 
      };
    }
  },

  // Update user profile
  async updateProfile(data: Partial<User>) {
    try {
      if (!pb.authStore.model?.id) {
        throw new Error('User not authenticated');
      }
      const user = await pb.collection('users').update(pb.authStore.model.id, data);
      currentUser.set(convertToUser(user));
      
      return { success: true, user };
    } catch (error: any) {
      console.error('Profile update error:', error);
      return { 
        success: false, 
        error: error.message || 'Profile update failed' 
      };
    }
  },

  // Check username availability
  async checkUsernameAvailability(username: string) {
    try {
      const result = await pb.collection('users').getList(1, 1, {
        filter: `username = "${username}"`
      });
      
      return { available: result.items.length === 0 };
    } catch (error: any) {
      console.error('Username check error:', error);
      return { available: false };
    }
  },

  // Refresh auth token
  async refreshAuth() {
    try {
      if (pb.authStore.isValid) {
        await pb.collection('users').authRefresh();
        return { success: true };
      }
      return { success: false, error: 'No valid auth token' };
    } catch (error: any) {
      console.error('Auth refresh error:', error);
      pb.authStore.clear();
      currentUser.set(null);
      isAuthenticated.set(false);
      return { 
        success: false, 
        error: error.message || 'Auth refresh failed' 
      };
    }
  }
};