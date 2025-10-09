/**
 * Client-side template configuration types
 * These extend the base ResumeTemplate type with additional client-side features
 */

import type { ResumeTemplate } from '$lib/types/resume';

export interface ClientTemplateConfig {
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  previewImages: string[];
  isPremium: boolean;
  tags: string[];
  settings: {
    template: string;
    colorScheme: string;
    fontSize: string;
    spacing: string;
    showProfileImage: boolean;
    sectionOrder: string[];
  };
  starterData: {
    personalInfo: {
      fullName: string;
      email: string;
      phone: string;
      location: string;
      website: string;
      linkedin: string;
      github: string;
      summary: string;
    };
    summary: string;
    experience: Array<{
      id: string;
      company: string;
      position: string;
      location: string;
      startDate: string;
      endDate: string;
      current: boolean;
      description: string;
      highlights: string[];
    }>;
    education: Array<{
      id: string;
      institution: string;
      degree: string;
      field: string;
      location: string;
      startDate: string;
      endDate: string;
      current: boolean;
      gpa: string;
      honors: string[];
      description: string;
    }>;
    skills: Array<{
      id: string;
      name: string;
      level: string;
      category: string;
    }>;
    projects: Array<{
      id: string;
      name: string;
      description: string;
      technologies: string[];
      url: string;
      github: string;
      startDate: string;
      endDate: string;
      current: boolean;
    }>;
    settings: {
      layout: string;
      mode: string;
      template: string;
      colorScheme: string;
      fontSize: string;
      spacing: string;
      showProfileImage: boolean;
      sectionOrder: string[];
    };
  };
  targeting?: {
    industries: string[];
    experience_levels: string[];
    job_types: string[];
  };
}

/**
 * Extended template type for client-side templates
 */
export interface ExtendedResumeTemplate extends ResumeTemplate {
  targeting?: {
    industries: string[];
    experience_levels: string[];
    job_types: string[];
  };
}