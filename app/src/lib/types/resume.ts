// Resume data types for Digital Resume Hub

export interface User {
  id: string;
  email: string;
  name?: string;
  username: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'enterprise';
  created: string;
  updated: string;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary?: string;
  profileImage?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  highlights: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: string;
  honors?: string[];
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
  startDate?: string;
  endDate?: string;
  highlights: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface Publication {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url?: string;
  description?: string;
}

export interface Volunteer {
  id: string;
  organization: string;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export interface Reference {
  id: string;
  name: string;
  title: string;
  company: string;
  email?: string;
  phone?: string;
  relationship: string;
}

export interface ResumeSection {
  id: string;
  type: 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'languages' | 'awards' | 'publications' | 'volunteer' | 'references' | 'custom';
  title: string;
  visible: boolean;
  order: number;
  data: any[];
}

export interface ResumeSettings {
  template: string;
  colorScheme: string;
  fontSize: 'small' | 'medium' | 'large';
  spacing: 'compact' | 'normal' | 'relaxed';
  showProfileImage: boolean;
  sectionOrder: string[];
  customCSS?: string;
}

export interface Resume {
  id: string;
  title: string;
  user: string;
  content: Record<string, any>;
  template?: string;
  is_public: boolean;
  slug?: string;
  created: string;
  updated: string;
  expand?: {
    user?: User;
  };
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  previewImages: string[];
  settings: ResumeSettings;
  sections: Omit<ResumeSection, 'data'>[];
  isPremium: boolean;
  isPopular: boolean;
  createdBy: string;
  createdAt: string;
  usageCount: number;
  rating: number;
  tags: string[];
}

export interface ResumeAnalytics {
  resumeId: string;
  views: {
    total: number;
    unique: number;
    byDate: { date: string; count: number }[];
    byCountry: { country: string; count: number }[];
    byReferrer: { referrer: string; count: number }[];
  };
  downloads: {
    total: number;
    byFormat: { format: string; count: number }[];
    byDate: { date: string; count: number }[];
  };
  shares: {
    total: number;
    byPlatform: { platform: string; count: number }[];
    byDate: { date: string; count: number }[];
  };
  engagement: {
    averageTimeOnPage: number;
    bounceRate: number;
    clickThroughRate: number;
  };
}

export interface ExportOptions {
  format: 'pdf' | 'docx' | 'html' | 'json';
  quality: 'draft' | 'standard' | 'high';
  includeAnalytics: boolean;
  watermark: boolean;
  customization?: {
    margins: { top: number; right: number; bottom: number; left: number };
    pageSize: 'A4' | 'Letter' | 'Legal';
    orientation: 'portrait' | 'landscape';
  };
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState {
  isValid: boolean;
  errors: ValidationError[];
  touched: Record<string, boolean>;
  isDirty: boolean;
}

// Editor state types
export interface EditorState {
  activeSection: string | null;
  activeItem: string | null;
  isEditing: boolean;
  hasUnsavedChanges: boolean;
  lastSaved: string | null;
  autoSaveEnabled: boolean;
}

// Search and filter types
export interface ResumeFilters {
  search?: string;
  tags?: string[];
  template?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  isPublic?: boolean;
  sortBy: 'updatedAt' | 'createdAt' | 'title' | 'viewCount';
  sortOrder: 'asc' | 'desc';
}

export interface TemplateFilters {
  category?: string;
  isPremium?: boolean;
  isPopular?: boolean;
  tags?: string[];
  rating?: number;
  sortBy: 'name' | 'createdAt' | 'usageCount' | 'rating';
  sortOrder: 'asc' | 'desc';
}

// Resume Builder specific types
export interface BuilderStep {
  id: string;
  title: string;
  description: string;
  isComplete: boolean;
  isRequired: boolean;
}

export interface CharacterLimits {
  summary: number;
  experienceDescription: number;
  projectDescription: number;
  skillName: number;
  achievementItem: number;
}

export interface BuilderSettings extends ResumeSettings {
  layout: '1-page' | '2-page';
  mode: 'simple' | 'elaborate';
}

export interface ResumeBuilderData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  settings: BuilderSettings;
  currentStep: string;
  completedSteps: string[];
}