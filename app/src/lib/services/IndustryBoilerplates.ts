/**
 * Industry-Specific Boilerplate Service
 * 
 * Provides starter content for resumes based on target industry
 */

import type { Skill, Experience, Education } from '$lib/types/resume';
import { generateId } from '$lib/utils';

export interface IndustryBoilerplate {
  summary: string;
  skills: Skill[];
  keywords: string[];
  experience: Experience[];
  education: Education[];
}

/**
 * Industry-specific boilerplate data
 */
const INDUSTRY_BOILERPLATES: Record<string, IndustryBoilerplate> = {
  'Technology': {
    summary: 'Results-driven technology professional with expertise in software development and digital innovation. Proven ability to design, develop, and deploy scalable solutions. Strong technical skills combined with excellent problem-solving abilities and a passion for emerging technologies.',
    skills: [
      { id: generateId(), name: 'JavaScript', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Python', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'React', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Node.js', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'SQL', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Git', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Agile/Scrum', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Problem Solving', level: 'advanced', category: 'soft' },
      { id: generateId(), name: 'Team Collaboration', level: 'advanced', category: 'soft' },
      { id: generateId(), name: 'Technical Communication', level: 'intermediate', category: 'soft' }
    ],
    keywords: ['software', 'development', 'engineering', 'technical', 'digital', 'innovation', 'agile', 'scalable'],
    experience: [
      {
        id: generateId(),
        company: 'Tech Solutions Inc.',
        position: 'Software Developer',
        location: 'San Francisco, CA',
        startDate: '2023-06',
        endDate: '2024-01',
        current: false,
        description: 'Developed and maintained web applications using modern JavaScript frameworks and cloud technologies.',
        highlights: [
          'Built responsive web applications serving 10,000+ users',
          'Collaborated with cross-functional teams in Agile environment',
          'Reduced page load times by 40% through optimization'
        ]
      }
    ],
    education: [
      {
        id: generateId(),
        institution: 'State University',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        location: 'San Francisco, CA',
        startDate: '2019-09',
        endDate: '2023-05',
        current: false,
        gpa: '3.7/4.0',
        honors: ['Dean\'s List'],
        description: 'Focused on software engineering, algorithms, and web development'
      }
    ]
  },
  'Healthcare': {
    summary: 'Dedicated healthcare professional committed to delivering exceptional patient care and improving health outcomes. Strong clinical knowledge combined with compassionate patient interaction and adherence to healthcare regulations. Experienced in collaborative care environments.',
    skills: [
      { id: generateId(), name: 'Patient Care', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Medical Terminology', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'HIPAA Compliance', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Electronic Health Records (EHR)', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Clinical Documentation', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Patient Assessment', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Empathy & Compassion', level: 'expert', category: 'soft' },
      { id: generateId(), name: 'Communication', level: 'advanced', category: 'soft' },
      { id: generateId(), name: 'Attention to Detail', level: 'expert', category: 'soft' },
      { id: generateId(), name: 'Teamwork', level: 'advanced', category: 'soft' }
    ],
    keywords: ['patient', 'clinical', 'medical', 'healthcare', 'treatment', 'care', 'HIPAA', 'compliance'],
    experience: [
      {
        id: generateId(),
        company: 'City Medical Center',
        position: 'Medical Assistant',
        location: 'Boston, MA',
        startDate: '2023-03',
        endDate: '2024-01',
        current: false,
        description: 'Provided patient care support and administrative assistance in busy medical practice.',
        highlights: [
          'Assisted with 30+ patient appointments daily',
          'Maintained accurate EHR documentation in compliance with HIPAA',
          'Coordinated patient care with healthcare team members'
        ]
      }
    ],
    education: [
      {
        id: generateId(),
        institution: 'Healthcare Training Academy',
        degree: 'Certificate',
        field: 'Medical Assisting',
        location: 'Boston, MA',
        startDate: '2022-01',
        endDate: '2022-12',
        current: false,
        gpa: '3.8/4.0',
        honors: ['Clinical Excellence Award'],
        description: 'Comprehensive training in patient care, medical procedures, and healthcare administration'
      }
    ]
  },
  'Finance': {
    summary: 'Detail-oriented finance professional with strong analytical skills and expertise in financial analysis, risk management, and regulatory compliance. Proven track record of optimizing financial performance and delivering data-driven insights to support strategic decision-making.',
    skills: [
      { id: generateId(), name: 'Financial Analysis', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Excel & Financial Modeling', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Risk Management', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Regulatory Compliance', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Portfolio Management', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Financial Reporting', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'QuickBooks/SAP', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Analytical Thinking', level: 'expert', category: 'soft' },
      { id: generateId(), name: 'Attention to Detail', level: 'expert', category: 'soft' },
      { id: generateId(), name: 'Communication', level: 'advanced', category: 'soft' }
    ],
    keywords: ['financial', 'investment', 'portfolio', 'risk', 'compliance', 'regulatory', 'ROI', 'analysis'],
    experience: [
      {
        id: generateId(),
        company: 'Premier Financial Group',
        position: 'Financial Analyst',
        location: 'New York, NY',
        startDate: '2023-06',
        endDate: '2024-01',
        current: false,
        description: 'Conducted financial analysis and reporting to support investment decisions and portfolio management.',
        highlights: [
          'Analyzed financial data for 20+ client portfolios',
          'Created detailed financial models and forecasts',
          'Ensured compliance with regulatory requirements'
        ]
      }
    ],
    education: [
      {
        id: generateId(),
        institution: 'Business University',
        degree: 'Bachelor of Science',
        field: 'Finance',
        location: 'New York, NY',
        startDate: '2019-09',
        endDate: '2023-05',
        current: false,
        gpa: '3.6/4.0',
        honors: ['Finance Honor Society'],
        description: 'Specialized in financial analysis, investment management, and corporate finance'
      }
    ]
  },
  'Education': {
    summary: 'Passionate educator dedicated to fostering student growth and creating engaging learning environments. Skilled in curriculum development, differentiated instruction, and leveraging technology to enhance educational outcomes. Committed to student success and continuous professional development.',
    skills: [
      { id: generateId(), name: 'Curriculum Development', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Lesson Planning', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Classroom Management', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Student Assessment', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Differentiated Instruction', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Educational Technology', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Google Classroom/Canvas', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Communication', level: 'expert', category: 'soft' },
      { id: generateId(), name: 'Patience', level: 'expert', category: 'soft' },
      { id: generateId(), name: 'Adaptability', level: 'advanced', category: 'soft' }
    ],
    keywords: ['student', 'learning', 'curriculum', 'teaching', 'academic', 'educational', 'pedagogy', 'assessment'],
    experience: [
      {
        id: generateId(),
        company: 'Lincoln Elementary School',
        position: 'Teaching Assistant',
        location: 'Chicago, IL',
        startDate: '2023-08',
        endDate: '2024-01',
        current: false,
        description: 'Supported classroom instruction and student learning in elementary education setting.',
        highlights: [
          'Assisted lead teacher with classroom of 25 students',
          'Developed engaging learning activities and materials',
          'Provided one-on-one support to students with diverse needs'
        ]
      }
    ],
    education: [
      {
        id: generateId(),
        institution: 'Teachers College',
        degree: 'Bachelor of Arts',
        field: 'Elementary Education',
        location: 'Chicago, IL',
        startDate: '2020-09',
        endDate: '2024-05',
        current: false,
        gpa: '3.7/4.0',
        honors: ['Education Honor Society'],
        description: 'Completed student teaching practicum and coursework in curriculum development'
      }
    ]
  },
  'Retail': {
    summary: 'Customer-focused retail professional with proven success in driving sales, enhancing customer experiences, and managing inventory. Strong interpersonal skills combined with product knowledge and a results-oriented approach to achieving business objectives.',
    skills: [
      { id: generateId(), name: 'Customer Service', level: 'expert', category: 'technical' },
      { id: generateId(), name: 'Sales Techniques', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Point of Sale (POS) Systems', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Inventory Management', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Merchandising', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Cash Handling', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Product Knowledge', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Communication', level: 'expert', category: 'soft' },
      { id: generateId(), name: 'Problem Solving', level: 'advanced', category: 'soft' },
      { id: generateId(), name: 'Teamwork', level: 'advanced', category: 'soft' }
    ],
    keywords: ['customer', 'sales', 'merchandise', 'retail', 'commerce', 'consumer', 'inventory', 'POS'],
    experience: [
      {
        id: generateId(),
        company: 'Fashion Retail Store',
        position: 'Sales Associate',
        location: 'Los Angeles, CA',
        startDate: '2023-01',
        endDate: '2024-01',
        current: false,
        description: 'Provided exceptional customer service and drove sales in fast-paced retail environment.',
        highlights: [
          'Consistently exceeded monthly sales targets by 15%',
          'Maintained visual merchandising standards',
          'Processed transactions and managed cash handling accurately'
        ]
      }
    ],
    education: [
      {
        id: generateId(),
        institution: 'Community College',
        degree: 'Associate Degree',
        field: 'Business Administration',
        location: 'Los Angeles, CA',
        startDate: '2021-09',
        endDate: '2023-05',
        current: false,
        gpa: '3.4/4.0',
        honors: [],
        description: 'Focused on retail management, customer service, and business operations'
      }
    ]
  },
  'Manufacturing': {
    summary: 'Experienced manufacturing professional with expertise in production operations, quality control, and process optimization. Strong understanding of lean manufacturing principles and commitment to safety, efficiency, and continuous improvement.',
    skills: [
      { id: generateId(), name: 'Production Operations', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Quality Control', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Lean Manufacturing', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Six Sigma', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Safety Compliance', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Equipment Operation', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Supply Chain Management', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Problem Solving', level: 'advanced', category: 'soft' },
      { id: generateId(), name: 'Attention to Detail', level: 'expert', category: 'soft' },
      { id: generateId(), name: 'Teamwork', level: 'advanced', category: 'soft' }
    ],
    keywords: ['production', 'manufacturing', 'operations', 'quality', 'process', 'efficiency', 'lean', 'Six Sigma'],
    experience: [
      {
        id: generateId(),
        company: 'Advanced Manufacturing Co.',
        position: 'Production Technician',
        location: 'Detroit, MI',
        startDate: '2023-02',
        endDate: '2024-01',
        current: false,
        description: 'Operated production equipment and maintained quality standards in manufacturing facility.',
        highlights: [
          'Maintained 99% quality compliance rate',
          'Operated CNC machinery and production equipment safely',
          'Participated in continuous improvement initiatives'
        ]
      }
    ],
    education: [
      {
        id: generateId(),
        institution: 'Technical Institute',
        degree: 'Certificate',
        field: 'Manufacturing Technology',
        location: 'Detroit, MI',
        startDate: '2022-01',
        endDate: '2022-12',
        current: false,
        gpa: '3.5/4.0',
        honors: ['Technical Excellence Award'],
        description: 'Training in manufacturing processes, quality control, and safety procedures'
      }
    ]
  },
  'Marketing': {
    summary: 'Creative marketing professional with expertise in digital marketing, content creation, and campaign management. Data-driven approach to developing strategies that increase brand awareness, engagement, and conversion rates. Strong analytical and creative skills.',
    skills: [
      { id: generateId(), name: 'Digital Marketing', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Content Creation', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Social Media Marketing', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'SEO/SEM', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Google Analytics', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Email Marketing', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Adobe Creative Suite', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Creativity', level: 'expert', category: 'soft' },
      { id: generateId(), name: 'Communication', level: 'advanced', category: 'soft' },
      { id: generateId(), name: 'Analytical Thinking', level: 'advanced', category: 'soft' }
    ],
    keywords: ['marketing', 'brand', 'campaign', 'content', 'digital', 'engagement', 'SEO', 'analytics'],
    experience: [
      {
        id: generateId(),
        company: 'Digital Marketing Agency',
        position: 'Marketing Coordinator',
        location: 'Austin, TX',
        startDate: '2023-04',
        endDate: '2024-01',
        current: false,
        description: 'Coordinated digital marketing campaigns and content creation for diverse client portfolio.',
        highlights: [
          'Managed social media accounts with 50K+ combined followers',
          'Created engaging content that increased engagement by 30%',
          'Analyzed campaign performance using Google Analytics'
        ]
      }
    ],
    education: [
      {
        id: generateId(),
        institution: 'Marketing University',
        degree: 'Bachelor of Science',
        field: 'Marketing',
        location: 'Austin, TX',
        startDate: '2019-09',
        endDate: '2023-05',
        current: false,
        gpa: '3.6/4.0',
        honors: ['Marketing Excellence Award'],
        description: 'Specialized in digital marketing, brand management, and consumer behavior'
      }
    ]
  },
  'Consulting': {
    summary: 'Strategic consultant with proven ability to analyze complex business challenges and deliver actionable recommendations. Strong analytical and communication skills combined with industry expertise. Track record of driving organizational transformation and delivering measurable results.',
    skills: [
      { id: generateId(), name: 'Business Analysis', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Strategic Planning', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Stakeholder Management', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Data Analysis', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'PowerPoint/Presentations', level: 'expert', category: 'technical' },
      { id: generateId(), name: 'Excel & Financial Modeling', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Project Management', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Communication', level: 'expert', category: 'soft' },
      { id: generateId(), name: 'Problem Solving', level: 'expert', category: 'soft' },
      { id: generateId(), name: 'Leadership', level: 'advanced', category: 'soft' }
    ],
    keywords: ['consulting', 'strategy', 'advisory', 'business', 'transformation', 'solutions', 'stakeholder', 'analysis'],
    experience: [
      {
        id: generateId(),
        company: 'Strategic Consulting Group',
        position: 'Business Analyst',
        location: 'Washington, DC',
        startDate: '2023-06',
        endDate: '2024-01',
        current: false,
        description: 'Conducted business analysis and provided strategic recommendations to client organizations.',
        highlights: [
          'Analyzed business processes for 5+ client engagements',
          'Developed strategic recommendations that improved efficiency by 25%',
          'Created executive presentations and reports'
        ]
      }
    ],
    education: [
      {
        id: generateId(),
        institution: 'Business School',
        degree: 'Master of Business Administration',
        field: 'Strategy & Consulting',
        location: 'Washington, DC',
        startDate: '2021-09',
        endDate: '2023-05',
        current: false,
        gpa: '3.8/4.0',
        honors: ['MBA Honor Society'],
        description: 'Focused on strategic management, organizational consulting, and business analytics'
      }
    ]
  },
  'Real Estate': {
    summary: 'Results-driven real estate professional with expertise in property management, sales, and client relations. Strong negotiation skills combined with market knowledge and commitment to client satisfaction. Proven track record of closing deals and building lasting relationships.',
    skills: [
      { id: generateId(), name: 'Property Management', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Sales & Negotiation', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Market Analysis', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Contract Management', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Client Relations', level: 'expert', category: 'technical' },
      { id: generateId(), name: 'Property Valuation', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'MLS Systems', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Communication', level: 'expert', category: 'soft' },
      { id: generateId(), name: 'Networking', level: 'advanced', category: 'soft' },
      { id: generateId(), name: 'Time Management', level: 'advanced', category: 'soft' }
    ],
    keywords: ['property', 'real estate', 'construction', 'development', 'sales', 'leasing', 'market', 'valuation'],
    experience: [
      {
        id: generateId(),
        company: 'Premier Realty Group',
        position: 'Real Estate Agent',
        location: 'Phoenix, AZ',
        startDate: '2023-03',
        endDate: '2024-01',
        current: false,
        description: 'Assisted clients with property sales, purchases, and leasing transactions.',
        highlights: [
          'Closed 15+ property transactions totaling $3M in sales',
          'Built strong client relationships through excellent service',
          'Conducted property showings and market analysis'
        ]
      }
    ],
    education: [
      {
        id: generateId(),
        institution: 'Real Estate Institute',
        degree: 'Certificate',
        field: 'Real Estate',
        location: 'Phoenix, AZ',
        startDate: '2022-06',
        endDate: '2022-12',
        current: false,
        gpa: '',
        honors: [],
        description: 'Completed real estate licensing coursework and state certification'
      }
    ]
  },
  'Hospitality': {
    summary: 'Dedicated hospitality professional with passion for delivering exceptional guest experiences. Strong service orientation combined with operational knowledge and team leadership abilities. Committed to maintaining high standards and creating memorable experiences for guests.',
    skills: [
      { id: generateId(), name: 'Guest Services', level: 'expert', category: 'technical' },
      { id: generateId(), name: 'Front Desk Operations', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Reservation Systems', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Event Coordination', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Food & Beverage Service', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Conflict Resolution', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'POS Systems', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Customer Service', level: 'expert', category: 'soft' },
      { id: generateId(), name: 'Multitasking', level: 'advanced', category: 'soft' },
      { id: generateId(), name: 'Teamwork', level: 'advanced', category: 'soft' }
    ],
    keywords: ['hospitality', 'service', 'guest', 'customer', 'hotel', 'restaurant', 'tourism', 'events'],
    experience: [
      {
        id: generateId(),
        company: 'Seaside Resort & Spa',
        position: 'Guest Services Associate',
        location: 'Miami Beach, FL',
        startDate: '2023-01',
        endDate: '2024-01',
        current: false,
        description: 'Provided exceptional guest services at upscale resort property, managing check-ins, reservations, and guest inquiries.',
        highlights: [
          'Maintained 95% guest satisfaction rating through attentive service',
          'Processed 50+ daily check-ins/check-outs efficiently',
          'Resolved guest concerns promptly, ensuring positive experiences'
        ]
      }
    ],
    education: [
      {
        id: generateId(),
        institution: 'Hospitality Management Institute',
        degree: 'Associate Degree',
        field: 'Hospitality Management',
        location: 'Miami, FL',
        startDate: '2021-09',
        endDate: '2023-05',
        current: false,
        gpa: '3.6/4.0',
        honors: ['Dean\'s List'],
        description: 'Focused on hotel operations, guest services, and hospitality industry best practices'
      }
    ]
  },
  'Legal': {
    summary: 'Detail-oriented legal professional with strong research, analytical, and writing skills. Expertise in legal procedures, compliance, and case management. Committed to upholding ethical standards and delivering thorough, accurate legal support.',
    skills: [
      { id: generateId(), name: 'Legal Research', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Legal Writing', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Case Management', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Contract Review', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Compliance', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Document Preparation', level: 'expert', category: 'technical' },
      { id: generateId(), name: 'Westlaw/LexisNexis', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Attention to Detail', level: 'expert', category: 'soft' },
      { id: generateId(), name: 'Critical Thinking', level: 'advanced', category: 'soft' },
      { id: generateId(), name: 'Confidentiality', level: 'expert', category: 'soft' }
    ],
    keywords: ['legal', 'law', 'compliance', 'regulatory', 'litigation', 'contracts', 'research', 'attorney'],
    experience: [
      {
        id: generateId(),
        company: 'Law Firm Associates',
        position: 'Legal Assistant',
        location: 'Philadelphia, PA',
        startDate: '2023-05',
        endDate: '2024-01',
        current: false,
        description: 'Provided legal support including research, document preparation, and case management.',
        highlights: [
          'Conducted legal research for 20+ cases',
          'Prepared legal documents and correspondence',
          'Maintained confidential client files and case records'
        ]
      }
    ],
    education: [
      {
        id: generateId(),
        institution: 'Legal Studies College',
        degree: 'Bachelor of Arts',
        field: 'Legal Studies',
        location: 'Philadelphia, PA',
        startDate: '2019-09',
        endDate: '2023-05',
        current: false,
        gpa: '3.7/4.0',
        honors: ['Pre-Law Honor Society'],
        description: 'Focused on legal research, writing, and paralegal studies'
      }
    ]
  },
  'Media & Entertainment': {
    summary: 'Creative media professional with expertise in content creation, production, and digital media. Strong storytelling abilities combined with technical skills and industry knowledge. Passionate about creating engaging content that resonates with audiences.',
    skills: [
      { id: generateId(), name: 'Content Creation', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Video Production', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Audio Editing', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Adobe Creative Suite', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Social Media Management', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Storytelling', level: 'expert', category: 'technical' },
      { id: generateId(), name: 'Project Management', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Creativity', level: 'expert', category: 'soft' },
      { id: generateId(), name: 'Collaboration', level: 'advanced', category: 'soft' },
      { id: generateId(), name: 'Adaptability', level: 'advanced', category: 'soft' }
    ],
    keywords: ['media', 'content', 'entertainment', 'creative', 'production', 'digital', 'broadcasting', 'storytelling'],
    experience: [
      {
        id: generateId(),
        company: 'Creative Media Studio',
        position: 'Content Creator',
        location: 'Los Angeles, CA',
        startDate: '2023-04',
        endDate: '2024-01',
        current: false,
        description: 'Created engaging multimedia content for digital platforms and social media channels.',
        highlights: [
          'Produced 50+ video content pieces with 500K+ total views',
          'Managed content calendar and social media strategy',
          'Collaborated with creative team on multimedia projects'
        ]
      }
    ],
    education: [
      {
        id: generateId(),
        institution: 'Film & Media Arts College',
        degree: 'Bachelor of Arts',
        field: 'Media Production',
        location: 'Los Angeles, CA',
        startDate: '2019-09',
        endDate: '2023-05',
        current: false,
        gpa: '3.5/4.0',
        honors: ['Creative Excellence Award'],
        description: 'Specialized in video production, digital media, and content creation'
      }
    ]
  }
};

/**
 * Get boilerplate content for an industry
 */
export function getIndustryBoilerplate(industry: string): IndustryBoilerplate | null {
  return INDUSTRY_BOILERPLATES[industry] || null;
}

/**
 * Get all available industries
 */
export function getAvailableIndustries(): string[] {
  return Object.keys(INDUSTRY_BOILERPLATES);
}

/**
 * Get default boilerplate (Technology as fallback)
 */
export function getDefaultBoilerplate(): IndustryBoilerplate {
  return INDUSTRY_BOILERPLATES['Technology'];
}

/**
 * Merge user profile skills with industry boilerplate
 * Prioritizes user's existing skills but adds industry-specific ones
 */
export function mergeSkillsWithBoilerplate(
  userSkills: Skill[],
  industrySkills: Skill[]
): Skill[] {
  const merged = [...userSkills];
  const userSkillNames = new Set(userSkills.map(s => s.name.toLowerCase()));

  // Add industry skills that user doesn't already have
  industrySkills.forEach(industrySkill => {
    if (!userSkillNames.has(industrySkill.name.toLowerCase())) {
      merged.push(industrySkill);
    }
  });

  return merged;
}
