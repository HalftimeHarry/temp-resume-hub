<script lang="ts">
  import { resumeStore } from '$lib/stores/resume';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '$lib/components/ui/select';
  import { Badge } from '$lib/components/ui/badge';
  import type { Skill } from '$lib/types/resume';
  
  export let sectionId: string;
  export let item: Skill;
  export let index: number;
  
  const skillLevels = [
    { value: 'beginner', label: 'Beginner', color: 'bg-red-100 text-red-800' },
    { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'advanced', label: 'Advanced', color: 'bg-blue-100 text-blue-800' },
    { value: 'expert', label: 'Expert', color: 'bg-green-100 text-green-800' }
  ];
  
  const skillCategories = [
    'Programming Languages',
    'Frameworks & Libraries',
    'Databases',
    'Tools & Technologies',
    'Cloud Platforms',
    'Soft Skills',
    'Languages',
    'Other'
  ];
  
  function updateField(field: keyof Skill, value: any) {
    resumeStore.updateSectionItem(sectionId, item.id, { [field]: value });
  }
  
  function getLevelColor(level: string) {
    const levelData = skillLevels.find(l => l.value === level);
    return levelData?.color || 'bg-gray-100 text-gray-800';
  }
  
  function getLevelLabel(level: string) {
    const levelData = skillLevels.find(l => l.value === level);
    return levelData?.label || level;
  }
</script>

<div class="space-y-4">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="space-y-2">
      <Label for="skill-name-{item.id}">Skill Name *</Label>
      <Input
        id="skill-name-{item.id}"
        value={item.name}
        on:input={(e) => updateField('name', e.currentTarget.value)}
        placeholder="JavaScript"
        required
      />
    </div>
    
    <div class="space-y-2">
      <Label for="skill-level-{item.id}">Proficiency Level</Label>
      <Select value={item.level} onValueChange={(value) => updateField('level', value)}>
        <SelectTrigger id="skill-level-{item.id}">
          <SelectValue placeholder="Select level" />
        </SelectTrigger>
        <SelectContent>
          {#each skillLevels as level}
            <SelectItem value={level.value}>
              <div class="flex items-center space-x-2">
                <Badge class={level.color} variant="secondary">
                  {level.label}
                </Badge>
              </div>
            </SelectItem>
          {/each}
        </SelectContent>
      </Select>
    </div>
    
    <div class="space-y-2">
      <Label for="skill-category-{item.id}">Category</Label>
      <Select value={item.category || ''} onValueChange={(value) => updateField('category', value)}>
        <SelectTrigger id="skill-category-{item.id}">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {#each skillCategories as category}
            <SelectItem value={category}>{category}</SelectItem>
          {/each}
        </SelectContent>
      </Select>
    </div>
  </div>
  
  <!-- Skill Preview -->
  <div class="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
    <span class="font-medium">{item.name || 'Skill Name'}</span>
    {#if item.level}
      <Badge class={getLevelColor(item.level)} variant="secondary">
        {getLevelLabel(item.level)}
      </Badge>
    {/if}
    {#if item.category}
      <Badge variant="outline" class="text-xs">
        {item.category}
      </Badge>
    {/if}
  </div>
</div>