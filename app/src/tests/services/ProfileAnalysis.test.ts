import { describe, it, expect } from 'vitest';
import { analyzeProfile, type ProfileAnalysisResult } from '$lib/services/ProfileAnalysis';
import type { UserProfile } from '$lib/types';

describe('ProfileAnalysis', () => {
  const createMockProfile = (overrides: Partial<UserProfile> = {}): UserProfile => ({
    id: 'test-id',
    user: 'test-user',
    created: '2024-01-01',
    updated: '2024-01-01',
    first_name: 'John',
    last_name: 'Doe',
    full_name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    location: 'New York, NY',
    linkedin_url: 'https://linkedin.com/in/johndoe',
    portfolio_url: 'https://johndoe.com',
    github_url: 'https://github.com/johndoe',
    professional_summary: 'Experienced software engineer with 5 years of experience',
    target_industry: 'Technology',
    target_job_titles: 'Software Engineer, Full Stack Developer',
    experience_level: 'mid',
    career_stage: 'mid-career',
    key_skills: 'JavaScript, TypeScript, React, Node.js',
    education_level: 'bachelors',
    preferred_work_type: ['remote', 'hybrid'],
    work_experience: JSON.stringify([
      {
        company: 'Tech Corp',
        position: 'Software Engineer',
        start_date: '2020-01',
        end_date: '2024-01',
        description: 'Built web applications',
        highlights: ['Led team of 3', 'Improved performance by 50%']
      }
    ]),
    education: JSON.stringify([
      {
        institution: 'University',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        start_date: '2016-09',
        end_date: '2020-05'
      }
    ]),
    skills: JSON.stringify([
      { name: 'JavaScript', level: 'advanced' },
      { name: 'TypeScript', level: 'advanced' },
      { name: 'React', level: 'advanced' }
    ]),
    role: 'user',
    plan: 'free',
    verified: true,
    active: true,
    ...overrides
  });

  describe('analyzeProfile', () => {
    it('should return 100% completeness for a fully filled profile', () => {
      const profile = createMockProfile();
      const result = analyzeProfile(profile);

      expect(result.completeness).toBe(100);
      expect(result.isReadyForGeneration).toBe(true);
      expect(result.missingFields).toHaveLength(0);
      expect(result.suggestions.length).toBeLessThanOrEqual(1); // May have low-priority suggestions
    });

    it('should detect missing personal information', () => {
      const profile = createMockProfile({
        first_name: '',
        last_name: '',
        phone: '',
        location: ''
      });
      const result = analyzeProfile(profile);

      expect(result.completeness).toBeLessThan(100);
      const missingFieldNames = result.missingFields.map(f => f.name);
      expect(missingFieldNames).toContain('first_name');
      expect(missingFieldNames).toContain('last_name');
      expect(missingFieldNames).toContain('phone');
      expect(missingFieldNames).toContain('location');
      expect(result.breakdown.basic).toBe(0);
    });

    it('should detect missing professional summary', () => {
      const profile = createMockProfile({
        professional_summary: ''
      });
      const result = analyzeProfile(profile);

      const missingFieldNames = result.missingFields.map(f => f.name);
      expect(missingFieldNames).toContain('professional_summary');
      expect(result.breakdown.professional).toBeLessThan(100);
    });

    it('should detect missing work experience', () => {
      const profile = createMockProfile({
        work_experience: ''
      });
      const result = analyzeProfile(profile);

      const missingFieldNames = result.missingFields.map(f => f.name);
      expect(missingFieldNames).toContain('work_experience');
      expect(result.breakdown.experience).toBe(0);
    });

    it('should detect missing education', () => {
      const profile = createMockProfile({
        education: ''
      });
      const result = analyzeProfile(profile);

      const missingFieldNames = result.missingFields.map(f => f.name);
      expect(missingFieldNames).toContain('education');
      expect(result.breakdown.education).toBe(0);
    });

    it('should detect missing skills', () => {
      const profile = createMockProfile({
        skills: ''
      });
      const result = analyzeProfile(profile);

      const missingFieldNames = result.missingFields.map(f => f.name);
      expect(missingFieldNames).toContain('skills');
      expect(result.breakdown.skills).toBe(0);
    });

    it('should detect missing target information', () => {
      const profile = createMockProfile({
        target_industry: '',
        professional_summary: ''
      });
      const result = analyzeProfile(profile);

      const missingFieldNames = result.missingFields.map(f => f.name);
      expect(missingFieldNames).toContain('target_industry');
      expect(missingFieldNames).toContain('professional_summary');
      expect(result.breakdown.professional).toBe(0);
    });

    it('should provide suggestions for missing critical fields', () => {
      const profile = createMockProfile({
        professional_summary: '',
        work_experience: ''
      });
      const result = analyzeProfile(profile);

      expect(result.suggestions.length).toBeGreaterThan(0);
      expect(result.suggestions.some(s => s.field === 'professional_summary')).toBe(true);
      expect(result.suggestions.some(s => s.field === 'work_experience')).toBe(true);
    });

    it('should mark profile as not ready when completeness is below 60%', () => {
      const profile = createMockProfile({
        professional_summary: '',
        work_experience: '',
        education: '',
        key_skills: '',
        target_industry: '',
        target_job_titles: ''
      });
      const result = analyzeProfile(profile);

      expect(result.completeness).toBeLessThan(60);
      expect(result.isReadyForGeneration).toBe(false);
    });

    it('should mark profile as ready when completeness is 40% or above with minimum requirements', () => {
      const profile = createMockProfile({
        // Has minimum requirements (first_name, last_name) and some other fields
        // Missing only some fields
        location: ''
      });
      const result = analyzeProfile(profile);

      expect(result.completeness).toBeGreaterThanOrEqual(40);
      expect(result.minimumRequirementsMet).toBe(true);
      expect(result.isReadyForGeneration).toBe(true);
    });

    it('should handle null work_experience gracefully', () => {
      const profile = {
        ...createMockProfile(),
        work_experience: null as any
      };
      const result = analyzeProfile(profile);

      const missingFieldNames = result.missingFields.map(f => f.name);
      expect(missingFieldNames).toContain('work_experience');
      expect(result.breakdown.experience).toBe(0);
    });

    it('should handle null education gracefully', () => {
      const profile = {
        ...createMockProfile(),
        education: null as any
      };
      const result = analyzeProfile(profile);

      const missingFieldNames = result.missingFields.map(f => f.name);
      expect(missingFieldNames).toContain('education');
      expect(result.breakdown.education).toBe(0);
    });

    it('should prioritize suggestions by importance', () => {
      const profile = createMockProfile({
        professional_summary: '',
        work_experience: '',
        github_url: ''
      });
      const result = analyzeProfile(profile);

      // Critical fields should come before optional ones
      const criticalSuggestions = result.suggestions.filter(s => 
        s.field === 'professional_summary' || s.field === 'work_experience'
      );
      const optionalSuggestions = result.suggestions.filter(s => 
        s.field === 'github_url'
      );

      expect(criticalSuggestions.length).toBeGreaterThan(0);
      if (optionalSuggestions.length > 0) {
        const lastCriticalIndex = result.suggestions.findIndex(s => 
          s.field === criticalSuggestions[criticalSuggestions.length - 1].field
        );
        const firstOptionalIndex = result.suggestions.findIndex(s => 
          s.field === 'github_url'
        );
        expect(lastCriticalIndex).toBeLessThan(firstOptionalIndex);
      }
    });

    it('should calculate category scores correctly', () => {
      const profile = createMockProfile({
        // Missing half of basic info (phone and location out of 4 fields)
        phone: '',
        location: ''
      });
      const result = analyzeProfile(profile);

      // Basic category should be 50% when 2 out of 4 fields are present
      expect(result.breakdown.basic).toBe(50);
    });

    it('should handle empty string work_experience', () => {
      const profile = {
        ...createMockProfile(),
        work_experience: ''
      };
      const result = analyzeProfile(profile);

      const missingFieldNames = result.missingFields.map(f => f.name);
      expect(missingFieldNames).toContain('work_experience');
      expect(result.breakdown.experience).toBe(0);
    });

    it('should handle empty string education', () => {
      const profile = {
        ...createMockProfile(),
        education: ''
      };
      const result = analyzeProfile(profile);

      const missingFieldNames = result.missingFields.map(f => f.name);
      expect(missingFieldNames).toContain('education');
      expect(result.breakdown.education).toBe(0);
    });

    it('should provide actionable suggestions with descriptions', () => {
      const profile = createMockProfile({
        professional_summary: ''
      });
      const result = analyzeProfile(profile);

      const summarySuggestion = result.suggestions.find(s => s.field === 'professional_summary');
      expect(summarySuggestion).toBeDefined();
      expect(summarySuggestion?.reason).toBeTruthy();
      expect(summarySuggestion?.action).toBeTruthy();
      expect(summarySuggestion?.reason.length).toBeGreaterThan(0);
    });

    it('should handle profiles with minimal information', () => {
      const minimalProfile = createMockProfile({
        first_name: 'John',
        last_name: 'Doe',
        professional_summary: '',
        work_experience: '',
        education: '',
        skills: '',
        target_industry: '',
        phone: '',
        location: ''
      });
      const result = analyzeProfile(minimalProfile);

      expect(result.completeness).toBeLessThan(40);
      expect(result.minimumRequirementsMet).toBe(true); // Has first_name and last_name
      expect(result.isReadyForGeneration).toBe(false); // But completeness is too low
      expect(result.missingFields.length).toBeGreaterThan(4);
      expect(result.suggestions.length).toBeGreaterThan(3);
    });
  });
});
