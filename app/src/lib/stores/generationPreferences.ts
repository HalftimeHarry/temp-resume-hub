import { writable } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * User's preferred generation options for resume generation
 */
export interface GenerationPreferences {
  selectedSections: {
    personal: boolean;
    summary: boolean;
    experience: boolean;
    education: boolean;
    skills: boolean;
    projects: boolean;
  };
  targetIndustry: string;
  strategy: 'auto' | 'experienced' | 'first-time' | 'career-change' | '';
  keywordIntensity: 'light' | 'moderate' | 'aggressive';
}

/**
 * Default generation preferences
 */
const defaultPreferences: GenerationPreferences = {
  selectedSections: {
    personal: true,
    summary: true,
    experience: true,
    education: true,
    skills: true,
    projects: true
  },
  targetIndustry: '',
  strategy: '',
  keywordIntensity: 'moderate'
};

const STORAGE_KEY = 'resume_generation_preferences';

/**
 * Load preferences from localStorage
 */
function loadPreferences(): GenerationPreferences {
  if (!browser) {
    return defaultPreferences;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to handle any missing fields
      return {
        ...defaultPreferences,
        ...parsed,
        selectedSections: {
          ...defaultPreferences.selectedSections,
          ...(parsed.selectedSections || {})
        }
      };
    }
  } catch (error) {
    console.error('Failed to load generation preferences:', error);
  }

  return defaultPreferences;
}

/**
 * Save preferences to localStorage
 */
function savePreferences(preferences: GenerationPreferences): void {
  if (!browser) {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save generation preferences:', error);
  }
}

/**
 * Clear preferences from localStorage
 */
function clearStoredPreferences(): void {
  if (!browser) {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear generation preferences:', error);
  }
}

// Create the store with initial values from localStorage
const { subscribe, set, update } = writable<GenerationPreferences>(loadPreferences());

/**
 * Generation preferences store
 */
export const generationPreferences = {
  subscribe,
  
  /**
   * Update preferences and save to localStorage
   */
  set: (preferences: GenerationPreferences) => {
    set(preferences);
    savePreferences(preferences);
  },
  
  /**
   * Update preferences partially and save to localStorage
   */
  update: (updater: (prefs: GenerationPreferences) => GenerationPreferences) => {
    update((prefs) => {
      const updated = updater(prefs);
      savePreferences(updated);
      return updated;
    });
  },
  
  /**
   * Reset preferences to defaults
   */
  reset: () => {
    set(defaultPreferences);
    savePreferences(defaultPreferences);
  },
  
  /**
   * Clear preferences from localStorage and reset to defaults
   */
  clear: () => {
    clearStoredPreferences();
    set(defaultPreferences);
  },
  
  /**
   * Update selected sections
   */
  updateSections: (sections: Partial<GenerationPreferences['selectedSections']>) => {
    update((prefs) => {
      const updated = {
        ...prefs,
        selectedSections: {
          ...prefs.selectedSections,
          ...sections
        }
      };
      savePreferences(updated);
      return updated;
    });
  },
  
  /**
   * Update target industry
   */
  updateIndustry: (industry: string) => {
    update((prefs) => {
      const updated = { ...prefs, targetIndustry: industry };
      savePreferences(updated);
      return updated;
    });
  },
  
  /**
   * Update strategy
   */
  updateStrategy: (strategy: GenerationPreferences['strategy']) => {
    update((prefs) => {
      const updated = { ...prefs, strategy };
      savePreferences(updated);
      return updated;
    });
  },
  
  /**
   * Update keyword intensity
   */
  updateKeywordIntensity: (intensity: GenerationPreferences['keywordIntensity']) => {
    update((prefs) => {
      const updated = { ...prefs, keywordIntensity: intensity };
      savePreferences(updated);
      return updated;
    });
  }
};

/**
 * Get default preferences (useful for comparisons)
 */
export function getDefaultPreferences(): GenerationPreferences {
  return { ...defaultPreferences };
}
