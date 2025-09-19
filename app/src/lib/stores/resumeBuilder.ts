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
    fullName: 'DUSTIN DINSMORE',
    email: 'ddinsmore8@gmail.com',
    phone: '+16262223107',
    location: 'San Diego, CA',
    website: 'https://dustind.netlify.app/',
    linkedin: 'https://www.linkedin.com/in/dustin-dinsmore-b38a47159/',
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

    // Create resume record in PocketBase
    const resumeData = {
      user: currentUser.id,
      title: `${currentData.personalInfo.fullName || 'Untitled'} Resume`,
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

    // Generate a unique slug for the resume
    const slug = `${currentUser.username}-${currentData.personalInfo.fullName?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'resume'}-${Date.now()}`;

    // Create or update resume record in PocketBase
    const resumeData = {
      user: currentUser.id,
      title: `${currentData.personalInfo.fullName || 'Untitled'} Resume`,
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