<script lang="ts">
  import { resumeStore } from '$lib/stores/resume';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { Plus, X } from 'lucide-svelte';
  import type { Experience } from '$lib/types/resume';
  
  export let sectionId: string;
  export let item: Experience;
  export let index: number;
  
  let newHighlight = '';
  
  function updateField(field: keyof Experience, value: any) {
    resumeStore.updateSectionItem(sectionId, item.id, { [field]: value });
  }
  
  function addHighlight() {
    if (newHighlight.trim()) {
      const highlights = [...(item.highlights || []), newHighlight.trim()];
      updateField('highlights', highlights);
      newHighlight = '';
    }
  }
  
  function removeHighlight(highlightIndex: number) {
    const highlights = item.highlights.filter((_, i) => i !== highlightIndex);
    updateField('highlights', highlights);
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
      <Label for="position-{item.id}">Position *</Label>
      <Input
        id="position-{item.id}"
        value={item.position}
        on:input={(e) => updateField('position', e.currentTarget.value)}
        placeholder="Software Engineer"
        required
      />
    </div>
    
    <div class="space-y-2">
      <Label for="company-{item.id}">Company *</Label>
      <Input
        id="company-{item.id}"
        value={item.company}
        on:input={(e) => updateField('company', e.currentTarget.value)}
        placeholder="Tech Corp"
        required
      />
    </div>
    
    <div class="space-y-2">
      <Label for="location-{item.id}">Location</Label>
      <Input
        id="location-{item.id}"
        value={item.location || ''}
        on:input={(e) => updateField('location', e.currentTarget.value)}
        placeholder="San Francisco, CA"
      />
    </div>
    
    <div class="space-y-2">
      <!-- Current position checkbox -->
      <div class="flex items-center space-x-2 pt-6">
        <Checkbox
          id="current-{item.id}"
          checked={item.current}
          onCheckedChange={handleCurrentChange}
        />
        <Label for="current-{item.id}" class="text-sm">
          I currently work here
        </Label>
      </div>
    </div>
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
  </div>
  
  <div class="space-y-2">
    <Label for="description-{item.id}">Job Description</Label>
    <Textarea
      id="description-{item.id}"
      value={item.description}
      on:input={(e) => updateField('description', e.currentTarget.value)}
      placeholder="Describe your role and responsibilities..."
      rows={3}
      class="resize-none"
    />
  </div>
  
  <!-- Key Achievements/Highlights -->
  <div class="space-y-2">
    <Label>Key Achievements</Label>
    
    <!-- Existing highlights -->
    {#if item.highlights && item.highlights.length > 0}
      <div class="space-y-2">
        {#each item.highlights as highlight, highlightIndex}
          <div class="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
            <span class="flex-1 text-sm">{highlight}</span>
            <Button
              size="sm"
              variant="ghost"
              class="h-6 w-6 p-0 text-red-600 hover:text-red-700"
              on:click={() => removeHighlight(highlightIndex)}
            >
              <X class="h-3 w-3" />
            </Button>
          </div>
        {/each}
      </div>
    {/if}
    
    <!-- Add new highlight -->
    <div class="flex space-x-2">
      <Input
        bind:value={newHighlight}
        placeholder="Add a key achievement or highlight..."
        on:keydown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            addHighlight();
          }
        }}
        class="flex-1"
      />
      <Button
        size="sm"
        variant="outline"
        on:click={addHighlight}
        disabled={!newHighlight.trim()}
      >
        <Plus class="h-4 w-4" />
      </Button>
    </div>
    
    <p class="text-xs text-gray-500">
      Add specific achievements, metrics, or notable accomplishments from this role.
    </p>
  </div>
</div>