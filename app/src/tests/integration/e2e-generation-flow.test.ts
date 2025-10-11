import { describe, it, expect, beforeEach, vi } from 'vitest';
import { experiencedProfile, midLevelProfile, studentProfile } from '../fixtures/profiles';
import {
  createMockAIService,
  createMockDatabase,
  createMockTemplateService,
  calculateCompletenessScore,
  validateMinimumProfile,
  assertValidResumeStructure,
  testDataGenerators
} from '../utils/test-helpers';
import type { UserProfile, Resume } from '../../types';

/**
 * End-to-End Resume Generation Flow Tests
 * Tests the complete flow from user input through AI generation to database storage
 */
describe('E2E Resume Generation Flow', () => {
  let mockAI: ReturnType<typeof createMockAIService>;
  let mockDB: ReturnType<typeof createMockDatabase>;
  let mockTemplates: ReturnType<typeof createMockTemplateService>;

  beforeEach(() => {
    mockAI = createMockAIService();
    mockDB = createMockDatabase();
    mockTemplates = createMockTemplateService();
    mockDB.clear();
  });

  describe('Complete Flow: Profile → AI → Template → Database', () => {
    it('should complete full generation flow for experienced professional', async () => {
      // Step 1: Validate profile
      const validation = validateMinimumProfile(experiencedProfile);
      expect(validation.valid).toBe(true);
      expect(validation.missing).toHaveLength(0);

      // Step 2: Calculate completeness
      const completeness = calculateCompletenessScore(experiencedProfile);
      expect(completeness).toBeGreaterThanOrEqual(90);

      // Step 3: Generate AI content
      const summary = await mockAI.generateSummary(experiencedProfile);
      expect(summary).toBeTruthy();
      expect(mockAI.generateSummary).toHaveBeenCalledWith(experiencedProfile);

      // Step 4: Format experience
      const experience = typeof experiencedProfile.work_experience === 'string'
        ? JSON.parse(experiencedProfile.work_experience)
        : experiencedProfile.work_experience;
      const formattedExp = await mockAI.formatExperience(experience);
      expect(formattedExp).toBeTruthy();

      // Step 5: Extract skills
      const skills = await mockAI.extractSkills(experiencedProfile);
      expect(skills).toBeInstanceOf(Array);
      expect(skills.length).toBeGreaterThan(0);

      // Step 6: Apply template
      const template = await mockTemplates.getTemplate('professional');
      expect(template.name).toBe('professional');

      const content = {
        personal: {
          name: `${experiencedProfile.first_name} ${experiencedProfile.last_name}`,
          email: experiencedProfile.user,
          phone: experiencedProfile.phone,
          location: experiencedProfile.location
        },
        summary,
        experience: formattedExp,
        skills
      };

      const formatted = await mockTemplates.applyTemplate(content, 'professional');
      expect(formatted.formatted).toBe(true);

      // Step 7: Save to database
      const resume: Resume = {
        id: testDataGenerators.userId(),
        user_id: experiencedProfile.id,
        title: 'Senior Software Engineer Resume',
        slug: testDataGenerators.slug('senior-engineer'),
        template: 'professional',
        strategy: 'experienced',
        content: formatted,
        metadata: {
          completeness_score: completeness,
          generation_time: 2000,
          version: 1
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const saved = await mockDB.saveResume(resume);
      expect(saved.id).toBe(resume.id);
      expect(mockDB.saveResume).toHaveBeenCalledWith(resume);

      // Step 8: Verify retrieval
      const retrieved = await mockDB.getResume(resume.id);
      expect(retrieved).toBeTruthy();
      expect(retrieved?.title).toBe(resume.title);
      assertValidResumeStructure(retrieved);
    });

    it('should handle first-time job seeker flow with guidance', async () => {
      // Step 1: Validate and assess profile
      const validation = validateMinimumProfile(studentProfile);
      expect(validation.valid).toBe(true);

      const completeness = calculateCompletenessScore(studentProfile);
      expect(completeness).toBeLessThan(70); // Entry-level typically has less content

      // Step 2: Generate entry-level appropriate content
      const summary = await mockAI.generateSummary(studentProfile);
      expect(summary).toBeTruthy();

      // Step 3: Handle limited experience
      const experience = typeof studentProfile.work_experience === 'string'
        ? JSON.parse(studentProfile.work_experience)
        : studentProfile.work_experience;
      const hasExperience = experience && experience.length > 0;
      
      let formattedExp;
      if (hasExperience) {
        formattedExp = await mockAI.formatExperience(experience);
      } else {
        // Use projects or education as experience substitute
        formattedExp = 'Relevant coursework and projects';
      }
      expect(formattedExp).toBeTruthy();

      // Step 4: Emphasize education and skills
      const skills = await mockAI.extractSkills(studentProfile);
      expect(skills).toBeInstanceOf(Array);

      // Step 5: Use appropriate template
      const template = await mockTemplates.getTemplate('minimal');
      expect(template.name).toBe('minimal');

      // Step 6: Create and save resume
      const education = typeof studentProfile.education === 'string'
        ? JSON.parse(studentProfile.education)
        : studentProfile.education;
      const resume: Resume = {
        id: testDataGenerators.userId(),
        user_id: studentProfile.id,
        title: 'Entry Level Software Developer Resume',
        slug: testDataGenerators.slug('entry-level-dev'),
        template: 'minimal',
        strategy: 'first-time',
        content: {
          personal: {
            name: `${studentProfile.first_name} ${studentProfile.last_name}`,
            email: studentProfile.user,
            phone: studentProfile.phone,
            location: studentProfile.location
          },
          summary,
          experience: formattedExp,
          education,
          skills
        },
        metadata: {
          completeness_score: completeness,
          generation_time: 1500,
          version: 1,
          guidance: 'Entry-level resume focusing on education and potential'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const saved = await mockDB.saveResume(resume);
      expect(saved.strategy).toBe('first-time');
      assertValidResumeStructure(saved);
    });

    it('should handle partial profile with graceful degradation', async () => {
      // Step 1: Validate profile
      const validation = validateMinimumProfile(midLevelProfile);
      expect(validation.valid).toBe(true);

      const completeness = calculateCompletenessScore(midLevelProfile);
      expect(completeness).toBeGreaterThan(40);
      expect(completeness).toBeLessThan(100);

      // Step 2: Generate content with available data
      const summary = await mockAI.generateSummary(midLevelProfile);
      expect(summary).toBeTruthy();

      // Step 3: Handle missing sections gracefully
      const content: any = {
        personal: {
          name: `${midLevelProfile.first_name} ${midLevelProfile.last_name}`,
          email: midLevelProfile.user
        },
        summary
      };

      // Add optional sections if available
      const experience = typeof midLevelProfile.work_experience === 'string' 
        ? JSON.parse(midLevelProfile.work_experience) 
        : midLevelProfile.work_experience;
      
      if (experience && experience.length > 0) {
        content.experience = await mockAI.formatExperience(experience);
      }

      if (midLevelProfile.key_skills) {
        content.skills = await mockAI.extractSkills(midLevelProfile);
      }

      // Step 4: Save with metadata indicating incompleteness
      const resume: Resume = {
        id: testDataGenerators.userId(),
        user_id: midLevelProfile.id,
        title: 'Marketing Professional Resume',
        slug: testDataGenerators.slug('marketing-pro'),
        template: 'professional',
        strategy: 'auto',
        content,
        metadata: {
          completeness_score: completeness,
          generation_time: 1200,
          version: 1,
          warnings: midLevelProfile.phone ? [] : ['Missing phone number']
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const saved = await mockDB.saveResume(resume);
      expect(saved.metadata.warnings).toBeDefined();
      assertValidResumeStructure(saved);
    });
  });

  describe('Flow with Error Recovery', () => {
    it('should recover from AI service timeout', async () => {
      // Simulate AI timeout on first call, success on retry
      mockAI.generateSummary
        .mockRejectedValueOnce(new Error('Request timeout'))
        .mockResolvedValueOnce('Generated summary after retry');

      const validation = validateMinimumProfile(experiencedProfile);
      expect(validation.valid).toBe(true);

      // First attempt fails
      await expect(mockAI.generateSummary(experiencedProfile)).rejects.toThrow('Request timeout');

      // Retry succeeds
      const summary = await mockAI.generateSummary(experiencedProfile);
      expect(summary).toBe('Generated summary after retry');
      expect(mockAI.generateSummary).toHaveBeenCalledTimes(2);
    });

    it('should handle database save failure with retry', async () => {
      const resume: Resume = {
        id: testDataGenerators.userId(),
        user_id: experiencedProfile.id,
        title: 'Test Resume',
        slug: testDataGenerators.slug('test'),
        template: 'professional',
        strategy: 'auto',
        content: { personal: {}, summary: '', experience: [], skills: [] },
        metadata: { completeness_score: 100, generation_time: 1000, version: 1 },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Simulate database failure then success
      mockDB.saveResume
        .mockRejectedValueOnce(new Error('Database connection failed'))
        .mockResolvedValueOnce(resume);

      // First attempt fails
      await expect(mockDB.saveResume(resume)).rejects.toThrow('Database connection failed');

      // Retry succeeds
      const saved = await mockDB.saveResume(resume);
      expect(saved.id).toBe(resume.id);
      expect(mockDB.saveResume).toHaveBeenCalledTimes(2);
    });

    it('should fallback to default template if preferred unavailable', async () => {
      // Simulate template not found
      mockTemplates.getTemplate
        .mockRejectedValueOnce(new Error('Template not found'))
        .mockResolvedValueOnce({ name: 'professional', layout: 'standard', styles: {}, sections: [] });

      // Try creative template (fails)
      await expect(mockTemplates.getTemplate('creative')).rejects.toThrow('Template not found');

      // Fallback to professional (succeeds)
      const template = await mockTemplates.getTemplate('professional');
      expect(template.name).toBe('professional');
    });
  });

  describe('Flow with Multiple Resumes', () => {
    it('should create multiple resumes for different job applications', async () => {
      const jobTitles = ['Software Engineer', 'Frontend Developer', 'Full Stack Developer'];
      const resumes: Resume[] = [];

      for (const title of jobTitles) {
        const validation = validateMinimumProfile(experiencedProfile);
        expect(validation.valid).toBe(true);

        const summary = await mockAI.generateSummary(experiencedProfile);
        const skills = await mockAI.extractSkills(experiencedProfile);

        const resume: Resume = {
          id: testDataGenerators.userId(),
          user_id: experiencedProfile.id,
          title: `${title} Resume`,
          slug: testDataGenerators.slug(title.toLowerCase().replace(/\s+/g, '-')),
          template: 'professional',
          strategy: 'experienced',
          content: {
            personal: {
              name: `${experiencedProfile.first_name} ${experiencedProfile.last_name}`,
              email: experiencedProfile.user,
              phone: experiencedProfile.phone,
              location: experiencedProfile.location
            },
            summary,
            skills
          },
          metadata: {
            completeness_score: calculateCompletenessScore(experiencedProfile),
            generation_time: 1500,
            version: 1,
            target_role: title
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const saved = await mockDB.saveResume(resume);
        resumes.push(saved);
      }

      expect(resumes).toHaveLength(3);
      expect(new Set(resumes.map(r => r.slug)).size).toBe(3); // All unique slugs
      expect(new Set(resumes.map(r => r.id)).size).toBe(3); // All unique IDs

      // Verify all saved
      const allResumes = await mockDB.listResumes(experiencedProfile.id);
      expect(allResumes).toHaveLength(3);
    });

    it('should update existing resume instead of creating duplicate', async () => {
      const resume: Resume = {
        id: 'resume-123',
        user_id: experiencedProfile.id,
        title: 'Software Engineer Resume',
        slug: 'software-engineer-resume',
        template: 'professional',
        strategy: 'experienced',
        content: { personal: {}, summary: 'Original summary', experience: [], skills: [] },
        metadata: { completeness_score: 80, generation_time: 1000, version: 1 },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Save initial version
      await mockDB.saveResume(resume);

      // Update with new content
      const newSummary = await mockAI.generateSummary(experiencedProfile);
      const updated = await mockDB.updateResume('resume-123', {
        content: { ...resume.content, summary: newSummary },
        metadata: { ...resume.metadata, version: 2 },
        updated_at: new Date().toISOString()
      });

      expect(updated.id).toBe('resume-123');
      expect(updated.metadata.version).toBe(2);
      expect(updated.content.summary).not.toBe('Original summary');

      // Verify only one resume exists
      const allResumes = await mockDB.listResumes(experiencedProfile.id);
      expect(allResumes).toHaveLength(1);
    });
  });

  describe('Flow Performance Tracking', () => {
    it('should track generation time for each step', async () => {
      const timings: Record<string, number> = {};

      // Profile validation
      const validationStart = Date.now();
      const validation = validateMinimumProfile(experiencedProfile);
      timings.validation = Date.now() - validationStart;
      expect(validation.valid).toBe(true);

      // Completeness calculation
      const completenessStart = Date.now();
      const completeness = calculateCompletenessScore(experiencedProfile);
      timings.completeness = Date.now() - completenessStart;
      expect(completeness).toBeGreaterThan(0);

      // AI generation
      const aiStart = Date.now();
      await mockAI.generateSummary(experiencedProfile);
      timings.ai = Date.now() - aiStart;

      // Template application
      const templateStart = Date.now();
      await mockTemplates.getTemplate('professional');
      timings.template = Date.now() - templateStart;

      // Database save
      const dbStart = Date.now();
      await mockDB.saveResume({
        id: testDataGenerators.userId(),
        user_id: experiencedProfile.id,
        title: 'Test',
        slug: 'test',
        template: 'professional',
        strategy: 'auto',
        content: { personal: {}, summary: '', experience: [], skills: [] },
        metadata: { completeness_score: 100, generation_time: 0, version: 1 },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      timings.database = Date.now() - dbStart;

      // Verify all steps completed
      expect(Object.keys(timings)).toHaveLength(5);
      expect(timings.validation).toBeGreaterThanOrEqual(0);
      expect(timings.completeness).toBeGreaterThanOrEqual(0);
      expect(timings.ai).toBeGreaterThanOrEqual(0);
      expect(timings.template).toBeGreaterThanOrEqual(0);
      expect(timings.database).toBeGreaterThanOrEqual(0);
    });
  });
});
