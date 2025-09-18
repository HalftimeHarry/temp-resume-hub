// Test utilities for Digital Resume Hub
import { writable } from 'svelte/store';
import type { Resume, User } from '$lib/types/resume';

// Mock data for testing
export const mockUser: User = {
  id: 'test-user-1',
  email: 'test@example.com',
  username: 'testuser',
  name: 'Test User',
  avatar: '',
  plan: 'free',
  created: '2024-01-01T00:00:00Z',
  updated: '2024-01-01T00:00:00Z'
};

export const mockResume: Resume = {
  id: 'test-resume-1',
  user: 'test-user-1',
  title: 'Software Engineer Resume',
  slug: 'software-engineer-resume',
  content: {},
  is_public: false,
  created: '2024-01-01T00:00:00Z',
  updated: '2024-01-01T00:00:00Z'
};

// Mock stores for testing
export function createMockAuthStore() {
  const { subscribe, set, update } = writable<{
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
  }>({
    user: mockUser,
    isAuthenticated: true,
    isLoading: false
  });

  return {
    subscribe,
    login: async (email: string, password: string) => {
      set({ user: mockUser, isAuthenticated: true, isLoading: false });
      return mockUser;
    },
    register: async (email: string, password: string, name: string) => {
      const newUser = { ...mockUser, email, name };
      set({ user: newUser, isAuthenticated: true, isLoading: false });
      return newUser;
    },
    logout: async () => {
      set({ user: null, isAuthenticated: false, isLoading: false });
    },
    init: async () => {
      set({ user: mockUser, isAuthenticated: true, isLoading: false });
    }
  };
}

export function createMockResumeStore() {
  const { subscribe, set, update } = writable([mockResume]);

  return {
    subscribe,
    create: async (title: string) => {
      const newResume = { ...mockResume, id: 'new-' + Date.now(), title };
      update(resumes => [...resumes, newResume]);
      return newResume;
    },
    update: async (id: string, data: Partial<Resume>) => {
      update(resumes => resumes.map(r => r.id === id ? { ...r, ...data } : r));
    },
    delete: async (id: string) => {
      update(resumes => resumes.filter(r => r.id !== id));
    }
  };
}