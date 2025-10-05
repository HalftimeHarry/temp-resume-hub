import { generateId } from '$lib/utils';
import type { ClientTemplateConfig } from './types';

/**
 * Design-focused template configurations
 * These define ONLY the visual design/layout, not industry-specific content
 * Content is provided separately via industry seed data
 */

export const DESIGN_TEMPLATES: Record<string, ClientTemplateConfig> = {
  'clean-simple': {
    name: 'Clean & Simple',
    description: 'A straightforward, easy-to-read single-column layout. Perfect for any industry or experience level.',
    category: 'Modern',
    thumbnail: '/templates/first-job-starter.svg', // Reuse existing
    previewImages: ['/templates/first-job-starter-preview.png'],
    isPremium: false,
    tags: ['clean', 'simple', 'modern', 'single-column', 'versatile', 'ats-friendly'],
    settings: {
      template: 'clean-simple',
      colorScheme: 'blue',
      fontSize: 'medium' as 'medium',
      spacing: 'normal' as 'normal',
      showProfileImage: false,
      sectionOrder: ['personal', 'summary', 'experience', 'education', 'skills']
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
        summary: ''
      },
      summary: '',
      experience: [],
      education: [],
      skills: [],
      projects: [],
      settings: {
        layout: '1-page',
        mode: 'simple',
        template: 'clean-simple',
        colorScheme: 'blue',
        fontSize: 'medium' as 'medium',
        spacing: 'normal' as 'normal',
        showProfileImage: false,
        sectionOrder: ['personal', 'summary', 'experience', 'education', 'skills']
      }
    },
    targeting: {
      industries: ['any'],
      experience_levels: ['student', 'entry', 'mid-level'],
      job_types: ['any']
    }
  },

  'modern-professional': {
    name: 'Modern Professional',
    description: 'A clean, modern template with blue accent header. Balanced layout with clear visual hierarchy.',
    category: 'Modern',
    thumbnail: '/templates/modern-professional.svg',
    previewImages: ['/templates/modern-professional-preview.png'],
    isPremium: false,
    tags: ['modern', 'professional', 'clean', 'versatile', 'blue'],
    settings: {
      template: 'modern-professional',
      colorScheme: 'blue',
      fontSize: 'medium' as 'medium',
      spacing: 'normal' as 'normal',
      showProfileImage: false,
      sectionOrder: ['personal', 'summary', 'experience', 'education', 'skills']
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
        summary: ''
      },
      summary: '',
      experience: [],
      education: [],
      skills: [],
      projects: [],
      settings: {
        layout: '1-page',
        mode: 'professional',
        template: 'modern-professional',
        colorScheme: 'blue',
        fontSize: 'medium' as 'medium',
        spacing: 'normal' as 'normal',
        showProfileImage: false,
        sectionOrder: ['personal', 'summary', 'experience', 'education', 'skills']
      }
    },
    targeting: {
      industries: ['any'],
      experience_levels: ['mid-level', 'senior'],
      job_types: ['full-time', 'contract']
    }
  },

  'creative-portfolio': {
    name: 'Creative Portfolio',
    description: 'A vibrant two-column design with purple accents. Perfect for showcasing creative work and personality.',
    category: 'Creative',
    thumbnail: '/templates/creative-portfolio.svg',
    previewImages: ['/templates/creative-portfolio-preview.png'],
    isPremium: true,
    tags: ['creative', 'portfolio', 'colorful', 'two-column', 'artistic'],
    settings: {
      template: 'creative-portfolio',
      colorScheme: 'purple',
      fontSize: 'medium' as 'medium',
      spacing: 'relaxed' as 'relaxed',
      showProfileImage: true,
      sectionOrder: ['personal', 'summary', 'experience', 'education', 'skills', 'portfolio']
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
        summary: ''
      },
      summary: '',
      experience: [],
      education: [],
      skills: [],
      projects: [],
      settings: {
        layout: '2-column',
        mode: 'creative',
        template: 'creative-portfolio',
        colorScheme: 'purple',
        fontSize: 'medium' as 'medium',
        spacing: 'relaxed' as 'relaxed',
        showProfileImage: true,
        sectionOrder: ['personal', 'summary', 'experience', 'education', 'skills', 'portfolio']
      }
    },
    targeting: {
      industries: ['design', 'media', 'marketing', 'arts'],
      experience_levels: ['entry', 'mid-level', 'senior'],
      job_types: ['full-time', 'freelance', 'contract']
    }
  },

  'minimal-classic': {
    name: 'Minimal Classic',
    description: 'A timeless, minimal black and white design. Focuses on content with elegant simplicity.',
    category: 'Minimal',
    thumbnail: '/templates/minimal-classic.svg',
    previewImages: ['/templates/minimal-classic-preview.png'],
    isPremium: false,
    tags: ['minimal', 'classic', 'traditional', 'clean', 'black-white'],
    settings: {
      template: 'minimal-classic',
      colorScheme: 'black',
      fontSize: 'medium' as 'medium',
      spacing: 'compact' as 'compact',
      showProfileImage: false,
      sectionOrder: ['personal', 'summary', 'experience', 'education', 'skills']
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
        summary: ''
      },
      summary: '',
      experience: [],
      education: [],
      skills: [],
      projects: [],
      settings: {
        layout: '1-page',
        mode: 'professional',
        template: 'minimal-classic',
        colorScheme: 'black',
        fontSize: 'medium' as 'medium',
        spacing: 'compact' as 'compact',
        showProfileImage: false,
        sectionOrder: ['personal', 'summary', 'experience', 'education', 'skills']
      }
    },
    targeting: {
      industries: ['finance', 'legal', 'consulting', 'government'],
      experience_levels: ['mid-level', 'senior', 'executive'],
      job_types: ['full-time']
    }
  },

  'tech-professional': {
    name: 'Tech Professional',
    description: 'A two-column layout with green accents. Designed to highlight technical skills and projects.',
    category: 'Professional',
    thumbnail: '/templates/tech-professional.svg',
    previewImages: ['/templates/tech-professional-preview.png'],
    isPremium: false,
    tags: ['tech', 'professional', 'two-column', 'developer', 'engineer', 'green'],
    settings: {
      template: 'tech-professional',
      colorScheme: 'green',
      fontSize: 'medium' as 'medium',
      spacing: 'normal' as 'normal',
      showProfileImage: false,
      sectionOrder: ['personal', 'summary', 'experience', 'education', 'skills', 'projects']
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
        summary: ''
      },
      summary: '',
      experience: [],
      education: [],
      skills: [],
      projects: [],
      settings: {
        layout: '2-column',
        mode: 'professional',
        template: 'tech-professional',
        colorScheme: 'green',
        fontSize: 'medium' as 'medium',
        spacing: 'normal' as 'normal',
        showProfileImage: false,
        sectionOrder: ['personal', 'summary', 'experience', 'education', 'skills', 'projects']
      }
    },
    targeting: {
      industries: ['technology', 'software', 'engineering'],
      experience_levels: ['entry', 'mid-level', 'senior'],
      job_types: ['full-time', 'contract', 'remote']
    }
  },

  'academic-scholar': {
    name: 'Academic Scholar',
    description: 'A comprehensive layout for academic professionals. Emphasizes education, research, and publications.',
    category: 'Academic',
    thumbnail: '/templates/academic-scholar.svg',
    previewImages: ['/templates/academic-scholar-preview.png'],
    isPremium: true,
    tags: ['academic', 'research', 'scholar', 'education', 'publications'],
    settings: {
      template: 'academic-scholar',
      colorScheme: 'blue',
      fontSize: 'medium' as 'medium',
      spacing: 'relaxed' as 'relaxed',
      showProfileImage: false,
      sectionOrder: ['personal', 'summary', 'education', 'experience', 'publications', 'research', 'skills']
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
        summary: ''
      },
      summary: '',
      experience: [],
      education: [],
      skills: [],
      projects: [],
      settings: {
        layout: '1-page',
        mode: 'academic',
        template: 'academic-scholar',
        colorScheme: 'blue',
        fontSize: 'medium' as 'medium',
        spacing: 'relaxed' as 'relaxed',
        showProfileImage: false,
        sectionOrder: ['personal', 'summary', 'education', 'experience', 'publications', 'research', 'skills']
      }
    },
    targeting: {
      industries: ['education', 'research', 'academic'],
      experience_levels: ['mid-level', 'senior', 'executive'],
      job_types: ['full-time', 'part-time', 'contract']
    }
  }
};
