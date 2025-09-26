/**
 * User Settings Store - Manages user preferences and settings
 * Integrates with PocketBase user_settings collection
 */

import { writable, derived, get } from 'svelte/store';
import { pb } from '$lib/pocketbase';
import { currentUser } from './auth';

// Type definitions matching PocketBase collection structure
export interface EmailNotifications {
  resume_tips: boolean;
  new_templates: boolean;
  weekly_digest: boolean;
  achievement_updates: boolean;
  marketing_emails: boolean;
}

export interface TemplatePreferences {
  preferred_categories: string[];
  favorite_templates: string[];
  template_usage_history: Record<string, number>;
  last_used_template: string | null;
  auto_recommend: boolean;
  show_premium_templates: boolean;
}

export interface BuilderPreferences {
  auto_save_interval: number;
  auto_populate_from_profile: boolean;
  skip_completed_steps: boolean;
  default_color_scheme: string;
  show_tips: boolean;
  compact_mode: boolean;
  step_completion_tracking: boolean;
  preview_mode: 'side' | 'overlay' | 'fullscreen';
}

export interface PersonalizationSettings {
  ai_suggestions_enabled: boolean;
  content_personalization_level: 'basic' | 'enhanced' | 'full';
  industry_specific_tips: boolean;
  experience_level_guidance: boolean;
  smart_content_suggestions: boolean;
  auto_skill_suggestions: boolean;
  personalized_templates: boolean;
}

export interface PrivacySettings {
  default_resume_privacy: 'private' | 'public' | 'unlisted';
  allow_template_recommendations: boolean;
  share_usage_data: boolean;
  allow_analytics_tracking: boolean;
}

export interface NotificationSettings {
  in_app_notifications: {
    auto_save_confirmations: boolean;
    completion_reminders: boolean;
    tip_suggestions: boolean;
    feature_announcements: boolean;
  };
  push_notifications: {
    enabled: boolean;
    resume_updates: boolean;
    weekly_tips: boolean;
  };
}

export interface UIPreferences {
  theme: 'light' | 'dark' | 'auto';
  dashboard_layout: 'grid' | 'list' | 'compact';
  sidebar_collapsed: boolean;
  show_progress_indicators: boolean;
  animation_enabled: boolean;
  font_size: 'small' | 'medium' | 'large';
}

export interface UserSettings {
  id?: string;
  user: string;
  email_notifications: EmailNotifications;
  analytics_enabled: boolean;
  public_profile: boolean;
  template_preferences: TemplatePreferences;
  builder_preferences: BuilderPreferences;
  personalization_settings: PersonalizationSettings;
  privacy_settings: PrivacySettings;
  notification_settings: NotificationSettings;
  ui_preferences: UIPreferences;
  created?: string;
  updated?: string;
}

// Default settings that match the collection structure
export const defaultSettings: Omit<UserSettings, 'id' | 'user' | 'created' | 'updated'> = {
  email_notifications: {
    resume_tips: true,
    new_templates: false,
    weekly_digest: true,
    achievement_updates: true,
    marketing_emails: false
  },
  analytics_enabled: true,
  public_profile: false,
  template_preferences: {
    preferred_categories: ['modern', 'professional'],
    favorite_templates: [],
    template_usage_history: {},
    last_used_template: null,
    auto_recommend: true,
    show_premium_templates: true
  },
  builder_preferences: {
    auto_save_interval: 30,
    auto_populate_from_profile: true,
    skip_completed_steps: false,
    default_color_scheme: 'blue',
    show_tips: true,
    compact_mode: false,
    step_completion_tracking: true,
    preview_mode: 'side'
  },
  personalization_settings: {
    ai_suggestions_enabled: true,
    content_personalization_level: 'enhanced',
    industry_specific_tips: true,
    experience_level_guidance: true,
    smart_content_suggestions: true,
    auto_skill_suggestions: true,
    personalized_templates: true
  },
  privacy_settings: {
    default_resume_privacy: 'private',
    allow_template_recommendations: true,
    share_usage_data: false,
    allow_analytics_tracking: true
  },
  notification_settings: {
    in_app_notifications: {
      auto_save_confirmations: true,
      completion_reminders: true,
      tip_suggestions: true,
      feature_announcements: false
    },
    push_notifications: {
      enabled: false,
      resume_updates: false,
      weekly_tips: false
    }
  },
  ui_preferences: {
    theme: 'light',
    dashboard_layout: 'grid',
    sidebar_collapsed: false,
    show_progress_indicators: true,
    animation_enabled: true,
    font_size: 'medium'
  }
};

// Stores
export const userSettings = writable<UserSettings | null>(null);
export const isLoadingSettings = writable(false);
export const settingsError = writable<string | null>(null);

// Derived stores for easy access to specific settings
export const builderPreferences = derived(userSettings, ($settings) => 
  $settings?.builder_preferences || defaultSettings.builder_preferences
);

export const templatePreferences = derived(userSettings, ($settings) => 
  $settings?.template_preferences || defaultSettings.template_preferences
);

export const personalizationSettings = derived(userSettings, ($settings) => 
  $settings?.personalization_settings || defaultSettings.personalization_settings
);

export const uiPreferences = derived(userSettings, ($settings) => 
  $settings?.ui_preferences || defaultSettings.ui_preferences
);

// Settings management functions
export const userSettingsStore = {
  // Load user settings
  async loadSettings(userId?: string): Promise<UserSettings | null> {
    isLoadingSettings.set(true);
    settingsError.set(null);
    
    try {
      const targetUserId = userId || pb.authStore.model?.id;
      if (!targetUserId) {
        throw new Error('No user ID provided');
      }
      
      console.log('🔄 Loading user settings for:', targetUserId);
      
      const settings = await pb.collection('user_settings').getFullList({
        filter: `user = "${targetUserId}"`
      });
      
      if (settings.length === 0) {
        console.log('📝 No settings found, creating default settings');
        return await this.createDefaultSettings(targetUserId);
      }
      
      const userSettingsData = settings[0] as UserSettings;
      console.log('✅ User settings loaded:', userSettingsData.id);
      
      userSettings.set(userSettingsData);
      return userSettingsData;
      
    } catch (error: any) {
      console.error('❌ Error loading user settings:', error);
      settingsError.set(error.message || 'Failed to load settings');
      
      // If collection doesn't exist, that's expected during development
      if (error.status === 404) {
        console.warn('⚠️ user_settings collection not found');
        settingsError.set('Settings system not yet set up');
      }
      
      return null;
    } finally {
      isLoadingSettings.set(false);
    }
  },
  
  // Create default settings for new user
  async createDefaultSettings(userId: string): Promise<UserSettings | null> {
    try {
      console.log('🆕 Creating default settings for user:', userId);
      
      const newSettings = await pb.collection('user_settings').create({
        user: userId,
        ...defaultSettings
      });
      
      console.log('✅ Default settings created:', newSettings.id);
      userSettings.set(newSettings);
      return newSettings;
      
    } catch (error: any) {
      console.error('❌ Error creating default settings:', error);
      settingsError.set(error.message || 'Failed to create settings');
      return null;
    }
  },
  
  // Update entire settings object
  async updateSettings(settingsData: Partial<UserSettings>): Promise<boolean> {
    try {
      const currentSettings = get(userSettings);
      if (!currentSettings?.id) {
        console.error('No current settings to update');
        return false;
      }
      
      console.log('🔄 Updating settings:', currentSettings.id);
      
      const updatedSettings = await pb.collection('user_settings').update(currentSettings.id, settingsData);
      
      console.log('✅ Settings updated successfully');
      userSettings.set(updatedSettings);
      return true;
      
    } catch (error: any) {
      console.error('❌ Error updating settings:', error);
      settingsError.set(error.message || 'Failed to update settings');
      return false;
    }
  },
  
  // Update specific setting category
  async updateSettingCategory(category: keyof UserSettings, data: any): Promise<boolean> {
    try {
      const currentSettings = get(userSettings);
      if (!currentSettings?.id) {
        console.error('No current settings to update');
        return false;
      }
      
      console.log('🔄 Updating setting category:', category);
      
      const updatedSettings = await pb.collection('user_settings').update(currentSettings.id, {
        [category]: data
      });
      
      console.log('✅ Setting category updated:', category);
      userSettings.set(updatedSettings);
      return true;
      
    } catch (error: any) {
      console.error('❌ Error updating setting category:', error);
      settingsError.set(error.message || 'Failed to update setting');
      return false;
    }
  },
  
  // Update individual preference within a category
  async updatePreference(category: keyof UserSettings, key: string, value: any): Promise<boolean> {
    try {
      const currentSettings = get(userSettings);
      if (!currentSettings) {
        console.error('No current settings to update');
        return false;
      }
      
      // Handle nested object updates
      const categoryData = currentSettings[category] as any;
      const updatedCategoryData = {
        ...categoryData,
        [key]: value
      };
      
      return await this.updateSettingCategory(category, updatedCategoryData);
      
    } catch (error: any) {
      console.error('❌ Error updating preference:', error);
      settingsError.set(error.message || 'Failed to update preference');
      return false;
    }
  },
  
  // Update nested preference (e.g., notification_settings.in_app_notifications.auto_save_confirmations)
  async updateNestedPreference(category: keyof UserSettings, nestedKey: string, key: string, value: any): Promise<boolean> {
    try {
      const currentSettings = get(userSettings);
      if (!currentSettings) {
        console.error('No current settings to update');
        return false;
      }
      
      const categoryData = currentSettings[category] as any;
      const nestedData = categoryData[nestedKey] || {};
      
      const updatedCategoryData = {
        ...categoryData,
        [nestedKey]: {
          ...nestedData,
          [key]: value
        }
      };
      
      return await this.updateSettingCategory(category, updatedCategoryData);
      
    } catch (error: any) {
      console.error('❌ Error updating nested preference:', error);
      settingsError.set(error.message || 'Failed to update nested preference');
      return false;
    }
  },
  
  // Track template usage
  async trackTemplateUsage(templateId: string): Promise<boolean> {
    try {
      const currentSettings = get(userSettings);
      if (!currentSettings) return false;
      
      const currentHistory = currentSettings.template_preferences.template_usage_history || {};
      const updatedHistory = {
        ...currentHistory,
        [templateId]: (currentHistory[templateId] || 0) + 1
      };
      
      const updatedPreferences = {
        ...currentSettings.template_preferences,
        template_usage_history: updatedHistory,
        last_used_template: templateId
      };
      
      return await this.updateSettingCategory('template_preferences', updatedPreferences);
      
    } catch (error: any) {
      console.error('❌ Error tracking template usage:', error);
      return false;
    }
  },
  
  // Add template to favorites
  async toggleTemplateFavorite(templateId: string): Promise<boolean> {
    try {
      const currentSettings = get(userSettings);
      if (!currentSettings) return false;
      
      const currentFavorites = currentSettings.template_preferences.favorite_templates || [];
      const isFavorite = currentFavorites.includes(templateId);
      
      const updatedFavorites = isFavorite
        ? currentFavorites.filter(id => id !== templateId)
        : [...currentFavorites, templateId];
      
      const updatedPreferences = {
        ...currentSettings.template_preferences,
        favorite_templates: updatedFavorites
      };
      
      return await this.updateSettingCategory('template_preferences', updatedPreferences);
      
    } catch (error: any) {
      console.error('❌ Error toggling template favorite:', error);
      return false;
    }
  },
  
  // Reset settings to defaults
  async resetSettings(): Promise<boolean> {
    try {
      const currentSettings = get(userSettings);
      if (!currentSettings?.id) return false;
      
      console.log('🔄 Resetting settings to defaults');
      
      const resetData = {
        ...defaultSettings,
        user: currentSettings.user // Preserve user relation
      };
      
      return await this.updateSettings(resetData);
      
    } catch (error: any) {
      console.error('❌ Error resetting settings:', error);
      return false;
    }
  }
};

// Auto-load settings when user changes
currentUser.subscribe(async (user) => {
  if (user) {
    console.log('👤 User changed, loading settings for:', user.email);
    await userSettingsStore.loadSettings(user.id);
  } else {
    console.log('👤 User logged out, clearing settings');
    userSettings.set(null);
    settingsError.set(null);
  }
});

// Export convenience functions
export const getBuilderPreferences = () => get(builderPreferences);
export const getTemplatePreferences = () => get(templatePreferences);
export const getPersonalizationSettings = () => get(personalizationSettings);
export const getUIPreferences = () => get(uiPreferences);