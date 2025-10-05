import { generateId } from '$lib/utils';
import type { ClientTemplateConfig } from './types';

/**
 * Additional template configurations
 * Migrated from database to client-side
 */
export const ADDITIONAL_TEMPLATES: Record<string, ClientTemplateConfig> = {
  'creative-portfolio': {
    name: 'Creative Portfolio',
    description: 'A vibrant template designed for creative professionals. Showcases your personality and creative work.',
    category: 'Creative',
    thumbnail: '/templates/creative-portfolio.svg',
    previewImages: ['/templates/creative-portfolio-preview-1.png'],
    isPremium: true,
    tags: ['creative', 'portfolio', 'colorful', 'artistic'],
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
        summary: 'Creative professional with a passion for innovative design and storytelling.'
      },
      summary: 'Creative professional with a passion for innovative design and storytelling.',
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
    description: 'A timeless, minimal design that focuses on content. Perfect for traditional industries.',
    category: 'Minimal',
    thumbnail: '/templates/minimal-classic.svg',
    previewImages: ['/templates/minimal-classic-preview-1.png'],
    isPremium: false,
    tags: ['minimal', 'classic', 'traditional', 'clean'],
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
        summary: 'Experienced professional with strong background in traditional industries.'
      },
      summary: 'Experienced professional with strong background in traditional industries.',
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
    description: 'Designed specifically for tech professionals. Highlights technical skills and projects effectively.',
    category: 'Professional',
    thumbnail: '/templates/tech-professional.svg',
    previewImages: ['/templates/tech-professional-preview-1.png'],
    isPremium: false,
    tags: ['tech', 'professional', 'developer', 'engineer'],
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
        summary: 'Software engineer with expertise in building scalable applications.'
      },
      summary: 'Software engineer with expertise in building scalable applications.',
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
    description: 'A comprehensive template for academic professionals. Includes sections for publications and research.',
    category: 'Academic',
    thumbnail: '/templates/academic-scholar.svg',
    previewImages: ['/templates/academic-scholar-preview-1.png'],
    isPremium: true,
    tags: ['academic', 'research', 'scholar', 'education'],
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
        summary: 'Academic researcher with focus on advancing knowledge in specialized field.'
      },
      summary: 'Academic researcher with focus on advancing knowledge in specialized field.',
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
  },

  'lifeguard-ready': {
    name: 'Lifeguard Ready',
    description: 'Designed specifically for lifeguard positions. Emphasizes safety training, certifications, and responsibility.',
    category: 'Entry Level',
    thumbnail: '/templates/lifeguard-ready.svg',
    previewImages: ['/templates/lifeguard-ready-preview-1.png'],
    isPremium: false,
    tags: ['entry-level', 'lifeguard', 'safety', 'certifications'],
    settings: {
      template: 'lifeguard-ready',
      colorScheme: 'blue',
      fontSize: 'medium' as 'medium',
      spacing: 'normal' as 'normal',
      showProfileImage: false,
      sectionOrder: ['personal', 'summary', 'certifications', 'experience', 'education', 'skills']
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
        summary: 'Certified lifeguard committed to water safety and emergency response.'
      },
      summary: 'Certified lifeguard committed to water safety and emergency response.',
      experience: [],
      education: [],
      skills: [],
      projects: [],
      settings: {
        layout: '1-page',
        mode: 'simple',
        template: 'lifeguard-ready',
        colorScheme: 'blue',
        fontSize: 'medium' as 'medium',
        spacing: 'normal' as 'normal',
        showProfileImage: false,
        sectionOrder: ['personal', 'summary', 'certifications', 'experience', 'education', 'skills']
      }
    },
    targeting: {
      industries: ['recreation', 'hospitality', 'fitness'],
      experience_levels: ['student', 'entry'],
      job_types: ['part-time', 'seasonal', 'full-time']
    }
  },

  'hospitality-helper': {
    name: 'Hospitality Helper',
    description: 'Great for hostess, server, or other hospitality positions. Highlights customer service skills and availability.',
    category: 'Entry Level',
    thumbnail: '/templates/hospitality-helper.svg',
    previewImages: ['/templates/hospitality-helper-preview-1.png'],
    isPremium: false,
    tags: ['entry-level', 'hospitality', 'server', 'customer-service'],
    settings: {
      template: 'hospitality-helper',
      colorScheme: 'green',
      fontSize: 'medium' as 'medium',
      spacing: 'normal' as 'normal',
      showProfileImage: false,
      sectionOrder: ['personal', 'summary', 'experience', 'education', 'skills', 'availability']
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
        summary: 'Friendly and energetic hospitality professional with excellent customer service skills.'
      },
      summary: 'Friendly and energetic hospitality professional with excellent customer service skills.',
      experience: [],
      education: [],
      skills: [],
      projects: [],
      settings: {
        layout: '1-page',
        mode: 'simple',
        template: 'hospitality-helper',
        colorScheme: 'green',
        fontSize: 'medium' as 'medium',
        spacing: 'normal' as 'normal',
        showProfileImage: false,
        sectionOrder: ['personal', 'summary', 'experience', 'education', 'skills', 'availability']
      }
    },
    targeting: {
      industries: ['hospitality', 'food-service', 'restaurant'],
      experience_levels: ['student', 'entry'],
      job_types: ['part-time', 'full-time']
    }
  },

  'retail-pro': {
    name: 'Retail Pro',
    description: 'Ideal for retail positions like cashier or sales associate. Emphasizes cash handling and customer service skills.',
    category: 'Entry Level',
    thumbnail: '/templates/retail-pro.svg',
    previewImages: ['/templates/retail-pro-preview-1.png'],
    isPremium: false,
    tags: ['entry-level', 'retail', 'cashier', 'sales'],
    settings: {
      template: 'retail-pro',
      colorScheme: 'purple',
      fontSize: 'medium' as 'medium',
      spacing: 'normal' as 'normal',
      showProfileImage: false,
      sectionOrder: ['personal', 'summary', 'experience', 'education', 'skills', 'achievements']
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
        summary: 'Reliable retail professional with strong customer service and cash handling skills.'
      },
      summary: 'Reliable retail professional with strong customer service and cash handling skills.',
      experience: [],
      education: [],
      skills: [],
      projects: [],
      settings: {
        layout: '1-page',
        mode: 'simple',
        template: 'retail-pro',
        colorScheme: 'purple',
        fontSize: 'medium' as 'medium',
        spacing: 'normal' as 'normal',
        showProfileImage: false,
        sectionOrder: ['personal', 'summary', 'experience', 'education', 'skills', 'achievements']
      }
    },
    targeting: {
      industries: ['retail', 'customer-service'],
      experience_levels: ['student', 'entry'],
      job_types: ['part-time', 'full-time']
    }
  },

  'service-star': {
    name: 'Service Star',
    description: 'Perfect for gas station attendant, fast food worker, or similar service positions. Highlights reliability and work ethic.',
    category: 'Entry Level',
    thumbnail: '/templates/service-star.svg',
    previewImages: ['/templates/service-star-preview-1.png'],
    isPremium: false,
    tags: ['entry-level', 'service', 'fast-food', 'reliability'],
    settings: {
      template: 'service-star',
      colorScheme: 'orange',
      fontSize: 'medium' as 'medium',
      spacing: 'normal' as 'normal',
      showProfileImage: false,
      sectionOrder: ['personal', 'summary', 'experience', 'education', 'skills', 'references']
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
        summary: 'Dependable service worker with strong work ethic and positive attitude.'
      },
      summary: 'Dependable service worker with strong work ethic and positive attitude.',
      experience: [],
      education: [],
      skills: [],
      projects: [],
      settings: {
        layout: '1-page',
        mode: 'simple',
        template: 'service-star',
        colorScheme: 'orange',
        fontSize: 'medium' as 'medium',
        spacing: 'normal' as 'normal',
        showProfileImage: false,
        sectionOrder: ['personal', 'summary', 'experience', 'education', 'skills', 'references']
      }
    },
    targeting: {
      industries: ['food-service', 'retail', 'customer-service'],
      experience_levels: ['student', 'entry'],
      job_types: ['part-time', 'full-time']
    }
  }
};
