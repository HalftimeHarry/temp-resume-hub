/**
 * Industry-Specific Keyword Mappings
 * 
 * Provides intelligent keyword adaptation for different industries.
 * Maps generic terms to industry-specific terminology while maintaining meaning.
 */

export interface KeywordMapping {
  generic: string;
  replacement: string;
  context?: string[]; // Optional context words that should be nearby
  weight?: number; // Importance weight (0-1)
}

export interface IndustryKeywords {
  name: string;
  keywords: string[];
  mappings: KeywordMapping[];
  actionVerbs: string[];
  technicalTerms: string[];
}

/**
 * Comprehensive industry keyword database
 */
export const INDUSTRY_KEYWORDS: Record<string, IndustryKeywords> = {
  'software-engineering': {
    name: 'Software Engineering',
    keywords: [
      'software development',
      'full-stack',
      'agile',
      'scalable',
      'cloud-native',
      'microservices',
      'CI/CD',
      'code quality',
      'test-driven development',
      'DevOps',
      'API design',
      'system architecture'
    ],
    mappings: [
      { generic: 'built', replacement: 'engineered', weight: 0.8 },
      { generic: 'made', replacement: 'developed', weight: 0.9 },
      { generic: 'created', replacement: 'architected', context: ['system', 'solution'], weight: 0.8 },
      { generic: 'created', replacement: 'implemented', weight: 0.7 },
      { generic: 'improved', replacement: 'optimized', weight: 0.8 },
      { generic: 'fixed', replacement: 'debugged', weight: 0.7 },
      { generic: 'fixed', replacement: 'resolved', weight: 0.8 },
      { generic: 'worked on', replacement: 'contributed to', weight: 0.6 },
      { generic: 'worked with', replacement: 'collaborated with', weight: 0.7 },
      { generic: 'helped', replacement: 'facilitated', weight: 0.6 },
      { generic: 'managed', replacement: 'orchestrated', context: ['deployment', 'release'], weight: 0.7 },
      { generic: 'website', replacement: 'web application', weight: 0.8 },
      { generic: 'app', replacement: 'application', weight: 0.7 },
      { generic: 'program', replacement: 'software', weight: 0.8 }
    ],
    actionVerbs: [
      'architected',
      'engineered',
      'developed',
      'implemented',
      'optimized',
      'debugged',
      'deployed',
      'integrated',
      'refactored',
      'automated',
      'containerized',
      'orchestrated'
    ],
    technicalTerms: [
      'microservices',
      'REST API',
      'GraphQL',
      'Docker',
      'Kubernetes',
      'CI/CD pipeline',
      'unit testing',
      'integration testing',
      'code review',
      'version control'
    ]
  },

  'web-development': {
    name: 'Web Development',
    keywords: [
      'web development',
      'responsive design',
      'user experience',
      'front-end',
      'back-end',
      'full-stack',
      'modern frameworks',
      'cross-browser compatibility',
      'performance optimization',
      'accessibility'
    ],
    mappings: [
      { generic: 'built', replacement: 'developed', weight: 0.8 },
      { generic: 'made', replacement: 'crafted', context: ['interface', 'design'], weight: 0.7 },
      { generic: 'made', replacement: 'built', weight: 0.7 },
      { generic: 'created', replacement: 'designed', context: ['interface', 'layout', 'component'], weight: 0.8 },
      { generic: 'created', replacement: 'implemented', weight: 0.7 },
      { generic: 'improved', replacement: 'enhanced', weight: 0.8 },
      { generic: 'improved', replacement: 'optimized', context: ['performance', 'speed'], weight: 0.9 },
      { generic: 'fixed', replacement: 'resolved', weight: 0.7 },
      { generic: 'website', replacement: 'web application', weight: 0.8 },
      { generic: 'page', replacement: 'interface', weight: 0.7 },
      { generic: 'looks good', replacement: 'responsive', weight: 0.8 },
      { generic: 'works on mobile', replacement: 'mobile-responsive', weight: 0.9 }
    ],
    actionVerbs: [
      'designed',
      'developed',
      'implemented',
      'crafted',
      'enhanced',
      'optimized',
      'styled',
      'integrated',
      'deployed',
      'maintained'
    ],
    technicalTerms: [
      'responsive design',
      'CSS frameworks',
      'JavaScript frameworks',
      'RESTful APIs',
      'SPA',
      'PWA',
      'SEO optimization',
      'web accessibility',
      'browser compatibility'
    ]
  },

  'data-science': {
    name: 'Data Science',
    keywords: [
      'data analysis',
      'machine learning',
      'statistical modeling',
      'data visualization',
      'predictive analytics',
      'big data',
      'data pipeline',
      'feature engineering',
      'model training',
      'data mining'
    ],
    mappings: [
      { generic: 'analyzed', replacement: 'performed statistical analysis on', weight: 0.8 },
      { generic: 'looked at', replacement: 'analyzed', weight: 0.9 },
      { generic: 'found', replacement: 'discovered insights from', weight: 0.8 },
      { generic: 'found', replacement: 'identified patterns in', weight: 0.8 },
      { generic: 'made', replacement: 'developed', context: ['model', 'algorithm'], weight: 0.9 },
      { generic: 'created', replacement: 'engineered', context: ['feature', 'pipeline'], weight: 0.8 },
      { generic: 'improved', replacement: 'optimized', context: ['model', 'accuracy'], weight: 0.9 },
      { generic: 'predicted', replacement: 'forecasted', weight: 0.7 },
      { generic: 'showed', replacement: 'visualized', weight: 0.8 },
      { generic: 'worked with', replacement: 'processed', context: ['data', 'dataset'], weight: 0.8 }
    ],
    actionVerbs: [
      'analyzed',
      'modeled',
      'predicted',
      'visualized',
      'engineered',
      'processed',
      'trained',
      'validated',
      'optimized',
      'forecasted'
    ],
    technicalTerms: [
      'machine learning',
      'neural networks',
      'regression analysis',
      'classification',
      'clustering',
      'data pipeline',
      'ETL process',
      'feature engineering',
      'model validation'
    ]
  },

  'design': {
    name: 'Design',
    keywords: [
      'user experience',
      'user interface',
      'design thinking',
      'prototyping',
      'user research',
      'visual design',
      'accessibility',
      'design systems',
      'wireframing',
      'usability testing'
    ],
    mappings: [
      { generic: 'made', replacement: 'designed', weight: 0.9 },
      { generic: 'created', replacement: 'crafted', weight: 0.8 },
      { generic: 'built', replacement: 'prototyped', context: ['mockup', 'prototype'], weight: 0.9 },
      { generic: 'improved', replacement: 'refined', weight: 0.8 },
      { generic: 'improved', replacement: 'enhanced', context: ['experience', 'usability'], weight: 0.9 },
      { generic: 'tested', replacement: 'conducted usability testing on', weight: 0.8 },
      { generic: 'talked to users', replacement: 'conducted user research', weight: 0.9 },
      { generic: 'drew', replacement: 'wireframed', weight: 0.8 },
      { generic: 'looks good', replacement: 'visually appealing', weight: 0.7 },
      { generic: 'easy to use', replacement: 'intuitive', weight: 0.8 }
    ],
    actionVerbs: [
      'designed',
      'prototyped',
      'wireframed',
      'crafted',
      'refined',
      'conceptualized',
      'iterated',
      'validated',
      'researched',
      'collaborated'
    ],
    technicalTerms: [
      'user personas',
      'user journey',
      'design system',
      'style guide',
      'high-fidelity mockups',
      'low-fidelity wireframes',
      'A/B testing',
      'heuristic evaluation',
      'information architecture'
    ]
  },

  'marketing': {
    name: 'Marketing',
    keywords: [
      'digital marketing',
      'campaign management',
      'analytics',
      'brand strategy',
      'content marketing',
      'SEO',
      'social media',
      'lead generation',
      'conversion optimization',
      'market research'
    ],
    mappings: [
      { generic: 'made', replacement: 'developed', context: ['campaign', 'strategy'], weight: 0.8 },
      { generic: 'created', replacement: 'launched', context: ['campaign'], weight: 0.9 },
      { generic: 'created', replacement: 'produced', context: ['content'], weight: 0.8 },
      { generic: 'improved', replacement: 'optimized', context: ['conversion', 'engagement'], weight: 0.9 },
      { generic: 'increased', replacement: 'drove', context: ['traffic', 'engagement', 'sales'], weight: 0.8 },
      { generic: 'got more', replacement: 'generated', context: ['leads', 'traffic'], weight: 0.9 },
      { generic: 'wrote', replacement: 'crafted', context: ['copy', 'content'], weight: 0.7 },
      { generic: 'posted', replacement: 'published', weight: 0.7 },
      { generic: 'looked at', replacement: 'analyzed', context: ['metrics', 'data'], weight: 0.8 }
    ],
    actionVerbs: [
      'launched',
      'optimized',
      'drove',
      'generated',
      'crafted',
      'analyzed',
      'strategized',
      'executed',
      'measured',
      'amplified'
    ],
    technicalTerms: [
      'SEO/SEM',
      'Google Analytics',
      'conversion rate',
      'CTR',
      'ROI',
      'A/B testing',
      'email campaigns',
      'social media strategy',
      'content calendar'
    ]
  },

  'sales': {
    name: 'Sales',
    keywords: [
      'business development',
      'client relationships',
      'revenue growth',
      'pipeline management',
      'negotiation',
      'account management',
      'quota attainment',
      'prospecting',
      'closing deals',
      'CRM'
    ],
    mappings: [
      { generic: 'sold', replacement: 'closed', weight: 0.8 },
      { generic: 'talked to', replacement: 'engaged with', context: ['client', 'customer'], weight: 0.8 },
      { generic: 'found', replacement: 'identified', context: ['opportunity', 'lead'], weight: 0.8 },
      { generic: 'made', replacement: 'generated', context: ['revenue', 'sales'], weight: 0.9 },
      { generic: 'increased', replacement: 'grew', context: ['revenue', 'sales'], weight: 0.8 },
      { generic: 'got', replacement: 'secured', context: ['deal', 'contract', 'client'], weight: 0.9 },
      { generic: 'worked with', replacement: 'partnered with', weight: 0.7 },
      { generic: 'helped', replacement: 'consulted with', weight: 0.8 },
      { generic: 'managed', replacement: 'cultivated', context: ['relationship', 'account'], weight: 0.8 }
    ],
    actionVerbs: [
      'closed',
      'negotiated',
      'prospected',
      'generated',
      'cultivated',
      'secured',
      'exceeded',
      'achieved',
      'partnered',
      'consulted'
    ],
    technicalTerms: [
      'pipeline management',
      'CRM software',
      'quota attainment',
      'sales cycle',
      'lead qualification',
      'account planning',
      'value proposition',
      'ROI analysis'
    ]
  },

  'product-management': {
    name: 'Product Management',
    keywords: [
      'product strategy',
      'roadmap',
      'stakeholder management',
      'user research',
      'agile methodologies',
      'cross-functional',
      'product lifecycle',
      'feature prioritization',
      'market analysis',
      'KPIs'
    ],
    mappings: [
      { generic: 'made', replacement: 'defined', context: ['strategy', 'roadmap'], weight: 0.9 },
      { generic: 'created', replacement: 'developed', context: ['roadmap', 'strategy'], weight: 0.8 },
      { generic: 'worked with', replacement: 'collaborated with', weight: 0.8 },
      { generic: 'decided', replacement: 'prioritized', weight: 0.8 },
      { generic: 'talked to', replacement: 'engaged with', context: ['stakeholder', 'user'], weight: 0.8 },
      { generic: 'found out', replacement: 'discovered through research', weight: 0.8 },
      { generic: 'improved', replacement: 'enhanced', context: ['product', 'feature'], weight: 0.8 },
      { generic: 'launched', replacement: 'delivered', weight: 0.7 },
      { generic: 'managed', replacement: 'orchestrated', weight: 0.7 }
    ],
    actionVerbs: [
      'defined',
      'prioritized',
      'launched',
      'collaborated',
      'analyzed',
      'strategized',
      'delivered',
      'optimized',
      'validated',
      'orchestrated'
    ],
    technicalTerms: [
      'product roadmap',
      'user stories',
      'sprint planning',
      'backlog grooming',
      'MVP',
      'product-market fit',
      'OKRs',
      'A/B testing',
      'feature flags'
    ]
  },

  'devops': {
    name: 'DevOps',
    keywords: [
      'automation',
      'infrastructure',
      'continuous integration',
      'deployment',
      'monitoring',
      'cloud infrastructure',
      'containerization',
      'orchestration',
      'infrastructure as code',
      'reliability'
    ],
    mappings: [
      { generic: 'made', replacement: 'automated', context: ['process', 'deployment'], weight: 0.9 },
      { generic: 'built', replacement: 'architected', context: ['infrastructure', 'pipeline'], weight: 0.9 },
      { generic: 'created', replacement: 'implemented', context: ['pipeline', 'automation'], weight: 0.8 },
      { generic: 'improved', replacement: 'optimized', context: ['performance', 'deployment'], weight: 0.9 },
      { generic: 'fixed', replacement: 'resolved', weight: 0.7 },
      { generic: 'set up', replacement: 'configured', weight: 0.8 },
      { generic: 'deployed', replacement: 'orchestrated deployment of', weight: 0.8 },
      { generic: 'monitored', replacement: 'maintained observability of', weight: 0.8 },
      { generic: 'managed', replacement: 'administered', context: ['server', 'infrastructure'], weight: 0.8 }
    ],
    actionVerbs: [
      'automated',
      'orchestrated',
      'containerized',
      'deployed',
      'monitored',
      'configured',
      'optimized',
      'scaled',
      'maintained',
      'secured'
    ],
    technicalTerms: [
      'CI/CD pipeline',
      'Docker',
      'Kubernetes',
      'infrastructure as code',
      'Terraform',
      'monitoring tools',
      'log aggregation',
      'auto-scaling',
      'load balancing'
    ]
  },

  'finance': {
    name: 'Finance',
    keywords: [
      'financial analysis',
      'risk management',
      'portfolio management',
      'financial modeling',
      'forecasting',
      'compliance',
      'budgeting',
      'investment strategy',
      'financial reporting',
      'due diligence'
    ],
    mappings: [
      { generic: 'looked at', replacement: 'analyzed', context: ['financial', 'data'], weight: 0.9 },
      { generic: 'made', replacement: 'developed', context: ['model', 'forecast'], weight: 0.8 },
      { generic: 'created', replacement: 'prepared', context: ['report', 'analysis'], weight: 0.8 },
      { generic: 'improved', replacement: 'optimized', context: ['portfolio', 'returns'], weight: 0.8 },
      { generic: 'managed', replacement: 'administered', context: ['portfolio', 'budget'], weight: 0.8 },
      { generic: 'saved', replacement: 'reduced costs by', weight: 0.9 },
      { generic: 'increased', replacement: 'grew', context: ['revenue', 'profit'], weight: 0.8 },
      { generic: 'checked', replacement: 'audited', weight: 0.8 },
      { generic: 'predicted', replacement: 'forecasted', weight: 0.8 }
    ],
    actionVerbs: [
      'analyzed',
      'forecasted',
      'modeled',
      'optimized',
      'audited',
      'reconciled',
      'evaluated',
      'assessed',
      'projected',
      'administered'
    ],
    technicalTerms: [
      'financial modeling',
      'DCF analysis',
      'risk assessment',
      'portfolio optimization',
      'variance analysis',
      'GAAP',
      'financial statements',
      'ROI analysis',
      'budget forecasting'
    ]
  }
};

/**
 * Get keywords for a specific industry
 */
export function getIndustryKeywords(industry: string): IndustryKeywords | null {
  const normalizedIndustry = industry.toLowerCase().trim();
  return INDUSTRY_KEYWORDS[normalizedIndustry] || null;
}

/**
 * Get all available industries
 */
export function getAvailableIndustries(): string[] {
  return Object.keys(INDUSTRY_KEYWORDS);
}

/**
 * Find the best matching industry based on text content
 */
export function detectIndustry(text: string): string | null {
  const lowerText = text.toLowerCase();
  let bestMatch: { industry: string; score: number } | null = null;

  for (const [industry, data] of Object.entries(INDUSTRY_KEYWORDS)) {
    let score = 0;
    
    // Check for keyword matches
    for (const keyword of data.keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        score += 2;
      }
    }
    
    // Check for technical term matches
    for (const term of data.technicalTerms) {
      if (lowerText.includes(term.toLowerCase())) {
        score += 1.5;
      }
    }
    
    // Check for action verb matches
    for (const verb of data.actionVerbs) {
      if (lowerText.includes(verb.toLowerCase())) {
        score += 1;
      }
    }
    
    if (!bestMatch || score > bestMatch.score) {
      bestMatch = { industry, score };
    }
  }

  return bestMatch && bestMatch.score > 3 ? bestMatch.industry : null;
}
