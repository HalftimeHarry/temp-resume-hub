import { writable, derived, get } from 'svelte/store';
import type {
  ResumeBuilderData,
  BuilderStep,
  CharacterLimits,
  PersonalInfo,
  Experience,
  Education,
  Skill,
  Project,
  BuilderSettings
} from '$lib/types/resume.js';
import { generateId } from '$lib/utils.js';
import { templateStore } from '$lib/stores/templates.js';
import { userProfile } from '$lib/stores/userProfile.js';
import { currentUser } from '$lib/stores/auth.js';
import { isClientTemplate } from '$lib/templates';

// Character limits for different sections
export const characterLimits: CharacterLimits = {
  summary: 300,
  experienceDescription: 150,
  projectDescription: 120,
  skillName: 30,
  achievementItem: 100
};

// Builder steps configuration - base configuration
const baseBuilderSteps: BuilderStep[] = [
  { id: 'personal', title: 'Personal Info', description: 'Basic contact information', isComplete: false, isRequired: true },
  { id: 'summary', title: 'Summary', description: 'Professional summary', isComplete: false, isRequired: true },
  { id: 'experience', title: 'Experience', description: 'Work history', isComplete: false, isRequired: true },
  { id: 'education', title: 'Education', description: 'Academic background', isComplete: false, isRequired: true },
  { id: 'skills', title: 'Skills', description: 'Technical & soft skills', isComplete: false, isRequired: true },
  { id: 'projects', title: 'Projects', description: 'Projects & activities', isComplete: false, isRequired: false },
  { id: 'settings', title: 'Settings', description: 'Layout & formatting', isComplete: false, isRequired: false },
  { id: 'preview', title: 'Preview', description: 'Review & publish', isComplete: false, isRequired: false }
];

// Get builder steps configuration based on experience level
export function getBuilderSteps(isFirstTimeJobSeeker: boolean = false): BuilderStep[] {
  if (isFirstTimeJobSeeker) {
    return [
      { id: 'personal', title: 'Personal Info', description: 'Basic contact information', isComplete: false, isRequired: true },
      { id: 'summary', title: 'Summary', description: 'Professional summary', isComplete: false, isRequired: true },
      { id: 'education', title: 'Education', description: 'Academic background', isComplete: false, isRequired: true },
      { id: 'projects', title: 'Projects', description: 'Projects & activities', isComplete: false, isRequired: true },
      { id: 'skills', title: 'Skills', description: 'Technical & soft skills', isComplete: false, isRequired: true },
      { id: 'experience', title: 'Experience', description: 'Work history (optional)', isComplete: false, isRequired: false },
      { id: 'settings', title: 'Settings', description: 'Layout & formatting', isComplete: false, isRequired: false },
      { id: 'preview', title: 'Preview', description: 'Review & publish', isComplete: false, isRequired: false }
    ];
  }
  return baseBuilderSteps;
}

// Default export for backward compatibility
export const builderSteps = baseBuilderSteps;

// Default data
const defaultPersonalInfo: PersonalInfo = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  website: '',
  linkedin: '',
  github: '',
  summary: '',
  profileImage: ''
};

const defaultSettings: BuilderSettings = {
  layout: '1-page',
  mode: 'simple',
  template: 'default-template-id',
  colorScheme: 'blue',
  fontSize: 'medium',
  spacing: 'normal',
  showProfileImage: false,
  sectionOrder: ['personal', 'summary', 'experience', 'education', 'skills']
};

const defaultBuilderData: ResumeBuilderData = {
  id: undefined, // No ID for new resumes
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    summary: '',
    profileImage: ''
  },
  summary: 'Recent graduate with experience in web development and a passion for creating user-friendly applications. Skilled in JavaScript, HTML, CSS, and modern frameworks. Eager to contribute to a dynamic team and continue learning new technologies.',
  experience: [
    {
      id: 'exp1',
      company: 'ABC Company',
      position: 'Web Developer Intern',
      location: 'San Diego, CA',
      startDate: '2023-06',
      endDate: '2023-09',
      current: false,
      description: 'Developed and maintained company website using modern web technologies. Collaborated with design team to implement responsive UI components.',
      highlights: []
    }
  ],
  education: [
    {
      id: 'edu1',
      institution: 'San Diego State University',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      location: 'San Diego, CA',
      startDate: '2019-09',
      endDate: '2023-05',
      current: false,
      gpa: '3.7/4.0',
      honors: [],
      description: ''
    }
  ],
  skills: [
    { id: 'skill1', name: 'JavaScript', level: 'intermediate', category: 'Technical' },
    { id: 'skill2', name: 'HTML/CSS', level: 'intermediate', category: 'Technical' },
    { id: 'skill3', name: 'Problem Solving', level: 'advanced', category: 'Soft Skills' },
    { id: 'skill4', name: 'Team Collaboration', level: 'intermediate', category: 'Soft Skills' }
  ],
  projects: [],
  settings: defaultSettings,
  currentStep: 'personal',
  completedSteps: ['personal', 'summary', 'experience', 'education', 'skills'],
  purpose: undefined,
  target_industry: undefined
};

// Stores
export const builderData = writable<ResumeBuilderData>(defaultBuilderData);
export const currentStep = writable<string>('personal');
export const isLoading = writable<boolean>(false);
export const isGenerating = writable<boolean>(false);
export const hasUnsavedChanges = writable<boolean>(false);

// Derived stores
export const currentStepInfo = derived(
  currentStep,
  ($currentStep) => builderSteps.find(step => step.id === $currentStep) || builderSteps[0]
);

export const completionProgress = derived(
  builderData,
  ($data) => {
    const requiredSteps = builderSteps.filter(step => step.isRequired);
    const completedRequired = requiredSteps.filter(step => 
      $data.completedSteps.includes(step.id)
    ).length;
    return Math.round((completedRequired / requiredSteps.length) * 100);
  }
);

export const isStepComplete = derived(
  builderData,
  ($data) => (stepId: string) => $data.completedSteps.includes(stepId)
);

// Actions
export function updatePersonalInfo(info: Partial<PersonalInfo>) {
  builderData.update(data => ({
    ...data,
    personalInfo: { ...data.personalInfo, ...info }
  }));
  hasUnsavedChanges.set(true);
}

export function updateSummary(summary: string) {
  builderData.update(data => ({ ...data, summary }));
  hasUnsavedChanges.set(true);
}

export function addExperience(experience: Omit<Experience, 'id'>) {
  const newExperience: Experience = {
    ...experience,
    id: generateId()
  };
  
  builderData.update(data => ({
    ...data,
    experience: [...data.experience, newExperience]
  }));
  hasUnsavedChanges.set(true);
}

export function updateExperience(id: string, updates: Partial<Experience>) {
  builderData.update(data => ({
    ...data,
    experience: data.experience.map(exp => 
      exp.id === id ? { ...exp, ...updates } : exp
    )
  }));
  hasUnsavedChanges.set(true);
}

export function removeExperience(id: string) {
  builderData.update(data => ({
    ...data,
    experience: data.experience.filter(exp => exp.id !== id)
  }));
  hasUnsavedChanges.set(true);
}

export function addEducation(education: Omit<Education, 'id'>) {
  const newEducation: Education = {
    ...education,
    id: generateId()
  };
  
  builderData.update(data => ({
    ...data,
    education: [...data.education, newEducation]
  }));
  hasUnsavedChanges.set(true);
}

export function updateEducation(id: string, updates: Partial<Education>) {
  builderData.update(data => ({
    ...data,
    education: data.education.map(edu => 
      edu.id === id ? { ...edu, ...updates } : edu
    )
  }));
  hasUnsavedChanges.set(true);
}

export function removeEducation(id: string) {
  builderData.update(data => ({
    ...data,
    education: data.education.filter(edu => edu.id !== id)
  }));
  hasUnsavedChanges.set(true);
}

export function addSkill(skill: Omit<Skill, 'id'>) {
  const newSkill: Skill = {
    ...skill,
    id: generateId()
  };
  
  builderData.update(data => ({
    ...data,
    skills: [...data.skills, newSkill]
  }));
  hasUnsavedChanges.set(true);
}

export function removeSkill(id: string) {
  builderData.update(data => ({
    ...data,
    skills: data.skills.filter(skill => skill.id !== id)
  }));
  hasUnsavedChanges.set(true);
}

export function addProject(project: Omit<Project, 'id'>) {
  const newProject: Project = {
    ...project,
    id: generateId()
  };
  
  builderData.update(data => ({
    ...data,
    projects: [...data.projects, newProject]
  }));
  hasUnsavedChanges.set(true);
}

export function updateProject(id: string, updates: Partial<Project>) {
  builderData.update(data => ({
    ...data,
    projects: data.projects.map(proj => 
      proj.id === id ? { ...proj, ...updates } : proj
    )
  }));
  hasUnsavedChanges.set(true);
}

export function removeProject(id: string) {
  builderData.update(data => ({
    ...data,
    projects: data.projects.filter(proj => proj.id !== id)
  }));
  hasUnsavedChanges.set(true);
}

export function updateSettings(settings: Partial<BuilderSettings>) {
  builderData.update(data => ({
    ...data,
    settings: { ...data.settings, ...settings }
  }));
  hasUnsavedChanges.set(true);
}

export function goToStep(stepId: string) {
  console.log('goToStep called with:', stepId);
  const step = builderSteps.find(step => step.id === stepId);
  if (step) {
    console.log('Step found, updating stores');
    currentStep.set(stepId);
    console.log('currentStep store updated to:', stepId);
    builderData.update(data => ({
      ...data,
      currentStep: stepId
    }));
    console.log('builderData currentStep updated to:', stepId);
    console.log('Stores updated');
  } else {
    console.log('Step not found');
  }
}

export function nextStep() {
  let currentStepValue: string;
  currentStep.subscribe(value => currentStepValue = value)();
  const currentIndex = builderSteps.findIndex(step => step.id === currentStepValue);
  if (currentIndex < builderSteps.length - 1) {
    const nextStepId = builderSteps[currentIndex + 1].id;
    goToStep(nextStepId);
  }
}

export function previousStep() {
  let currentStepValue: string;
  currentStep.subscribe(value => currentStepValue = value)();
  const currentIndex = builderSteps.findIndex(step => step.id === currentStepValue);
  if (currentIndex > 0) {
    const prevStepId = builderSteps[currentIndex - 1].id;
    goToStep(prevStepId);
  }
}

export function markStepComplete(stepId: string) {
  builderData.update(data => ({
    ...data,
    completedSteps: data.completedSteps.includes(stepId) 
      ? data.completedSteps 
      : [...data.completedSteps, stepId]
  }));
}

export function markStepIncomplete(stepId: string) {
  builderData.update(data => ({
    ...data,
    completedSteps: data.completedSteps.filter(id => id !== stepId)
  }));
}

export function updatePurpose(purpose: string) {
  builderData.update(data => ({ ...data, purpose }));
  hasUnsavedChanges.set(true);
}

export function updateTargetIndustry(target_industry: string) {
  builderData.update(data => ({ ...data, target_industry }));
  hasUnsavedChanges.set(true);
}

export function resetBuilder() {
  builderData.set(defaultBuilderData);
  currentStep.set('personal');
  hasUnsavedChanges.set(false);
}

export async function saveResume() {
  isLoading.set(true);
  try {
    const { pb } = await import('$lib/pocketbase');
    const { currentUser: userStore } = await import('$lib/stores/auth');
    const { templateStore } = await import('$lib/stores/templates');
    
    let currentUser: any;
    const unsubscribe = userStore.subscribe(user => {
      currentUser = user;
    });
    unsubscribe();
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    // Get current data from the store
    const currentData = get(builderData);

    // Get template name
    let templateName = 'Untitled Template';
    if (currentData.settings.template && currentData.settings.template !== 'default-template-id') {
      try {
        const template = await templateStore.getTemplate(currentData.settings.template);
        templateName = template.name;
      } catch (e) {
        console.warn('Failed to fetch template name:', e);
      }
    }

    // Generate title - prioritize target_industry, then purpose, then template name
    const userName = currentUser.name || currentData.personalInfo.fullName || 'Untitled';
    let resumeTitle: string;
    
    if (currentData.target_industry) {
      // Use industry if available
      resumeTitle = `${userName} - ${currentData.target_industry}`;
    } else if (currentData.purpose) {
      // Use purpose if no industry
      resumeTitle = `${userName} - ${currentData.purpose}`;
    } else {
      // Fallback to template name
      resumeTitle = `${userName} - ${templateName}`;
    }

    // Create resume record in PocketBase
    const resumeData = {
      user: currentUser.id,
      title: resumeTitle,
      content: {
        personalInfo: currentData.personalInfo,
        summary: currentData.summary,
        experience: currentData.experience,
        education: currentData.education,
        skills: currentData.skills,
        projects: currentData.projects,
        settings: currentData.settings
      },
      template: currentData.settings.template || 'default-template-id',
      is_public: false,
      purpose: currentData.purpose,
      target_industry: currentData.target_industry
    };

    const record = await pb.collection('resumes').create(resumeData);
    console.log('Resume saved successfully:', record.id);
    
    // Calculate and update completion percentage
    const { resumeStore } = await import('$lib/stores/resume');
    await resumeStore.calculateAndUpdateCompletion(record.id);
    
    hasUnsavedChanges.set(false);
    return record;
  } catch (error) {
    console.error('Failed to save resume:', error);
    throw error;
  } finally {
    isLoading.set(false);
  }
}

export function resetBuilderForNewResume() {
  builderData.set({ ...defaultBuilderData });
  hasUnsavedChanges.set(false);
  currentStep.set('personal');
  console.log('Builder reset for new resume');
}

export async function loadResumeForEditing(resumeId: string) {
  isLoading.set(true);
  try {
    const { pb } = await import('$lib/pocketbase');
    
    // Fetch the resume from PocketBase
    const resume = await pb.collection('resumes').getOne(resumeId);
    
    // Handle client-side template restoration
    let settings = resume.content?.settings || defaultBuilderData.settings;
    
    // If this resume was created with a client-side template, restore the original template ID
    if (settings.clientSideTemplate && settings.originalTemplate) {
      settings = {
        ...settings,
        template: settings.originalTemplate
      };
      console.log(`Restored client-side template: ${settings.originalTemplate}`);
    }

    // Update the builder data with the resume content
    builderData.set({
      id: resume.id,
      personalInfo: resume.content?.personalInfo || defaultBuilderData.personalInfo,
      summary: resume.content?.summary || defaultBuilderData.summary,
      experience: resume.content?.experience || defaultBuilderData.experience,
      education: resume.content?.education || defaultBuilderData.education,
      skills: resume.content?.skills || defaultBuilderData.skills,
      projects: resume.content?.projects || defaultBuilderData.projects,
      settings,
      currentStep: 'personal',
      completedSteps: ['personal', 'summary', 'experience', 'education', 'skills'],
      purpose: resume.purpose,
      target_industry: resume.target_industry
    });
    
    // Mark as no unsaved changes since we just loaded
    hasUnsavedChanges.set(false);
    
    console.log('Resume loaded for editing:', resumeId);
    return resume;
  } catch (error) {
    console.error('Failed to load resume for editing:', error);
    throw error;
  } finally {
    isLoading.set(false);
  }
}

/**
 * Generate resume content from user profile using ResumeGenerator service
 * 
 * @param options - Generation options including sections to generate, target industry, and strategy
 * @throws Error if user profile or template is not available
 */
export async function generateFromProfile(options: {
  sections: string[];
  targetIndustry?: string;
  strategy?: 'auto' | 'experienced' | 'first-time' | 'career-change';
  keywordIntensity?: 'light' | 'moderate' | 'aggressive';
}): Promise<void> {
  isGenerating.set(true);
  
  try {
    // Get current user profile
    let profile: any;
    const unsubscribeProfile = userProfile.subscribe(p => {
      profile = p;
    });
    unsubscribeProfile();
    
    if (!profile) {
      throw new Error('User profile not available. Please complete your profile first.');
    }
    
    // Get current builder data to find template
    const currentData = get(builderData);
    const templateId = currentData.settings.template;
    
    if (!templateId) {
      throw new Error('No template selected. Please select a template first.');
    }
    
    // Get template from templateStore
    const currentTemplate = await templateStore.getTemplate(templateId);
    
    if (!currentTemplate) {
      throw new Error('Template not found. Please select a valid template.');
    }
    
    // Import ResumeGenerator
    const { ResumeGenerator } = await import('$lib/services/ResumeGenerator');
    
    // Create generator instance with keyword intensity
    const generator = new ResumeGenerator(
      profile,
      currentTemplate,
      options.targetIndustry,
      options.keywordIntensity || 'moderate'
    );
    
    // Generate complete draft
    const generatedData = generator.generateDraft();
    
    // Selectively update only requested sections, preserving user edits
    const updates: Partial<ResumeBuilderData> = {};
    const completedSteps = [...currentData.completedSteps];
    
    // Update personal info if requested
    if (options.sections.includes('personal')) {
      // Only update empty fields to preserve user edits
      updates.personalInfo = {
        ...currentData.personalInfo,
        fullName: currentData.personalInfo.fullName || generatedData.personalInfo.fullName,
        email: currentData.personalInfo.email || generatedData.personalInfo.email,
        phone: currentData.personalInfo.phone || generatedData.personalInfo.phone,
        location: currentData.personalInfo.location || generatedData.personalInfo.location,
        website: currentData.personalInfo.website || generatedData.personalInfo.website,
        linkedin: currentData.personalInfo.linkedin || generatedData.personalInfo.linkedin,
        github: currentData.personalInfo.github || generatedData.personalInfo.github,
      };
      
      if (!completedSteps.includes('personal')) {
        completedSteps.push('personal');
      }
    }
    
    // Update summary if requested
    if (options.sections.includes('summary')) {
      // Only update if current summary is empty or is the default placeholder
      const isDefaultSummary = currentData.summary === defaultBuilderData.summary;
      const isEmpty = !currentData.summary || currentData.summary.trim().length === 0;
      
      if (isEmpty || isDefaultSummary) {
        updates.summary = generatedData.summary;
      }
      
      if (!completedSteps.includes('summary')) {
        completedSteps.push('summary');
      }
    }
    
    // Update experience if requested
    if (options.sections.includes('experience')) {
      // Only update if current experience is empty or contains only default data
      const hasDefaultExperience = currentData.experience.length === 1 && 
        currentData.experience[0].company === 'ABC Company';
      const isEmpty = currentData.experience.length === 0;
      
      if (isEmpty || hasDefaultExperience) {
        updates.experience = generatedData.experience;
      }
      
      if (!completedSteps.includes('experience')) {
        completedSteps.push('experience');
      }
    }
    
    // Update education if requested
    if (options.sections.includes('education')) {
      // Only update if current education is empty or contains only default data
      const hasDefaultEducation = currentData.education.length === 1 && 
        currentData.education[0].institution === 'San Diego State University';
      const isEmpty = currentData.education.length === 0;
      
      if (isEmpty || hasDefaultEducation) {
        updates.education = generatedData.education;
      }
      
      if (!completedSteps.includes('education')) {
        completedSteps.push('education');
      }
    }
    
    // Update skills if requested
    if (options.sections.includes('skills')) {
      // Only update if current skills are empty or contain only default data
      const hasDefaultSkills = currentData.skills.length === 4 && 
        currentData.skills.some(s => s.name === 'JavaScript');
      const isEmpty = currentData.skills.length === 0;
      
      if (isEmpty || hasDefaultSkills) {
        updates.skills = generatedData.skills;
      }
      
      if (!completedSteps.includes('skills')) {
        completedSteps.push('skills');
      }
    }
    
    // Update projects if requested
    if (options.sections.includes('projects')) {
      // Only update if current projects are empty
      if (currentData.projects.length === 0) {
        updates.projects = generatedData.projects;
      }
      
      if (!completedSteps.includes('projects')) {
        completedSteps.push('projects');
      }
    }
    
    // Apply updates to store
    builderData.update(data => ({
      ...data,
      ...updates,
      completedSteps
    }));
    
    hasUnsavedChanges.set(true);
    
  } catch (error) {
    console.error('Failed to generate from profile:', error);
    throw error;
  } finally {
    isGenerating.set(false);
  }
}

export async function publishResume() {
  isLoading.set(true);
  try {
    const { pb } = await import('$lib/pocketbase');
    const { currentUser: userStore } = await import('$lib/stores/auth');
    const { templateStore } = await import('$lib/stores/templates');
    
    let currentUser: any;
    const unsubscribe = userStore.subscribe(user => {
      currentUser = user;
    });
    unsubscribe();
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    // Get current data from the store
    const currentData = get(builderData);

    // Get template name
    let templateName = 'Untitled Template';
    if (currentData.settings.template && currentData.settings.template !== 'default-template-id') {
      try {
        const template = await templateStore.getTemplate(currentData.settings.template);
        templateName = template.name;
      } catch (e) {
        console.warn('Failed to fetch template name:', e);
      }
    }

    // Handle client-side vs database templates
    let templateId = currentData.settings.template || 'default-template-id';
    const isClientSideTemplate = templateId && isClientTemplate(templateId);
    
    // If using a client-side template, we need a database template ID for the relation field
    if (isClientSideTemplate) {
      console.log(`Using client-side template: ${templateId}, finding database fallback`);
      
      // Try to find any existing template as fallback for the database relation
      try {
        const templates = await pb.collection('templates').getList(1, 1);
        if (templates.items.length > 0) {
          const fallbackTemplateId = templates.items[0].id;
          console.log(`Using database template ${fallbackTemplateId} as fallback for client template ${templateId}`);
          templateId = fallbackTemplateId;
        } else {
          console.warn('No templates found in database, cannot save resume');
          throw new Error('No database templates available. Please create at least one template in the database.');
        }
      } catch (fallbackError) {
        console.error('Failed to find fallback template:', fallbackError);
        throw new Error('Unable to save resume: No database templates available');
      }
    }

    // Generate title - prioritize target_industry, then purpose, then template name
    const userName = currentUser.name || currentData.personalInfo.fullName || 'Untitled';
    let resumeTitle: string;
    
    if (currentData.target_industry) {
      // Use industry if available
      resumeTitle = `${userName} - ${currentData.target_industry}`;
    } else if (currentData.purpose) {
      // Use purpose if no industry
      resumeTitle = `${userName} - ${currentData.purpose}`;
    } else {
      // Fallback to template name
      resumeTitle = `${userName} - ${templateName}`;
    }

    // Prepare resume data
    const resumeData = {
      user: currentUser.id,
      title: resumeTitle,
      content: {
        personalInfo: currentData.personalInfo,
        summary: currentData.summary,
        experience: currentData.experience,
        education: currentData.education,
        skills: currentData.skills,
        projects: currentData.projects,
        settings: {
          ...currentData.settings,
          // Preserve the original template ID in content for client-side templates
          originalTemplate: isClientSideTemplate ? currentData.settings.template : undefined,
          clientSideTemplate: isClientSideTemplate
        }
      },
      template: templateId,
      is_public: true,
      // Add metadata fields
      target_industry: currentData.target_industry,
      purpose: currentData.purpose
    };

    console.log('Publishing resume with data:', {
      originalTemplate: currentData.settings.template,
      isClientSideTemplate,
      databaseTemplateId: templateId,
      userId: currentUser.id,
      title: resumeData.title,
      target_industry: currentData.target_industry,
      skillsCount: currentData.skills.length,
      skills: currentData.skills.map(s => `${s.name} (${s.category})`)
    });

    let record;
    
    // Check if we're editing an existing resume or creating a new one
    if (currentData.id) {
      // Update existing resume
      console.log('Updating existing resume:', currentData.id);
      record = await pb.collection('resumes').update(currentData.id, resumeData);
    } else {
      // Create new resume with unique slug
      const slug = `${currentUser.username}-${currentData.personalInfo.fullName?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'resume'}-${Date.now()}`;
      resumeData.slug = slug;
      console.log('Creating new resume');
      record = await pb.collection('resumes').create(resumeData);
      
      // Update the builder data with the new resume ID
      builderData.update(data => ({ ...data, id: record.id }));
    }
    const publicUrl = `${window.location.origin}/resume/${record.slug}`;
    
    console.log('Resume published successfully:', publicUrl);
    
    // Calculate and update completion percentage
    const { resumeStore } = await import('$lib/stores/resume');
    await resumeStore.calculateAndUpdateCompletion(record.id);
    
    hasUnsavedChanges.set(false);
    return { url: publicUrl, record };
  } catch (error) {
    console.error('Failed to publish resume:', error);
    throw error;
  } finally {
    isLoading.set(false);
  }
}

// PROFILE INTEGRATION FUNCTIONS

/**
 * Import data from user profile into builder
 */
export function importFromProfile(options: {
  includePersonalInfo?: boolean;
  includeExperience?: boolean;
  includeEducation?: boolean;
  includeSkills?: boolean;
  mergingStrategy?: 'replace' | 'merge' | 'append';
} = {}) {
  const {
    includePersonalInfo = true,
    includeExperience = true,
    includeEducation = true,
    includeSkills = true,
    mergingStrategy = 'merge'
  } = options;

  const profile = get(userProfile);
  const user = get(currentUser);
  
  if (!profile) {
    console.warn('No user profile found to import from');
    return;
  }

  console.log('🔄 Importing data from user profile:', profile.id);

  builderData.update(data => {
    const updatedData = { ...data };

    // Import Personal Information
    if (includePersonalInfo) {
      const profilePersonalInfo: Partial<PersonalInfo> = {
        fullName: profile.first_name && profile.last_name 
          ? `${profile.first_name} ${profile.last_name}`.trim()
          : undefined,
        email: user?.email || profile.email || undefined,
        phone: profile.phone || undefined,
        location: profile.location || undefined,
        linkedin: profile.linkedin_url || undefined,
        website: profile.portfolio_url || undefined,
        github: profile.github_url || undefined,
        summary: profile.professional_summary || undefined
      };

      if (mergingStrategy === 'replace') {
        updatedData.personalInfo = { ...data.personalInfo, ...profilePersonalInfo };
      } else {
        // Merge: only update empty or placeholder fields, preserve real user data
        console.log('🔄 Merging profile data with existing data...');
        let updatedFields = 0;
        
        Object.entries(profilePersonalInfo).forEach(([key, value]) => {
          if (!value || value === undefined) return; // Skip if no profile value to import
          
          const currentValue = data.personalInfo[key as keyof PersonalInfo];
          const isEmptyOrPlaceholder = !currentValue || 
            currentValue === '' || 
            currentValue === 'john.doe@email.com' ||
            currentValue === 'johndoe.com' ||
            currentValue === '(555) 123-4567' ||
            currentValue === 'Your City, State' ||
            currentValue === 'John Doe' ||
            currentValue === 'Dustin Dinsmore'; // Common template placeholder
          
          if (isEmptyOrPlaceholder) {
            (updatedData.personalInfo as any)[key] = value;
            updatedFields++;
            console.log(`✅ Updated ${key} with profile value: ${value}`);
          } else {
            console.log(`⏭️ Preserved existing ${key}: ${currentValue}`);
          }
        });
        
        console.log(`📊 Import complete: ${updatedFields} fields updated from profile`);
      }
    }

    // Import Professional Summary
    if (profile.professional_summary && (!data.summary || mergingStrategy === 'replace')) {
      updatedData.summary = profile.professional_summary;
    }

    // Import Work Experience
    if (includeExperience && profile.work_experience) {
      try {
        const profileExperience = Array.isArray(profile.work_experience) 
          ? profile.work_experience 
          : JSON.parse(profile.work_experience);

        const importedExperience: Experience[] = profileExperience.map((exp: any) => ({
          id: generateId(),
          company: exp.company || '',
          position: exp.position || exp.title || '',
          location: exp.location || '',
          startDate: exp.start_date || '',
          endDate: exp.end_date || '',
          current: exp.current || false,
          description: exp.description || '',
          highlights: exp.highlights || []
        }));

        if (mergingStrategy === 'replace') {
          updatedData.experience = importedExperience;
        } else if (mergingStrategy === 'append') {
          updatedData.experience = [...data.experience, ...importedExperience];
        } else {
          // Merge: only add if no existing experience
          if (data.experience.length === 0 || data.experience.every(exp => !exp.company && !exp.position)) {
            updatedData.experience = importedExperience;
          }
        }
      } catch (error) {
        console.warn('Failed to parse work experience from profile:', error);
      }
    }

    // Import Education
    if (includeEducation && profile.education) {
      try {
        const profileEducation = Array.isArray(profile.education) 
          ? profile.education 
          : JSON.parse(profile.education);

        const importedEducation: Education[] = profileEducation.map((edu: any) => ({
          id: generateId(),
          institution: edu.institution || edu.school || '',
          degree: edu.degree || '',
          field: edu.field_of_study || edu.field || '',
          location: edu.location || '',
          startDate: edu.start_date || '',
          endDate: edu.end_date || '',
          current: edu.current || false,
          gpa: edu.gpa || '',
          honors: edu.honors || [],
          description: edu.description || ''
        }));

        if (mergingStrategy === 'replace') {
          updatedData.education = importedEducation;
        } else if (mergingStrategy === 'append') {
          updatedData.education = [...data.education, ...importedEducation];
        } else {
          // Merge: only add if no existing education
          if (data.education.length === 0 || data.education.every(edu => !edu.institution && !edu.degree)) {
            updatedData.education = importedEducation;
          }
        }
      } catch (error) {
        console.warn('Failed to parse education from profile:', error);
      }
    }

    // Import Skills
    if (includeSkills && profile.key_skills) {
      try {
        const skillsString = typeof profile.key_skills === 'string' 
          ? profile.key_skills 
          : JSON.stringify(profile.key_skills);
        
        const skillNames = skillsString.split(',').map(s => s.trim()).filter(s => s.length > 0);
        
        const importedSkills: Skill[] = skillNames.map(skillName => ({
          id: generateId(),
          name: skillName,
          category: categorizeSkill(skillName),
          level: 'intermediate' as const
        }));

        if (mergingStrategy === 'replace') {
          updatedData.skills = importedSkills;
        } else if (mergingStrategy === 'append') {
          // Avoid duplicates
          const existingSkillNames = data.skills.map(s => s.name.toLowerCase());
          const newSkills = importedSkills.filter(s => !existingSkillNames.includes(s.name.toLowerCase()));
          updatedData.skills = [...data.skills, ...newSkills];
        } else {
          // Merge: only add if no existing skills
          if (data.skills.length === 0) {
            updatedData.skills = importedSkills;
          }
        }
      } catch (error) {
        console.warn('Failed to parse skills from profile:', error);
      }
    }

    return updatedData;
  });

  // Update step completion status only for imported sections
  console.log('🔄 Validating completion for imported sections...');
  if (includePersonalInfo) {
    validateStepCompletion('personal');
  }
  if (includeExperience) {
    validateStepCompletion('experience');
  }
  if (includeEducation) {
    validateStepCompletion('education');
  }
  if (includeSkills) {
    validateStepCompletion('skills');
  }
  
  const finalData = get(builderData);
  console.log('📊 Final completion status:', finalData.completedSteps);
  
  hasUnsavedChanges.set(true);
  
  console.log('✅ Profile data imported successfully');
}

/**
 * Smart merge profile data with template starter data
 * Profile data only affects personal info, template provides all content
 */
export function smartMergeProfileAndTemplate(templateData: any, profile: any) {
  console.log('🔄 Smart merging profile contact info with template data');

  const merged = { ...templateData };

  // ONLY merge Personal Info from profile - preserve all template content
  if (profile && (profile.first_name || profile.last_name || profile.phone || profile.location)) {
    merged.personalInfo = {
      ...templateData.personalInfo,
      fullName: profile.first_name && profile.last_name 
        ? `${profile.first_name} ${profile.last_name}`.trim()
        : templateData.personalInfo?.fullName || '',
      phone: profile.phone || templateData.personalInfo?.phone || '',
      location: profile.location || templateData.personalInfo?.location || '',
      linkedin: profile.linkedin_url || templateData.personalInfo?.linkedin || '',
      website: profile.portfolio_url || templateData.personalInfo?.website || ''
    };
  }

  // Template provides ALL content for other sections:
  // ✅ summary - from template
  // ✅ experience - from template  
  // ✅ education - from template
  // ✅ skills - from template
  // ✅ projects - from template

  console.log('✅ Smart merge completed (contact info + template content)');
  return merged;
}

/**
 * Auto-populate builder with profile data on load (Personal Info Only)
 */
export function autoPopulateFromProfile() {
  const profile = get(userProfile);
  const currentData = get(builderData);
  
  if (!profile) {
    console.log('No profile available for auto-population');
    return false;
  }

  // Check if personal info already has significant data
  const hasExistingPersonalInfo = 
    currentData.personalInfo.fullName ||
    currentData.personalInfo.email ||
    currentData.personalInfo.phone ||
    currentData.personalInfo.location;

  if (hasExistingPersonalInfo) {
    console.log('Personal info already exists, skipping auto-population');
    return false;
  }

  console.log('🚀 Auto-populating personal info from profile');
  
  // Import ONLY personal information to avoid overwriting other steps
  importFromProfile({
    includePersonalInfo: true,
    includeExperience: false,
    includeEducation: false,
    includeSkills: false,
    mergingStrategy: 'merge'
  });

  return true;
}

/**
 * Sync profile when builder data changes (optional feature)
 */
export async function syncProfileFromBuilder(options: {
  syncPersonalInfo?: boolean;
  syncSummary?: boolean;
  syncExperience?: boolean;
  syncEducation?: boolean;
  syncSkills?: boolean;
} = {}): Promise<boolean> {
  const {
    syncPersonalInfo = false,
    syncSummary = false,
    syncExperience = false,
    syncEducation = false,
    syncSkills = false
  } = options;

  const currentData = get(builderData);
  const profile = get(userProfile);

  if (!profile) {
    console.warn('No profile available for syncing');
    return false;
  }

  console.log('🔄 Syncing profile from builder data');

  const syncData: any = {};

  if (syncPersonalInfo) {
    // Only sync if builder has more complete data than profile
    if (currentData.personalInfo.phone && currentData.personalInfo.phone !== profile.phone) {
      syncData.phone = currentData.personalInfo.phone;
    }
    if (currentData.personalInfo.location && currentData.personalInfo.location !== profile.location) {
      syncData.location = currentData.personalInfo.location;
    }
    if (currentData.personalInfo.linkedin && currentData.personalInfo.linkedin !== profile.linkedin_url) {
      syncData.linkedin_url = currentData.personalInfo.linkedin;
    }
    if (currentData.personalInfo.website && currentData.personalInfo.website !== profile.portfolio_url) {
      syncData.portfolio_url = currentData.personalInfo.website;
    }
    if (currentData.personalInfo.github && currentData.personalInfo.github !== profile.github_url) {
      syncData.github_url = currentData.personalInfo.github;
    }
  }

  if (syncSummary && currentData.summary && currentData.summary !== profile.professional_summary) {
    syncData.professional_summary = currentData.summary;
  }

  if (syncExperience && currentData.experience.length > 0) {
    // Convert builder experience to profile format
    const experienceData = currentData.experience.map(exp => ({
      company: exp.company,
      position: exp.position,
      title: exp.position, // alias
      location: exp.location,
      start_date: exp.startDate,
      end_date: exp.endDate,
      current: exp.current,
      description: exp.description,
      highlights: exp.highlights
    }));
    
    syncData.work_experience = JSON.stringify(experienceData);
  }

  if (syncEducation && currentData.education.length > 0) {
    // Convert builder education to profile format
    const educationData = currentData.education.map(edu => ({
      institution: edu.institution,
      school: edu.institution, // alias
      degree: edu.degree,
      field_of_study: edu.field,
      field: edu.field, // alias
      location: edu.location,
      start_date: edu.startDate,
      end_date: edu.endDate,
      current: edu.current,
      gpa: edu.gpa,
      honors: edu.honors,
      description: edu.description
    }));
    
    syncData.education = JSON.stringify(educationData);
  }

  if (syncSkills && currentData.skills.length > 0) {
    // Convert builder skills to profile format
    const skillNames = currentData.skills.map(skill => skill.name);
    syncData.key_skills = skillNames.join(', ');
  }

  if (Object.keys(syncData).length > 0) {
    try {
      console.log('🔄 Syncing to profile:', Object.keys(syncData));
      
      // Import userProfileStore to access saveProfile function
      const { userProfileStore } = await import('$lib/stores/userProfile.js');
      const result = await userProfileStore.saveProfile(syncData);
      
      if (result) {
        console.log('✅ Profile synced successfully');
        return true;
      } else {
        console.warn('⚠️ Profile sync failed');
        return false;
      }
    } catch (error) {
      console.error('❌ Error syncing profile:', error);
      return false;
    }
  }

  return true; // No changes to sync
}

/**
 * Auto-sync specific fields when they change in builder
 */
export function enableAutoSync(fields: {
  personalInfo?: boolean;
  summary?: boolean;
  experience?: boolean;
  education?: boolean;
  skills?: boolean;
} = {}) {
  let lastSyncedData: any = null;
  
  return builderData.subscribe(async (currentData) => {
    // Skip initial load and if no previous data to compare
    if (!lastSyncedData) {
      lastSyncedData = JSON.parse(JSON.stringify(currentData));
      return;
    }

    // Check what changed and sync accordingly
    const changes: any = {};
    
    if (fields.personalInfo && 
        JSON.stringify(currentData.personalInfo) !== JSON.stringify(lastSyncedData.personalInfo)) {
      changes.syncPersonalInfo = true;
    }
    
    if (fields.summary && currentData.summary !== lastSyncedData.summary) {
      changes.syncSummary = true;
    }
    
    if (fields.experience && 
        JSON.stringify(currentData.experience) !== JSON.stringify(lastSyncedData.experience)) {
      changes.syncExperience = true;
    }
    
    if (fields.education && 
        JSON.stringify(currentData.education) !== JSON.stringify(lastSyncedData.education)) {
      changes.syncEducation = true;
    }
    
    if (fields.skills && 
        JSON.stringify(currentData.skills) !== JSON.stringify(lastSyncedData.skills)) {
      changes.syncSkills = true;
    }

    // Sync if there are changes
    if (Object.keys(changes).length > 0) {
      console.log('🔄 Auto-syncing changes:', Object.keys(changes));
      await syncProfileFromBuilder(changes);
    }

    // Update last synced data
    lastSyncedData = JSON.parse(JSON.stringify(currentData));
  });
}

/**
 * Helper function to categorize skills
 */
function categorizeSkill(skillName: string): 'technical' | 'soft' | 'language' {
  const skill = skillName.toLowerCase();
  
  // Technical skills patterns
  const technicalPatterns = [
    'javascript', 'python', 'java', 'react', 'node', 'html', 'css', 'sql', 'git',
    'aws', 'docker', 'kubernetes', 'typescript', 'angular', 'vue', 'php', 'ruby',
    'c++', 'c#', 'swift', 'kotlin', 'flutter', 'mongodb', 'postgresql', 'mysql',
    'redis', 'elasticsearch', 'graphql', 'rest', 'api', 'microservices', 'devops',
    'ci/cd', 'jenkins', 'terraform', 'ansible', 'linux', 'windows', 'macos',
    'photoshop', 'illustrator', 'figma', 'sketch', 'adobe', 'office', 'excel',
    'powerpoint', 'word', 'outlook', 'salesforce', 'hubspot', 'jira', 'confluence'
  ];

  // Language patterns
  const languagePatterns = [
    'english', 'spanish', 'french', 'german', 'italian', 'portuguese', 'chinese',
    'mandarin', 'cantonese', 'japanese', 'korean', 'arabic', 'hindi', 'russian',
    'dutch', 'swedish', 'norwegian', 'danish', 'finnish', 'polish', 'czech'
  ];

  if (technicalPatterns.some(pattern => skill.includes(pattern))) {
    return 'technical';
  }
  
  if (languagePatterns.some(pattern => skill.includes(pattern))) {
    return 'language';
  }
  
  return 'soft';
}

/**
 * Validate and update completion for a specific step
 */
function validateStepCompletion(stepId: string) {
  const currentData = get(builderData);
  
  switch (stepId) {
    case 'personal':
      if (currentData.personalInfo.fullName && currentData.personalInfo.email) {
        console.log(`✅ Marking ${stepId} as complete`);
        markStepComplete('personal');
      } else {
        console.log(`⏭️ ${stepId} validation: fullName="${currentData.personalInfo.fullName}", email="${currentData.personalInfo.email}"`);
      }
      break;
    case 'summary':
      if (currentData.summary && currentData.summary.trim().length > 0) {
        markStepComplete('summary');
      }
      break;
    case 'experience':
      if (currentData.experience.length > 0 && 
          currentData.experience.some(exp => exp.company && exp.position && exp.startDate)) {
        markStepComplete('experience');
      }
      break;
    case 'education':
      if (currentData.education.length > 0 && 
          currentData.education.some(edu => edu.institution && edu.degree && edu.startDate)) {
        markStepComplete('education');
      }
      break;
    case 'skills':
      if (currentData.skills.length >= 3) {
        markStepComplete('skills');
      }
      break;
  }
}

/**
 * Update step completion status based on current data
 * Only marks steps as complete when they meet criteria, preserves existing completion
 */
function updateStepCompletionFromData() {
  const currentData = get(builderData);

  // Personal info step - mark complete if has required fields
  if (currentData.personalInfo.fullName && currentData.personalInfo.email) {
    markStepComplete('personal');
  }

  // Summary step - mark complete if has content
  if (currentData.summary && currentData.summary.trim().length > 0) {
    markStepComplete('summary');
  }

  // Experience step - mark complete if has valid experience
  if (currentData.experience.length > 0 && 
      currentData.experience.some(exp => exp.company && exp.position && exp.startDate)) {
    markStepComplete('experience');
  }

  // Education step - mark complete if has valid education
  if (currentData.education.length > 0 && 
      currentData.education.some(edu => edu.institution && edu.degree && edu.startDate)) {
    markStepComplete('education');
  }

  // Skills step - mark complete if has sufficient skills
  if (currentData.skills.length >= 3) {
    markStepComplete('skills');
  }
}

/**
 * Quick generate resume sections from profile using strategy pattern
 */
export async function quickGenerateFromProfile(options: {
  sections: string[];
  targetIndustry?: string;
  strategyName?: string;
}): Promise<{ success: boolean; message: string }> {
  const profile = get(userProfile);
  const currentData = get(builderData);
  
  if (!profile) {
    return { success: false, message: 'No profile data available' };
  }

  try {
    // Dynamically import the strategy module
    const { ResumeStrategyFactory } = await import('$lib/services/ResumeStrategies');
    const { templateStore: templates } = await import('$lib/stores/templates');
    
    // Get current template
    const allTemplates = get(templates);
    const currentTemplate = allTemplates?.find(t => t.id === currentData.settings.template);
    
    if (!currentTemplate) {
      return { success: false, message: 'No template selected' };
    }

    // Select strategy (use manual override if provided)
    const selection = ResumeStrategyFactory.selectStrategy(profile, options.strategyName);
    
    // Generate resume data using the selected strategy
    const generatedData = selection.strategy.generateResume(
      profile,
      currentTemplate,
      options.targetIndustry
    );

    // Update only the selected sections
    builderData.update(data => {
      const updated = { ...data };

      if (options.sections.includes('personalInfo')) {
        updated.personalInfo = generatedData.personalInfo;
      }

      if (options.sections.includes('summary')) {
        updated.summary = generatedData.summary;
      }

      if (options.sections.includes('experience')) {
        updated.experience = generatedData.experience;
      }

      if (options.sections.includes('education')) {
        updated.education = generatedData.education;
      }

      if (options.sections.includes('skills')) {
        updated.skills = generatedData.skills;
      }

      if (options.sections.includes('projects')) {
        updated.projects = generatedData.projects;
      }

      return updated;
    });

    // Mark steps as complete
    validateAndMarkStepsComplete();

    return {
      success: true,
      message: `Successfully generated using ${selection.strategyName} strategy`
    };
  } catch (error) {
    console.error('Quick generate error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to generate resume'
    };
  }
}