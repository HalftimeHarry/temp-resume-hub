import PocketBase, { type RecordModel } from 'pocketbase';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { POCKETBASE_URL } from './config';
import type { Resume, User } from './types/resume';

// Initialize PocketBase client
// Note: PocketBase provides built-in CSRF protection via secure HTTP-only cookies
// The auth token includes CSRF validation automatically
export const pb = new PocketBase(POCKETBASE_URL);

// User store
export const currentUser = writable(pb.authStore.model);

// Update user store when auth changes
pb.authStore.onChange((auth) => {
  currentUser.set(pb.authStore.model);
});

// Type conversion helpers
function isError(error: unknown): error is Error {
  return error instanceof Error;
}

function convertToResume(record: RecordModel): Resume {
  return {
    id: record.id,
    title: record.title || '',
    user: record.user || '',
    content: record.content || {},
    template: record.template,
    is_public: record.is_public || false,
    slug: record.slug,
    created: record.created,
    updated: record.updated,
    expand: record.expand
  };
}

function convertToUser(record: RecordModel): User {
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

// Authentication functions
export const auth = {
  // Login with email and password
  async login(email: string, password: string) {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      return { success: true, user: authData.record };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: isError(error) ? error.message : 'Login failed' };
    }
  },

  // Register new user
  async register(email: string, password: string, passwordConfirm: string, name?: string) {
    try {
      const data = {
        email,
        password,
        passwordConfirm,
        name: name || ''
      };
      
      const record = await pb.collection('users').create(data);
      
      // Auto-login after registration
      await pb.collection('users').authWithPassword(email, password);
      
      return { success: true, user: record };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: isError(error) ? error.message : 'Registration failed' };
    }
  },

  // Logout
  logout() {
    pb.authStore.clear();
  },

  // Check if user is authenticated
  get isAuthenticated() {
    return pb.authStore.isValid;
  },

  // Get current user
  get user() {
    return pb.authStore.model as User | null;
  },

  // Refresh authentication
  async refresh() {
    try {
      if (pb.authStore.isValid) {
        await pb.collection('users').authRefresh();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Auth refresh error:', error);
      pb.authStore.clear();
      return false;
    }
  }
};

// Resume functions
export const resumes = {
  // Get all resumes for current user
  async getMyResumes() {
    try {
      const records = await pb.collection('resumes').getFullList({
        filter: `user = "${pb.authStore.model?.id}"`,
        sort: '-updated'
      });
      return { success: true, resumes: records.map(convertToResume) };
    } catch (error) {
      console.error('Get resumes error:', error);
      return { success: false, error: isError(error) ? error.message : 'Failed to get resumes' };
    }
  },

  // Get public resumes
  async getPublicResumes(page = 1, perPage = 20) {
    try {
      const records = await pb.collection('resumes').getList(page, perPage, {
        filter: 'is_public = true',
        sort: '-updated',
        expand: 'user'
      });
      return { success: true, resumes: records.items.map(convertToResume), totalPages: records.totalPages };
    } catch (error) {
      console.error('Get public resumes error:', error);
      return { success: false, error: isError(error) ? error.message : 'Failed to get public resumes' };
    }
  },

  // Get resume by ID
  async getResume(id: string) {
    try {
      const record = await pb.collection('resumes').getOne(id, {
        expand: 'user'
      });
      return { success: true, resume: convertToResume(record) };
    } catch (error) {
      console.error('Get resume error:', error);
      return { success: false, error: isError(error) ? error.message : 'Failed to get resume' };
    }
  },

  // Get resume by slug
  async getResumeBySlug(slug: string) {
    try {
      const records = await pb.collection('resumes').getFullList({
        filter: `slug = "${slug}" && is_public = true`,
        expand: 'user'
      });
      
      if (records.length === 0) {
        return { success: false, error: 'Resume not found' };
      }
      
      return { success: true, resume: convertToResume(records[0]) };
    } catch (error) {
      console.error('Get resume by slug error:', error);
      return { success: false, error: isError(error) ? error.message : 'Failed to get resume by slug' };
    }
  },

  // Create new resume
  async createResume(title: string, content: Record<string, any> = {}, template?: string) {
    try {
      const data = {
        title,
        user: pb.authStore.model?.id,
        content,
        template: template || 'default',
        is_public: false,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      };
      
      const record = await pb.collection('resumes').create(data);
      return { success: true, resume: convertToResume(record) };
    } catch (error) {
      console.error('Create resume error:', error);
      return { success: false, error: isError(error) ? error.message : 'Failed to create resume' };
    }
  },

  // Update resume
  async updateResume(id: string, data: Partial<Resume>) {
    try {
      // If title is being updated, also update the slug
      let updateData = { ...data };
      if (data.title && typeof data.title === 'string') {
        updateData.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }
      
      const record = await pb.collection('resumes').update(id, updateData);
      return { success: true, resume: convertToResume(record) };
    } catch (error) {
      console.error('Update resume error:', error);
      return { success: false, error: isError(error) ? error.message : 'Failed to update resume' };
    }
  },

  // Delete resume
  async deleteResume(id: string) {
    try {
      await pb.collection('resumes').delete(id);
      return { success: true };
    } catch (error) {
      console.error('Delete resume error:', error);
      return { success: false, error: isError(error) ? error.message : 'Failed to delete resume' };
    }
  }
};

// Initialize auth state on client side
if (browser) {
  // Try to refresh auth on app start
  auth.refresh();
}