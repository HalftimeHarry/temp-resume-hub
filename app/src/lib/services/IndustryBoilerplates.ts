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
    summary: 'Software developer with hands-on experience building web applications using modern JavaScript frameworks and cloud technologies. Proficient in full-stack development with focus on creating responsive, user-friendly interfaces. Strong problem-solving skills and collaborative team player in Agile environments.',
    skills: [
      { id: generateId(), name: 'JavaScript (ES6+)', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'React & Redux', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Node.js & Express', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'HTML5 & CSS3', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'SQL & MongoDB', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Git & GitHub', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'RESTful APIs', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Agile/Scrum Methodology', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Problem Solving & Debugging', level: 'advanced', category: 'soft' },
      { id: generateId(), name: 'Team Collaboration', level: 'advanced', category: 'soft' }
    ],
    keywords: ['software', 'development', 'engineering', 'JavaScript', 'React', 'full-stack', 'agile', 'web applications'],
    experience: [
      {
        id: generateId(),
        company: 'TechVenture Solutions',
        position: 'Junior Software Developer',
        location: 'San Francisco, CA',
        startDate: '2023-06',
        endDate: '2024-01',
        current: false,
        description: 'Developed and maintained responsive web applications using React, Node.js, and MongoDB in collaborative Agile team environment.',
        highlights: [
          'Built 5 full-stack features serving 15,000+ active users',
          'Improved application performance by 35% through code optimization',
          'Participated in daily standups and bi-weekly sprint planning',
          'Wrote unit tests achieving 85% code coverage'
        ]
      }
    ],
    education: [
      {
        id: generateId(),
        institution: 'San Francisco State University',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        location: 'San Francisco, CA',
        startDate: '2019-09',
        endDate: '2023-05',
        current: false,
        gpa: '3.7/4.0',
        honors: ['Dean\'s List (4 semesters)', 'CS Department Scholarship'],
        description: 'Coursework in data structures, algorithms, web development, and software engineering'
      }
    ]
  },
  'Healthcare': {
    summary: 'Compassionate healthcare professional dedicated to delivering high-quality patient care in fast-paced clinical settings. Certified Medical Assistant with expertise in patient intake, vital signs, EHR documentation, and HIPAA compliance. Strong clinical and interpersonal skills with commitment to patient safety and satisfaction.',
    skills: [
      { id: generateId(), name: 'Patient Care & Assessment', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Vital Signs & Measurements', level: 'expert', category: 'technical' },
      { id: generateId(), name: 'Medical Terminology', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'EHR Systems (Epic/Cerner)', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'HIPAA Compliance', level: 'expert', category: 'technical' },
      { id: generateId(), name: 'Phlebotomy & Injections', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Clinical Documentation', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Patient Communication', level: 'expert', category: 'soft' },
      { id: generateId(), name: 'Empathy & Compassion', level: 'expert', category: 'soft' },
      { id: generateId(), name: 'Multitasking & Organization', level: 'advanced', category: 'soft' }
    ],
    keywords: ['patient care', 'clinical', 'medical assistant', 'healthcare', 'EHR', 'HIPAA', 'vital signs', 'medical'],
    experience: [
      {
        id: generateId(),
        company: 'Boston Family Medical Center',
        position: 'Certified Medical Assistant',
        location: 'Boston, MA',
        startDate: '2023-03',
        endDate: '2024-01',
        current: false,
        description: 'Provided direct patient care and clinical support in primary care practice serving 40+ patients daily, including intake, vital signs, EHR documentation, and care coordination.',
        highlights: [
          'Performed patient intake and recorded vital signs for 35-40 patients daily',
          'Maintained 100% HIPAA compliance in all patient interactions and documentation',
          'Assisted physicians with examinations, procedures, and patient education',
          'Achieved 98% patient satisfaction rating through compassionate care'
        ]
      }
    ],
    education: [
      {
        id: generateId(),
        institution: 'Boston Medical Training Institute',
        degree: 'Certificate',
        field: 'Medical Assisting',
        location: 'Boston, MA',
        startDate: '2022-01',
        endDate: '2022-12',
        current: false,
        gpa: '3.9/4.0',
        honors: ['Certified Medical Assistant (CMA)', 'Clinical Excellence Award'],
        description: 'Completed 720-hour program including 160 hours of clinical externship'
      }
    ]
  },
  'Finance': {
    summary: 'Analytical finance professional with expertise in financial modeling, data analysis, and investment research. Proficient in Excel, Bloomberg Terminal, and financial reporting. Strong quantitative skills with ability to translate complex financial data into actionable insights. Detail-oriented with commitment to accuracy and regulatory compliance.',
    skills: [
      { id: generateId(), name: 'Financial Analysis & Modeling', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Excel (Advanced Functions, VBA)', level: 'expert', category: 'technical' },
      { id: generateId(), name: 'Bloomberg Terminal', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Financial Reporting & GAAP', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Valuation & DCF Analysis', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Risk Assessment', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'QuickBooks & SAP', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Analytical & Quantitative Skills', level: 'expert', category: 'soft' },
      { id: generateId(), name: 'Attention to Detail', level: 'expert', category: 'soft' },
      { id: generateId(), name: 'Communication & Presentation', level: 'advanced', category: 'soft' }
    ],
    keywords: ['financial analysis', 'investment', 'portfolio', 'modeling', 'Excel', 'Bloomberg', 'valuation', 'reporting'],
    experience: [
      {
        id: generateId(),
        company: 'Sterling Investment Partners',
        position: 'Junior Financial Analyst',
        location: 'New York, NY',
        startDate: '2023-06',
        endDate: '2024-01',
        current: false,
        description: 'Performed financial analysis, built valuation models, and prepared investment reports for equity research team covering technology and healthcare sectors.',
        highlights: [
          'Built financial models for 25+ companies with 95% forecast accuracy',
          'Analyzed quarterly earnings reports and prepared investment summaries',
          'Created Excel dashboards tracking $150M portfolio performance',
          'Presented findings to senior analysts in weekly investment committee meetings'
        ]
      }
    ],
    education: [
      {
        id: generateId(),
        institution: 'New York University - Stern School of Business',
        degree: 'Bachelor of Science',
        field: 'Finance',
        location: 'New York, NY',
        startDate: '2019-09',
        endDate: '2023-05',
        current: false,
        gpa: '3.7/4.0',
        honors: ['Dean\'s List', 'Finance Society Member', 'CFA Level I Candidate'],
        description: 'Concentrated in corporate finance, investment analysis, and financial markets'
      }
    ]
  },
  'Education': {
    summary: 'Dedicated educator passionate about creating inclusive, engaging learning environments that foster student growth and academic achievement. Experienced in lesson planning, classroom management, and differentiated instruction. Skilled in educational technology and data-driven assessment. Committed to supporting diverse learners and collaborating with families and colleagues.',
    skills: [
      { id: generateId(), name: 'Lesson Planning & Curriculum Design', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Classroom Management', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Differentiated Instruction', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Student Assessment & Data Analysis', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Google Classroom & Canvas LMS', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Educational Technology Integration', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Special Education Support', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Communication & Collaboration', level: 'expert', category: 'soft' },
      { id: generateId(), name: 'Patience & Empathy', level: 'expert', category: 'soft' },
      { id: generateId(), name: 'Adaptability & Problem-Solving', level: 'advanced', category: 'soft' }
    ],
    keywords: ['teaching', 'education', 'curriculum', 'classroom', 'student', 'learning', 'instruction', 'assessment'],
    experience: [
      {
        id: generateId(),
        company: 'Roosevelt Elementary School',
        position: 'Student Teacher / Teaching Assistant',
        location: 'Chicago, IL',
        startDate: '2023-08',
        endDate: '2024-05',
        current: false,
        description: 'Supported lead teacher in 3rd-grade classroom of 24 students, developing and delivering lessons in all core subjects while managing classroom activities and providing individualized student support.',
        highlights: [
          'Planned and delivered 50+ lessons across math, reading, and science',
          'Implemented differentiated instruction strategies for diverse learners',
          'Improved student reading scores by 15% through targeted interventions',
          'Collaborated with parents through weekly communication and conferences'
        ]
      }
    ],
    education: [
      {
        id: generateId(),
        institution: 'University of Illinois at Chicago',
        degree: 'Bachelor of Arts',
        field: 'Elementary Education',
        location: 'Chicago, IL',
        startDate: '2020-09',
        endDate: '2024-05',
        current: false,
        gpa: '3.8/4.0',
        honors: ['Kappa Delta Pi Education Honor Society', 'Dean\'s List', 'Illinois Teaching License (Pending)'],
        description: 'Completed 16-week student teaching practicum and coursework in literacy, mathematics pedagogy, and child development'
      }
    ]
  },
  'Retail': {
    summary: 'Energetic retail sales professional with proven track record of exceeding sales goals and delivering exceptional customer experiences. Skilled in product knowledge, visual merchandising, and POS systems. Strong ability to build customer relationships, upsell products, and work effectively in fast-paced team environments.',
    skills: [
      { id: generateId(), name: 'Customer Service Excellence', level: 'expert', category: 'technical' },
      { id: generateId(), name: 'Sales & Upselling Techniques', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'POS Systems & Cash Handling', level: 'expert', category: 'technical' },
      { id: generateId(), name: 'Visual Merchandising', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Inventory Management', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Product Knowledge & Recommendations', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Loss Prevention', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Communication & Interpersonal Skills', level: 'expert', category: 'soft' },
      { id: generateId(), name: 'Problem Resolution', level: 'advanced', category: 'soft' },
      { id: generateId(), name: 'Teamwork & Collaboration', level: 'advanced', category: 'soft' }
    ],
    keywords: ['retail', 'sales', 'customer service', 'merchandising', 'POS', 'inventory', 'upselling', 'store operations'],
    experience: [
      {
        id: generateId(),
        company: 'Urban Outfitters',
        position: 'Sales Associate',
        location: 'Los Angeles, CA',
        startDate: '2023-01',
        endDate: '2024-01',
        current: false,
        description: 'Delivered exceptional customer service and drove sales in high-volume retail store, assisting 50+ customers daily with product selection, styling advice, and checkout.',
        highlights: [
          'Exceeded monthly sales targets by average of 18% through effective upselling',
          'Achieved $85K in personal sales over 12-month period',
          'Maintained 4.9/5.0 customer satisfaction rating based on feedback surveys',
          'Trained 3 new team members on POS systems and sales techniques'
        ]
      }
    ],
    education: [
      {
        id: generateId(),
        institution: 'Santa Monica College',
        degree: 'Associate Degree',
        field: 'Business Administration',
        location: 'Santa Monica, CA',
        startDate: '2021-09',
        endDate: '2023-12',
        current: false,
        gpa: '3.4/4.0',
        honors: ['Business Department Award'],
        description: 'Coursework in retail management, marketing, and customer relationship management'
      }
    ]
  },
  'Manufacturing': {
    summary: 'Safety-focused manufacturing technician with hands-on experience in production operations, quality assurance, and equipment maintenance. Trained in Lean Manufacturing and 5S principles. Strong mechanical aptitude with commitment to meeting production targets while maintaining quality standards and workplace safety.',
    skills: [
      { id: generateId(), name: 'Production Operations & Assembly', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Quality Control & Inspection', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'CNC Machine Operation', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Lean Manufacturing & 5S', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'OSHA Safety Standards', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Blueprint Reading & Measurements', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Equipment Maintenance', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Problem Solving & Troubleshooting', level: 'advanced', category: 'soft' },
      { id: generateId(), name: 'Attention to Detail', level: 'expert', category: 'soft' },
      { id: generateId(), name: 'Teamwork & Communication', level: 'advanced', category: 'soft' }
    ],
    keywords: ['manufacturing', 'production', 'quality control', 'CNC', 'lean', 'assembly', 'safety', 'operations'],
    experience: [
      {
        id: generateId(),
        company: 'Precision Manufacturing Inc.',
        position: 'Production Technician',
        location: 'Detroit, MI',
        startDate: '2023-02',
        endDate: '2024-01',
        current: false,
        description: 'Operated CNC machines and assembly equipment in automotive parts manufacturing facility, performing quality inspections and maintaining production schedules.',
        highlights: [
          'Achieved 99.2% quality compliance rate across 5,000+ parts produced',
          'Operated 3 different CNC machines with zero safety incidents',
          'Reduced machine downtime by 12% through preventive maintenance',
          'Participated in Kaizen event that improved line efficiency by 8%'
        ]
      }
    ],
    education: [
      {
        id: generateId(),
        institution: 'Wayne County Community College',
        degree: 'Certificate',
        field: 'Manufacturing Technology',
        location: 'Detroit, MI',
        startDate: '2022-01',
        endDate: '2022-12',
        current: false,
        gpa: '3.6/4.0',
        honors: ['OSHA 10-Hour Certified', 'Technical Excellence Award'],
        description: 'Hands-on training in CNC operation, quality control, blueprint reading, and manufacturing safety'
      }
    ]
  },
  'Marketing': {
    summary: 'Data-driven marketing professional with expertise in digital campaigns, social media management, and content strategy. Proven ability to increase brand engagement and drive conversions through creative campaigns and analytics-based optimization. Skilled in SEO, email marketing, and marketing automation platforms.',
    skills: [
      { id: generateId(), name: 'Digital Marketing Strategy', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Social Media Management', level: 'expert', category: 'technical' },
      { id: generateId(), name: 'Content Creation & Copywriting', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Google Analytics & SEO', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Email Marketing (Mailchimp)', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Facebook Ads & Google Ads', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Canva & Adobe Creative Suite', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Creativity & Innovation', level: 'expert', category: 'soft' },
      { id: generateId(), name: 'Data Analysis', level: 'advanced', category: 'soft' },
      { id: generateId(), name: 'Project Management', level: 'advanced', category: 'soft' }
    ],
    keywords: ['marketing', 'digital', 'social media', 'content', 'SEO', 'campaigns', 'analytics', 'brand'],
    experience: [
      {
        id: generateId(),
        company: 'Bright Digital Marketing',
        position: 'Digital Marketing Coordinator',
        location: 'Austin, TX',
        startDate: '2023-04',
        endDate: '2024-01',
        current: false,
        description: 'Managed social media accounts and digital campaigns for 8 clients across various industries, creating content and analyzing performance metrics to optimize engagement.',
        highlights: [
          'Grew combined social media following from 45K to 78K followers (73% increase)',
          'Created 150+ pieces of engaging content resulting in 42% higher engagement',
          'Managed $15K monthly ad budget across Facebook and Google Ads',
          'Improved email open rates by 28% through A/B testing and segmentation'
        ]
      }
    ],
    education: [
      {
        id: generateId(),
        institution: 'University of Texas at Austin',
        degree: 'Bachelor of Business Administration',
        field: 'Marketing',
        location: 'Austin, TX',
        startDate: '2019-09',
        endDate: '2023-05',
        current: false,
        gpa: '3.6/4.0',
        honors: ['Marketing Honor Society', 'Dean\'s List'],
        description: 'Specialized in digital marketing, consumer behavior, and brand strategy'
      }
    ]
  },
  'Consulting': {
    summary: 'Analytical business consultant with expertise in process improvement, data analysis, and strategic planning. Skilled in stakeholder engagement, project management, and delivering client presentations. Strong problem-solving abilities with focus on driving operational efficiency and business transformation through data-driven insights.',
    skills: [
      { id: generateId(), name: 'Business Process Analysis', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Strategic Planning & Frameworks', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Stakeholder Management', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Data Analysis & Visualization', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'PowerPoint & Executive Presentations', level: 'expert', category: 'technical' },
      { id: generateId(), name: 'Excel & Financial Modeling', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Project Management (Agile)', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Communication & Presentation', level: 'expert', category: 'soft' },
      { id: generateId(), name: 'Critical Thinking & Problem Solving', level: 'expert', category: 'soft' },
      { id: generateId(), name: 'Client Relationship Management', level: 'advanced', category: 'soft' }
    ],
    keywords: ['consulting', 'strategy', 'business analysis', 'process improvement', 'stakeholder', 'advisory', 'transformation'],
    experience: [
      {
        id: generateId(),
        company: 'Deloitte Consulting',
        position: 'Business Analyst',
        location: 'Washington, DC',
        startDate: '2023-06',
        endDate: '2024-01',
        current: false,
        description: 'Supported consulting engagements for Fortune 500 clients, conducting business analysis, developing recommendations, and creating executive presentations for process improvement initiatives.',
        highlights: [
          'Analyzed operations for 4 client engagements totaling $2M in project value',
          'Identified process improvements projected to save clients $500K annually',
          'Created 30+ executive PowerPoint presentations for C-suite stakeholders',
          'Led workshops with 15+ stakeholders to gather requirements and build consensus'
        ]
      }
    ],
    education: [
      {
        id: generateId(),
        institution: 'Georgetown University - McDonough School of Business',
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
    summary: 'Results-driven real estate professional with expertise in property sales, market analysis, and client relationship management. Licensed agent with proven ability to close deals, negotiate favorable terms, and provide exceptional service. Strong knowledge of local market trends, property valuation, and MLS systems.',
    skills: [
      { id: generateId(), name: 'Property Sales & Leasing', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Negotiation & Closing', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Market Analysis & CMA', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'MLS & Real Estate Software', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Contract Management', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Property Valuation', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Open House Coordination', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Client Relationship Management', level: 'expert', category: 'soft' },
      { id: generateId(), name: 'Networking & Prospecting', level: 'advanced', category: 'soft' },
      { id: generateId(), name: 'Communication & Presentation', level: 'expert', category: 'soft' }
    ],
    keywords: ['property', 'real estate', 'sales', 'leasing', 'market', 'valuation', 'MLS', 'negotiation', 'closing'],
    experience: [
      {
        id: generateId(),
        company: 'Premier Realty Group',
        position: 'Real Estate Agent',
        location: 'Phoenix, AZ',
        startDate: '2023-03',
        endDate: '2024-01',
        current: false,
        description: 'Represented buyers and sellers in residential real estate transactions, providing comprehensive market analysis and negotiation services.',
        highlights: [
          'Closed $4.2M in property sales across 18 transactions in first year',
          'Achieved 95% client satisfaction rating through responsive communication',
          'Conducted 40+ property showings and 12 successful open houses',
          'Built referral network generating 30% of new business'
        ]
      }
    ],
    education: [
      {
        id: generateId(),
        institution: 'Real Estate Institute',
        degree: 'Certificate',
        field: 'Real Estate Sales',
        location: 'Phoenix, AZ',
        startDate: '2022-06',
        endDate: '2022-12',
        current: false,
        gpa: '',
        honors: ['Licensed Real Estate Salesperson'],
        description: 'Completed 90-hour pre-licensing course covering property law, contracts, and ethics'
      }
    ]
  },
  'Hospitality': {
    summary: 'Service-oriented hospitality professional dedicated to creating exceptional guest experiences in fast-paced environments. Skilled in front desk operations, reservation management, and guest relations. Strong multitasking abilities with positive attitude and commitment to exceeding guest expectations.',
    skills: [
      { id: generateId(), name: 'Guest Services & Relations', level: 'expert', category: 'technical' },
      { id: generateId(), name: 'Front Desk Operations', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Reservation Systems (Opera, Maestro)', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Check-in/Check-out Procedures', level: 'expert', category: 'technical' },
      { id: generateId(), name: 'Conflict Resolution', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'POS & Payment Processing', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Upselling & Revenue Generation', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Customer Service Excellence', level: 'expert', category: 'soft' },
      { id: generateId(), name: 'Multitasking & Time Management', level: 'advanced', category: 'soft' },
      { id: generateId(), name: 'Communication & Teamwork', level: 'advanced', category: 'soft' }
    ],
    keywords: ['hospitality', 'hotel', 'guest services', 'front desk', 'customer service', 'reservations', 'tourism'],
    experience: [
      {
        id: generateId(),
        company: 'Oceanview Resort & Spa',
        position: 'Front Desk Associate',
        location: 'Miami Beach, FL',
        startDate: '2023-01',
        endDate: '2024-01',
        current: false,
        description: 'Managed front desk operations at 200-room beachfront resort, handling guest check-ins/check-outs, reservations, and concierge services while maintaining high satisfaction standards.',
        highlights: [
          'Processed 60+ daily check-ins/check-outs with 97% guest satisfaction rating',
          'Upsold room upgrades and amenities generating $12K additional revenue',
          'Resolved 95% of guest concerns on first contact without escalation',
          'Recognized as "Employee of the Month" twice for exceptional service'
        ]
      }
    ],
    education: [
      {
        id: generateId(),
        institution: 'Florida International University',
        degree: 'Associate of Science',
        field: 'Hospitality Management',
        location: 'Miami, FL',
        startDate: '2021-09',
        endDate: '2023-05',
        current: false,
        gpa: '3.7/4.0',
        honors: ['Dean\'s List', 'Hospitality Excellence Scholarship'],
        description: 'Coursework in hotel operations, guest services, revenue management, and hospitality technology'
      }
    ]
  },
  'Legal': {
    summary: 'Detail-oriented legal professional with expertise in legal research, document preparation, and case management. Proficient in Westlaw/LexisNexis research platforms and legal writing. Strong analytical skills with commitment to accuracy, confidentiality, and ethical standards. Experience supporting attorneys in litigation, contracts, and compliance matters.',
    skills: [
      { id: generateId(), name: 'Legal Research & Analysis', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Legal Writing & Drafting', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Case Management & E-Filing', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Contract Review & Analysis', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Westlaw & LexisNexis', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Document Preparation & Proofreading', level: 'expert', category: 'technical' },
      { id: generateId(), name: 'Litigation Support', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Attention to Detail', level: 'expert', category: 'soft' },
      { id: generateId(), name: 'Critical Thinking & Analysis', level: 'advanced', category: 'soft' },
      { id: generateId(), name: 'Confidentiality & Ethics', level: 'expert', category: 'soft' }
    ],
    keywords: ['legal', 'law', 'paralegal', 'litigation', 'contracts', 'research', 'compliance', 'attorney support'],
    experience: [
      {
        id: generateId(),
        company: 'Morrison & Associates Law Firm',
        position: 'Legal Assistant / Paralegal',
        location: 'Philadelphia, PA',
        startDate: '2023-05',
        endDate: '2024-01',
        current: false,
        description: 'Provided comprehensive legal support to attorneys in civil litigation and corporate law matters, including research, document preparation, and case management.',
        highlights: [
          'Conducted legal research using Westlaw for 25+ active cases',
          'Drafted pleadings, motions, and discovery documents with 99% accuracy',
          'Managed case files and coordinated e-filing in state and federal courts',
          'Prepared trial binders and exhibits for 8 successful court proceedings'
        ]
      }
    ],
    education: [
      {
        id: generateId(),
        institution: 'Temple University',
        degree: 'Bachelor of Arts',
        field: 'Legal Studies',
        location: 'Philadelphia, PA',
        startDate: '2019-09',
        endDate: '2023-05',
        current: false,
        gpa: '3.7/4.0',
        honors: ['Pre-Law Honor Society', 'Dean\'s List (6 semesters)'],
        description: 'Comprehensive coursework in legal research, writing, civil procedure, and paralegal studies'
      }
    ]
  },
  'Media & Entertainment': {
    summary: 'Creative content producer with expertise in video production, editing, and digital storytelling. Proficient in Adobe Creative Suite and social media platforms. Strong visual storytelling skills with ability to create engaging content that drives audience engagement. Experience managing projects from concept to final delivery.',
    skills: [
      { id: generateId(), name: 'Video Production & Editing', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Adobe Premiere Pro & After Effects', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Adobe Photoshop & Illustrator', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Audio Editing (Audition)', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Social Media Content Strategy', level: 'advanced', category: 'technical' },
      { id: generateId(), name: 'Camera Operation & Lighting', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Scriptwriting & Storyboarding', level: 'intermediate', category: 'technical' },
      { id: generateId(), name: 'Creativity & Visual Storytelling', level: 'expert', category: 'soft' },
      { id: generateId(), name: 'Collaboration & Teamwork', level: 'advanced', category: 'soft' },
      { id: generateId(), name: 'Time Management & Deadlines', level: 'advanced', category: 'soft' }
    ],
    keywords: ['media', 'video production', 'content creation', 'editing', 'Adobe', 'creative', 'digital media', 'storytelling'],
    experience: [
      {
        id: generateId(),
        company: 'Skyline Media Productions',
        position: 'Video Production Assistant',
        location: 'Los Angeles, CA',
        startDate: '2023-04',
        endDate: '2024-01',
        current: false,
        description: 'Assisted in production and post-production of video content for corporate clients and social media campaigns, including shooting, editing, and motion graphics.',
        highlights: [
          'Edited 60+ videos totaling 800K+ views across YouTube and social platforms',
          'Managed production schedule for 3-5 concurrent video projects',
          'Created motion graphics and lower thirds using After Effects',
          'Reduced average editing time by 20% through efficient workflow optimization'
        ]
      }
    ],
    education: [
      {
        id: generateId(),
        institution: 'University of Southern California',
        degree: 'Bachelor of Arts',
        field: 'Film & Media Production',
        location: 'Los Angeles, CA',
        startDate: '2019-09',
        endDate: '2023-05',
        current: false,
        gpa: '3.6/4.0',
        honors: ['Student Film Festival Winner', 'Dean\'s List'],
        description: 'Specialized in video production, post-production, and digital media with hands-on studio experience'
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
