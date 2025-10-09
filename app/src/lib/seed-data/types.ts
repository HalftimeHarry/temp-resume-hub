/**
 * Seed data types for bootstrapping resumes
 * Separates industry/role content from visual templates
 */

export interface IndustrySeedData {
  id: string;
  name: string;
  description: string;
  category: 'entry-level' | 'professional' | 'specialized';
  icon?: string;
  
  // Target metadata
  targetRoles: string[];
  targetIndustries: string[];
  experienceLevel: string[];
  
  // Content seed data
  summaryTemplates: string[];
  skillSuggestions: SkillSuggestion[];
  experienceExamples: ExperienceExample[];
  educationExamples: EducationExample[];
  
  // Guidance
  guidance?: {
    gettingStarted?: string[];
    commonMistakes?: string[];
    successTips?: string[];
    interviewPrep?: string[];
    salaryInfo?: {
      range: { min: number; max: number };
      negotiationTips?: string[];
    };
    industryInsights?: string[];
    careerProgression?: string[];
  };
  
  // Keywords for ATS optimization
  industryKeywords?: string[];
  actionVerbs?: string[];
}

export interface SkillSuggestion {
  name: string;
  category: 'technical' | 'soft' | 'professional';
  level: 'beginner' | 'intermediate' | 'advanced';
  priority: 'high' | 'medium' | 'low';
  description?: string;
}

export interface ExperienceExample {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  highlights: string[];
}

export interface EducationExample {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa?: string;
  honors?: string[];
  description?: string;
}
