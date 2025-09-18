<script lang="ts">
  import { currentResume, resumeStore } from '$lib/stores/resume';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Plus, X } from 'lucide-svelte';
  import type { ResumeSection } from '$lib/types/resume';
  
  import ExperienceEditor from './editors/ExperienceEditor.svelte';
  import EducationEditor from './editors/EducationEditor.svelte';
  import SkillsEditor from './editors/SkillsEditor.svelte';
  import ProjectsEditor from './editors/ProjectsEditor.svelte';
  import CertificationsEditor from './editors/CertificationsEditor.svelte';
  import LanguagesEditor from './editors/LanguagesEditor.svelte';
  import AwardsEditor from './editors/AwardsEditor.svelte';
  import PublicationsEditor from './editors/PublicationsEditor.svelte';
  import VolunteerEditor from './editors/VolunteerEditor.svelte';
  import ReferencesEditor from './editors/ReferencesEditor.svelte';
  import CustomEditor from './editors/CustomEditor.svelte';
  
  export let sectionId: string;
  
  $: resume = $currentResume;
  $: section = resume?.sections.find(s => s.id === sectionId);
  
  function updateSectionTitle(title: string) {
    if (section && title.trim()) {
      resumeStore.updateSection(sectionId, { title: title.trim() });
    }
  }
  
  function addItem() {
    if (!section) return;
    
    const defaultItem = getDefaultItem(section.type);
    resumeStore.addSectionItem(sectionId, defaultItem);
  }
  
  function removeItem(itemId: string) {
    if (confirm('Are you sure you want to delete this item?')) {
      resumeStore.removeSectionItem(sectionId, itemId);
    }
  }
  
  function getDefaultItem(type: ResumeSection['type']) {
    switch (type) {
      case 'experience':
        return {
          company: '',
          position: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
          highlights: []
        };
      case 'education':
        return {
          institution: '',
          degree: '',
          field: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          gpa: '',
          honors: [],
          description: ''
        };
      case 'skills':
        return {
          name: '',
          level: 'intermediate',
          category: ''
        };
      case 'projects':
        return {
          name: '',
          description: '',
          technologies: [],
          url: '',
          github: '',
          startDate: '',
          endDate: '',
          highlights: []
        };
      case 'certifications':
        return {
          name: '',
          issuer: '',
          date: '',
          expiryDate: '',
          credentialId: '',
          url: ''
        };
      case 'languages':
        return {
          name: '',
          proficiency: 'conversational'
        };
      case 'awards':
        return {
          title: '',
          issuer: '',
          date: '',
          description: ''
        };
      case 'publications':
        return {
          title: '',
          publisher: '',
          date: '',
          url: '',
          description: ''
        };
      case 'volunteer':
        return {
          organization: '',
          role: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: ''
        };
      case 'references':
        return {
          name: '',
          title: '',
          company: '',
          email: '',
          phone: '',
          relationship: ''
        };
      default:
        return {
          title: '',
          description: ''
        };
    }
  }
  
  function getEditorComponent(type: ResumeSection['type']) {
    switch (type) {
      case 'experience': return ExperienceEditor;
      case 'education': return EducationEditor;
      case 'skills': return SkillsEditor;
      case 'projects': return ProjectsEditor;
      case 'certifications': return CertificationsEditor;
      case 'languages': return LanguagesEditor;
      case 'awards': return AwardsEditor;
      case 'publications': return PublicationsEditor;
      case 'volunteer': return VolunteerEditor;
      case 'references': return ReferencesEditor;
      default: return CustomEditor;
    }
  }
</script>

{#if section}
  <div class="space-y-6">
    <!-- Section Header -->
    <div class="flex items-center justify-between">
      <div class="flex-1 max-w-md">
        <Label for="section-title">Section Title</Label>
        <Input
          id="section-title"
          value={section.title}
          on:blur={(e) => updateSectionTitle(e.currentTarget.value)}
          placeholder="Section Title"
          class="mt-1"
        />
      </div>
      
      <Button size="sm" on:click={addItem}>
        <Plus class="h-4 w-4 mr-1" />
        Add Item
      </Button>
    </div>
    
    <!-- Section Items -->
    <div class="space-y-4">
      {#if section.data.length === 0}
        <div class="text-center py-8 text-gray-500">
          <p>No items in this section yet.</p>
          <Button variant="outline" size="sm" class="mt-2" on:click={addItem}>
            <Plus class="h-4 w-4 mr-1" />
            Add First Item
          </Button>
        </div>
      {:else}
        {#each section.data as item, index (item.id)}
          <div class="border border-gray-200 rounded-lg p-4 relative">
            <!-- Remove button -->
            <Button
              size="sm"
              variant="ghost"
              class="absolute top-2 right-2 h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              on:click={() => removeItem(item.id)}
            >
              <X class="h-4 w-4" />
            </Button>
            
            <!-- Item Editor -->
            <div class="pr-10">
              <svelte:component
                this={getEditorComponent(section.type)}
                {sectionId}
                {item}
                {index}
              />
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
{:else}
  <div class="text-center py-8 text-gray-500">
    <p>Section not found</p>
  </div>
{/if}