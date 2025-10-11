import type { UserProfile } from '$lib/types';
import type { ExtendedResumeTemplate } from '$lib/templates/types';
import type {
  ResumeBuilderData,
  PersonalInfo,
  Experience,
  Education,
  Skill,
  Project
} from '$lib/types/resume';
import { generateId } from '$lib/utils';

/**
 * Strategy Pattern for Resume Generation
 * 
 * This module implements the Strategy pattern to support different approaches
 * to resume generation based on user experience level, industry, or preferences.
 * 
 * @example
 * ```typescript
 * const strategy = ResumeStrategyFactory.getStrategy(profile);
 * const resume = strategy.generateResume(profile, template);
 * ```
 */

/**
 * Core interface for resume generation strategies
 * 
 * All resume generation strategies must implement this interface.
 * Each strategy can have its own approach to generating resume sections.
 */
export interface ResumeStrategy {
  /**
   * Generates a complete resume draft
   * 
   * @param profile - User profile data
   * @param template - Resume template configuration
   * @param targetIndustry - Optional target industry override
   * @returns Complete resume builder data
   */
  generateResume(
    profile: UserProfile,
    template: ExtendedResumeTemplate,
    targetIndustry?: string
  ): ResumeBuilderData;

  /**
   * Returns the name of this strategy
   */
  getStrategyName(): string;

  /**
   * Determines if this strategy is suitable for the given profile
   * 
   * @param profile - User profile to evaluate
   * @returns true if this strategy should be used
   */
  isApplicable(profile: UserProfile): boolean;
}

/**
 * Abstract base class providing common resume generation logic
 * 
 * This class implements shared functionality that all strategies can use,
 * while allowing specific strategies to override methods as needed.
 */
export abstract class BaseResumeStrategy implements ResumeStrategy {
  protected profile!: UserProfile;
  protected template!: ExtendedResumeTemplate;
  protected targetIndustry!: string;

  abstract getStrategyName(): string;
  abstract isApplicable(profile: UserProfile): boolean;

  /**
   * Template method for resume generation
   * 
   * Defines the skeleton of the resume generation algorithm.
   * Subclasses can override specific steps while maintaining the overall structure.
   */
  public generateResume(
    profile: UserProfile,
    template: ExtendedResumeTemplate,
    targetIndustry?: string
  ): ResumeBuilderData {
    this.profile = profile;
    this.template = template;
    this.targetIndustry = targetIndustry || profile.target_industry || '';

    return {
      personalInfo: this.generatePersonalInfo(),
      summary: this.generateSummary(),
      experience: this.generateExperience(),
      education: this.generateEducation(),
      skills: this.generateSkills(),
      projects: this.generateProjects(),
      settings: this.generateSettings(),
      currentStep: 'personal',
      completedSteps: []
    };
  }

  /**
   * Generates personal information section
   * 
   * Common implementation that can be overridden by specific strategies.
   */
  protected generatePersonalInfo(): PersonalInfo {
    const templatePersonal = this.template.starterData?.personalInfo;
    const firstName = (this.profile.first_name || '').trim();
    const lastName = (this.profile.last_name || '').trim();
    const profileFullName = `${firstName} ${lastName}`.replace(/\s+/g, ' ').trim();

    return {
      fullName: this.smartMergeField(
        profileFullName,
        templatePersonal?.fullName,
        ['John Doe', 'Dustin Dinsmore', 'Jane Smith', 'Your Name']
      ),
      email: this.smartMergeField(
        this.profile.user,
        templatePersonal?.email,
        ['john.doe@email.com', 'email@example.com', 'your.email@example.com']
      ),
      phone: this.smartMergeField(
        this.profile.phone,
        templatePersonal?.phone,
        ['(555) 123-4567', '555-123-4567', '123-456-7890']
      ),
      location: this.smartMergeField(
        this.profile.location,
        templatePersonal?.location,
        ['Your City, State', 'City, State']
      ),
      website: this.smartMergeField(
        this.profile.portfolio_url,
        templatePersonal?.website,
        ['johndoe.com', 'yourwebsite.com', 'example.com']
      ),
      linkedin: this.smartMergeField(
        this.profile.linkedin_url,
        templatePersonal?.linkedin,
        ['linkedin.com/in/johndoe']
      ),
      github: this.smartMergeField(
        this.profile.github_url,
        templatePersonal?.github,
        ['github.com/johndoe']
      ),
      summary: templatePersonal?.summary || ''
    };
  }

  /**
   * Generates professional summary
   * 
   * Can be overridden by strategies that need custom summary generation.
   */
  protected generateSummary(): string {
    if (this.profile.professional_summary && this.profile.professional_summary.trim().length > 0) {
      return this.profile.professional_summary.trim();
    }
    return this.template.starterData?.summary || '';
  }

  /**
   * Generates experience section
   * 
   * Abstract method - must be implemented by concrete strategies.
   */
  protected abstract generateExperience(): Experience[];

  /**
   * Generates education section
   * 
   * Abstract method - must be implemented by concrete strategies.
   */
  protected abstract generateEducation(): Education[];

  /**
   * Generates skills section
   * 
   * Abstract method - must be implemented by concrete strategies.
   */
  protected abstract generateSkills(): Skill[];

  /**
   * Generates projects section
   * 
   * Abstract method - must be implemented by concrete strategies.
   */
  protected abstract generateProjects(): Project[];

  /**
   * Generates settings configuration
   */
  protected generateSettings() {
    return {
      layout: this.template.starterData?.settings?.layout || '1-page',
      mode: this.template.starterData?.settings?.mode || 'simple',
      template: this.template.settings.template,
      colorScheme: this.template.settings.colorScheme,
      fontSize: this.template.settings.fontSize as 'small' | 'medium' | 'large',
      spacing: this.template.settings.spacing as 'compact' | 'normal' | 'relaxed',
      showProfileImage: this.template.settings.showProfileImage,
      sectionOrder: this.template.settings.sectionOrder
    };
  }

  /**
   * Smart field merging with placeholder detection
   */
  protected smartMergeField(
    profileValue: string | undefined,
    templateValue: string | undefined,
    placeholders: string[] = []
  ): string {
    if (profileValue && profileValue.trim().length > 0) {
      return profileValue.trim();
    }

    if (templateValue && templateValue.trim().length > 0) {
      const normalizedTemplate = templateValue.trim().toLowerCase();
      const isPlaceholder = placeholders.some(
        placeholder => normalizedTemplate === placeholder.toLowerCase()
      );
      
      if (!isPlaceholder) {
        return templateValue.trim();
      }
    }

    return '';
  }

  /**
   * Parses a string list with multiple separator formats
   */
  protected parseStringList(str: string): string[] {
    if (str.includes('\n')) {
      return str.split('\n').map(item => item.trim()).filter(item => item.length > 0);
    }
    if (str.includes(',')) {
      return str.split(',').map(item => item.trim()).filter(item => item.length > 0);
    }
    return [str.trim()];
  }

  /**
   * Determines default skill level based on experience
   */
  protected getDefaultSkillLevel(): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
    const experienceLevel = this.profile.experience_level?.toLowerCase() || '';

    if (experienceLevel.includes('student') || experienceLevel.includes('entry')) {
      return 'beginner';
    }
    if (experienceLevel.includes('junior')) {
      return 'intermediate';
    }
    if (experienceLevel.includes('mid') || experienceLevel.includes('intermediate')) {
      return 'intermediate';
    }
    if (experienceLevel.includes('senior') || experienceLevel.includes('lead')) {
      return 'advanced';
    }
    if (experienceLevel.includes('principal') || experienceLevel.includes('staff') || 
        experienceLevel.includes('architect') || experienceLevel.includes('expert')) {
      return 'expert';
    }

    return 'intermediate';
  }

  /**
   * Parses highlights/achievements from experience data
   */
  protected parseHighlights(exp: any): string[] {
    if (Array.isArray(exp.highlights)) {
      return exp.highlights.filter((h: any) => h && typeof h === 'string');
    }
    if (Array.isArray(exp.achievements)) {
      return exp.achievements.filter((a: any) => a && typeof a === 'string');
    }
    if (typeof exp.highlights === 'string' && exp.highlights.trim().length > 0) {
      return this.parseStringList(exp.highlights);
    }
    if (typeof exp.achievements === 'string' && exp.achievements.trim().length > 0) {
      return this.parseStringList(exp.achievements);
    }
    return [];
  }
}

/**
 * Strategy for experienced professionals
 * 
 * Focuses on work experience and professional achievements.
 * Expects structured data and emphasizes career progression.
 */
export class ExperiencedProfessionalStrategy extends BaseResumeStrategy {
  getStrategyName(): string {
    return 'ExperiencedProfessional';
  }

  isApplicable(profile: UserProfile): boolean {
    const experienceLevel = profile.experience_level?.toLowerCase() || '';
    return (
      experienceLevel.includes('senior') ||
      experienceLevel.includes('lead') ||
      experienceLevel.includes('principal') ||
      experienceLevel.includes('staff') ||
      experienceLevel.includes('architect')
    );
  }

  protected generateExperience(): Experience[] {
    // Experienced professionals should have structured work experience
    if (this.profile.work_experience) {
      try {
        let experienceData: any[];
        
        if (Array.isArray(this.profile.work_experience)) {
          experienceData = this.profile.work_experience;
        } else if (typeof this.profile.work_experience === 'string') {
          experienceData = JSON.parse(this.profile.work_experience);
        } else {
          return this.template.starterData?.experience || [];
        }

        // If empty array, fall back to template
        if (experienceData.length === 0) {
          return this.template.starterData?.experience || [];
        }

        return experienceData.map((exp: any) => ({
          id: generateId(),
          company: exp.company || exp.employer || '',
          position: exp.position || exp.title || exp.role || '',
          location: exp.location || '',
          startDate: exp.start_date || exp.startDate || '',
          endDate: exp.end_date || exp.endDate || '',
          current: exp.current || exp.is_current || false,
          description: exp.description || exp.summary || '',
          highlights: this.parseHighlights(exp)
        }));
      } catch (error) {
        console.error('Failed to parse experience:', error);
      }
    }

    return this.template.starterData?.experience || [];
  }

  protected generateEducation(): Education[] {
    if (this.profile.education) {
      try {
        let educationData: any[];
        
        if (Array.isArray(this.profile.education)) {
          educationData = this.profile.education;
        } else if (typeof this.profile.education === 'string') {
          educationData = JSON.parse(this.profile.education);
        } else {
          return this.template.starterData?.education || [];
        }

        // If empty array, fall back to template
        if (educationData.length === 0) {
          return this.template.starterData?.education || [];
        }

        return educationData.map((edu: any) => ({
          id: generateId(),
          institution: edu.institution || edu.school || edu.university || '',
          degree: edu.degree || edu.degree_type || '',
          field: edu.field || edu.field_of_study || edu.major || '',
          location: edu.location || '',
          startDate: edu.start_date || edu.startDate || '',
          endDate: edu.end_date || edu.endDate || '',
          current: edu.current || edu.is_current || false,
          gpa: edu.gpa || edu.grade || '',
          honors: Array.isArray(edu.honors) ? edu.honors : [],
          description: edu.description || ''
        }));
      } catch (error) {
        console.error('Failed to parse education:', error);
      }
    }

    return this.template.starterData?.education || [];
  }

  protected generateSkills(): Skill[] {
    const skillsMap = new Map<string, Skill>();
    const defaultLevel = this.getDefaultSkillLevel();

    if (this.profile.key_skills) {
      const userSkills = this.parseStringList(this.profile.key_skills);
      userSkills.forEach(skillName => {
        const normalizedName = skillName.toLowerCase().trim();
        if (!skillsMap.has(normalizedName)) {
          skillsMap.set(normalizedName, {
            id: generateId(),
            name: skillName,
            level: defaultLevel,
            category: 'Technical'
          });
        }
      });
    }

    // Merge with template skills
    const templateSkills = this.template.starterData?.skills || [];
    templateSkills.forEach(templateSkill => {
      const normalizedName = templateSkill.name.toLowerCase().trim();
      if (!skillsMap.has(normalizedName)) {
        skillsMap.set(normalizedName, { ...templateSkill, id: generateId() });
      }
    });

    return Array.from(skillsMap.values());
  }

  protected generateProjects(): Project[] {
    if (this.profile.projects) {
      try {
        let projectsData: any[];
        
        if (Array.isArray(this.profile.projects)) {
          projectsData = this.profile.projects;
        } else if (typeof this.profile.projects === 'string') {
          projectsData = JSON.parse(this.profile.projects);
        } else {
          return this.template.starterData?.projects || [];
        }

        return projectsData.map((proj: any) => ({
          id: generateId(),
          name: proj.name || proj.title || 'Project',
          description: proj.description || proj.summary || '',
          technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
          url: proj.url || proj.link || '',
          github: proj.github || proj.github_url || '',
          startDate: proj.start_date || proj.startDate || '',
          endDate: proj.end_date || proj.endDate || '',
          highlights: Array.isArray(proj.highlights) ? proj.highlights : []
        }));
      } catch (error) {
        console.error('Failed to parse projects:', error);
      }
    }

    return this.template.starterData?.projects || [];
  }
}

/**
 * Strategy for experienced job seekers
 * 
 * Prioritizes profile data over template data for all sections.
 * Uses profile work experience, education, and professional summary as primary sources.
 * Only falls back to template when profile data is missing or invalid.
 */
export class ExperiencedJobSeekerStrategy extends BaseResumeStrategy {
  getStrategyName(): string {
    return 'ExperiencedJobSeeker';
  }

  isApplicable(profile: UserProfile): boolean {
    // Applicable for job seekers with work experience data
    // Not students or entry-level without experience
    const experienceLevel = profile.experience_level?.toLowerCase() || '';
    const careerStage = profile.career_stage?.toLowerCase() || '';
    
    // Exclude students and pure entry-level
    if (experienceLevel.includes('student') || careerStage === 'student') {
      return false;
    }
    
    // Must have work experience data
    const hasWorkExperience = !!(
      profile.work_experience && 
      (
        (typeof profile.work_experience === 'string' && profile.work_experience.trim().length > 0) ||
        (Array.isArray(profile.work_experience) && profile.work_experience.length > 0)
      )
    );
    
    // Applicable for anyone with work experience who isn't a student
    return hasWorkExperience && (
      experienceLevel.includes('junior') ||
      experienceLevel.includes('mid') ||
      experienceLevel.includes('intermediate') ||
      experienceLevel.includes('entry') ||
      careerStage === 'professional' ||
      careerStage === 'entry'
    );
  }

  protected generateSummary(): string {
    // Prioritize profile professional summary
    if (this.profile.professional_summary && this.profile.professional_summary.trim().length > 0) {
      return this.profile.professional_summary.trim();
    }
    
    // Fall back to template summary only if profile has none
    return this.template.starterData?.summary || '';
  }

  protected generateExperience(): Experience[] {
    // Profile work experience is the primary source
    if (this.profile.work_experience) {
      try {
        let experienceData: any[];
        
        if (Array.isArray(this.profile.work_experience)) {
          experienceData = this.profile.work_experience;
        } else if (typeof this.profile.work_experience === 'string') {
          experienceData = JSON.parse(this.profile.work_experience);
        } else {
          return this.template.starterData?.experience || [];
        }

        // Only fall back to template if profile data is empty
        if (experienceData.length === 0) {
          return this.template.starterData?.experience || [];
        }

        return experienceData.map((exp: any) => ({
          id: generateId(),
          company: exp.company || exp.employer || '',
          position: exp.position || exp.title || exp.role || '',
          location: exp.location || '',
          startDate: exp.start_date || exp.startDate || '',
          endDate: exp.end_date || exp.endDate || '',
          current: exp.current || exp.is_current || false,
          description: exp.description || exp.summary || '',
          highlights: this.parseHighlights(exp)
        }));
      } catch (error) {
        console.error('Failed to parse experience:', error);
      }
    }

    return this.template.starterData?.experience || [];
  }

  protected generateEducation(): Education[] {
    // Profile education is the primary source
    if (this.profile.education) {
      try {
        let educationData: any[];
        
        if (Array.isArray(this.profile.education)) {
          educationData = this.profile.education;
        } else if (typeof this.profile.education === 'string') {
          educationData = JSON.parse(this.profile.education);
        } else {
          return this.template.starterData?.education || [];
        }

        // Only fall back to template if profile data is empty
        if (educationData.length === 0) {
          return this.template.starterData?.education || [];
        }

        return educationData.map((edu: any) => ({
          id: generateId(),
          institution: edu.institution || edu.school || edu.university || '',
          degree: edu.degree || edu.degree_type || '',
          field: edu.field || edu.field_of_study || edu.major || '',
          location: edu.location || '',
          startDate: edu.start_date || edu.startDate || '',
          endDate: edu.end_date || edu.endDate || '',
          current: edu.current || false,
          gpa: edu.gpa || '',
          honors: Array.isArray(edu.honors) ? edu.honors : [],
          description: edu.description || ''
        }));
      } catch (error) {
        console.error('Failed to parse education:', error);
      }
    }

    return this.template.starterData?.education || [];
  }

  protected generateSkills(): Skill[] {
    // Merge profile and template skills, prioritizing profile
    const skillsMap = new Map<string, Skill>();
    const defaultLevel = this.getDefaultSkillLevel();

    // Start with template skills as base
    const templateSkills = this.template.starterData?.skills || [];
    templateSkills.forEach(skill => {
      const normalizedName = skill.name.toLowerCase().trim();
      skillsMap.set(normalizedName, { ...skill, id: generateId() });
    });

    // Parse and merge profile key_skills
    if (this.profile.key_skills) {
      const profileSkills = this.parseStringList(this.profile.key_skills);
      profileSkills.forEach(skillName => {
        const normalizedName = skillName.toLowerCase().trim();
        if (skillsMap.has(normalizedName)) {
          // Keep template skill but update level based on profile experience
          const existingSkill = skillsMap.get(normalizedName)!;
          skillsMap.set(normalizedName, {
            ...existingSkill,
            level: defaultLevel
          });
        } else {
          // Add new skill from profile
          skillsMap.set(normalizedName, {
            id: generateId(),
            name: skillName,
            level: defaultLevel,
            category: 'Technical Skills'
          });
        }
      });
    }

    return Array.from(skillsMap.values());
  }

  protected generateProjects(): Project[] {
    // Parse profile projects if available
    if (this.profile.projects) {
      try {
        let projectsData: any[];
        
        if (Array.isArray(this.profile.projects)) {
          projectsData = this.profile.projects;
        } else if (typeof this.profile.projects === 'string') {
          projectsData = JSON.parse(this.profile.projects);
        } else {
          return this.template.starterData?.projects || [];
        }

        if (projectsData.length === 0) {
          return this.template.starterData?.projects || [];
        }

        return projectsData.map((proj: any) => ({
          id: generateId(),
          name: proj.name || proj.title || 'Project',
          description: proj.description || proj.summary || '',
          technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
          url: proj.url || proj.link || '',
          github: proj.github || proj.github_url || '',
          startDate: proj.start_date || proj.startDate || '',
          endDate: proj.end_date || proj.endDate || '',
          highlights: Array.isArray(proj.highlights) ? proj.highlights : []
        }));
      } catch (error) {
        console.error('Failed to parse projects:', error);
      }
    }

    return this.template.starterData?.projects || [];
  }
}

/**
 * Strategy for career changers
 * 
 * Adapts existing work experience to target a new industry.
 * Highlights transferable skills and reframes job descriptions
 * to emphasize relevance to the new career path.
 */
export class CareerChangerStrategy extends BaseResumeStrategy {
  getStrategyName(): string {
    return 'CareerChanger';
  }

  isApplicable(profile: UserProfile): boolean {
    const careerStage = profile.career_stage?.toLowerCase() || '';
    
    // Must have work experience to be a career changer
    const hasWorkExperience = !!(
      profile.work_experience && 
      (
        (typeof profile.work_experience === 'string' && profile.work_experience.trim().length > 0) ||
        (Array.isArray(profile.work_experience) && profile.work_experience.length > 0)
      )
    );
    
    if (!hasWorkExperience) {
      return false;
    }
    
    // Explicitly marked as career changer
    if (careerStage === 'career_change' || careerStage === 'career-change') {
      return true;
    }
    
    // Or has transition career stage with target industry
    const hasTargetIndustry = !!(profile.target_industry && profile.target_industry.trim().length > 0);
    
    return careerStage.includes('transition') && hasTargetIndustry;
  }

  protected generateSummary(): string {
    // Generate career change summary that bridges old and new industries
    if (this.profile.professional_summary && this.profile.professional_summary.trim().length > 0) {
      return this.profile.professional_summary.trim();
    }
    
    // Create a career change focused summary
    const targetIndustry = this.targetIndustry || this.profile.target_industry || '';
    const experienceLevel = this.profile.experience_level || '';
    
    if (targetIndustry) {
      const industryName = this.formatIndustryName(targetIndustry);
      return `Professional transitioning to ${industryName} with proven track record of success. Bringing transferable skills in problem-solving, communication, and leadership. Eager to apply diverse experience to drive results in a new industry.`;
    }
    
    return this.template.starterData?.summary || '';
  }

  protected generateExperience(): Experience[] {
    // Parse and reframe experience for target industry
    if (this.profile.work_experience) {
      try {
        let experienceData: any[];
        
        if (Array.isArray(this.profile.work_experience)) {
          experienceData = this.profile.work_experience;
        } else if (typeof this.profile.work_experience === 'string') {
          experienceData = JSON.parse(this.profile.work_experience);
        } else {
          return this.template.starterData?.experience || [];
        }

        if (experienceData.length === 0) {
          return this.template.starterData?.experience || [];
        }

        // Reframe each experience for target industry
        return experienceData.map((exp: any) => ({
          id: generateId(),
          company: exp.company || exp.employer || '',
          position: exp.position || exp.title || exp.role || '',
          location: exp.location || '',
          startDate: exp.start_date || exp.startDate || '',
          endDate: exp.end_date || exp.endDate || '',
          current: exp.current || exp.is_current || false,
          description: this.reframeDescription(exp.description || exp.summary || ''),
          highlights: this.reframeHighlights(this.parseHighlights(exp))
        }));
      } catch (error) {
        console.error('Failed to parse experience:', error);
      }
    }

    return this.template.starterData?.experience || [];
  }

  protected generateEducation(): Education[] {
    // Use profile education
    if (this.profile.education) {
      try {
        let educationData: any[];
        
        if (Array.isArray(this.profile.education)) {
          educationData = this.profile.education;
        } else if (typeof this.profile.education === 'string') {
          educationData = JSON.parse(this.profile.education);
        } else {
          return this.template.starterData?.education || [];
        }

        if (educationData.length === 0) {
          return this.template.starterData?.education || [];
        }

        return educationData.map((edu: any) => ({
          id: generateId(),
          institution: edu.institution || edu.school || edu.university || '',
          degree: edu.degree || edu.degree_type || '',
          field: edu.field || edu.field_of_study || edu.major || '',
          location: edu.location || '',
          startDate: edu.start_date || edu.startDate || '',
          endDate: edu.end_date || edu.endDate || '',
          current: edu.current || false,
          gpa: edu.gpa || '',
          honors: Array.isArray(edu.honors) ? edu.honors : [],
          description: edu.description || ''
        }));
      } catch (error) {
        console.error('Failed to parse education:', error);
      }
    }

    return this.template.starterData?.education || [];
  }

  protected generateSkills(): Skill[] {
    // Highlight transferable skills
    const skillsMap = new Map<string, Skill>();
    const defaultLevel = this.getDefaultSkillLevel();

    // Get template skills (target industry skills)
    const templateSkills = this.template.starterData?.skills || [];
    templateSkills.forEach(skill => {
      const normalizedName = skill.name.toLowerCase().trim();
      skillsMap.set(normalizedName, { ...skill, id: generateId() });
    });

    // Add profile skills (transferable skills)
    if (this.profile.key_skills) {
      const profileSkills = this.parseStringList(this.profile.key_skills);
      profileSkills.forEach(skillName => {
        const normalizedName = skillName.toLowerCase().trim();
        if (skillsMap.has(normalizedName)) {
          // Skill exists in template - mark as transferable
          const existingSkill = skillsMap.get(normalizedName)!;
          skillsMap.set(normalizedName, {
            ...existingSkill,
            level: defaultLevel
          });
        } else {
          // Add as transferable skill
          skillsMap.set(normalizedName, {
            id: generateId(),
            name: skillName,
            level: defaultLevel,
            category: 'Transferable Skills'
          });
        }
      });
    }

    return Array.from(skillsMap.values());
  }

  protected generateProjects(): Project[] {
    // Include relevant projects
    if (this.profile.projects) {
      try {
        let projectsData: any[];
        
        if (Array.isArray(this.profile.projects)) {
          projectsData = this.profile.projects;
        } else if (typeof this.profile.projects === 'string') {
          projectsData = JSON.parse(this.profile.projects);
        } else {
          return this.template.starterData?.projects || [];
        }

        if (projectsData.length === 0) {
          return this.template.starterData?.projects || [];
        }

        return projectsData.map((proj: any) => ({
          id: generateId(),
          name: proj.name || proj.title || 'Project',
          description: this.reframeDescription(proj.description || proj.summary || ''),
          technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
          url: proj.url || proj.link || '',
          github: proj.github || proj.github_url || '',
          startDate: proj.start_date || proj.startDate || '',
          endDate: proj.end_date || proj.endDate || '',
          highlights: this.reframeHighlights(Array.isArray(proj.highlights) ? proj.highlights : [])
        }));
      } catch (error) {
        console.error('Failed to parse projects:', error);
      }
    }

    return this.template.starterData?.projects || [];
  }

  /**
   * Reframes job description to emphasize transferable skills
   */
  private reframeDescription(description: string): string {
    if (!description || description.trim().length === 0) {
      return description;
    }

    // Add industry keywords from template if available
    const targetIndustry = this.targetIndustry || this.profile.target_industry || '';
    
    // For now, return as-is. In production, this could use AI or keyword mapping
    return description;
  }

  /**
   * Reframes highlights to emphasize relevance to target industry
   */
  private reframeHighlights(highlights: string[]): string[] {
    if (!highlights || highlights.length === 0) {
      return highlights;
    }

    // Prioritize highlights with transferable skills keywords
    const transferableKeywords = [
      'led', 'managed', 'improved', 'increased', 'reduced', 'developed',
      'created', 'implemented', 'collaborated', 'communicated', 'analyzed',
      'problem-solving', 'leadership', 'team', 'project', 'customer'
    ];

    // Sort highlights to put transferable skills first
    return highlights.sort((a, b) => {
      const aHasKeyword = transferableKeywords.some(keyword => 
        a.toLowerCase().includes(keyword)
      );
      const bHasKeyword = transferableKeywords.some(keyword => 
        b.toLowerCase().includes(keyword)
      );
      
      if (aHasKeyword && !bHasKeyword) return -1;
      if (!aHasKeyword && bHasKeyword) return 1;
      return 0;
    });
  }

  /**
   * Formats industry name for display
   */
  private formatIndustryName(industry: string): string {
    return industry
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

/**
 * Strategy for first-time job seekers
 * 
 * Uses template examples for experience and skills while incorporating
 * profile contact information. Ideal for users with no work experience
 * who need professional-looking resume examples.
 */
export class FirstTimeJobSeekerStrategy extends BaseResumeStrategy {
  getStrategyName(): string {
    return 'FirstTimeJobSeeker';
  }

  isApplicable(profile: UserProfile): boolean {
    const experienceLevel = profile.experience_level?.toLowerCase() || '';
    const careerStage = profile.career_stage?.toLowerCase() || '';
    
    // Applicable for first-time job seekers without work experience
    const isFirstTimer = (
      experienceLevel.includes('entry') ||
      experienceLevel.includes('first') ||
      careerStage === 'entry' ||
      careerStage === 'first-time'
    );
    
    // Must NOT have work experience
    const hasNoWorkExperience = !(
      profile.work_experience && 
      (
        (typeof profile.work_experience === 'string' && profile.work_experience.trim().length > 0) ||
        (Array.isArray(profile.work_experience) && profile.work_experience.length > 0)
      )
    );
    
    // Not a student (students have their own strategy)
    const notStudent = !(
      experienceLevel.includes('student') ||
      careerStage === 'student'
    );
    
    return isFirstTimer && hasNoWorkExperience && notStudent;
  }

  protected generateSummary(): string {
    // Adapt template summary for first-time context
    const templateSummary = this.template.starterData?.summary || '';
    
    // If profile has a summary, use it
    if (this.profile.professional_summary && this.profile.professional_summary.trim().length > 0) {
      return this.profile.professional_summary.trim();
    }
    
    // Otherwise, use template summary (which should be appropriate for entry-level)
    return templateSummary;
  }

  protected generateExperience(): Experience[] {
    // Use template experience examples
    // This gives first-time job seekers professional examples to work from
    return this.template.starterData?.experience || [];
  }

  protected generateEducation(): Education[] {
    // Try to use profile education if available
    if (this.profile.education) {
      try {
        let educationData: any[];
        
        if (Array.isArray(this.profile.education)) {
          educationData = this.profile.education;
        } else if (typeof this.profile.education === 'string') {
          educationData = JSON.parse(this.profile.education);
        } else {
          return this.createEducationFromLevel();
        }

        if (educationData.length === 0) {
          return this.createEducationFromLevel();
        }

        return educationData.map((edu: any) => ({
          id: generateId(),
          institution: edu.institution || edu.school || '',
          degree: edu.degree || '',
          field: edu.field || edu.major || '',
          location: edu.location || '',
          startDate: edu.start_date || edu.startDate || '',
          endDate: edu.end_date || edu.endDate || '',
          current: edu.current || false,
          gpa: edu.gpa || '',
          honors: Array.isArray(edu.honors) ? edu.honors : [],
          description: edu.description || ''
        }));
      } catch (error) {
        console.error('Failed to parse education:', error);
      }
    }

    return this.createEducationFromLevel();
  }

  protected generateSkills(): Skill[] {
    // Use template skills as base (professional examples)
    const skillsMap = new Map<string, Skill>();
    
    // Start with template skills
    const templateSkills = this.template.starterData?.skills || [];
    templateSkills.forEach(skill => {
      const normalizedName = skill.name.toLowerCase().trim();
      skillsMap.set(normalizedName, { ...skill, id: generateId() });
    });

    // Add profile skills if available (but keep template as primary)
    if (this.profile.key_skills) {
      const profileSkills = this.parseStringList(this.profile.key_skills);
      profileSkills.forEach(skillName => {
        const normalizedName = skillName.toLowerCase().trim();
        if (!skillsMap.has(normalizedName)) {
          skillsMap.set(normalizedName, {
            id: generateId(),
            name: skillName,
            level: 'beginner',
            category: 'Technical Skills'
          });
        }
      });
    }

    return Array.from(skillsMap.values());
  }

  protected generateProjects(): Project[] {
    const projects: Project[] = [];

    // Include academic projects if available
    if (this.profile.academic_projects && this.profile.academic_projects.trim().length > 0) {
      projects.push({
        id: generateId(),
        name: 'Academic Project',
        description: this.profile.academic_projects.trim(),
        technologies: [],
        highlights: []
      });
    }

    // Include personal projects
    if (this.profile.personal_projects && this.profile.personal_projects.trim().length > 0) {
      projects.push({
        id: generateId(),
        name: 'Personal Project',
        description: this.profile.personal_projects.trim(),
        technologies: [],
        highlights: []
      });
    }

    // Include volunteer experience if available
    if (this.profile.volunteer_experience && this.profile.volunteer_experience.trim().length > 0) {
      projects.push({
        id: generateId(),
        name: 'Volunteer Experience',
        description: this.profile.volunteer_experience.trim(),
        technologies: [],
        highlights: []
      });
    }

    // If no profile projects, use template projects
    if (projects.length === 0) {
      return this.template.starterData?.projects || [];
    }

    return projects;
  }

  private createEducationFromLevel(): Education[] {
    if (this.profile.education_level) {
      const level = this.profile.education_level.toLowerCase().trim();
      const degreeMap: Record<string, string> = {
        'bachelor': "Bachelor's Degree",
        'bachelors': "Bachelor's Degree",
        'master': "Master's Degree",
        'masters': "Master's Degree",
        'associate': "Associate's Degree"
      };

      const degree = degreeMap[level] || this.profile.education_level;
      
      if (degree.length >= 3) {
        return [{
          id: generateId(),
          institution: '',
          degree: degree,
          field: '',
          location: '',
          startDate: '',
          endDate: '',
          current: true,
          gpa: '',
          honors: [],
          description: ''
        }];
      }
    }

    return this.template.starterData?.education || [];
  }
}

/**
 * Strategy for students and first-time job seekers
 * 
 * Emphasizes education, projects, and potential over experience.
 * Parses academic projects, volunteer work, and extracurricular activities.
 */
export class StudentStrategy extends BaseResumeStrategy {
  getStrategyName(): string {
    return 'Student';
  }

  isApplicable(profile: UserProfile): boolean {
    const experienceLevel = profile.experience_level?.toLowerCase() || '';
    return (
      experienceLevel.includes('student') ||
      experienceLevel.includes('entry') ||
      profile.career_stage === 'student'
    );
  }

  protected generateExperience(): Experience[] {
    // Students typically don't have professional work experience
    // They should focus on projects, internships, and academic work instead
    // Return empty array to emphasize education and projects sections
    return [];
  }

  protected generateEducation(): Education[] {
    // Try structured data first
    if (this.profile.education) {
      try {
        let educationData: any[];
        
        if (Array.isArray(this.profile.education)) {
          educationData = this.profile.education;
        } else if (typeof this.profile.education === 'string') {
          educationData = JSON.parse(this.profile.education);
        } else {
          return this.createEducationFromLevel();
        }

        return educationData.map((edu: any) => ({
          id: generateId(),
          institution: edu.institution || edu.school || '',
          degree: edu.degree || '',
          field: edu.field || edu.major || '',
          location: edu.location || '',
          startDate: edu.start_date || edu.startDate || '',
          endDate: edu.end_date || edu.endDate || '',
          current: edu.current || false,
          gpa: edu.gpa || '',
          honors: Array.isArray(edu.honors) ? edu.honors : [],
          description: edu.description || ''
        }));
      } catch (error) {
        console.error('Failed to parse education:', error);
      }
    }

    // Fall back to education_level
    return this.createEducationFromLevel();
  }

  protected generateSkills(): Skill[] {
    const skillsMap = new Map<string, Skill>();
    const defaultLevel = 'beginner'; // Students default to beginner

    // Parse technical_proficiencies (student-specific field)
    if (this.profile.technical_proficiencies) {
      const techSkills = this.parseStringList(this.profile.technical_proficiencies);
      techSkills.forEach(skillName => {
        const normalizedName = skillName.toLowerCase().trim();
        if (!skillsMap.has(normalizedName)) {
          skillsMap.set(normalizedName, {
            id: generateId(),
            name: skillName,
            level: defaultLevel,
            category: 'Technical'
          });
        }
      });
    }

    // Also parse key_skills if available
    if (this.profile.key_skills) {
      const userSkills = this.parseStringList(this.profile.key_skills);
      userSkills.forEach(skillName => {
        const normalizedName = skillName.toLowerCase().trim();
        if (!skillsMap.has(normalizedName)) {
          skillsMap.set(normalizedName, {
            id: generateId(),
            name: skillName,
            level: defaultLevel,
            category: 'Technical'
          });
        }
      });
    }

    // Merge with template skills
    const templateSkills = this.template.starterData?.skills || [];
    templateSkills.forEach(templateSkill => {
      const normalizedName = templateSkill.name.toLowerCase().trim();
      if (!skillsMap.has(normalizedName)) {
        skillsMap.set(normalizedName, { ...templateSkill, id: generateId() });
      }
    });

    return Array.from(skillsMap.values());
  }

  protected generateProjects(): Project[] {
    const projects: Project[] = [];

    // Parse academic projects
    if (this.profile.academic_projects && this.profile.academic_projects.trim().length > 0) {
      projects.push({
        id: generateId(),
        name: 'Academic Project',
        description: this.profile.academic_projects.trim(),
        technologies: [],
        highlights: []
      });
    }

    // Parse personal projects
    if (this.profile.personal_projects && this.profile.personal_projects.trim().length > 0) {
      projects.push({
        id: generateId(),
        name: 'Personal Project',
        description: this.profile.personal_projects.trim(),
        technologies: [],
        highlights: []
      });
    }

    // Parse volunteer experience as projects
    if (this.profile.volunteer_experience && this.profile.volunteer_experience.trim().length > 0) {
      projects.push({
        id: generateId(),
        name: 'Volunteer Experience',
        description: this.profile.volunteer_experience.trim(),
        technologies: [],
        highlights: []
      });
    }

    // Parse extracurricular activities
    if (this.profile.extracurricular_activities && this.profile.extracurricular_activities.trim().length > 0) {
      projects.push({
        id: generateId(),
        name: 'Extracurricular Activity',
        description: this.profile.extracurricular_activities.trim(),
        technologies: [],
        highlights: []
      });
    }

    // If no projects, use template
    if (projects.length === 0) {
      return this.template.starterData?.projects || [];
    }

    return projects;
  }

  private createEducationFromLevel(): Education[] {
    if (this.profile.education_level) {
      const level = this.profile.education_level.toLowerCase().trim();
      const degreeMap: Record<string, string> = {
        'bachelor': "Bachelor's Degree",
        'bachelors': "Bachelor's Degree",
        'master': "Master's Degree",
        'masters': "Master's Degree",
        'associate': "Associate's Degree"
      };

      const degree = degreeMap[level] || this.profile.education_level;
      
      if (degree.length >= 3) {
        return [{
          id: generateId(),
          institution: '',
          degree: degree,
          field: '',
          location: '',
          startDate: '',
          endDate: '',
          current: true,
          gpa: '',
          honors: [],
          description: ''
        }];
      }
    }

    return this.template.starterData?.education || [];
  }
}

/**
 * Strategy selection result with confidence score
 */
export interface StrategySelection {
  strategy: ResumeStrategy;
  strategyName: string;
  confidence: number;
  reasons: string[];
}

/**
 * Strategy Selector
 * 
 * Intelligently selects the best resume generation strategy based on profile data
 * with confidence scoring and reasoning.
 */
export class StrategySelector {
  private strategies: ResumeStrategy[];

  constructor(strategies: ResumeStrategy[]) {
    this.strategies = strategies;
  }

  /**
   * Selects the best strategy for a profile with confidence scoring
   * 
   * @param profile - User profile to evaluate
   * @param manualOverride - Optional manual strategy name override
   * @returns Strategy selection with confidence score and reasons
   */
  selectStrategy(profile: UserProfile, manualOverride?: string): StrategySelection {
    // Handle manual override
    if (manualOverride) {
      const strategy = this.strategies.find(s => s.getStrategyName() === manualOverride);
      if (strategy) {
        return {
          strategy,
          strategyName: strategy.getStrategyName(),
          confidence: 1.0,
          reasons: ['Manual override selected']
        };
      }
    }

    // Score all strategies
    const scores = this.strategies.map(strategy => ({
      strategy,
      ...this.scoreStrategy(strategy, profile)
    }));

    // Sort by confidence (highest first)
    scores.sort((a, b) => b.confidence - a.confidence);

    // Return best match
    const best = scores[0];
    return {
      strategy: best.strategy,
      strategyName: best.strategy.getStrategyName(),
      confidence: best.confidence,
      reasons: best.reasons
    };
  }

  /**
   * Scores a strategy's fit for a profile
   * 
   * @param strategy - Strategy to score
   * @param profile - User profile
   * @returns Confidence score (0-1) and reasons
   */
  private scoreStrategy(strategy: ResumeStrategy, profile: UserProfile): { confidence: number; reasons: string[] } {
    const reasons: string[] = [];
    let score = 0;
    const strategyName = strategy.getStrategyName();

    // Base applicability check
    if (!strategy.isApplicable(profile)) {
      return { confidence: 0, reasons: ['Not applicable for this profile'] };
    }

    // Career Changer scoring
    if (strategyName === 'CareerChanger') {
      score = 0.5; // Base score for applicable
      
      if (profile.career_stage === 'career_change' || profile.career_stage === 'career-change') {
        score += 0.3;
        reasons.push('Explicitly marked as career changer');
      }
      
      if (profile.career_stage?.includes('transition')) {
        score += 0.2;
        reasons.push('Career transition detected');
      }
      
      if (profile.target_industry && profile.target_industry.trim().length > 0) {
        score += 0.2;
        reasons.push('Has target industry specified');
      }
      
      if (this.hasWorkExperience(profile)) {
        score += 0.1;
        reasons.push('Has work experience to adapt');
      }
    }
    
    // Experienced Professional scoring
    else if (strategyName === 'ExperiencedProfessional') {
      score = 0.5;
      
      const experienceLevel = profile.experience_level?.toLowerCase() || '';
      if (experienceLevel.includes('senior')) {
        score += 0.3;
        reasons.push('Senior level experience');
      } else if (experienceLevel.includes('lead') || experienceLevel.includes('principal')) {
        score += 0.35;
        reasons.push('Leadership level position');
      } else if (experienceLevel.includes('staff') || experienceLevel.includes('architect')) {
        score += 0.3;
        reasons.push('Advanced technical role');
      }
      
      if (this.hasWorkExperience(profile)) {
        score += 0.15;
        reasons.push('Has substantial work experience');
      }
    }
    
    // Experienced Job Seeker scoring
    else if (strategyName === 'ExperiencedJobSeeker') {
      score = 0.5;
      
      const experienceLevel = profile.experience_level?.toLowerCase() || '';
      if (experienceLevel.includes('mid') || experienceLevel.includes('junior')) {
        score += 0.25;
        reasons.push('Mid-level or junior experience');
      } else if (experienceLevel.includes('intermediate')) {
        score += 0.2;
        reasons.push('Intermediate experience level');
      }
      
      if (this.hasWorkExperience(profile)) {
        score += 0.2;
        reasons.push('Has work experience');
      }
      
      if (profile.professional_summary && profile.professional_summary.trim().length > 0) {
        score += 0.1;
        reasons.push('Has professional summary');
      }
    }
    
    // First Time Job Seeker scoring
    else if (strategyName === 'FirstTimeJobSeeker') {
      score = 0.5;
      
      const experienceLevel = profile.experience_level?.toLowerCase() || '';
      if (experienceLevel.includes('entry')) {
        score += 0.2;
        reasons.push('Entry-level position seeker');
      }
      
      if (!this.hasWorkExperience(profile)) {
        score += 0.3;
        reasons.push('No work experience - needs examples');
      }
      
      if (profile.academic_projects || profile.volunteer_experience) {
        score += 0.1;
        reasons.push('Has academic or volunteer experience');
      }
    }
    
    // Student scoring
    else if (strategyName === 'Student') {
      score = 0.5;
      
      const experienceLevel = profile.experience_level?.toLowerCase() || '';
      const careerStage = profile.career_stage?.toLowerCase() || '';
      
      if (experienceLevel.includes('student') || careerStage === 'student') {
        score += 0.3;
        reasons.push('Currently a student');
      }
      
      if (profile.education_level) {
        score += 0.1;
        reasons.push('Has education level specified');
      }
      
      if (profile.academic_projects || profile.personal_projects) {
        score += 0.15;
        reasons.push('Has academic or personal projects');
      }
    }

    // Normalize score to 0-1 range
    const confidence = Math.min(1.0, Math.max(0, score));
    
    return { confidence, reasons };
  }

  /**
   * Checks if profile has work experience
   */
  private hasWorkExperience(profile: UserProfile): boolean {
    return !!(
      profile.work_experience && 
      (
        (typeof profile.work_experience === 'string' && profile.work_experience.trim().length > 0) ||
        (Array.isArray(profile.work_experience) && profile.work_experience.length > 0)
      )
    );
  }

  /**
   * Gets all strategies with their confidence scores
   * 
   * @param profile - User profile to evaluate
   * @returns Array of all strategies with scores, sorted by confidence
   */
  getAllStrategyScores(profile: UserProfile): StrategySelection[] {
    const scores = this.strategies.map(strategy => {
      const { confidence, reasons } = this.scoreStrategy(strategy, profile);
      return {
        strategy,
        strategyName: strategy.getStrategyName(),
        confidence,
        reasons
      };
    });

    return scores.sort((a, b) => b.confidence - a.confidence);
  }
}

/**
 * Strategy Factory
 * 
 * Selects the appropriate resume generation strategy based on user profile.
 */
export class ResumeStrategyFactory {
  private static strategies: ResumeStrategy[] = [
    new ExperiencedProfessionalStrategy(),
    new CareerChangerStrategy(),
    new ExperiencedJobSeekerStrategy(),
    new FirstTimeJobSeekerStrategy(),
    new StudentStrategy()
  ];

  private static selector = new StrategySelector(this.strategies);

  /**
   * Gets the most appropriate strategy for the given profile
   * 
   * @param profile - User profile to evaluate
   * @returns The best matching strategy
   */
  static getStrategy(profile: UserProfile): ResumeStrategy {
    for (const strategy of this.strategies) {
      if (strategy.isApplicable(profile)) {
        return strategy;
      }
    }

    // Default to experienced professional strategy
    return this.strategies[0];
  }

  /**
   * Selects the best strategy with confidence scoring
   * 
   * @param profile - User profile to evaluate
   * @param manualOverride - Optional manual strategy name override
   * @returns Strategy selection with confidence score and reasons
   */
  static selectStrategy(profile: UserProfile, manualOverride?: string): StrategySelection {
    return this.selector.selectStrategy(profile, manualOverride);
  }

  /**
   * Gets all strategies with their confidence scores for a profile
   * 
   * @param profile - User profile to evaluate
   * @returns Array of all strategies with scores, sorted by confidence
   */
  static getAllStrategyScores(profile: UserProfile): StrategySelection[] {
    return this.selector.getAllStrategyScores(profile);
  }

  /**
   * Gets a strategy by name
   * 
   * @param name - Strategy name
   * @returns The requested strategy or default
   */
  static getStrategyByName(name: string): ResumeStrategy {
    const strategy = this.strategies.find(s => s.getStrategyName() === name);
    return strategy || this.strategies[0];
  }

  /**
   * Registers a new strategy
   * 
   * @param strategy - Strategy to register
   */
  static registerStrategy(strategy: ResumeStrategy): void {
    this.strategies.push(strategy);
  }

  /**
   * Gets all available strategies
   */
  static getAllStrategies(): ResumeStrategy[] {
    return [...this.strategies];
  }
}
