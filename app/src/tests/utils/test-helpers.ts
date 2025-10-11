import { vi } from 'vitest';
import type { UserProfile, Resume } from '../../types';

/**
 * Mock AI service responses for testing
 */
export const mockAIResponses = {
  summary: {
    experienced: 'Experienced software engineer with 10+ years of expertise in full-stack development.',
    firstTime: 'Motivated recent graduate eager to apply technical skills in a professional environment.',
    careerChange: 'Transitioning professional bringing transferable skills and fresh perspective.'
  },
  experience: {
    formatted: 'Led development of scalable web applications using React and Node.js.',
    achievements: ['Improved performance by 40%', 'Mentored 5 junior developers']
  },
  skills: {
    technical: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
    soft: ['Leadership', 'Communication', 'Problem Solving']
  }
};

/**
 * Create a mock AI service for testing
 */
export function createMockAIService() {
  return {
    generateSummary: vi.fn().mockResolvedValue(mockAIResponses.summary.experienced),
    formatExperience: vi.fn().mockResolvedValue(mockAIResponses.experience.formatted),
    extractSkills: vi.fn().mockResolvedValue(mockAIResponses.skills.technical),
    generateAchievements: vi.fn().mockResolvedValue(mockAIResponses.experience.achievements)
  };
}

/**
 * Create a mock database service for testing
 */
export function createMockDatabase() {
  const resumes = new Map<string, Resume>();
  
  return {
    saveResume: vi.fn().mockImplementation(async (resume: Resume) => {
      resumes.set(resume.id, resume);
      return resume;
    }),
    getResume: vi.fn().mockImplementation(async (id: string) => {
      return resumes.get(id) || null;
    }),
    updateResume: vi.fn().mockImplementation(async (id: string, updates: Partial<Resume>) => {
      const existing = resumes.get(id);
      if (!existing) throw new Error('Resume not found');
      const updated = { ...existing, ...updates };
      resumes.set(id, updated);
      return updated;
    }),
    deleteResume: vi.fn().mockImplementation(async (id: string) => {
      return resumes.delete(id);
    }),
    listResumes: vi.fn().mockImplementation(async (userId: string) => {
      return Array.from(resumes.values()).filter(r => r.user_id === userId);
    }),
    clear: () => resumes.clear()
  };
}

/**
 * Calculate profile completeness score
 */
export function calculateCompletenessScore(profile: UserProfile): number {
  const fields = [
    profile.first_name,
    profile.last_name,
    profile.user,
    profile.phone,
    profile.location,
    profile.linkedin_url,
    profile.portfolio_url,
    profile.target_industry,
    profile.experience_level,
    profile.target_job_titles,
    profile.key_skills,
    profile.professional_summary,
    profile.work_experience,
    profile.education
  ];
  
  const filledFields = fields.filter(Boolean).length;
  return Math.round((filledFields / fields.length) * 100);
}

/**
 * Validate profile has minimum required fields
 */
export function validateMinimumProfile(profile: UserProfile): { valid: boolean; missing: string[] } {
  const required = {
    first_name: profile.first_name,
    last_name: profile.last_name,
    user: profile.user // user field contains email
  };
  
  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key);
  
  return {
    valid: missing.length === 0,
    missing
  };
}

/**
 * Create a test resume object
 */
export function createTestResume(overrides: Partial<Resume> = {}): Resume {
  return {
    id: 'test-resume-' + Date.now(),
    user_id: 'test-user-123',
    title: 'Software Engineer Resume',
    slug: 'software-engineer-resume',
    template: 'professional',
    strategy: 'auto',
    content: {
      personal: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-0100',
        location: 'San Francisco, CA'
      },
      summary: 'Experienced software engineer',
      experience: [],
      education: [],
      skills: []
    },
    metadata: {
      completeness_score: 100,
      generation_time: 1500,
      version: 1
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides
  };
}

/**
 * Wait for async operations to complete
 */
export function waitFor(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Mock fetch for API testing
 */
export function createMockFetch(responses: Record<string, any>) {
  return vi.fn().mockImplementation((url: string) => {
    const response = responses[url];
    if (!response) {
      return Promise.reject(new Error(`No mock response for ${url}`));
    }
    
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response))
    });
  });
}

/**
 * Create mock template service
 */
export function createMockTemplateService() {
  return {
    getTemplate: vi.fn().mockImplementation((name: string) => ({
      name,
      layout: 'standard',
      styles: {},
      sections: ['personal', 'summary', 'experience', 'education', 'skills']
    })),
    applyTemplate: vi.fn().mockImplementation((content: any, template: string) => ({
      ...content,
      template,
      formatted: true
    })),
    listTemplates: vi.fn().mockResolvedValue(['professional', 'creative', 'minimal'])
  };
}

/**
 * Assert resume structure is valid
 */
export function assertValidResumeStructure(resume: any): asserts resume is Resume {
  if (!resume.id) throw new Error('Resume missing id');
  if (!resume.user_id) throw new Error('Resume missing user_id');
  if (!resume.title) throw new Error('Resume missing title');
  if (!resume.content) throw new Error('Resume missing content');
  if (!resume.content.personal) throw new Error('Resume missing personal section');
  if (!resume.created_at) throw new Error('Resume missing created_at');
}

/**
 * Generate random test data
 */
export const testDataGenerators = {
  email: () => `test${Date.now()}@example.com`,
  phone: () => `555-${Math.floor(1000 + Math.random() * 9000)}`,
  slug: (base: string) => `${base}-${Date.now()}`,
  userId: () => `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
};

/**
 * Mock error scenarios
 */
export const mockErrors = {
  network: new Error('Network request failed'),
  database: new Error('Database connection failed'),
  validation: new Error('Validation failed'),
  notFound: new Error('Resource not found'),
  unauthorized: new Error('Unauthorized access')
};

/**
 * Create spy for tracking function calls
 */
export function createSpy<T extends (...args: any[]) => any>(implementation?: T) {
  return vi.fn(implementation);
}
