import { describe, it, expect } from 'vitest';
import { ResumeGenerator } from '$lib/services/ResumeGenerator';
import {
  experiencedProfile,
  midLevelProfile,
  studentProfile,
  entryLevelProfile,
  minimalProfile,
  emptyProfile,
  malformedProfile
} from './fixtures/profiles';
import {
  professionalTemplate,
  studentTemplate,
  minimalTemplate,
  emptyTemplate,
  creativeTemplate
} from './fixtures/templates';

describe('ResumeGenerator Integration Tests', () => {
  describe('Experienced Professional Scenarios', () => {
    it('should generate complete resume for experienced professional', () => {
      const generator = new ResumeGenerator(experiencedProfile, professionalTemplate);
      const draft = generator.generateDraft();

      // Personal Info
      expect(draft.personalInfo.fullName).toBe('Sarah Johnson');
      expect(draft.personalInfo.email).toBe('experienced@example.com');
      expect(draft.personalInfo.phone).toBe('+1-555-0123');
      expect(draft.personalInfo.location).toBe('San Francisco, CA');
      expect(draft.personalInfo.linkedin).toBe('https://linkedin.com/in/sarahjohnson');
      expect(draft.personalInfo.website).toBe('https://sarahjohnson.dev');

      // Summary
      expect(draft.summary).toContain('Senior software engineer');
      expect(draft.summary).toContain('8+ years');

      // Experience
      expect(draft.experience.length).toBe(2);
      expect(draft.experience[0].company).toBe('Tech Corp');
      expect(draft.experience[0].position).toBe('Senior Software Engineer');
      expect(draft.experience[0].highlights.length).toBe(3);

      // Education
      expect(draft.education.length).toBe(2);
      expect(draft.education[0].institution).toBe('Stanford University');
      expect(draft.education[0].degree).toBe('Master of Science');

      // Skills
      expect(draft.skills.length).toBeGreaterThan(0);
      const skillNames = draft.skills.map(s => s.name);
      expect(skillNames).toContain('JavaScript');
      expect(skillNames).toContain('TypeScript');
      expect(skillNames).toContain('React');

      // Projects
      expect(draft.projects.length).toBeGreaterThan(0);
      expect(draft.projects[0].name).toBe('Open Source Contribution');

      // Settings
      expect(draft.settings.template).toBe('professional');
      expect(draft.settings.layout).toBe('1-page');
    });

    it('should assign advanced skill level for senior professionals', () => {
      const generator = new ResumeGenerator(experiencedProfile, professionalTemplate);
      const draft = generator.generateDraft();

      const profileSkills = draft.skills.filter(s => 
        ['JavaScript', 'TypeScript', 'React'].includes(s.name)
      );

      profileSkills.forEach(skill => {
        expect(skill.level).toBe('advanced');
      });
    });

    it('should validate experienced profile successfully', () => {
      const generator = new ResumeGenerator(experiencedProfile, professionalTemplate);
      const validation = generator.validate();

      expect(validation.isValid).toBe(true);
      expect(validation.missingFields).toEqual([]);
    });

    it('should use custom target industry', () => {
      const generator = new ResumeGenerator(
        experiencedProfile,
        professionalTemplate,
        'data-science'
      );
      const draft = generator.generateDraft();

      expect(draft).toBeDefined();
      expect(draft.personalInfo.fullName).toBe('Sarah Johnson');
    });
  });

  describe('Mid-Level Professional Scenarios', () => {
    it('should generate resume for mid-level professional', () => {
      const generator = new ResumeGenerator(midLevelProfile, professionalTemplate);
      const draft = generator.generateDraft();

      expect(draft.personalInfo.fullName).toBe('Alex Chen');
      expect(draft.experience.length).toBe(1);
      expect(draft.experience[0].current).toBe(true);
      expect(draft.education.length).toBe(1);
    });

    it('should assign intermediate skill level for mid-level', () => {
      const generator = new ResumeGenerator(midLevelProfile, professionalTemplate);
      const draft = generator.generateDraft();

      const profileSkills = draft.skills.filter(s => 
        ['React', 'Node.js', 'MongoDB'].includes(s.name)
      );

      profileSkills.forEach(skill => {
        expect(skill.level).toBe('intermediate');
      });
    });
  });

  describe('Student / First-Time Job Seeker Scenarios', () => {
    it('should generate resume for student with academic focus', () => {
      const generator = new ResumeGenerator(studentProfile, studentTemplate);
      const draft = generator.generateDraft();

      // Personal Info
      expect(draft.personalInfo.fullName).toBe('Jamie Martinez');
      expect(draft.personalInfo.location).toBe('Boston, MA');

      // Should use template experience (empty for students)
      expect(draft.experience).toEqual([]);

      // Should have education from education_level
      expect(draft.education.length).toBeGreaterThan(0);

      // Should parse academic and personal projects
      expect(draft.projects.length).toBeGreaterThan(0);
      const projectNames = draft.projects.map(p => p.name);
      expect(projectNames.some(name => name.includes('Academic'))).toBe(true);
      expect(projectNames.some(name => name.includes('Personal'))).toBe(true);

      // Should parse technical proficiencies
      const skillNames = draft.skills.map(s => s.name);
      expect(skillNames).toContain('Python');
      expect(skillNames).toContain('Java');
      expect(skillNames).toContain('JavaScript');
    });

    it('should assign beginner skill level for students', () => {
      const generator = new ResumeGenerator(studentProfile, studentTemplate);
      const draft = generator.generateDraft();

      const profileSkills = draft.skills.filter(s => 
        ['Python', 'Java', 'JavaScript'].includes(s.name)
      );

      profileSkills.forEach(skill => {
        expect(skill.level).toBe('beginner');
      });
    });

    it('should parse multiple academic projects', () => {
      const generator = new ResumeGenerator(studentProfile, studentTemplate);
      const draft = generator.generateDraft();

      const academicProjects = draft.projects.filter(p => 
        p.name.includes('Academic')
      );

      expect(academicProjects.length).toBeGreaterThan(1);
    });

    it('should include volunteer and extracurricular as projects', () => {
      const generator = new ResumeGenerator(studentProfile, studentTemplate);
      const draft = generator.generateDraft();

      const projectNames = draft.projects.map(p => p.name);
      expect(projectNames.some(name => name.includes('Volunteer'))).toBe(true);
      expect(projectNames.some(name => name.includes('Extracurricular'))).toBe(true);
    });
  });

  describe('Entry-Level Professional Scenarios', () => {
    it('should generate resume for entry-level professional', () => {
      const generator = new ResumeGenerator(entryLevelProfile, professionalTemplate);
      const draft = generator.generateDraft();

      expect(draft.personalInfo.fullName).toBe('Taylor Kim');
      expect(draft.summary).toContain('Recent computer science graduate');
      
      // Should have internship experience
      expect(draft.experience.length).toBe(1);
      expect(draft.experience[0].position).toContain('Intern');

      // Should have projects
      expect(draft.projects.length).toBeGreaterThan(0);
    });

    it('should use template experience for entry-level', () => {
      const generator = new ResumeGenerator(entryLevelProfile, studentTemplate);
      const draft = generator.generateDraft();

      // Entry-level should get template experience examples
      expect(draft.experience.length).toBeGreaterThan(0);
    });
  });

  describe('Minimal Profile Scenarios', () => {
    it('should generate resume with minimal profile data', () => {
      const generator = new ResumeGenerator(minimalProfile, professionalTemplate);
      const draft = generator.generateDraft();

      // Should use profile name
      expect(draft.personalInfo.fullName).toBe('Jordan Smith');
      expect(draft.personalInfo.email).toBe('minimal@example.com');

      // Should fall back to template for everything else
      expect(draft.summary).toBe(professionalTemplate.starterData?.summary);
      expect(draft.experience.length).toBeGreaterThan(0);
      expect(draft.education.length).toBeGreaterThan(0);
      expect(draft.skills.length).toBeGreaterThan(0);
    });

    it('should validate minimal profile with warnings', () => {
      const generator = new ResumeGenerator(minimalProfile, professionalTemplate);
      const validation = generator.validate();

      expect(validation.isValid).toBe(true);
      expect(validation.warnings.length).toBeGreaterThan(0);
    });

    it('should work with minimal template', () => {
      const generator = new ResumeGenerator(minimalProfile, minimalTemplate);
      const draft = generator.generateDraft();

      expect(draft.personalInfo.fullName).toBe('Jordan Smith');
      expect(draft.experience).toEqual([]);
      expect(draft.education).toEqual([]);
      expect(draft.skills).toEqual([]);
    });
  });

  describe('Empty/Null Data Scenarios', () => {
    it('should handle empty profile gracefully', () => {
      const generator = new ResumeGenerator(emptyProfile, professionalTemplate);
      const draft = generator.generateDraft();

      // Should use template data
      expect(draft.summary).toBe(professionalTemplate.starterData?.summary);
      expect(draft.experience.length).toBeGreaterThan(0);
      expect(draft.skills.length).toBeGreaterThan(0);
    });

    it('should handle empty template gracefully', () => {
      const generator = new ResumeGenerator(experiencedProfile, emptyTemplate);
      const draft = generator.generateDraft();

      // Should use profile data
      expect(draft.personalInfo.fullName).toBe('Sarah Johnson');
      expect(draft.summary).toContain('Senior software engineer');
      expect(draft.experience.length).toBe(2);
    });

    it('should handle both empty profile and template', () => {
      const generator = new ResumeGenerator(emptyProfile, emptyTemplate);
      const draft = generator.generateDraft();

      expect(draft.personalInfo.fullName).toBe('');
      expect(draft.summary).toBe('');
      expect(draft.experience).toEqual([]);
      expect(draft.education).toEqual([]);
      expect(draft.skills).toEqual([]);
      expect(draft.projects).toEqual([]);
    });

    it('should validate empty profile as invalid', () => {
      const generator = new ResumeGenerator(emptyProfile, emptyTemplate);
      const validation = generator.validate();

      expect(validation.isValid).toBe(false);
      expect(validation.missingFields).toContain('fullName');
      expect(validation.missingFields).toContain('email');
    });
  });

  describe('Malformed Data Scenarios', () => {
    it('should handle malformed profile data gracefully', () => {
      const generator = new ResumeGenerator(malformedProfile, professionalTemplate);
      const draft = generator.generateDraft();

      // Should treat whitespace-only as empty
      expect(draft.personalInfo.fullName).toBe('');
      expect(draft.summary).toBe(professionalTemplate.starterData?.summary);

      // Should handle invalid JSON
      expect(draft.experience.length).toBeGreaterThan(0);
      expect(draft.experience[0].company).toBe('Example Corp');

      // Should handle empty array
      expect(draft.education.length).toBeGreaterThan(0);

      // Should handle malformed skills
      expect(draft.skills.length).toBeGreaterThan(0);
    });

    it('should validate malformed profile as invalid', () => {
      const generator = new ResumeGenerator(malformedProfile, professionalTemplate);
      const validation = generator.validate();

      expect(validation.isValid).toBe(false);
      expect(validation.missingFields.length).toBeGreaterThan(0);
    });
  });

  describe('Industry Targeting Scenarios', () => {
    it('should handle software engineering industry', () => {
      const generator = new ResumeGenerator(
        experiencedProfile,
        professionalTemplate,
        'software-engineering'
      );
      const draft = generator.generateDraft();

      expect(draft).toBeDefined();
      expect(draft.personalInfo.fullName).toBe('Sarah Johnson');
    });

    it('should handle data science industry', () => {
      const dataProfile = {
        ...experiencedProfile,
        target_industry: 'data-science',
        professional_summary: 'Data scientist with expertise in machine learning'
      };

      const generator = new ResumeGenerator(dataProfile, professionalTemplate);
      const draft = generator.generateDraft();

      expect(draft.summary).toContain('Data scientist');
    });

    it('should handle design industry with creative template', () => {
      const designProfile = {
        ...experiencedProfile,
        target_industry: 'design',
        key_skills: 'Figma, Adobe XD, UI/UX Design, Prototyping'
      };

      const generator = new ResumeGenerator(designProfile, creativeTemplate);
      const draft = generator.generateDraft();

      const skillNames = draft.skills.map(s => s.name);
      expect(skillNames).toContain('Figma');
      expect(skillNames).toContain('UI/UX Design');
    });

    it('should handle unknown industry gracefully', () => {
      const generator = new ResumeGenerator(
        experiencedProfile,
        professionalTemplate,
        'unknown-industry'
      );
      const draft = generator.generateDraft();

      expect(draft).toBeDefined();
      expect(draft.personalInfo.fullName).toBe('Sarah Johnson');
    });
  });

  describe('Template Variation Scenarios', () => {
    it('should work with professional template', () => {
      const generator = new ResumeGenerator(experiencedProfile, professionalTemplate);
      const draft = generator.generateDraft();

      expect(draft.settings.template).toBe('professional');
      expect(draft.settings.colorScheme).toBe('blue');
    });

    it('should work with student template', () => {
      const generator = new ResumeGenerator(studentProfile, studentTemplate);
      const draft = generator.generateDraft();

      expect(draft.settings.template).toBe('student');
      expect(draft.settings.colorScheme).toBe('green');
    });

    it('should work with creative template', () => {
      const generator = new ResumeGenerator(experiencedProfile, creativeTemplate);
      const draft = generator.generateDraft();

      expect(draft.settings.template).toBe('creative');
      expect(draft.settings.colorScheme).toBe('purple');
      expect(draft.settings.showProfileImage).toBe(true);
    });

    it('should handle template without targeting', () => {
      const generator = new ResumeGenerator(experiencedProfile, minimalTemplate);
      const draft = generator.generateDraft();

      expect(draft).toBeDefined();
      expect(draft.settings.template).toBe('minimal');
    });
  });

  describe('Complete Resume Generation Flow', () => {
    it('should generate complete resume from start to finish', () => {
      const generator = new ResumeGenerator(experiencedProfile, professionalTemplate);
      
      // Validate before generation
      const validation = generator.validate();
      expect(validation.isValid).toBe(true);

      // Generate draft
      const draft = generator.generateDraft();

      // Verify all sections are present
      expect(draft.personalInfo).toBeDefined();
      expect(draft.summary).toBeDefined();
      expect(draft.experience).toBeDefined();
      expect(draft.education).toBeDefined();
      expect(draft.skills).toBeDefined();
      expect(draft.projects).toBeDefined();
      expect(draft.settings).toBeDefined();

      // Verify data quality
      expect(draft.personalInfo.fullName.length).toBeGreaterThan(0);
      expect(draft.personalInfo.email.length).toBeGreaterThan(0);
      expect(draft.experience.length).toBeGreaterThan(0);
      expect(draft.education.length).toBeGreaterThan(0);
      expect(draft.skills.length).toBeGreaterThan(0);

      // Verify IDs are unique
      const experienceIds = draft.experience.map(e => e.id);
      const educationIds = draft.education.map(e => e.id);
      const skillIds = draft.skills.map(s => s.id);
      const projectIds = draft.projects.map(p => p.id);

      expect(new Set(experienceIds).size).toBe(experienceIds.length);
      expect(new Set(educationIds).size).toBe(educationIds.length);
      expect(new Set(skillIds).size).toBe(skillIds.length);
      expect(new Set(projectIds).size).toBe(projectIds.length);
    });

    it('should maintain data consistency across multiple generations', () => {
      const generator = new ResumeGenerator(experiencedProfile, professionalTemplate);
      
      const draft1 = generator.generateDraft();
      const draft2 = generator.generateDraft();

      // Personal info should be consistent
      expect(draft1.personalInfo.fullName).toBe(draft2.personalInfo.fullName);
      expect(draft1.personalInfo.email).toBe(draft2.personalInfo.email);

      // Summary should be consistent
      expect(draft1.summary).toBe(draft2.summary);

      // Number of items should be consistent
      expect(draft1.experience.length).toBe(draft2.experience.length);
      expect(draft1.education.length).toBe(draft2.education.length);
      expect(draft1.skills.length).toBe(draft2.skills.length);
    });
  });
});
