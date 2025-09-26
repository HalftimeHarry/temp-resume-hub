<!--
  Settings Panel Component
  Comprehensive settings management interface
-->

<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    userSettings, 
    userSettingsStore, 
    isLoadingSettings,
    settingsError,
    type UserSettings 
  } from '$lib/stores/userSettings';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Switch } from '$lib/components/ui/switch';
  import { Badge } from '$lib/components/ui/badge';
  import { Separator } from '$lib/components/ui/separator';
  import { 
    Settings, 
    Palette, 
    Bell, 
    Shield, 
    Sparkles, 
    Layout, 
    Save,
    RotateCcw,
    CheckCircle,
    AlertCircle,
    ArrowLeft
  } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';

  let activeTab = 'builder';
  let hasUnsavedChanges = false;
  let isSaving = false;

  // Track changes to show save indicator
  $: if ($userSettings) {
    // Reset unsaved changes flag when settings load
    hasUnsavedChanges = false;
  }

  async function updateSetting(category: keyof UserSettings, key: string, value: any) {
    hasUnsavedChanges = true;
    const success = await userSettingsStore.updatePreference(category, key, value);
    
    if (success) {
      hasUnsavedChanges = false;
      toast.success('Setting updated successfully');
    } else {
      toast.error('Failed to update setting');
    }
  }

  async function updateNestedSetting(category: keyof UserSettings, nestedKey: string, key: string, value: any) {
    hasUnsavedChanges = true;
    const success = await userSettingsStore.updateNestedPreference(category, nestedKey, key, value);
    
    if (success) {
      hasUnsavedChanges = false;
      toast.success('Setting updated successfully');
    } else {
      toast.error('Failed to update setting');
    }
  }

  async function resetAllSettings() {
    if (confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
      isSaving = true;
      const success = await userSettingsStore.resetSettings();
      
      if (success) {
        toast.success('Settings reset to defaults');
        hasUnsavedChanges = false;
      } else {
        toast.error('Failed to reset settings');
      }
      isSaving = false;
    }
  }

  const tabs = [
    { id: 'builder', label: 'Builder', icon: Settings },
    { id: 'templates', label: 'Templates', icon: Layout },
    { id: 'personalization', label: 'AI & Personalization', icon: Sparkles },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];
</script>

<div class="settings-panel max-w-4xl mx-auto p-6">
  <div class="mb-8">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          on:click={() => goto('/dashboard')}
          class="flex items-center gap-2"
        >
          <ArrowLeft class="h-4 w-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 class="text-3xl font-bold mb-2">Settings</h1>
          <p class="text-gray-600">Customize your resume building experience</p>
        </div>
      </div>
      
      {#if hasUnsavedChanges}
        <Badge variant="outline" class="bg-amber-50 text-amber-700 border-amber-200">
          <AlertCircle class="h-3 w-3 mr-1" />
          Unsaved changes
        </Badge>
      {:else if $userSettings}
        <Badge variant="outline" class="bg-green-50 text-green-700 border-green-200">
          <CheckCircle class="h-3 w-3 mr-1" />
          All settings saved
        </Badge>
      {/if}
    </div>
  </div>

  {#if $isLoadingSettings}
    <div class="text-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Loading your settings...</p>
    </div>
  {:else if $settingsError}
    <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <AlertCircle class="h-8 w-8 text-red-600 mx-auto mb-2" />
      <h3 class="font-medium text-red-900 mb-1">Settings Error</h3>
      <p class="text-red-700 text-sm">{$settingsError}</p>
    </div>
  {:else if $userSettings}
    <div class="settings-content">
      <!-- Settings Navigation -->
      <div class="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
      {#each tabs as tab}
        <button
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors {
            activeTab === tab.id 
              ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }"
          on:click={() => activeTab = tab.id}
        >
          <svelte:component this={tab.icon} class="h-4 w-4" />
          {tab.label}
        </button>
      {/each}
    </div>

    <!-- Settings Content -->
    <div class="space-y-6">
      
      <!-- Builder Preferences -->
      {#if activeTab === 'builder'}
        <Card>
          <CardHeader>
            <CardTitle>Builder Preferences</CardTitle>
            <CardDescription>Customize how the resume builder works for you</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex items-center justify-between">
                <div>
                  <Label class="text-sm font-medium">Auto-populate from profile</Label>
                  <p class="text-xs text-gray-500">Automatically fill resume fields from your profile</p>
                </div>
                <Switch 
                  checked={$userSettings.builder_preferences.auto_populate_from_profile}
                  onCheckedChange={(checked) => updateSetting('builder_preferences', 'auto_populate_from_profile', checked)}
                />
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <Label class="text-sm font-medium">Skip completed steps</Label>
                  <p class="text-xs text-gray-500">Skip steps that are already complete</p>
                </div>
                <Switch 
                  checked={$userSettings.builder_preferences.skip_completed_steps}
                  onCheckedChange={(checked) => updateSetting('builder_preferences', 'skip_completed_steps', checked)}
                />
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <Label class="text-sm font-medium">Show helpful tips</Label>
                  <p class="text-xs text-gray-500">Display guidance and tips while building</p>
                </div>
                <Switch 
                  checked={$userSettings.builder_preferences.show_tips}
                  onCheckedChange={(checked) => updateSetting('builder_preferences', 'show_tips', checked)}
                />
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <Label class="text-sm font-medium">Compact mode</Label>
                  <p class="text-xs text-gray-500">Use a more compact interface</p>
                </div>
                <Switch 
                  checked={$userSettings.builder_preferences.compact_mode}
                  onCheckedChange={(checked) => updateSetting('builder_preferences', 'compact_mode', checked)}
                />
              </div>
            </div>
            
            <Separator />
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label for="auto-save">Auto-save interval (seconds)</Label>
                <Input
                  id="auto-save"
                  type="number"
                  min="10"
                  max="300"
                  value={$userSettings.builder_preferences.auto_save_interval}
                  on:change={(e) => updateSetting('builder_preferences', 'auto_save_interval', parseInt(e.target.value))}
                  class="mt-1"
                />
              </div>
              
              <div>
                <Label for="color-scheme">Default color scheme</Label>
                <select
                  id="color-scheme"
                  value={$userSettings.builder_preferences.default_color_scheme}
                  on:change={(e) => updateSetting('builder_preferences', 'default_color_scheme', e.target.value)}
                  class="mt-1 w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="purple">Purple</option>
                  <option value="orange">Orange</option>
                  <option value="teal">Teal</option>
                  <option value="black">Black</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      {/if}

      <!-- Template Preferences -->
      {#if activeTab === 'templates'}
        <Card>
          <CardHeader>
            <CardTitle>Template Preferences</CardTitle>
            <CardDescription>Control how templates are recommended and displayed</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex items-center justify-between">
                <div>
                  <Label class="text-sm font-medium">Auto-recommend templates</Label>
                  <p class="text-xs text-gray-500">Show personalized template recommendations</p>
                </div>
                <Switch 
                  checked={$userSettings.template_preferences.auto_recommend}
                  onCheckedChange={(checked) => updateSetting('template_preferences', 'auto_recommend', checked)}
                />
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <Label class="text-sm font-medium">Show premium templates</Label>
                  <p class="text-xs text-gray-500">Include premium templates in recommendations</p>
                </div>
                <Switch 
                  checked={$userSettings.template_preferences.show_premium_templates}
                  onCheckedChange={(checked) => updateSetting('template_preferences', 'show_premium_templates', checked)}
                />
              </div>
            </div>
            
            <div>
              <Label>Preferred Categories</Label>
              <p class="text-xs text-gray-500 mb-2">Select your preferred template styles</p>
              <div class="flex flex-wrap gap-2">
                {#each ['modern', 'professional', 'creative', 'minimal', 'classic', 'bold'] as category}
                  <button
                    class="px-3 py-1 text-sm rounded-full border transition-colors {
                      $userSettings.template_preferences.preferred_categories.includes(category)
                        ? 'bg-blue-100 border-blue-300 text-blue-700'
                        : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                    }"
                    on:click={() => {
                      const current = $userSettings.template_preferences.preferred_categories;
                      const updated = current.includes(category)
                        ? current.filter(c => c !== category)
                        : [...current, category];
                      updateSetting('template_preferences', 'preferred_categories', updated);
                    }}
                  >
                    {category}
                  </button>
                {/each}
              </div>
            </div>
          </CardContent>
        </Card>
      {/if}

      <!-- Personalization Settings -->
      {#if activeTab === 'personalization'}
        <Card>
          <CardHeader>
            <CardTitle>AI & Personalization</CardTitle>
            <CardDescription>Control AI features and content personalization</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex items-center justify-between">
                <div>
                  <Label class="text-sm font-medium">AI suggestions</Label>
                  <p class="text-xs text-gray-500">Enable AI-powered content suggestions</p>
                </div>
                <Switch 
                  checked={$userSettings.personalization_settings.ai_suggestions_enabled}
                  onCheckedChange={(checked) => updateSetting('personalization_settings', 'ai_suggestions_enabled', checked)}
                />
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <Label class="text-sm font-medium">Industry-specific tips</Label>
                  <p class="text-xs text-gray-500">Show tips tailored to your industry</p>
                </div>
                <Switch 
                  checked={$userSettings.personalization_settings.industry_specific_tips}
                  onCheckedChange={(checked) => updateSetting('personalization_settings', 'industry_specific_tips', checked)}
                />
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <Label class="text-sm font-medium">Experience level guidance</Label>
                  <p class="text-xs text-gray-500">Guidance based on your experience level</p>
                </div>
                <Switch 
                  checked={$userSettings.personalization_settings.experience_level_guidance}
                  onCheckedChange={(checked) => updateSetting('personalization_settings', 'experience_level_guidance', checked)}
                />
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <Label class="text-sm font-medium">Smart content suggestions</Label>
                  <p class="text-xs text-gray-500">AI-powered content improvements</p>
                </div>
                <Switch 
                  checked={$userSettings.personalization_settings.smart_content_suggestions}
                  onCheckedChange={(checked) => updateSetting('personalization_settings', 'smart_content_suggestions', checked)}
                />
              </div>
            </div>
            
            <div>
              <Label for="personalization-level">Content personalization level</Label>
              <select
                id="personalization-level"
                value={$userSettings.personalization_settings.content_personalization_level}
                on:change={(e) => updateSetting('personalization_settings', 'content_personalization_level', e.target.value)}
                class="mt-1 w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="basic">Basic - Minimal personalization</option>
                <option value="enhanced">Enhanced - Moderate personalization</option>
                <option value="full">Full - Maximum personalization</option>
              </select>
            </div>
          </CardContent>
        </Card>
      {/if}

      <!-- Privacy Settings -->
      {#if activeTab === 'privacy'}
        <Card>
          <CardHeader>
            <CardTitle>Privacy Settings</CardTitle>
            <CardDescription>Control your data privacy and sharing preferences</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex items-center justify-between">
                <div>
                  <Label class="text-sm font-medium">Public profile</Label>
                  <p class="text-xs text-gray-500">Make your profile visible to others</p>
                </div>
                <Switch 
                  checked={$userSettings.public_profile}
                  onCheckedChange={(checked) => userSettingsStore.updateSettings({ public_profile: checked })}
                />
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <Label class="text-sm font-medium">Analytics tracking</Label>
                  <p class="text-xs text-gray-500">Help improve the platform with usage data</p>
                </div>
                <Switch 
                  checked={$userSettings.analytics_enabled}
                  onCheckedChange={(checked) => userSettingsStore.updateSettings({ analytics_enabled: checked })}
                />
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <Label class="text-sm font-medium">Template recommendations</Label>
                  <p class="text-xs text-gray-500">Use your data to improve recommendations</p>
                </div>
                <Switch 
                  checked={$userSettings.privacy_settings.allow_template_recommendations}
                  onCheckedChange={(checked) => updateSetting('privacy_settings', 'allow_template_recommendations', checked)}
                />
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <Label class="text-sm font-medium">Share usage data</Label>
                  <p class="text-xs text-gray-500">Share anonymized usage data for research</p>
                </div>
                <Switch 
                  checked={$userSettings.privacy_settings.share_usage_data}
                  onCheckedChange={(checked) => updateSetting('privacy_settings', 'share_usage_data', checked)}
                />
              </div>
            </div>
            
            <div>
              <Label for="default-privacy">Default resume privacy</Label>
              <select
                id="default-privacy"
                value={$userSettings.privacy_settings.default_resume_privacy}
                on:change={(e) => updateSetting('privacy_settings', 'default_resume_privacy', e.target.value)}
                class="mt-1 w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="private">Private - Only you can see</option>
                <option value="unlisted">Unlisted - Accessible with link</option>
                <option value="public">Public - Visible to everyone</option>
              </select>
            </div>
          </CardContent>
        </Card>
      {/if}

      <!-- Notification Settings -->
      {#if activeTab === 'notifications'}
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Control how and when you receive notifications</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div>
              <h4 class="font-medium mb-3">Email Notifications</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-center justify-between">
                  <div>
                    <Label class="text-sm font-medium">Resume tips</Label>
                    <p class="text-xs text-gray-500">Weekly resume improvement tips</p>
                  </div>
                  <Switch 
                    checked={$userSettings.email_notifications.resume_tips}
                    onCheckedChange={(checked) => updateNestedSetting('email_notifications', '', 'resume_tips', checked)}
                  />
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <Label class="text-sm font-medium">New templates</Label>
                    <p class="text-xs text-gray-500">Notifications about new templates</p>
                  </div>
                  <Switch 
                    checked={$userSettings.email_notifications.new_templates}
                    onCheckedChange={(checked) => updateNestedSetting('email_notifications', '', 'new_templates', checked)}
                  />
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <Label class="text-sm font-medium">Weekly digest</Label>
                    <p class="text-xs text-gray-500">Summary of your resume activity</p>
                  </div>
                  <Switch 
                    checked={$userSettings.email_notifications.weekly_digest}
                    onCheckedChange={(checked) => updateNestedSetting('email_notifications', '', 'weekly_digest', checked)}
                  />
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <Label class="text-sm font-medium">Achievement updates</Label>
                    <p class="text-xs text-gray-500">Notifications about milestones</p>
                  </div>
                  <Switch 
                    checked={$userSettings.email_notifications.achievement_updates}
                    onCheckedChange={(checked) => updateNestedSetting('email_notifications', '', 'achievement_updates', checked)}
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 class="font-medium mb-3">In-App Notifications</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-center justify-between">
                  <div>
                    <Label class="text-sm font-medium">Auto-save confirmations</Label>
                    <p class="text-xs text-gray-500">Show when changes are saved</p>
                  </div>
                  <Switch 
                    checked={$userSettings.notification_settings.in_app_notifications.auto_save_confirmations}
                    onCheckedChange={(checked) => updateNestedSetting('notification_settings', 'in_app_notifications', 'auto_save_confirmations', checked)}
                  />
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <Label class="text-sm font-medium">Completion reminders</Label>
                    <p class="text-xs text-gray-500">Reminders to complete your resume</p>
                  </div>
                  <Switch 
                    checked={$userSettings.notification_settings.in_app_notifications.completion_reminders}
                    onCheckedChange={(checked) => updateNestedSetting('notification_settings', 'in_app_notifications', 'completion_reminders', checked)}
                  />
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <Label class="text-sm font-medium">Tip suggestions</Label>
                    <p class="text-xs text-gray-500">Helpful tips while building</p>
                  </div>
                  <Switch 
                    checked={$userSettings.notification_settings.in_app_notifications.tip_suggestions}
                    onCheckedChange={(checked) => updateNestedSetting('notification_settings', 'in_app_notifications', 'tip_suggestions', checked)}
                  />
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <Label class="text-sm font-medium">Feature announcements</Label>
                    <p class="text-xs text-gray-500">Notifications about new features</p>
                  </div>
                  <Switch 
                    checked={$userSettings.notification_settings.in_app_notifications.feature_announcements}
                    onCheckedChange={(checked) => updateNestedSetting('notification_settings', 'in_app_notifications', 'feature_announcements', checked)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      {/if}

      <!-- Appearance Settings -->
      {#if activeTab === 'appearance'}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel of the interface</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label for="theme">Theme</Label>
                <select
                  id="theme"
                  value={$userSettings.ui_preferences.theme}
                  on:change={(e) => updateSetting('ui_preferences', 'theme', e.target.value)}
                  class="mt-1 w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto (system)</option>
                </select>
              </div>
              
              <div>
                <Label for="dashboard-layout">Dashboard layout</Label>
                <select
                  id="dashboard-layout"
                  value={$userSettings.ui_preferences.dashboard_layout}
                  on:change={(e) => updateSetting('ui_preferences', 'dashboard_layout', e.target.value)}
                  class="mt-1 w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="grid">Grid</option>
                  <option value="list">List</option>
                  <option value="compact">Compact</option>
                </select>
              </div>
              
              <div>
                <Label for="font-size">Font size</Label>
                <select
                  id="font-size"
                  value={$userSettings.ui_preferences.font_size}
                  on:change={(e) => updateSetting('ui_preferences', 'font_size', e.target.value)}
                  class="mt-1 w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex items-center justify-between">
                <div>
                  <Label class="text-sm font-medium">Show progress indicators</Label>
                  <p class="text-xs text-gray-500">Display progress bars and completion status</p>
                </div>
                <Switch 
                  checked={$userSettings.ui_preferences.show_progress_indicators}
                  onCheckedChange={(checked) => updateSetting('ui_preferences', 'show_progress_indicators', checked)}
                />
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <Label class="text-sm font-medium">Enable animations</Label>
                  <p class="text-xs text-gray-500">Use smooth transitions and animations</p>
                </div>
                <Switch 
                  checked={$userSettings.ui_preferences.animation_enabled}
                  onCheckedChange={(checked) => updateSetting('ui_preferences', 'animation_enabled', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      {/if}
    </div>

    </div>

    <!-- Settings Actions -->
    <div class="flex items-center justify-between pt-8 border-t border-gray-200">
      <Button
        variant="outline"
        on:click={resetAllSettings}
        disabled={isSaving}
        class="text-red-600 border-red-200 hover:bg-red-50"
      >
        <RotateCcw class="h-4 w-4 mr-2" />
        Reset to Defaults
      </Button>
      
      <div class="text-sm text-gray-500">
        Settings are automatically saved when changed
      </div>
    </div>
  {:else}
    <div class="text-center py-12">
      <Settings class="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No settings found</h3>
      <p class="text-gray-600 mb-6">We'll create your settings when you first log in</p>
    </div>
  {/if}
</div>

<style>
  .settings-panel {
    font-family: 'Inter', sans-serif;
  }
</style>