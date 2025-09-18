<script lang="ts">
  import { currentResume, resumeStore } from '$lib/stores/resume';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Label } from '$lib/components/ui/label';
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '$lib/components/ui/select';
  import { Switch } from '$lib/components/ui/switch';
  import { Button } from '$lib/components/ui/button';
  import { Separator } from '$lib/components/ui/separator';
  import { Badge } from '$lib/components/ui/badge';
  import { Textarea } from '$lib/components/ui/textarea';
  import { 
    Palette, 
    Type, 
    Layout, 
    Image, 
    Download,
    Eye,
    Settings,
    Sparkles
  } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  
  $: resume = $currentResume;
  $: settings = resume?.settings;
  
  const templates = [
    { id: 'modern', name: 'Modern', description: 'Clean and contemporary design' },
    { id: 'classic', name: 'Classic', description: 'Traditional professional layout' },
    { id: 'creative', name: 'Creative', description: 'Unique and eye-catching design' },
    { id: 'minimalist', name: 'Minimalist', description: 'Simple and elegant' },
    { id: 'executive', name: 'Executive', description: 'Premium professional look' }
  ];
  
  const colorSchemes = [
    { id: 'blue', name: 'Blue', color: 'bg-blue-500' },
    { id: 'green', name: 'Green', color: 'bg-green-500' },
    { id: 'purple', name: 'Purple', color: 'bg-purple-500' },
    { id: 'red', name: 'Red', color: 'bg-red-500' },
    { id: 'orange', name: 'Orange', color: 'bg-orange-500' },
    { id: 'teal', name: 'Teal', color: 'bg-teal-500' },
    { id: 'gray', name: 'Gray', color: 'bg-gray-500' },
    { id: 'black', name: 'Black', color: 'bg-black' }
  ];
  
  const fontSizes = [
    { id: 'small', name: 'Small', description: 'Compact text' },
    { id: 'medium', name: 'Medium', description: 'Standard size' },
    { id: 'large', name: 'Large', description: 'Easy to read' }
  ];
  
  const spacingOptions = [
    { id: 'compact', name: 'Compact', description: 'Tight spacing' },
    { id: 'normal', name: 'Normal', description: 'Balanced spacing' },
    { id: 'relaxed', name: 'Relaxed', description: 'Generous spacing' }
  ];
  
  function updateSetting(key: keyof typeof settings, value: any) {
    if (!resume) return;
    
    resumeStore.update({
      settings: {
        ...resume.settings,
        [key]: value
      }
    });
  }
  
  function resetToDefaults() {
    if (!resume) return;
    
    const defaultSettings = {
      template: 'modern',
      colorScheme: 'blue',
      fontSize: 'medium',
      spacing: 'normal',
      showProfileImage: false,
      sectionOrder: ['experience', 'education', 'skills']
    };
    
    resumeStore.update({ settings: defaultSettings });
    toast.success('Settings reset to defaults');
  }
  
  function exportSettings() {
    if (!settings) return;
    
    const settingsJson = JSON.stringify(settings, null, 2);
    const blob = new Blob([settingsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume-settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Settings exported');
  }
  
  function importSettings(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string);
        resumeStore.update({ settings: importedSettings });
        toast.success('Settings imported successfully');
      } catch (error) {
        toast.error('Invalid settings file');
      }
    };
    reader.readAsText(file);
  }
</script>

{#if resume && settings}
  <div class="space-y-6">
    <!-- Template Selection -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <Layout class="h-5 w-5" />
          <span>Template</span>
        </CardTitle>
        <CardDescription>
          Choose the overall design and layout for your resume
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {#each templates as template}
            <div 
              class="p-3 border rounded-lg cursor-pointer transition-all hover:border-blue-300 {settings.template === template.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}"
              on:click={() => updateSetting('template', template.id)}
            >
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium">{template.name}</h4>
                {#if settings.template === template.id}
                  <Badge variant="default" class="text-xs">Active</Badge>
                {/if}
              </div>
              <p class="text-sm text-gray-600">{template.description}</p>
            </div>
          {/each}
        </div>
      </CardContent>
    </Card>
    
    <!-- Color Scheme -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <Palette class="h-5 w-5" />
          <span>Color Scheme</span>
        </CardTitle>
        <CardDescription>
          Select the primary color for your resume
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-4 md:grid-cols-8 gap-3">
          {#each colorSchemes as color}
            <div 
              class="flex flex-col items-center space-y-2 cursor-pointer"
              on:click={() => updateSetting('colorScheme', color.id)}
            >
              <div 
                class="w-12 h-12 rounded-full border-4 transition-all {settings.colorScheme === color.id ? 'border-gray-900 scale-110' : 'border-gray-200'} {color.color}"
              ></div>
              <span class="text-xs text-center">{color.name}</span>
            </div>
          {/each}
        </div>
      </CardContent>
    </Card>
    
    <!-- Typography -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <Type class="h-5 w-5" />
          <span>Typography</span>
        </CardTitle>
        <CardDescription>
          Adjust font size and spacing for readability
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-6">
        <!-- Font Size -->
        <div class="space-y-3">
          <Label>Font Size</Label>
          <div class="grid grid-cols-3 gap-3">
            {#each fontSizes as fontSize}
              <div 
                class="p-3 border rounded-lg cursor-pointer transition-all hover:border-blue-300 {settings.fontSize === fontSize.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}"
                on:click={() => updateSetting('fontSize', fontSize.id)}
              >
                <div class="flex items-center justify-between mb-1">
                  <h4 class="font-medium">{fontSize.name}</h4>
                  {#if settings.fontSize === fontSize.id}
                    <Badge variant="default" class="text-xs">Active</Badge>
                  {/if}
                </div>
                <p class="text-xs text-gray-600">{fontSize.description}</p>
              </div>
            {/each}
          </div>
        </div>
        
        <!-- Spacing -->
        <div class="space-y-3">
          <Label>Spacing</Label>
          <div class="grid grid-cols-3 gap-3">
            {#each spacingOptions as spacing}
              <div 
                class="p-3 border rounded-lg cursor-pointer transition-all hover:border-blue-300 {settings.spacing === spacing.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}"
                on:click={() => updateSetting('spacing', spacing.id)}
              >
                <div class="flex items-center justify-between mb-1">
                  <h4 class="font-medium">{spacing.name}</h4>
                  {#if settings.spacing === spacing.id}
                    <Badge variant="default" class="text-xs">Active</Badge>
                  {/if}
                </div>
                <p class="text-xs text-gray-600">{spacing.description}</p>
              </div>
            {/each}
          </div>
        </div>
      </CardContent>
    </Card>
    
    <!-- Display Options -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <Image class="h-5 w-5" />
          <span>Display Options</span>
        </CardTitle>
        <CardDescription>
          Control what elements are shown on your resume
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <Label>Show Profile Image</Label>
              <p class="text-sm text-gray-600">Display your profile photo on the resume</p>
            </div>
            <Switch 
              checked={settings.showProfileImage}
              onCheckedChange={(checked) => updateSetting('showProfileImage', checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
    
    <!-- Custom CSS -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <Sparkles class="h-5 w-5" />
          <span>Custom Styling</span>
        </CardTitle>
        <CardDescription>
          Add custom CSS for advanced styling (optional)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-3">
          <Label for="custom-css">Custom CSS</Label>
          <Textarea
            id="custom-css"
            value={settings.customCSS || ''}
            on:input={(e) => updateSetting('customCSS', e.currentTarget.value)}
            placeholder="/* Add your custom CSS here */
.resume-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}"
            rows={6}
            class="font-mono text-sm"
          />
          <p class="text-xs text-gray-500">
            Use CSS to customize colors, fonts, spacing, and more. Changes will be applied to the preview.
          </p>
        </div>
      </CardContent>
    </Card>
    
    <!-- Actions -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <Settings class="h-5 w-5" />
          <span>Settings Management</span>
        </CardTitle>
        <CardDescription>
          Import, export, or reset your settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" on:click={exportSettings}>
            <Download class="h-4 w-4 mr-1" />
            Export Settings
          </Button>
          
          <Button variant="outline" size="sm" on:click={() => document.getElementById('import-settings')?.click()}>
            <Eye class="h-4 w-4 mr-1" />
            Import Settings
          </Button>
          
          <Button variant="outline" size="sm" on:click={resetToDefaults}>
            Reset to Defaults
          </Button>
          
          <input
            id="import-settings"
            type="file"
            accept=".json"
            class="hidden"
            on:change={importSettings}
          />
        </div>
      </CardContent>
    </Card>
  </div>
{:else}
  <div class="text-center py-8 text-gray-500">
    <Settings class="h-12 w-12 mx-auto mb-4" />
    <p>No resume loaded</p>
  </div>
{/if}