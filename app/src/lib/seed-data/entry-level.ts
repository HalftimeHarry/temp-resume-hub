import { generateId } from '$lib/utils';
import type { IndustrySeedData } from './types';

/**
 * Entry-level industry seed data
 * Provides bootstrapping content for first-time job seekers
 */

export const ENTRY_LEVEL_SEED_DATA: Record<string, IndustrySeedData> = {
  'retail': {
    id: 'retail',
    name: 'Retail & Sales',
    description: 'Perfect for cashier, sales associate, and customer service roles in retail environments.',
    category: 'entry-level',
    targetRoles: ['Cashier', 'Sales Associate', 'Customer Service Representative', 'Retail Associate', 'Store Associate'],
    targetIndustries: ['retail', 'customer-service'],
    experienceLevel: ['student', 'entry'],
    
    summaryTemplates: [
      'Enthusiastic and reliable team player with strong customer service skills and attention to detail. Eager to contribute to a positive shopping experience while developing retail expertise in a fast-paced environment.',
      'Friendly and organized individual seeking to apply excellent communication skills and work ethic in a retail environment. Quick learner with a passion for helping customers and contributing to team success.',
      'Dedicated and punctual worker with natural people skills and ability to thrive in fast-paced environments. Committed to providing exceptional customer service and maintaining high standards of store presentation.',
      'Motivated team member with strong interpersonal skills and genuine enthusiasm for helping others. Ready to bring positive energy and reliability to a retail team while learning and growing in the industry.'
    ],
    
    skillSuggestions: [
      { name: 'Customer Service', category: 'soft', level: 'intermediate', priority: 'high', description: 'Helping customers, answering questions, and resolving issues with a positive attitude' },
      { name: 'Cash Handling', category: 'technical', level: 'beginner', priority: 'high', description: 'Processing payments, making change, and handling money accurately' },
      { name: 'POS Systems', category: 'technical', level: 'beginner', priority: 'medium', description: 'Point-of-sale systems and electronic payment processing' },
      { name: 'Team Collaboration', category: 'soft', level: 'intermediate', priority: 'high', description: 'Working effectively with colleagues to achieve common goals' },
      { name: 'Communication', category: 'soft', level: 'intermediate', priority: 'high', description: 'Clear verbal and written communication with customers and team members' },
      { name: 'Problem Solving', category: 'soft', level: 'intermediate', priority: 'medium', description: 'Thinking quickly and finding solutions to customer concerns' },
      { name: 'Time Management', category: 'soft', level: 'intermediate', priority: 'medium', description: 'Managing multiple tasks efficiently while maintaining quality' },
      { name: 'Inventory Management', category: 'technical', level: 'beginner', priority: 'medium', description: 'Stock organization, product placement, and basic inventory tracking' },
      { name: 'Sales Techniques', category: 'technical', level: 'beginner', priority: 'medium', description: 'Upselling, cross-selling, and product recommendations' },
      { name: 'Attention to Detail', category: 'soft', level: 'intermediate', priority: 'medium', description: 'Accuracy in transactions, product information, and store presentation' }
    ],
    
    experienceExamples: [
      {
        id: generateId(),
        company: '[Previous Job/Volunteer Work]',
        position: '[Your Role - e.g., Volunteer, Babysitter, Team Member]',
        location: '[City, State]',
        startDate: '[Start Date]',
        endDate: '[End Date]',
        current: false,
        description: 'Provided excellent customer service in fast-paced environment. Handled responsibilities with accuracy and maintained positive attitude during busy periods.',
        highlights: [
          'Processed transactions/handled money with 100% accuracy',
          'Maintained positive attitude during busy periods and high-stress situations',
          'Assisted customers with inquiries and provided helpful product recommendations',
          'Collaborated effectively with team members to achieve daily goals',
          'Demonstrated reliability through consistent attendance and punctuality'
        ]
      }
    ],
    
    educationExamples: [
      {
        id: generateId(),
        institution: '[High School Name]',
        degree: 'High School Diploma',
        field: 'General Studies',
        location: '[City, State]',
        startDate: '[Start Year]',
        endDate: '[Graduation Year]',
        current: false,
        gpa: '[GPA if 3.5 or higher]',
        honors: ['Honor Roll', 'Perfect Attendance', 'Student of the Month'],
        description: 'Completed comprehensive high school education with focus on communication, teamwork, and customer service skills.'
      }
    ],
    
    guidance: {
      gettingStarted: [
        'Highlight ANY customer service experience - even helping family friends, volunteering at events, or school projects',
        'Emphasize reliability and punctuality - these are the #1 qualities retail employers look for',
        'Include any experience with money handling, even informal (family business, fundraising, school events)',
        'Mention your availability and flexibility with scheduling - retail often needs weekend and evening coverage',
        'Show enthusiasm for helping people and working in teams',
        'Don\'t forget school projects, sports teams, or clubs where you demonstrated teamwork'
      ],
      commonMistakes: [
        'Don\'t undersell volunteer work, school activities, or informal jobs',
        'Avoid focusing only on what you want to learn instead of what you can contribute',
        'Don\'t forget to mention availability and willingness to work weekends/holidays',
        'Avoid generic statements like "hard worker" - be specific with examples',
        'Don\'t leave out soft skills - they\'re often more important than technical skills',
        'Avoid making resume too long - one page is perfect for entry-level retail'
      ],
      successTips: [
        'Show genuine enthusiasm for helping customers and creating positive experiences',
        'Demonstrate reliability through specific examples (perfect attendance, meeting commitments)',
        'Highlight any leadership roles, even informal ones (team captain, group project leader)',
        'Mention specific examples of going above and beyond for others',
        'Include multilingual abilities - extremely valuable in retail',
        'Show you understand teamwork by giving examples of successful collaboration',
        'Emphasize ability to stay positive during busy or stressful situations'
      ],
      salaryInfo: {
        range: { min: 20000, max: 35000 },
        negotiationTips: [
          'Research typical starting wages for retail in your area ($12-16/hour is common)',
          'Emphasize reliability, availability, and enthusiasm rather than demanding higher pay',
          'Ask about opportunities for raises based on performance',
          'Inquire about employee discounts, flexible scheduling, and other benefits',
          'Show interest in learning and growing within the company',
          'Be willing to start at entry-level pay to gain experience'
        ]
      },
      industryInsights: [
        'Retail values reliability, positive attitude, and customer service skills over previous experience',
        'Customer service skills learned in retail transfer to almost any industry',
        'Many retail managers and executives started in entry-level store positions',
        'Peak hiring seasons (holidays, back-to-school) offer the most opportunities',
        'Retail teaches valuable life skills: multitasking, handling pressure, working with diverse people',
        'Part-time retail work can accommodate school schedules and provide flexible income',
        'Strong performance can lead to quick promotions to shift leader or assistant manager'
      ],
      careerProgression: [
        'Entry-level Associate → Senior Associate → Team Lead → Department Supervisor → Assistant Manager → Store Manager',
        'Many companies offer management training programs for high-performing associates',
        'Retail experience opens doors to corporate roles in buying, merchandising, marketing',
        'Customer service skills are highly valued in sales, hospitality, healthcare, and business',
        'Consider specializing in visual merchandising, inventory management, or customer relations'
      ]
    },
    
    industryKeywords: [
      'customer service', 'cash handling', 'POS systems', 'inventory management',
      'team collaboration', 'sales', 'retail', 'customer satisfaction',
      'problem solving', 'communication', 'reliability', 'punctuality',
      'product knowledge', 'store operations', 'visual merchandising',
      'upselling', 'cross-selling', 'customer relations', 'teamwork',
      'multitasking', 'attention to detail', 'positive attitude'
    ],
    
    actionVerbs: [
      'Assisted', 'Processed', 'Maintained', 'Collaborated', 'Achieved',
      'Provided', 'Handled', 'Organized', 'Supported', 'Delivered',
      'Managed', 'Coordinated', 'Demonstrated', 'Communicated', 'Resolved',
      'Contributed', 'Ensured', 'Exceeded', 'Improved', 'Implemented'
    ]
  },

  'hospitality': {
    id: 'hospitality',
    name: 'Hospitality & Food Service',
    description: 'Great for server, host/hostess, barista, and food service positions.',
    category: 'entry-level',
    targetRoles: ['Server', 'Host/Hostess', 'Barista', 'Food Service Worker', 'Restaurant Team Member'],
    targetIndustries: ['hospitality', 'food-service', 'restaurant'],
    experienceLevel: ['student', 'entry'],
    
    summaryTemplates: [
      'Friendly and energetic hospitality professional with excellent customer service skills and ability to thrive in fast-paced environments. Passionate about creating memorable dining experiences.',
      'Enthusiastic team player with strong communication skills and genuine love for helping people. Quick learner committed to providing exceptional service with a smile.',
      'Dedicated and personable individual seeking to bring positive energy and reliability to a hospitality team. Skilled at multitasking and maintaining composure during busy service periods.',
      'Customer-focused professional with natural people skills and attention to detail. Ready to contribute to a welcoming atmosphere while delivering outstanding service.'
    ],
    
    skillSuggestions: [
      { name: 'Customer Service', category: 'soft', level: 'intermediate', priority: 'high', description: 'Creating positive guest experiences and handling requests professionally' },
      { name: 'Multitasking', category: 'soft', level: 'intermediate', priority: 'high', description: 'Managing multiple tables/orders simultaneously' },
      { name: 'Communication', category: 'soft', level: 'intermediate', priority: 'high', description: 'Clear communication with guests and kitchen staff' },
      { name: 'POS Systems', category: 'technical', level: 'beginner', priority: 'medium', description: 'Restaurant point-of-sale and order management systems' },
      { name: 'Food Safety', category: 'technical', level: 'beginner', priority: 'high', description: 'Basic food handling and safety procedures' },
      { name: 'Team Collaboration', category: 'soft', level: 'intermediate', priority: 'high', description: 'Working with servers, kitchen staff, and management' },
      { name: 'Time Management', category: 'soft', level: 'intermediate', priority: 'high', description: 'Prioritizing tasks during rush periods' },
      { name: 'Problem Solving', category: 'soft', level: 'intermediate', priority: 'medium', description: 'Handling guest concerns and special requests' },
      { name: 'Menu Knowledge', category: 'technical', level: 'beginner', priority: 'medium', description: 'Understanding menu items, ingredients, and preparation' },
      { name: 'Cash Handling', category: 'technical', level: 'beginner', priority: 'medium', description: 'Processing payments and managing cash drawer' }
    ],
    
    experienceExamples: [
      {
        id: generateId(),
        company: '[Previous Experience]',
        position: '[Your Role]',
        location: '[City, State]',
        startDate: '[Start Date]',
        endDate: '[End Date]',
        current: false,
        description: 'Provided friendly and efficient service in high-volume environment. Maintained positive attitude and ensured guest satisfaction.',
        highlights: [
          'Served average of [X] guests per shift with consistently positive feedback',
          'Maintained calm and professional demeanor during peak service hours',
          'Collaborated with kitchen and front-of-house staff to ensure smooth operations',
          'Handled guest concerns promptly and professionally',
          'Demonstrated reliability with excellent attendance record'
        ]
      }
    ],
    
    educationExamples: [
      {
        id: generateId(),
        institution: '[High School Name]',
        degree: 'High School Diploma',
        field: 'General Studies',
        location: '[City, State]',
        startDate: '[Start Year]',
        endDate: '[Graduation Year]',
        current: false,
        honors: ['Honor Roll', 'Perfect Attendance'],
        description: 'Developed strong communication and teamwork skills through various school activities.'
      }
    ],
    
    guidance: {
      gettingStarted: [
        'Emphasize any customer-facing experience, even informal (helping at family events, school functions)',
        'Highlight ability to work evenings, weekends, and holidays',
        'Mention any food handling certifications or willingness to obtain them',
        'Show enthusiasm for creating positive experiences for guests',
        'Include examples of staying calm under pressure',
        'Demonstrate teamwork through school, sports, or volunteer activities'
      ],
      successTips: [
        'Show genuine passion for hospitality and helping people',
        'Emphasize flexibility with scheduling - crucial in food service',
        'Highlight ability to multitask and stay organized during busy periods',
        'Mention any experience with diverse groups of people',
        'Show you understand the importance of teamwork in restaurants',
        'Demonstrate reliability and punctuality with specific examples'
      ],
      salaryInfo: {
        range: { min: 20000, max: 40000 },
        negotiationTips: [
          'Base pay is often minimum wage, but tips can significantly increase earnings',
          'Ask about average tip earnings for the position',
          'Inquire about opportunities for advancement to lead server or supervisor',
          'Consider total compensation including meals, flexible hours, and tips',
          'Show willingness to work high-traffic shifts (weekends, holidays) for better tips'
        ]
      },
      careerProgression: [
        'Server/Host → Lead Server → Shift Supervisor → Assistant Manager → Restaurant Manager',
        'Hospitality skills transfer well to hotel management, event planning, and tourism',
        'Many successful restaurant owners started as servers or hosts',
        'Consider specializing in fine dining, catering, or event services'
      ]
    },
    
    industryKeywords: [
      'customer service', 'food service', 'hospitality', 'multitasking',
      'POS systems', 'food safety', 'guest satisfaction', 'team collaboration',
      'communication', 'time management', 'menu knowledge', 'cash handling',
      'table service', 'order accuracy', 'upselling', 'problem solving'
    ],
    
    actionVerbs: [
      'Served', 'Greeted', 'Managed', 'Coordinated', 'Maintained',
      'Provided', 'Assisted', 'Handled', 'Ensured', 'Delivered',
      'Collaborated', 'Resolved', 'Processed', 'Organized', 'Supported'
    ]
  },

  'lifeguard': {
    id: 'lifeguard',
    name: 'Lifeguard & Aquatics',
    description: 'Designed for lifeguard, swim instructor, and pool attendant positions.',
    category: 'entry-level',
    targetRoles: ['Lifeguard', 'Swim Instructor', 'Pool Attendant', 'Aquatics Staff'],
    targetIndustries: ['recreation', 'hospitality', 'fitness'],
    experienceLevel: ['student', 'entry'],
    
    summaryTemplates: [
      'Certified lifeguard committed to water safety and emergency response. Vigilant and responsible professional with strong swimming skills and CPR/First Aid certification.',
      'Safety-focused aquatics professional with excellent observation skills and ability to remain calm in emergencies. Dedicated to maintaining safe swimming environment for all guests.',
      'Reliable and alert lifeguard with proven ability to enforce pool rules and respond quickly to emergencies. Strong communicator with passion for water safety education.',
      'Certified aquatics professional combining strong swimming ability with excellent customer service skills. Committed to creating safe and enjoyable aquatic experiences.'
    ],
    
    skillSuggestions: [
      { name: 'CPR/First Aid', category: 'technical', level: 'intermediate', priority: 'high', description: 'Current CPR and First Aid certification' },
      { name: 'Water Rescue', category: 'technical', level: 'intermediate', priority: 'high', description: 'Water rescue techniques and emergency response' },
      { name: 'Vigilance', category: 'soft', level: 'advanced', priority: 'high', description: 'Constant attention and scanning for potential hazards' },
      { name: 'Communication', category: 'soft', level: 'intermediate', priority: 'high', description: 'Clear communication with swimmers and staff' },
      { name: 'Rule Enforcement', category: 'soft', level: 'intermediate', priority: 'high', description: 'Enforcing pool rules professionally and consistently' },
      { name: 'Swimming', category: 'technical', level: 'advanced', priority: 'high', description: 'Strong swimming ability in various strokes' },
      { name: 'Customer Service', category: 'soft', level: 'intermediate', priority: 'medium', description: 'Friendly interaction with pool guests' },
      { name: 'Teamwork', category: 'soft', level: 'intermediate', priority: 'medium', description: 'Coordinating with other lifeguards and staff' },
      { name: 'Problem Solving', category: 'soft', level: 'intermediate', priority: 'medium', description: 'Quick decision-making in emergency situations' },
      { name: 'Physical Fitness', category: 'technical', level: 'advanced', priority: 'high', description: 'Maintaining physical readiness for rescues' }
    ],
    
    experienceExamples: [
      {
        id: generateId(),
        company: '[Pool/Recreation Center]',
        position: 'Lifeguard',
        location: '[City, State]',
        startDate: '[Start Date]',
        endDate: '[End Date]',
        current: false,
        description: 'Maintained vigilant watch over swimmers and enforced safety rules. Responded to emergencies and provided first aid when needed.',
        highlights: [
          'Maintained constant surveillance of [X] swimmers during shifts',
          'Enforced pool rules professionally to ensure safe environment',
          'Responded to [X] emergency situations with calm and effective action',
          'Completed regular in-service training to maintain certification',
          'Collaborated with team of lifeguards to ensure comprehensive coverage'
        ]
      }
    ],
    
    educationExamples: [
      {
        id: generateId(),
        institution: '[High School Name]',
        degree: 'High School Diploma',
        field: 'General Studies',
        location: '[City, State]',
        startDate: '[Start Year]',
        endDate: '[Graduation Year]',
        current: false,
        honors: ['Swim Team Member', 'Honor Roll'],
        description: 'Active in swimming and water safety programs.'
      }
    ],
    
    guidance: {
      gettingStarted: [
        'Obtain lifeguard certification from Red Cross or equivalent organization',
        'Highlight any swimming experience (swim team, lessons, competitive swimming)',
        'Emphasize responsibility and maturity - crucial for safety positions',
        'Mention any experience working with children or teaching',
        'Show commitment to ongoing training and certification maintenance',
        'Include any leadership roles or volunteer work'
      ],
      successTips: [
        'Maintain current certifications (CPR, First Aid, Lifeguarding)',
        'Show dedication to water safety and emergency preparedness',
        'Emphasize reliability - lifeguards must show up for every shift',
        'Highlight physical fitness and swimming ability',
        'Demonstrate maturity and ability to handle responsibility',
        'Show enthusiasm for working with diverse age groups'
      ],
      salaryInfo: {
        range: { min: 22000, max: 35000 },
        negotiationTips: [
          'Typical pay: $12-18/hour depending on location and certifications',
          'Additional certifications (WSI, AED) can increase pay',
          'Head lifeguard or supervisor positions offer higher wages',
          'Many positions are seasonal - consider year-round facilities',
          'Indoor facilities may offer more consistent hours than outdoor pools'
        ]
      },
      careerProgression: [
        'Lifeguard → Head Lifeguard → Aquatics Supervisor → Aquatics Director',
        'Can lead to careers in recreation management, fitness, or education',
        'Water Safety Instructor (WSI) certification opens teaching opportunities',
        'Experience valuable for emergency services, coaching, or sports management'
      ]
    },
    
    industryKeywords: [
      'lifeguard', 'CPR', 'first aid', 'water safety', 'emergency response',
      'swimming', 'rescue techniques', 'vigilance', 'rule enforcement',
      'customer service', 'teamwork', 'physical fitness', 'aquatics'
    ],
    
    actionVerbs: [
      'Monitored', 'Enforced', 'Responded', 'Rescued', 'Administered',
      'Maintained', 'Supervised', 'Ensured', 'Coordinated', 'Trained',
      'Communicated', 'Prevented', 'Assisted', 'Managed', 'Demonstrated'
    ]
  },

  'general-entry': {
    id: 'general-entry',
    name: 'First Job / General Entry-Level',
    description: 'Perfect for students and young adults seeking their first job in any industry.',
    category: 'entry-level',
    targetRoles: ['Entry-Level', 'Part-Time', 'Student Worker', 'Intern'],
    targetIndustries: ['any'],
    experienceLevel: ['student', 'entry'],
    
    summaryTemplates: [
      'Motivated student seeking an entry-level opportunity to develop professional skills and contribute to a team. Quick learner with strong work ethic and positive attitude.',
      'Enthusiastic and reliable individual eager to begin professional career. Brings dedication, willingness to learn, and commitment to excellence in all tasks.',
      'Hardworking student with excellent time management and communication skills. Ready to apply academic knowledge and personal strengths in a professional environment.',
      'Dependable and eager learner seeking to gain practical experience while contributing to organizational success. Strong interpersonal skills and adaptability.'
    ],
    
    skillSuggestions: [
      { name: 'Time Management', category: 'soft', level: 'intermediate', priority: 'high', description: 'Balancing school, work, and personal responsibilities' },
      { name: 'Communication', category: 'soft', level: 'intermediate', priority: 'high', description: 'Clear verbal and written communication' },
      { name: 'Teamwork', category: 'soft', level: 'intermediate', priority: 'high', description: 'Collaborating effectively with others' },
      { name: 'Problem Solving', category: 'soft', level: 'intermediate', priority: 'medium', description: 'Finding creative solutions to challenges' },
      { name: 'Microsoft Office', category: 'technical', level: 'intermediate', priority: 'medium', description: 'Word, Excel, PowerPoint proficiency' },
      { name: 'Adaptability', category: 'soft', level: 'intermediate', priority: 'medium', description: 'Adjusting to new situations and learning quickly' },
      { name: 'Attention to Detail', category: 'soft', level: 'intermediate', priority: 'medium', description: 'Careful and accurate work' },
      { name: 'Customer Service', category: 'soft', level: 'beginner', priority: 'medium', description: 'Helping others and maintaining positive attitude' },
      { name: 'Organization', category: 'soft', level: 'intermediate', priority: 'medium', description: 'Keeping tasks and materials organized' },
      { name: 'Reliability', category: 'soft', level: 'intermediate', priority: 'high', description: 'Consistent attendance and meeting commitments' }
    ],
    
    experienceExamples: [
      {
        id: generateId(),
        company: '[School/Organization/Volunteer Work]',
        position: '[Your Role or Activity]',
        location: '[City, State]',
        startDate: '[Start Date]',
        endDate: '[End Date]',
        current: false,
        description: 'Demonstrated responsibility and leadership through active participation in school and community activities.',
        highlights: [
          'Maintained excellent attendance and punctuality',
          'Collaborated with peers on group projects and activities',
          'Demonstrated initiative in taking on additional responsibilities',
          'Developed strong communication and interpersonal skills',
          'Balanced multiple commitments while maintaining academic performance'
        ]
      }
    ],
    
    educationExamples: [
      {
        id: generateId(),
        institution: '[High School Name]',
        degree: 'High School Diploma',
        field: 'General Studies',
        location: '[City, State]',
        startDate: '[Start Year]',
        endDate: '[Expected Graduation Year]',
        current: true,
        gpa: '[GPA if 3.0 or higher]',
        honors: ['Honor Roll', 'Perfect Attendance', 'Academic Achievement'],
        description: 'Currently pursuing high school diploma with focus on developing professional and academic skills.'
      }
    ],
    
    guidance: {
      gettingStarted: [
        'Include ALL experience - volunteer work, school projects, babysitting, yard work',
        'Emphasize soft skills like reliability, communication, and teamwork',
        'Highlight academic achievements and extracurricular activities',
        'Show willingness to learn and take on new challenges',
        'Mention any leadership roles, even informal ones',
        'Include availability and flexibility with scheduling'
      ],
      successTips: [
        'Focus on transferable skills from school and activities',
        'Show enthusiasm and positive attitude',
        'Demonstrate reliability through examples',
        'Highlight any recognition or awards received',
        'Mention technology skills and willingness to learn new systems',
        'Show maturity and professionalism in presentation'
      ],
      salaryInfo: {
        range: { min: 18000, max: 30000 },
        negotiationTips: [
          'Entry-level positions typically start at minimum wage or slightly above',
          'Focus on gaining experience rather than high starting salary',
          'Ask about opportunities for raises and advancement',
          'Consider total package including flexible hours, training, and growth potential',
          'Show enthusiasm for learning and developing skills'
        ]
      },
      careerProgression: [
        'First job provides foundation for future career development',
        'Skills learned transfer to any industry',
        'Strong performance can lead to recommendations and references',
        'Experience helps clarify career interests and goals',
        'Builds professional network and work history'
      ]
    },
    
    industryKeywords: [
      'entry-level', 'student', 'reliable', 'team player', 'quick learner',
      'communication', 'time management', 'adaptable', 'motivated',
      'customer service', 'problem solving', 'organized', 'detail-oriented'
    ],
    
    actionVerbs: [
      'Assisted', 'Collaborated', 'Organized', 'Managed', 'Developed',
      'Participated', 'Contributed', 'Maintained', 'Supported', 'Demonstrated',
      'Achieved', 'Completed', 'Coordinated', 'Helped', 'Learned'
    ]
  }
};
