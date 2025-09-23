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
export const templateFilters = writable<Omit<TemplateFilters, 'isPopular' | 'tags' | 'rating' | 'usageCount' | 'sortBy'> & { sortBy: 'name' | 'createdAt' }>({
  category: undefined,
  isPremium: undefined,
  sortBy: 'createdAt',
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
  
  // Get template by ID
  async getTemplate(id: string): Promise<ResumeTemplate> {
    try {
      const record = await pb.collection('templates').getOne(id);
      return mapRecordToTemplate(record);
    } catch (error) {
      console.error('Failed to get template:', error);
      throw error;
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
    previewImages = record.preview_images.map((img: string) => pb.getFileUrl(record, img));
  } else if (Array.isArray(record.preview_image)) {
    previewImages = record.preview_image.map((img: string) => pb.getFileUrl(record, img));
  }

  const thumbnail = previewImages.length > 0
    ? previewImages[0]
    : (typeof record.preview_image === 'string' && record.preview_image
        ? pb.getFileUrl(record, record.preview_image)
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