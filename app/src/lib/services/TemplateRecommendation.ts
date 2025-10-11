/**
 * Template Recommendation Service
 * 
 * Intelligently recommends resume templates based on user profile,
 * target industry, experience level, and job type.
 */

import type { UserProfile } from '$lib/types';
import type { ExtendedResumeTemplate } from '$lib/templates/types';

export interface TemplateScore {
  templateId: string;
  score: number; // 0-100
  reasons: string[];
  breakdown: {
    industry: number;
    experienceLevel: number;
    jobType: number;
    style: number;
    completeness: number;
  };
}

export interface RecommendationResult {
  template: ExtendedResumeTemplate;
  score: TemplateScore;
  isRecommended: boolean; // Top 3 templates
  rank: number;
}

/**
 * Industry to template style mapping
 */
const INDUSTRY_STYLE_MAP: Record<string, string[]> = {
  'software-engineering': ['modern', 'technical', 'minimal', 'professional'],
  'web-development': ['modern', 'creative', 'colorful', 'technical'],
  'data-science': ['technical', 'professional', 'modern', 'analytical'],
  'design': ['creative', 'colorful', 'modern', 'artistic'],
  'marketing': ['creative', 'colorful', 'modern', 'bold'],
  'sales': ['professional', 'bold', 'modern', 'confident'],
  'product-management': ['professional', 'modern', 'clean', 'strategic'],
  'devops': ['technical', 'modern', 'minimal', 'professional'],
  'finance': ['professional', 'conservative', 'clean', 'traditional'],
  'healthcare': ['professional', 'clean', 'trustworthy', 'conservative'],
  'education': ['professional', 'clean', 'approachable', 'traditional'],
  'consulting': ['professional', 'modern', 'strategic', 'confident'],
  'legal': ['professional', 'conservative', 'traditional', 'formal'],
  'engineering': ['technical', 'professional', 'modern', 'precise']
};

/**
 * Experience level to template complexity mapping
 */
const EXPERIENCE_TEMPLATE_MAP: Record<string, string[]> = {
  'entry': ['simple', 'clean', 'minimal', 'student-friendly'],
  'junior': ['modern', 'clean', 'professional', 'balanced'],
  'mid': ['professional', 'modern', 'comprehensive', 'detailed'],
  'senior': ['executive', 'professional', 'sophisticated', 'comprehensive'],
  'executive': ['executive', 'sophisticated', 'premium', 'leadership']
};

/**
 * Job type to template style mapping
 */
const JOB_TYPE_STYLE_MAP: Record<string, string[]> = {
  'full-time': ['professional', 'comprehensive', 'detailed'],
  'contract': ['professional', 'skills-focused', 'concise'],
  'freelance': ['creative', 'portfolio-focused', 'flexible'],
  'internship': ['student-friendly', 'clean', 'simple'],
  'remote': ['modern', 'tech-savvy', 'flexible']
};

/**
 * Template Recommendation Service
 */
export class TemplateRecommendationService {
  private profile: UserProfile;
  private templates: ExtendedResumeTemplate[];

  constructor(profile: UserProfile, templates: ExtendedResumeTemplate[]) {
    this.profile = profile;
    this.templates = templates;
  }

  /**
   * Get recommended templates sorted by relevance
   */
  public getRecommendations(): RecommendationResult[] {
    // Score all templates
    const scoredTemplates = this.templates.map(template => ({
      template,
      score: this.scoreTemplate(template)
    }));

    // Sort by score (highest first)
    scoredTemplates.sort((a, b) => b.score.score - a.score.score);

    // Mark top 3 as recommended
    return scoredTemplates.map((item, index) => ({
      ...item,
      isRecommended: index < 3,
      rank: index + 1
    }));
  }

  /**
   * Score a single template based on profile
   */
  public scoreTemplate(template: ExtendedResumeTemplate): TemplateScore {
    const reasons: string[] = [];
    const breakdown = {
      industry: 0,
      experienceLevel: 0,
      jobType: 0,
      style: 0,
      completeness: 0
    };

    // 1. Industry Match (30 points)
    breakdown.industry = this.scoreIndustryMatch(template, reasons);

    // 2. Experience Level Match (25 points)
    breakdown.experienceLevel = this.scoreExperienceLevel(template, reasons);

    // 3. Job Type Match (15 points)
    breakdown.jobType = this.scoreJobType(template, reasons);

    // 4. Style Preferences (20 points)
    breakdown.style = this.scoreStyleMatch(template, reasons);

    // 5. Profile Completeness (10 points)
    breakdown.completeness = this.scoreProfileCompleteness(template, reasons);

    // Calculate total score
    const totalScore = Object.values(breakdown).reduce((sum, score) => sum + score, 0);

    return {
      templateId: template.id,
      score: Math.round(totalScore),
      reasons,
      breakdown
    };
  }

  /**
   * Score based on industry match
   */
  private scoreIndustryMatch(template: ExtendedResumeTemplate, reasons: string[]): number {
    const targetIndustry = this.profile.target_industry?.toLowerCase() || '';
    if (!targetIndustry) {
      return 15; // Neutral score if no industry specified
    }

    const preferredStyles = INDUSTRY_STYLE_MAP[targetIndustry] || [];
    const templateTags = template.tags?.map(t => t.toLowerCase()) || [];
    const templateCategory = template.category?.toLowerCase() || '';

    let score = 0;

    // Check if template category matches industry
    if (templateCategory.includes(targetIndustry) || targetIndustry.includes(templateCategory)) {
      score += 15;
      reasons.push(`Designed for ${this.formatIndustry(targetIndustry)} professionals`);
    }

    // Check if template tags match preferred styles
    const matchingStyles = preferredStyles.filter(style => 
      templateTags.some(tag => tag.includes(style) || style.includes(tag))
    );

    if (matchingStyles.length > 0) {
      score += Math.min(15, matchingStyles.length * 5);
      reasons.push(`${this.capitalize(matchingStyles[0])} style suits ${this.formatIndustry(targetIndustry)}`);
    }

    // Bonus for industry-specific keywords in description
    const description = template.description?.toLowerCase() || '';
    if (description.includes(targetIndustry)) {
      score += 5;
    }

    return Math.min(30, score);
  }

  /**
   * Score based on experience level
   */
  private scoreExperienceLevel(template: ExtendedResumeTemplate, reasons: string[]): number {
    const experienceLevel = this.getExperienceLevel();
    const preferredStyles = EXPERIENCE_TEMPLATE_MAP[experienceLevel] || [];
    const templateTags = template.tags?.map(t => t.toLowerCase()) || [];

    let score = 0;

    // Check if template matches experience level
    const matchingStyles = preferredStyles.filter(style =>
      templateTags.some(tag => tag.includes(style) || style.includes(tag))
    );

    if (matchingStyles.length > 0) {
      score += Math.min(20, matchingStyles.length * 7);
      reasons.push(`Appropriate for ${experienceLevel}-level professionals`);
    }

    // Check template complexity
    const isSimple = templateTags.some(tag => 
      ['simple', 'minimal', 'clean', 'basic'].includes(tag)
    );
    const isComplex = templateTags.some(tag =>
      ['executive', 'comprehensive', 'detailed', 'sophisticated'].includes(tag)
    );

    if (experienceLevel === 'entry' && isSimple) {
      score += 5;
      reasons.push('Clean layout perfect for entry-level resumes');
    } else if (['senior', 'executive'].includes(experienceLevel) && isComplex) {
      score += 5;
      reasons.push('Sophisticated design for experienced professionals');
    }

    return Math.min(25, score);
  }

  /**
   * Score based on job type
   */
  private scoreJobType(template: ExtendedResumeTemplate, reasons: string[]): number {
    // Infer job type from profile or use default
    const jobType = this.inferJobType();
    const preferredStyles = JOB_TYPE_STYLE_MAP[jobType] || [];
    const templateTags = template.tags?.map(t => t.toLowerCase()) || [];

    let score = 0;

    const matchingStyles = preferredStyles.filter(style =>
      templateTags.some(tag => tag.includes(style) || style.includes(tag))
    );

    if (matchingStyles.length > 0) {
      score += Math.min(15, matchingStyles.length * 5);
      if (jobType !== 'full-time') {
        reasons.push(`Optimized for ${jobType} positions`);
      }
    }

    return Math.min(15, score);
  }

  /**
   * Score based on style preferences
   */
  private scoreStyleMatch(template: ExtendedResumeTemplate, reasons: string[]): number {
    let score = 0;

    // Check if template has good ratings (if available)
    const popularity = template.popularity || 0;
    if (popularity > 80) {
      score += 10;
      reasons.push('Highly popular template');
    } else if (popularity > 50) {
      score += 5;
    }

    // Check if template is modern
    const templateTags = template.tags?.map(t => t.toLowerCase()) || [];
    if (templateTags.includes('modern') || templateTags.includes('contemporary')) {
      score += 5;
      reasons.push('Modern, up-to-date design');
    }

    // Check if template is ATS-friendly
    if (templateTags.includes('ats-friendly') || templateTags.includes('ats')) {
      score += 5;
      reasons.push('ATS-friendly format');
    }

    return Math.min(20, score);
  }

  /**
   * Score based on profile completeness
   */
  private scoreProfileCompleteness(template: ExtendedResumeTemplate, reasons: string[]): number {
    let score = 0;

    const hasExperience = this.hasWorkExperience();
    const hasEducation = this.hasEducation();
    const hasSkills = this.hasSkills();

    // If profile is complete, prefer comprehensive templates
    if (hasExperience && hasEducation && hasSkills) {
      const templateTags = template.tags?.map(t => t.toLowerCase()) || [];
      if (templateTags.some(tag => ['comprehensive', 'detailed', 'complete'].includes(tag))) {
        score += 10;
        reasons.push('Showcases your complete profile');
      } else {
        score += 5;
      }
    } else {
      // If profile is incomplete, prefer simpler templates
      const templateTags = template.tags?.map(t => t.toLowerCase()) || [];
      if (templateTags.some(tag => ['simple', 'minimal', 'clean'].includes(tag))) {
        score += 10;
        reasons.push('Clean design works well with focused content');
      } else {
        score += 5;
      }
    }

    return Math.min(10, score);
  }

  /**
   * Determine experience level from profile
   */
  private getExperienceLevel(): string {
    // Check if profile has experience_level field
    const profileLevel = (this.profile as any).experience_level?.toLowerCase();
    if (profileLevel) {
      return profileLevel;
    }

    // Infer from work experience
    const workExperience = this.getWorkExperienceYears();
    
    if (workExperience === 0) return 'entry';
    if (workExperience < 2) return 'junior';
    if (workExperience < 5) return 'mid';
    if (workExperience < 10) return 'senior';
    return 'executive';
  }

  /**
   * Calculate years of work experience
   */
  private getWorkExperienceYears(): number {
    const workExp = (this.profile as any).work_experience;
    if (!workExp) return 0;

    try {
      let experiences: any[] = [];
      
      if (Array.isArray(workExp)) {
        experiences = workExp;
      } else if (typeof workExp === 'string') {
        experiences = JSON.parse(workExp);
      }

      if (experiences.length === 0) return 0;

      // Calculate total years
      let totalMonths = 0;
      const now = new Date();

      for (const exp of experiences) {
        const startDate = new Date(exp.start_date || exp.startDate || now);
        const endDate = exp.current || exp.is_current
          ? now
          : new Date(exp.end_date || exp.endDate || now);

        const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
                      (endDate.getMonth() - startDate.getMonth());
        totalMonths += Math.max(0, months);
      }

      return Math.floor(totalMonths / 12);
    } catch (error) {
      return 0;
    }
  }

  /**
   * Check if profile has work experience
   */
  private hasWorkExperience(): boolean {
    return this.getWorkExperienceYears() > 0;
  }

  /**
   * Check if profile has education
   */
  private hasEducation(): boolean {
    const education = (this.profile as any).education;
    if (!education) return false;

    try {
      if (Array.isArray(education)) {
        return education.length > 0;
      } else if (typeof education === 'string') {
        const parsed = JSON.parse(education);
        return Array.isArray(parsed) && parsed.length > 0;
      }
    } catch (error) {
      return false;
    }

    return false;
  }

  /**
   * Check if profile has skills
   */
  private hasSkills(): boolean {
    const skills = (this.profile as any).skills;
    if (!skills) return false;

    try {
      if (Array.isArray(skills)) {
        return skills.length > 0;
      } else if (typeof skills === 'string') {
        const parsed = JSON.parse(skills);
        return Array.isArray(parsed) && parsed.length > 0;
      }
    } catch (error) {
      return false;
    }

    return false;
  }

  /**
   * Infer job type from profile
   */
  private inferJobType(): string {
    // Check if profile has job_type field
    const jobType = (this.profile as any).job_type?.toLowerCase();
    if (jobType) return jobType;

    // Check target industry for clues
    const industry = this.profile.target_industry?.toLowerCase() || '';
    if (industry.includes('freelance') || industry.includes('consultant')) {
      return 'freelance';
    }

    // Default to full-time
    return 'full-time';
  }

  /**
   * Format industry name for display
   */
  private formatIndustry(industry: string): string {
    return industry
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Capitalize first letter
   */
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

/**
 * Convenience function to get template recommendations
 */
export function getTemplateRecommendations(
  profile: UserProfile,
  templates: ExtendedResumeTemplate[]
): RecommendationResult[] {
  const service = new TemplateRecommendationService(profile, templates);
  return service.getRecommendations();
}

/**
 * Get top N recommended templates
 */
export function getTopRecommendations(
  profile: UserProfile,
  templates: ExtendedResumeTemplate[],
  count: number = 3
): RecommendationResult[] {
  const recommendations = getTemplateRecommendations(profile, templates);
  return recommendations.slice(0, count);
}

/**
 * Check if a template is recommended for a profile
 */
export function isTemplateRecommended(
  templateId: string,
  profile: UserProfile,
  templates: ExtendedResumeTemplate[]
): boolean {
  const topRecommendations = getTopRecommendations(profile, templates, 3);
  return topRecommendations.some(rec => rec.template.id === templateId);
}

/**
 * Get recommendation reasons for a specific template
 */
export function getRecommendationReasons(
  templateId: string,
  profile: UserProfile,
  templates: ExtendedResumeTemplate[]
): string[] {
  const template = templates.find(t => t.id === templateId);
  if (!template) return [];

  const service = new TemplateRecommendationService(profile, templates);
  const score = service.scoreTemplate(template);
  return score.reasons;
}
