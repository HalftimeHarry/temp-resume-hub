import { generateId } from '$lib/utils';
import type { ClientTemplateConfig } from './types';

/**
 * Client-side template configurations
 * These take precedence over database templates during development
 */
export const TEMPLATE_CONFIGURATIONS: Record<string, ClientTemplateConfig> = {
  'first-job-starter': {
    name: 'First Job Starter',
    description: 'Perfect template for students and recent graduates seeking their first job. Emphasizes education, skills, and potential over extensive work experience.',
    category: 'Entry Level',
    thumbnail: '/templates/first-job-starter.svg',
    previewImages: [
      '/templates/first-job-starter-preview-1.png',
      '/templates/first-job-starter-preview-2.png',
      '/templates/first-job-starter-preview-3.png'
    ],
    isPremium: false,
    tags: ['entry-level', 'first-job', 'student', 'graduate', 'clean', 'professional'],
    settings: {
      template: 'first-job-starter',
      colorScheme: 'green',
      fontSize: 'medium' as 'medium',
      spacing: 'normal' as 'normal',
      showProfileImage: false,
      sectionOrder: [
        'personal',
        'summary', 
        'education',
        'skills',
        'experience'
      ]
    },
    starterData: {
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        linkedin: '',
        github: '',
        summary: 'Motivated student/graduate seeking an entry-level opportunity to develop skills and contribute to a team.'
      },
      summary: 'Motivated student/graduate seeking an entry-level opportunity to develop skills and contribute to a team.',
      experience: [],
      education: [
        {
          id: generateId(),
          institution: '',
          degree: 'High School Diploma',
          field: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          gpa: '',
          honors: ['Honor Roll'],
          description: ''
        }
      ],
      skills: [
        {
          id: generateId(),
          name: 'Time Management',
          level: 'intermediate' as 'intermediate',
          category: 'Soft Skills'
        },
        {
          id: generateId(),
          name: 'Communication',
          level: 'intermediate' as 'intermediate', 
          category: 'Soft Skills'
        },
        {
          id: generateId(),
          name: 'Basic Computer Skills',
          level: 'intermediate' as 'intermediate',
          category: 'Technical'
        }
      ],
      projects: [],
      settings: {
        layout: '1-page',
        mode: 'simple',
        template: 'first-job-starter',
        colorScheme: 'green',
        fontSize: 'medium' as 'medium',
        spacing: 'normal' as 'normal',
        showProfileImage: false,
        sectionOrder: [
          'personal',
          'summary',
          'education', 
          'skills',
          'experience'
        ]
      }
    },
    targeting: {
      industries: ['retail', 'food-service', 'customer-service', 'entry-level'],
      experience_levels: ['student', 'entry'],
      job_types: ['part-time', 'full-time', 'internship', 'entry-level']
    }
  },

  // Add more template configurations here as needed
  'modern-professional': {
    name: 'Modern Professional',
    description: 'A clean, modern template perfect for professionals in any field. Features a balanced layout with clear sections.',
    category: 'Modern',
    thumbnail: '/templates/modern-professional.svg',
    previewImages: ['/templates/modern-professional-preview-1.png'],
    isPremium: false,
    tags: ['modern', 'professional', 'clean', 'versatile'],
    settings: {
      template: 'modern-professional',
      colorScheme: 'blue',
      fontSize: 'medium' as 'medium',
      spacing: 'normal' as 'normal',
      showProfileImage: false,
      sectionOrder: [
        'personal',
        'summary',
        'experience',
        'education',
        'skills'
      ]
    },
    starterData: {
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        linkedin: '',
        github: '',
        summary: 'Experienced professional with a proven track record of success.'
      },
      summary: 'Experienced professional with a proven track record of success in delivering high-quality results and driving team performance.',
      experience: [
        {
          id: generateId(),
          company: 'Example Company',
          position: 'Professional Role',
          location: 'City, State',
          startDate: '2022-01',
          endDate: '',
          current: true,
          description: 'Led cross-functional teams to deliver innovative solutions and exceed performance targets.',
          highlights: []
        }
      ],
      education: [
        {
          id: generateId(),
          institution: 'University Name',
          degree: 'Bachelor of Science',
          field: 'Your Field',
          location: 'City, State',
          startDate: '2018-09',
          endDate: '2022-05',
          current: false,
          gpa: '',
          honors: [],
          description: ''
        }
      ],
      skills: [
        {
          id: generateId(),
          name: 'Leadership',
          level: 'advanced' as 'advanced',
          category: 'Soft Skills'
        },
        {
          id: generateId(),
          name: 'Project Management',
          level: 'advanced' as 'advanced',
          category: 'Professional'
        },
        {
          id: generateId(),
          name: 'Strategic Planning',
          level: 'intermediate' as 'intermediate',
          category: 'Professional'
        }
      ],
      projects: [],
      settings: {
        layout: '1-page',
        mode: 'professional',
        template: 'modern-professional',
        colorScheme: 'blue',
        fontSize: 'medium' as 'medium',
        spacing: 'normal' as 'normal',
        showProfileImage: false,
        sectionOrder: [
          'personal',
          'summary',
          'experience',
          'education',
          'skills'
        ]
      }
    },
    targeting: {
      industries: ['business', 'technology', 'consulting', 'finance'],
      experience_levels: ['mid-level', 'senior'],
      job_types: ['full-time', 'contract', 'consulting']
    }
  }
};

/**
 * Get all available client-side template IDs
 */
export function getClientTemplateIds(): string[] {
  return Object.keys(TEMPLATE_CONFIGURATIONS);
}

/**
 * Get a specific client-side template configuration
 */
export function getClientTemplate(id: string): ClientTemplateConfig | undefined {
  return TEMPLATE_CONFIGURATIONS[id];
}

/**
 * Check if a template ID exists in client-side configurations
 */
export function isClientTemplate(id: string): boolean {
  return id in TEMPLATE_CONFIGURATIONS;
}