// Template store for managing resume templates
import { writable, derived } from 'svelte/store';
import type { ResumeTemplate, TemplateFilters } from '$lib/types/resume';
import { pb } from '$lib/pocketbase';

// Template stores
export const templates = writable<ResumeTemplate[]>([]);
export const featuredTemplates = writable<ResumeTemplate[]>([]);
export const userTemplates = writable<ResumeTemplate[]>([]);
export const isLoadingTemplates = writable(false);

// Filter and search
export const templateFilters = writable<TemplateFilters>({
  sortBy: 'usageCount',
  sortOrder: 'desc'
});

// Derived stores
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
    
    if ($filters.isPopular !== undefined) {
      filtered = filtered.filter(t => t.isPopular === $filters.isPopular);
    }
    
    if ($filters.tags && $filters.tags.length > 0) {
      filtered = filtered.filter(t => 
        $filters.tags!.some(tag => t.tags.includes(tag))
      );
    }
    
    if ($filters.rating) {
      filtered = filtered.filter(t => t.rating >= $filters.rating!);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[$filters.sortBy];
      const bValue = b[$filters.sortBy];
      
      if ($filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return filtered;
  }
);

// Template operations
export const templateStore = {
  // Load all templates
  async loadTemplates(): Promise<ResumeTemplate[]> {
    isLoadingTemplates.set(true);
    try {
      const records = await pb.collection('resume_templates').getFullList({
        sort: '-usageCount',
        expand: 'createdBy'
      });
      
      const templateList = records.map(mapRecordToTemplate);
      templates.set(templateList);
      
      // Set featured templates (popular and highly rated)
      const featured = templateList.filter(t => t.isPopular || t.rating >= 4.5).slice(0, 6);
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
      const records = await pb.collection('resume_templates').getFullList({
        sort: '-created',
        filter: `createdBy = "${pb.authStore.model?.id}"`
      });
      
      const templateList = records.map(mapRecordToTemplate);
      userTemplates.set(templateList);
      return templateList;
    } catch (error) {
      console.error('Failed to load user templates:', error);
      throw error;
    }
  },
  
  // Get template by ID
  async getTemplate(id: string): Promise<ResumeTemplate> {
    try {
      const record = await pb.collection('resume_templates').getOne(id, {
        expand: 'createdBy'
      });
      return mapRecordToTemplate(record);
    } catch (error) {
      console.error('Failed to get template:', error);
      throw error;
    }
  },
  
  // Create new template
  async createTemplate(templateData: Partial<ResumeTemplate>): Promise<ResumeTemplate> {
    try {
      const record = await pb.collection('resume_templates').create({
        ...templateData,
        createdBy: pb.authStore.model?.id,
        usageCount: 0,
        rating: 0
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
      const record = await pb.collection('resume_templates').update(id, updates);
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
      await pb.collection('resume_templates').delete(id);
      
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
    try {
      const template = await templateStore.getTemplate(id);
      await pb.collection('resume_templates').update(id, {
        usageCount: template.usageCount + 1
      });
      
      // Update local store
      templates.update(list => 
        list.map(t => t.id === id ? { ...t, usageCount: t.usageCount + 1 } : t)
      );
    } catch (error) {
      console.error('Failed to increment usage:', error);
    }
  },
  
  // Rate template
  async rateTemplate(id: string, rating: number): Promise<void> {
    try {
      // In a real app, you'd calculate average rating from all user ratings
      await pb.collection('template_ratings').create({
        templateId: id,
        userId: pb.authStore.model?.id,
        rating
      });
      
      // For now, just update the template rating (simplified)
      const template = await templateStore.getTemplate(id);
      const newRating = (template.rating + rating) / 2; // Simplified calculation
      
      await pb.collection('resume_templates').update(id, {
        rating: newRating
      });
      
      // Update local store
      templates.update(list => 
        list.map(t => t.id === id ? { ...t, rating: newRating } : t)
      );
    } catch (error) {
      console.error('Failed to rate template:', error);
      throw error;
    }
  },
  
  // Search templates
  async searchTemplates(query: string): Promise<ResumeTemplate[]> {
    try {
      const records = await pb.collection('resume_templates').getFullList({
        filter: `name ~ "${query}" || description ~ "${query}" || tags ~ "${query}"`,
        sort: '-usageCount'
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
      'two-column',
      'single-page',
      'multi-page',
      'ats-friendly'
    ];
  }
};

// Helper function to map PocketBase record to ResumeTemplate
function mapRecordToTemplate(record: any): ResumeTemplate {
  return {
    id: record.id,
    name: record.name,
    description: record.description,
    category: record.category,
    thumbnail: record.thumbnail,
    previewImages: record.previewImages || [],
    settings: record.settings || getDefaultTemplateSettings(),
    sections: record.sections || getDefaultTemplateSections(),
    isPremium: record.isPremium || false,
    isPopular: record.isPopular || false,
    createdBy: record.createdBy,
    createdAt: record.created,
    usageCount: record.usageCount || 0,
    rating: record.rating || 0,
    tags: record.tags || []
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