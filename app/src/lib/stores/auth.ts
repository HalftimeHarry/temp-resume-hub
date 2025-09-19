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
  console.log('🔐 Auth Debug: Initializing auth state');
  console.log('🔐 Auth Debug: PocketBase auth valid?', pb.authStore.isValid);
  console.log('🔐 Auth Debug: PocketBase model:', pb.authStore.model);
  
  // Check if user is already authenticated
  if (pb.authStore.isValid && pb.authStore.model) {
    console.log('🔐 Auth Debug: User is authenticated, setting current user');
    currentUser.set(convertToUser(pb.authStore.model));
    isAuthenticated.set(true);
  } else {
    console.log('🔐 Auth Debug: No valid authentication found');
  }
  
  // Listen for auth changes
  pb.authStore.onChange((auth) => {
    console.log('🔐 Auth Debug: Auth state changed:', auth);
    if (auth && pb.authStore.model) {
      console.log('🔐 Auth Debug: User logged in:', pb.authStore.model);
      currentUser.set(convertToUser(pb.authStore.model));
      isAuthenticated.set(true);
    } else {
      console.log('🔐 Auth Debug: User logged out');
      currentUser.set(null);
      isAuthenticated.set(false);
    }
  });
  
  // Skip automatic auth refresh on startup to avoid clearing valid auth
  // The auth token will be refreshed automatically by PocketBase when needed
  console.log('🔐 Auth Debug: Skipping automatic auth refresh to preserve auth state');
  
  isLoading.set(false);
  
  // Debug current auth state every 5 seconds
  setInterval(() => {
    console.log('🔐 Auth Debug: Current state - isAuthenticated:', pb.authStore.isValid, 'User:', pb.authStore.model?.email || 'None');
  }, 5000);
}

// Auth functions
export const auth = {
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
      
      // Auto-login after registration
      const authData = await pb.collection('users').authWithPassword(email, password);
      
      currentUser.set(convertToUser(authData.record));
      isAuthenticated.set(true);
      
      return { success: true, user: authData.record };
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle PocketBase validation errors
      if (error.response?.data) {
        const data = error.response.data;
        if (data.data) {
          // Extract field-specific errors
          const fieldErrors = [];
          for (const [field, fieldError] of Object.entries(data.data)) {
            if (fieldError && typeof fieldError === 'object' && fieldError.message) {
              fieldErrors.push(`${field}: ${fieldError.message}`);
            }
          }
          if (fieldErrors.length > 0) {
            return { success: false, error: fieldErrors.join(', ') };
          }
        }
        return { success: false, error: data.message || 'Registration failed' };
      }
      
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
      // Only clear auth if it's a real authentication error, not auto-cancellation
      if (error.message && !error.message.includes('autocancelled')) {
        pb.authStore.clear();
        currentUser.set(null);
        isAuthenticated.set(false);
      }
      return { 
        success: false, 
        error: error.message || 'Auth refresh failed' 
      };
    }
  }
};

// Export combined auth store
export const authStore = {
  subscribe: currentUser.subscribe,
  isAuthenticated,
  isLoading,
  login: auth.login,
  register: auth.register,
  logout: auth.logout,
  requestPasswordReset: auth.requestPasswordReset,
  confirmPasswordReset: auth.confirmPasswordReset,
  updateProfile: auth.updateProfile,
  checkUsernameAvailability: auth.checkUsernameAvailability,
  refreshAuth: auth.refreshAuth
};