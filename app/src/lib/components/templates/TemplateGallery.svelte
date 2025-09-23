<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    templates, 
    featuredTemplates, 
    filteredTemplates, 
    templateFilters, 
    templateStore, 
    isLoadingTemplates 
  } from '$lib/stores/templates';
  import { resumeStore } from '$lib/stores/resume';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Badge } from '$lib/components/ui/badge';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '$lib/components/ui/select';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { Separator } from '$lib/components/ui/separator';
  import { 
    Search, 
    Star, 
    Crown, 
    Eye, 
    Download, 
    Filter,
    Grid3X3,
    List,
    Sparkles
  } from 'lucide-svelte';
  import * as Dialog from '$lib/components/ui/dialog';
  import { toast } from 'svelte-sonner';
  
  export let showFeatured = true;
  export let compact = false;
  
  let searchQuery = '';
  let viewMode: 'grid' | 'list' = 'grid';
  let showFilters = false;
  
  $: loading = $isLoadingTemplates;
  $: featured = $featuredTemplates;
  $: filtered = $filteredTemplates;
  $: filters = $templateFilters;
  
  onMount(async () => {
    try {
      await templateStore.loadTemplates();
    } catch (error) {
      console.error('Failed to load templates:', error);
      toast.error('Failed to load templates');
    }
  });
  
  async function handleSearch() {
    if (searchQuery.trim()) {
      try {
        const results = await templateStore.searchTemplates(searchQuery);
        templates.set(results);
      } catch (error) {
        console.error('Search failed:', error);
        toast.error('Search failed');
      }
    } else {
      await templateStore.loadTemplates();
    }
  }
  
  function updateFilter(key: keyof typeof filters, value: any) {
    templateFilters.update(f => ({ ...f, [key]: value }));
  }
  
  function clearFilters() {
    templateFilters.set({
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    searchQuery = '';
    templateStore.loadTemplates();
  }
  
  async function useTemplate(templateId: string) {
    try {
      // Increment usage count
      await templateStore.incrementUsage(templateId);
      
      // Create new resume from template
      const resume = await resumeStore.create(`Resume from Template`, templateId);
      
      toast.success('Template applied successfully');
      goto(`/editor/${resume.id}`);
    } catch (error) {
      console.error('Failed to use template:', error);
      toast.error('Failed to apply template');
    }
  }
  
  // Modal preview state
  let previewOpen = false;
  let previewLoading = false;
  let previewTemplateData: any = null;
  let previewConfig: any = null;
  
  function slugify(name: string): string {
    return (name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  
  async function previewTemplate(templateId: string) {
    try {
      previewLoading = true;
      previewOpen = true;
      previewTemplateData = await templateStore.getTemplate(templateId);
      // Try to load static config JSON by slug
      if (previewTemplateData?.name) {
        const slug = slugify(previewTemplateData.name);
        const res = await fetch(`/templates/${slug}.json`);
        if (res.ok) {
          previewConfig = await res.json();
          // Attach to template for easy access
          previewTemplateData.starterData = previewConfig.starterData;
          if (previewConfig.settings) {
            previewTemplateData.settings = previewConfig.settings;
          }
        } else {
          previewConfig = null;
        }
      }
    } catch (error) {
      console.error('Failed to load template preview:', error);
      toast.error('Failed to load template');
      previewOpen = false;
    } finally {
      previewLoading = false;
    }
  }
  
  function formatUsageCount(count: number): string {
      if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}k`;
      }
      return count.toString();
    }
    
    function goToHome() {
        console.log('Home button clicked, navigating to /');
        // Use hard navigation to ensure all state is cleared and route guards re-evaluate
        if (typeof window !== 'undefined') {
          console.log('Redirecting to home page using window.location');
          window.location.href = '/';
        } else {
          console.log('Using goto to redirect to home page');
          goto('/');
        }
      }
</script>

<div class="space-y-6">
  <!-- Header -->
    {#if !compact}
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Resume Templates</h1>
          <p class="text-gray-600">Choose from professional templates to get started quickly</p>
        </div>
        
        <div class="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            on:click={goToHome}
          >
            Home
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            on:click={() => viewMode = 'grid'}
          >
            <Grid3X3 class="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            on:click={() => viewMode = 'list'}
          >
            <List class="h-4 w-4" />
          </Button>
        </div>
      </div>
    {/if}
  
  <!-- Search and Filters -->
  <div class="flex flex-col sm:flex-row gap-4">
    <div class="flex-1 relative">
      <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        bind:value={searchQuery}
        placeholder="Search templates..."
        class="pl-10"
        on:keydown={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      />
    </div>
    
    <div class="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        on:click={() => showFilters = !showFilters}
      >
        <Filter class="h-4 w-4 mr-1" />
        Filters
      </Button>
      
      <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
        <SelectTrigger class="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt">Newest</SelectItem>
          <SelectItem value="name">Name</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
  
  <!-- Advanced Filters -->
  {#if showFilters}
    <Card>
      <CardHeader>
        <CardTitle class="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label for="category-filter" class="text-sm font-medium mb-2 block">Category</label>
            <Select value={filters.category || ''} onValueChange={(value) => updateFilter('category', value || undefined)}>
              <SelectTrigger id="category-filter">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {#each templateStore.getCategories() as category}
                  <SelectItem value={category}>{category}</SelectItem>
                {/each}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label for="type-filter" class="text-sm font-medium mb-2 block">Type</label>
            <Select value={filters.isPremium?.toString() || ''} onValueChange={(value) => updateFilter('isPremium', value === 'true' ? true : value === 'false' ? false : undefined)}>
              <SelectTrigger id="type-filter">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="false">Free</SelectItem>
                <SelectItem value="true">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label for="rating-filter" class="text-sm font-medium mb-2 block">Rating</label>
            <Select value={filters.rating?.toString() || ''} onValueChange={(value) => updateFilter('rating', value ? parseFloat(value) : undefined)}>
              <SelectTrigger id="rating-filter">
                <SelectValue placeholder="Any Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Rating</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="4.5">4.5+ Stars</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div class="flex items-end">
            <Button variant="outline" size="sm" on:click={clearFilters} class="w-full">
              Clear Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  {/if}
  
  <!-- Featured Templates -->
  {#if showFeatured && !compact && featured.length > 0}
    <div>
      <div class="flex items-center space-x-2 mb-4">
        <Sparkles class="h-5 w-5 text-yellow-500" />
        <h2 class="text-lg font-semibold">Featured Templates</h2>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each featured as template}
          <Card class="group hover:shadow-lg transition-shadow cursor-pointer">
            <div class="aspect-[3/4] bg-gray-100 rounded-t-lg overflow-hidden relative">
              {#if template.thumbnail}
                <img 
                  src={template.thumbnail} 
                  alt={template.name}
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              {:else}
                <div class="w-full h-full flex items-center justify-center text-gray-400">
                  <Eye class="h-12 w-12" />
                </div>
              {/if}
              
              <!-- Badges -->
              <div class="absolute top-2 left-2 flex flex-col space-y-1">
                {#if template.isPremium}
                  <Badge class="bg-yellow-500 text-white">
                    <Crown class="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                {/if}
                {#if template.isPopular}
                  <Badge class="bg-blue-500 text-white">
                    <Star class="h-3 w-3 mr-1" />
                    Popular
                  </Badge>
                {/if}
              </div>
              
              <!-- Actions: entire overlay opens preview -->
              <div
              class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"
              role="button"
              tabindex="0"
              on:click={() => previewTemplate(template.id)}
              on:keydown={(e) => { if (e.key === 'Enter') previewTemplate(template.id) }}
              >
              <div class="text-white font-medium bg-black/30 rounded-md px-3 py-1 flex items-center gap-2">
              <Eye class="h-4 w-4" />
              <span>Preview</span>
              </div>
              </div>
            </div>
            
            <CardContent class="p-4">
              <h3 class="font-semibold text-gray-900 mb-1">{template.name}</h3>
              <p class="text-sm text-gray-600 mb-2 line-clamp-2">{template.description}</p>
              
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  {#if template.isPremium}
                    <Badge class="bg-yellow-500 text-white">
                      <Crown class="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  {/if}
                </div>
                
                <Badge variant="outline">{template.category}</Badge>
              </div>
            </CardContent>
          </Card>
        {/each}
      </div>
      
      <Separator class="my-8" />
    </div>
  {/if}
  
  <!-- All Templates -->
  <div>
    {#if !showFeatured || compact}
      <h2 class="text-lg font-semibold mb-4">All Templates</h2>
    {:else}
      <h2 class="text-lg font-semibold mb-4">Browse All Templates</h2>
    {/if}
    
    {#if loading}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each Array(6) as _}
          <Card>
            <Skeleton class="aspect-[3/4] w-full" />
            <CardContent class="p-4">
              <Skeleton class="h-4 w-3/4 mb-2" />
              <Skeleton class="h-3 w-full mb-2" />
              <Skeleton class="h-3 w-1/2" />
            </CardContent>
          </Card>
        {/each}
      </div>
    {:else if filtered.length === 0}
      <div class="text-center py-12">
        <Eye class="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
        <p class="text-gray-600 mb-4">Try adjusting your search or filters</p>
        <Button variant="outline" on:click={clearFilters}>
          Clear Filters
        </Button>
      </div>
    {:else}
      <div class="grid grid-cols-1 {viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : ''} gap-4">
        {#each filtered as template}
          <Card class="group hover:shadow-lg transition-shadow cursor-pointer {viewMode === 'list' ? 'flex' : ''}">
            <div class="aspect-[3/4] {viewMode === 'list' ? 'w-48 flex-shrink-0' : ''} bg-gray-100 rounded-t-lg {viewMode === 'list' ? 'rounded-l-lg rounded-tr-none' : ''} overflow-hidden relative">
              {#if template.thumbnail}
                <img 
                  src={template.thumbnail} 
                  alt={template.name}
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              {:else}
                <div class="w-full h-full flex items-center justify-center text-gray-400">
                  <Eye class="h-12 w-12" />
                </div>
              {/if}
              
              <!-- Badges -->
              <div class="absolute top-2 left-2 flex flex-col space-y-1">
                {#if template.isPremium}
                  <Badge class="bg-yellow-500 text-white">
                    <Crown class="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                {/if}
                {#if template.isPopular}
                  <Badge class="bg-blue-500 text-white">
                    <Star class="h-3 w-3 mr-1" />
                    Popular
                  </Badge>
                {/if}
              </div>
              
              <!-- Actions: entire overlay opens preview -->
              <div
                class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"
                role="button"
                tabindex="0"
                on:click={() => previewTemplate(template.id)}
                on:keydown={(e) => { if (e.key === 'Enter') previewTemplate(template.id) }}
              >
                <div class="text-white font-medium bg-black/30 rounded-md px-3 py-1 flex items-center gap-2">
                  <Eye class="h-4 w-4" />
                  <span>Preview</span>
                </div>
              </div>
            </div>
            
            <CardContent class="p-4 {viewMode === 'list' ? 'flex-1' : ''}">
              <h3 class="font-semibold text-gray-900 mb-1">{template.name}</h3>
              <p class="text-sm text-gray-600 mb-2 {viewMode === 'list' ? 'line-clamp-3' : 'line-clamp-2'}">{template.description}</p>
              
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  {#if template.isPremium}
                    <Badge class="bg-yellow-500 text-white">
                      <Crown class="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  {/if}
                </div>
                
                <Badge variant="outline">{template.category}</Badge>
              </div>
            </CardContent>
          </Card>
        {/each}
      </div>
    {/if}
  </div>
  <!-- Preview Modal -->
  <Dialog.Root bind:open={previewOpen}>
    <Dialog.Content class="max-w-6xl w-[95vw]">
      <Dialog.Header>
        <Dialog.Title class="text-xl font-semibold">{previewTemplateData ? previewTemplateData.name : 'Loading template...'}</Dialog.Title>
        <Dialog.Description>
          {previewTemplateData ? previewTemplateData.category : ''}
        </Dialog.Description>
      </Dialog.Header>

      {#if previewLoading}
        <div class="space-y-4">
          <Skeleton class="h-64 w-full" />
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton class="h-24 w-full" />
            <Skeleton class="h-24 w-full" />
            <Skeleton class="h-24 w-full" />
          </div>
        </div>
      {:else if previewTemplateData}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Large preview image or placeholder -->
          <div class="lg:col-span-2">
            <div class="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              {#if previewTemplateData.thumbnail}
                <img src={previewTemplateData.thumbnail} alt={previewTemplateData.name} class="w-full h-full object-cover" />
              {:else}
                <Eye class="h-12 w-12 text-gray-400" />
              {/if}
            </div>
            {#if previewTemplateData.styleConfig}
              <div class="mt-2 text-xs text-gray-600 flex gap-3">
                <span>{previewTemplateData.styleConfig.columns === 2 ? 'Two-column layout' : 'Single-column layout'}</span>
                <span>•</span>
                <span>{previewTemplateData.styleConfig.pages === 2 ? 'Two pages' : 'One page'}</span>
                <span>•</span>
                <span>{previewTemplateData.styleConfig.withImage ? 'Includes profile image' : 'No profile image'}</span>
              </div>
            {/if}
          </div>

          <!-- Details -->
          <div class="space-y-4">
            <div>
              <p class="text-gray-700">{previewTemplateData.description}</p>
            </div>

            <div class="flex items-center gap-2">
              {#if previewTemplateData.isPremium}
                <Badge class="bg-yellow-500 text-white">
                  <Crown class="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              {/if}
              {#if previewTemplateData.isPopular}
                <Badge class="bg-blue-500 text-white">
                  <Star class="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              {/if}
              <Badge variant="outline">{previewTemplateData.category}</Badge>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="text-center p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center justify-center space-x-1 text-sm text-gray-600 mb-1">
                  <Star class="h-4 w-4 text-yellow-400 fill-current" />
                  <span>Rating</span>
                </div>
                <div class="text-lg font-semibold">{previewTemplateData.rating?.toFixed ? previewTemplateData.rating.toFixed(1) : '—'}</div>
              </div>

              <div class="text-center p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center justify-center space-x-1 text-sm text-gray-600 mb-1">
                  <Download class="h-4 w-4" />
                  <span>Uses</span>
                </div>
                <div class="text-lg font-semibold">{formatUsageCount(previewTemplateData.usageCount || 0)}</div>
              </div>
            </div>

            {#if previewTemplateData.styleConfig}
              <div class="grid grid-cols-3 gap-2">
                <Badge variant="outline">{previewTemplateData.styleConfig.columns === 2 ? 'Two Columns' : 'Single Column'}</Badge>
                <Badge variant="outline">{previewTemplateData.styleConfig.pages === 2 ? 'Two Pages' : 'One Page'}</Badge>
                <Badge variant="outline">{previewTemplateData.styleConfig.withImage ? 'Profile Image' : 'No Image'}</Badge>
              </div>
            {/if}

            <div class="flex gap-2">
              <Button class="flex-1" on:click={() => {
                try {
                  const draft = (previewTemplateData?.starterData || previewConfig?.starterData) ? { ...(previewTemplateData?.starterData || previewConfig?.starterData) } : {};
                  // Map styleConfig to builder settings hints
                  const sc = previewTemplateData?.styleConfig;
                  if (sc) {
                    draft.settings = {
                      ...(draft.settings || {}),
                      layout: sc.pages === 2 ? '2-page' : '1-page',
                      showProfileImage: sc.withImage
                    };
                  }
                  localStorage.setItem('builderDraft', JSON.stringify(draft));
                } catch (e) {
                  console.warn('Failed to store builder draft:', e);
                }
                goto('/builder');
              }}>
                <Download class="h-4 w-4 mr-2" />
                Use This Template
              </Button>
              <Dialog.Close asChild>
                <button class="inline-flex items-center justify-center h-9 px-4 rounded-md border">Close</button>
              </Dialog.Close>
            </div>
          </div>
        </div>
      {:else}
        <div class="text-center py-8">
          <p class="text-gray-600">Template not found.</p>
        </div>
      {/if}
    </Dialog.Content>
  </Dialog.Root>
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>