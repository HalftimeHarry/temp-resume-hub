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
import { KeywordAdapter, type KeywordIntensity } from './KeywordAdapter';
import { getIndustryKeywords } from './IndustryKeywords';

/**
 * ResumeGenerator Service Class
 * 
 * Generates resume drafts by combining user profile data with template configurations.
 * This service intelligently merges user information with template starter data,
 * detecting whether the user has real experience or is using template placeholders.
 * 
 * @example
 * ```typescript
 * const generator = new ResumeGenerator(userProfile, template, 'software-engineering');
 * const resumeDraft = generator.generateDraft();
 * ```
 */
export class ResumeGenerator {
  private profile: UserProfile;
  private template: ExtendedResumeTemplate;
  private targetIndustry: string;
  private keywordAdapter: KeywordAdapter | null;
  private keywordIntensity: KeywordIntensity;

  /**
   * Creates a new ResumeGenerator instance
   * 
   * @param profile - The user's profile data containing personal and career information
   * @param template - The extended resume template with design and starter data
   * @param targetIndustry - Optional industry to target; defaults to profile's target_industry
   * @param keywordIntensity - How aggressively to adapt keywords (light, moderate, aggressive)
   */
  constructor(
    profile: UserProfile,
    template: ExtendedResumeTemplate,
    targetIndustry?: string,
    keywordIntensity: KeywordIntensity = 'moderate'
  ) {
    this.profile = profile;
    this.template = template;
    this.targetIndustry = targetIndustry || profile.target_industry || '';
    this.keywordIntensity = keywordIntensity;
    
    // Initialize keyword adapter if industry is specified
    this.keywordAdapter = this.targetIndustry 
      ? new KeywordAdapter(this.targetIndustry, { 
          intensity: keywordIntensity,
          preserveOriginal: true,
          contextAware: true
        })
      : null;
  }

  /**
   * Generates a complete resume draft by combining profile data with template configuration
   * 
   * This method orchestrates the generation of all resume sections, intelligently
   * deciding whether to use user data or template starter data based on profile completeness.
   * 
   * @returns Complete resume builder data ready for editing or rendering
   */
  public generateDraft(): ResumeBuilderData {
    const personalInfo = this.generatePersonalInfo();
    
    // Validate personal info (for logging/debugging purposes)
    const validation = this.validatePersonalInfo(personalInfo);
    if (!validation.isValid) {
      console.warn('⚠️ Resume draft generated with missing required fields:', validation.missingFields);
    }
    if (validation.warnings.length > 0) {
      console.info('ℹ️ Resume draft missing recommended fields:', validation.warnings);
    }

    return {
      personalInfo,
      summary: this.generateSummary(),
      experience: this.generateExperience(),
      education: this.generateEducation(),
      skills: this.generateSkills(),
      projects: this.generateProjects(),
      settings: {
        layout: this.template.starterData?.settings?.layout || '1-page',
        mode: this.template.starterData?.settings?.mode || 'simple',
        template: this.template.settings.template,
        colorScheme: this.template.settings.colorScheme,
        fontSize: this.template.settings.fontSize as 'small' | 'medium' | 'large',
        spacing: this.template.settings.spacing as 'compact' | 'normal' | 'relaxed',
        showProfileImage: this.template.settings.showProfileImage,
        sectionOrder: this.template.settings.sectionOrder
      },
      currentStep: 'personal',
      completedSteps: []
    };
  }

  /**
   * Validates the generated resume draft
   * 
   * Public method to check if the resume has all required information.
   * Useful for UI validation and user feedback.
   * 
   * @returns Validation result with status and details
   */
  public validate(): {
    isValid: boolean;
    missingFields: string[];
    warnings: string[];
  } {
    const personalInfo = this.generatePersonalInfo();
    return this.validatePersonalInfo(personalInfo);
  }

  /**
   * Generates personal information section from user profile
   * 
   * Intelligently merges user profile data with template defaults, detecting
   * and avoiding placeholder values. Always prioritizes real user data over
   * template placeholders.
   * 
   * @returns PersonalInfo object with user's contact and professional details
   */
  private generatePersonalInfo(): PersonalInfo {
    const templatePersonal = this.template.starterData?.personalInfo;

    // Build full name from profile, normalizing whitespace
    const firstName = (this.profile.first_name || '').trim();
    const lastName = (this.profile.last_name || '').trim();
    const profileFullName = `${firstName} ${lastName}`.replace(/\s+/g, ' ').trim();
    
    // Smart merge: use profile data if valid, otherwise use template if not a placeholder
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
        ['(555) 123-4567', '555-123-4567', '123-456-7890', '(123) 456-7890']
      ),
      location: this.smartMergeField(
        this.profile.location,
        templatePersonal?.location,
        ['Your City, State', 'City, State', 'San Francisco, CA']
      ),
      website: this.smartMergeField(
        this.profile.portfolio_url,
        templatePersonal?.website,
        ['johndoe.com', 'yourwebsite.com', 'example.com', 'portfolio.com']
      ),
      linkedin: this.smartMergeField(
        this.profile.linkedin_url,
        templatePersonal?.linkedin,
        ['linkedin.com/in/johndoe', 'linkedin.com/in/yourprofile']
      ),
      github: this.smartMergeField(
        undefined, // Profile doesn't have github field yet
        templatePersonal?.github,
        ['github.com/johndoe', 'github.com/username']
      ),
      summary: templatePersonal?.summary || ''
    };
  }

  /**
   * Smart field merging with placeholder detection
   * 
   * Prioritizes profile data over template data, but only uses template data
   * if it's not a known placeholder value. This prevents template example
   * data from appearing in user resumes.
   * 
   * @param profileValue - Value from user profile
   * @param templateValue - Value from template starter data
   * @param placeholders - Array of known placeholder values to avoid
   * @returns The most appropriate value, or empty string if none valid
   */
  private smartMergeField(
    profileValue: string | undefined,
    templateValue: string | undefined,
    placeholders: string[] = []
  ): string {
    // Always prefer profile data if it exists and is not empty
    if (profileValue && profileValue.trim().length > 0) {
      return profileValue.trim();
    }

    // Use template value only if it's not a placeholder
    if (templateValue && templateValue.trim().length > 0) {
      const normalizedTemplate = templateValue.trim().toLowerCase();
      const isPlaceholder = placeholders.some(
        placeholder => normalizedTemplate === placeholder.toLowerCase()
      );
      
      if (!isPlaceholder) {
        return templateValue.trim();
      }
    }

    // Return empty string if no valid value found
    return '';
  }

  /**
   * Validates personal information for required fields
   * 
   * Checks that essential contact information is present. Used to determine
   * if the resume has minimum viable data for generation.
   * 
   * @param personalInfo - The personal info object to validate
   * @returns Object with validation status and missing fields
   */
  private validatePersonalInfo(personalInfo: PersonalInfo): {
    isValid: boolean;
    missingFields: string[];
    warnings: string[];
  } {
    const missingFields: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!personalInfo.fullName || personalInfo.fullName.trim().length === 0) {
      missingFields.push('fullName');
    }

    if (!personalInfo.email || personalInfo.email.trim().length === 0) {
      missingFields.push('email');
    }

    // Recommended fields (warnings only)
    if (!personalInfo.phone || personalInfo.phone.trim().length === 0) {
      warnings.push('phone');
    }

    if (!personalInfo.location || personalInfo.location.trim().length === 0) {
      warnings.push('location');
    }

    return {
      isValid: missingFields.length === 0,
      missingFields,
      warnings
    };
  }

  /**
   * Generates professional summary section
   * 
   * Prioritizes user's professional_summary from profile, falls back to
   * template summary. Optionally enhances with industry-specific keywords
   * based on target industry.
   * 
   * @returns Professional summary text
   */
  private generateSummary(): string {
    // Prioritize profile professional summary
    if (this.profile.professional_summary && this.profile.professional_summary.trim().length > 0) {
      const profileSummary = this.profile.professional_summary.trim();
      
      // Optionally enhance with industry keywords if target industry is set
      if (this.targetIndustry && this.targetIndustry.trim().length > 0) {
        return this.enhanceSummaryWithKeywords(profileSummary);
      }
      
      return profileSummary;
    }

    // Fall back to template summary
    const templateSummary = this.template.starterData?.summary || '';
    
    // Enhance template summary with industry keywords if available
    if (templateSummary && this.targetIndustry && this.targetIndustry.trim().length > 0) {
      return this.enhanceSummaryWithKeywords(templateSummary);
    }
    
    return templateSummary;
  }

  /**
   * Enhances a summary with industry-specific keywords
   * 
   * Uses KeywordAdapter to intelligently replace generic terms with
   * industry-specific terminology while maintaining natural language flow.
   * 
   * @param summary - Original summary text
   * @returns Enhanced summary with industry keywords
   */
  private enhanceSummaryWithKeywords(summary: string): string {
    if (!this.keywordAdapter) {
      return summary;
    }

    // Adapt the summary with industry-specific keywords
    const result = this.keywordAdapter.adaptText(summary);
    
    // If adaptation score is very low, try enriching with keywords
    if (result.score < 0.2) {
      return this.keywordAdapter.enrichText(result.adapted, 2);
    }
    
    return result.adapted;
  }

  /**
   * Gets relevant keywords for the target industry
   * 
   * Returns a list of important keywords and phrases for the specified industry.
   * Used for summary enhancement and ATS optimization.
   * 
   * @returns Array of industry-specific keywords
   */
  private getIndustryKeywords(): string[] {
    const industry = this.targetIndustry.toLowerCase().trim();

    const keywordMap: Record<string, string[]> = {
      'software-engineering': [
        'software development', 'full-stack', 'agile', 'scalable',
        'cloud-native', 'microservices', 'CI/CD', 'code quality'
      ],
      'software': [
        'software development', 'full-stack', 'agile', 'scalable',
        'cloud-native', 'microservices', 'CI/CD', 'code quality'
      ],
      'web-development': [
        'web development', 'responsive design', 'user experience',
        'front-end', 'back-end', 'full-stack', 'modern frameworks'
      ],
      'data-science': [
        'data analysis', 'machine learning', 'statistical modeling',
        'data visualization', 'predictive analytics', 'big data'
      ],
      'devops': [
        'automation', 'infrastructure', 'continuous integration',
        'deployment', 'monitoring', 'cloud infrastructure', 'containerization'
      ],
      'product-management': [
        'product strategy', 'roadmap', 'stakeholder management',
        'user research', 'agile methodologies', 'cross-functional'
      ],
      'design': [
        'user experience', 'user interface', 'design thinking',
        'prototyping', 'user research', 'visual design', 'accessibility'
      ],
      'marketing': [
        'digital marketing', 'campaign management', 'analytics',
        'brand strategy', 'content marketing', 'SEO', 'social media'
      ],
      'sales': [
        'business development', 'client relationships', 'revenue growth',
        'pipeline management', 'negotiation', 'account management'
      ]
    };

    // Try exact match first
    if (keywordMap[industry]) {
      return keywordMap[industry];
    }

    // Try partial match
    for (const [key, keywords] of Object.entries(keywordMap)) {
      if (industry.includes(key) || key.includes(industry)) {
        return keywords;
      }
    }

    return [];
  }

  /**
   * Generates work experience section
   * 
   * Intelligently determines whether to use real user experience data or
   * template examples. Parses stored experience data and maps it to the
   * Resume Experience type with proper field mapping and ID generation.
   * 
   * @returns Array of experience entries
   */
  private generateExperience(): Experience[] {
    // Check if user has real experience data
    if (this.hasProfileExperience()) {
      try {
        return this.adaptProfileExperience();
      } catch (error) {
        console.error('Failed to parse profile experience:', error);
        // Fall back to template data on error
        return this.template.starterData?.experience || [];
      }
    }

    // Use template starter data as examples for entry-level users
    return this.template.starterData?.experience || [];
  }

  /**
   * Adapts profile work experience data to Resume Experience format
   * 
   * Parses work_experience from profile (handles both JSON string and array),
   * maps fields to the Experience type, and generates unique IDs for each entry.
   * 
   * @returns Array of properly formatted Experience entries
   * @throws Error if JSON parsing fails
   */
  private adaptProfileExperience(): Experience[] {
    if (!this.profile.work_experience) {
      return [];
    }

    // Handle both JSON string and array formats
    let experienceData: any[];
    
    if (Array.isArray(this.profile.work_experience)) {
      experienceData = this.profile.work_experience;
    } else if (typeof this.profile.work_experience === 'string') {
      try {
        experienceData = JSON.parse(this.profile.work_experience);
      } catch (error) {
        console.error('Failed to parse work_experience JSON:', error);
        return [];
      }
    } else {
      return [];
    }

    // Map profile experience to Resume Experience type and adapt with keywords
    return experienceData.map((exp: any) => {
      const description = exp.description || exp.summary || '';
      const highlights = this.parseHighlights(exp);
      
      return {
        id: generateId(),
        company: exp.company || exp.employer || '',
        position: exp.position || exp.title || exp.role || '',
        location: exp.location || '',
        startDate: exp.start_date || exp.startDate || '',
        endDate: exp.end_date || exp.endDate || '',
        current: exp.current || exp.is_current || false,
        description: this.adaptExperienceDescription(description),
        highlights: this.adaptExperienceHighlights(highlights)
      };
    });
  }

  /**
   * Adapt experience description with industry-specific keywords
   * 
   * @param description - Original description text
   * @returns Adapted description with industry keywords
   */
  private adaptExperienceDescription(description: string): string {
    if (!description || !this.keywordAdapter) {
      return description;
    }

    const result = this.keywordAdapter.adaptText(description);
    return result.adapted;
  }

  /**
   * Adapt experience highlights with industry-specific keywords
   * 
   * @param highlights - Array of highlight strings
   * @returns Adapted highlights with industry keywords
   */
  private adaptExperienceHighlights(highlights: string[]): string[] {
    if (!highlights || highlights.length === 0 || !this.keywordAdapter) {
      return highlights;
    }

    return this.keywordAdapter.adaptTextArray(highlights).map(result => result.adapted);
  }

  /**
   * Parses highlights/achievements from experience data
   * 
   * Handles multiple formats: array, comma-separated string, or newline-separated string.
   * 
   * @param exp - Experience object from profile
   * @returns Array of highlight strings
   */
  private parseHighlights(exp: any): string[] {
    // If highlights is already an array, use it
    if (Array.isArray(exp.highlights)) {
      return exp.highlights.filter((h: any) => h && typeof h === 'string' && h.trim().length > 0);
    }

    // If achievements is an array, use it
    if (Array.isArray(exp.achievements)) {
      return exp.achievements.filter((a: any) => a && typeof a === 'string' && a.trim().length > 0);
    }

    // Try parsing highlights as string
    if (typeof exp.highlights === 'string' && exp.highlights.trim().length > 0) {
      return this.parseStringList(exp.highlights);
    }

    // Try parsing achievements as string
    if (typeof exp.achievements === 'string' && exp.achievements.trim().length > 0) {
      return this.parseStringList(exp.achievements);
    }

    return [];
  }

  /**
   * Generates education section
   * 
   * Intelligently determines whether to use profile education data or
   * template examples. Parses stored education data and maps it to the
   * Resume Education type with proper field mapping and ID generation.
   * Also considers education_level field for basic education info.
   * 
   * @returns Array of education entries
   */
  private generateEducation(): Education[] {
    // Check if user has structured education data
    if (this.hasProfileEducation()) {
      try {
        return this.adaptProfileEducation();
      } catch (error) {
        console.error('Failed to parse profile education:', error);
        // Fall back to template data on error
        return this.template.starterData?.education || [];
      }
    }

    // Check if we can create basic education from education_level
    if (this.profile.education_level) {
      const basicEducation = this.createBasicEducationFromLevel();
      if (basicEducation) {
        return [basicEducation];
      }
    }

    // Use template starter data as examples
    return this.template.starterData?.education || [];
  }

  /**
   * Detects whether the user has structured education data
   * 
   * Checks if the profile contains education data that can be parsed and used.
   * 
   * @returns true if user has parseable education data, false otherwise
   */
  private hasProfileEducation(): boolean {
    if (!this.profile.education) {
      return false;
    }

    // If it's an array, check if it has entries
    if (Array.isArray(this.profile.education)) {
      return this.profile.education.length > 0;
    }

    // If it's a string, try to parse it
    if (typeof this.profile.education === 'string') {
      const trimmed = this.profile.education.trim();
      
      if (trimmed.length === 0) {
        return false;
      }

      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) && parsed.length > 0;
      } catch {
        return false;
      }
    }

    return false;
  }

  /**
   * Adapts profile education data to Resume Education format
   * 
   * Parses education from profile (handles both JSON string and array),
   * maps fields to the Education type, and generates unique IDs for each entry.
   * 
   * @returns Array of properly formatted Education entries
   * @throws Error if JSON parsing fails
   */
  private adaptProfileEducation(): Education[] {
    if (!this.profile.education) {
      return [];
    }

    // Handle both JSON string and array formats
    let educationData: any[];
    
    if (Array.isArray(this.profile.education)) {
      educationData = this.profile.education;
    } else if (typeof this.profile.education === 'string') {
      try {
        educationData = JSON.parse(this.profile.education);
      } catch (error) {
        console.error('Failed to parse education JSON:', error);
        return [];
      }
    } else {
      return [];
    }

    // Map profile education to Resume Education type
    return educationData.map((edu: any) => ({
      id: generateId(),
      institution: edu.institution || edu.school || edu.university || '',
      degree: edu.degree || edu.degree_type || '',
      field: edu.field || edu.field_of_study || edu.major || '',
      location: edu.location || '',
      startDate: edu.start_date || edu.startDate || '',
      endDate: edu.end_date || edu.endDate || '',
      current: edu.current || edu.is_current || edu.in_progress || false,
      gpa: edu.gpa || edu.grade || '',
      honors: this.parseHonors(edu),
      description: edu.description || edu.notes || ''
    }));
  }

  /**
   * Parses honors/achievements from education data
   * 
   * Handles multiple formats: array, comma-separated string, or newline-separated string.
   * 
   * @param edu - Education object from profile
   * @returns Array of honor strings
   */
  private parseHonors(edu: any): string[] {
    // If honors is already an array, use it
    if (Array.isArray(edu.honors)) {
      return edu.honors.filter((h: any) => h && typeof h === 'string' && h.trim().length > 0);
    }

    // If achievements is an array, use it
    if (Array.isArray(edu.achievements)) {
      return edu.achievements.filter((a: any) => a && typeof a === 'string' && a.trim().length > 0);
    }

    // Try parsing honors as string
    if (typeof edu.honors === 'string' && edu.honors.trim().length > 0) {
      return this.parseStringList(edu.honors);
    }

    // Try parsing achievements as string
    if (typeof edu.achievements === 'string' && edu.achievements.trim().length > 0) {
      return this.parseStringList(edu.achievements);
    }

    // Try parsing awards as string
    if (typeof edu.awards === 'string' && edu.awards.trim().length > 0) {
      return this.parseStringList(edu.awards);
    }

    return [];
  }

  /**
   * Parses a string list with multiple separator formats
   * 
   * Handles newline-separated, comma-separated, or single item strings.
   * 
   * @param str - String to parse
   * @returns Array of parsed items
   */
  private parseStringList(str: string): string[] {
    // Try newline-separated first
    if (str.includes('\n')) {
      return str
        .split('\n')
        .map((item: string) => item.trim())
        .filter((item: string) => item.length > 0);
    }
    
    // Try comma-separated
    if (str.includes(',')) {
      return str
        .split(',')
        .map((item: string) => item.trim())
        .filter((item: string) => item.length > 0);
    }
    
    // Single item
    return [str.trim()];
  }

  /**
   * Creates a basic education entry from education_level field
   * 
   * When no structured education data exists, attempts to create a minimal
   * education entry from the education_level field (e.g., "Bachelor's Degree").
   * 
   * @returns Basic Education entry or null if cannot be created
   */
  private createBasicEducationFromLevel(): Education | null {
    if (!this.profile.education_level) {
      return null;
    }

    const level = this.profile.education_level.trim();
    
    // Map common education levels to degree types
    const degreeMap: Record<string, string> = {
      'high school': 'High School Diploma',
      'high_school': 'High School Diploma',
      'associate': "Associate's Degree",
      'associates': "Associate's Degree",
      'bachelor': "Bachelor's Degree",
      'bachelors': "Bachelor's Degree",
      'bs': 'Bachelor of Science',
      'ba': 'Bachelor of Arts',
      'master': "Master's Degree",
      'masters': "Master's Degree",
      'ms': 'Master of Science',
      'ma': 'Master of Arts',
      'mba': 'Master of Business Administration',
      'phd': 'Doctor of Philosophy',
      'doctorate': 'Doctorate'
    };

    const normalizedLevel = level.toLowerCase();
    let degree = degreeMap[normalizedLevel] || level;

    // Only create if it looks like a valid degree
    if (degree.length < 3) {
      return null;
    }

    return {
      id: generateId(),
      institution: '', // To be filled by user
      degree: degree,
      field: '', // To be filled by user
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
      honors: [],
      description: ''
    };
  }

  /**
   * Generates skills section
   * 
   * Intelligently merges user's skills from profile with template skills.
   * Parses comma-separated skill strings, categorizes skills, assigns
   * appropriate levels based on experience, and removes duplicates.
   * 
   * @returns Array of skill entries with proper categorization and levels
   */
  private generateSkills(): Skill[] {
    const skillsMap = new Map<string, Skill>();
    const defaultLevel = this.getDefaultSkillLevel();

    // Parse user's key_skills if available
    if (this.profile.key_skills) {
      const userSkills = this.parseSkillString(this.profile.key_skills);
      
      userSkills.forEach(skillName => {
        const normalizedName = this.normalizeSkillName(skillName);
        if (!skillsMap.has(normalizedName)) {
          skillsMap.set(normalizedName, {
            id: generateId(),
            name: skillName,
            level: defaultLevel,
            category: this.categorizeSkill(skillName)
          });
        }
      });
    }

    // Parse technical_proficiencies for students/entry-level
    if (this.profile.technical_proficiencies) {
      const techSkills = this.parseSkillString(this.profile.technical_proficiencies);
      
      techSkills.forEach(skillName => {
        const normalizedName = this.normalizeSkillName(skillName);
        if (!skillsMap.has(normalizedName)) {
          skillsMap.set(normalizedName, {
            id: generateId(),
            name: skillName,
            level: defaultLevel,
            category: this.categorizeSkill(skillName)
          });
        }
      });
    }

    // Merge with template skills (avoid duplicates)
    const templateSkills = this.template.starterData?.skills || [];
    templateSkills.forEach(templateSkill => {
      const normalizedName = this.normalizeSkillName(templateSkill.name);
      if (!skillsMap.has(normalizedName)) {
        // Use template skill with new ID
        skillsMap.set(normalizedName, {
          ...templateSkill,
          id: generateId()
        });
      }
    });

    // Convert map to array
    const skills = Array.from(skillsMap.values());

    // If still no skills, return empty array (user can add manually)
    return skills;
  }

  /**
   * Parses a comma-separated skill string into an array
   * 
   * @param skillString - Comma-separated string of skills
   * @returns Array of trimmed, non-empty skill names
   */
  private parseSkillString(skillString: string): string[] {
    return skillString
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
  }

  /**
   * Normalizes skill name for duplicate detection
   * 
   * Converts to lowercase and removes extra whitespace for comparison.
   * 
   * @param skillName - Original skill name
   * @returns Normalized skill name for comparison
   */
  private normalizeSkillName(skillName: string): string {
    return skillName.toLowerCase().trim().replace(/\s+/g, ' ');
  }

  /**
   * Categorizes a skill based on common patterns
   * 
   * Uses keyword matching to assign skills to appropriate categories.
   * Checks more specific categories first to avoid misclassification.
   * 
   * @param skillName - Name of the skill to categorize
   * @returns Category name
   */
  private categorizeSkill(skillName: string): string {
    const normalized = skillName.toLowerCase().trim();

    // Soft Skills (check first as they're distinct)
    const softSkills = [
      'leadership', 'communication', 'teamwork', 'problem solving', 'critical thinking',
      'time management', 'project management', 'collaboration',
      'presentation', 'public speaking', 'mentoring', 'coaching'
    ];
    if (softSkills.some(soft => normalized === soft || normalized.includes(soft))) {
      return 'Soft Skills';
    }

    // Frameworks & Libraries (check before languages to avoid confusion)
    const frameworks = [
      'react', 'angular', 'vue', 'svelte', 'next.js', 'nuxt', 'express',
      'django', 'flask', 'spring', 'laravel', 'rails', 'asp.net', '.net',
      'node.js', 'jquery', 'bootstrap', 'tailwind', 'material-ui', 'redux',
      'graphql', 'rest api', 'fastapi', 'nestjs', 'ember'
    ];
    if (frameworks.some(fw => normalized === fw || normalized.includes(fw))) {
      return 'Frameworks & Libraries';
    }

    // Databases
    const databases = [
      'mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle',
      'sql server', 'dynamodb', 'cassandra', 'elasticsearch', 'firebase',
      'mariadb', 'couchdb', 'neo4j', 'postgres'
    ];
    if (databases.some(db => normalized === db || normalized.includes(db))) {
      return 'Databases';
    }

    // Cloud & DevOps
    const cloudDevOps = [
      'aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'k8s',
      'jenkins', 'gitlab', 'github actions', 'terraform', 'ansible', 'ci/cd',
      'devops', 'linux', 'unix', 'nginx', 'apache', 'heroku', 'vercel', 'netlify'
    ];
    if (cloudDevOps.some(tool => normalized === tool || normalized.includes(tool))) {
      return 'Cloud & DevOps';
    }

    // Testing
    const testing = [
      'jest', 'mocha', 'chai', 'jasmine', 'pytest', 'junit', 'selenium',
      'cypress', 'testing', 'test', 'tdd', 'bdd', 'unit test', 'integration test',
      'vitest', 'karma'
    ];
    if (testing.some(test => normalized === test || normalized.includes(test))) {
      return 'Testing';
    }

    // Data & Analytics
    const dataAnalytics = [
      'machine learning', 'ml', 'ai', 'artificial intelligence', 'data science',
      'data analysis', 'pandas', 'numpy', 'tensorflow', 'pytorch', 'scikit-learn',
      'tableau', 'power bi', 'excel', 'statistics', 'analytics'
    ];
    if (dataAnalytics.some(da => normalized === da || normalized.includes(da))) {
      return 'Data & Analytics';
    }

    // Design
    const design = [
      'ui', 'ux', 'design', 'wireframe', 'prototype', 'user experience',
      'user interface', 'responsive design', 'mobile design', 'web design',
      'graphic design'
    ];
    if (design.some(d => normalized === d || normalized.includes(d))) {
      return 'Design';
    }

    // Tools & Software
    const tools = [
      'git', 'jira', 'confluence', 'slack', 'figma', 'sketch', 'photoshop',
      'illustrator', 'xd', 'vscode', 'intellij', 'eclipse', 'postman',
      'webpack', 'vite', 'babel', 'npm', 'yarn', 'maven', 'gradle'
    ];
    if (tools.some(tool => normalized === tool || normalized.includes(tool))) {
      return 'Tools & Software';
    }

    // Agile/Scrum (separate from soft skills)
    if (normalized.includes('agile') || normalized.includes('scrum') || normalized.includes('kanban')) {
      return 'Methodologies';
    }

    // Programming Languages (check last as it's most general)
    const programmingLanguages = [
      'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'php',
      'swift', 'kotlin', 'go', 'rust', 'scala', 'r', 'matlab', 'sql', 'html',
      'css', 'bash', 'shell', 'perl', 'dart', 'objective-c', 'c', 'lua', 'elixir',
      'haskell', 'clojure'
    ];
    if (programmingLanguages.some(lang => normalized === lang || normalized.includes(lang))) {
      return 'Programming Languages';
    }

    // Default to Technical
    return 'Technical';
  }

  /**
   * Determines default skill level based on user's experience level
   * 
   * Maps experience_level to appropriate skill proficiency level.
   * 
   * @returns Default skill level for the user
   */
  private getDefaultSkillLevel(): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
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

    // Default to intermediate
    return 'intermediate';
  }

  /**
   * Generates projects section
   * 
   * Intelligently parses structured project data, academic projects, and
   * personal projects from profile. Falls back to template examples.
   * Especially important for first-time job seekers and students.
   * 
   * @returns Array of project entries
   */
  private generateProjects(): Project[] {
    // Check for structured projects data first
    if (this.hasProfileProjects()) {
      try {
        return this.adaptProfileProjects();
      } catch (error) {
        console.error('Failed to parse profile projects:', error);
        // Continue to try other sources
      }
    }

    const projects: Project[] = [];

    // Parse academic_projects for students
    if (this.profile.academic_projects && this.profile.academic_projects.trim().length > 0) {
      const academicProjects = this.parseProjectString(
        this.profile.academic_projects,
        'Academic Project'
      );
      projects.push(...academicProjects);
    }

    // Parse personal_projects
    if (this.profile.personal_projects && this.profile.personal_projects.trim().length > 0) {
      const personalProjects = this.parseProjectString(
        this.profile.personal_projects,
        'Personal Project'
      );
      projects.push(...personalProjects);
    }

    // Parse volunteer_experience as projects for students
    if (this.profile.volunteer_experience && this.profile.volunteer_experience.trim().length > 0) {
      const volunteerProjects = this.parseProjectString(
        this.profile.volunteer_experience,
        'Volunteer Experience'
      );
      projects.push(...volunteerProjects);
    }

    // Parse extracurricular_activities as projects
    if (this.profile.extracurricular_activities && this.profile.extracurricular_activities.trim().length > 0) {
      const extracurricularProjects = this.parseProjectString(
        this.profile.extracurricular_activities,
        'Extracurricular Activity'
      );
      projects.push(...extracurricularProjects);
    }

    // If no user projects, use template data
    if (projects.length === 0) {
      return this.template.starterData?.projects || [];
    }

    return projects;
  }

  /**
   * Detects whether the user has structured projects data
   * 
   * @returns true if user has parseable projects data, false otherwise
   */
  private hasProfileProjects(): boolean {
    if (!this.profile.projects) {
      return false;
    }

    if (Array.isArray(this.profile.projects)) {
      return this.profile.projects.length > 0;
    }

    if (typeof this.profile.projects === 'string') {
      const trimmed = this.profile.projects.trim();
      if (trimmed.length === 0) {
        return false;
      }

      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) && parsed.length > 0;
      } catch {
        return false;
      }
    }

    return false;
  }

  /**
   * Adapts profile projects data to Resume Project format
   * 
   * @returns Array of properly formatted Project entries
   */
  private adaptProfileProjects(): Project[] {
    if (!this.profile.projects) {
      return [];
    }

    let projectsData: any[];
    
    if (Array.isArray(this.profile.projects)) {
      projectsData = this.profile.projects;
    } else if (typeof this.profile.projects === 'string') {
      try {
        projectsData = JSON.parse(this.profile.projects);
      } catch (error) {
        console.error('Failed to parse projects JSON:', error);
        return [];
      }
    } else {
      return [];
    }

    return projectsData.map((proj: any) => ({
      id: generateId(),
      name: proj.name || proj.title || proj.project_name || 'Untitled Project',
      description: proj.description || proj.summary || '',
      technologies: this.parseTechnologies(proj),
      url: proj.url || proj.link || proj.demo_url || '',
      github: proj.github || proj.github_url || proj.repo || proj.repository || '',
      startDate: proj.start_date || proj.startDate || '',
      endDate: proj.end_date || proj.endDate || '',
      highlights: this.parseProjectHighlights(proj)
    }));
  }

  /**
   * Parses technologies from project data
   * 
   * @param proj - Project object from profile
   * @returns Array of technology strings
   */
  private parseTechnologies(proj: any): string[] {
    // If technologies is already an array, use it
    if (Array.isArray(proj.technologies)) {
      return proj.technologies.filter((t: any) => t && typeof t === 'string' && t.trim().length > 0);
    }

    // If tech_stack is an array, use it
    if (Array.isArray(proj.tech_stack)) {
      return proj.tech_stack.filter((t: any) => t && typeof t === 'string' && t.trim().length > 0);
    }

    // If tools is an array, use it
    if (Array.isArray(proj.tools)) {
      return proj.tools.filter((t: any) => t && typeof t === 'string' && t.trim().length > 0);
    }

    // Try parsing as string
    if (typeof proj.technologies === 'string' && proj.technologies.trim().length > 0) {
      return this.parseStringList(proj.technologies);
    }

    if (typeof proj.tech_stack === 'string' && proj.tech_stack.trim().length > 0) {
      return this.parseStringList(proj.tech_stack);
    }

    if (typeof proj.tools === 'string' && proj.tools.trim().length > 0) {
      return this.parseStringList(proj.tools);
    }

    return [];
  }

  /**
   * Parses highlights from project data
   * 
   * @param proj - Project object from profile
   * @returns Array of highlight strings
   */
  private parseProjectHighlights(proj: any): string[] {
    // If highlights is already an array, use it
    if (Array.isArray(proj.highlights)) {
      return proj.highlights.filter((h: any) => h && typeof h === 'string' && h.trim().length > 0);
    }

    // If achievements is an array, use it
    if (Array.isArray(proj.achievements)) {
      return proj.achievements.filter((a: any) => a && typeof a === 'string' && a.trim().length > 0);
    }

    // If features is an array, use it
    if (Array.isArray(proj.features)) {
      return proj.features.filter((f: any) => f && typeof f === 'string' && f.trim().length > 0);
    }

    // Try parsing as string
    if (typeof proj.highlights === 'string' && proj.highlights.trim().length > 0) {
      return this.parseStringList(proj.highlights);
    }

    if (typeof proj.achievements === 'string' && proj.achievements.trim().length > 0) {
      return this.parseStringList(proj.achievements);
    }

    if (typeof proj.features === 'string' && proj.features.trim().length > 0) {
      return this.parseStringList(proj.features);
    }

    return [];
  }

  /**
   * Parses a project string into structured project entries
   * 
   * Handles both simple descriptions and more complex formats.
   * Creates one or more project entries from the string.
   * 
   * @param projectString - String containing project information
   * @param defaultName - Default name to use if none can be extracted
   * @returns Array of project entries
   */
  private parseProjectString(projectString: string, defaultName: string): Project[] {
    const trimmed = projectString.trim();
    
    if (trimmed.length === 0) {
      return [];
    }

    // Try to detect multiple projects separated by double newlines or numbered lists
    const projectSeparators = ['\n\n', '\n---', '\n==='];
    let projectTexts: string[] = [trimmed];

    // Check for separators
    for (const separator of projectSeparators) {
      if (trimmed.includes(separator)) {
        projectTexts = trimmed.split(separator).filter(p => p.trim().length > 0);
        break;
      }
    }

    // Check for numbered list (1., 2., etc.)
    if (projectTexts.length === 1 && /^\d+\.\s/.test(trimmed)) {
      projectTexts = trimmed
        .split(/\n(?=\d+\.\s)/)
        .filter(p => p.trim().length > 0);
    }

    return projectTexts.map((text, index) => {
      const cleanText = text.trim().replace(/^\d+\.\s*/, ''); // Remove leading numbers
      
      // Try to extract project name from first line
      const lines = cleanText.split('\n');
      let name = defaultName;
      let description = cleanText;

      if (lines.length > 1) {
        // First line might be the project name
        const firstLine = lines[0].trim();
        if (firstLine.length < 100 && firstLine.length > 0) {
          name = firstLine;
          description = lines.slice(1).join('\n').trim();
        }
      }

      // If multiple projects, add number to default name
      if (projectTexts.length > 1) {
        name = `${defaultName} ${index + 1}`;
      }

      return {
        id: generateId(),
        name,
        description,
        technologies: [],
        highlights: []
      };
    });
  }

  /**
   * Detects whether the user has real professional experience data
   * 
   * Checks if the profile contains structured work_experience data that can
   * be parsed and used. This is more reliable than checking experience_level
   * alone, as it verifies actual data presence.
   * 
   * @returns true if user has parseable work experience data, false otherwise
   */
  private hasProfileExperience(): boolean {
    // Primary check: does profile have work_experience data?
    if (!this.profile.work_experience) {
      return false;
    }

    // If it's an array, check if it has entries
    if (Array.isArray(this.profile.work_experience)) {
      return this.profile.work_experience.length > 0;
    }

    // If it's a string, try to parse it
    if (typeof this.profile.work_experience === 'string') {
      const trimmed = this.profile.work_experience.trim();
      
      // Empty string check
      if (trimmed.length === 0) {
        return false;
      }

      // Try to parse as JSON
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) && parsed.length > 0;
      } catch {
        // Not valid JSON, treat as no experience
        return false;
      }
    }

    return false;
  }
}
