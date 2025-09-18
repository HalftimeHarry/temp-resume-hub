<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { currentResume, editorState, resumeStore, hasUnsavedChanges, isSaving } from '$lib/stores/resume';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Separator } from '$lib/components/ui/separator';
  import { Badge } from '$lib/components/ui/badge';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { toast } from 'svelte-sonner';
  import { 
    Save, 
    Eye, 
    Download, 
    Share2, 
    Settings, 
    Plus,
    ChevronLeft,
    Clock,
    AlertCircle
  } from 'lucide-svelte';
  
  import PersonalInfoEditor from './PersonalInfoEditor.svelte';
  import SectionEditor from './SectionEditor.svelte';
  import ResumePreview from './ResumePreview.svelte';
  import SectionList from './SectionList.svelte';
  
  export let resumeId: string;
  
  let isLoading = true;
  let showPreview = false;
  let autoSaveInterval: NodeJS.Timeout;
  
  // Reactive statements
  $: resume = $currentResume;
  $: editor = $editorState;
  $: unsavedChanges = $hasUnsavedChanges;
  $: saving = $isSaving;
  
  onMount(async () => {
    try {
      await resumeStore.load(resumeId);
      
      // Set up auto-save interval
      autoSaveInterval = setInterval(() => {
        if ($editorState.autoSaveEnabled && $hasUnsavedChanges) {
          resumeStore.autoSave();
        }
      }, 30000); // Auto-save every 30 seconds
      
      // Warn before leaving with unsaved changes
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if ($hasUnsavedChanges) {
          e.preventDefault();
          e.returnValue = '';
        }
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    } catch (error) {
      console.error('Failed to load resume:', error);
      toast.error('Failed to load resume');
      goto('/dashboard');
    } finally {
      isLoading = false;
    }
  });
  
  onDestroy(() => {
    if (autoSaveInterval) {
      clearInterval(autoSaveInterval);
    }
  });
  
  async function handleSave() {
    try {
      await resumeStore.save();
      toast.success('Resume saved successfully');
    } catch (error) {
      console.error('Failed to save resume:', error);
      toast.error('Failed to save resume');
    }
  }
  
  async function handleTitleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const newTitle = target.value.trim();
    
    if (newTitle && newTitle !== resume?.title) {
      resumeStore.update({
        title: newTitle,
        slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      });
    }
  }
  
  function togglePreview() {
    showPreview = !showPreview;
  }
  
  function handleAddSection() {
    // This will be handled by SectionList component
    editorState.update(state => ({
      ...state,
      activeSection: 'add-section'
    }));
  }
  
  function goBack() {
    if (unsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
        goto('/dashboard');
      }
    } else {
      goto('/dashboard');
    }
  }
</script>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Left side -->
        <div class="flex items-center space-x-4">
          <Button variant="ghost" size="sm" on:click={goBack}>
            <ChevronLeft class="h-4 w-4 mr-1" />
            Back
          </Button>
          
          <Separator orientation="vertical" class="h-6" />
          
          {#if isLoading}
            <Skeleton class="h-8 w-48" />
          {:else if resume}
            <Input
              value={resume.title}
              on:blur={handleTitleChange}
              class="text-lg font-semibold border-none shadow-none p-0 h-auto focus-visible:ring-0"
              placeholder="Resume Title"
            />
          {/if}
          
          {#if unsavedChanges}
            <Badge variant="secondary" class="text-xs">
              <AlertCircle class="h-3 w-3 mr-1" />
              Unsaved changes
            </Badge>
          {:else if editor.lastSaved}
            <Badge variant="outline" class="text-xs">
              <Clock class="h-3 w-3 mr-1" />
              Saved {new Date(editor.lastSaved).toLocaleTimeString()}
            </Badge>
          {/if}
        </div>
        
        <!-- Right side -->
        <div class="flex items-center space-x-2">
          <Button variant="outline" size="sm" on:click={togglePreview}>
            <Eye class="h-4 w-4 mr-1" />
            {showPreview ? 'Edit' : 'Preview'}
          </Button>
          
          <Button variant="outline" size="sm" disabled>
            <Download class="h-4 w-4 mr-1" />
            Export
          </Button>
          
          <Button variant="outline" size="sm" disabled>
            <Share2 class="h-4 w-4 mr-1" />
            Share
          </Button>
          
          <Button variant="outline" size="sm" disabled>
            <Settings class="h-4 w-4 mr-1" />
            Settings
          </Button>
          
          <Separator orientation="vertical" class="h-6" />
          
          <Button 
            size="sm" 
            on:click={handleSave}
            disabled={saving || !unsavedChanges}
            class="min-w-[80px]"
          >
            {#if saving}
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
              Saving...
            {:else}
              <Save class="h-4 w-4 mr-1" />
              Save
            {/if}
          </Button>
        </div>
      </div>
    </div>
  </header>
  
  <!-- Main content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    {#if isLoading}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-6">
          <Skeleton class="h-48 w-full" />
          <Skeleton class="h-32 w-full" />
          <Skeleton class="h-64 w-full" />
        </div>
        <div class="hidden lg:block">
          <Skeleton class="h-96 w-full" />
        </div>
      </div>
    {:else if resume}
      <div class="grid grid-cols-1 {showPreview ? 'lg:grid-cols-2' : ''} gap-6">
        <!-- Editor Panel -->
        <div class="space-y-6" class:hidden={showPreview && window.innerWidth < 1024}>
          <!-- Personal Information -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h2 class="text-lg font-semibold mb-4">Personal Information</h2>
            <PersonalInfoEditor />
          </div>
          
          <!-- Sections -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold">Resume Sections</h2>
              <Button size="sm" variant="outline" on:click={handleAddSection}>
                <Plus class="h-4 w-4 mr-1" />
                Add Section
              </Button>
            </div>
            
            <SectionList />
          </div>
          
          <!-- Active Section Editor -->
          {#if editor.activeSection && editor.activeSection !== 'add-section'}
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <SectionEditor sectionId={editor.activeSection} />
            </div>
          {/if}
        </div>
        
        <!-- Preview Panel -->
        {#if showPreview}
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold">Preview</h2>
              <div class="flex items-center space-x-2">
                <Button size="sm" variant="outline" disabled>
                  Desktop
                </Button>
                <Button size="sm" variant="ghost" disabled>
                  Mobile
                </Button>
              </div>
            </div>
            
            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <ResumePreview {resume} />
            </div>
          </div>
        {/if}
      </div>
    {:else}
      <div class="text-center py-12">
        <p class="text-gray-500">Resume not found</p>
        <Button class="mt-4" on:click={() => goto('/dashboard')}>
          Go to Dashboard
        </Button>
      </div>
    {/if}
  </main>
</div>

<style>
  :global(body) {
    overflow-x: hidden;
  }
</style>