import { generateId } from '$lib/utils';
import type { IndustrySeedData } from './types';

/**
 * Professional-level industry seed data
 * For experienced professionals with established careers
 */

export const PROFESSIONAL_SEED_DATA: Record<string, IndustrySeedData> = {
  'technology': {
    id: 'technology',
    name: 'Technology & Software',
    description: 'For software developers, engineers, and IT professionals.',
    category: 'professional',
    targetRoles: ['Software Developer', 'Software Engineer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer'],
    targetIndustries: ['technology', 'software', 'engineering'],
    experienceLevel: ['entry', 'mid-level', 'senior'],
    
    summaryTemplates: [
      'Experienced software engineer with expertise in building scalable applications and solving complex technical challenges. Passionate about clean code, best practices, and continuous learning.',
      'Full-stack developer specializing in modern web technologies and cloud infrastructure. Proven track record of delivering high-quality solutions that drive business value.',
      'Results-driven software professional with strong foundation in computer science and hands-on experience across the full development lifecycle. Committed to technical excellence and team collaboration.',
      'Innovative technologist combining technical expertise with business acumen to create impactful software solutions. Strong communicator and collaborative team player.'
    ],
    
    skillSuggestions: [
      { name: 'JavaScript/TypeScript', category: 'technical', level: 'advanced', priority: 'high' },
      { name: 'React/Vue/Angular', category: 'technical', level: 'advanced', priority: 'high' },
      { name: 'Node.js', category: 'technical', level: 'intermediate', priority: 'high' },
      { name: 'Python', category: 'technical', level: 'intermediate', priority: 'medium' },
      { name: 'SQL/NoSQL Databases', category: 'technical', level: 'intermediate', priority: 'high' },
      { name: 'Git/Version Control', category: 'technical', level: 'advanced', priority: 'high' },
      { name: 'Cloud Platforms (AWS/Azure/GCP)', category: 'technical', level: 'intermediate', priority: 'high' },
      { name: 'CI/CD', category: 'technical', level: 'intermediate', priority: 'medium' },
      { name: 'Agile/Scrum', category: 'professional', level: 'intermediate', priority: 'medium' },
      { name: 'Problem Solving', category: 'soft', level: 'advanced', priority: 'high' }
    ],
    
    experienceExamples: [
      {
        id: generateId(),
        company: '[Company Name]',
        position: 'Software Engineer',
        location: '[City, State]',
        startDate: '2022-01',
        endDate: '',
        current: true,
        description: 'Develop and maintain full-stack web applications serving thousands of users. Collaborate with cross-functional teams to deliver high-quality software solutions.',
        highlights: [
          'Built and deployed scalable microservices handling 10K+ requests per day',
          'Reduced application load time by 40% through performance optimization',
          'Mentored junior developers and conducted code reviews',
          'Implemented CI/CD pipeline reducing deployment time by 60%',
          'Collaborated with product team to define technical requirements'
        ]
      }
    ],
    
    educationExamples: [
      {
        id: generateId(),
        institution: '[University Name]',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        location: '[City, State]',
        startDate: '2018-09',
        endDate: '2022-05',
        current: false,
        gpa: '3.7',
        honors: ['Dean\'s List', 'Computer Science Award'],
        description: 'Comprehensive computer science education with focus on software engineering, algorithms, and system design.'
      }
    ],
    
    guidance: {
      successTips: [
        'Highlight specific technologies and frameworks you\'ve used',
        'Quantify impact with metrics (performance improvements, users served, etc.)',
        'Include links to GitHub, portfolio, or live projects',
        'Emphasize both technical skills and soft skills',
        'Show continuous learning through certifications or side projects',
        'Demonstrate collaboration and communication abilities'
      ],
      salaryInfo: {
        range: { min: 70000, max: 150000 }
      }
    },
    
    industryKeywords: [
      'software development', 'full-stack', 'frontend', 'backend', 'web development',
      'JavaScript', 'React', 'Node.js', 'Python', 'cloud', 'AWS', 'microservices',
      'API', 'database', 'Git', 'agile', 'CI/CD', 'DevOps'
    ],
    
    actionVerbs: [
      'Developed', 'Built', 'Implemented', 'Designed', 'Optimized',
      'Deployed', 'Architected', 'Integrated', 'Automated', 'Scaled',
      'Collaborated', 'Mentored', 'Led', 'Improved', 'Delivered'
    ]
  },

  'business': {
    id: 'business',
    name: 'Business & Management',
    description: 'For business professionals, managers, and consultants.',
    category: 'professional',
    targetRoles: ['Business Analyst', 'Project Manager', 'Account Manager', 'Operations Manager', 'Consultant'],
    targetIndustries: ['business', 'consulting', 'finance', 'operations'],
    experienceLevel: ['mid-level', 'senior', 'executive'],
    
    summaryTemplates: [
      'Strategic business professional with proven track record of driving operational excellence and delivering measurable results. Skilled at leading cross-functional teams and managing complex projects.',
      'Results-oriented manager combining analytical expertise with strong leadership abilities. Experienced in process improvement, stakeholder management, and strategic planning.',
      'Dynamic business leader with expertise in project management, team development, and business strategy. Committed to driving growth and operational efficiency.',
      'Accomplished professional with strong business acumen and ability to translate strategy into action. Proven success in managing teams, budgets, and high-impact initiatives.'
    ],
    
    skillSuggestions: [
      { name: 'Project Management', category: 'professional', level: 'advanced', priority: 'high' },
      { name: 'Strategic Planning', category: 'professional', level: 'advanced', priority: 'high' },
      { name: 'Leadership', category: 'soft', level: 'advanced', priority: 'high' },
      { name: 'Data Analysis', category: 'technical', level: 'intermediate', priority: 'high' },
      { name: 'Stakeholder Management', category: 'professional', level: 'advanced', priority: 'high' },
      { name: 'Budget Management', category: 'professional', level: 'intermediate', priority: 'medium' },
      { name: 'Process Improvement', category: 'professional', level: 'advanced', priority: 'medium' },
      { name: 'Communication', category: 'soft', level: 'advanced', priority: 'high' },
      { name: 'Microsoft Excel', category: 'technical', level: 'advanced', priority: 'medium' },
      { name: 'Change Management', category: 'professional', level: 'intermediate', priority: 'medium' }
    ],
    
    experienceExamples: [
      {
        id: generateId(),
        company: '[Company Name]',
        position: 'Senior Business Analyst',
        location: '[City, State]',
        startDate: '2020-03',
        endDate: '',
        current: true,
        description: 'Lead business analysis and project management initiatives to drive operational improvements and strategic growth.',
        highlights: [
          'Managed portfolio of 5+ concurrent projects with combined budget of $2M',
          'Improved operational efficiency by 25% through process optimization',
          'Led cross-functional team of 10+ stakeholders across multiple departments',
          'Developed data-driven insights that informed executive decision-making',
          'Delivered projects on time and under budget with 95% stakeholder satisfaction'
        ]
      }
    ],
    
    educationExamples: [
      {
        id: generateId(),
        institution: '[University Name]',
        degree: 'Master of Business Administration (MBA)',
        field: 'Business Administration',
        location: '[City, State]',
        startDate: '2018-09',
        endDate: '2020-05',
        current: false,
        gpa: '3.8',
        honors: ['Beta Gamma Sigma Honor Society'],
        description: 'Comprehensive business education with focus on strategy, finance, and leadership.'
      }
    ],
    
    guidance: {
      successTips: [
        'Quantify achievements with specific metrics and ROI',
        'Highlight leadership and team management experience',
        'Emphasize strategic thinking and business impact',
        'Include certifications (PMP, Six Sigma, etc.)',
        'Show progression of increasing responsibility',
        'Demonstrate both analytical and interpersonal skills'
      ],
      salaryInfo: {
        range: { min: 60000, max: 130000 }
      }
    },
    
    industryKeywords: [
      'project management', 'business analysis', 'strategic planning', 'leadership',
      'operations', 'process improvement', 'stakeholder management', 'budget',
      'data analysis', 'team management', 'change management', 'consulting'
    ],
    
    actionVerbs: [
      'Led', 'Managed', 'Directed', 'Implemented', 'Optimized',
      'Developed', 'Coordinated', 'Analyzed', 'Improved', 'Delivered',
      'Achieved', 'Drove', 'Established', 'Streamlined', 'Executed'
    ]
  },

  'marketing': {
    id: 'marketing',
    name: 'Marketing & Communications',
    description: 'For marketing professionals, content creators, and communications specialists.',
    category: 'professional',
    targetRoles: ['Marketing Manager', 'Content Strategist', 'Social Media Manager', 'Brand Manager', 'Communications Specialist'],
    targetIndustries: ['marketing', 'advertising', 'communications', 'media'],
    experienceLevel: ['entry', 'mid-level', 'senior'],
    
    summaryTemplates: [
      'Creative marketing professional with expertise in digital strategy, content creation, and brand development. Proven ability to drive engagement and deliver measurable results.',
      'Strategic communicator combining creative vision with data-driven insights. Experienced in developing and executing integrated marketing campaigns across multiple channels.',
      'Results-oriented marketing specialist with strong background in social media, content marketing, and brand management. Passionate about storytelling and audience engagement.',
      'Dynamic marketing professional skilled at translating business objectives into compelling campaigns. Track record of increasing brand awareness and driving customer acquisition.'
    ],
    
    skillSuggestions: [
      { name: 'Digital Marketing', category: 'professional', level: 'advanced', priority: 'high' },
      { name: 'Content Strategy', category: 'professional', level: 'advanced', priority: 'high' },
      { name: 'Social Media Management', category: 'professional', level: 'advanced', priority: 'high' },
      { name: 'SEO/SEM', category: 'technical', level: 'intermediate', priority: 'high' },
      { name: 'Google Analytics', category: 'technical', level: 'intermediate', priority: 'high' },
      { name: 'Copywriting', category: 'professional', level: 'advanced', priority: 'high' },
      { name: 'Email Marketing', category: 'professional', level: 'intermediate', priority: 'medium' },
      { name: 'Adobe Creative Suite', category: 'technical', level: 'intermediate', priority: 'medium' },
      { name: 'Campaign Management', category: 'professional', level: 'advanced', priority: 'high' },
      { name: 'Brand Development', category: 'professional', level: 'intermediate', priority: 'medium' }
    ],
    
    experienceExamples: [
      {
        id: generateId(),
        company: '[Company Name]',
        position: 'Marketing Manager',
        location: '[City, State]',
        startDate: '2021-06',
        endDate: '',
        current: true,
        description: 'Lead digital marketing initiatives and content strategy to drive brand awareness and customer engagement.',
        highlights: [
          'Increased social media engagement by 150% through strategic content campaigns',
          'Managed marketing budget of $500K with 30% ROI improvement',
          'Developed and executed integrated campaigns across 5+ channels',
          'Grew email subscriber base by 200% through targeted lead generation',
          'Collaborated with sales team to generate 40% increase in qualified leads'
        ]
      }
    ],
    
    educationExamples: [
      {
        id: generateId(),
        institution: '[University Name]',
        degree: 'Bachelor of Arts',
        field: 'Marketing',
        location: '[City, State]',
        startDate: '2017-09',
        endDate: '2021-05',
        current: false,
        gpa: '3.6',
        honors: ['Marketing Excellence Award'],
        description: 'Comprehensive marketing education with focus on digital strategy and consumer behavior.'
      }
    ],
    
    guidance: {
      successTips: [
        'Showcase portfolio of campaigns and creative work',
        'Quantify results (engagement rates, conversions, ROI)',
        'Highlight both creative and analytical skills',
        'Include relevant certifications (Google Ads, HubSpot, etc.)',
        'Demonstrate understanding of current marketing trends',
        'Show ability to work with cross-functional teams'
      ],
      salaryInfo: {
        range: { min: 50000, max: 110000 }
      }
    },
    
    industryKeywords: [
      'digital marketing', 'content strategy', 'social media', 'SEO', 'SEM',
      'brand management', 'campaign management', 'analytics', 'copywriting',
      'email marketing', 'lead generation', 'engagement', 'ROI'
    ],
    
    actionVerbs: [
      'Developed', 'Created', 'Launched', 'Managed', 'Increased',
      'Drove', 'Executed', 'Optimized', 'Analyzed', 'Collaborated',
      'Designed', 'Implemented', 'Grew', 'Generated', 'Delivered'
    ]
  }
};
