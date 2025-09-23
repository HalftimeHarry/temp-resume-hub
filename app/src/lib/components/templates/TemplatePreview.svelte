<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { templateStore } from '$lib/stores/templates';
  import { resumeStore } from '$lib/stores/resume';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Separator } from '$lib/components/ui/separator';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { 
    ArrowLeft, 
    Download, 
    Star, 
    Crown, 
    Eye, 
    Heart,
    Share2,
    Sparkles,
    Users,
    Calendar
  } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  import type { ResumeTemplate } from '$lib/types/resume';
  import ResumePreview from '../resume/ResumePreview.svelte';
  
  export let templateId: string;
  
  let template: ResumeTemplate | null = null;
  let isLoading = true;
  let isUsing = false;
  let currentImageIndex = 0;
  let selectedStyleIndex = 0;

  const pbPreviewIndexByStyleKey: Record<string, number> = {
    'single-column': 0,
    'two-column': 1,
    'two-page': 2,
    'with-image': 3
  };
  
  // Sample resume data for preview
  const sampleResume = {
    id: 'preview',
    userId: 'preview',
    title: 'Sample Resume',
    slug: 'sample-resume',
    personalInfo: {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      website: 'https://johndoe.com',
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      summary: 'Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Passionate about creating scalable solutions and leading high-performing teams.',
      profileImage: ''
    },
    sections: [
      {
        id: 'experience',
        type: 'experience' as const,
        title: 'Work Experience',
        visible: true,
        order: 0,
        data: [
          {
            id: '1',
            company: 'Tech Corp',
            position: 'Senior Software Engineer',
            location: 'San Francisco, CA',
            startDate: '2021-03',
            endDate: '',
            current: true,
            description: 'Lead development of scalable web applications serving millions of users.',
            highlights: [
              'Improved application performance by 40% through optimization',
              'Led a team of 5 developers on critical product features',
              'Implemented CI/CD pipeline reducing deployment time by 60%'
            ]
          },
          {
            id: '2',
            company: 'StartupXYZ',
            position: 'Full Stack Developer',
            location: 'San Francisco, CA',
            startDate: '2019-06',
            endDate: '2021-02',
            current: false,
            description: 'Developed and maintained multiple web applications using modern technologies.',
            highlights: [
              'Built responsive web applications using React and Node.js',
              'Collaborated with design team to implement pixel-perfect UIs',
              'Reduced bug reports by 30% through comprehensive testing'
            ]
          }
        ]
      },
      {
        id: 'education',
        type: 'education' as const,
        title: 'Education',
        visible: true,
        order: 1,
        data: [
          {
            id: '1',
            institution: 'University of California, Berkeley',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            location: 'Berkeley, CA',
            startDate: '2015-08',
            endDate: '2019-05',
            current: false,
            gpa: '3.8/4.0',
            honors: ['Magna Cum Laude', 'Dean\'s List'],
            description: 'Relevant coursework: Data Structures, Algorithms, Software Engineering, Database Systems'
          }
        ]
      },
      {
        id: 'skills',
        type: 'skills' as const,
        title: 'Skills',
        visible: true,
        order: 2,
        data: [
          { id: '1', name: 'JavaScript', level: 'expert' as const, category: 'Programming Languages' },
          { id: '2', name: 'React', level: 'expert' as const, category: 'Frameworks & Libraries' },
          { id: '3', name: 'Node.js', level: 'advanced' as const, category: 'Frameworks & Libraries' },
          { id: '4', name: 'Python', level: 'advanced' as const, category: 'Programming Languages' },
          { id: '5', name: 'AWS', level: 'intermediate' as const, category: 'Cloud Platforms' },
          { id: '6', name: 'Docker', level: 'intermediate' as const, category: 'Tools & Technologies' }
        ]
      }
    ],
    settings: {
      template: 'modern',
      colorScheme: 'blue',
      fontSize: 'medium' as const,
      spacing: 'normal' as const,
      showProfileImage: false,
      sectionOrder: ['experience', 'education', 'skills']
    },
    isPublic: false,
    isTemplate: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 0,
    downloadCount: 0,
    shareCount: 0,
    tags: [],
    metadata: {
      version: '1.0',
      exportFormats: ['pdf', 'docx']
    }
  };
  
  onMount(async () => {
    try {
      template = await templateStore.getTemplate(templateId);
      
      // Apply template settings to sample resume
      if (template) {
        sampleResume.settings = { ...sampleResume.settings, ...template.settings };
        selectedStyleIndex = 0;
        // Fallback styles from catalog if none in template
        if (!template.styles || template.styles.length === 0) {
          try {
            const catRes = await fetch('/templates/style-catalog.json');
            if (catRes.ok) {
              const cat = await catRes.json();
              if (cat?.styles?.length) {
                template = { ...template, styles: cat.styles };
              }
            }
          } catch (e) {
            console.warn('No style catalog found');
          }
        }
      }
    } catch (error) {
      console.error('Failed to load template:', error);
      toast.error('Failed to load template');
      goto('/templates');
    } finally {
      isLoading = false;
    }
  });
  
  async function useTemplate() {
    if (!template) return;
    
    isUsing = true;
    try {
      // Increment usage count
      await templateStore.incrementUsage(template.id);
      
      // Create new resume from template
      const resume = await resumeStore.create(`Resume from ${template.name}`, template.id);
      
      toast.success('Template applied successfully');
      goto(`/editor/${resume.id}`);
    } catch (error) {
      console.error('Failed to use template:', error);
      toast.error('Failed to apply template');
    } finally {
      isUsing = false;
    }
  }
  
  function goBack() {
    goto('/templates');
  }
  
  function nextImage() {
    if (template && template.previewImages.length > 0) {
      currentImageIndex = (currentImageIndex + 1) % template.previewImages.length;
    }
  }
  
  function prevImage() {
    if (template && template.previewImages.length > 0) {
      currentImageIndex = currentImageIndex === 0 
        ? template.previewImages.length - 1 
        : currentImageIndex - 1;
    }
  }
  
  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  function formatUsageCount(count: number): string {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  }
</script>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center space-x-4">
          <Button variant="ghost" size="sm" on:click={goBack}>
            <ArrowLeft class="h-4 w-4 mr-1" />
            Back to Templates
          </Button>
          
          {#if template}
            <Separator orientation="vertical" class="h-6" />
            <div>
              <h1 class="text-lg font-semibold">{template.name}</h1>
              <p class="text-sm text-gray-600">{template.category}</p>
            </div>
          {/if}
        </div>
        
        <div class="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            <Heart class="h-4 w-4 mr-1" />
            Save
          </Button>
          
          <Button variant="outline" size="sm" disabled>
            <Share2 class="h-4 w-4 mr-1" />
            Share
          </Button>
          
          <Button 
            size="sm" 
            on:click={useTemplate}
            disabled={isUsing || !template}
          >
            {#if isUsing}
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
              Using...
            {:else}
              <Download class="h-4 w-4 mr-1" />
              Use Template
            {/if}
          </Button>
        </div>
      </div>
    </div>
  </header>
  
  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    {#if isLoading}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <Skeleton class="h-96 w-full" />
        </div>
        <div class="space-y-4">
          <Skeleton class="h-32 w-full" />
          <Skeleton class="h-48 w-full" />
        </div>
      </div>
    {:else if template}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Preview Panel -->
        <div class="lg:col-span-2">
          <Card>
            <CardHeader>
              <div class="flex items-center justify-between">
                <CardTitle class="flex items-center space-x-2">
                  <Eye class="h-5 w-5" />
                  <span>Live Preview</span>
                </CardTitle>
                
                <div class="flex items-center space-x-2">
                  {#if template?.styles && template.styles.length > 0}
                    <div class="hidden lg:flex items-center gap-2">
                      {#each template.styles as s, i}
                        <button class="px-3 py-1 text-xs rounded border {i === selectedStyleIndex ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-100'}" on:click={() => {
                          selectedStyleIndex = i;
                          const sc = template.styles[i]?.styleConfig;
                          const st = template.styles[i]?.settings;
                          if (sc) {
                            sampleResume.settings = {
                              ...sampleResume.settings,
                              showProfileImage: sc.withImage
                            };
                          }
                          if (st) {
                            sampleResume.settings = { ...sampleResume.settings, ...st };
                          }
                        }}>
                          {s.label}
                        </button>
                      {/each}
                    </div>
                  {/if}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div class="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <ResumePreview resume={sampleResume} />
              </div>
              {#if template?.styles && template.styles[selectedStyleIndex]?.styleConfig}
                <div class="mt-2 text-xs text-gray-600 flex gap-3">
                  {@const sc = template.styles[selectedStyleIndex].styleConfig}
                  <span>{sc.columns === 2 ? 'Two-column layout' : 'Single-column layout'}</span>
                  <span>•</span>
                  <span>{sc.pages === 2 ? 'Two pages' : 'One page'}</span>
                  <span>•</span>
                  <span>{sc.withImage ? 'Includes profile image' : 'No profile image'}</span>
                </div>
              {/if}
            </CardContent>
          </Card>
        </div>
        
        <!-- Template Info Panel -->
        <div class="space-y-6">
          <!-- Template Details -->
          <Card>
            <CardHeader>
              <div class="flex items-start justify-between">
                <div>
                  <CardTitle class="flex items-center space-x-2">
                    <span>{template.name}</span>
                    {#if template.isPremium}
                      <Crown class="h-4 w-4 text-yellow-500" />
                    {/if}
                  </CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </div>
                
                <div class="flex flex-col items-end space-y-1">
                  {#if template.isPopular}
                    <Badge class="bg-blue-500 text-white">
                      <Sparkles class="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  {/if}
                  {#if template.isPremium}
                    <Badge class="bg-yellow-500 text-white">
                      <Crown class="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  {/if}
                </div>
              </div>
            </CardHeader>
            <CardContent class="space-y-4">
              <!-- Stats -->
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center justify-center space-x-1 text-sm text-gray-600 mb-1">
                    <Star class="h-4 w-4 text-yellow-400 fill-current" />
                    <span>Rating</span>
                  </div>
                  <div class="text-lg font-semibold">{template.rating.toFixed(1)}</div>
                </div>
                
                <div class="text-center p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center justify-center space-x-1 text-sm text-gray-600 mb-1">
                    <Users class="h-4 w-4" />
                    <span>Uses</span>
                  </div>
                  <div class="text-lg font-semibold">{formatUsageCount(template.usageCount)}</div>
                </div>
              </div>
              
              <!-- Category and Tags -->
              <div class="space-y-3">
                <div>
                  <label class="text-sm font-medium text-gray-700">Category</label>
                  <div class="mt-1">
                    <Badge variant="outline">{template.category}</Badge>
                  </div>
                </div>
                
                {#if template.tags.length > 0}
                  <div>
                    <label class="text-sm font-medium text-gray-700">Tags</label>
                    <div class="mt-1 flex flex-wrap gap-1">
                      {#each template.tags as tag}
                        <Badge variant="secondary" class="text-xs">{tag}</Badge>
                      {/each}
                    </div>
                  </div>
                {/if}
              </div>
              
              <!-- Created Date -->
              <div class="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar class="h-4 w-4" />
                <span>Created {formatDate(template.createdAt)}</span>
              </div>
              
              <!-- Use Template Button -->
              <Button 
                class="w-full" 
                on:click={useTemplate}
                disabled={isUsing}
              >
                {#if isUsing}
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Resume...
                {:else}
                  <Download class="h-4 w-4 mr-2" />
                  Use This Template
                {/if}
              </Button>
            </CardContent>
          </Card>
          
          <!-- Additional Images -->
          {#if (template.styles && template.styles[selectedStyleIndex]?.previewImages && template.styles[selectedStyleIndex].previewImages.length) || template.previewImages.length > 0}
            <Card>
              <CardHeader>
                <CardTitle>More Views</CardTitle>
                <CardDescription>
                  Additional preview images of this template
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div class="space-y-3">
                  <!-- Current Image -->
                  <div class="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                    {#if template.styles && template.styles[selectedStyleIndex]?.previewImages?.length}
                      <img 
                        src={template.styles[selectedStyleIndex].previewImages[currentImageIndex]} 
                        alt={`${template.name} preview ${currentImageIndex + 1}`}
                        class="w-full h-full object-cover"
                      />
                    {:else if template.styles && template.previewImages && template.styles[selectedStyleIndex]?.key && pbPreviewIndexByStyleKey[template.styles[selectedStyleIndex].key] !== undefined}
                      {@const idx = pbPreviewIndexByStyleKey[template.styles[selectedStyleIndex].key]}
                      {#if template.previewImages[idx]}
                        <img 
                          src={template.previewImages[idx]} 
                          alt={`${template.name} preview by style`}
                          class="w-full h-full object-cover"
                        />
                      {:else}
                        <img 
                          src={template.previewImages[currentImageIndex]} 
                          alt={`${template.name} preview ${currentImageIndex + 1}`}
                          class="w-full h-full object-cover"
                        />
                      {/if}
                    {:else}
                      <img 
                        src={template.previewImages[currentImageIndex]} 
                        alt={`${template.name} preview ${currentImageIndex + 1}`}
                        class="w-full h-full object-cover"
                      />
                    {/if}
                  </div>
                  
                  <!-- Image Navigation -->
                  {#if (template.styles && template.styles[selectedStyleIndex]?.previewImages?.length > 1) || template.previewImages.length > 1}
                    <div class="flex items-center justify-between">
                      <Button size="sm" variant="outline" on:click={prevImage}>
                        Previous
                      </Button>
                      
                      <span class="text-sm text-gray-600">
                        {currentImageIndex + 1} of {(template.styles && template.styles[selectedStyleIndex]?.previewImages?.length) || template.previewImages.length}
                      </span>
                      
                      <Button size="sm" variant="outline" on:click={nextImage}>
                        Next
                      </Button>
                    </div>
                  {/if}
                  
                  <!-- Thumbnail Navigation -->
                  {#if (template.styles && template.styles[selectedStyleIndex]?.previewImages?.length > 1) || template.previewImages.length > 1}
                    <div class="grid grid-cols-4 gap-2">
                      {#if template.styles && template.styles[selectedStyleIndex]?.previewImages?.length}
                        {#each template.styles[selectedStyleIndex].previewImages as image, index}
                          <button
                            class="aspect-[3/4] bg-gray-100 rounded border-2 overflow-hidden transition-all {currentImageIndex === index ? 'border-blue-500' : 'border-transparent hover:border-gray-300'}"
                            on:click={() => currentImageIndex = index}
                          >
                            <img 
                              src={image} 
                              alt={`${template.name} thumbnail ${index + 1}`}
                              class="w-full h-full object-cover"
                            />
                          </button>
                        {/each}
                      {:else}
                        {#each template.previewImages as image, index}
                          <button
                            class="aspect-[3/4] bg-gray-100 rounded border-2 overflow-hidden transition-all {currentImageIndex === index ? 'border-blue-500' : 'border-transparent hover:border-gray-300'}"
                            on:click={() => currentImageIndex = index}
                          >
                            <img 
                              src={image} 
                              alt={`${template.name} thumbnail ${index + 1}`}
                              class="w-full h-full object-cover"
                            />
                          </button>
                        {/each}
                      {/if}
                    </div>
                  {/if}
                </div>
              </CardContent>
            </Card>
          {/if}
        </div>
      </div>
    {:else}
      <div class="text-center py-12">
        <Eye class="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Template not found</h3>
        <p class="text-gray-600 mb-4">The template you're looking for doesn't exist or has been removed.</p>
        <Button on:click={goBack}>
          Back to Templates
        </Button>
      </div>
    {/if}
  </main>
</div>