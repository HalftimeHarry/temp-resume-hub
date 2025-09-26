// Template store for managing resume templates
import { writable, derived } from 'svelte/store';
import type { ResumeTemplate, TemplateFilters } from '$lib/types/resume';
import { pb } from '$lib/pocketbase';
import { userProfile } from './userProfile';
import { templatePreferences, userSettingsStore } from './userSettings';

// Template stores
export const templates = writable<ResumeTemplate[]>([]);
export const featuredTemplates = writable<ResumeTemplate[]>([]);
export const userTemplates = writable<ResumeTemplate[]>([]);
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
  
  // Industry matching (if template has targeting data)
  if (template.config?.targeting?.industries?.includes(profile.target_industry)) {
    score += 40;
  }
  
  // Experience level matching
  if (template.config?.targeting?.experience_levels?.includes(profile.experience_level)) {
    score += 35;
  }
  
  // Job type matching
  if (profile.target_job_titles && template.config?.targeting?.job_types) {
    const jobTitles = profile.target_job_titles.toLowerCase();
    const hasJobMatch = template.config.targeting.job_types.some((jobType: string) =>
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
  // Load all templates
  async loadTemplates(): Promise<ResumeTemplate[]> {
    isLoadingTemplates.set(true);
    try {
      const records = await pb.collection('templates').getFullList({
                    sort: '-created'
                  });
      
      const templateList = records.map(mapRecordToTemplate);
      templates.set(templateList);
      
      // Set featured templates (popular and highly rated)
      const featured = templateList.slice(0, 6);
      featuredTemplates.set(featured);
      
      return templateList;
    } catch (error) {
      console.error('Failed to load templates:', error);
      throw error;
    } finally {
      isLoadingTemplates.set(false);
    }
  },
  
  // Load user's custom templates
  async loadUserTemplates(): Promise<ResumeTemplate[]> {
    try {
      const records = await pb.collection('templates').getFullList({
                    sort: '-created'
                  });
      
      const templateList = records.map(mapRecordToTemplate);
      userTemplates.set(templateList);
      return templateList;
    } catch (error) {
      console.error('Failed to load user templates:', error);
      throw error;
    }
  },
  
  // Get template by ID with usage tracking
  async getTemplate(id: string, trackUsage: boolean = true): Promise<ResumeTemplate> {
    try {
      const record = await pb.collection('templates').getOne(id);
      const template = mapRecordToTemplate(record);
      
      // Track template usage if enabled
      if (trackUsage) {
        await userSettingsStore.trackTemplateUsage(id);
      }
      
      return template;
    } catch (error) {
      console.error('Failed to get template:', error);
      throw error;
    }
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
  async getPersonalizedRecommendations(): Promise<ResumeTemplate[]> {
    try {
      const allTemplates = await this.loadTemplates();
      // The recommendedTemplates derived store will handle the filtering
      return allTemplates.slice(0, 8); // Fallback to first 8 templates
    } catch (error) {
      console.error('Failed to get personalized recommendations:', error);
      return [];
    }
  },
  
  // Create new template
  async createTemplate(templateData: Partial<ResumeTemplate>): Promise<ResumeTemplate> {
    try {
      const record = await pb.collection('templates').create({
              ...templateData
            });
      
      const template = mapRecordToTemplate(record);
      
      // Update stores
      templates.update(list => [template, ...list]);
      userTemplates.update(list => [template, ...list]);
      
      return template;
    } catch (error) {
      console.error('Failed to create template:', error);
      throw error;
    }
  },
  
  // Update template
  async updateTemplate(id: string, updates: Partial<ResumeTemplate>): Promise<ResumeTemplate> {
    try {
      const record = await pb.collection('templates').update(id, updates);
      const template = mapRecordToTemplate(record);
      
      // Update stores
      templates.update(list => 
        list.map(t => t.id === id ? template : t)
      );
      userTemplates.update(list => 
        list.map(t => t.id === id ? template : t)
      );
      
      return template;
    } catch (error) {
      console.error('Failed to update template:', error);
      throw error;
    }
  },
  
  // Delete template
  async deleteTemplate(id: string): Promise<void> {
    try {
      await pb.collection('templates').delete(id);
      
      // Update stores
      templates.update(list => list.filter(t => t.id !== id));
      userTemplates.update(list => list.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete template:', error);
      throw error;
    }
  },
  
  // Increment usage count
  async incrementUsage(id: string): Promise<void> {
    // Since there's no usageCount field in the templates collection, we can't increment it
    // This function is kept for compatibility but doesn't perform any action
    console.warn('incrementUsage called but usageCount field does not exist in templates collection');
  },
  
  // Rate template
  async rateTemplate(id: string, rating: number): Promise<void> {
    // Since there's no rating field in the templates collection and no template_ratings collection,
    // we can't rate templates. This function is kept for compatibility but doesn't perform any action
    console.warn('rateTemplate called but rating field does not exist in templates collection');
  },
  
  // Search templates
  async searchTemplates(query: string): Promise<ResumeTemplate[]> {
    try {
      const records = await pb.collection('templates').getFullList({
                    filter: `name ~ "${query}" || description ~ "${query}"`,
                    sort: '-created'
                  });
      
      return records.map(mapRecordToTemplate);
    } catch (error) {
      console.error('Failed to search templates:', error);
      throw error;
    }
  },
  
  // Get template categories
  getCategories(): string[] {
    return [
      'Modern',
      'Classic',
      'Creative',
      'Professional',
      'Minimalist',
      'Academic',
      'Technical',
      'Executive',
      'Entry Level',
      'Industry Specific'
    ];
  },
  
  // Get popular tags
  getPopularTags(): string[] {
    return [
      'clean',
      'modern',
      'professional',
      'creative',
      'minimalist',
      'colorful',
      'tech',
      'business',
      'academic',
      'executive',
      'entry-level',
      'first-job',
      'teen',
      'student',
      'beginner',
      'two-column',
      'single-page',
      'multi-page',
      'ats-friendly'
    ];
  }
};

// Helper function to map PocketBase record to ResumeTemplate
function mapRecordToTemplate(record: any): ResumeTemplate {
  const cfg = record?.config || {};
  const settings = cfg.settings || cfg || getDefaultTemplateSettings();
  const starterData = cfg.starterData || undefined;
  const styleConfig = cfg.styleConfig || undefined;
  const styles = cfg.styles || undefined;

  // Fallback thumbnail from static assets if PB image missing
  const slug = (record.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const staticThumb = `/templates/${slug}.svg`;

  // Normalize preview images from PocketBase: support preview_images[] or multi-file preview_image
  let previewImages: string[] = [];
  if (Array.isArray(record.preview_images)) {
    previewImages = record.preview_images.map((img: string) => pb.files.getURL(record, img));
  } else if (Array.isArray(record.preview_image)) {
    previewImages = record.preview_image.map((img: string) => pb.files.getURL(record, img));
  }

  const thumbnail = previewImages.length > 0
    ? previewImages[0]
    : (typeof record.preview_image === 'string' && record.preview_image
        ? pb.files.getURL(record, record.preview_image)
        : staticThumb);

  return {
    id: record.id,
    name: record.name,
    description: record.description,
    category: record.category,
    thumbnail,
    previewImages,
    settings,
    sections: [],
    starterData,
    styleConfig,
    styles,
    isPremium: record.is_premium || false,
    isPopular: false,
    createdBy: '',
    createdAt: record.created,
    usageCount: 0,
    rating: 0,
    tags: []
  };
}

// Default template settings
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