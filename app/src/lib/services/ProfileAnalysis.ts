/**
 * Profile Analysis Service
 * 
 * Analyzes user profiles to detect missing data and suggest improvements
 * for better resume generation quality.
 */

import type { UserProfile } from '$lib/types';

export interface ProfileField {
  name: string;
  label: string;
  category: 'basic' | 'professional' | 'experience' | 'education' | 'skills';
  weight: number; // Importance weight (0-100)
  isPresent: boolean;
  value?: any;
}

export interface ProfileSuggestion {
  field: string;
  label: string;
  reason: string;
  impact: 'high' | 'medium' | 'low';
  action: string;
  category: string;
}

export interface ProfileAnalysisResult {
  completeness: number; // 0-100
  missingFields: ProfileField[];
  suggestions: ProfileSuggestion[];
  strengths: string[];
  breakdown: {
    basic: number;
    professional: number;
    experience: number;
    education: number;
    skills: number;
  };
  isReadyForGeneration: boolean;
  minimumRequirementsMet: boolean;
}

/**
 * Profile field definitions with weights
 */
const PROFILE_FIELDS: Omit<ProfileField, 'isPresent' | 'value'>[] = [
  // Basic Information (20% total)
  { name: 'first_name', label: 'First Name', category: 'basic', weight: 5 },
  { name: 'last_name', label: 'Last Name', category: 'basic', weight: 5 },
  { name: 'phone', label: 'Phone Number', category: 'basic', weight: 5 },
  { name: 'location', label: 'Location', category: 'basic', weight: 5 },
  
  // Professional Information (20% total)
  { name: 'target_industry', label: 'Target Industry', category: 'professional', weight: 10 },
  { name: 'professional_summary', label: 'Professional Summary', category: 'professional', weight: 10 },
  
  // Work Experience (30% total)
  { name: 'work_experience', label: 'Work Experience', category: 'experience', weight: 30 },
  
  // Education (15% total)
  { name: 'education', label: 'Education', category: 'education', weight: 15 },
  
  // Skills (15% total)
  { name: 'skills', label: 'Skills', category: 'skills', weight: 15 }
];

/**
 * Minimum requirements for resume generation
 */
const MINIMUM_REQUIREMENTS = ['first_name', 'last_name'];

/**
 * Profile Analysis Service
 */
export class ProfileAnalysisService {
  private profile: UserProfile;

  constructor(profile: UserProfile) {
    this.profile = profile;
  }

  /**
   * Perform complete profile analysis
   */
  public analyze(): ProfileAnalysisResult {
    const fields = this.analyzeFields();
    const missingFields = fields.filter(f => !f.isPresent);
    const presentFields = fields.filter(f => f.isPresent);
    
    // Calculate completeness
    const totalWeight = PROFILE_FIELDS.reduce((sum, f) => sum + f.weight, 0);
    const presentWeight = presentFields.reduce((sum, f) => sum + f.weight, 0);
    const completeness = Math.round((presentWeight / totalWeight) * 100);
    
    // Generate suggestions
    const suggestions = this.generateSuggestions(missingFields);
    
    // Identify strengths
    const strengths = this.identifyStrengths(presentFields);
    
    // Calculate breakdown by category
    const breakdown = this.calculateBreakdown(fields);
    
    // Check if ready for generation
    const minimumRequirementsMet = this.checkMinimumRequirements();
    const isReadyForGeneration = completeness >= 40 && minimumRequirementsMet;
    
    return {
      completeness,
      missingFields,
      suggestions,
      strengths,
      breakdown,
      isReadyForGeneration,
      minimumRequirementsMet
    };
  }

  /**
   * Analyze individual fields
   */
  private analyzeFields(): ProfileField[] {
    return PROFILE_FIELDS.map(fieldDef => {
      const value = (this.profile as any)[fieldDef.name];
      const isPresent = this.isFieldPresent(fieldDef.name, value);
      
      return {
        ...fieldDef,
        isPresent,
        value
      };
    });
  }

  /**
   * Check if a field is present and has meaningful data
   */
  private isFieldPresent(fieldName: string, value: any): boolean {
    if (value === null || value === undefined) {
      return false;
    }

    // String fields
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }

    // Array fields (work_experience, education, skills)
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    // JSON string fields
    if (typeof value === 'string' && (fieldName === 'work_experience' || fieldName === 'education' || fieldName === 'skills')) {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) && parsed.length > 0;
      } catch {
        return false;
      }
    }

    return true;
  }

  /**
   * Generate improvement suggestions
   */
  private generateSuggestions(missingFields: ProfileField[]): ProfileSuggestion[] {
    const suggestions: ProfileSuggestion[] = [];

    for (const field of missingFields) {
      const suggestion = this.createSuggestion(field);
      if (suggestion) {
        suggestions.push(suggestion);
      }
    }

    // Sort by impact (high -> medium -> low)
    const impactOrder = { high: 0, medium: 1, low: 2 };
    suggestions.sort((a, b) => impactOrder[a.impact] - impactOrder[b.impact]);

    return suggestions;
  }

  /**
   * Create suggestion for a missing field
   */
  private createSuggestion(field: ProfileField): ProfileSuggestion | null {
    const suggestionMap: Record<string, Omit<ProfileSuggestion, 'field' | 'label' | 'category'>> = {
      first_name: {
        reason: 'Required for resume header',
        impact: 'high',
        action: 'Add your first name to complete basic information'
      },
      last_name: {
        reason: 'Required for resume header',
        impact: 'high',
        action: 'Add your last name to complete basic information'
      },
      phone: {
        reason: 'Employers need a way to contact you',
        impact: 'high',
        action: 'Add your phone number for better contact options'
      },
      location: {
        reason: 'Helps employers understand your availability',
        impact: 'medium',
        action: 'Add your city and state/country'
      },
      target_industry: {
        reason: 'Enables industry-specific keyword optimization',
        impact: 'high',
        action: 'Select your target industry for better keyword matching'
      },
      professional_summary: {
        reason: 'Provides a strong opening statement for your resume',
        impact: 'high',
        action: 'Write a brief professional summary (2-3 sentences)'
      },
      work_experience: {
        reason: 'Essential for showcasing your career history',
        impact: 'high',
        action: 'Add at least one work experience entry with achievements'
      },
      education: {
        reason: 'Important for demonstrating your qualifications',
        impact: 'medium',
        action: 'Add your educational background'
      },
      skills: {
        reason: 'Highlights your technical and soft skills',
        impact: 'high',
        action: 'List your relevant skills (aim for 5-10 skills)'
      }
    };

    const suggestionData = suggestionMap[field.name];
    if (!suggestionData) {
      return null;
    }

    return {
      field: field.name,
      label: field.label,
      category: field.category,
      ...suggestionData
    };
  }

  /**
   * Identify profile strengths
   */
  private identifyStrengths(presentFields: ProfileField[]): string[] {
    const strengths: string[] = [];

    // Check for complete basic info
    const basicFields = presentFields.filter(f => f.category === 'basic');
    if (basicFields.length === PROFILE_FIELDS.filter(f => f.category === 'basic').length) {
      strengths.push('Complete contact information');
    }

    // Check for professional summary
    if (presentFields.some(f => f.name === 'professional_summary')) {
      const summary = (this.profile as any).professional_summary;
      if (summary && summary.length > 100) {
        strengths.push('Detailed professional summary');
      }
    }

    // Check for work experience
    const workExp = presentFields.find(f => f.name === 'work_experience');
    if (workExp) {
      const expCount = this.getWorkExperienceCount();
      if (expCount >= 3) {
        strengths.push(`${expCount} work experiences listed`);
      } else if (expCount > 0) {
        strengths.push('Work experience provided');
      }
    }

    // Check for education
    if (presentFields.some(f => f.name === 'education')) {
      strengths.push('Education background included');
    }

    // Check for skills
    const skills = presentFields.find(f => f.name === 'skills');
    if (skills) {
      const skillCount = this.getSkillsCount();
      if (skillCount >= 8) {
        strengths.push(`${skillCount} skills listed`);
      } else if (skillCount > 0) {
        strengths.push('Skills provided');
      }
    }

    // Check for target industry
    if (presentFields.some(f => f.name === 'target_industry')) {
      strengths.push('Target industry specified');
    }

    return strengths;
  }

  /**
   * Calculate completeness breakdown by category
   */
  private calculateBreakdown(fields: ProfileField[]): ProfileAnalysisResult['breakdown'] {
    const categories = ['basic', 'professional', 'experience', 'education', 'skills'] as const;
    const breakdown: any = {};

    for (const category of categories) {
      const categoryFields = fields.filter(f => f.category === category);
      const totalWeight = categoryFields.reduce((sum, f) => sum + f.weight, 0);
      const presentWeight = categoryFields.filter(f => f.isPresent).reduce((sum, f) => sum + f.weight, 0);
      
      breakdown[category] = totalWeight > 0 ? Math.round((presentWeight / totalWeight) * 100) : 0;
    }

    return breakdown;
  }

  /**
   * Check if minimum requirements are met
   */
  private checkMinimumRequirements(): boolean {
    return MINIMUM_REQUIREMENTS.every(fieldName => {
      const value = (this.profile as any)[fieldName];
      return this.isFieldPresent(fieldName, value);
    });
  }

  /**
   * Get work experience count
   */
  private getWorkExperienceCount(): number {
    const workExp = (this.profile as any).work_experience;
    if (!workExp) return 0;

    try {
      if (Array.isArray(workExp)) {
        return workExp.length;
      } else if (typeof workExp === 'string') {
        const parsed = JSON.parse(workExp);
        return Array.isArray(parsed) ? parsed.length : 0;
      }
    } catch {
      return 0;
    }

    return 0;
  }

  /**
   * Get skills count
   */
  private getSkillsCount(): number {
    const skills = (this.profile as any).skills;
    if (!skills) return 0;

    try {
      if (Array.isArray(skills)) {
        return skills.length;
      } else if (typeof skills === 'string') {
        const parsed = JSON.parse(skills);
        return Array.isArray(parsed) ? parsed.length : 0;
      }
    } catch {
      return 0;
    }

    return 0;
  }

  /**
   * Get education count
   */
  private getEducationCount(): number {
    const education = (this.profile as any).education;
    if (!education) return 0;

    try {
      if (Array.isArray(education)) {
        return education.length;
      } else if (typeof education === 'string') {
        const parsed = JSON.parse(education);
        return Array.isArray(parsed) ? parsed.length : 0;
      }
    } catch {
      return 0;
    }

    return 0;
  }
}

/**
 * Convenience function to analyze profile
 */
export function analyzeProfile(profile: UserProfile): ProfileAnalysisResult {
  const service = new ProfileAnalysisService(profile);
  return service.analyze();
}

/**
 * Get quick completeness score
 */
export function getProfileCompleteness(profile: UserProfile): number {
  const analysis = analyzeProfile(profile);
  return analysis.completeness;
}

/**
 * Check if profile is ready for generation
 */
export function isProfileReady(profile: UserProfile): boolean {
  const analysis = analyzeProfile(profile);
  return analysis.isReadyForGeneration;
}

/**
 * Get top suggestions for profile improvement
 */
export function getTopSuggestions(profile: UserProfile, count: number = 3): ProfileSuggestion[] {
  const analysis = analyzeProfile(profile);
  return analysis.suggestions.slice(0, count);
}

/**
 * Get missing critical fields
 */
export function getMissingCriticalFields(profile: UserProfile): ProfileField[] {
  const analysis = analyzeProfile(profile);
  return analysis.missingFields.filter(f => f.weight >= 10);
}
