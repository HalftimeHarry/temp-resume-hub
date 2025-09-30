# User Settings Collection Implementation Plan

## Overview
Implement a comprehensive user_settings collection to store user preferences, builder customizations, and personalization settings that enhance the resume building experience.

## Collection Schema Design

### PocketBase Collection: `user_settings`

```json
{
  "name": "user_settings",
  "type": "base",
  "system": false,
  "schema": [
    {
      "name": "user",
      "type": "relation",
      "required": true,
      "options": {
        "collectionId": "users",
        "cascadeDelete": true,
        "minSelect": 1,
        "maxSelect": 1
      }
    },
    {
      "name": "template_preferences",
      "type": "json",
      "required": false,
      "options": {}
    },
    {
      "name": "builder_preferences", 
      "type": "json",
      "required": false,
      "options": {}
    },
    {
      "name": "personalization_settings",
      "type": "json", 
      "required": false,
      "options": {}
    },
    {
      "name": "privacy_settings",
      "type": "json",
      "required": false,
      "options": {}
    },
    {
      "name": "notification_settings",
      "type": "json",
      "required": false,
      "options": {}
    },
    {
      "name": "ui_preferences",
      "type": "json",
      "required": false,
      "options": {}
    }
  ],
  "indexes": [
    "CREATE UNIQUE INDEX idx_user_settings_user ON user_settings (user)"
  ],
  "listRule": "user = @request.auth.id",
  "viewRule": "user = @request.auth.id", 
  "createRule": "user = @request.auth.id",
  "updateRule": "user = @request.auth.id",
  "deleteRule": "user = @request.auth.id"
}
```

## Default Settings Structure

### 1. Template Preferences
```json
{
  "preferred_categories": ["modern", "professional"],
  "favorite_templates": [],
  "template_usage_history": {},
  "last_used_template": null,
  "auto_recommend": true
}
```

### 2. Builder Preferences
```json
{
  "auto_save_interval": 30,
  "auto_populate_from_profile": true,
  "skip_completed_steps": false,
  "default_color_scheme": "blue",
  "show_tips": true,
  "compact_mode": false,
  "step_completion_tracking": true
}
```

### 3. Personalization Settings
```json
{
  "ai_suggestions_enabled": true,
  "content_personalization_level": "enhanced",
  "industry_specific_tips": true,
  "experience_level_guidance": true,
  "smart_content_suggestions": true,
  "auto_skill_suggestions": true
}
```

### 4. Privacy Settings
```json
{
  "default_resume_privacy": "private",
  "allow_template_recommendations": true,
  "analytics_enabled": true,
  "share_usage_data": false,
  "public_profile": false
}
```

### 5. Notification Settings
```json
{
  "email_notifications": {
    "resume_tips": true,
    "new_templates": false,
    "weekly_digest": true,
    "achievement_updates": true
  },
  "in_app_notifications": {
    "auto_save_confirmations": true,
    "completion_reminders": true,
    "tip_suggestions": true,
    "feature_announcements": false
  }
}
```

### 6. UI Preferences
```json
{
  "theme": "light",
  "dashboard_layout": "grid",
  "preview_mode": "side",
  "sidebar_collapsed": false,
  "show_progress_indicators": true,
  "animation_enabled": true
}
```

## Implementation Steps

### Step 1: Create Collection and Store
```typescript
// src/lib/stores/userSettings.ts
import { writable, derived } from 'svelte/store';
import { pb } from '$lib/pocketbase';
import { currentUser } from './auth';

export interface UserSettings {
  id?: string;
  user: string;
  template_preferences: TemplatePreferences;
  builder_preferences: BuilderPreferences;
  personalization_settings: PersonalizationSettings;
  privacy_settings: PrivacySettings;
  notification_settings: NotificationSettings;
  ui_preferences: UIPreferences;
  created?: string;
  updated?: string;
}

// Default settings
export const defaultSettings: Omit<UserSettings, 'id' | 'user' | 'created' | 'updated'> = {
  template_preferences: {
    preferred_categories: ["modern", "professional"],
    favorite_templates: [],
    template_usage_history: {},
    last_used_template: null,
    auto_recommend: true
  },
  builder_preferences: {
    auto_save_interval: 30,
    auto_populate_from_profile: true,
    skip_completed_steps: false,
    default_color_scheme: "blue",
    show_tips: true,
    compact_mode: false,
    step_completion_tracking: true
  },
  personalization_settings: {
    ai_suggestions_enabled: true,
    content_personalization_level: "enhanced",
    industry_specific_tips: true,
    experience_level_guidance: true,
    smart_content_suggestions: true,
    auto_skill_suggestions: true
  },
  privacy_settings: {
    default_resume_privacy: "private",
    allow_template_recommendations: true,
    analytics_enabled: true,
    share_usage_data: false,
    public_profile: false
  },
  notification_settings: {
    email_notifications: {
      resume_tips: true,
      new_templates: false,
      weekly_digest: true,
      achievement_updates: true
    },
    in_app_notifications: {
      auto_save_confirmations: true,
      completion_reminders: true,
      tip_suggestions: true,
      feature_announcements: false
    }
  },
  ui_preferences: {
    theme: "light",
    dashboard_layout: "grid", 
    preview_mode: "side",
    sidebar_collapsed: false,
    show_progress_indicators: true,
    animation_enabled: true
  }
};

export const userSettings = writable<UserSettings | null>(null);
export const isLoadingSettings = writable(false);
```

### Step 2: Settings Management Functions
```typescript
export const userSettingsStore = {
  // Load user settings
  async loadSettings(userId?: string): Promise<UserSettings | null> {
    isLoadingSettings.set(true);
    
    try {
      const targetUserId = userId || pb.authStore.model?.id;
      if (!targetUserId) return null;
      
      const settings = await pb.collection('user_settings').getFullList({
        filter: `user = "${targetUserId}"`
      });
      
      if (settings.length === 0) {
        // Create default settings for new user
        return await this.createDefaultSettings(targetUserId);
      }
      
      const userSettingsData = settings[0] as UserSettings;
      userSettings.set(userSettingsData);
      return userSettingsData;
      
    } catch (error) {
      console.error('Failed to load user settings:', error);
      return null;
    } finally {
      isLoadingSettings.set(false);
    }
  },
  
  // Create default settings
  async createDefaultSettings(userId: string): Promise<UserSettings | null> {
    try {
      const newSettings = await pb.collection('user_settings').create({
        user: userId,
        ...defaultSettings
      });
      
      userSettings.set(newSettings);
      return newSettings;
    } catch (error) {
      console.error('Failed to create default settings:', error);
      return null;
    }
  },
  
  // Update specific setting category
  async updateSettings(category: keyof UserSettings, data: any): Promise<boolean> {
    try {
      const currentSettings = get(userSettings);
      if (!currentSettings) return false;
      
      const updatedSettings = await pb.collection('user_settings').update(currentSettings.id!, {
        [category]: data
      });
      
      userSettings.set(updatedSettings);
      return true;
    } catch (error) {
      console.error('Failed to update settings:', error);
      return false;
    }
  },
  
  // Update individual preference
  async updatePreference(category: string, key: string, value: any): Promise<boolean> {
    try {
      const currentSettings = get(userSettings);
      if (!currentSettings) return false;
      
      const categoryData = currentSettings[category as keyof UserSettings] as any;
      const updatedCategoryData = {
        ...categoryData,
        [key]: value
      };
      
      return await this.updateSettings(category as keyof UserSettings, updatedCategoryData);
    } catch (error) {
      console.error('Failed to update preference:', error);
      return false;
    }
  }
};

// Auto-load settings when user changes
currentUser.subscribe(async (user) => {
  if (user) {
    await userSettingsStore.loadSettings(user.id);
  } else {
    userSettings.set(null);
  }
});
```

### Step 3: Integration with Builder
```typescript
// src/lib/stores/resumeBuilder.ts - Enhanced with settings integration

import { userSettings } from './userSettings';

// Enhanced builder initialization
export const initializeBuilder = async () => {
  const settings = get(userSettings);
  
  if (settings?.builder_preferences.auto_populate_from_profile) {
    await populateFromProfile();
  }
  
  if (settings?.builder_preferences.skip_completed_steps) {
    skipCompletedSteps();
  }
  
  // Set default color scheme
  if (settings?.builder_preferences.default_color_scheme) {
    updateSettings({
      colorScheme: settings.builder_preferences.default_color_scheme
    });
  }
};

// Smart template recommendations based on settings
export const getRecommendedTemplates = (templates: Template[]) => {
  const settings = get(userSettings);
  const profile = get(userProfile);
  
  if (!settings?.template_preferences.auto_recommend) {
    return templates;
  }
  
  // Filter by preferred categories
  let filtered = templates;
  if (settings.template_preferences.preferred_categories.length > 0) {
    filtered = filtered.filter(t => 
      settings.template_preferences.preferred_categories.includes(t.category)
    );
  }
  
  // Sort by usage history and profile match
  return filtered.sort((a, b) => {
    const aScore = calculateTemplateScore(a, profile, settings);
    const bScore = calculateTemplateScore(b, profile, settings);
    return bScore - aScore;
  });
};
```

### Step 4: Settings UI Components
```svelte
<!-- src/lib/components/settings/SettingsPanel.svelte -->
<script lang="ts">
  import { userSettings, userSettingsStore } from '$lib/stores/userSettings';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Switch } from '$lib/components/ui/switch';
  import { Select } from '$lib/components/ui/select';
  
  async function updateSetting(category: string, key: string, value: any) {
    await userSettingsStore.updatePreference(category, key, value);
  }
</script>

{#if $userSettings}
  <div class="space-y-6">
    <!-- Builder Preferences -->
    <Card>
      <CardHeader>
        <CardTitle>Builder Preferences</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex items-center justify-between">
          <label>Auto-populate from profile</label>
          <Switch 
            checked={$userSettings.builder_preferences.auto_populate_from_profile}
            on:change={(e) => updateSetting('builder_preferences', 'auto_populate_from_profile', e.detail)}
          />
        </div>
        
        <div class="flex items-center justify-between">
          <label>Skip completed steps</label>
          <Switch 
            checked={$userSettings.builder_preferences.skip_completed_steps}
            on:change={(e) => updateSetting('builder_preferences', 'skip_completed_steps', e.detail)}
          />
        </div>
        
        <div class="flex items-center justify-between">
          <label>Default color scheme</label>
          <Select 
            value={$userSettings.builder_preferences.default_color_scheme}
            on:change={(e) => updateSetting('builder_preferences', 'default_color_scheme', e.detail)}
          >
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="purple">Purple</option>
            <option value="orange">Orange</option>
          </Select>
        </div>
      </CardContent>
    </Card>
    
    <!-- Personalization Settings -->
    <Card>
      <CardHeader>
        <CardTitle>Personalization</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex items-center justify-between">
          <label>AI suggestions</label>
          <Switch 
            checked={$userSettings.personalization_settings.ai_suggestions_enabled}
            on:change={(e) => updateSetting('personalization_settings', 'ai_suggestions_enabled', e.detail)}
          />
        </div>
        
        <div class="flex items-center justify-between">
          <label>Industry-specific tips</label>
          <Switch 
            checked={$userSettings.personalization_settings.industry_specific_tips}
            on:change={(e) => updateSetting('personalization_settings', 'industry_specific_tips', e.detail)}
          />
        </div>
      </CardContent>
    </Card>
  </div>
{/if}
```

## Integration Points

### 1. Dashboard Integration
- Show settings completion status
- Quick access to key preferences
- Settings recommendations based on usage

### 2. Builder Integration  
- Apply preferences during builder initialization
- Dynamic UI adjustments based on settings
- Smart defaults and suggestions

### 3. Template System Integration
- Filter templates by preferences
- Track usage for better recommendations
- Personalized template suggestions

### 4. Profile Integration
- Sync settings with profile completion
- Auto-enable features based on profile data
- Cross-reference for better personalization

## Migration Strategy

### Phase 1: Basic Implementation
1. Create user_settings collection
2. Implement basic store and CRUD operations
3. Add default settings creation for new users

### Phase 2: Builder Integration
1. Integrate settings with resume builder
2. Add auto-population and smart defaults
3. Implement preference-based UI adjustments

### Phase 3: Advanced Features
1. Add AI-powered recommendations
2. Implement usage tracking and analytics
3. Create advanced personalization features

### Phase 4: UI Enhancement
1. Build comprehensive settings panel
2. Add onboarding for settings
3. Implement settings import/export

## Expected Benefits

1. **Personalized Experience**: Tailored builder flow based on user preferences
2. **Improved Efficiency**: Smart defaults and auto-population save time
3. **Better Recommendations**: Usage data improves template suggestions
4. **User Retention**: Customizable experience increases engagement
5. **Data Insights**: Settings data provides valuable user behavior insights

This implementation will create a robust foundation for user personalization and significantly enhance the resume building experience.