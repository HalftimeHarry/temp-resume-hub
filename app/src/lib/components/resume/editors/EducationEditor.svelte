<script lang="ts">
  import { resumeStore } from '$lib/stores/resume';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import { Button } from '$lib/components/ui/button';
  import { Plus, X } from 'lucide-svelte';
  import type { Education } from '$lib/types/resume';
  
  export let sectionId: string;
  export let item: Education;
  export let index: number;
  
  let newHonor = '';
  
  function updateField(field: keyof Education, value: any) {
    resumeStore.updateSectionItem(sectionId, item.id, { [field]: value });
  }
  
  function addHonor() {
    if (newHonor.trim()) {
      const honors = [...(item.honors || []), newHonor.trim()];
      updateField('honors', honors);
      newHonor = '';
    }
  }
  
  function removeHonor(honorIndex: number) {
    const honors = (item.honors || []).filter((_, i) => i !== honorIndex);
    updateField('honors', honors);
  }
  
  function handleCurrentChange(checked: boolean) {
    updateField('current', checked);
    if (checked) {
      updateField('endDate', '');
    }
  }
</script>

<div class="space-y-4">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="space-y-2">
      <Label for="institution-{item.id}">Institution *</Label>
      <Input
        id="institution-{item.id}"
        value={item.institution}
        on:input={(e) => updateField('institution', e.currentTarget.value)}
        placeholder="University of California"
        required
      />
    </div>
    
    <div class="space-y-2">
      <Label for="degree-{item.id}">Degree *</Label>
      <Input
        id="degree-{item.id}"
        value={item.degree}
        on:input={(e) => updateField('degree', e.currentTarget.value)}
        placeholder="Bachelor of Science"
        required
      />
    </div>
    
    <div class="space-y-2">
      <Label for="field-{item.id}">Field of Study</Label>
      <Input
        id="field-{item.id}"
        value={item.field || ''}
        on:input={(e) => updateField('field', e.currentTarget.value)}
        placeholder="Computer Science"
      />
    </div>
    
    <div class="space-y-2">
      <Label for="location-{item.id}">Location</Label>
      <Input
        id="location-{item.id}"
        value={item.location || ''}
        on:input={(e) => updateField('location', e.currentTarget.value)}
        placeholder="Berkeley, CA"
      />
    </div>
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="space-y-2">
      <Label for="start-date-{item.id}">Start Date *</Label>
      <Input
        id="start-date-{item.id}"
        type="month"
        value={item.startDate}
        on:input={(e) => updateField('startDate', e.currentTarget.value)}
        required
      />
    </div>
    
    <div class="space-y-2">
      <Label for="end-date-{item.id}">End Date</Label>
      <Input
        id="end-date-{item.id}"
        type="month"
        value={item.endDate || ''}
        on:input={(e) => updateField('endDate', e.currentTarget.value)}
        disabled={item.current}
        placeholder={item.current ? 'Present' : ''}
      />
    </div>
    
    <div class="space-y-2">
      <Label for="gpa-{item.id}">GPA</Label>
      <Input
        id="gpa-{item.id}"
        value={item.gpa || ''}
        on:input={(e) => updateField('gpa', e.currentTarget.value)}
        placeholder="3.8/4.0"
      />
    </div>
  </div>
  
  <div class="flex items-center space-x-2">
    <Checkbox
      id="current-{item.id}"
      checked={item.current}
      onCheckedChange={handleCurrentChange}
    />
    <Label for="current-{item.id}" class="text-sm">
      I am currently studying here
    </Label>
  </div>
  
  <div class="space-y-2">
    <Label for="description-{item.id}">Description</Label>
    <Textarea
      id="description-{item.id}"
      value={item.description || ''}
      on:input={(e) => updateField('description', e.currentTarget.value)}
      placeholder="Relevant coursework, thesis, or additional details..."
      rows={2}
      class="resize-none"
    />
  </div>
  
  <!-- Honors and Awards -->
  <div class="space-y-2">
    <Label>Honors & Awards</Label>
    
    <!-- Existing honors -->
    {#if item.honors && item.honors.length > 0}
      <div class="space-y-2">
        {#each item.honors as honor, honorIndex}
          <div class="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
            <span class="flex-1 text-sm">{honor}</span>
            <Button
              size="sm"
              variant="ghost"
              class="h-6 w-6 p-0 text-red-600 hover:text-red-700"
              on:click={() => removeHonor(honorIndex)}
            >
              <X class="h-3 w-3" />
            </Button>
          </div>
        {/each}
      </div>
    {/if}
    
    <!-- Add new honor -->
    <div class="flex space-x-2">
      <Input
        bind:value={newHonor}
        placeholder="Add honor, award, or recognition..."
        on:keydown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            addHonor();
          }
        }}
        class="flex-1"
      />
      <Button
        size="sm"
        variant="outline"
        on:click={addHonor}
        disabled={!newHonor.trim()}
      >
        <Plus class="h-4 w-4" />
      </Button>
    </div>
    
    <p class="text-xs text-gray-500">
      Add academic honors, scholarships, or awards received.
    </p>
  </div>
</div>