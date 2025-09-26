/**
 * Enhanced Template Store - Handles loading and processing of templates with quickstarter data
 * This works with your existing PocketBase structure without any schema changes
 */

import { writable, derived } from 'svelte/store';
import { pb } from '$lib/pocketbase';
import type { ResumeTemplate } from '$lib/types/resume';
import { userProfile } from './userProfile';

// Enhanced template interface that extends the existing one
export interface EnhancedTemplate extends ResumeTemplate {
  quickstarter?: QuickstarterData;
  layoutConfig: LayoutConfig;
}

export interface QuickstarterData {
  metadata: {
    targetJobs: string[];
    industry: string;
    experienceLevel: 'entry' | 'mid' | 'senior';
    averageSalary: number;
    salaryRange?: { min: number; max: number };
    demandLevel: 'low' | 'medium' | 'high';
    successRate: number;
    popularityScore: number;
    timeToHire: string;
    commonEmployers: string[];
  };
  starterContent: {
    summaryTemplates: string[];
    skillSuggestions: SkillSuggestion[];
    experienceExamples: ExperienceExample[];
    educationExamples?: EducationExample[];
    industryKeywords: string[];
    actionVerbs: string[];
  };
  guidance: {
    gettingStarted: string[];
    commonMistakes: string[];
    successTips: string[];
    interviewPrep: string[];
    salaryNegotiation: string[];
    industryInsights: string[];
    careerProgression: string[];
  };
}

export interface SkillSuggestion {
  name: string;
  category: 'technical' | 'soft' | 'language';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  priority: 'low' | 'medium' | 'high';
  description: string;
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
  honors: string[];
  description: string;
}

export interface LayoutConfig {
  layout: string;
  colorScheme: string;
  fontFamily?: string;
  sections: string[];
  maxPages: number;
  spacing: string;
  headerStyle?: string;
}

// Stores
export const enhancedTemplates = writable<EnhancedTemplate[]>([]);
export const quickstarters = writable<EnhancedTemplate[]>([]);
export const isLoadingEnhanced = writable(false);

// Derived stores
export const quickstartersByCategory = derived(quickstarters, ($quickstarters) => {
  const categories: Record<string, EnhancedTemplate[]> = {};
  
  $quickstarters.forEach(template => {
    const category = template.category || 'other';
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(template);
  });
  
  return categories;
});

export const popularQuickstarters = derived(quickstarters, ($quickstarters) => {
  return $quickstarters
    .filter(t => t.quickstarter?.metadata.popularityScore > 80)
    .sort((a, b) => (b.quickstarter?.metadata.popularityScore || 0) - (a.quickstarter?.metadata.popularityScore || 0))
    .slice(0, 6);
});

// Enhanced Template Store
export const enhancedTemplateStore = {
  /**
   * Load all templates and process enhanced data
   * Works with existing PocketBase structure
   */
  async loadTemplates(): Promise<EnhancedTemplate[]> {
    isLoadingEnhanced.set(true);
    
    try {
      console.log('🔄 Loading templates from PocketBase...');
      
      // Use your existing PocketBase collection
      const templates = await pb.collection('templates').getFullList({
        sort: '-created'
      });
      
      console.log(`✅ Loaded ${templates.length} templates from database`);
      
      // Process each template to extract enhanced data
      const enhancedTemplateList: EnhancedTemplate[] = templates.map(template => {
        const config = template.config || {};
        
        // Extract quickstarter data if it exists
        const quickstarter = config.quickstarter || null;
        
        // Extract layout configuration (backward compatible)
        const layoutConfig: LayoutConfig = {
          layout: config.layout || 'single-column',
          colorScheme: config.colorScheme || 'blue',
          fontFamily: config.fontFamily || 'Inter',
          sections: config.sections || ['personal', 'summary', 'experience', 'education', 'skills'],
          maxPages: config.maxPages || 1,
          spacing: config.spacing || 'normal',
          headerStyle: config.headerStyle || 'professional'
        };
        
        const enhanced: EnhancedTemplate = {
          id: template.id,
          name: template.name,
          description: template.description || '',
          category: template.category || 'professional',
          thumbnail: template.preview_image || '',
          previewImages: template.preview_image ? [template.preview_image] : [],
          settings: {
            template: template.slug,
            colorScheme: layoutConfig.colorScheme,
            fontSize: 'medium',
            spacing: layoutConfig.spacing,
            showProfileImage: false,
            sectionOrder: layoutConfig.sections
          },
          sections: layoutConfig.sections.map(section => ({
            id: section,
            type: section as any,
            title: section.charAt(0).toUpperCase() + section.slice(1),
            visible: true,
            order: layoutConfig.sections.indexOf(section)
          })),
          isPremium: template.is_premium || false,
          isPopular: quickstarter?.metadata.popularityScore > 85 || false,
          createdBy: 'system',
          createdAt: template.created,
          usageCount: 0,
          rating: quickstarter?.metadata.successRate / 20 || 4.0, // Convert success rate to 5-star rating
          tags: quickstarter?.metadata.targetJobs || [],
          
          // Enhanced data
          quickstarter,
          layoutConfig
        };
        
        if (quickstarter) {
          console.log(`✨ Found enhanced template: ${template.name} (${quickstarter.metadata.targetJobs.join(', ')})`);
        }
        
        return enhanced;
      });
      
      // Update stores
      enhancedTemplates.set(enhancedTemplateList);
      
      // Filter quickstarters (templates with enhanced data)
      const quickstarterList = enhancedTemplateList.filter(t => t.quickstarter !== null);
      quickstarters.set(quickstarterList);
      
      console.log(`✅ Processed ${enhancedTemplateList.length} templates, ${quickstarterList.length} with quickstarter data`);
      
      return enhancedTemplateList;
      
    } catch (error) {
      console.error('❌ Error loading enhanced templates:', error);
      throw error;
    } finally {
      isLoadingEnhanced.set(false);
    }
  },
  
  /**
   * Get quickstarters filtered by criteria
   */
  getQuickstarters(filters?: {
    industry?: string;
    experienceLevel?: string;
    category?: string;
    searchQuery?: string;
  }): EnhancedTemplate[] {
    let templates: EnhancedTemplate[] = [];
    
    quickstarters.subscribe(value => {
      templates = value;
    })();
    
    if (!filters) return templates;
    
    return templates.filter(template => {
      const quickstarter = template.quickstarter;
      if (!quickstarter) return false;
      
      // Industry filter
      if (filters.industry && quickstarter.metadata.industry !== filters.industry) {
        return false;
      }
      
      // Experience level filter
      if (filters.experienceLevel && quickstarter.metadata.experienceLevel !== filters.experienceLevel) {
        return false;
      }
      
      // Category filter
      if (filters.category && template.category !== filters.category) {
        return false;
      }
      
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchableText = [
          template.name,
          template.description,
          ...quickstarter.metadata.targetJobs,
          quickstarter.metadata.industry
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(query)) {
          return false;
        }
      }
      
      return true;
    });
  },
  
  /**
   * Get recommended quickstarters based on user profile
   */
  getRecommendations(criteria?: {
    targetIndustry?: string;
    experienceLevel?: string;
    jobTypes?: string[];
    careerStage?: string;
    skills?: string[];
    educationLevel?: string;
    workType?: string[];
  }): EnhancedTemplate[] {
    const allQuickstarters = this.getQuickstarters();
    
    // If no criteria provided, try to get from user profile store
    let profileCriteria = criteria;
    if (!profileCriteria) {
      let currentProfile: any = null;
      userProfile.subscribe(profile => currentProfile = profile)();
      
      if (currentProfile) {
        profileCriteria = {
          targetIndustry: currentProfile.target_industry,
          experienceLevel: currentProfile.experience_level,
          jobTypes: currentProfile.target_job_titles?.split(',').map((t: string) => t.trim()),
          careerStage: currentProfile.career_stage,
          skills: currentProfile.key_skills?.split(',').map((s: string) => s.trim()),
          educationLevel: currentProfile.education_level,
          workType: currentProfile.preferred_work_type
        };
      }
    }
    
    // If still no criteria, return popular templates
    if (!profileCriteria) {
      return allQuickstarters
        .sort((a, b) => (b.quickstarter?.metadata.popularityScore || 0) - (a.quickstarter?.metadata.popularityScore || 0))
        .slice(0, 6);
    }
    
    return allQuickstarters
      .map(template => ({
        template,
        score: this.calculateRelevanceScore(template, profileCriteria)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8) // Increased to 8 recommendations
      .map(item => item.template);
  },

  /**
   * Get personalized recommendations for current user
   */
  getPersonalizedRecommendations(): EnhancedTemplate[] {
    return this.getRecommendations(); // Uses profile store automatically
  },
  
  /**
   * Calculate relevance score for recommendations
   */
  calculateRelevanceScore(template: EnhancedTemplate, criteria: any): number {
    if (!template.quickstarter) return 0;
    
    let score = 0;
    const quickstarter = template.quickstarter;
    
    // Industry match (high weight - 40 points)
    if (criteria.targetIndustry && criteria.targetIndustry === quickstarter.metadata.industry) {
      score += 40;
    } else if (criteria.targetIndustry && quickstarter.metadata.industry === 'general') {
      score += 10; // General templates are somewhat relevant
    }
    
    // Experience level match (high weight - 30 points)
    if (criteria.experienceLevel && criteria.experienceLevel === quickstarter.metadata.experienceLevel) {
      score += 30;
    } else if (criteria.experienceLevel && quickstarter.metadata.experienceLevel) {
      // Partial match for adjacent experience levels
      const experienceLevels = ['student', 'entry', 'junior', 'mid', 'senior', 'executive'];
      const userIndex = experienceLevels.indexOf(criteria.experienceLevel);
      const templateIndex = experienceLevels.indexOf(quickstarter.metadata.experienceLevel);
      
      if (userIndex !== -1 && templateIndex !== -1) {
        const difference = Math.abs(userIndex - templateIndex);
        if (difference === 1) score += 15; // Adjacent level
        else if (difference === 2) score += 5; // Close level
      }
    }
    
    // Job type match (very high weight - up to 50 points)
    if (criteria.jobTypes && criteria.jobTypes.length > 0) {
      const matchingJobs = quickstarter.metadata.targetJobs.filter(job =>
        criteria.jobTypes.some((userJob: string) => 
          job.toLowerCase().includes(userJob.toLowerCase()) ||
          userJob.toLowerCase().includes(job.toLowerCase()) ||
          this.calculateStringSimilarity(job.toLowerCase(), userJob.toLowerCase()) > 0.6
        )
      );
      score += Math.min(matchingJobs.length * 15, 50); // Cap at 50 points
    }
    
    // Career stage match (medium weight - 20 points)
    if (criteria.careerStage && quickstarter.metadata.careerStage === criteria.careerStage) {
      score += 20;
    }
    
    // Skills match (medium weight - up to 25 points)
    if (criteria.skills && criteria.skills.length > 0 && quickstarter.starterContent.skillSuggestions) {
      const matchingSkills = quickstarter.starterContent.skillSuggestions.filter(skill =>
        criteria.skills.some((userSkill: string) =>
          skill.name.toLowerCase().includes(userSkill.toLowerCase()) ||
          userSkill.toLowerCase().includes(skill.name.toLowerCase())
        )
      );
      score += Math.min(matchingSkills.length * 5, 25); // Cap at 25 points
    }
    
    // Education level relevance (low weight - 10 points)
    if (criteria.educationLevel && quickstarter.metadata.educationRequirement) {
      if (criteria.educationLevel === quickstarter.metadata.educationRequirement) {
        score += 10;
      }
    }
    
    // Work type preference (low weight - 5 points)
    if (criteria.workType && quickstarter.metadata.workTypes) {
      const hasMatchingWorkType = criteria.workType.some((type: string) =>
        quickstarter.metadata.workTypes.includes(type)
      );
      if (hasMatchingWorkType) score += 5;
    }
    
    // Template quality factors (up to 15 points)
    score += (quickstarter.metadata.successRate || 0) / 10; // Success rate bonus
    score += (quickstarter.metadata.popularityScore || 0) / 20; // Popularity bonus
    
    // Demand level bonus (up to 10 points)
    if (quickstarter.metadata.demandLevel === 'high') score += 10;
    else if (quickstarter.metadata.demandLevel === 'medium') score += 5;
    
    return Math.max(0, score); // Ensure non-negative score
  },

  /**
   * Calculate string similarity using Levenshtein distance
   */
  calculateStringSimilarity(str1: string, str2: string): number {
    const len1 = str1.length;
    const len2 = str2.length;
    
    if (len1 === 0) return len2 === 0 ? 1 : 0;
    if (len2 === 0) return 0;
    
    const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(null));
    
    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;
    
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    
    const maxLen = Math.max(len1, len2);
    return (maxLen - matrix[len1][len2]) / maxLen;
  },
  
  /**
   * Test function to verify enhanced template loading
   */
  async testEnhancedTemplate(slug: string = 'retail-rockstar'): Promise<void> {
    console.log(`🧪 Testing enhanced template: ${slug}`);
    
    try {
      const templates = await this.loadTemplates();
      const testTemplate = templates.find(t => t.name.toLowerCase().includes('retail') || 
                                              t.description?.toLowerCase().includes('retail'));
      
      if (!testTemplate) {
        console.log('⚠️ Enhanced template not found. Make sure to run the update script first.');
        return;
      }
      
      console.log('✅ Enhanced template found:', testTemplate.name);
      
      if (testTemplate.quickstarter) {
        console.log('✅ Quickstarter data loaded successfully');
        console.log(`   Target Jobs: ${testTemplate.quickstarter.metadata.targetJobs.join(', ')}`);
        console.log(`   Summary Templates: ${testTemplate.quickstarter.starterContent.summaryTemplates.length}`);
        console.log(`   Skill Suggestions: ${testTemplate.quickstarter.starterContent.skillSuggestions.length}`);
        console.log(`   Getting Started Tips: ${testTemplate.quickstarter.guidance.gettingStarted.length}`);
      } else {
        console.log('⚠️ No quickstarter data found. Template may not be enhanced yet.');
      }
      
    } catch (error) {
      console.error('❌ Test failed:', error);
    }
  }
};