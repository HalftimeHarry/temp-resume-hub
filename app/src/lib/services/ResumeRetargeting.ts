/**
 * Resume Retargeting Service
 * 
 * Handles duplication and adaptation of resumes for different industries.
 * Adapts keywords, terminology, and focus to match the target industry.
 */

import type { Resume } from '$lib/types/resume';
import { generateId } from '$lib/utils';

export interface RetargetingOptions {
  targetIndustry: string;
  purpose?: string;
  preserveStructure?: boolean;
}

export interface RetargetingResult {
  resume: Partial<Resume>;
  changes: string[];
  adaptations: {
    summary?: string;
    keywords: string[];
    experienceUpdates: number;
    skillsReordered: boolean;
  };
}

/**
 * Industry-specific keyword mappings
 */
const INDUSTRY_KEYWORDS: Record<string, {
  primary: string[];
  secondary: string[];
  terminology: Record<string, string>;
}> = {
  'Technology': {
    primary: ['software', 'development', 'engineering', 'technical', 'digital', 'innovation'],
    secondary: ['agile', 'scalable', 'cloud', 'API', 'architecture', 'DevOps'],
    terminology: {
      'customer': 'user',
      'client': 'user',
      'project': 'product',
      'team': 'engineering team',
      'managed': 'architected',
      'created': 'developed',
      'handled': 'implemented'
    }
  },
  'Healthcare': {
    primary: ['patient', 'clinical', 'medical', 'healthcare', 'treatment', 'care'],
    secondary: ['HIPAA', 'compliance', 'diagnosis', 'therapeutic', 'wellness', 'health outcomes'],
    terminology: {
      'customer': 'patient',
      'client': 'patient',
      'user': 'patient',
      'service': 'care',
      'quality': 'patient safety',
      'managed': 'coordinated care for',
      'improved': 'enhanced patient outcomes'
    }
  },
  'Finance': {
    primary: ['financial', 'investment', 'portfolio', 'risk', 'compliance', 'regulatory'],
    secondary: ['ROI', 'analysis', 'forecasting', 'audit', 'fiscal', 'capital'],
    terminology: {
      'customer': 'client',
      'user': 'client',
      'project': 'portfolio',
      'managed': 'administered',
      'improved': 'optimized returns',
      'created': 'structured',
      'handled': 'managed assets'
    }
  },
  'Education': {
    primary: ['student', 'learning', 'curriculum', 'teaching', 'academic', 'educational'],
    secondary: ['pedagogy', 'assessment', 'instruction', 'development', 'engagement', 'outcomes'],
    terminology: {
      'customer': 'student',
      'client': 'student',
      'user': 'learner',
      'managed': 'facilitated',
      'improved': 'enhanced learning outcomes',
      'created': 'developed curriculum',
      'project': 'program'
    }
  },
  'Retail': {
    primary: ['customer', 'sales', 'merchandise', 'retail', 'commerce', 'consumer'],
    secondary: ['inventory', 'point-of-sale', 'merchandising', 'customer experience', 'conversion'],
    terminology: {
      'user': 'customer',
      'client': 'customer',
      'managed': 'drove sales',
      'improved': 'increased revenue',
      'created': 'launched',
      'project': 'campaign'
    }
  },
  'Manufacturing': {
    primary: ['production', 'manufacturing', 'operations', 'quality', 'process', 'efficiency'],
    secondary: ['lean', 'Six Sigma', 'supply chain', 'logistics', 'optimization', 'throughput'],
    terminology: {
      'customer': 'client',
      'managed': 'optimized production',
      'improved': 'increased efficiency',
      'created': 'implemented process',
      'project': 'production line'
    }
  },
  'Marketing': {
    primary: ['marketing', 'brand', 'campaign', 'content', 'digital', 'engagement'],
    secondary: ['SEO', 'analytics', 'conversion', 'ROI', 'social media', 'audience'],
    terminology: {
      'customer': 'audience',
      'user': 'consumer',
      'managed': 'orchestrated campaigns',
      'improved': 'increased engagement',
      'created': 'launched campaigns',
      'project': 'campaign'
    }
  },
  'Consulting': {
    primary: ['consulting', 'strategy', 'advisory', 'business', 'transformation', 'solutions'],
    secondary: ['stakeholder', 'analysis', 'recommendations', 'implementation', 'optimization'],
    terminology: {
      'customer': 'client',
      'user': 'stakeholder',
      'managed': 'advised on',
      'improved': 'optimized business outcomes',
      'created': 'developed strategy',
      'project': 'engagement'
    }
  }
};

/**
 * Adapt text content for a specific industry
 */
function adaptTextForIndustry(text: string, industry: string): string {
  if (!text || !INDUSTRY_KEYWORDS[industry]) return text;

  let adaptedText = text;
  const industryData = INDUSTRY_KEYWORDS[industry];

  // Apply terminology replacements
  Object.entries(industryData.terminology).forEach(([from, to]) => {
    const regex = new RegExp(`\\b${from}\\b`, 'gi');
    adaptedText = adaptedText.replace(regex, to);
  });

  return adaptedText;
}

/**
 * Generate industry-specific summary
 */
function generateIndustrySummary(originalSummary: string, industry: string, experience: any[]): string {
  if (!INDUSTRY_KEYWORDS[industry]) return originalSummary;

  const industryData = INDUSTRY_KEYWORDS[industry];
  
  // Extract years of experience
  const yearsMatch = originalSummary.match(/(\d+)\+?\s*years?/i);
  const years = yearsMatch ? yearsMatch[1] : '5';

  // Build industry-specific summary
  const primaryKeywords = industryData.primary.slice(0, 3).join(', ');
  
  return `Experienced professional with ${years}+ years in ${industry.toLowerCase()}, specializing in ${primaryKeywords}. Proven track record of delivering results in ${industry.toLowerCase()} environments. ${adaptTextForIndustry(originalSummary.split('.')[1] || '', industry)}`;
}

/**
 * Reorder skills based on industry relevance
 */
function reorderSkillsForIndustry(skills: any[], industry: string): any[] {
  if (!INDUSTRY_KEYWORDS[industry]) return skills;

  const industryData = INDUSTRY_KEYWORDS[industry];
  const allIndustryKeywords = [...industryData.primary, ...industryData.secondary].map(k => k.toLowerCase());

  // Score each skill based on industry relevance
  const scoredSkills = skills.map(skill => {
    const skillName = skill.name.toLowerCase();
    let score = 0;

    // Check if skill name contains industry keywords
    allIndustryKeywords.forEach(keyword => {
      if (skillName.includes(keyword)) {
        score += 10;
      }
    });

    // Boost technical skills for tech industry
    if (industry === 'Technology' && skill.category === 'Technical') {
      score += 5;
    }

    return { ...skill, _score: score };
  });

  // Sort by score (descending) and remove score property
  return scoredSkills
    .sort((a, b) => b._score - a._score)
    .map(({ _score, ...skill }) => skill);
}

/**
 * Adapt experience descriptions for industry
 */
function adaptExperienceForIndustry(experience: any[], industry: string): { adapted: any[]; updateCount: number } {
  let updateCount = 0;

  const adapted = experience.map(exp => {
    const originalDescription = exp.description || '';
    const adaptedDescription = adaptTextForIndustry(originalDescription, industry);
    
    if (adaptedDescription !== originalDescription) {
      updateCount++;
    }

    // Adapt highlights
    const adaptedHighlights = (exp.highlights || []).map((highlight: string) => 
      adaptTextForIndustry(highlight, industry)
    );

    return {
      ...exp,
      description: adaptedDescription,
      highlights: adaptedHighlights
    };
  });

  return { adapted, updateCount };
}

/**
 * Main retargeting function
 */
export async function retargetResume(
  originalResume: Resume,
  options: RetargetingOptions
): Promise<RetargetingResult> {
  const { targetIndustry, purpose, preserveStructure = true } = options;
  
  const changes: string[] = [];
  const industryKeywords = INDUSTRY_KEYWORDS[targetIndustry]?.primary || [];

  // Adapt summary
  const originalSummary = originalResume.content?.summary || '';
  const adaptedSummary = generateIndustrySummary(
    originalSummary,
    targetIndustry,
    originalResume.content?.experience || []
  );
  if (adaptedSummary !== originalSummary) {
    changes.push('Updated professional summary for industry focus');
  }

  // Adapt experience
  const { adapted: adaptedExperience, updateCount: expUpdateCount } = adaptExperienceForIndustry(
    originalResume.content?.experience || [],
    targetIndustry
  );
  if (expUpdateCount > 0) {
    changes.push(`Adapted ${expUpdateCount} experience descriptions with industry terminology`);
  }

  // Reorder skills
  const originalSkills = originalResume.content?.skills || [];
  const reorderedSkills = reorderSkillsForIndustry(originalSkills, targetIndustry);
  const skillsReordered = JSON.stringify(originalSkills) !== JSON.stringify(reorderedSkills);
  if (skillsReordered) {
    changes.push('Reordered skills to prioritize industry-relevant competencies');
  }

  // Generate new title
  const newTitle = purpose || `${originalResume.title.split(' - ')[0]} - ${targetIndustry}`;

  // Create adapted resume
  const adaptedResume: Partial<Resume> = {
    title: newTitle,
    user: originalResume.user,
    template: originalResume.template,
    is_public: false,
    purpose: purpose,
    target_industry: targetIndustry,
    content: {
      ...originalResume.content,
      summary: adaptedSummary,
      experience: adaptedExperience,
      skills: reorderedSkills,
      // Keep other sections as-is if preserving structure
      ...(preserveStructure ? {
        education: originalResume.content?.education,
        projects: originalResume.content?.projects,
        settings: originalResume.content?.settings
      } : {})
    }
  };

  return {
    resume: adaptedResume,
    changes,
    adaptations: {
      summary: adaptedSummary,
      keywords: industryKeywords,
      experienceUpdates: expUpdateCount,
      skillsReordered
    }
  };
}

/**
 * Get available industries
 */
export function getAvailableIndustries(): string[] {
  return Object.keys(INDUSTRY_KEYWORDS);
}

/**
 * Get industry keywords
 */
export function getIndustryKeywords(industry: string): string[] {
  const data = INDUSTRY_KEYWORDS[industry];
  return data ? [...data.primary, ...data.secondary] : [];
}
