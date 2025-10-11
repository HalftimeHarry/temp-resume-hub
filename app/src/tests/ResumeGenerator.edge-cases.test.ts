import { describe, it, expect } from 'vitest';
import { ResumeGenerator } from '$lib/services/ResumeGenerator';
import type { UserProfile } from '$lib/types';
import { professionalTemplate, emptyTemplate } from './fixtures/templates';
import { experiencedProfile } from './fixtures/profiles';

describe('ResumeGenerator Edge Cases', () => {
  describe('Null and Undefined Handling', () => {
    it('should handle undefined profile fields', () => {
      const profile: UserProfile = {
        id: 'test',
        user: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        role: 'job_seeker',
        plan: 'free',
        verified: true,
        active: true,
        profile_completed: false,
        created: '2024-01-01',
        updated: '2024-01-01',
        // All optional fields undefined
        phone: undefined,
        location: undefined,
        linkedin_url: undefined,
        portfolio_url: undefined,
        target_industry: undefined,
        experience_level: undefined,
        key_skills: undefined,
        professional_summary: undefined,
        work_experience: undefined,
        education: undefined,
        projects: undefined
      };

      const generator = new ResumeGenerator(profile, professionalTemplate);
      const draft = generator.generateDraft();

      expect(draft).toBeDefined();
      expect(draft.personalInfo.fullName).toBe('Test User');
    });

    it('should handle null-like string values', () => {
      const profile: UserProfile = {
        ...experiencedProfile,
        phone: 'null',
        location: 'undefined',
        professional_summary: 'null'
      };

      const generator = new ResumeGenerator(profile, professionalTemplate);
      const draft = generator.generateDraft();

      expect(draft.personalInfo.phone).toBe('null'); // Treated as actual value
      expect(draft.summary).toBe('null'); // Treated as actual value
    });
  });

  describe('Special Characters and Encoding', () => {
    it('should handle special characters in names', () => {
      const profile: UserProfile = {
        ...experiencedProfile,
        first_name: "O'Brien",
        last_name: 'Müller-Schmidt'
      };

      const generator = new ResumeGenerator(profile, professionalTemplate);
      const draft = generator.generateDraft();

      expect(draft.personalInfo.fullName).toBe("O'Brien Müller-Schmidt");
    });

    it('should handle unicode characters', () => {
      const profile: UserProfile = {
        ...experiencedProfile,
        first_name: '李',
        last_name: '明',
        location: '北京, 中国'
      };

      const generator = new ResumeGenerator(profile, professionalTemplate);
      const draft = generator.generateDraft();

      expect(draft.personalInfo.fullName).toBe('李 明');
      expect(draft.personalInfo.location).toBe('北京, 中国');
    });

    it('should handle emojis in text', () => {
      const profile: UserProfile = {
        ...experiencedProfile,
        professional_summary: 'Passionate developer 🚀 with expertise in web technologies 💻'
      };

      const generator = new ResumeGenerator(profile, professionalTemplate);
      const draft = generator.generateDraft();

      expect(draft.summary).toContain('🚀');
      expect(draft.summary).toContain('💻');
    });

    it('should handle HTML/XML characters', () => {
      const profile: UserProfile = {
        ...experiencedProfile,
        professional_summary: 'Expert in <React> & Angular, C++ & C#'
      };

      const generator = new ResumeGenerator(profile, professionalTemplate);
      const draft = generator.generateDraft();

      expect(draft.summary).toContain('<React>');
      expect(draft.summary).toContain('&');
    });
  });

  describe('Very Long Data', () => {
    it('should handle very long summary', () => {
      const longSummary = 'A'.repeat(5000);
      const profile: UserProfile = {
        ...experiencedProfile,
        professional_summary: longSummary
      };

      const generator = new ResumeGenerator(profile, professionalTemplate);
      const draft = generator.generateDraft();

      expect(draft.summary).toBe(longSummary);
      expect(draft.summary.length).toBe(5000);
    });

    it('should handle many skills', () => {
      const manySkills = Array.from({ length: 100 }, (_, i) => `Skill${i}`).join(', ');
      const profile: UserProfile = {
        ...experiencedProfile,
        key_skills: manySkills
      };

      const generator = new ResumeGenerator(profile, professionalTemplate);
      const draft = generator.generateDraft();

      expect(draft.skills.length).toBeGreaterThan(90);
    });

    it('should handle many experience entries', () => {
      const manyExperiences = Array.from({ length: 20 }, (_, i) => ({
        company: `Company ${i}`,
        position: `Position ${i}`,
        start_date: '2020-01',
        end_date: '2021-01',
        current: false,
        description: `Description ${i}`,
        highlights: [`Highlight ${i}`]
      }));

      const profile: UserProfile = {
        ...experiencedProfile,
        work_experience: JSON.stringify(manyExperiences)
      };

      const generator = new ResumeGenerator(profile, professionalTemplate);
      const draft = generator.generateDraft();

      expect(draft.experience.length).toBe(20);
    });
  });

  describe('Malformed JSON', () => {
    it('should handle incomplete JSON', () => {
      const profile: UserProfile = {
        ...experiencedProfile,
        work_experience: '{"company": "Test"'
      };

      const generator = new ResumeGenerator(profile, professionalTemplate);
      const draft = generator.generateDraft();

      // Should fall back to template
      expect(draft.experience.length).toBeGreaterThan(0);
      expect(draft.experience[0].company).toBe('Example Corp');
    });

    it('should handle JSON with wrong structure', () => {
      const profile: UserProfile = {
        ...experiencedProfile,
        work_experience: '{"not": "an array"}'
      };

      const generator = new ResumeGenerator(profile, professionalTemplate);
      const draft = generator.generateDraft();

      // Should fall back to template
      expect(draft.experience[0].company).toBe('Example Corp');
    });

    it('should handle JSON with null values', () => {
      const profile: UserProfile = {
        ...experiencedProfile,
        work_experience: JSON.stringify([
          {
            company: null,
            position: null,
            start_date: null,
            highlights: null
          }
        ])
      };

      const generator = new ResumeGenerator(profile, professionalTemplate);
      const draft = generator.generateDraft();

      expect(draft.experience.length).toBe(1);
      expect(draft.experience[0].company).toBe('');
      expect(draft.experience[0].position).toBe('');
      expect(draft.experience[0].highlights).toEqual([]);
    });
  });

  describe('Duplicate Data', () => {
    it('should deduplicate skills case-insensitively', () => {
      const profile: UserProfile = {
        ...experiencedProfile,
        key_skills: 'JavaScript, JAVASCRIPT, javascript, Javascript'
      };

      const generator = new ResumeGenerator(profile, professionalTemplate);
      const draft = generator.generateDraft();

      const jsSkills = draft.skills.filter(s => 
        s.name.toLowerCase() === 'javascript'
      );

      expect(jsSkills.length).toBe(1);
    });

    it('should deduplicate skills with extra whitespace', () => {
      const profile: UserProfile = {
        ...experiencedProfile,
        key_skills: 'React,  React  , react,   REACT   '
      };

      const generator = new ResumeGenerator(profile, professionalTemplate);
      const draft = generator.generateDraft();

      const reactSkills = draft.skills.filter(s => 
        s.name.toLowerCase() === 'react'
      );

      expect(reactSkills.length).toBe(1);
    });
  });

  describe('Date Format Variations', () => {
    it('should handle various date formats', () => {
      const profile: UserProfile = {
        ...experiencedProfile,
        work_experience: JSON.stringify([
          {
            company: 'Test1',
            position: 'Dev',
            start_date: '2020-01-15',
            end_date: '2021-12-31'
          },
          {
            company: 'Test2',
            position: 'Dev',
            start_date: '01/2020',
            end_date: '12/2021'
          },
          {
            company: 'Test3',
            position: 'Dev',
            start_date: 'January 2020',
            end_date: 'December 2021'
          }
        ])
      };

      const generator = new ResumeGenerator(profile, professionalTemplate);
      const draft = generator.generateDraft();

      expect(draft.experience.length).toBe(3);
      expect(draft.experience[0].startDate).toBe('2020-01-15');
      expect(draft.experience[1].startDate).toBe('01/2020');
      expect(draft.experience[2].startDate).toBe('January 2020');
    });
  });

  describe('Array vs String Handling', () => {
    it('should handle technologies as array', () => {
      const profile: UserProfile = {
        ...experiencedProfile,
        projects: JSON.stringify([
          {
            name: 'Test',
            description: 'Test',
            technologies: ['React', 'Node.js', 'MongoDB']
          }
        ])
      };

      const generator = new ResumeGenerator(profile, professionalTemplate);
      const draft = generator.generateDraft();

      expect(draft.projects[0].technologies).toEqual(['React', 'Node.js', 'MongoDB']);
    });

    it('should handle technologies as comma-separated string', () => {
      const profile: UserProfile = {
        ...experiencedProfile,
        projects: JSON.stringify([
          {
            name: 'Test',
            description: 'Test',
            technologies: 'React, Node.js, MongoDB'
          }
        ])
      };

      const generator = new ResumeGenerator(profile, professionalTemplate);
      const draft = generator.generateDraft();

      expect(draft.projects[0].technologies).toEqual(['React', 'Node.js', 'MongoDB']);
    });

    it('should handle highlights as array', () => {
      const profile: UserProfile = {
        ...experiencedProfile,
        work_experience: JSON.stringify([
          {
            company: 'Test',
            position: 'Dev',
            highlights: ['Achievement 1', 'Achievement 2']
          }
        ])
      };

      const generator = new ResumeGenerator(profile, professionalTemplate);
      const draft = generator.generateDraft();

      expect(draft.experience[0].highlights).toEqual(['Achievement 1', 'Achievement 2']);
    });

    it('should handle highlights as newline-separated string', () => {
      const profile: UserProfile = {
        ...experiencedProfile,
        work_experience: JSON.stringify([
          {
            company: 'Test',
            position: 'Dev',
            highlights: 'Achievement 1\nAchievement 2\nAchievement 3'
          }
        ])
      };

      const generator = new ResumeGenerator(profile, professionalTemplate);
      const draft = generator.generateDraft();

      expect(draft.experience[0].highlights).toEqual([
        'Achievement 1',
        'Achievement 2',
        'Achievement 3'
      ]);
    });
  });

  describe('Mixed Data Quality', () => {
    it('should handle mix of good and bad data', () => {
      const profile: UserProfile = {
        ...experiencedProfile,
        key_skills: 'JavaScript, , , React, , Node.js',
        work_experience: JSON.stringify([
          {
            company: 'Good Company',
            position: 'Developer',
            highlights: ['Good highlight']
          },
          {
            company: '',
            position: '',
            highlights: []
          },
          {
            company: 'Another Good Company',
            position: 'Engineer',
            highlights: ['Another highlight']
          }
        ])
      };

      const generator = new ResumeGenerator(profile, professionalTemplate);
      const draft = generator.generateDraft();

      // Should filter empty skills
      const skillNames = draft.skills.map(s => s.name);
      expect(skillNames).toContain('JavaScript');
      expect(skillNames).toContain('React');
      expect(skillNames).toContain('Node.js');
      expect(skillNames.filter(n => n === '').length).toBe(0);

      // Should include all experience entries (even empty ones)
      expect(draft.experience.length).toBe(3);
    });
  });

  describe('Boundary Values', () => {
    it('should handle zero-length arrays', () => {
      const profile: UserProfile = {
        ...experiencedProfile,
        work_experience: '[]',
        education: '[]',
        projects: '[]'
      };

      const generator = new ResumeGenerator(profile, professionalTemplate);
      const draft = generator.generateDraft();

      // Should fall back to template
      expect(draft.experience.length).toBeGreaterThan(0);
      expect(draft.education.length).toBeGreaterThan(0);
    });

    it('should handle single-item arrays', () => {
      const profile: UserProfile = {
        ...experiencedProfile,
        work_experience: JSON.stringify([
          {
            company: 'Only Company',
            position: 'Only Position',
            highlights: ['Only highlight']
          }
        ])
      };

      const generator = new ResumeGenerator(profile, professionalTemplate);
      const draft = generator.generateDraft();

      expect(draft.experience.length).toBe(1);
      expect(draft.experience[0].company).toBe('Only Company');
    });

    it('should handle GPA edge cases', () => {
      const profile: UserProfile = {
        ...experiencedProfile,
        education: JSON.stringify([
          { institution: 'Test1', degree: 'BS', gpa: '4.0' },
          { institution: 'Test2', degree: 'MS', gpa: '0.0' },
          { institution: 'Test3', degree: 'PhD', gpa: '' },
          { institution: 'Test4', degree: 'BA', gpa: '3.999' }
        ])
      };

      const generator = new ResumeGenerator(profile, professionalTemplate);
      const draft = generator.generateDraft();

      expect(draft.education[0].gpa).toBe('4.0');
      expect(draft.education[1].gpa).toBe('0.0');
      expect(draft.education[2].gpa).toBe('');
      expect(draft.education[3].gpa).toBe('3.999');
    });
  });

  describe('Concurrent Generation', () => {
    it('should handle multiple generators with same profile', () => {
      const gen1 = new ResumeGenerator(experiencedProfile, professionalTemplate);
      const gen2 = new ResumeGenerator(experiencedProfile, professionalTemplate);

      const draft1 = gen1.generateDraft();
      const draft2 = gen2.generateDraft();

      expect(draft1.personalInfo.fullName).toBe(draft2.personalInfo.fullName);
      expect(draft1.experience.length).toBe(draft2.experience.length);
    });

    it('should generate unique IDs across instances', () => {
      const gen1 = new ResumeGenerator(experiencedProfile, professionalTemplate);
      const gen2 = new ResumeGenerator(experiencedProfile, professionalTemplate);

      const draft1 = gen1.generateDraft();
      const draft2 = gen2.generateDraft();

      const ids1 = draft1.skills.map(s => s.id);
      const ids2 = draft2.skills.map(s => s.id);

      // IDs should be different between instances
      const overlap = ids1.filter(id => ids2.includes(id));
      expect(overlap.length).toBe(0);
    });
  });
});
