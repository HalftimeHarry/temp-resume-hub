// Resume store for state management
import { writable, derived, get } from 'svelte/store';
import type { Resume, EditorState, FormState, ResumeSection } from '$lib/types/resume';
import { pb } from '$lib/pocketbase';
import { generateId, debounce } from '$lib/utils';

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
      const newResume: Partial<Resume> = {
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        personalInfo: {
          fullName: '',
          email: ''
        },
        sections: getDefaultSections(),
        settings: getDefaultSettings(templateId),
        isPublic: false,
        isTemplate: false,
        templateId,
        tags: [],
        metadata: {
          version: '1.0',
          exportFormats: ['pdf', 'docx']
        }
      };

      const record = await pb.collection('resumes').create(newResume);
      const resume = mapRecordToResume(record);
      
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
        lastSaved: resume.updatedAt
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
        updatedAt: new Date().toISOString()
      };

      const record = await pb.collection('resumes').update(resume.id, updateData);
      const updatedResume = mapRecordToResume(record);
      
      currentResume.set(updatedResume);
      editorState.update(state => ({
        ...state,
        hasUnsavedChanges: false,
        lastSaved: updatedResume.updatedAt
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
      
      const updated = { ...resume, ...updates };
      
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
  updatePersonalInfo(info: Partial<Resume['personalInfo']>): void {
    currentResume.update(resume => {
      if (!resume) return resume;
      
      return {
        ...resume,
        personalInfo: { ...resume.personalInfo, ...info }
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
        order: resume.sections.length,
        data: []
      };
      
      return {
        ...resume,
        sections: [...resume.sections, newSection]
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
        sections: resume.sections.map(section =>
          section.id === sectionId ? { ...section, ...updates } : section
        )
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
        sections: resume.sections.filter(section => section.id !== sectionId)
      };
    });
    
    editorState.update(state => ({ ...state, hasUnsavedChanges: true }));
    resumeStore.autoSave();
  },

  // Reorder sections
  reorderSections(sectionIds: string[]): void {
    currentResume.update(resume => {
      if (!resume) return resume;
      
      const sectionsMap = new Map(resume.sections.map(s => [s.id, s]));
      const reorderedSections = sectionIds
        .map(id => sectionsMap.get(id))
        .filter(Boolean)
        .map((section, index) => ({ ...section!, order: index }));
      
      return {
        ...resume,
        sections: reorderedSections
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
        sections: resume.sections.map(section =>
          section.id === sectionId
            ? { ...section, data: [...section.data, { ...item, id: generateId() }] }
            : section
        )
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
        sections: resume.sections.map(section =>
          section.id === sectionId
            ? {
                ...section,
                data: section.data.map(item =>
                  item.id === itemId ? { ...item, ...updates } : item
                )
              }
            : section
        )
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
        sections: resume.sections.map(section =>
          section.id === sectionId
            ? { ...section, data: section.data.filter(item => item.id !== itemId) }
            : section
        )
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
        filter: `userId = "${pb.authStore.model?.id}"`
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
  }
};

// Helper functions
function mapRecordToResume(record: any): Resume {
  return {
    id: record.id,
    userId: record.userId,
    title: record.title,
    slug: record.slug,
    personalInfo: record.personalInfo || { fullName: '', email: '' },
    sections: record.sections || [],
    settings: record.settings || getDefaultSettings(),
    isPublic: record.isPublic || false,
    isTemplate: record.isTemplate || false,
    templateId: record.templateId,
    createdAt: record.created,
    updatedAt: record.updated,
    lastViewedAt: record.lastViewedAt,
    viewCount: record.viewCount || 0,
    downloadCount: record.downloadCount || 0,
    shareCount: record.shareCount || 0,
    tags: record.tags || [],
    metadata: record.metadata || {
      version: '1.0',
      exportFormats: ['pdf', 'docx']
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

function getDefaultSettings(templateId?: string): Resume['settings'] {
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