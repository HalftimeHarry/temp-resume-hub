# User Settings Integration Test Plan

## Overview
Test the complete user settings integration with the existing PocketBase collection and frontend stores.

## Test Scenarios

### 1. Settings Creation and Loading
**Test**: New user settings creation
- ✅ User logs in for the first time
- ✅ Default settings are automatically created
- ✅ Settings are loaded and available in stores

**Expected Behavior**:
```javascript
// When user logs in, settings should be created with defaults
{
  email_notifications: { resume_tips: true, new_templates: false, ... },
  analytics_enabled: true,
  public_profile: false,
  template_preferences: { preferred_categories: ['modern', 'professional'], ... },
  builder_preferences: { auto_populate_from_profile: true, ... },
  // ... other default settings
}
```

### 2. Settings CRUD Operations
**Test**: Update individual settings
- ✅ Change builder preferences (auto_populate_from_profile: false)
- ✅ Update template preferences (add 'creative' to preferred_categories)
- ✅ Modify notification settings
- ✅ Verify changes persist in PocketBase

**Test**: Nested settings updates
- ✅ Update email_notifications.resume_tips
- ✅ Update notification_settings.in_app_notifications.auto_save_confirmations
- ✅ Verify nested updates work correctly

### 3. Template Integration
**Test**: Template recommendations based on profile and settings
- ✅ User has profile with target_industry: 'technology'
- ✅ User has template_preferences.preferred_categories: ['modern']
- ✅ Recommended templates should prioritize modern tech templates
- ✅ Template usage tracking should work

**Test**: Template favorites
- ✅ User can favorite/unfavorite templates
- ✅ Favorite templates appear in favoriteTemplates store
- ✅ Changes persist across sessions

### 4. Builder Integration
**Test**: Builder preferences affect builder behavior
- ✅ auto_populate_from_profile: true should pre-fill data
- ✅ skip_completed_steps: true should skip completed sections
- ✅ default_color_scheme should be applied
- ✅ show_tips should control tip visibility

### 5. UI Integration
**Test**: Settings panel functionality
- ✅ All settings categories load correctly
- ✅ Settings can be updated through UI
- ✅ Changes are saved automatically
- ✅ Reset to defaults works
- ✅ Unsaved changes indicator works

## Manual Testing Steps

### Step 1: Fresh User Registration
1. Register a new user account
2. Check browser console for settings creation logs
3. Navigate to `/settings` page
4. Verify all default settings are displayed

### Step 2: Settings Modification
1. Change builder preferences:
   - Toggle "Auto-populate from profile"
   - Change default color scheme
   - Modify auto-save interval
2. Change template preferences:
   - Add/remove preferred categories
   - Toggle auto-recommend
3. Update notification settings:
   - Toggle email notifications
   - Change in-app notification preferences
4. Verify changes are saved (check "All settings saved" badge)

### Step 3: Template Recommendations
1. Complete user profile with specific industry/experience
2. Go to templates page
3. Verify recommended templates appear first
4. Favorite a template and verify it appears in favorites
5. Use a template and verify usage tracking

### Step 4: Builder Integration
1. Go to resume builder
2. Select a template
3. Verify profile data is auto-populated (if enabled)
4. Check that color scheme matches settings
5. Verify tips are shown/hidden based on settings

### Step 5: Persistence Testing
1. Make settings changes
2. Log out and log back in
3. Verify all settings are preserved
4. Check that template favorites and usage history persist

## Expected Database Structure

### PocketBase user_settings Record
```json
{
  "id": "generated_id",
  "user": "user_relation_id",
  "email_notifications": {
    "resume_tips": true,
    "new_templates": false,
    "weekly_digest": true,
    "achievement_updates": true,
    "marketing_emails": false
  },
  "analytics_enabled": true,
  "public_profile": false,
  "template_preferences": {
    "preferred_categories": ["modern", "professional"],
    "favorite_templates": ["template_id_1", "template_id_2"],
    "template_usage_history": {
      "template_id_1": 3,
      "template_id_2": 1
    },
    "last_used_template": "template_id_1",
    "auto_recommend": true,
    "show_premium_templates": true
  },
  "builder_preferences": {
    "auto_save_interval": 30,
    "auto_populate_from_profile": true,
    "skip_completed_steps": false,
    "default_color_scheme": "blue",
    "show_tips": true,
    "compact_mode": false,
    "step_completion_tracking": true,
    "preview_mode": "side"
  },
  "personalization_settings": {
    "ai_suggestions_enabled": true,
    "content_personalization_level": "enhanced",
    "industry_specific_tips": true,
    "experience_level_guidance": true,
    "smart_content_suggestions": true,
    "auto_skill_suggestions": true,
    "personalized_templates": true
  },
  "privacy_settings": {
    "default_resume_privacy": "private",
    "allow_template_recommendations": true,
    "share_usage_data": false,
    "allow_analytics_tracking": true
  },
  "notification_settings": {
    "in_app_notifications": {
      "auto_save_confirmations": true,
      "completion_reminders": true,
      "tip_suggestions": true,
      "feature_announcements": false
    },
    "push_notifications": {
      "enabled": false,
      "resume_updates": false,
      "weekly_tips": false
    }
  },
  "ui_preferences": {
    "theme": "light",
    "dashboard_layout": "grid",
    "sidebar_collapsed": false,
    "show_progress_indicators": true,
    "animation_enabled": true,
    "font_size": "medium"
  },
  "created": "2025-09-26T18:00:00.000Z",
  "updated": "2025-09-26T18:30:00.000Z"
}
```

## Console Debugging

### Check Settings Loading
```javascript
// In browser console
console.log('User Settings:', $userSettings);
console.log('Builder Preferences:', $builderPreferences);
console.log('Template Preferences:', $templatePreferences);
```

### Test Settings Updates
```javascript
// Test updating a setting
await userSettingsStore.updatePreference('builder_preferences', 'auto_populate_from_profile', false);

// Test nested update
await userSettingsStore.updateNestedPreference('notification_settings', 'in_app_notifications', 'auto_save_confirmations', false);

// Test template tracking
await userSettingsStore.trackTemplateUsage('template_id_123');
```

### Verify Template Recommendations
```javascript
// Check recommended templates
console.log('Recommended Templates:', $recommendedTemplates);
console.log('Favorite Templates:', $favoriteTemplates);
console.log('Recent Templates:', $recentTemplates);
```

## Success Criteria

### ✅ Settings Management
- [ ] Default settings created for new users
- [ ] All CRUD operations work correctly
- [ ] Nested settings updates work
- [ ] Settings persist across sessions
- [ ] Reset to defaults works

### ✅ Template Integration
- [ ] Template recommendations based on profile
- [ ] Favorite templates functionality
- [ ] Usage tracking works
- [ ] Recommendations improve over time

### ✅ Builder Integration
- [ ] Builder respects user preferences
- [ ] Auto-population works when enabled
- [ ] Color scheme is applied
- [ ] Tips shown/hidden based on settings

### ✅ UI/UX
- [ ] Settings panel loads correctly
- [ ] All settings can be modified
- [ ] Changes are saved automatically
- [ ] User feedback is clear and helpful

### ✅ Performance
- [ ] Settings load quickly
- [ ] Updates are responsive
- [ ] No unnecessary API calls
- [ ] Proper error handling

## Troubleshooting

### Common Issues
1. **Settings not loading**: Check PocketBase collection exists and has proper rules
2. **Updates not saving**: Verify user authentication and permissions
3. **Recommendations not working**: Check profile completion and template data
4. **UI not updating**: Verify store subscriptions and reactivity

### Debug Commands
```javascript
// Check auth state
console.log('Auth:', pb.authStore.isValid, pb.authStore.model);

// Check settings store state
console.log('Settings Store:', get(userSettings));

// Check profile store state
console.log('Profile Store:', get(userProfile));

// Test settings operations
await userSettingsStore.loadSettings();
await userSettingsStore.resetSettings();
```

This comprehensive test plan ensures the user settings integration works correctly and provides the expected personalization features.