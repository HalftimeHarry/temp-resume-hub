import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { generationPreferences, getDefaultPreferences } from '$lib/stores/generationPreferences';

// Mock browser environment
vi.mock('$app/environment', () => ({
  browser: true
}));

describe('generationPreferences', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset store to defaults
    generationPreferences.reset();
  });

  it('should initialize with default preferences', () => {
    const prefs = get(generationPreferences);
    const defaults = getDefaultPreferences();
    
    expect(prefs).toEqual(defaults);
    expect(prefs.selectedSections.personal).toBe(true);
    expect(prefs.selectedSections.summary).toBe(true);
    expect(prefs.targetIndustry).toBe('');
    expect(prefs.strategy).toBe('');
  });

  it('should save preferences to localStorage when set', () => {
    const newPrefs = {
      selectedSections: {
        personal: true,
        summary: false,
        experience: true,
        education: false,
        skills: true,
        projects: false
      },
      targetIndustry: 'software-engineering',
      strategy: 'experienced' as const
    };

    generationPreferences.set(newPrefs);

    const stored = localStorage.getItem('resume_generation_preferences');
    expect(stored).toBeTruthy();
    
    const parsed = JSON.parse(stored!);
    expect(parsed.targetIndustry).toBe('software-engineering');
    expect(parsed.strategy).toBe('experienced');
    expect(parsed.selectedSections.summary).toBe(false);
  });

  it('should update sections individually', () => {
    generationPreferences.updateSections({ personal: false, summary: false });

    const prefs = get(generationPreferences);
    expect(prefs.selectedSections.personal).toBe(false);
    expect(prefs.selectedSections.summary).toBe(false);
    expect(prefs.selectedSections.experience).toBe(true); // unchanged
  });

  it('should update industry', () => {
    generationPreferences.updateIndustry('data-science');

    const prefs = get(generationPreferences);
    expect(prefs.targetIndustry).toBe('data-science');
  });

  it('should update strategy', () => {
    generationPreferences.updateStrategy('first-time');

    const prefs = get(generationPreferences);
    expect(prefs.strategy).toBe('first-time');
  });

  it('should reset to defaults', () => {
    // Set some custom preferences
    generationPreferences.set({
      selectedSections: {
        personal: false,
        summary: false,
        experience: false,
        education: false,
        skills: false,
        projects: false
      },
      targetIndustry: 'marketing',
      strategy: 'career-change'
    });

    // Reset
    generationPreferences.reset();

    const prefs = get(generationPreferences);
    const defaults = getDefaultPreferences();
    expect(prefs).toEqual(defaults);
  });

  it('should clear preferences from localStorage', () => {
    // Set some preferences
    generationPreferences.set({
      selectedSections: {
        personal: true,
        summary: true,
        experience: true,
        education: true,
        skills: true,
        projects: true
      },
      targetIndustry: 'design',
      strategy: 'auto'
    });

    expect(localStorage.getItem('resume_generation_preferences')).toBeTruthy();

    // Clear
    generationPreferences.clear();

    expect(localStorage.getItem('resume_generation_preferences')).toBeNull();
    
    const prefs = get(generationPreferences);
    const defaults = getDefaultPreferences();
    expect(prefs).toEqual(defaults);
  });

  it('should persist preferences across store recreations', () => {
    // Set preferences
    const customPrefs = {
      selectedSections: {
        personal: true,
        summary: false,
        experience: true,
        education: true,
        skills: false,
        projects: true
      },
      targetIndustry: 'healthcare',
      strategy: 'experienced' as const
    };

    generationPreferences.set(customPrefs);

    // Simulate page reload by checking localStorage directly
    const stored = localStorage.getItem('resume_generation_preferences');
    const parsed = JSON.parse(stored!);

    expect(parsed.targetIndustry).toBe('healthcare');
    expect(parsed.strategy).toBe('experienced');
    expect(parsed.selectedSections.summary).toBe(false);
    expect(parsed.selectedSections.skills).toBe(false);
  });
});
