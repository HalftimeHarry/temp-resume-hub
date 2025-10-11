import { describe, it, expect } from 'vitest';
import {
  ResumeStrategyFactory,
  ExperiencedProfessionalStrategy,
  CareerChangerStrategy,
  ExperiencedJobSeekerStrategy,
  FirstTimeJobSeekerStrategy,
  StudentStrategy,
  type ResumeStrategy
} from '$lib/services/ResumeStrategies';
import {
  experiencedProfile,
  studentProfile,
  midLevelProfile,
  entryLevelProfile
} from './fixtures/profiles';
import { professionalTemplate, studentTemplate } from './fixtures/templates';

describe('ResumeStrategies', () => {
  describe('ResumeStrategyFactory', () => {
    describe('getStrategy', () => {
      it('should select ExperiencedProfessionalStrategy for senior professionals', () => {
        const strategy = ResumeStrategyFactory.getStrategy(experiencedProfile);
        expect(strategy.getStrategyName()).toBe('ExperiencedProfessional');
      });

      it('should select ExperiencedJobSeekerStrategy for mid-level professionals', () => {
        const strategy = ResumeStrategyFactory.getStrategy(midLevelProfile);
        expect(strategy.getStrategyName()).toBe('ExperiencedJobSeeker');
      });

      it('should select StudentStrategy for students', () => {
        const strategy = ResumeStrategyFactory.getStrategy(studentProfile);
        expect(strategy.getStrategyName()).toBe('Student');
      });

      it('should select ExperiencedJobSeekerStrategy for entry-level with work experience', () => {
        const strategy = ResumeStrategyFactory.getStrategy(entryLevelProfile);
        expect(strategy.getStrategyName()).toBe('ExperiencedJobSeeker');
      });

      it('should return default strategy for unknown profile without work experience', () => {
        const unknownProfile = {
          ...experiencedProfile,
          experience_level: undefined,
          work_experience: undefined,
          career_stage: undefined
        };
        const strategy = ResumeStrategyFactory.getStrategy(unknownProfile);
        expect(strategy).toBeDefined();
        expect(strategy.getStrategyName()).toBe('ExperiencedProfessional');
      });
    });

    describe('getStrategyByName', () => {
      it('should return ExperiencedProfessionalStrategy by name', () => {
        const strategy = ResumeStrategyFactory.getStrategyByName('ExperiencedProfessional');
        expect(strategy.getStrategyName()).toBe('ExperiencedProfessional');
      });

      it('should return ExperiencedJobSeekerStrategy by name', () => {
        const strategy = ResumeStrategyFactory.getStrategyByName('ExperiencedJobSeeker');
        expect(strategy.getStrategyName()).toBe('ExperiencedJobSeeker');
      });

      it('should return CareerChangerStrategy by name', () => {
        const strategy = ResumeStrategyFactory.getStrategyByName('CareerChanger');
        expect(strategy.getStrategyName()).toBe('CareerChanger');
      });

      it('should return FirstTimeJobSeekerStrategy by name', () => {
        const strategy = ResumeStrategyFactory.getStrategyByName('FirstTimeJobSeeker');
        expect(strategy.getStrategyName()).toBe('FirstTimeJobSeeker');
      });

      it('should return StudentStrategy by name', () => {
        const strategy = ResumeStrategyFactory.getStrategyByName('Student');
        expect(strategy.getStrategyName()).toBe('Student');
      });

      it('should return default strategy for unknown name', () => {
        const strategy = ResumeStrategyFactory.getStrategyByName('NonExistent');
        expect(strategy).toBeDefined();
        expect(strategy.getStrategyName()).toBe('ExperiencedProfessional');
      });
    });

    describe('getAllStrategies', () => {
      it('should return all registered strategies', () => {
        const strategies = ResumeStrategyFactory.getAllStrategies();
        expect(strategies.length).toBeGreaterThanOrEqual(5);
        
        const names = strategies.map(s => s.getStrategyName());
        expect(names).toContain('ExperiencedProfessional');
        expect(names).toContain('CareerChanger');
        expect(names).toContain('ExperiencedJobSeeker');
        expect(names).toContain('FirstTimeJobSeeker');
        expect(names).toContain('Student');
      });
    });

    describe('registerStrategy', () => {
      it('should allow registering custom strategies', () => {
        class CustomStrategy extends ExperiencedProfessionalStrategy {
          getStrategyName(): string {
            return 'Custom';
          }
          isApplicable(): boolean {
            return false; // Won't interfere with other tests
          }
        }

        const customStrategy = new CustomStrategy();
        ResumeStrategyFactory.registerStrategy(customStrategy);

        const strategies = ResumeStrategyFactory.getAllStrategies();
        const names = strategies.map(s => s.getStrategyName());
        expect(names).toContain('Custom');
      });
    });
  });

  describe('ExperiencedProfessionalStrategy', () => {
    const strategy = new ExperiencedProfessionalStrategy();

    describe('isApplicable', () => {
      it('should be applicable for senior professionals', () => {
        expect(strategy.isApplicable(experiencedProfile)).toBe(true);
      });

      it('should not be applicable for mid-level professionals', () => {
        expect(strategy.isApplicable(midLevelProfile)).toBe(false);
      });

      it('should not be applicable for students', () => {
        expect(strategy.isApplicable(studentProfile)).toBe(false);
      });

      it('should be applicable for lead positions', () => {
        const leadProfile = {
          ...experiencedProfile,
          experience_level: 'lead'
        };
        expect(strategy.isApplicable(leadProfile)).toBe(true);
      });

      it('should be applicable for principal positions', () => {
        const principalProfile = {
          ...experiencedProfile,
          experience_level: 'principal'
        };
        expect(strategy.isApplicable(principalProfile)).toBe(true);
      });
    });

    describe('generateResume', () => {
      it('should generate complete resume for experienced professional', () => {
        const resume = strategy.generateResume(experiencedProfile, professionalTemplate);

        expect(resume).toBeDefined();
        expect(resume.personalInfo).toBeDefined();
        expect(resume.summary).toBeDefined();
        expect(resume.experience).toBeDefined();
        expect(resume.education).toBeDefined();
        expect(resume.skills).toBeDefined();
        expect(resume.projects).toBeDefined();
        expect(resume.settings).toBeDefined();
      });

      it('should parse structured work experience', () => {
        const resume = strategy.generateResume(experiencedProfile, professionalTemplate);

        expect(resume.experience.length).toBe(2);
        expect(resume.experience[0].company).toBe('Tech Corp');
        expect(resume.experience[0].position).toBe('Senior Software Engineer');
        expect(resume.experience[0].highlights.length).toBe(3);
      });

      it('should parse structured education', () => {
        const resume = strategy.generateResume(experiencedProfile, professionalTemplate);

        expect(resume.education.length).toBe(2);
        expect(resume.education[0].institution).toBe('Stanford University');
        expect(resume.education[0].degree).toBe('Master of Science');
      });

      it('should parse and merge skills', () => {
        const resume = strategy.generateResume(experiencedProfile, professionalTemplate);

        expect(resume.skills.length).toBeGreaterThan(0);
        const skillNames = resume.skills.map(s => s.name);
        expect(skillNames).toContain('JavaScript');
        expect(skillNames).toContain('TypeScript');
      });

      it('should parse structured projects', () => {
        const resume = strategy.generateResume(experiencedProfile, professionalTemplate);

        expect(resume.projects.length).toBeGreaterThan(0);
        expect(resume.projects[0].name).toBe('Open Source Contribution');
      });

      it('should use profile summary', () => {
        const resume = strategy.generateResume(experiencedProfile, professionalTemplate);

        expect(resume.summary).toContain('Senior software engineer');
        expect(resume.summary).toContain('8+ years');
      });

      it('should handle target industry parameter', () => {
        const resume = strategy.generateResume(
          experiencedProfile,
          professionalTemplate,
          'data-science'
        );

        expect(resume).toBeDefined();
        expect(resume.personalInfo.fullName).toBe('Sarah Johnson');
      });
    });

    describe('edge cases', () => {
      it('should handle missing work experience gracefully', () => {
        const profileWithoutExp = {
          ...experiencedProfile,
          work_experience: undefined
        };

        const resume = strategy.generateResume(profileWithoutExp, professionalTemplate);

        expect(resume.experience.length).toBeGreaterThan(0);
        expect(resume.experience[0].company).toBe('Example Corp');
      });

      it('should handle invalid JSON in work experience', () => {
        const profileWithInvalidJson = {
          ...experiencedProfile,
          work_experience: '{invalid json}'
        };

        const resume = strategy.generateResume(profileWithInvalidJson, professionalTemplate);

        // Should fall back to template
        expect(resume.experience[0].company).toBe('Example Corp');
      });

      it('should handle empty arrays', () => {
        const profileWithEmptyArrays = {
          ...experiencedProfile,
          work_experience: '[]',
          education: '[]',
          projects: '[]'
        };

        const resume = strategy.generateResume(profileWithEmptyArrays, professionalTemplate);

        // Should fall back to template
        expect(resume.experience.length).toBeGreaterThan(0);
        expect(resume.education.length).toBeGreaterThan(0);
      });
    });
  });

  describe('CareerChangerStrategy', () => {
    const strategy = new CareerChangerStrategy();

    // Create a career changer profile
    const careerChangerProfile = {
      id: 'career-change-123',
      user: 'changer@example.com',
      first_name: 'Jordan',
      last_name: 'Smith',
      phone: '+1-555-0200',
      location: 'Seattle, WA',
      
      target_industry: 'software-engineering',
      experience_level: 'mid-level',
      career_stage: 'career_change',
      key_skills: 'Project Management, Communication, Problem Solving, Leadership',
      
      role: 'job_seeker',
      plan: 'pro',
      verified: true,
      active: true,
      profile_completed: true,
      
      professional_summary: 'Transitioning from education to software engineering with strong analytical and problem-solving skills.',
      
      work_experience: JSON.stringify([
        {
          company: 'Lincoln High School',
          position: 'Math Teacher',
          location: 'Seattle, WA',
          start_date: '2018-09',
          end_date: '2024-01',
          current: false,
          description: 'Taught mathematics to high school students',
          highlights: [
            'Developed curriculum for 150+ students',
            'Improved student test scores by 25%',
            'Led team of 5 teachers in department initiatives',
            'Created data tracking system for student progress'
          ]
        }
      ]),
      
      education: JSON.stringify([
        {
          institution: 'University of Washington',
          degree: 'Bachelor of Science',
          field: 'Mathematics',
          location: 'Seattle, WA',
          start_date: '2014-09',
          end_date: '2018-06',
          current: false,
          gpa: '3.8'
        }
      ]),
      
      created: '2024-01-01T00:00:00Z',
      updated: '2024-01-01T00:00:00Z'
    };

    describe('isApplicable', () => {
      it('should be applicable for career_change career stage', () => {
        expect(strategy.isApplicable(careerChangerProfile)).toBe(true);
      });

      it('should be applicable for career-change career stage', () => {
        const profile = {
          ...careerChangerProfile,
          career_stage: 'career-change'
        };
        expect(strategy.isApplicable(profile)).toBe(true);
      });

      it('should be applicable for transition career stage with work experience', () => {
        const profile = {
          ...careerChangerProfile,
          career_stage: 'transition'
        };
        expect(strategy.isApplicable(profile)).toBe(true);
      });

      it('should not be applicable without work experience', () => {
        const profileWithoutExperience = {
          ...careerChangerProfile,
          work_experience: undefined
        };
        expect(strategy.isApplicable(profileWithoutExperience)).toBe(false);
      });

      it('should not be applicable for students', () => {
        expect(strategy.isApplicable(studentProfile)).toBe(false);
      });

      it('should not be applicable for regular professionals', () => {
        expect(strategy.isApplicable(experiencedProfile)).toBe(false);
      });
    });

    describe('generateResume', () => {
      it('should generate complete resume for career changer', () => {
        const resume = strategy.generateResume(careerChangerProfile, professionalTemplate);

        expect(resume).toBeDefined();
        expect(resume.personalInfo).toBeDefined();
        expect(resume.summary).toBeDefined();
        expect(resume.experience).toBeDefined();
        expect(resume.education).toBeDefined();
        expect(resume.skills).toBeDefined();
        expect(resume.projects).toBeDefined();
      });

      it('should generate career change summary', () => {
        const resume = strategy.generateResume(careerChangerProfile, professionalTemplate);

        // Should use profile summary if provided
        expect(resume.summary).toBe(careerChangerProfile.professional_summary);
      });

      it('should generate default career change summary when no profile summary', () => {
        const profileWithoutSummary = {
          ...careerChangerProfile,
          professional_summary: undefined
        };

        const resume = strategy.generateResume(profileWithoutSummary, professionalTemplate);

        // Should generate career change focused summary
        expect(resume.summary).toContain('transitioning');
        expect(resume.summary).toContain('Software Engineering');
        expect(resume.summary).toContain('transferable');
      });

      it('should parse and adapt work experience', () => {
        const resume = strategy.generateResume(careerChangerProfile, professionalTemplate);

        expect(resume.experience.length).toBe(1);
        expect(resume.experience[0].company).toBe('Lincoln High School');
        expect(resume.experience[0].position).toBe('Math Teacher');
      });

      it('should reframe highlights to emphasize transferable skills', () => {
        const resume = strategy.generateResume(careerChangerProfile, professionalTemplate);

        const highlights = resume.experience[0].highlights;
        expect(highlights.length).toBeGreaterThan(0);
        
        // Transferable skills should be prioritized
        const firstHighlight = highlights[0].toLowerCase();
        const hasTransferableKeyword = [
          'led', 'developed', 'improved', 'created', 'managed'
        ].some(keyword => firstHighlight.includes(keyword));
        
        expect(hasTransferableKeyword).toBe(true);
      });

      it('should highlight transferable skills', () => {
        const resume = strategy.generateResume(careerChangerProfile, professionalTemplate);

        expect(resume.skills.length).toBeGreaterThan(0);
        
        // Should include profile transferable skills
        const skillNames = resume.skills.map(s => s.name.toLowerCase());
        expect(skillNames.some(name => name.includes('project management'))).toBe(true);
        expect(skillNames.some(name => name.includes('communication'))).toBe(true);
        expect(skillNames.some(name => name.includes('leadership'))).toBe(true);
      });

      it('should merge template and profile skills', () => {
        const resume = strategy.generateResume(careerChangerProfile, professionalTemplate);

        // Should have both template skills (target industry) and profile skills (transferable)
        const skillNames = resume.skills.map(s => s.name.toLowerCase());
        
        // Template skills
        expect(skillNames.some(name => name.includes('javascript'))).toBe(true);
        
        // Profile transferable skills
        expect(skillNames.some(name => name.includes('problem solving'))).toBe(true);
      });

      it('should categorize transferable skills', () => {
        const resume = strategy.generateResume(careerChangerProfile, professionalTemplate);

        const transferableSkills = resume.skills.filter(s => 
          s.category === 'Transferable Skills'
        );
        
        expect(transferableSkills.length).toBeGreaterThan(0);
      });

      it('should use profile education', () => {
        const resume = strategy.generateResume(careerChangerProfile, professionalTemplate);

        expect(resume.education.length).toBe(1);
        expect(resume.education[0].institution).toBe('University of Washington');
        expect(resume.education[0].field).toBe('Mathematics');
      });

      it('should use target industry from profile', () => {
        const resume = strategy.generateResume(careerChangerProfile, professionalTemplate);

        // Summary should reference target industry
        expect(resume.summary.toLowerCase()).toContain('software');
      });

      it('should use target industry from parameter', () => {
        const profileWithoutTargetIndustry = {
          ...careerChangerProfile,
          target_industry: undefined,
          professional_summary: undefined
        };

        const resume = strategy.generateResume(
          profileWithoutTargetIndustry, 
          professionalTemplate,
          'data-science'
        );

        // Summary should reference target industry from parameter
        expect(resume.summary.toLowerCase()).toContain('data science');
      });
    });

    describe('edge cases', () => {
      it('should handle empty work experience array', () => {
        const profileWithEmptyExperience = {
          ...careerChangerProfile,
          work_experience: []
        };

        const resume = strategy.generateResume(profileWithEmptyExperience, professionalTemplate);

        // Should fall back to template
        expect(resume.experience.length).toBeGreaterThan(0);
      });

      it('should handle invalid JSON in work experience', () => {
        const profileWithInvalidJSON = {
          ...careerChangerProfile,
          work_experience: '{invalid json}'
        };

        const resume = strategy.generateResume(profileWithInvalidJSON, professionalTemplate);

        // Should fall back to template
        expect(resume.experience).toBeDefined();
      });

      it('should handle missing education', () => {
        const profileWithoutEducation = {
          ...careerChangerProfile,
          education: undefined
        };

        const resume = strategy.generateResume(profileWithoutEducation, professionalTemplate);

        // Should fall back to template
        expect(resume.education).toEqual(professionalTemplate.starterData?.education || []);
      });

      it('should handle missing skills', () => {
        const profileWithoutSkills = {
          ...careerChangerProfile,
          key_skills: undefined
        };

        const resume = strategy.generateResume(profileWithoutSkills, professionalTemplate);

        // Should use template skills
        const templateSkillNames = professionalTemplate.starterData?.skills?.map(s => s.name) || [];
        const resumeSkillNames = resume.skills.map(s => s.name);
        expect(resumeSkillNames).toEqual(templateSkillNames);
      });

      it('should handle missing target industry', () => {
        const profileWithoutTargetIndustry = {
          ...careerChangerProfile,
          target_industry: undefined,
          professional_summary: undefined
        };

        const resume = strategy.generateResume(profileWithoutTargetIndustry, professionalTemplate);

        // Should fall back to template summary
        expect(resume.summary).toBe(professionalTemplate.starterData?.summary);
      });

      it('should handle experience without highlights', () => {
        const profileWithoutHighlights = {
          ...careerChangerProfile,
          work_experience: JSON.stringify([
            {
              company: 'Test Company',
              position: 'Test Position',
              description: 'Test description'
            }
          ])
        };

        const resume = strategy.generateResume(profileWithoutHighlights, professionalTemplate);

        expect(resume.experience.length).toBe(1);
        expect(resume.experience[0].highlights).toEqual([]);
      });
    });
  });

  describe('ExperiencedJobSeekerStrategy', () => {
    const strategy = new ExperiencedJobSeekerStrategy();

    describe('isApplicable', () => {
      it('should be applicable for mid-level professionals with work experience', () => {
        expect(strategy.isApplicable(midLevelProfile)).toBe(true);
      });

      it('should be applicable for entry-level with work experience', () => {
        expect(strategy.isApplicable(entryLevelProfile)).toBe(true);
      });

      it('should not be applicable for students', () => {
        expect(strategy.isApplicable(studentProfile)).toBe(false);
      });

      it('should not be applicable for profiles without work experience', () => {
        const profileWithoutExperience = {
          ...midLevelProfile,
          work_experience: undefined
        };
        expect(strategy.isApplicable(profileWithoutExperience)).toBe(false);
      });

      it('should not be applicable for student career stage', () => {
        const studentCareerProfile = {
          ...midLevelProfile,
          career_stage: 'student'
        };
        expect(strategy.isApplicable(studentCareerProfile)).toBe(false);
      });

      it('should be applicable for junior professionals', () => {
        const juniorProfile = {
          ...midLevelProfile,
          experience_level: 'junior'
        };
        expect(strategy.isApplicable(juniorProfile)).toBe(true);
      });
    });

    describe('generateResume', () => {
      it('should generate complete resume for experienced job seeker', () => {
        const resume = strategy.generateResume(midLevelProfile, professionalTemplate);

        expect(resume).toBeDefined();
        expect(resume.personalInfo).toBeDefined();
        expect(resume.summary).toBeDefined();
        expect(resume.experience).toBeDefined();
        expect(resume.education).toBeDefined();
        expect(resume.skills).toBeDefined();
        expect(resume.projects).toBeDefined();
      });

      it('should prioritize profile work experience over template', () => {
        const resume = strategy.generateResume(midLevelProfile, professionalTemplate);

        expect(resume.experience.length).toBeGreaterThan(0);
        // Should use profile data, not template
        const hasProfileCompany = resume.experience.some(exp => 
          exp.company === 'Web Agency'
        );
        expect(hasProfileCompany).toBe(true);
      });

      it('should prioritize profile education over template', () => {
        const resume = strategy.generateResume(midLevelProfile, professionalTemplate);

        expect(resume.education.length).toBeGreaterThan(0);
        // Should use profile data
        const hasProfileUniversity = resume.education.some(edu => 
          edu.institution === 'University of Texas'
        );
        expect(hasProfileUniversity).toBe(true);
      });

      it('should use profile professional summary', () => {
        const resume = strategy.generateResume(midLevelProfile, professionalTemplate);

        expect(resume.summary).toBe(midLevelProfile.professional_summary);
      });

      it('should merge profile and template skills', () => {
        const resume = strategy.generateResume(midLevelProfile, professionalTemplate);

        expect(resume.skills.length).toBeGreaterThan(0);
        
        // Should have profile skills
        const profileSkills = ['React', 'Node.js', 'MongoDB'];
        const hasProfileSkills = profileSkills.every(skillName =>
          resume.skills.some(skill => 
            skill.name.toLowerCase().includes(skillName.toLowerCase())
          )
        );
        expect(hasProfileSkills).toBe(true);
      });

      it('should parse structured work experience from profile', () => {
        const resume = strategy.generateResume(midLevelProfile, professionalTemplate);

        expect(resume.experience.length).toBe(1);
        const exp = resume.experience[0];
        expect(exp.company).toBe('Web Agency');
        expect(exp.position).toBe('Full Stack Developer');
        expect(exp.location).toBe('Austin, TX');
        expect(exp.current).toBe(true);
      });

      it('should handle JSON string work experience', () => {
        const resume = strategy.generateResume(experiencedProfile, professionalTemplate);

        expect(resume.experience.length).toBe(2);
        expect(resume.experience[0].company).toBe('Tech Corp');
        expect(resume.experience[1].company).toBe('StartupXYZ');
      });

      it('should fall back to template when profile summary is missing', () => {
        const profileWithoutSummary = {
          ...midLevelProfile,
          professional_summary: undefined
        };

        const resume = strategy.generateResume(profileWithoutSummary, professionalTemplate);

        expect(resume.summary).toBe(professionalTemplate.starterData?.summary);
      });
    });

    describe('edge cases', () => {
      it('should handle empty work experience array', () => {
        const profileWithEmptyExperience = {
          ...midLevelProfile,
          work_experience: []
        };

        const resume = strategy.generateResume(profileWithEmptyExperience, professionalTemplate);

        // Should fall back to template
        expect(resume.experience.length).toBeGreaterThan(0);
      });

      it('should handle invalid JSON in work experience', () => {
        const profileWithInvalidJSON = {
          ...midLevelProfile,
          work_experience: '{invalid json}'
        };

        const resume = strategy.generateResume(profileWithInvalidJSON, professionalTemplate);

        // Should fall back to template
        expect(resume.experience).toBeDefined();
      });

      it('should handle empty education array', () => {
        const profileWithEmptyEducation = {
          ...midLevelProfile,
          education: []
        };

        const resume = strategy.generateResume(profileWithEmptyEducation, professionalTemplate);

        // Should fall back to template
        expect(resume.education.length).toBeGreaterThan(0);
      });

      it('should handle missing skills gracefully', () => {
        const profileWithoutSkills = {
          ...midLevelProfile,
          key_skills: undefined
        };

        const resume = strategy.generateResume(profileWithoutSkills, professionalTemplate);

        // Should use template skills
        expect(resume.skills.length).toBeGreaterThan(0);
      });
    });
  });

  describe('FirstTimeJobSeekerStrategy', () => {
    const strategy = new FirstTimeJobSeekerStrategy();

    // Create a first-time job seeker profile
    const firstTimeProfile = {
      id: 'first-time-123',
      user: 'firsttime@example.com',
      first_name: 'Alex',
      last_name: 'Johnson',
      phone: '+1-555-0100',
      location: 'Portland, OR',
      
      target_industry: 'software',
      experience_level: 'entry-level',
      career_stage: 'entry',
      key_skills: 'HTML, CSS, JavaScript',
      
      role: 'job_seeker',
      plan: 'free',
      verified: true,
      active: true,
      profile_completed: true,
      
      // No work experience
      work_experience: undefined,
      
      // Has education
      education_level: 'bachelor',
      
      // Has some projects
      academic_projects: 'Built a simple web application for class project',
      volunteer_experience: 'Helped local nonprofit with website updates',
      
      created: '2024-01-01T00:00:00Z',
      updated: '2024-01-01T00:00:00Z'
    };

    describe('isApplicable', () => {
      it('should be applicable for entry-level without work experience', () => {
        expect(strategy.isApplicable(firstTimeProfile)).toBe(true);
      });

      it('should not be applicable for profiles with work experience', () => {
        const profileWithExperience = {
          ...firstTimeProfile,
          work_experience: JSON.stringify([{ company: 'Test', position: 'Dev' }])
        };
        expect(strategy.isApplicable(profileWithExperience)).toBe(false);
      });

      it('should not be applicable for students', () => {
        const studentCareerProfile = {
          ...firstTimeProfile,
          experience_level: 'student',
          career_stage: 'student'
        };
        expect(strategy.isApplicable(studentCareerProfile)).toBe(false);
      });

      it('should be applicable for first-time career stage', () => {
        const firstTimeCareer = {
          ...firstTimeProfile,
          career_stage: 'first-time'
        };
        expect(strategy.isApplicable(firstTimeCareer)).toBe(true);
      });

      it('should not be applicable for mid-level professionals', () => {
        expect(strategy.isApplicable(midLevelProfile)).toBe(false);
      });

      it('should not be applicable for experienced professionals', () => {
        expect(strategy.isApplicable(experiencedProfile)).toBe(false);
      });
    });

    describe('generateResume', () => {
      it('should generate complete resume for first-time job seeker', () => {
        const resume = strategy.generateResume(firstTimeProfile, professionalTemplate);

        expect(resume).toBeDefined();
        expect(resume.personalInfo).toBeDefined();
        expect(resume.summary).toBeDefined();
        expect(resume.experience).toBeDefined();
        expect(resume.education).toBeDefined();
        expect(resume.skills).toBeDefined();
        expect(resume.projects).toBeDefined();
      });

      it('should use template experience examples', () => {
        const resume = strategy.generateResume(firstTimeProfile, professionalTemplate);

        // Should use template experience
        expect(resume.experience.length).toBeGreaterThan(0);
        expect(resume.experience).toEqual(professionalTemplate.starterData?.experience);
      });

      it('should use template skills examples', () => {
        const resume = strategy.generateResume(firstTimeProfile, professionalTemplate);

        // Should include template skills
        expect(resume.skills.length).toBeGreaterThan(0);
        const templateSkillNames = professionalTemplate.starterData?.skills?.map(s => s.name.toLowerCase()) || [];
        const resumeSkillNames = resume.skills.map(s => s.name.toLowerCase());
        
        // All template skills should be present
        templateSkillNames.forEach(skillName => {
          expect(resumeSkillNames).toContain(skillName);
        });
      });

      it('should use template summary', () => {
        const resume = strategy.generateResume(firstTimeProfile, professionalTemplate);

        expect(resume.summary).toBe(professionalTemplate.starterData?.summary);
      });

      it('should use profile summary if provided', () => {
        const profileWithSummary = {
          ...firstTimeProfile,
          professional_summary: 'Eager to start my career in software development'
        };

        const resume = strategy.generateResume(profileWithSummary, professionalTemplate);

        expect(resume.summary).toBe(profileWithSummary.professional_summary);
      });

      it('should include academic projects if available', () => {
        const resume = strategy.generateResume(firstTimeProfile, professionalTemplate);

        expect(resume.projects.length).toBeGreaterThan(0);
        const hasAcademicProject = resume.projects.some(p => 
          p.name === 'Academic Project'
        );
        expect(hasAcademicProject).toBe(true);
      });

      it('should include volunteer experience if available', () => {
        const resume = strategy.generateResume(firstTimeProfile, professionalTemplate);

        const hasVolunteerProject = resume.projects.some(p => 
          p.name === 'Volunteer Experience'
        );
        expect(hasVolunteerProject).toBe(true);
      });

      it('should use profile contact information', () => {
        const resume = strategy.generateResume(firstTimeProfile, professionalTemplate);

        expect(resume.personalInfo.fullName).toContain(firstTimeProfile.first_name);
        expect(resume.personalInfo.fullName).toContain(firstTimeProfile.last_name);
        expect(resume.personalInfo.phone).toBe(firstTimeProfile.phone);
        expect(resume.personalInfo.location).toBe(firstTimeProfile.location);
      });

      it('should add profile skills to template skills', () => {
        const resume = strategy.generateResume(firstTimeProfile, professionalTemplate);

        // Should have both template and profile skills
        const skillNames = resume.skills.map(s => s.name.toLowerCase());
        expect(skillNames).toContain('javascript');
        expect(skillNames).toContain('html');
        expect(skillNames).toContain('css');
      });

      it('should use profile education if available', () => {
        const profileWithEducation = {
          ...firstTimeProfile,
          education: [
            {
              institution: 'State University',
              degree: 'Bachelor of Science',
              field: 'Computer Science',
              current: true
            }
          ]
        };

        const resume = strategy.generateResume(profileWithEducation, professionalTemplate);

        expect(resume.education.length).toBeGreaterThan(0);
        expect(resume.education[0].institution).toBe('State University');
      });
    });

    describe('edge cases', () => {
      it('should handle profile without projects', () => {
        const profileWithoutProjects = {
          ...firstTimeProfile,
          academic_projects: undefined,
          personal_projects: undefined,
          volunteer_experience: undefined
        };

        const resume = strategy.generateResume(profileWithoutProjects, professionalTemplate);

        // Should fall back to template projects
        expect(resume.projects).toEqual(professionalTemplate.starterData?.projects || []);
      });

      it('should handle profile without education', () => {
        const profileWithoutEducation = {
          ...firstTimeProfile,
          education: undefined,
          education_level: undefined
        };

        const resume = strategy.generateResume(profileWithoutEducation, professionalTemplate);

        // Should fall back to template education
        expect(resume.education).toEqual(professionalTemplate.starterData?.education || []);
      });

      it('should handle profile without skills', () => {
        const profileWithoutSkills = {
          ...firstTimeProfile,
          key_skills: undefined
        };

        const resume = strategy.generateResume(profileWithoutSkills, professionalTemplate);

        // Should use template skills (check names, not exact objects due to ID generation)
        const templateSkillNames = professionalTemplate.starterData?.skills?.map(s => s.name) || [];
        const resumeSkillNames = resume.skills.map(s => s.name);
        expect(resumeSkillNames).toEqual(templateSkillNames);
      });

      it('should handle empty template', () => {
        const emptyTemplate = {
          ...professionalTemplate,
          starterData: {
            personalInfo: {
              fullName: '',
              email: '',
              phone: '',
              location: '',
              summary: ''
            },
            summary: '',
            experience: [],
            education: [],
            skills: [],
            projects: [],
            settings: professionalTemplate.starterData!.settings
          }
        };

        const resume = strategy.generateResume(firstTimeProfile, emptyTemplate);

        expect(resume).toBeDefined();
        expect(resume.experience).toEqual([]);
        // Should have profile skills even with empty template
        const skillNames = resume.skills.map(s => s.name.toLowerCase());
        expect(skillNames).toContain('html');
        expect(skillNames).toContain('css');
        expect(skillNames).toContain('javascript');
      });
    });
  });

  describe('StudentStrategy', () => {
    const strategy = new StudentStrategy();

    describe('isApplicable', () => {
      it('should be applicable for students', () => {
        expect(strategy.isApplicable(studentProfile)).toBe(true);
      });

      it('should be applicable for entry-level', () => {
        expect(strategy.isApplicable(entryLevelProfile)).toBe(true);
      });

      it('should not be applicable for senior professionals', () => {
        expect(strategy.isApplicable(experiencedProfile)).toBe(false);
      });

      it('should be applicable when career_stage is student', () => {
        const studentCareerProfile = {
          ...experiencedProfile,
          experience_level: undefined,
          career_stage: 'student'
        };
        expect(strategy.isApplicable(studentCareerProfile)).toBe(true);
      });
    });

    describe('generateResume', () => {
      it('should generate complete resume for student', () => {
        const resume = strategy.generateResume(studentProfile, studentTemplate);

        expect(resume).toBeDefined();
        expect(resume.personalInfo).toBeDefined();
        expect(resume.summary).toBeDefined();
        expect(resume.experience).toBeDefined();
        expect(resume.education).toBeDefined();
        expect(resume.skills).toBeDefined();
        expect(resume.projects).toBeDefined();
      });

      it('should use template experience for students', () => {
        const resume = strategy.generateResume(studentProfile, studentTemplate);

        // Students typically don't have work experience, use template
        expect(resume.experience).toEqual([]);
      });

      it('should parse academic projects', () => {
        const resume = strategy.generateResume(studentProfile, studentTemplate);

        expect(resume.projects.length).toBeGreaterThan(0);
        const projectNames = resume.projects.map(p => p.name);
        expect(projectNames.some(name => name.includes('Academic'))).toBe(true);
      });

      it('should parse personal projects', () => {
        const resume = strategy.generateResume(studentProfile, studentTemplate);

        const projectNames = resume.projects.map(p => p.name);
        expect(projectNames.some(name => name.includes('Personal'))).toBe(true);
      });

      it('should parse volunteer experience as projects', () => {
        const resume = strategy.generateResume(studentProfile, studentTemplate);

        const projectNames = resume.projects.map(p => p.name);
        expect(projectNames.some(name => name.includes('Volunteer'))).toBe(true);
      });

      it('should parse extracurricular activities as projects', () => {
        const resume = strategy.generateResume(studentProfile, studentTemplate);

        const projectNames = resume.projects.map(p => p.name);
        expect(projectNames.some(name => name.includes('Extracurricular'))).toBe(true);
      });

      it('should parse technical proficiencies as skills', () => {
        const resume = strategy.generateResume(studentProfile, studentTemplate);

        const skillNames = resume.skills.map(s => s.name);
        expect(skillNames).toContain('Python');
        expect(skillNames).toContain('Java');
        expect(skillNames).toContain('JavaScript');
      });

      it('should assign beginner skill level', () => {
        const resume = strategy.generateResume(studentProfile, studentTemplate);

        const profileSkills = resume.skills.filter(s => 
          ['Python', 'Java', 'JavaScript'].includes(s.name)
        );

        profileSkills.forEach(skill => {
          expect(skill.level).toBe('beginner');
        });
      });

      it('should create education from education_level', () => {
        const profileWithLevel = {
          ...studentProfile,
          education: undefined,
          education_level: 'bachelor'
        };

        const resume = strategy.generateResume(profileWithLevel, studentTemplate);

        expect(resume.education.length).toBeGreaterThan(0);
        expect(resume.education[0].degree).toBe("Bachelor's Degree");
      });
    });

    describe('edge cases', () => {
      it('should handle missing projects gracefully', () => {
        const profileWithoutProjects = {
          ...studentProfile,
          academic_projects: undefined,
          personal_projects: undefined,
          volunteer_experience: undefined,
          extracurricular_activities: undefined
        };

        const resume = strategy.generateResume(profileWithoutProjects, studentTemplate);

        // Should fall back to template
        expect(resume.projects.length).toBeGreaterThan(0);
      });

      it('should handle empty project strings', () => {
        const profileWithEmptyProjects = {
          ...studentProfile,
          academic_projects: '   ',
          personal_projects: '   '
        };

        const resume = strategy.generateResume(profileWithEmptyProjects, studentTemplate);

        // Should only include non-empty projects
        const projectNames = resume.projects.map(p => p.name);
        expect(projectNames.filter(n => n.includes('Academic')).length).toBe(0);
        expect(projectNames.filter(n => n.includes('Personal')).length).toBe(0);
      });

      it('should handle missing education gracefully', () => {
        const profileWithoutEducation = {
          ...studentProfile,
          education: undefined,
          education_level: undefined
        };

        const resume = strategy.generateResume(profileWithoutEducation, studentTemplate);

        // Should fall back to template
        expect(resume.education.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Strategy Comparison', () => {
    it('should generate different resumes for same profile with different strategies', () => {
      const expStrategy = new ExperiencedProfessionalStrategy();
      const studentStrategy = new StudentStrategy();

      const expResume = expStrategy.generateResume(experiencedProfile, professionalTemplate);
      const studentResume = studentStrategy.generateResume(experiencedProfile, professionalTemplate);

      // Experience section should be different
      expect(expResume.experience.length).not.toBe(studentResume.experience.length);
    });

    it('should maintain consistent personal info across strategies', () => {
      const expStrategy = new ExperiencedProfessionalStrategy();
      const studentStrategy = new StudentStrategy();

      const expResume = expStrategy.generateResume(experiencedProfile, professionalTemplate);
      const studentResume = studentStrategy.generateResume(experiencedProfile, professionalTemplate);

      // Personal info should be the same
      expect(expResume.personalInfo.fullName).toBe(studentResume.personalInfo.fullName);
      expect(expResume.personalInfo.email).toBe(studentResume.personalInfo.email);
    });
  });

  describe('Strategy Interface Compliance', () => {
    it('all strategies should implement required methods', () => {
      const strategies = ResumeStrategyFactory.getAllStrategies();

      strategies.forEach(strategy => {
        expect(typeof strategy.generateResume).toBe('function');
        expect(typeof strategy.getStrategyName).toBe('function');
        expect(typeof strategy.isApplicable).toBe('function');
      });
    });

    it('all strategies should return valid strategy names', () => {
      const strategies = ResumeStrategyFactory.getAllStrategies();

      strategies.forEach(strategy => {
        const name = strategy.getStrategyName();
        expect(name).toBeDefined();
        expect(typeof name).toBe('string');
        expect(name.length).toBeGreaterThan(0);
      });
    });

    it('all strategies should return complete resume data', () => {
      const strategies = ResumeStrategyFactory.getAllStrategies();

      strategies.forEach(strategy => {
        const resume = strategy.generateResume(experiencedProfile, professionalTemplate);

        expect(resume.personalInfo).toBeDefined();
        expect(resume.summary).toBeDefined();
        expect(resume.experience).toBeDefined();
        expect(resume.education).toBeDefined();
        expect(resume.skills).toBeDefined();
        expect(resume.projects).toBeDefined();
        expect(resume.settings).toBeDefined();
        expect(resume.currentStep).toBeDefined();
        expect(resume.completedSteps).toBeDefined();
      });
    });
  });

  describe('StrategySelector', () => {
    describe('selectStrategy', () => {
      it('should select CareerChanger for career change profile', () => {
        const careerChangeProfile = {
          ...midLevelProfile,
          career_stage: 'career_change',
          target_industry: 'software-engineering'
        };

        const selection = ResumeStrategyFactory.selectStrategy(careerChangeProfile);

        expect(selection.strategyName).toBe('CareerChanger');
        expect(selection.confidence).toBeGreaterThan(0.7);
        expect(selection.reasons.length).toBeGreaterThan(0);
      });

      it('should select ExperiencedProfessional for senior profile', () => {
        const selection = ResumeStrategyFactory.selectStrategy(experiencedProfile);

        expect(selection.strategyName).toBe('ExperiencedProfessional');
        expect(selection.confidence).toBeGreaterThan(0.7);
        expect(selection.reasons).toContain('Senior level experience');
      });

      it('should select ExperiencedJobSeeker for mid-level profile', () => {
        const selection = ResumeStrategyFactory.selectStrategy(midLevelProfile);

        expect(selection.strategyName).toBe('ExperiencedJobSeeker');
        expect(selection.confidence).toBeGreaterThan(0.5);
      });

      it('should select Student for student profile', () => {
        const selection = ResumeStrategyFactory.selectStrategy(studentProfile);

        expect(selection.strategyName).toBe('Student');
        expect(selection.confidence).toBeGreaterThan(0.7);
        expect(selection.reasons.some(r => r.includes('student'))).toBe(true);
      });

      it('should select FirstTimeJobSeeker for entry-level without experience', () => {
        const firstTimeProfile = {
          ...entryLevelProfile,
          work_experience: undefined,
          experience_level: 'entry-level',
          career_stage: 'entry'
        };

        const selection = ResumeStrategyFactory.selectStrategy(firstTimeProfile);

        expect(selection.strategyName).toBe('FirstTimeJobSeeker');
        expect(selection.confidence).toBeGreaterThan(0.5);
      });

      it('should include confidence score between 0 and 1', () => {
        const selection = ResumeStrategyFactory.selectStrategy(experiencedProfile);

        expect(selection.confidence).toBeGreaterThanOrEqual(0);
        expect(selection.confidence).toBeLessThanOrEqual(1);
      });

      it('should include reasons for selection', () => {
        const selection = ResumeStrategyFactory.selectStrategy(experiencedProfile);

        expect(selection.reasons).toBeDefined();
        expect(Array.isArray(selection.reasons)).toBe(true);
        expect(selection.reasons.length).toBeGreaterThan(0);
        expect(typeof selection.reasons[0]).toBe('string');
      });

      it('should return strategy object', () => {
        const selection = ResumeStrategyFactory.selectStrategy(experiencedProfile);

        expect(selection.strategy).toBeDefined();
        expect(typeof selection.strategy.generateResume).toBe('function');
        expect(typeof selection.strategy.getStrategyName).toBe('function');
      });
    });

    describe('manual override', () => {
      it('should allow manual strategy override', () => {
        const selection = ResumeStrategyFactory.selectStrategy(
          experiencedProfile,
          'Student'
        );

        expect(selection.strategyName).toBe('Student');
        expect(selection.confidence).toBe(1.0);
        expect(selection.reasons).toContain('Manual override selected');
      });

      it('should ignore invalid manual override', () => {
        const selection = ResumeStrategyFactory.selectStrategy(
          experiencedProfile,
          'NonExistentStrategy'
        );

        // Should fall back to automatic selection
        expect(selection.strategyName).not.toBe('NonExistentStrategy');
        expect(selection.confidence).toBeLessThan(1.0);
      });

      it('should override automatic selection', () => {
        // Profile would normally select ExperiencedProfessional
        const selection = ResumeStrategyFactory.selectStrategy(
          experiencedProfile,
          'FirstTimeJobSeeker'
        );

        expect(selection.strategyName).toBe('FirstTimeJobSeeker');
        expect(selection.confidence).toBe(1.0);
      });
    });

    describe('getAllStrategyScores', () => {
      it('should return scores for all strategies', () => {
        const scores = ResumeStrategyFactory.getAllStrategyScores(experiencedProfile);

        expect(scores.length).toBeGreaterThanOrEqual(5);
        expect(scores.every(s => s.strategyName)).toBe(true);
        expect(scores.every(s => typeof s.confidence === 'number')).toBe(true);
      });

      it('should sort strategies by confidence', () => {
        const scores = ResumeStrategyFactory.getAllStrategyScores(experiencedProfile);

        for (let i = 0; i < scores.length - 1; i++) {
          expect(scores[i].confidence).toBeGreaterThanOrEqual(scores[i + 1].confidence);
        }
      });

      it('should include reasons for each strategy', () => {
        const scores = ResumeStrategyFactory.getAllStrategyScores(experiencedProfile);

        scores.forEach(score => {
          expect(score.reasons).toBeDefined();
          expect(Array.isArray(score.reasons)).toBe(true);
        });
      });

      it('should have highest score for best match', () => {
        const scores = ResumeStrategyFactory.getAllStrategyScores(experiencedProfile);

        expect(scores[0].strategyName).toBe('ExperiencedProfessional');
        expect(scores[0].confidence).toBeGreaterThan(scores[1].confidence);
      });

      it('should show zero confidence for non-applicable strategies', () => {
        const scores = ResumeStrategyFactory.getAllStrategyScores(studentProfile);

        const experiencedProfScore = scores.find(s => s.strategyName === 'ExperiencedProfessional');
        expect(experiencedProfScore?.confidence).toBe(0);
      });
    });

    describe('confidence scoring', () => {
      it('should give high confidence for explicit career change', () => {
        const careerChangeProfile = {
          ...midLevelProfile,
          career_stage: 'career_change',
          target_industry: 'data-science'
        };

        const selection = ResumeStrategyFactory.selectStrategy(careerChangeProfile);

        expect(selection.strategyName).toBe('CareerChanger');
        expect(selection.confidence).toBeGreaterThan(0.8);
      });

      it('should give high confidence for senior professionals', () => {
        const selection = ResumeStrategyFactory.selectStrategy(experiencedProfile);

        expect(selection.confidence).toBeGreaterThan(0.8);
      });

      it('should give moderate to high confidence for mid-level', () => {
        const selection = ResumeStrategyFactory.selectStrategy(midLevelProfile);

        expect(selection.confidence).toBeGreaterThan(0.5);
        // Can be high if profile has good data
      });

      it('should consider multiple factors in scoring', () => {
        const richProfile = {
          ...midLevelProfile,
          professional_summary: 'Experienced developer...',
          key_skills: 'JavaScript, React, Node.js'
        };

        const selection = ResumeStrategyFactory.selectStrategy(richProfile);

        expect(selection.reasons.length).toBeGreaterThan(1);
      });
    });

    describe('priority order', () => {
      it('should prioritize career changer when explicitly marked', () => {
        const transitionProfile = {
          ...midLevelProfile,
          career_stage: 'career_change',
          target_industry: 'software-engineering'
        };

        const selection = ResumeStrategyFactory.selectStrategy(transitionProfile);

        expect(selection.strategyName).toBe('CareerChanger');
      });

      it('should prioritize experienced over first-time when has experience', () => {
        const selection = ResumeStrategyFactory.selectStrategy(midLevelProfile);

        expect(selection.strategyName).not.toBe('FirstTimeJobSeeker');
      });

      it('should select first-time when no work experience', () => {
        const noExperienceProfile = {
          ...entryLevelProfile,
          work_experience: undefined,
          experience_level: 'entry-level'
        };

        const selection = ResumeStrategyFactory.selectStrategy(noExperienceProfile);

        expect(selection.strategyName).toBe('FirstTimeJobSeeker');
      });
    });
  });
});
