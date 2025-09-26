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

export interface ProfileSnapshot {
  target_industry?: string;
  experience_level?: string;
  target_job_titles?: string;
  key_skills?: string;
  location?: string;
  snapshot_date: string;
}

export interface AIInsights {
  suggestions?: string[];
  improvements?: string[];
  keywords?: string[];
  ats_recommendations?: string[];
  industry_tips?: string[];
  last_analyzed?: string;
}

export interface SuccessMetrics {
  applications_sent?: number;
  responses_received?: number;
  interviews_scheduled?: number;
  offers_received?: number;
  last_success_date?: string;
  success_rate?: number;
}

export interface FeedbackData {
  user_rating?: number;
  improvement_suggestions?: string[];
  feedback_date?: string;
  helpful_features?: string[];
  pain_points?: string[];
}

export interface TemplateCustomizations {
  sections_added?: string[];
  sections_removed?: string[];
  sections_reordered?: boolean;
  color_scheme_changed?: boolean;
  layout_modifications?: string[];
  font_changes?: boolean;
  spacing_adjustments?: boolean;
}

export interface Resume {
  id: string;
  title: string;
  slug?: string;
  user: string;
  template?: string;
  content: Record<string, any>;
  is_public: boolean;
  created: string;
  updated: string;
  
  // Analytics & Tracking
  view_count?: number;
  last_viewed?: string;
  download_count?: number;
  share_count?: number;
  last_downloaded?: string;
  last_shared?: string;
  
  // Profile Integration
  profile_snapshot?: ProfileSnapshot;
  target_job?: string;
  target_company?: string;
  industry_focus?: string;
  experience_level?: string;
  
  // Quality & Optimization
  optimization_score?: number;
  completion_percentage?: number;
  personalization_level?: 'basic' | 'enhanced' | 'ai_optimized';
  ats_score?: number;
  
  // Organization & Management
  status?: 'draft' | 'active' | 'archived' | 'template';
  version?: number;
  tags?: string[];
  
  // AI & Intelligence
  ai_insights?: AIInsights;
  success_metrics?: SuccessMetrics;
  feedback_data?: FeedbackData;
  template_customizations?: TemplateCustomizations;
  
  expand?: {
    user?: User;
  };
}

export interface TemplateStarterData {
  personalInfo?: PersonalInfo;
  summary?: string;
  experience?: Experience[];
  education?: Education[];
  skills?: Skill[];
  projects?: Project[];
  settings?: Partial<BuilderSettings> & Partial<ResumeSettings> & { template?: string };
}

export interface TemplateStyleConfig {
  columns: 1 | 2;
  pages: 1 | 2;
  withImage: boolean;
  imagePosition?: 'left' | 'right' | 'top';
}

export interface TemplateStyleVariant {
  key: string;
  label: string;
  styleConfig: TemplateStyleConfig;
  settings?: Partial<ResumeSettings> & Partial<BuilderSettings> & { template?: string };
  previewImage?: string;
  previewImages?: string[];
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
  starterData?: TemplateStarterData;
  styleConfig?: TemplateStyleConfig;
  styles?: TemplateStyleVariant[];
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