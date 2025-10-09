// TypeScript type definitions for Digital Resume Hub

// User from users collection (authentication only)
export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  avatar?: string;
  created: string;
  updated: string;
}

// UserProfile from user_profiles collection (business logic)
export interface UserProfile {
  id: string;
  user: string; // Reference to users.id
  
  // Personal info
  first_name: string;
  last_name: string;
  phone?: string;
  location?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  
  // Career info
  target_industry?: string;
  experience_level?: string;
  target_job_titles?: string;
  key_skills?: string;
  career_stage?: string;
  
  // Role & Plan system
  role: 'job_seeker' | 'moderator' | 'admin';
  plan: 'free' | 'pro' | 'enterprise';
  plan_expires?: string; // ISO date string for subscription expiry
  plan_payment_id?: string; // Reference to payment/subscription
  verified: boolean; // Email verification status
  active: boolean; // Account active status
  last_login?: string;
  
  // Profile completion
  profile_completed: boolean;
  profile_completed_at?: string;
  
  // Additional fields
  preferred_work_type?: string;
  salary_expectation_min?: number;
  salary_expectation_max?: number;
  education_level?: string;
  certifications?: string;
  willing_to_relocate?: boolean;
  template_preferences?: any;
  onboarding_data?: any;
  
  // Student/Entry-level specific
  academic_projects?: string;
  volunteer_experience?: string;
  extracurricular_activities?: string;
  personal_projects?: string;
  internships_completed?: string;
  technical_proficiencies?: string;
  soft_skills_examples?: string;
  achievements_awards?: string;
  relevant_coursework?: string;
  
  created: string;
  updated: string;
}

// Combined user data (for convenience)
export interface UserWithProfile extends User {
  profile?: UserProfile;
}

export interface Template {
  id: string;
  name: string;
  slug: string;
  description?: string;
  preview_image?: string;
  category: 'professional' | 'creative' | 'minimal' | 'modern' | 'academic';
  is_premium: boolean;
  config: TemplateConfig;
  created: string;
  updated: string;
}

export interface TemplateConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  layout: {
    columns: number;
    spacing: string;
    margins: string;
  };
  sections: {
    order: string[];
    visibility: Record<string, boolean>;
  };
}

export interface Resume {
  id: string;
  title: string;
  slug?: string;
  user: string;
  template: string;
  content: ResumeContent;
  is_public: boolean;
  view_count: number;
  last_viewed?: string;
  created: string;
  updated: string;
}

export interface ResumeContent {
  personalInfo: PersonalInfo;
  summary?: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects?: Project[];
  certifications?: Certification[];
  languages?: Language[];
  interests?: string[];
  customSections?: CustomSection[];
}

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  photo?: string;
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
  achievements?: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location?: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  honors?: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years?: number;
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

export interface CustomSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'list' | 'table';
}

export interface ResumeView {
  id: string;
  resume: string;
  viewer_ip?: string;
  user_agent?: string;
  referrer?: string;
  country?: string;
  city?: string;
  device_type?: 'desktop' | 'mobile' | 'tablet';
  view_duration?: number;
  created: string;
}

export interface UserSettings {
  id: string;
  user: string;
  theme: 'light' | 'dark' | 'auto';
  email_notifications: boolean;
  analytics_enabled: boolean;
  public_profile: boolean;
  created: string;
  updated: string;
}

export interface AuthResponse {
  token: string;
  record: User;
}

export interface ApiResponse<T> {
  page?: number;
  perPage?: number;
  totalItems?: number;
  totalPages?: number;
  items?: T[];
}

export interface AnalyticsData {
  totalViews: number;
  uniqueViews: number;
  viewsThisWeek: number;
  viewsThisMonth: number;
  topCountries: Array<{ country: string; count: number }>;
  topReferrers: Array<{ referrer: string; count: number }>;
  deviceBreakdown: Array<{ device: string; count: number }>;
  viewsOverTime: Array<{ date: string; views: number }>;
}