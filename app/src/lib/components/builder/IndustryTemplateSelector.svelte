<script lang="ts">
  import { INDUSTRY_SEED_DATA, getSeedDataByCategory } from '$lib/seed-data';
  import { TEMPLATE_CONFIGURATIONS } from '$lib/templates/configurations';
  import type { IndustrySeedData } from '$lib/seed-data';
  import type { ClientTemplateConfig } from '$lib/templates/types';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { Separator } from '$lib/components/ui/separator';
  import { Briefcase, Palette, Check } from 'lucide-svelte';
  
  export let onSelect: (industry: IndustrySeedData, template: ClientTemplateConfig) => void;
  export let selectedIndustryId: string | null = null;
  export let selectedTemplateId: string | null = null;
  
  let step: 'industry' | 'template' = 'industry';
  let selectedIndustry: IndustrySeedData | null = null;
  let selectedTemplate: ClientTemplateConfig | null = null;
  
  $: entryLevelIndustries = getSeedDataByCategory('entry-level');
  $: professionalIndustries = getSeedDataByCategory('professional');
  $: templates = Object.values(TEMPLATE_CONFIGURATIONS);
  
  function selectIndustry(industry: IndustrySeedData) {
    selectedIndustry = industry;
    selectedIndustryId = industry.id;
    step = 'template';
  }
  
  function selectTemplate(template: ClientTemplateConfig) {
    selectedTemplate = template;
    selectedTemplateId = template.id;
  }
  
  function handleApply() {
    if (selectedIndustry && selectedTemplate) {
      onSelect(selectedIndustry, selectedTemplate);
    }
  }
  
  function goBack() {
    step = 'industry';
    selectedTemplate = null;
    selectedTemplateId = null;
  }
</script>

<div class="space-y-6">
  <!-- Progress indicator -->
  <div class="flex items-center justify-center space-x-4">
    <div class="flex items-center space-x-2">
      <div class="flex items-center justify-center w-8 h-8 rounded-full {step === 'industry' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}">
        {#if step === 'template' && selectedIndustry}
          <Check class="w-4 h-4" />
        {:else}
          1
        {/if}
      </div>
      <span class="text-sm font-medium">Choose Industry/Role</span>
    </div>
    
    <div class="w-16 h-0.5 {step === 'template' ? 'bg-blue-600' : 'bg-gray-300'}"></div>
    
    <div class="flex items-center space-x-2">
      <div class="flex items-center justify-center w-8 h-8 rounded-full {step === 'template' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}">
        2
      </div>
      <span class="text-sm font-medium {step === 'template' ? 'text-gray-900' : 'text-gray-500'}">Choose Design</span>
    </div>
  </div>
  
  <Separator />
  
  {#if step === 'industry'}
    <!-- Industry Selection -->
    <div class="space-y-6">
      <div class="text-center">
        <Briefcase class="w-12 h-12 mx-auto mb-4 text-blue-600" />
        <h2 class="text-2xl font-bold mb-2">What type of job are you applying for?</h2>
        <p class="text-gray-600">We'll provide relevant content and examples to help you get started.</p>
      </div>
      
      <!-- Entry Level -->
      <div>
        <h3 class="text-lg font-semibold mb-3 flex items-center">
          <Badge variant="outline" class="mr-2">Entry Level</Badge>
          First jobs, part-time, and student positions
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {#each entryLevelIndustries as industry}
            <Card 
              class="cursor-pointer hover:border-blue-500 transition-colors {selectedIndustryId === industry.id ? 'border-blue-500 bg-blue-50' : ''}"
              on:click={() => selectIndustry(industry)}
            >
              <CardHeader>
                <CardTitle class="text-lg">{industry.name}</CardTitle>
                <CardDescription>{industry.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div class="flex flex-wrap gap-1">
                  {#each industry.targetRoles.slice(0, 3) as role}
                    <Badge variant="secondary" class="text-xs">{role}</Badge>
                  {/each}
                </div>
              </CardContent>
            </Card>
          {/each}
        </div>
      </div>
      
      <!-- Professional -->
      <div>
        <h3 class="text-lg font-semibold mb-3 flex items-center">
          <Badge variant="outline" class="mr-2">Professional</Badge>
          Experienced roles and career positions
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {#each professionalIndustries as industry}
            <Card 
              class="cursor-pointer hover:border-blue-500 transition-colors {selectedIndustryId === industry.id ? 'border-blue-500 bg-blue-50' : ''}"
              on:click={() => selectIndustry(industry)}
            >
              <CardHeader>
                <CardTitle class="text-lg">{industry.name}</CardTitle>
                <CardDescription>{industry.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div class="flex flex-wrap gap-1">
                  {#each industry.targetRoles.slice(0, 3) as role}
                    <Badge variant="secondary" class="text-xs">{role}</Badge>
                  {/each}
                </div>
              </CardContent>
            </Card>
          {/each}
        </div>
      </div>
    </div>
  {:else}
    <!-- Template Selection -->
    <div class="space-y-6">
      <div class="text-center">
        <Palette class="w-12 h-12 mx-auto mb-4 text-blue-600" />
        <h2 class="text-2xl font-bold mb-2">Choose your resume design</h2>
        <p class="text-gray-600">
          Selected: <strong>{selectedIndustry?.name}</strong>
          <button on:click={goBack} class="ml-2 text-blue-600 hover:underline text-sm">Change</button>
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        {#each templates as template}
          <Card 
            class="cursor-pointer hover:border-blue-500 transition-colors {selectedTemplateId === template.id ? 'border-blue-500 bg-blue-50' : ''}"
            on:click={() => selectTemplate(template)}
          >
            <CardHeader class="p-0">
              <img 
                src={template.thumbnail} 
                alt={template.name}
                class="w-full h-48 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent class="p-4">
              <div class="flex items-start justify-between mb-2">
                <CardTitle class="text-base">{template.name}</CardTitle>
                {#if template.isPremium}
                  <Badge variant="secondary" class="text-xs">Premium</Badge>
                {/if}
              </div>
              <CardDescription class="text-sm">{template.description}</CardDescription>
              <div class="mt-2">
                <Badge variant="outline" class="text-xs">{template.category}</Badge>
              </div>
            </CardContent>
          </Card>
        {/each}
      </div>
      
      <div class="flex justify-between pt-4">
        <Button variant="outline" on:click={goBack}>
          Back to Industry Selection
        </Button>
        <Button 
          on:click={handleApply}
          disabled={!selectedTemplate}
          class="bg-blue-600 hover:bg-blue-700"
        >
          Apply Selection
        </Button>
      </div>
    </div>
  {/if}
</div>
