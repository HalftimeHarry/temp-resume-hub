// Simple authentication store for development
import { writable } from 'svelte/store';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Create auth stores
export const user = writable<User | null>(null);
export const isAuthenticated = writable<boolean>(false);
export const isLoading = writable<boolean>(false);

// Auth store with methods
export const authStore = {
  user,
  isAuthenticated,
  isLoading,
  
  async init() {
    isLoading.set(true);
    try {
      // For development, just set loading to false
      isLoading.set(false);
    } catch (error) {
      console.error('Auth initialization failed:', error);
      isLoading.set(false);
    }
  },
  
  async login(email: string, password: string) {
    isLoading.set(true);
    try {
      // Mock login for development
      const mockUser: User = {
        id: 'mock-user',
        email,
        name: 'Demo User',
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      user.set(mockUser);
      isAuthenticated.set(true);
      return mockUser;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      isLoading.set(false);
    }
  },
  
  async register(email: string, password: string, name: string) {
    isLoading.set(true);
    try {
      // Mock registration for development
      const mockUser: User = {
        id: 'mock-user',
        email,
        name,
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      user.set(mockUser);
      isAuthenticated.set(true);
      return mockUser;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      isLoading.set(false);
    }
  },
  
  async logout() {
    try {
      user.set(null);
      isAuthenticated.set(false);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }
};