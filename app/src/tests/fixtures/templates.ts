import type { ExtendedResumeTemplate } from '$lib/templates/types';

/**
 * Test fixtures for various template scenarios
 */

// Complete professional template with all sections
export const professionalTemplate: ExtendedResumeTemplate = {
  id: 'template-professional',
  name: 'Professional Template',
  description: 'Clean professional template for experienced professionals',
  category: 'Modern',
  thumbnail: '/templates/professional.svg',
  previewImages: ['/templates/professional-preview.png'],
  settings: {
    template: 'professional',
    colorScheme: 'blue',
    fontSize: 'medium',
    spacing: 'normal',
    showProfileImage: false,
    sectionOrder: ['personal', 'summary', 'experience', 'education', 'skills', 'projects']
  },
  sections: [],
  starterData: {
    personalInfo: {
      fullName: 'John Doe',
      email: 'john.doe@email.com',
      phone: '(555) 123-4567',
      location: 'Your City, State',
      website: 'johndoe.com',
      linkedin: 'linkedin.com/in/johndoe',
      github: 'github.com/johndoe',
      summary: ''
    },
    summary: 'Experienced professional with a proven track record of delivering high-quality solutions in fast-paced environments. Strong technical skills combined with excellent communication and leadership abilities.',
    experience: [
      {
        id: 'exp-1',
        company: 'Example Corp',
        position: 'Software Engineer',
        location: 'Remote',
        startDate: '2020-01',
        endDate: '2023-12',
        current: false,
        description: 'Developed web applications using modern technologies',
        highlights: [
          'Built scalable microservices architecture',
          'Improved application performance by 40%',
          'Led team of 3 developers'
        ]
      },
      {
        id: 'exp-2',
        company: 'Tech Startup',
        position: 'Junior Developer',
        location: 'San Francisco, CA',
        startDate: '2018-06',
        endDate: '2019-12',
        current: false,
        description: 'Contributed to product development',
        highlights: [
          'Implemented new features',
          'Fixed critical bugs'
        ]
      }
    ],
    education: [
      {
        id: 'edu-1',
        institution: 'University Example',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        location: 'City, State',
        startDate: '2014-09',
        endDate: '2018-05',
        current: false,
        gpa: '3.8',
        honors: ['Dean\'s List', 'Honors Program'],
        description: ''
      }
    ],
    skills: [
      {
        id: 'skill-1',
        name: 'JavaScript',
        level: 'advanced',
        category: 'Programming Languages'
      },
      {
        id: 'skill-2',
        name: 'React',
        level: 'advanced',
        category: 'Frameworks & Libraries'
      },
      {
        id: 'skill-3',
        name: 'Node.js',
        level: 'intermediate',
        category: 'Frameworks & Libraries'
      },
      {
        id: 'skill-4',
        name: 'PostgreSQL',
        level: 'intermediate',
        category: 'Databases'
      }
    ],
    projects: [
      {
        id: 'proj-1',
        name: 'Example Project',
        description: 'Built a full-stack web application',
        technologies: ['React', 'Node.js', 'MongoDB'],
        url: 'https://example.com',
        github: 'https://github.com/example/project',
        startDate: '2023-01',
        endDate: '2023-06',
        highlights: ['Implemented authentication', 'Built RESTful API']
      }
    ],
    settings: {
      layout: '1-page',
      mode: 'simple',
      template: 'professional',
      colorScheme: 'blue',
      fontSize: 'medium',
      spacing: 'normal',
      showProfileImage: false,
      sectionOrder: ['personal', 'summary', 'experience', 'education', 'skills']
    }
  },
  isPremium: false,
  isPopular: true,
  createdBy: 'system',
  createdAt: '2024-01-01T00:00:00Z',
  usageCount: 1000,
  rating: 4.5,
  tags: ['professional', 'modern', 'clean'],
  targeting: {
    industries: ['software-engineering', 'technology'],
    experience_levels: ['mid-level', 'senior'],
    job_types: ['full-time']
  }
};

// Student/entry-level template
export const studentTemplate: ExtendedResumeTemplate = {
  id: 'template-student',
  name: 'Student Template',
  description: 'Template designed for students and first-time job seekers',
  category: 'Academic',
  thumbnail: '/templates/student.svg',
  previewImages: ['/templates/student-preview.png'],
  settings: {
    template: 'student',
    colorScheme: 'green',
    fontSize: 'medium',
    spacing: 'normal',
    showProfileImage: false,
    sectionOrder: ['personal', 'summary', 'education', 'projects', 'skills', 'experience']
  },
  sections: [],
  starterData: {
    personalInfo: {
      fullName: 'Jane Student',
      email: 'jane.student@university.edu',
      phone: '(555) 987-6543',
      location: 'College Town, ST',
      website: '',
      linkedin: '',
      github: '',
      summary: ''
    },
    summary: 'Motivated computer science student with strong academic background and hands-on project experience. Eager to apply technical skills in a professional environment.',
    experience: [],
    education: [
      {
        id: 'edu-1',
        institution: 'State University',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        location: 'College Town, ST',
        startDate: '2020-09',
        endDate: '2024-05',
        current: true,
        gpa: '3.7',
        honors: ['Dean\'s List'],
        description: 'Relevant coursework: Data Structures, Algorithms, Web Development'
      }
    ],
    skills: [
      {
        id: 'skill-1',
        name: 'Python',
        level: 'intermediate',
        category: 'Programming Languages'
      },
      {
        id: 'skill-2',
        name: 'Java',
        level: 'intermediate',
        category: 'Programming Languages'
      },
      {
        id: 'skill-3',
        name: 'Git',
        level: 'beginner',
        category: 'Tools & Software'
      }
    ],
    projects: [
      {
        id: 'proj-1',
        name: 'Academic Project',
        description: 'Built a web application for course project',
        technologies: ['HTML', 'CSS', 'JavaScript'],
        url: '',
        github: '',
        startDate: '2023-09',
        endDate: '2023-12',
        highlights: ['Implemented user authentication', 'Responsive design']
      }
    ],
    settings: {
      layout: '1-page',
      mode: 'simple',
      template: 'student',
      colorScheme: 'green',
      fontSize: 'medium',
      spacing: 'normal',
      showProfileImage: false,
      sectionOrder: ['personal', 'summary', 'education', 'projects', 'skills']
    }
  },
  isPremium: false,
  isPopular: true,
  createdBy: 'system',
  createdAt: '2024-01-01T00:00:00Z',
  usageCount: 500,
  rating: 4.3,
  tags: ['student', 'entry-level', 'academic'],
  targeting: {
    industries: ['any'],
    experience_levels: ['student', 'entry-level'],
    job_types: ['internship', 'entry-level']
  }
};

// Minimal template (no starter data)
export const minimalTemplate: ExtendedResumeTemplate = {
  id: 'template-minimal',
  name: 'Minimal Template',
  description: 'Blank template with minimal starter data',
  category: 'Minimal',
  thumbnail: '/templates/minimal.svg',
  previewImages: ['/templates/minimal-preview.png'],
  settings: {
    template: 'minimal',
    colorScheme: 'gray',
    fontSize: 'medium',
    spacing: 'compact',
    showProfileImage: false,
    sectionOrder: ['personal', 'experience', 'education', 'skills']
  },
  sections: [],
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
      template: 'minimal',
      colorScheme: 'gray',
      fontSize: 'medium',
      spacing: 'compact',
      showProfileImage: false,
      sectionOrder: ['personal', 'experience', 'education', 'skills']
    }
  },
  isPremium: false,
  isPopular: false,
  createdBy: 'system',
  createdAt: '2024-01-01T00:00:00Z',
  usageCount: 50,
  rating: 3.5,
  tags: ['minimal', 'blank'],
  targeting: {
    industries: ['any'],
    experience_levels: ['any'],
    job_types: ['any']
  }
};

// Template without starterData (edge case)
export const emptyTemplate: ExtendedResumeTemplate = {
  id: 'template-empty',
  name: 'Empty Template',
  description: 'Template with no starter data',
  category: 'Test',
  thumbnail: '/templates/empty.svg',
  previewImages: [],
  settings: {
    template: 'empty',
    colorScheme: 'blue',
    fontSize: 'medium',
    spacing: 'normal',
    showProfileImage: false,
    sectionOrder: ['personal']
  },
  sections: [],
  starterData: undefined,
  isPremium: false,
  isPopular: false,
  createdBy: 'system',
  createdAt: '2024-01-01T00:00:00Z',
  usageCount: 0,
  rating: 0,
  tags: ['test'],
  targeting: {
    industries: [],
    experience_levels: [],
    job_types: []
  }
};

// Creative template with different structure
export const creativeTemplate: ExtendedResumeTemplate = {
  id: 'template-creative',
  name: 'Creative Template',
  description: 'Bold template for creative professionals',
  category: 'Creative',
  thumbnail: '/templates/creative.svg',
  previewImages: ['/templates/creative-preview.png'],
  settings: {
    template: 'creative',
    colorScheme: 'purple',
    fontSize: 'large',
    spacing: 'relaxed',
    showProfileImage: true,
    sectionOrder: ['personal', 'summary', 'projects', 'skills', 'experience', 'education']
  },
  sections: [],
  starterData: {
    personalInfo: {
      fullName: 'Creative Designer',
      email: 'creative@design.com',
      phone: '',
      location: 'New York, NY',
      website: 'creativeportfolio.com',
      linkedin: '',
      github: '',
      summary: ''
    },
    summary: 'Creative professional with a passion for innovative design and user experience.',
    experience: [
      {
        id: 'exp-1',
        company: 'Design Studio',
        position: 'UX Designer',
        location: 'New York, NY',
        startDate: '2021-01',
        endDate: '',
        current: true,
        description: 'Lead UX design for client projects',
        highlights: ['Designed 20+ user interfaces', 'Improved user satisfaction by 35%']
      }
    ],
    education: [
      {
        id: 'edu-1',
        institution: 'Art Institute',
        degree: 'Bachelor of Fine Arts',
        field: 'Graphic Design',
        location: 'New York, NY',
        startDate: '2017-09',
        endDate: '2021-05',
        current: false,
        gpa: '',
        honors: [],
        description: ''
      }
    ],
    skills: [
      {
        id: 'skill-1',
        name: 'Figma',
        level: 'expert',
        category: 'Design'
      },
      {
        id: 'skill-2',
        name: 'Adobe XD',
        level: 'advanced',
        category: 'Design'
      },
      {
        id: 'skill-3',
        name: 'UI/UX Design',
        level: 'expert',
        category: 'Design'
      }
    ],
    projects: [
      {
        id: 'proj-1',
        name: 'Mobile App Redesign',
        description: 'Complete redesign of popular mobile application',
        technologies: ['Figma', 'Sketch', 'Prototyping'],
        url: 'https://behance.net/project',
        github: '',
        startDate: '2023-03',
        endDate: '2023-08',
        highlights: ['Increased user engagement by 50%', 'Won design award']
      }
    ],
    settings: {
      layout: '2-page',
      mode: 'elaborate',
      template: 'creative',
      colorScheme: 'purple',
      fontSize: 'large',
      spacing: 'relaxed',
      showProfileImage: true,
      sectionOrder: ['personal', 'summary', 'projects', 'skills', 'experience']
    }
  },
  isPremium: true,
  isPopular: true,
  createdBy: 'designer',
  createdAt: '2024-01-01T00:00:00Z',
  usageCount: 300,
  rating: 4.7,
  tags: ['creative', 'design', 'bold', 'colorful'],
  targeting: {
    industries: ['design', 'creative', 'marketing'],
    experience_levels: ['mid-level', 'senior'],
    job_types: ['full-time', 'freelance']
  }
};
