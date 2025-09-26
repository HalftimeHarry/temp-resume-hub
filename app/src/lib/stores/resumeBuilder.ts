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

// Character limits for different sections
export const characterLimits: CharacterLimits = {
  summary: 300,
  experienceDescription: 150,
  projectDescription: 120,
  skillName: 30,
  achievementItem: 100
};

// Builder steps configuration
export const builderSteps: BuilderStep[] = [
  { id: 'personal', title: 'Personal Info', description: 'Basic contact information', isComplete: false, isRequired: true },
  { id: 'summary', title: 'Summary', description: 'Professional summary', isComplete: false, isRequired: true },
  { id: 'experience', title: 'Experience', description: 'Work history', isComplete: false, isRequired: true },
  { id: 'education', title: 'Education', description: 'Academic background', isComplete: false, isRequired: true },
  { id: 'skills', title: 'Skills', description: 'Technical & soft skills', isComplete: false, isRequired: true },
  { id: 'settings', title: 'Settings', description: 'Layout & formatting', isComplete: false, isRequired: false },
  { id: 'preview', title: 'Preview', description: 'Review & publish', isComplete: false, isRequired: false }
];

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
  completedSteps: ['personal', 'summary', 'experience', 'education', 'skills']
};

// Stores
export const builderData = writable<ResumeBuilderData>(defaultBuilderData);
export const currentStep = writable<string>('personal');
export const isLoading = writable<boolean>(false);
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

    // Create resume record in PocketBase
    const resumeData = {
      user: currentUser.id,
      title: `${currentUser.name || currentData.personalInfo.fullName || 'Untitled'} - ${templateName}`,
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
      is_public: false
    };

    const record = await pb.collection('resumes').create(resumeData);
    console.log('Resume saved successfully:', record.id);
    
    hasUnsavedChanges.set(false);
    return record;
  } catch (error) {
    console.error('Failed to save resume:', error);
    throw error;
  } finally {
    isLoading.set(false);
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

    // Generate a unique slug for the resume
    const slug = `${currentUser.username}-${currentData.personalInfo.fullName?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'resume'}-${Date.now()}`;

    // Create or update resume record in PocketBase
    const resumeData = {
      user: currentUser.id,
      title: `${currentUser.name || currentData.personalInfo.fullName || 'Untitled'} - ${templateName}`,
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
      is_public: true,
      slug: slug
    };

    const record = await pb.collection('resumes').create(resumeData);
    const publicUrl = `${window.location.origin}/resume/${record.slug}`;
    
    console.log('Resume published successfully:', publicUrl);
    
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