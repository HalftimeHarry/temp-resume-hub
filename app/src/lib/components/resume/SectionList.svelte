<script lang="ts">
  import { currentResume, editorState, resumeStore } from '$lib/stores/resume';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { 
    GripVertical, 
    Eye, 
    EyeOff, 
    Edit3, 
    Trash2, 
    Plus,
    Briefcase,
    GraduationCap,
    Code,
    FolderOpen,
    Award,
    Globe,
    Trophy,
    BookOpen,
    Heart,
    Users
  } from 'lucide-svelte';
  import type { ResumeSection } from '$lib/types/resume';
  
  $: resume = $currentResume;
  $: sections = resume?.sections || [];
  $: activeSection = $editorState.activeSection;
  
  // Section icons mapping
  const sectionIcons = {
    experience: Briefcase,
    education: GraduationCap,
    skills: Code,
    projects: FolderOpen,
    certifications: Award,
    languages: Globe,
    awards: Trophy,
    publications: BookOpen,
    volunteer: Heart,
    references: Users,
    custom: Plus
  };
  
  function selectSection(sectionId: string) {
    editorState.update(state => ({
      ...state,
      activeSection: sectionId,
      activeItem: null
    }));
  }
  
  function toggleSectionVisibility(sectionId: string) {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      resumeStore.updateSection(sectionId, { visible: !section.visible });
    }
  }
  
  function deleteSection(sectionId: string) {
    if (confirm('Are you sure you want to delete this section?')) {
      resumeStore.removeSection(sectionId);
      
      // Clear active section if it was deleted
      if (activeSection === sectionId) {
        editorState.update(state => ({
          ...state,
          activeSection: null,
          activeItem: null
        }));
      }
    }
  }
  
  function addNewSection() {
    editorState.update(state => ({
      ...state,
      activeSection: 'add-section',
      activeItem: null
    }));
  }
  
  // Drag and drop functionality (simplified for now)
  let draggedSection: string | null = null;
  
  function handleDragStart(event: DragEvent, sectionId: string) {
    draggedSection = sectionId;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }
  
  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }
  
  function handleDrop(event: DragEvent, targetSectionId: string) {
    event.preventDefault();
    
    if (!draggedSection || draggedSection === targetSectionId) {
      draggedSection = null;
      return;
    }
    
    const draggedIndex = sections.findIndex(s => s.id === draggedSection);
    const targetIndex = sections.findIndex(s => s.id === targetSectionId);
    
    if (draggedIndex === -1 || targetIndex === -1) {
      draggedSection = null;
      return;
    }
    
    // Reorder sections
    const newOrder = [...sections];
    const [draggedItem] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedItem);
    
    const sectionIds = newOrder.map(s => s.id);
    resumeStore.reorderSections(sectionIds);
    
    draggedSection = null;
  }
</script>

<div class="space-y-2">
  {#each sections as section (section.id)}
    <div
      class="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
      class:bg-blue-50={activeSection === section.id}
      class:border-blue-300={activeSection === section.id}
      draggable="true"
      on:dragstart={(e) => handleDragStart(e, section.id)}
      on:dragover={handleDragOver}
      on:drop={(e) => handleDrop(e, section.id)}
    >
      <!-- Drag handle -->
      <div class="cursor-move text-gray-400 hover:text-gray-600">
        <GripVertical class="h-4 w-4" />
      </div>
      
      <!-- Section icon -->
      <div class="text-gray-600">
        <svelte:component this={sectionIcons[section.type]} class="h-4 w-4" />
      </div>
      
      <!-- Section info -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center space-x-2">
          <h3 class="text-sm font-medium text-gray-900 truncate">
            {section.title}
          </h3>
          <Badge variant="secondary" class="text-xs">
            {section.data.length}
          </Badge>
          {#if !section.visible}
            <Badge variant="outline" class="text-xs">
              Hidden
            </Badge>
          {/if}
        </div>
      </div>
      
      <!-- Actions -->
      <div class="flex items-center space-x-1">
        <Button
          size="sm"
          variant="ghost"
          class="h-8 w-8 p-0"
          on:click={() => toggleSectionVisibility(section.id)}
          title={section.visible ? 'Hide section' : 'Show section'}
        >
          {#if section.visible}
            <Eye class="h-3 w-3" />
          {:else}
            <EyeOff class="h-3 w-3" />
          {/if}
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          class="h-8 w-8 p-0"
          on:click={() => selectSection(section.id)}
          title="Edit section"
        >
          <Edit3 class="h-3 w-3" />
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          class="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          on:click={() => deleteSection(section.id)}
          title="Delete section"
        >
          <Trash2 class="h-3 w-3" />
        </Button>
      </div>
    </div>
  {/each}
  
  <!-- Add section button -->
  <Button
    variant="outline"
    class="w-full justify-center"
    on:click={addNewSection}
  >
    <Plus class="h-4 w-4 mr-2" />
    Add Section
  </Button>
</div>

{#if activeSection === 'add-section'}
  <div class="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
    <h3 class="text-sm font-medium mb-3">Add New Section</h3>
    
    <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
      {#each Object.entries(sectionIcons) as [type, Icon]}
        {#if type !== 'custom'}
          <Button
            variant="outline"
            size="sm"
            class="justify-start"
            on:click={() => {
              resumeStore.addSection(type as any);
              editorState.update(state => ({ ...state, activeSection: null }));
            }}
          >
            <svelte:component this={Icon} class="h-4 w-4 mr-2" />
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        {/if}
      {/each}
      
      <Button
        variant="outline"
        size="sm"
        class="justify-start"
        on:click={() => {
          const title = prompt('Enter section title:');
          if (title) {
            resumeStore.addSection('custom', title);
            editorState.update(state => ({ ...state, activeSection: null }));
          }
        }}
      >
        <Plus class="h-4 w-4 mr-2" />
        Custom
      </Button>
    </div>
    
    <div class="mt-3 flex justify-end">
      <Button
        variant="ghost"
        size="sm"
        on:click={() => editorState.update(state => ({ ...state, activeSection: null }))}
      >
        Cancel
      </Button>
    </div>
  </div>
{/if}