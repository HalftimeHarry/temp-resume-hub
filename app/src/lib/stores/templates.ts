// Template store for managing resume templates (client-side only)
import { writable, derived } from 'svelte/store';
import type { ResumeTemplate, TemplateFilters } from '$lib/types/resume';
import { userProfile } from './userProfile';
import { templatePreferences, userSettingsStore } from './userSettings';

// Client-side template support
import { 
  getClientTemplatesAsResumeTemplates, 
  getClientTemplateAsResumeTemplate
} from '$lib/templates';
import type { ExtendedResumeTemplate } from '$lib/templates';

// Template stores
export const templates = writable<ExtendedResumeTemplate[]>([]);
export const featuredTemplates = writable<ExtendedResumeTemplate[]>([]);
export const isLoadingTemplates = writable(false);

// Filter and search
export const templateFilters = writable<Omit<TemplateFilters, 'isPopular' | 'tags' | 'rating' | 'usageCount' | 'sortBy'> & { sortBy: 'name' | 'createdAt' }>({
  category: undefined,
  isPremium: undefined,
  sortBy: 'createdAt',
  sortOrder: 'desc'
});

// Enhanced derived stores with profile and settings integration
export const filteredTemplates = derived(
  [templates, templateFilters],
  ([$templates, $filters]) => {
      let filtered = [...$templates];
      
      // Apply filters
      if ($filters.category) {
        filtered = filtered.filter(t => t.category === $filters.category);
      }
      
      if ($filters.isPremium !== undefined) {
        filtered = filtered.filter(t => t.isPremium === $filters.isPremium);
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        // Only sort by fields that exist in the templates collection
        let aValue: any;
        let bValue: any;
        
        switch ($filters.sortBy) {
          case 'name':
            aValue = a.name;
            bValue = b.name;
            break;
          case 'createdAt':
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          default:
            // Default to sorting by name if an invalid sortBy is provided
            aValue = a.name;
            bValue = b.name;
            break;
        }
        
        if ($filters.sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
      
      return filtered;
    }
);

// Profile-based recommended templates
export const recommendedTemplates = derived(
  [templates, userProfile, templatePreferences],
  ([$templates, $profile, $preferences]) => {
    if (!$profile || !$preferences?.auto_recommend) {
      return $templates.slice(0, 6); // Return first 6 if no profile or auto-recommend disabled
    }
    
    return getRecommendedTemplates($templates, $profile, $preferences);
  }
);

// Favorite templates
export const favoriteTemplates = derived(
  [templates, templatePreferences],
  ([$templates, $preferences]) => {
    if (!$preferences?.favorite_templates?.length) {
      return [];
    }
    
    return $templates.filter(template => 
      $preferences.favorite_templates.includes(template.id)
    );
  }
);

// Recently used templates
export const recentTemplates = derived(
  [templates, templatePreferences],
  ([$templates, $preferences]) => {
    if (!$preferences?.template_usage_history) {
      return [];
    }
    
    const usageHistory = $preferences.template_usage_history;
    const recentTemplateIds = Object.entries(usageHistory)
      .sort(([,a], [,b]) => b - a) // Sort by usage count
      .slice(0, 5) // Get top 5
      .map(([id]) => id);
    
    return $templates.filter(template => 
      recentTemplateIds.includes(template.id)
    );
  }
);

// Template recommendation algorithm
function getRecommendedTemplates(templates: ResumeTemplate[], profile: any, preferences: any): ResumeTemplate[] {
  if (!templates.length) return [];
  
  // Score each template based on profile match
  const scoredTemplates = templates.map(template => ({
    template,
    score: calculateTemplateScore(template, profile, preferences)
  }));
  
  // Sort by score (highest first) and return top templates
  return scoredTemplates
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(item => item.template);
}

function calculateTemplateScore(template: ResumeTemplate, profile: any, preferences: any): number {
  let score = 0;
  
  // Base score for all templates
  score += 10;
  
  // Category preference match
  if (preferences.preferred_categories?.includes(template.category)) {
    score += 30;
  }
  
  // Usage history bonus
  const usageCount = preferences.template_usage_history?.[template.id] || 0;
  score += Math.min(usageCount * 5, 20); // Max 20 points for usage
  
  // Favorite bonus
  if (preferences.favorite_templates?.includes(template.id)) {
    score += 25;
  }
  
  // Industry matching (support both config.targeting and direct targeting)
  const targeting = (template as ExtendedResumeTemplate).targeting || template.config?.targeting;
  if (targeting?.industries?.includes(profile.target_industry)) {
    score += 40;
  }
  
  // Experience level matching
  if (targeting?.experience_levels?.includes(profile.experience_level)) {
    score += 35;
  }
  
  // Job type matching
  if (profile.target_job_titles && targeting?.job_types) {
    const jobTitles = profile.target_job_titles.toLowerCase();
    const hasJobMatch = targeting.job_types.some((jobType: string) =>
      jobTitles.includes(jobType.toLowerCase())
    );
    if (hasJobMatch) {
      score += 30;
    }
  }
  
  // Premium template handling
  if (template.isPremium && !preferences.show_premium_templates) {
    score -= 50; // Reduce score for premium if user doesn't want to see them
  }
  
  // Recency bonus for newer templates
  const templateAge = Date.now() - new Date(template.createdAt).getTime();
  const daysSinceCreated = templateAge / (1000 * 60 * 60 * 24);
  if (daysSinceCreated < 30) {
    score += 15; // Bonus for templates created in last 30 days
  }
  
  return Math.max(score, 0); // Ensure non-negative score
}

// Template operations
export const templateStore = {
  // Load all templates (client-side only)
  loadTemplates(): ExtendedResumeTemplate[] {
    isLoadingTemplates.set(true);
    try {
      const templateList = getClientTemplatesAsResumeTemplates();
      templates.set(templateList);
      
      // Set featured templates (first 6)
      featuredTemplates.set(templateList.slice(0, 6));
      
      return templateList;
    } finally {
      isLoadingTemplates.set(false);
    }
  },
  
  // Get template by ID with usage tracking
  async getTemplate(id: string, trackUsage: boolean = true): Promise<ExtendedResumeTemplate> {
    const template = getClientTemplateAsResumeTemplate(id);
    if (!template) {
      throw new Error(`Template not found: ${id}`);
    }
    
    // Track template usage if enabled
    if (trackUsage) {
      await userSettingsStore.trackTemplateUsage(id);
    }
    
    return template;
  },
  
  // Toggle template favorite status
  async toggleFavorite(templateId: string): Promise<boolean> {
    try {
      return await userSettingsStore.toggleTemplateFavorite(templateId);
    } catch (error) {
      console.error('Failed to toggle template favorite:', error);
      return false;
    }
  },
  
  // Get personalized template recommendations
  getPersonalizedRecommendations(): ExtendedResumeTemplate[] {
    const allTemplates = this.loadTemplates();
    // The recommendedTemplates derived store will handle the filtering
    return allTemplates.slice(0, 8); // Fallback to first 8 templates
  },
  
  // Search templates (client-side only)
  searchTemplates(query: string): ExtendedResumeTemplate[] {
    const allTemplates = getClientTemplatesAsResumeTemplates();
    const lowerQuery = query.toLowerCase();
    
    return allTemplates.filter(template =>
      template.name.toLowerCase().includes(lowerQuery) ||
      template.description.toLowerCase().includes(lowerQuery) ||
      template.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  },
  
  // Get template categories (client-side only)
  getCategories(): string[] {
    const clientCategories = getClientTemplatesAsResumeTemplates().map(t => t.category);
    // Deduplicate and sort
    return [...new Set(clientCategories)].sort();
  },
  
  // Get popular tags (client-side only)
  getPopularTags(): string[] {
    const clientTags = getClientTemplatesAsResumeTemplates().flatMap(t => t.tags || []);
    // Deduplicate and sort
    return [...new Set(clientTags)].sort();
  }
};

// Default template settings (kept for backward compatibility)
function getDefaultTemplateSettings() {
  return {
    template: 'modern',
    colorScheme: 'blue',
    fontSize: 'medium',
    spacing: 'normal',
    showProfileImage: false,
    sectionOrder: ['experience', 'education', 'skills']
  };
}

// Default template sections
function getDefaultTemplateSections() {
  return [
    {
      id: 'experience',
      type: 'experience',
      title: 'Work Experience',
      visible: true,
      order: 0
    },
    {
      id: 'education',
      type: 'education',
      title: 'Education',
      visible: true,
      order: 1
    },
    {
      id: 'skills',
      type: 'skills',
      title: 'Skills',
      visible: true,
      order: 2
    }
  ];
}