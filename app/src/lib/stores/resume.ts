// Resume store for state management
import { writable, derived, get } from 'svelte/store';
import type { Resume, EditorState, FormState, ResumeSection, ProfileSnapshot, AIInsights, SuccessMetrics, FeedbackData, TemplateCustomizations } from '$lib/types/resume';
import { pb } from '$lib/pocketbase';
import { generateId, debounce, generateSlug } from '$lib/utils';
import { userProfile } from './userProfile';
import { currentUser } from './auth';

// Current resume being edited
export const currentResume = writable<Resume | null>(null);

// Editor state
export const editorState = writable<EditorState>({
  activeSection: null,
  activeItem: null,
  isEditing: false,
  hasUnsavedChanges: false,
  lastSaved: null,
  autoSaveEnabled: true
});

// Form validation state
export const formState = writable<FormState>({
  isValid: true,
  errors: [],
  touched: {},
  isDirty: false
});

// Loading states
export const isLoading = writable(false);
export const isSaving = writable(false);

// User's resumes list
export const userResumes = writable<Resume[]>([]);

// Derived stores
export const hasUnsavedChanges = derived(
  editorState,
  ($editorState) => $editorState.hasUnsavedChanges
);

export const canSave = derived(
  [formState, isSaving],
  ([$formState, $isSaving]) => $formState.isValid && !$isSaving
);

// Resume operations
export const resumeStore = {
  // Create new resume
  async create(title: string, templateId?: string): Promise<Resume> {
    isLoading.set(true);
    try {
      const profile = get(userProfile);
      const user = get(currentUser);
      
      // Create profile snapshot if profile exists
      const profileSnapshot: ProfileSnapshot | undefined = profile ? {
        target_industry: profile.target_industry,
        experience_level: profile.experience_level,
        target_job_titles: profile.target_job_titles,
        key_skills: profile.key_skills,
        location: profile.location,
        snapshot_date: new Date().toISOString()
      } : undefined;
      
      // Generate initial tags from profile
      const tags = generateInitialTags(profile, title);
      
      const newResume: Partial<Resume> = {
        title,
        user: user?.id,
        content: {
          personalInfo: {
            fullName: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '',
            email: user?.email || '',
            phone: profile?.phone || '',
            location: profile?.location || '',
            linkedin: profile?.linkedin_url || '',
            website: profile?.portfolio_url || ''
          },
          sections: getDefaultSections(),
          settings: getDefaultSettings(templateId)
        },
        template: templateId,
        is_public: false,
        slug: generateSlug(title),
        
        // Enhanced fields
        download_count: 0,
        share_count: 0,
        view_count: 0,
        profile_snapshot: profileSnapshot,
        target_job: profile?.target_job_titles?.split(',')[0]?.trim(),
        industry_focus: profile?.target_industry,
        experience_level: profile?.experience_level,
        optimization_score: 0,
        completion_percentage: 0,
        personalization_level: profile ? 'enhanced' : 'basic',
        ats_score: 0,
        status: 'draft',
        version: 1,
        tags,
        ai_insights: {
          suggestions: [],
          improvements: [],
          keywords: [],
          ats_recommendations: [],
          industry_tips: [],
          last_analyzed: new Date().toISOString()
        },
        success_metrics: {
          applications_sent: 0,
          responses_received: 0,
          interviews_scheduled: 0,
          offers_received: 0,
          success_rate: 0
        },
        template_customizations: {
          sections_added: [],
          sections_removed: [],
          sections_reordered: false,
          color_scheme_changed: false,
          layout_modifications: [],
          font_changes: false,
          spacing_adjustments: false
        }
      };

      const record = await pb.collection('resumes').create(newResume);
      const resume = mapRecordToResume(record);
      
      // Update user resumes list
      userResumes.update(resumes => [...resumes, resume]);
      
      currentResume.set(resume);
      editorState.update(state => ({
        ...state,
        hasUnsavedChanges: false,
        lastSaved: new Date().toISOString()
      }));

      return resume;
    } catch (error) {
      console.error('Failed to create resume:', error);
      throw error;
    } finally {
      isLoading.set(false);
    }
  },

  // Load resume by ID
  async load(id: string): Promise<Resume> {
    isLoading.set(true);
    try {
      const record = await pb.collection('resumes').getOne(id);
      const resume = mapRecordToResume(record);
      
      currentResume.set(resume);
      editorState.update(state => ({
        ...state,
        hasUnsavedChanges: false,
        lastSaved: resume.updated
      }));

      return resume;
    } catch (error) {
      console.error('Failed to load resume:', error);
      throw error;
    } finally {
      isLoading.set(false);
    }
  },

  // Save current resume
  async save(): Promise<void> {
    const resume = get(currentResume);
    if (!resume || !get(canSave)) return;

    isSaving.set(true);
    try {
      const updateData = {
        ...resume,
        updated: new Date().toISOString()
      };

      const record = await pb.collection('resumes').update(resume.id, updateData);
      const updatedResume = mapRecordToResume(record);
      
      currentResume.set(updatedResume);
      editorState.update(state => ({
        ...state,
        hasUnsavedChanges: false,
        lastSaved: updatedResume.updated
      }));
    } catch (error) {
      console.error('Failed to save resume:', error);
      throw error;
    } finally {
      isSaving.set(false);
    }
  },

  // Auto-save with debouncing
  autoSave: debounce(async () => {
    const state = get(editorState);
    if (state.autoSaveEnabled && state.hasUnsavedChanges) {
      await resumeStore.save();
    }
  }, 2000),

  // Update resume data
  update(updates: Partial<Resume>): void {
    currentResume.update(resume => {
      if (!resume) return resume;
      
      // If title is being updated, also update the slug
      let finalUpdates = { ...updates };
      if (updates.title && typeof updates.title === 'string') {
        finalUpdates.slug = generateSlug(updates.title);
      }
      
      const updated = { ...resume, ...finalUpdates };
      
      editorState.update(state => ({
        ...state,
        hasUnsavedChanges: true
      }));

      // Trigger auto-save
      resumeStore.autoSave();
      
      return updated;
    });
  },

  // Update personal info
  updatePersonalInfo(info: any): void {
    currentResume.update(resume => {
      if (!resume) return resume;
      
      return {
        ...resume,
        content: {
          ...resume.content,
          personalInfo: { ...resume.content?.personalInfo, ...info }
        }
      };
    });
    
    editorState.update(state => ({ ...state, hasUnsavedChanges: true }));
    resumeStore.autoSave();
  },

  // Add section
  addSection(type: ResumeSection['type'], title?: string): void {
    currentResume.update(resume => {
      if (!resume) return resume;
      
      const newSection: ResumeSection = {
        id: generateId(),
        type,
        title: title || getDefaultSectionTitle(type),
        visible: true,
        order: resume.content?.sections?.length || 0,
        data: []
      };
      
      return {
        ...resume,
        content: {
          ...resume.content,
          sections: [...(resume.content?.sections || []), newSection]
        }
      };
    });
    
    editorState.update(state => ({ ...state, hasUnsavedChanges: true }));
    resumeStore.autoSave();
  },

  // Update section
  updateSection(sectionId: string, updates: Partial<ResumeSection>): void {
    currentResume.update(resume => {
      if (!resume) return resume;
      
      return {
        ...resume,
        content: {
          ...resume.content,
          sections: (resume.content?.sections || []).map(section =>
            section.id === sectionId ? { ...section, ...updates } : section
          )
        }
      };
    });
    
    editorState.update(state => ({ ...state, hasUnsavedChanges: true }));
    resumeStore.autoSave();
  },

  // Remove section
  removeSection(sectionId: string): void {
    currentResume.update(resume => {
      if (!resume) return resume;
      
      return {
        ...resume,
        content: {
          ...resume.content,
          sections: (resume.content?.sections || []).filter(section => section.id !== sectionId)
        }
      };
    });
    
    editorState.update(state => ({ ...state, hasUnsavedChanges: true }));
    resumeStore.autoSave();
  },

  // Reorder sections
  reorderSections(sectionIds: string[]): void {
    currentResume.update(resume => {
      if (!resume) return resume;
      
      const sectionsMap = new Map((resume.content?.sections || []).map(s => [s.id, s]));
      const reorderedSections = sectionIds
        .map(id => sectionsMap.get(id))
        .filter(Boolean)
        .map((section, index) => ({ ...section!, order: index }));
      
      return {
        ...resume,
        content: {
          ...resume.content,
          sections: reorderedSections
        }
      };
    });
    
    editorState.update(state => ({ ...state, hasUnsavedChanges: true }));
    resumeStore.autoSave();
  },

  // Add item to section
  addSectionItem(sectionId: string, item: any): void {
    currentResume.update(resume => {
      if (!resume) return resume;
      
      return {
        ...resume,
        content: {
          ...resume.content,
          sections: (resume.content?.sections || []).map(section =>
            section.id === sectionId
              ? { ...section, data: [...section.data, { ...item, id: generateId() }] }
              : section
          )
        }
      };
    });
    
    editorState.update(state => ({ ...state, hasUnsavedChanges: true }));
    resumeStore.autoSave();
  },

  // Update section item
  updateSectionItem(sectionId: string, itemId: string, updates: any): void {
    currentResume.update(resume => {
      if (!resume) return resume;
      
      return {
        ...resume,
        content: {
          ...resume.content,
          sections: (resume.content?.sections || []).map(section =>
            section.id === sectionId
              ? {
                  ...section,
                  data: section.data.map(item =>
                    item.id === itemId ? { ...item, ...updates } : item
                  )
                }
              : section
          )
        }
      };
    });
    
    editorState.update(state => ({ ...state, hasUnsavedChanges: true }));
    resumeStore.autoSave();
  },

  // Remove section item
  removeSectionItem(sectionId: string, itemId: string): void {
    currentResume.update(resume => {
      if (!resume) return resume;
      
      return {
        ...resume,
        content: {
          ...resume.content,
          sections: (resume.content?.sections || []).map(section =>
            section.id === sectionId
              ? { ...section, data: section.data.filter(item => item.id !== itemId) }
              : section
          )
        }
      };
    });
    
    editorState.update(state => ({ ...state, hasUnsavedChanges: true }));
    resumeStore.autoSave();
  },

  // Load user's resumes
  async loadUserResumes(): Promise<Resume[]> {
    try {
      const records = await pb.collection('resumes').getFullList({
        sort: '-updated',
        filter: `user = "${pb.authStore.model?.id}"`
      });
      
      const resumes = records.map(mapRecordToResume);
      userResumes.set(resumes);
      return resumes;
    } catch (error) {
      console.error('Failed to load user resumes:', error);
      throw error;
    }
  },

  // Delete resume
  async delete(id: string): Promise<void> {
    try {
      await pb.collection('resumes').delete(id);
      
      userResumes.update(resumes => resumes.filter(r => r.id !== id));
      
      const current = get(currentResume);
      if (current?.id === id) {
        currentResume.set(null);
        editorState.set({
          activeSection: null,
          activeItem: null,
          isEditing: false,
          hasUnsavedChanges: false,
          lastSaved: null,
          autoSaveEnabled: true
        });
      }
    } catch (error) {
      console.error('Failed to delete resume:', error);
      throw error;
    }
  },

  // ENHANCED FUNCTIONS FOR NEW FIELDS

  // Track download
  async trackDownload(resumeId: string): Promise<boolean> {
    try {
      const resume = await pb.collection('resumes').getOne(resumeId);
      const updatedResume = await pb.collection('resumes').update(resumeId, {
        download_count: (resume.download_count || 0) + 1,
        last_downloaded: new Date().toISOString()
      });
      
      // Update local stores
      userResumes.update(resumes => 
        resumes.map(r => r.id === resumeId ? mapRecordToResume(updatedResume) : r)
      );
      
      if (get(currentResume)?.id === resumeId) {
        currentResume.set(mapRecordToResume(updatedResume));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to track download:', error);
      return false;
    }
  },
  
  // Track share
  async trackShare(resumeId: string): Promise<boolean> {
    try {
      const resume = await pb.collection('resumes').getOne(resumeId);
      const updatedResume = await pb.collection('resumes').update(resumeId, {
        share_count: (resume.share_count || 0) + 1,
        last_shared: new Date().toISOString()
      });
      
      // Update local stores
      userResumes.update(resumes => 
        resumes.map(r => r.id === resumeId ? mapRecordToResume(updatedResume) : r)
      );
      
      if (get(currentResume)?.id === resumeId) {
        currentResume.set(mapRecordToResume(updatedResume));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to track share:', error);
      return false;
    }
  },
  
  // Update resume status
  async updateStatus(resumeId: string, status: 'draft' | 'active' | 'archived' | 'template'): Promise<boolean> {
    try {
      const updatedResume = await pb.collection('resumes').update(resumeId, {
        status,
        updated: new Date().toISOString()
      });
      
      // Update local stores
      userResumes.update(resumes => 
        resumes.map(r => r.id === resumeId ? mapRecordToResume(updatedResume) : r)
      );
      
      if (get(currentResume)?.id === resumeId) {
        currentResume.set(mapRecordToResume(updatedResume));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to update status:', error);
      return false;
    }
  },
  
  // Update optimization score
  async updateOptimizationScore(resumeId: string, score: number): Promise<boolean> {
    try {
      const updatedResume = await pb.collection('resumes').update(resumeId, {
        optimization_score: Math.max(0, Math.min(100, score)),
        updated: new Date().toISOString()
      });
      
      // Update local stores
      userResumes.update(resumes => 
        resumes.map(r => r.id === resumeId ? mapRecordToResume(updatedResume) : r)
      );
      
      if (get(currentResume)?.id === resumeId) {
        currentResume.set(mapRecordToResume(updatedResume));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to update optimization score:', error);
      return false;
    }
  },
  
  // Update completion percentage
  async updateCompletionPercentage(resumeId: string, percentage: number): Promise<boolean> {
    try {
      const updatedResume = await pb.collection('resumes').update(resumeId, {
        completion_percentage: Math.max(0, Math.min(100, percentage)),
        updated: new Date().toISOString()
      });
      
      // Update local stores
      userResumes.update(resumes => 
        resumes.map(r => r.id === resumeId ? mapRecordToResume(updatedResume) : r)
      );
      
      if (get(currentResume)?.id === resumeId) {
        currentResume.set(mapRecordToResume(updatedResume));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to update completion percentage:', error);
      return false;
    }
  },
  
  // Add tags to resume
  async addTags(resumeId: string, newTags: string[]): Promise<boolean> {
    try {
      const resume = await pb.collection('resumes').getOne(resumeId);
      const currentTags = resume.tags || [];
      const updatedTags = [...new Set([...currentTags, ...newTags])]; // Remove duplicates
      
      const updatedResume = await pb.collection('resumes').update(resumeId, {
        tags: updatedTags,
        updated: new Date().toISOString()
      });
      
      // Update local stores
      userResumes.update(resumes => 
        resumes.map(r => r.id === resumeId ? mapRecordToResume(updatedResume) : r)
      );
      
      if (get(currentResume)?.id === resumeId) {
        currentResume.set(mapRecordToResume(updatedResume));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to add tags:', error);
      return false;
    }
  },
  
  // Create new version of resume
  async createVersion(resumeId: string, title?: string): Promise<Resume | null> {
    try {
      const originalResume = await pb.collection('resumes').getOne(resumeId);
      
      const newResumeData = {
        ...originalResume,
        id: undefined, // Let PocketBase generate new ID
        title: title || `${originalResume.title} (v${(originalResume.version || 1) + 1})`,
        slug: generateSlug(title || `${originalResume.title}-v${(originalResume.version || 1) + 1}`),
        version: (originalResume.version || 1) + 1,
        status: 'draft',
        download_count: 0,
        share_count: 0,
        view_count: 0,
        created: undefined,
        updated: undefined
      };
      
      const newResume = await pb.collection('resumes').create(newResumeData);
      const mappedResume = mapRecordToResume(newResume);
      
      // Update local store
      userResumes.update(resumes => [...resumes, mappedResume]);
      
      return mappedResume;
    } catch (error) {
      console.error('Failed to create resume version:', error);
      return null;
    }
  },

  // Calculate and update completion percentage based on content
  async calculateAndUpdateCompletion(resumeId: string): Promise<number> {
    try {
      const resume = await pb.collection('resumes').getOne(resumeId);
      const percentage = calculateCompletionPercentage(resume.content);
      
      await this.updateCompletionPercentage(resumeId, percentage);
      return percentage;
    } catch (error) {
      console.error('Failed to calculate completion:', error);
      return 0;
    }
  },

  // Update ATS score
  async updateATSScore(resumeId: string, score: number): Promise<boolean> {
    try {
      const updatedResume = await pb.collection('resumes').update(resumeId, {
        ats_score: Math.max(0, Math.min(100, score)),
        updated: new Date().toISOString()
      });
      
      this.updateLocalStores(resumeId, updatedResume);
      return true;
    } catch (error) {
      console.error('Failed to update ATS score:', error);
      return false;
    }
  },

  // Update personalization level
  async updatePersonalizationLevel(resumeId: string, level: 'basic' | 'enhanced' | 'ai_optimized'): Promise<boolean> {
    try {
      const updatedResume = await pb.collection('resumes').update(resumeId, {
        personalization_level: level,
        updated: new Date().toISOString()
      });
      
      this.updateLocalStores(resumeId, updatedResume);
      return true;
    } catch (error) {
      console.error('Failed to update personalization level:', error);
      return false;
    }
  },

  // Update AI insights
  async updateAIInsights(resumeId: string, insights: Partial<AIInsights>): Promise<boolean> {
    try {
      const resume = await pb.collection('resumes').getOne(resumeId);
      const currentInsights = resume.ai_insights || {};
      
      const updatedInsights = {
        ...currentInsights,
        ...insights,
        last_analyzed: new Date().toISOString()
      };
      
      const updatedResume = await pb.collection('resumes').update(resumeId, {
        ai_insights: updatedInsights,
        updated: new Date().toISOString()
      });
      
      this.updateLocalStores(resumeId, updatedResume);
      return true;
    } catch (error) {
      console.error('Failed to update AI insights:', error);
      return false;
    }
  },

  // Update success metrics
  async updateSuccessMetrics(resumeId: string, metrics: Partial<SuccessMetrics>): Promise<boolean> {
    try {
      const resume = await pb.collection('resumes').getOne(resumeId);
      const currentMetrics = resume.success_metrics || {};
      
      const updatedMetrics = {
        ...currentMetrics,
        ...metrics
      };
      
      // Calculate success rate if we have the data
      if (updatedMetrics.applications_sent && updatedMetrics.applications_sent > 0) {
        const responses = updatedMetrics.responses_received || 0;
        updatedMetrics.success_rate = Math.round((responses / updatedMetrics.applications_sent) * 100);
      }
      
      const updatedResume = await pb.collection('resumes').update(resumeId, {
        success_metrics: updatedMetrics,
        updated: new Date().toISOString()
      });
      
      this.updateLocalStores(resumeId, updatedResume);
      return true;
    } catch (error) {
      console.error('Failed to update success metrics:', error);
      return false;
    }
  },

  // Update feedback data
  async updateFeedbackData(resumeId: string, feedback: Partial<FeedbackData>): Promise<boolean> {
    try {
      const updatedFeedback = {
        ...feedback,
        feedback_date: new Date().toISOString()
      };
      
      const updatedResume = await pb.collection('resumes').update(resumeId, {
        feedback_data: updatedFeedback,
        updated: new Date().toISOString()
      });
      
      this.updateLocalStores(resumeId, updatedResume);
      return true;
    } catch (error) {
      console.error('Failed to update feedback data:', error);
      return false;
    }
  },

  // Update template customizations
  async updateTemplateCustomizations(resumeId: string, customizations: Partial<TemplateCustomizations>): Promise<boolean> {
    try {
      const resume = await pb.collection('resumes').getOne(resumeId);
      const currentCustomizations = resume.template_customizations || {};
      
      const updatedCustomizations = {
        ...currentCustomizations,
        ...customizations
      };
      
      const updatedResume = await pb.collection('resumes').update(resumeId, {
        template_customizations: updatedCustomizations,
        updated: new Date().toISOString()
      });
      
      this.updateLocalStores(resumeId, updatedResume);
      return true;
    } catch (error) {
      console.error('Failed to update template customizations:', error);
      return false;
    }
  },

  // Helper function to update local stores
  updateLocalStores(resumeId: string, updatedRecord: any): void {
    const mappedResume = mapRecordToResume(updatedRecord);
    
    // Update user resumes list
    userResumes.update(resumes => 
      resumes.map(r => r.id === resumeId ? mappedResume : r)
    );
    
    // Update current resume if it's the one being edited
    if (get(currentResume)?.id === resumeId) {
      currentResume.set(mappedResume);
    }
  },

  // Get resume analytics summary
  getAnalyticsSummary(resume: Resume): any {
    return {
      engagement: {
        views: resume.view_count || 0,
        downloads: resume.download_count || 0,
        shares: resume.share_count || 0,
        last_activity: resume.last_viewed || resume.last_downloaded || resume.last_shared
      },
      quality: {
        completion: resume.completion_percentage || 0,
        optimization: resume.optimization_score || 0,
        ats_score: resume.ats_score || 0,
        personalization: resume.personalization_level || 'basic'
      },
      success: {
        applications: resume.success_metrics?.applications_sent || 0,
        responses: resume.success_metrics?.responses_received || 0,
        interviews: resume.success_metrics?.interviews_scheduled || 0,
        offers: resume.success_metrics?.offers_received || 0,
        success_rate: resume.success_metrics?.success_rate || 0
      },
      profile: {
        target_job: resume.target_job,
        target_company: resume.target_company,
        industry: resume.industry_focus,
        experience_level: resume.experience_level,
        tags: resume.tags || []
      }
    };
  }
};

// Helper functions
function mapRecordToResume(record: any): Resume {
  return {
    id: record.id,
    user: record.user,
    title: record.title,
    slug: record.slug,
    content: record.content || {},
    template: record.template,
    is_public: record.is_public || false,
    created: record.created,
    updated: record.updated,
    
    // Analytics & Tracking
    view_count: record.view_count || 0,
    last_viewed: record.last_viewed,
    download_count: record.download_count || 0,
    share_count: record.share_count || 0,
    last_downloaded: record.last_downloaded,
    last_shared: record.last_shared,
    
    // Profile Integration
    profile_snapshot: record.profile_snapshot,
    target_job: record.target_job,
    target_company: record.target_company,
    industry_focus: record.industry_focus,
    experience_level: record.experience_level,
    
    // Quality & Optimization
    optimization_score: record.optimization_score || 0,
    completion_percentage: record.completion_percentage || 0,
    personalization_level: record.personalization_level || 'basic',
    ats_score: record.ats_score || 0,
    
    // Organization & Management
    status: record.status || 'draft',
    version: record.version || 1,
    tags: record.tags || [],
    
    // AI & Intelligence
    ai_insights: record.ai_insights || {
      suggestions: [],
      improvements: [],
      keywords: [],
      ats_recommendations: [],
      industry_tips: []
    },
    success_metrics: record.success_metrics || {
      applications_sent: 0,
      responses_received: 0,
      interviews_scheduled: 0,
      offers_received: 0,
      success_rate: 0
    },
    feedback_data: record.feedback_data,
    template_customizations: record.template_customizations || {
      sections_added: [],
      sections_removed: [],
      sections_reordered: false,
      color_scheme_changed: false,
      layout_modifications: [],
      font_changes: false,
      spacing_adjustments: false
    }
  };
}

function getDefaultSections(): ResumeSection[] {
  return [
    {
      id: generateId(),
      type: 'experience',
      title: 'Work Experience',
      visible: true,
      order: 0,
      data: []
    },
    {
      id: generateId(),
      type: 'education',
      title: 'Education',
      visible: true,
      order: 1,
      data: []
    },
    {
      id: generateId(),
      type: 'skills',
      title: 'Skills',
      visible: true,
      order: 2,
      data: []
    }
  ];
}

function getDefaultSettings(templateId?: string): any {
  return {
    template: templateId || 'modern',
    colorScheme: 'blue',
    fontSize: 'medium',
    spacing: 'normal',
    showProfileImage: false,
    sectionOrder: ['experience', 'education', 'skills']
  };
}

function getDefaultSectionTitle(type: ResumeSection['type']): string {
  const titles = {
    experience: 'Work Experience',
    education: 'Education',
    skills: 'Skills',
    projects: 'Projects',
    certifications: 'Certifications',
    languages: 'Languages',
    awards: 'Awards',
    publications: 'Publications',
    volunteer: 'Volunteer Experience',
    references: 'References',
    custom: 'Custom Section'
  };
  
  return titles[type] || 'Section';
}

// Helper function to generate initial tags from profile and title
function generateInitialTags(profile: any, title: string): string[] {
  const tags: string[] = [];
  
  // Extract from title
  if (title && title !== 'Untitled Resume') {
    const titleWords = title.toLowerCase().split(/\s+/);
    titleWords.forEach(word => {
      if (word.length > 3 && !['resume', 'the', 'and', 'for', 'with'].includes(word)) {
        tags.push(word);
      }
    });
  }
  
  // Add profile-based tags
  if (profile) {
    if (profile.target_industry) {
      tags.push(profile.target_industry);
    }
    
    if (profile.experience_level) {
      tags.push(profile.experience_level);
    }
    
    if (profile.key_skills) {
      const skills = profile.key_skills.split(',').map((s: string) => s.trim().toLowerCase());
      tags.push(...skills.slice(0, 3)); // Add first 3 skills
    }
    
    if (profile.preferred_work_type && Array.isArray(profile.preferred_work_type)) {
      tags.push(...profile.preferred_work_type.slice(0, 2));
    }
  }
  
  // Remove duplicates and limit to 8 tags
  return [...new Set(tags)].slice(0, 8);
}

// Helper function to calculate completion percentage
function calculateCompletionPercentage(content: any): number {
  if (!content || typeof content !== 'object') return 0;
  
  let completedSections = 0;
  let totalSections = 0;
  
  // Check personal info
  totalSections++;
  if (content.personalInfo && 
      content.personalInfo.fullName && 
      content.personalInfo.email) {
    completedSections++;
  }
  
  // Check summary
  totalSections++;
  if (content.summary && content.summary.trim().length > 20) {
    completedSections++;
  }
  
  // Check experience
  totalSections++;
  if (content.experience && 
      Array.isArray(content.experience) && 
      content.experience.length > 0 &&
      content.experience.some((exp: any) => exp.company && exp.position)) {
    completedSections++;
  }
  
  // Check education
  totalSections++;
  if (content.education && 
      Array.isArray(content.education) && 
      content.education.length > 0 &&
      content.education.some((edu: any) => edu.institution && edu.degree)) {
    completedSections++;
  }
  
  // Check skills
  totalSections++;
  if (content.skills && 
      Array.isArray(content.skills) && 
      content.skills.length > 0) {
    completedSections++;
  }
  
  return Math.round((completedSections / totalSections) * 100);
}