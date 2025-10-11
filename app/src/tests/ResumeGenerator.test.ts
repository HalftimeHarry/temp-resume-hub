import { describe, it, expect, beforeEach } from 'vitest';
import { ResumeGenerator } from '$lib/services/ResumeGenerator';
import type { UserProfile } from '$lib/types';
import type { ExtendedResumeTemplate } from '$lib/templates/types';

describe('ResumeGenerator', () => {
  let mockProfile: UserProfile;
  let mockTemplate: ExtendedResumeTemplate;

  beforeEach(() => {
    // Mock user profile with basic data
    mockProfile = {
      id: 'user-123',
      user: 'user@example.com',
      first_name: 'John',
      last_name: 'Doe',
      phone: '+1234567890',
      location: 'San Francisco, CA',
      linkedin_url: 'https://linkedin.com/in/johndoe',
      portfolio_url: 'https://johndoe.com',
      target_industry: 'software-engineering',
      experience_level: 'mid-level',
      target_job_titles: 'Software Engineer, Full Stack Developer',
      key_skills: 'JavaScript, TypeScript, React, Node.js',
      career_stage: 'professional',
      role: 'job_seeker',
      plan: 'free',
      verified: true,
      active: true,
      profile_completed: true,
      created: '2024-01-01T00:00:00Z',
      updated: '2024-01-01T00:00:00Z'
    };

    // Mock template with starter data
    mockTemplate = {
      id: 'template-123',
      name: 'Modern Professional',
      description: 'A clean, modern template',
      category: 'Modern',
      thumbnail: '/templates/modern.svg',
      previewImages: ['/templates/modern-preview.png'],
      settings: {
        template: 'modern-professional',
        colorScheme: 'blue',
        fontSize: 'medium',
        spacing: 'normal',
        showProfileImage: false,
        sectionOrder: ['personal', 'summary', 'experience', 'education', 'skills']
      },
      sections: [],
      starterData: {
        personalInfo: {
          fullName: 'Template Name',
          email: 'template@example.com',
          phone: '',
          location: '',
          website: '',
          linkedin: '',
          github: '',
          summary: ''
        },
        summary: 'Experienced professional with a proven track record...',
        experience: [
          {
            id: 'exp-1',
            company: 'Example Corp',
            position: 'Software Engineer',
            location: 'Remote',
            startDate: '2020-01',
            endDate: '2023-12',
            current: false,
            description: 'Developed web applications',
            highlights: ['Built features', 'Improved performance']
          }
        ],
        education: [
          {
            id: 'edu-1',
            institution: 'University Example',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            location: 'City, State',
            startDate: '2016-09',
            endDate: '2020-05',
            current: false,
            gpa: '3.8',
            honors: ['Dean\'s List'],
            description: ''
          }
        ],
        skills: [
          {
            id: 'skill-1',
            name: 'JavaScript',
            level: 'advanced',
            category: 'Programming Languages'
          },
          {
            id: 'skill-2',
            name: 'React',
            level: 'advanced',
            category: 'Frameworks'
          }
        ],
        projects: [
          {
            id: 'proj-1',
            name: 'Example Project',
            description: 'Built a web application',
            technologies: ['React', 'Node.js'],
            url: 'https://example.com',
            github: 'https://github.com/example',
            startDate: '2023-01',
            endDate: '2023-06',
            current: false
          }
        ],
        settings: {
          layout: '1-page',
          mode: 'simple',
          template: 'modern-professional',
          colorScheme: 'blue',
          fontSize: 'medium',
          spacing: 'normal',
          showProfileImage: false,
          sectionOrder: ['personal', 'summary', 'experience', 'education', 'skills']
        }
      },
      isPremium: false,
      isPopular: true,
      createdBy: 'system',
      createdAt: '2024-01-01T00:00:00Z',
      usageCount: 100,
      rating: 4.5,
      tags: ['modern', 'professional']
    };
  });

  describe('constructor', () => {
    it('should initialize with profile and template', () => {
      const generator = new ResumeGenerator(mockProfile, mockTemplate);
      expect(generator).toBeInstanceOf(ResumeGenerator);
    });

    it('should use profile target_industry by default', () => {
      const generator = new ResumeGenerator(mockProfile, mockTemplate);
      const draft = generator.generateDraft();
      expect(draft).toBeDefined();
    });

    it('should accept custom targetIndustry parameter', () => {
      const generator = new ResumeGenerator(mockProfile, mockTemplate, 'healthcare');
      const draft = generator.generateDraft();
      expect(draft).toBeDefined();
    });

    it('should handle missing target_industry in profile', () => {
      const profileWithoutIndustry = { ...mockProfile, target_industry: undefined };
      const generator = new ResumeGenerator(profileWithoutIndustry, mockTemplate);
      const draft = generator.generateDraft();
      expect(draft).toBeDefined();
    });
  });

  describe('generateDraft', () => {
    it('should return complete ResumeBuilderData structure', () => {
      const generator = new ResumeGenerator(mockProfile, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft).toHaveProperty('personalInfo');
      expect(draft).toHaveProperty('summary');
      expect(draft).toHaveProperty('experience');
      expect(draft).toHaveProperty('education');
      expect(draft).toHaveProperty('skills');
      expect(draft).toHaveProperty('projects');
      expect(draft).toHaveProperty('settings');
      expect(draft).toHaveProperty('currentStep');
      expect(draft).toHaveProperty('completedSteps');
    });

    it('should initialize with correct default values', () => {
      const generator = new ResumeGenerator(mockProfile, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.currentStep).toBe('personal');
      expect(draft.completedSteps).toEqual([]);
      expect(Array.isArray(draft.experience)).toBe(true);
      expect(Array.isArray(draft.education)).toBe(true);
      expect(Array.isArray(draft.skills)).toBe(true);
      expect(Array.isArray(draft.projects)).toBe(true);
    });

    it('should use template settings', () => {
      const generator = new ResumeGenerator(mockProfile, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.settings.template).toBe('modern-professional');
      expect(draft.settings.colorScheme).toBe('blue');
      expect(draft.settings.fontSize).toBe('medium');
      expect(draft.settings.spacing).toBe('normal');
      expect(draft.settings.showProfileImage).toBe(false);
    });
  });

  describe('generatePersonalInfo', () => {
    it('should use profile data over template data', () => {
      const generator = new ResumeGenerator(mockProfile, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.personalInfo.fullName).toBe('John Doe');
      expect(draft.personalInfo.email).toBe('user@example.com');
      expect(draft.personalInfo.phone).toBe('+1234567890');
      expect(draft.personalInfo.location).toBe('San Francisco, CA');
      expect(draft.personalInfo.linkedin).toBe('https://linkedin.com/in/johndoe');
      expect(draft.personalInfo.website).toBe('https://johndoe.com');
    });

    it('should detect and skip placeholder values from template', () => {
      const templateWithPlaceholders = {
        ...mockTemplate,
        starterData: {
          ...mockTemplate.starterData!,
          personalInfo: {
            fullName: 'John Doe', // Placeholder
            email: 'john.doe@email.com', // Placeholder
            phone: '(555) 123-4567', // Placeholder
            location: 'Your City, State', // Placeholder
            website: 'johndoe.com', // Placeholder
            linkedin: 'linkedin.com/in/johndoe', // Placeholder
            github: 'github.com/johndoe', // Placeholder
            summary: ''
          }
        }
      };

      const minimalProfile = {
        ...mockProfile,
        first_name: '',
        last_name: '',
        user: '',
        phone: undefined,
        location: undefined,
        portfolio_url: undefined,
        linkedin_url: undefined
      };

      const generator = new ResumeGenerator(minimalProfile, templateWithPlaceholders);
      const draft = generator.generateDraft();

      // All placeholders should be filtered out, resulting in empty strings
      expect(draft.personalInfo.fullName).toBe('');
      expect(draft.personalInfo.email).toBe('');
      expect(draft.personalInfo.phone).toBe('');
      expect(draft.personalInfo.location).toBe('');
      expect(draft.personalInfo.website).toBe('');
      expect(draft.personalInfo.linkedin).toBe('');
      expect(draft.personalInfo.github).toBe('');
    });

    it('should use template data when it is not a placeholder', () => {
      const templateWithRealData = {
        ...mockTemplate,
        starterData: {
          ...mockTemplate.starterData!,
          personalInfo: {
            fullName: 'Real Template Name',
            email: 'real@company.com',
            phone: '+1-800-COMPANY',
            location: 'New York, NY',
            website: 'company.com',
            linkedin: 'linkedin.com/company/realcompany',
            github: 'github.com/realcompany',
            summary: ''
          }
        }
      };

      const minimalProfile = {
        ...mockProfile,
        first_name: '',
        last_name: '',
        user: '',
        phone: undefined,
        location: undefined,
        portfolio_url: undefined,
        linkedin_url: undefined
      };

      const generator = new ResumeGenerator(minimalProfile, templateWithRealData);
      const draft = generator.generateDraft();

      // Real template data should be used
      expect(draft.personalInfo.fullName).toBe('Real Template Name');
      expect(draft.personalInfo.email).toBe('real@company.com');
      expect(draft.personalInfo.phone).toBe('+1-800-COMPANY');
      expect(draft.personalInfo.location).toBe('New York, NY');
    });

    it('should handle partial profile data', () => {
      const partialProfile = {
        ...mockProfile,
        first_name: 'Jane',
        last_name: 'Smith',
        phone: undefined,
        location: undefined,
        portfolio_url: undefined,
        linkedin_url: 'https://linkedin.com/in/janesmith'
      };

      const generator = new ResumeGenerator(partialProfile, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.personalInfo.fullName).toBe('Jane Smith');
      expect(draft.personalInfo.email).toBe('user@example.com');
      expect(draft.personalInfo.linkedin).toBe('https://linkedin.com/in/janesmith');
      expect(draft.personalInfo.phone).toBe(''); // Template has placeholder
      expect(draft.personalInfo.location).toBe(''); // Template has placeholder
    });

    it('should handle missing template starter data', () => {
      const templateWithoutStarter = {
        ...mockTemplate,
        starterData: undefined
      };
      const generator = new ResumeGenerator(mockProfile, templateWithoutStarter);
      const draft = generator.generateDraft();

      expect(draft.personalInfo.fullName).toBe('John Doe');
      expect(draft.personalInfo.email).toBe('user@example.com');
      expect(draft.personalInfo.phone).toBe('+1234567890');
    });

    it('should trim whitespace from all fields', () => {
      const profileWithWhitespace = {
        ...mockProfile,
        first_name: '  John  ',
        last_name: '  Doe  ',
        phone: '  +1234567890  ',
        location: '  San Francisco, CA  '
      };

      const generator = new ResumeGenerator(profileWithWhitespace, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.personalInfo.fullName).toBe('John Doe');
      expect(draft.personalInfo.phone).toBe('+1234567890');
      expect(draft.personalInfo.location).toBe('San Francisco, CA');
    });

    it('should handle case-insensitive placeholder detection', () => {
      const templateWithMixedCase = {
        ...mockTemplate,
        starterData: {
          ...mockTemplate.starterData!,
          personalInfo: {
            fullName: 'JOHN DOE', // Uppercase placeholder
            email: 'JOHN.DOE@EMAIL.COM', // Uppercase placeholder
            phone: '',
            location: 'your city, state', // Lowercase placeholder
            website: '',
            linkedin: '',
            github: '',
            summary: ''
          }
        }
      };

      const minimalProfile = {
        ...mockProfile,
        first_name: '',
        last_name: '',
        user: '',
        location: undefined
      };

      const generator = new ResumeGenerator(minimalProfile, templateWithMixedCase);
      const draft = generator.generateDraft();

      expect(draft.personalInfo.fullName).toBe('');
      expect(draft.personalInfo.email).toBe('');
      expect(draft.personalInfo.location).toBe('');
    });

    it('should handle empty first or last name gracefully', () => {
      const profileWithOnlyFirstName = {
        ...mockProfile,
        first_name: 'John',
        last_name: ''
      };

      const generator = new ResumeGenerator(profileWithOnlyFirstName, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.personalInfo.fullName).toBe('John');

      const profileWithOnlyLastName = {
        ...mockProfile,
        first_name: '',
        last_name: 'Doe'
      };

      const generator2 = new ResumeGenerator(profileWithOnlyLastName, mockTemplate);
      const draft2 = generator2.generateDraft();

      expect(draft2.personalInfo.fullName).toBe('Doe');
    });
  });

  describe('generateSummary', () => {
    it('should use profile professional_summary when available', () => {
      const profileWithSummary = {
        ...mockProfile,
        professional_summary: 'Passionate software engineer with 5 years of experience building scalable web applications.'
      };
      const generator = new ResumeGenerator(profileWithSummary, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.summary).toBe('Passionate software engineer with 5 years of experience building scalable web applications.');
    });

    it('should prioritize profile summary over template summary', () => {
      const profileWithSummary = {
        ...mockProfile,
        professional_summary: 'My custom professional summary'
      };
      const generator = new ResumeGenerator(profileWithSummary, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.summary).toBe('My custom professional summary');
      expect(draft.summary).not.toBe(mockTemplate.starterData?.summary);
    });

    it('should fall back to template summary when no profile summary', () => {
      const profileWithoutSummary = {
        ...mockProfile,
        professional_summary: undefined
      };
      const generator = new ResumeGenerator(profileWithoutSummary, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.summary).toBe('Experienced professional with a proven track record...');
    });

    it('should trim whitespace from profile summary', () => {
      const profileWithWhitespaceSummary = {
        ...mockProfile,
        professional_summary: '   My professional summary with extra spaces   '
      };
      const generator = new ResumeGenerator(profileWithWhitespaceSummary, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.summary).toBe('My professional summary with extra spaces');
    });

    it('should treat empty string profile summary as no summary', () => {
      const profileWithEmptySummary = {
        ...mockProfile,
        professional_summary: ''
      };
      const generator = new ResumeGenerator(profileWithEmptySummary, mockTemplate);
      const draft = generator.generateDraft();

      // Should fall back to template
      expect(draft.summary).toBe('Experienced professional with a proven track record...');
    });

    it('should treat whitespace-only profile summary as no summary', () => {
      const profileWithWhitespaceOnly = {
        ...mockProfile,
        professional_summary: '   \n  \t  '
      };
      const generator = new ResumeGenerator(profileWithWhitespaceOnly, mockTemplate);
      const draft = generator.generateDraft();

      // Should fall back to template
      expect(draft.summary).toBe('Experienced professional with a proven track record...');
    });

    it('should return empty string when no profile or template summary', () => {
      const profileWithoutSummary = {
        ...mockProfile,
        professional_summary: undefined
      };
      const templateWithoutSummary = {
        ...mockTemplate,
        starterData: {
          ...mockTemplate.starterData!,
          summary: ''
        }
      };
      const generator = new ResumeGenerator(profileWithoutSummary, templateWithoutSummary);
      const draft = generator.generateDraft();

      expect(draft.summary).toBe('');
    });

    it('should use profile summary with target industry', () => {
      const profileWithSummary = {
        ...mockProfile,
        professional_summary: 'Experienced developer',
        target_industry: 'software-engineering'
      };
      const generator = new ResumeGenerator(profileWithSummary, mockTemplate);
      const draft = generator.generateDraft();

      // Should use profile summary (enhancement is future feature)
      expect(draft.summary).toBe('Experienced developer');
    });

    it('should use custom target industry parameter', () => {
      const profileWithSummary = {
        ...mockProfile,
        professional_summary: 'Data professional with analytics expertise',
        target_industry: 'software'
      };
      const generator = new ResumeGenerator(profileWithSummary, mockTemplate, 'data-science');
      const draft = generator.generateDraft();

      // Should use profile summary with custom industry
      expect(draft.summary).toBe('Data professional with analytics expertise');
    });

    it('should handle missing template starterData', () => {
      const profileWithoutSummary = {
        ...mockProfile,
        professional_summary: undefined
      };
      const templateWithoutStarter = {
        ...mockTemplate,
        starterData: undefined
      };
      const generator = new ResumeGenerator(profileWithoutSummary, templateWithoutStarter);
      const draft = generator.generateDraft();

      expect(draft.summary).toBe('');
    });

    it('should handle long profile summaries', () => {
      const longSummary = 'A highly motivated and results-driven professional with over 10 years of experience in software development. Proven track record of delivering high-quality solutions in fast-paced environments. Expert in multiple programming languages and frameworks. Strong leadership and communication skills with a passion for mentoring junior developers.';
      
      const profileWithLongSummary = {
        ...mockProfile,
        professional_summary: longSummary
      };
      const generator = new ResumeGenerator(profileWithLongSummary, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.summary).toBe(longSummary);
      expect(draft.summary.length).toBeGreaterThan(100);
    });

    it('should handle summaries with special characters', () => {
      const summaryWithSpecialChars = 'Expert in C++, C#, and .NET development. Specialized in AI/ML & data-driven solutions.';
      
      const profileWithSpecialChars = {
        ...mockProfile,
        professional_summary: summaryWithSpecialChars
      };
      const generator = new ResumeGenerator(profileWithSpecialChars, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.summary).toBe(summaryWithSpecialChars);
    });

    it('should handle summaries with line breaks', () => {
      const summaryWithLineBreaks = 'Experienced developer.\nPassionate about clean code.\nTeam player.';
      
      const profileWithLineBreaks = {
        ...mockProfile,
        professional_summary: summaryWithLineBreaks
      };
      const generator = new ResumeGenerator(profileWithLineBreaks, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.summary).toBe(summaryWithLineBreaks);
    });
  });

  describe('generateSkills', () => {
    it('should parse key_skills from profile', () => {
      const generator = new ResumeGenerator(mockProfile, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.skills.length).toBeGreaterThan(0);
      const skillNames = draft.skills.map(s => s.name);
      expect(skillNames).toContain('JavaScript');
      expect(skillNames).toContain('TypeScript');
      expect(skillNames).toContain('React');
      expect(skillNames).toContain('Node.js');
    });

    it('should parse technical_proficiencies for students', () => {
      const studentProfile = {
        ...mockProfile,
        experience_level: 'student',
        key_skills: '',
        technical_proficiencies: 'Python, Java, SQL'
      };
      const generator = new ResumeGenerator(studentProfile, mockTemplate);
      const draft = generator.generateDraft();

      const skillNames = draft.skills.map(s => s.name);
      expect(skillNames).toContain('Python');
      expect(skillNames).toContain('Java');
      expect(skillNames).toContain('SQL');
    });

    it('should avoid duplicate skills (case-insensitive)', () => {
      const profileWithDuplicates = {
        ...mockProfile,
        key_skills: 'JavaScript, React, JAVASCRIPT',
        technical_proficiencies: 'javascript, Python, react'
      };
      const generator = new ResumeGenerator(profileWithDuplicates, mockTemplate);
      const draft = generator.generateDraft();

      const skillNames = draft.skills.map(s => s.name.toLowerCase());
      const jsCount = skillNames.filter(name => name === 'javascript').length;
      const reactCount = skillNames.filter(name => name === 'react').length;
      
      expect(jsCount).toBe(1);
      expect(reactCount).toBe(1);
    });

    it('should merge profile skills with template skills', () => {
      const profileWithSomeSkills = {
        ...mockProfile,
        key_skills: 'Python, Django'
      };
      const generator = new ResumeGenerator(profileWithSomeSkills, mockTemplate);
      const draft = generator.generateDraft();

      const skillNames = draft.skills.map(s => s.name);
      
      // Should have profile skills
      expect(skillNames).toContain('Python');
      expect(skillNames).toContain('Django');
      
      // Should also have template skills (if not duplicates)
      expect(draft.skills.length).toBeGreaterThan(2);
    });

    it('should not duplicate skills when merging with template', () => {
      const profileWithTemplateSkills = {
        ...mockProfile,
        key_skills: 'JavaScript, React' // Same as template
      };
      const generator = new ResumeGenerator(profileWithTemplateSkills, mockTemplate);
      const draft = generator.generateDraft();

      const skillNames = draft.skills.map(s => s.name.toLowerCase());
      const jsCount = skillNames.filter(name => name === 'javascript').length;
      const reactCount = skillNames.filter(name => name === 'react').length;
      
      expect(jsCount).toBe(1);
      expect(reactCount).toBe(1);
    });

    it('should categorize programming languages correctly', () => {
      const profileWithLanguages = {
        ...mockProfile,
        key_skills: 'Python, JavaScript, Java, C++, TypeScript'
      };
      const generator = new ResumeGenerator(profileWithLanguages, mockTemplate);
      const draft = generator.generateDraft();

      const languageSkills = draft.skills.filter(s => 
        ['Python', 'JavaScript', 'Java', 'C++', 'TypeScript'].includes(s.name)
      );
      
      languageSkills.forEach(skill => {
        expect(skill.category).toBe('Programming Languages');
      });
    });

    it('should categorize frameworks correctly', () => {
      const profileWithFrameworks = {
        ...mockProfile,
        key_skills: 'React, Angular, Vue, Django, Express'
      };
      const generator = new ResumeGenerator(profileWithFrameworks, mockTemplate);
      const draft = generator.generateDraft();

      const frameworkSkills = draft.skills.filter(s => 
        ['React', 'Angular', 'Vue', 'Django', 'Express'].includes(s.name)
      );
      
      frameworkSkills.forEach(skill => {
        expect(skill.category).toBe('Frameworks & Libraries');
      });
    });

    it('should categorize databases correctly', () => {
      const profileWithDatabases = {
        ...mockProfile,
        key_skills: 'MySQL, PostgreSQL, MongoDB, Redis'
      };
      const generator = new ResumeGenerator(profileWithDatabases, mockTemplate);
      const draft = generator.generateDraft();

      const dbSkills = draft.skills.filter(s => 
        ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis'].includes(s.name)
      );
      
      dbSkills.forEach(skill => {
        expect(skill.category).toBe('Databases');
      });
    });

    it('should categorize cloud & devops tools correctly', () => {
      const profileWithCloudDevOps = {
        ...mockProfile,
        key_skills: 'AWS, Docker, Kubernetes, Jenkins, Terraform'
      };
      const generator = new ResumeGenerator(profileWithCloudDevOps, mockTemplate);
      const draft = generator.generateDraft();

      const cloudSkills = draft.skills.filter(s => 
        ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform'].includes(s.name)
      );
      
      cloudSkills.forEach(skill => {
        expect(skill.category).toBe('Cloud & DevOps');
      });
    });

    it('should categorize soft skills correctly', () => {
      const profileWithSoftSkills = {
        ...mockProfile,
        key_skills: 'Leadership, Communication, Teamwork, Problem Solving'
      };
      const generator = new ResumeGenerator(profileWithSoftSkills, mockTemplate);
      const draft = generator.generateDraft();

      const softSkills = draft.skills.filter(s => 
        ['Leadership', 'Communication', 'Teamwork', 'Problem Solving'].includes(s.name)
      );
      
      softSkills.forEach(skill => {
        expect(skill.category).toBe('Soft Skills');
      });
    });

    it('should assign beginner level for students', () => {
      const studentProfile = {
        ...mockProfile,
        experience_level: 'student',
        key_skills: 'Python, JavaScript'
      };
      const generator = new ResumeGenerator(studentProfile, mockTemplate);
      const draft = generator.generateDraft();

      const profileSkills = draft.skills.filter(s => 
        ['Python', 'JavaScript'].includes(s.name)
      );
      
      profileSkills.forEach(skill => {
        expect(skill.level).toBe('beginner');
      });
    });

    it('should assign intermediate level for mid-level professionals', () => {
      const midLevelProfile = {
        ...mockProfile,
        experience_level: 'mid-level',
        key_skills: 'Python, JavaScript'
      };
      const generator = new ResumeGenerator(midLevelProfile, mockTemplate);
      const draft = generator.generateDraft();

      const profileSkills = draft.skills.filter(s => 
        ['Python', 'JavaScript'].includes(s.name)
      );
      
      profileSkills.forEach(skill => {
        expect(skill.level).toBe('intermediate');
      });
    });

    it('should assign advanced level for senior professionals', () => {
      const seniorProfile = {
        ...mockProfile,
        experience_level: 'senior',
        key_skills: 'Python, JavaScript'
      };
      const generator = new ResumeGenerator(seniorProfile, mockTemplate);
      const draft = generator.generateDraft();

      const profileSkills = draft.skills.filter(s => 
        ['Python', 'JavaScript'].includes(s.name)
      );
      
      profileSkills.forEach(skill => {
        expect(skill.level).toBe('advanced');
      });
    });

    it('should assign expert level for principal/architect roles', () => {
      const principalProfile = {
        ...mockProfile,
        experience_level: 'principal',
        key_skills: 'Python, JavaScript'
      };
      const generator = new ResumeGenerator(principalProfile, mockTemplate);
      const draft = generator.generateDraft();

      const profileSkills = draft.skills.filter(s => 
        ['Python', 'JavaScript'].includes(s.name)
      );
      
      profileSkills.forEach(skill => {
        expect(skill.level).toBe('expert');
      });
    });

    it('should generate unique IDs for each skill', () => {
      const profileWithSkills = {
        ...mockProfile,
        key_skills: 'Skill1, Skill2, Skill3, Skill4, Skill5'
      };
      const generator = new ResumeGenerator(profileWithSkills, mockTemplate);
      const draft = generator.generateDraft();

      const ids = draft.skills.map(s => s.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(ids.length); // All IDs should be unique
      ids.forEach(id => expect(id).toBeDefined());
    });

    it('should handle empty skill strings gracefully', () => {
      const profileWithEmptySkills = {
        ...mockProfile,
        key_skills: '  ,  , ,  ',
        technical_proficiencies: ''
      };
      const generator = new ResumeGenerator(profileWithEmptySkills, mockTemplate);
      const draft = generator.generateDraft();

      // Should fall back to template skills
      expect(draft.skills.length).toBeGreaterThan(0);
    });

    it('should trim whitespace from skill names', () => {
      const profileWithWhitespace = {
        ...mockProfile,
        key_skills: '  Python  ,   JavaScript   ,  React  '
      };
      const generator = new ResumeGenerator(profileWithWhitespace, mockTemplate);
      const draft = generator.generateDraft();

      const skillNames = draft.skills.map(s => s.name);
      expect(skillNames).toContain('Python');
      expect(skillNames).toContain('JavaScript');
      expect(skillNames).toContain('React');
      
      // Should not have leading/trailing spaces
      draft.skills.forEach(skill => {
        expect(skill.name).toBe(skill.name.trim());
      });
    });

    it('should use template skills when no profile skills', () => {
      const profileWithoutSkills = {
        ...mockProfile,
        key_skills: undefined,
        technical_proficiencies: undefined
      };
      const generator = new ResumeGenerator(profileWithoutSkills, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.skills.length).toBeGreaterThan(0);
      expect(draft.skills[0].name).toBe('JavaScript');
    });

    it('should handle skills with special characters', () => {
      const profileWithSpecialChars = {
        ...mockProfile,
        key_skills: 'C++, C#, Node.js, ASP.NET, Vue.js'
      };
      const generator = new ResumeGenerator(profileWithSpecialChars, mockTemplate);
      const draft = generator.generateDraft();

      const skillNames = draft.skills.map(s => s.name);
      expect(skillNames).toContain('C++');
      expect(skillNames).toContain('C#');
      expect(skillNames).toContain('Node.js');
      expect(skillNames).toContain('ASP.NET');
      expect(skillNames).toContain('Vue.js');
    });

    it('should default to Technical category for unknown skills', () => {
      const profileWithUnknownSkills = {
        ...mockProfile,
        key_skills: 'UnknownSkill1, UnknownSkill2'
      };
      const generator = new ResumeGenerator(profileWithUnknownSkills, mockTemplate);
      const draft = generator.generateDraft();

      const unknownSkills = draft.skills.filter(s => 
        ['UnknownSkill1', 'UnknownSkill2'].includes(s.name)
      );
      
      unknownSkills.forEach(skill => {
        expect(skill.category).toBe('Technical');
      });
    });
  });

  describe('generateProjects', () => {
    it('should parse structured projects from array', () => {
      const profileWithStructuredProjects = {
        ...mockProfile,
        projects: [
          {
            name: 'E-commerce Platform',
            description: 'Built a full-stack e-commerce application',
            technologies: ['React', 'Node.js', 'MongoDB'],
            url: 'https://example.com',
            github: 'https://github.com/user/ecommerce',
            start_date: '2023-01',
            end_date: '2023-06',
            highlights: ['Implemented payment integration', 'Built admin dashboard']
          },
          {
            title: 'Weather App', // Using 'title' instead of 'name'
            summary: 'Mobile weather application', // Using 'summary' instead of 'description'
            tech_stack: ['React Native', 'OpenWeather API'], // Using 'tech_stack'
            demo_url: 'https://weather.app',
            repo: 'https://github.com/user/weather',
            features: ['Real-time updates', 'Location-based forecasts']
          }
        ]
      };

      const generator = new ResumeGenerator(profileWithStructuredProjects, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.projects.length).toBe(2);
      
      // First project
      expect(draft.projects[0].name).toBe('E-commerce Platform');
      expect(draft.projects[0].description).toBe('Built a full-stack e-commerce application');
      expect(draft.projects[0].technologies).toEqual(['React', 'Node.js', 'MongoDB']);
      expect(draft.projects[0].url).toBe('https://example.com');
      expect(draft.projects[0].github).toBe('https://github.com/user/ecommerce');
      expect(draft.projects[0].startDate).toBe('2023-01');
      expect(draft.projects[0].endDate).toBe('2023-06');
      expect(draft.projects[0].highlights).toEqual(['Implemented payment integration', 'Built admin dashboard']);
      expect(draft.projects[0].id).toBeDefined();

      // Second project with alternative field names
      expect(draft.projects[1].name).toBe('Weather App');
      expect(draft.projects[1].description).toBe('Mobile weather application');
      expect(draft.projects[1].technologies).toEqual(['React Native', 'OpenWeather API']);
      expect(draft.projects[1].url).toBe('https://weather.app');
      expect(draft.projects[1].github).toBe('https://github.com/user/weather');
      expect(draft.projects[1].highlights).toEqual(['Real-time updates', 'Location-based forecasts']);
    });

    it('should parse projects from JSON string', () => {
      const profileWithJsonProjects = {
        ...mockProfile,
        projects: JSON.stringify([
          {
            project_name: 'Portfolio Website',
            description: 'Personal portfolio built with Svelte',
            tools: 'Svelte, TailwindCSS, Netlify',
            link: 'https://portfolio.dev',
            github_url: 'https://github.com/user/portfolio',
            achievements: 'Achieved 100% Lighthouse score\nImplemented dark mode'
          }
        ])
      };

      const generator = new ResumeGenerator(profileWithJsonProjects, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.projects.length).toBe(1);
      expect(draft.projects[0].name).toBe('Portfolio Website');
      expect(draft.projects[0].technologies).toEqual(['Svelte', 'TailwindCSS', 'Netlify']);
      expect(draft.projects[0].highlights).toEqual(['Achieved 100% Lighthouse score', 'Implemented dark mode']);
    });

    it('should parse academic_projects for students', () => {
      const studentProfile = {
        ...mockProfile,
        experience_level: 'student',
        academic_projects: 'Built a machine learning model for image classification using Python and TensorFlow'
      };
      const generator = new ResumeGenerator(studentProfile, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.projects.length).toBeGreaterThan(0);
      const academicProject = draft.projects.find(p => p.name === 'Academic Project');
      expect(academicProject).toBeDefined();
      expect(academicProject?.description).toContain('machine learning');
    });

    it('should parse personal_projects', () => {
      const profileWithProjects = {
        ...mockProfile,
        personal_projects: 'Created a task management web app with React and Firebase'
      };
      const generator = new ResumeGenerator(profileWithProjects, mockTemplate);
      const draft = generator.generateDraft();

      const personalProject = draft.projects.find(p => p.name === 'Personal Project');
      expect(personalProject).toBeDefined();
      expect(personalProject?.description).toContain('task management');
    });

    it('should parse volunteer_experience as projects', () => {
      const profileWithVolunteer = {
        ...mockProfile,
        volunteer_experience: 'Developed website for local non-profit organization'
      };
      const generator = new ResumeGenerator(profileWithVolunteer, mockTemplate);
      const draft = generator.generateDraft();

      const volunteerProject = draft.projects.find(p => p.name === 'Volunteer Experience');
      expect(volunteerProject).toBeDefined();
      expect(volunteerProject?.description).toContain('non-profit');
    });

    it('should parse extracurricular_activities as projects', () => {
      const profileWithExtracurricular = {
        ...mockProfile,
        extracurricular_activities: 'Led coding club and organized hackathons'
      };
      const generator = new ResumeGenerator(profileWithExtracurricular, mockTemplate);
      const draft = generator.generateDraft();

      const extracurricularProject = draft.projects.find(p => p.name === 'Extracurricular Activity');
      expect(extracurricularProject).toBeDefined();
      expect(extracurricularProject?.description).toContain('coding club');
    });

    it('should combine all project sources', () => {
      const profileWithAllSources = {
        ...mockProfile,
        academic_projects: 'Academic work',
        personal_projects: 'Personal work',
        volunteer_experience: 'Volunteer work',
        extracurricular_activities: 'Club activities'
      };
      const generator = new ResumeGenerator(profileWithAllSources, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.projects.length).toBe(4);
    });

    it('should parse multiple projects from numbered list', () => {
      const profileWithNumberedProjects = {
        ...mockProfile,
        academic_projects: '1. Machine Learning Project\nBuilt image classifier\n2. Web Development Project\nCreated e-commerce site\n3. Mobile App\nDeveloped iOS app'
      };
      const generator = new ResumeGenerator(profileWithNumberedProjects, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.projects.length).toBe(3);
      expect(draft.projects[0].name).toBe('Academic Project 1');
      expect(draft.projects[1].name).toBe('Academic Project 2');
      expect(draft.projects[2].name).toBe('Academic Project 3');
    });

    it('should parse multiple projects separated by double newlines', () => {
      const profileWithSeparatedProjects = {
        ...mockProfile,
        personal_projects: 'Project One\nDescription of first project\n\nProject Two\nDescription of second project'
      };
      const generator = new ResumeGenerator(profileWithSeparatedProjects, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.projects.length).toBe(2);
    });

    it('should extract project name from first line', () => {
      const profileWithNamedProject = {
        ...mockProfile,
        academic_projects: 'Capstone Project\nDeveloped a comprehensive web application for student management'
      };
      const generator = new ResumeGenerator(profileWithNamedProject, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.projects[0].name).toBe('Capstone Project');
      expect(draft.projects[0].description).toBe('Developed a comprehensive web application for student management');
    });

    it('should generate unique IDs for each project', () => {
      const profileWithMultipleProjects = {
        ...mockProfile,
        projects: [
          { name: 'Project 1', description: 'First project' },
          { name: 'Project 2', description: 'Second project' },
          { name: 'Project 3', description: 'Third project' }
        ]
      };
      const generator = new ResumeGenerator(profileWithMultipleProjects, mockTemplate);
      const draft = generator.generateDraft();

      const ids = draft.projects.map(p => p.id);
      const uniqueIds = new Set(ids);
      
      expect(ids.length).toBe(3);
      expect(uniqueIds.size).toBe(3);
      ids.forEach(id => expect(id).toBeDefined());
    });

    it('should handle comma-separated technologies', () => {
      const profileWithTechString = {
        ...mockProfile,
        projects: [
          {
            name: 'Test Project',
            description: 'Test',
            technologies: 'React, Node.js, MongoDB, Express'
          }
        ]
      };
      const generator = new ResumeGenerator(profileWithTechString, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.projects[0].technologies).toEqual(['React', 'Node.js', 'MongoDB', 'Express']);
    });

    it('should handle newline-separated highlights', () => {
      const profileWithNewlineHighlights = {
        ...mockProfile,
        projects: [
          {
            name: 'Test Project',
            description: 'Test',
            highlights: 'Feature 1\nFeature 2\nFeature 3'
          }
        ]
      };
      const generator = new ResumeGenerator(profileWithNewlineHighlights, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.projects[0].highlights).toEqual(['Feature 1', 'Feature 2', 'Feature 3']);
    });

    it('should use template projects when no profile projects', () => {
      const profileWithoutProjects = {
        ...mockProfile,
        projects: undefined,
        academic_projects: undefined,
        personal_projects: undefined,
        volunteer_experience: undefined,
        extracurricular_activities: undefined
      };
      const generator = new ResumeGenerator(profileWithoutProjects, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.projects.length).toBeGreaterThan(0);
      expect(draft.projects[0].name).toBe('Example Project');
    });

    it('should handle empty projects array', () => {
      const profileWithEmptyProjects = {
        ...mockProfile,
        projects: []
      };
      const generator = new ResumeGenerator(profileWithEmptyProjects, mockTemplate);
      const draft = generator.generateDraft();

      // Should fall back to template
      expect(draft.projects[0].name).toBe('Example Project');
    });

    it('should handle invalid JSON gracefully', () => {
      const profileWithInvalidJson = {
        ...mockProfile,
        projects: '{invalid json}'
      };
      const generator = new ResumeGenerator(profileWithInvalidJson, mockTemplate);
      const draft = generator.generateDraft();

      // Should fall back to template
      expect(draft.projects[0].name).toBe('Example Project');
    });

    it('should handle missing optional fields', () => {
      const profileWithMinimalProject = {
        ...mockProfile,
        projects: [
          {
            name: 'Minimal Project',
            description: 'Just a description'
          }
        ]
      };
      const generator = new ResumeGenerator(profileWithMinimalProject, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.projects[0].name).toBe('Minimal Project');
      expect(draft.projects[0].description).toBe('Just a description');
      expect(draft.projects[0].technologies).toEqual([]);
      expect(draft.projects[0].url).toBe('');
      expect(draft.projects[0].github).toBe('');
      expect(draft.projects[0].highlights).toEqual([]);
    });

    it('should filter out empty technologies', () => {
      const profileWithEmptyTech = {
        ...mockProfile,
        projects: [
          {
            name: 'Test',
            description: 'Test',
            technologies: ['React', '', '  ', 'Node.js']
          }
        ]
      };
      const generator = new ResumeGenerator(profileWithEmptyTech, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.projects[0].technologies).toEqual(['React', 'Node.js']);
    });

    it('should handle default project name when none provided', () => {
      const profileWithUnnamedProject = {
        ...mockProfile,
        projects: [
          {
            description: 'A project without a name'
          }
        ]
      };
      const generator = new ResumeGenerator(profileWithUnnamedProject, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.projects[0].name).toBe('Untitled Project');
    });

    it('should prioritize structured projects over text fields', () => {
      const profileWithBoth = {
        ...mockProfile,
        projects: [
          { name: 'Structured Project', description: 'From structured data' }
        ],
        academic_projects: 'Academic text project',
        personal_projects: 'Personal text project'
      };
      const generator = new ResumeGenerator(profileWithBoth, mockTemplate);
      const draft = generator.generateDraft();

      // Should only use structured projects
      expect(draft.projects.length).toBe(1);
      expect(draft.projects[0].name).toBe('Structured Project');
    });
  });

  describe('generateExperience', () => {
    it('should parse and use profile work_experience when available as array', () => {
      const profileWithExperience = {
        ...mockProfile,
        work_experience: [
          {
            company: 'Tech Corp',
            position: 'Senior Developer',
            location: 'Remote',
            start_date: '2020-01',
            end_date: '2023-12',
            current: false,
            description: 'Led development team',
            highlights: ['Built microservices', 'Improved performance by 50%']
          },
          {
            company: 'Startup Inc',
            position: 'Full Stack Developer',
            location: 'San Francisco, CA',
            start_date: '2018-06',
            end_date: '2019-12',
            current: false,
            description: 'Developed web applications',
            achievements: ['Launched 3 products', 'Reduced load time']
          }
        ]
      };

      const generator = new ResumeGenerator(profileWithExperience, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.experience.length).toBe(2);
      expect(draft.experience[0].company).toBe('Tech Corp');
      expect(draft.experience[0].position).toBe('Senior Developer');
      expect(draft.experience[0].location).toBe('Remote');
      expect(draft.experience[0].startDate).toBe('2020-01');
      expect(draft.experience[0].endDate).toBe('2023-12');
      expect(draft.experience[0].current).toBe(false);
      expect(draft.experience[0].description).toBe('Led development team');
      expect(draft.experience[0].highlights).toEqual(['Built microservices', 'Improved performance by 50%']);
      expect(draft.experience[0].id).toBeDefined();

      expect(draft.experience[1].company).toBe('Startup Inc');
      expect(draft.experience[1].highlights).toEqual(['Launched 3 products', 'Reduced load time']);
    });

    it('should parse work_experience from JSON string', () => {
      const profileWithJsonExperience = {
        ...mockProfile,
        work_experience: JSON.stringify([
          {
            company: 'JSON Corp',
            title: 'Developer', // Using 'title' instead of 'position'
            location: 'NYC',
            startDate: '2021-01', // Using camelCase
            endDate: '2022-12',
            is_current: false, // Using 'is_current' instead of 'current'
            summary: 'Worked on projects', // Using 'summary' instead of 'description'
            highlights: 'Achievement 1\nAchievement 2\nAchievement 3' // Newline-separated
          }
        ])
      };

      const generator = new ResumeGenerator(profileWithJsonExperience, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.experience.length).toBe(1);
      expect(draft.experience[0].company).toBe('JSON Corp');
      expect(draft.experience[0].position).toBe('Developer');
      expect(draft.experience[0].description).toBe('Worked on projects');
      expect(draft.experience[0].highlights).toEqual(['Achievement 1', 'Achievement 2', 'Achievement 3']);
    });

    it('should handle comma-separated highlights', () => {
      const profileWithCommaHighlights = {
        ...mockProfile,
        work_experience: [
          {
            company: 'Test Co',
            position: 'Engineer',
            highlights: 'First achievement, Second achievement, Third achievement'
          }
        ]
      };

      const generator = new ResumeGenerator(profileWithCommaHighlights, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.experience[0].highlights).toEqual([
        'First achievement',
        'Second achievement',
        'Third achievement'
      ]);
    });

    it('should handle single highlight string', () => {
      const profileWithSingleHighlight = {
        ...mockProfile,
        work_experience: [
          {
            company: 'Test Co',
            position: 'Engineer',
            highlights: 'Single achievement without separators'
          }
        ]
      };

      const generator = new ResumeGenerator(profileWithSingleHighlight, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.experience[0].highlights).toEqual(['Single achievement without separators']);
    });

    it('should map alternative field names', () => {
      const profileWithAltFields = {
        ...mockProfile,
        work_experience: [
          {
            employer: 'Alt Corp', // Using 'employer' instead of 'company'
            role: 'Tech Lead', // Using 'role' instead of 'position'
            start_date: '2020-01',
            end_date: '2021-12',
            is_current: false,
            summary: 'Led technical initiatives'
          }
        ]
      };

      const generator = new ResumeGenerator(profileWithAltFields, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.experience[0].company).toBe('Alt Corp');
      expect(draft.experience[0].position).toBe('Tech Lead');
      expect(draft.experience[0].description).toBe('Led technical initiatives');
    });

    it('should generate unique IDs for each experience entry', () => {
      const profileWithMultipleExp = {
        ...mockProfile,
        work_experience: [
          { company: 'Company 1', position: 'Role 1' },
          { company: 'Company 2', position: 'Role 2' },
          { company: 'Company 3', position: 'Role 3' }
        ]
      };

      const generator = new ResumeGenerator(profileWithMultipleExp, mockTemplate);
      const draft = generator.generateDraft();

      const ids = draft.experience.map(exp => exp.id);
      const uniqueIds = new Set(ids);
      
      expect(ids.length).toBe(3);
      expect(uniqueIds.size).toBe(3); // All IDs should be unique
      ids.forEach(id => expect(id).toBeDefined());
    });

    it('should use template experience when no profile experience', () => {
      const profileWithoutExperience = {
        ...mockProfile,
        work_experience: undefined
      };

      const generator = new ResumeGenerator(profileWithoutExperience, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.experience.length).toBeGreaterThan(0);
      expect(draft.experience[0].company).toBe('Example Corp');
    });

    it('should use template experience when work_experience is empty array', () => {
      const profileWithEmptyExp = {
        ...mockProfile,
        work_experience: []
      };

      const generator = new ResumeGenerator(profileWithEmptyExp, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.experience.length).toBeGreaterThan(0);
      expect(draft.experience[0].company).toBe('Example Corp');
    });

    it('should use template experience when work_experience is empty string', () => {
      const profileWithEmptyString = {
        ...mockProfile,
        work_experience: ''
      };

      const generator = new ResumeGenerator(profileWithEmptyString, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.experience.length).toBeGreaterThan(0);
      expect(draft.experience[0].company).toBe('Example Corp');
    });

    it('should handle invalid JSON gracefully', () => {
      const profileWithInvalidJson = {
        ...mockProfile,
        work_experience: '{invalid json}'
      };

      const generator = new ResumeGenerator(profileWithInvalidJson, mockTemplate);
      const draft = generator.generateDraft();

      // Should fall back to template experience
      expect(draft.experience.length).toBeGreaterThan(0);
      expect(draft.experience[0].company).toBe('Example Corp');
    });

    it('should handle missing optional fields gracefully', () => {
      const profileWithMinimalExp = {
        ...mockProfile,
        work_experience: [
          {
            company: 'Minimal Corp',
            position: 'Developer'
            // No location, dates, description, or highlights
          }
        ]
      };

      const generator = new ResumeGenerator(profileWithMinimalExp, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.experience.length).toBe(1);
      expect(draft.experience[0].company).toBe('Minimal Corp');
      expect(draft.experience[0].position).toBe('Developer');
      expect(draft.experience[0].location).toBe('');
      expect(draft.experience[0].startDate).toBe('');
      expect(draft.experience[0].endDate).toBe('');
      expect(draft.experience[0].current).toBe(false);
      expect(draft.experience[0].description).toBe('');
      expect(draft.experience[0].highlights).toEqual([]);
    });

    it('should filter out empty highlights', () => {
      const profileWithEmptyHighlights = {
        ...mockProfile,
        work_experience: [
          {
            company: 'Test Co',
            position: 'Engineer',
            highlights: ['Valid highlight', '', '  ', 'Another valid one']
          }
        ]
      };

      const generator = new ResumeGenerator(profileWithEmptyHighlights, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.experience[0].highlights).toEqual(['Valid highlight', 'Another valid one']);
    });
  });

  describe('generateEducation', () => {
    it('should parse and use profile education when available as array', () => {
      const profileWithEducation = {
        ...mockProfile,
        education: [
          {
            institution: 'Stanford University',
            degree: 'Master of Science',
            field: 'Computer Science',
            location: 'Stanford, CA',
            start_date: '2021-09',
            end_date: '2023-06',
            current: false,
            gpa: '3.9',
            honors: ['Dean\'s List', 'Research Award'],
            description: 'Focus on AI and Machine Learning'
          },
          {
            school: 'UC Berkeley', // Using 'school' instead of 'institution'
            degree: 'Bachelor of Arts',
            major: 'Mathematics', // Using 'major' instead of 'field'
            location: 'Berkeley, CA',
            startDate: '2017-09', // Using camelCase
            endDate: '2021-05',
            is_current: false, // Using 'is_current'
            grade: '3.7/4.0', // Using 'grade' instead of 'gpa'
            achievements: ['Honors Program', 'Summa Cum Laude']
          }
        ]
      };

      const generator = new ResumeGenerator(profileWithEducation, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.education.length).toBe(2);
      
      // First education entry
      expect(draft.education[0].institution).toBe('Stanford University');
      expect(draft.education[0].degree).toBe('Master of Science');
      expect(draft.education[0].field).toBe('Computer Science');
      expect(draft.education[0].location).toBe('Stanford, CA');
      expect(draft.education[0].startDate).toBe('2021-09');
      expect(draft.education[0].endDate).toBe('2023-06');
      expect(draft.education[0].current).toBe(false);
      expect(draft.education[0].gpa).toBe('3.9');
      expect(draft.education[0].honors).toEqual(['Dean\'s List', 'Research Award']);
      expect(draft.education[0].description).toBe('Focus on AI and Machine Learning');
      expect(draft.education[0].id).toBeDefined();

      // Second education entry with alternative field names
      expect(draft.education[1].institution).toBe('UC Berkeley');
      expect(draft.education[1].field).toBe('Mathematics');
      expect(draft.education[1].gpa).toBe('3.7/4.0');
      expect(draft.education[1].honors).toEqual(['Honors Program', 'Summa Cum Laude']);
    });

    it('should parse education from JSON string', () => {
      const profileWithJsonEducation = {
        ...mockProfile,
        education: JSON.stringify([
          {
            university: 'MIT', // Using 'university'
            degree_type: 'PhD', // Using 'degree_type'
            field_of_study: 'Physics',
            location: 'Cambridge, MA',
            start_date: '2020-09',
            in_progress: true, // Using 'in_progress'
            notes: 'Quantum computing research'
          }
        ])
      };

      const generator = new ResumeGenerator(profileWithJsonEducation, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.education.length).toBe(1);
      expect(draft.education[0].institution).toBe('MIT');
      expect(draft.education[0].degree).toBe('PhD');
      expect(draft.education[0].field).toBe('Physics');
      expect(draft.education[0].current).toBe(true);
      expect(draft.education[0].description).toBe('Quantum computing research');
    });

    it('should handle newline-separated honors', () => {
      const profileWithNewlineHonors = {
        ...mockProfile,
        education: [
          {
            institution: 'Test University',
            degree: 'BS',
            honors: 'Honor 1\nHonor 2\nHonor 3'
          }
        ]
      };

      const generator = new ResumeGenerator(profileWithNewlineHonors, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.education[0].honors).toEqual(['Honor 1', 'Honor 2', 'Honor 3']);
    });

    it('should handle comma-separated honors', () => {
      const profileWithCommaHonors = {
        ...mockProfile,
        education: [
          {
            institution: 'Test University',
            degree: 'BS',
            honors: 'Magna Cum Laude, Dean\'s List, Honor Society'
          }
        ]
      };

      const generator = new ResumeGenerator(profileWithCommaHonors, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.education[0].honors).toEqual(['Magna Cum Laude', 'Dean\'s List', 'Honor Society']);
    });

    it('should handle single honor string', () => {
      const profileWithSingleHonor = {
        ...mockProfile,
        education: [
          {
            institution: 'Test University',
            degree: 'BS',
            honors: 'Summa Cum Laude'
          }
        ]
      };

      const generator = new ResumeGenerator(profileWithSingleHonor, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.education[0].honors).toEqual(['Summa Cum Laude']);
    });

    it('should parse awards field as honors', () => {
      const profileWithAwards = {
        ...mockProfile,
        education: [
          {
            institution: 'Test University',
            degree: 'BS',
            awards: 'Best Thesis Award, Research Grant'
          }
        ]
      };

      const generator = new ResumeGenerator(profileWithAwards, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.education[0].honors).toEqual(['Best Thesis Award', 'Research Grant']);
    });

    it('should generate unique IDs for each education entry', () => {
      const profileWithMultipleEdu = {
        ...mockProfile,
        education: [
          { institution: 'University 1', degree: 'BS' },
          { institution: 'University 2', degree: 'MS' },
          { institution: 'University 3', degree: 'PhD' }
        ]
      };

      const generator = new ResumeGenerator(profileWithMultipleEdu, mockTemplate);
      const draft = generator.generateDraft();

      const ids = draft.education.map(edu => edu.id);
      const uniqueIds = new Set(ids);
      
      expect(ids.length).toBe(3);
      expect(uniqueIds.size).toBe(3);
      ids.forEach(id => expect(id).toBeDefined());
    });

    it('should create basic education from education_level when no structured data', () => {
      const profileWithLevel = {
        ...mockProfile,
        education: undefined,
        education_level: 'Bachelor\'s Degree'
      };

      const generator = new ResumeGenerator(profileWithLevel, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.education.length).toBe(1);
      expect(draft.education[0].degree).toBe('Bachelor\'s Degree');
      expect(draft.education[0].institution).toBe(''); // To be filled
      expect(draft.education[0].field).toBe(''); // To be filled
    });

    it('should map common education levels to degree types', () => {
      const testCases = [
        { level: 'bachelor', expected: 'Bachelor\'s Degree' },
        { level: 'bachelors', expected: 'Bachelor\'s Degree' },
        { level: 'master', expected: 'Master\'s Degree' },
        { level: 'masters', expected: 'Master\'s Degree' },
        { level: 'phd', expected: 'Doctor of Philosophy' },
        { level: 'mba', expected: 'Master of Business Administration' },
        { level: 'associate', expected: 'Associate\'s Degree' },
        { level: 'high school', expected: 'High School Diploma' }
      ];

      testCases.forEach(({ level, expected }) => {
        const profile = {
          ...mockProfile,
          education: undefined,
          education_level: level
        };
        const generator = new ResumeGenerator(profile, mockTemplate);
        const draft = generator.generateDraft();

        expect(draft.education[0].degree).toBe(expected);
      });
    });

    it('should use template education when no profile education', () => {
      const profileWithoutEducation = {
        ...mockProfile,
        education: undefined,
        education_level: undefined
      };

      const generator = new ResumeGenerator(profileWithoutEducation, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.education.length).toBeGreaterThan(0);
      expect(draft.education[0].institution).toBe('University Example');
    });

    it('should use template education when education is empty array', () => {
      const profileWithEmptyEdu = {
        ...mockProfile,
        education: []
      };

      const generator = new ResumeGenerator(profileWithEmptyEdu, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.education.length).toBeGreaterThan(0);
      expect(draft.education[0].institution).toBe('University Example');
    });

    it('should use template education when education is empty string', () => {
      const profileWithEmptyString = {
        ...mockProfile,
        education: ''
      };

      const generator = new ResumeGenerator(profileWithEmptyString, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.education.length).toBeGreaterThan(0);
      expect(draft.education[0].institution).toBe('University Example');
    });

    it('should handle invalid JSON gracefully', () => {
      const profileWithInvalidJson = {
        ...mockProfile,
        education: '{invalid json}'
      };

      const generator = new ResumeGenerator(profileWithInvalidJson, mockTemplate);
      const draft = generator.generateDraft();

      // Should fall back to template education
      expect(draft.education.length).toBeGreaterThan(0);
      expect(draft.education[0].institution).toBe('University Example');
    });

    it('should handle missing optional fields gracefully', () => {
      const profileWithMinimalEdu = {
        ...mockProfile,
        education: [
          {
            institution: 'Minimal University',
            degree: 'BS'
            // No field, location, dates, gpa, honors, or description
          }
        ]
      };

      const generator = new ResumeGenerator(profileWithMinimalEdu, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.education.length).toBe(1);
      expect(draft.education[0].institution).toBe('Minimal University');
      expect(draft.education[0].degree).toBe('BS');
      expect(draft.education[0].field).toBe('');
      expect(draft.education[0].location).toBe('');
      expect(draft.education[0].startDate).toBe('');
      expect(draft.education[0].endDate).toBe('');
      expect(draft.education[0].current).toBe(false);
      expect(draft.education[0].gpa).toBe('');
      expect(draft.education[0].honors).toEqual([]);
      expect(draft.education[0].description).toBe('');
    });

    it('should filter out empty honors', () => {
      const profileWithEmptyHonors = {
        ...mockProfile,
        education: [
          {
            institution: 'Test University',
            degree: 'BS',
            honors: ['Valid honor', '', '  ', 'Another valid honor']
          }
        ]
      };

      const generator = new ResumeGenerator(profileWithEmptyHonors, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.education[0].honors).toEqual(['Valid honor', 'Another valid honor']);
    });

    it('should not create education from very short education_level', () => {
      const profileWithShortLevel = {
        ...mockProfile,
        education: undefined,
        education_level: 'HS' // Too short
      };

      const generator = new ResumeGenerator(profileWithShortLevel, mockTemplate);
      const draft = generator.generateDraft();

      // Should fall back to template
      expect(draft.education[0].institution).toBe('University Example');
    });
  });

  describe('hasProfileExperience', () => {
    it('should return true when work_experience is an array with entries', () => {
      const profileWithArrayExp = {
        ...mockProfile,
        work_experience: [
          { company: 'Test Co', position: 'Developer' }
        ]
      };
      const generator = new ResumeGenerator(profileWithArrayExp, mockTemplate);
      const draft = generator.generateDraft();

      // Should use profile experience
      expect(draft.experience.length).toBe(1);
      expect(draft.experience[0].company).toBe('Test Co');
    });

    it('should return true when work_experience is valid JSON string', () => {
      const profileWithJsonExp = {
        ...mockProfile,
        work_experience: JSON.stringify([
          { company: 'JSON Co', position: 'Engineer' }
        ])
      };
      const generator = new ResumeGenerator(profileWithJsonExp, mockTemplate);
      const draft = generator.generateDraft();

      expect(draft.experience.length).toBe(1);
      expect(draft.experience[0].company).toBe('JSON Co');
    });

    it('should return false when work_experience is undefined', () => {
      const profileWithoutExp = {
        ...mockProfile,
        work_experience: undefined
      };
      const generator = new ResumeGenerator(profileWithoutExp, mockTemplate);
      const draft = generator.generateDraft();

      // Should use template experience
      expect(draft.experience[0].company).toBe('Example Corp');
    });

    it('should return false when work_experience is empty array', () => {
      const profileWithEmptyArray = {
        ...mockProfile,
        work_experience: []
      };
      const generator = new ResumeGenerator(profileWithEmptyArray, mockTemplate);
      const draft = generator.generateDraft();

      // Should use template experience
      expect(draft.experience[0].company).toBe('Example Corp');
    });

    it('should return false when work_experience is empty string', () => {
      const profileWithEmptyString = {
        ...mockProfile,
        work_experience: ''
      };
      const generator = new ResumeGenerator(profileWithEmptyString, mockTemplate);
      const draft = generator.generateDraft();

      // Should use template experience
      expect(draft.experience[0].company).toBe('Example Corp');
    });

    it('should return false when work_experience is whitespace only', () => {
      const profileWithWhitespace = {
        ...mockProfile,
        work_experience: '   \n  \t  '
      };
      const generator = new ResumeGenerator(profileWithWhitespace, mockTemplate);
      const draft = generator.generateDraft();

      // Should use template experience
      expect(draft.experience[0].company).toBe('Example Corp');
    });

    it('should return false when work_experience is invalid JSON', () => {
      const profileWithInvalidJson = {
        ...mockProfile,
        work_experience: '{not valid json'
      };
      const generator = new ResumeGenerator(profileWithInvalidJson, mockTemplate);
      const draft = generator.generateDraft();

      // Should use template experience
      expect(draft.experience[0].company).toBe('Example Corp');
    });

    it('should return false when work_experience JSON is empty array', () => {
      const profileWithEmptyJsonArray = {
        ...mockProfile,
        work_experience: '[]'
      };
      const generator = new ResumeGenerator(profileWithEmptyJsonArray, mockTemplate);
      const draft = generator.generateDraft();

      // Should use template experience
      expect(draft.experience[0].company).toBe('Example Corp');
    });
  });

  describe('validate', () => {
    it('should validate complete personal info as valid', () => {
      const generator = new ResumeGenerator(mockProfile, mockTemplate);
      const validation = generator.validate();

      expect(validation.isValid).toBe(true);
      expect(validation.missingFields).toEqual([]);
      expect(validation.warnings.length).toBe(0);
    });

    it('should detect missing required fields', () => {
      const incompleteProfile = {
        ...mockProfile,
        first_name: '',
        last_name: '',
        user: ''
      };

      const templateWithoutData = {
        ...mockTemplate,
        starterData: {
          ...mockTemplate.starterData!,
          personalInfo: {
            fullName: '',
            email: '',
            phone: '',
            location: '',
            website: '',
            linkedin: '',
            github: '',
            summary: ''
          }
        }
      };

      const generator = new ResumeGenerator(incompleteProfile, templateWithoutData);
      const validation = generator.validate();

      expect(validation.isValid).toBe(false);
      expect(validation.missingFields).toContain('fullName');
      expect(validation.missingFields).toContain('email');
    });

    it('should provide warnings for missing recommended fields', () => {
      const profileWithoutOptional = {
        ...mockProfile,
        phone: undefined,
        location: undefined
      };

      const templateWithPlaceholders = {
        ...mockTemplate,
        starterData: {
          ...mockTemplate.starterData!,
          personalInfo: {
            fullName: 'Real Name', // Not a placeholder
            email: 'real@example.com', // Not a placeholder
            phone: '(555) 123-4567', // Placeholder
            location: 'Your City, State', // Placeholder
            website: '',
            linkedin: '',
            github: '',
            summary: ''
          }
        }
      };

      const generator = new ResumeGenerator(profileWithoutOptional, templateWithPlaceholders);
      const validation = generator.validate();

      expect(validation.isValid).toBe(true); // Has required fields (name and email)
      expect(validation.warnings).toContain('phone');
      expect(validation.warnings).toContain('location');
    });

    it('should validate when only required fields are present', () => {
      const minimalProfile = {
        ...mockProfile,
        phone: undefined,
        location: undefined,
        portfolio_url: undefined,
        linkedin_url: undefined
      };

      const generator = new ResumeGenerator(minimalProfile, mockTemplate);
      const validation = generator.validate();

      // Should be valid even without optional fields
      expect(validation.isValid).toBe(true);
      expect(validation.missingFields).toEqual([]);
      // But should have warnings
      expect(validation.warnings.length).toBeGreaterThan(0);
    });

    it('should handle validation with no profile data', () => {
      const emptyProfile = {
        ...mockProfile,
        first_name: '',
        last_name: '',
        user: '',
        phone: undefined,
        location: undefined
      };

      const emptyTemplate = {
        ...mockTemplate,
        starterData: undefined
      };

      const generator = new ResumeGenerator(emptyProfile, emptyTemplate);
      const validation = generator.validate();

      expect(validation.isValid).toBe(false);
      expect(validation.missingFields.length).toBeGreaterThan(0);
    });
  });
});
