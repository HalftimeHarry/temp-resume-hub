<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  // Simplified imports for now
  let userResumes = [];
  let userAnalytics = {
    totalResumes: 0,
    totalViews: 0,
    totalDownloads: 0,
    totalShares: 0
  };
  import { currentUser, isAuthenticated } from '$lib/stores/auth';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { Separator } from '$lib/components/ui/separator';
  import { 
    Plus, 
    Search, 
    Eye, 
    Download, 
    Share2, 
    Edit3,
    Trash2,
    Copy,
    MoreHorizontal,
    FileText,
    BarChart3,
    TrendingUp,
    Calendar,
    Filter,
    Grid3X3,
    List,
    Star
  } from 'lucide-svelte';
  import LogoIcon from '$lib/components/ui/LogoIcon.svelte';
  import { toast } from 'svelte-sonner';
  // Simplified - remove complex components for now
  import type { Resume } from '$lib/types/resume';
  
  let searchQuery = '';
  let viewMode: 'grid' | 'list' = 'grid';
  let activeTab: 'resumes' | 'analytics' | 'templates' = 'resumes';
  let isLoading = true;
  let selectedResume: Resume | null = null;
  let showShareDialog = false;
  
  $: resumes = userResumes;
  $: analytics = userAnalytics;
  $: user = $currentUser;
  
  // Filter resumes based on search query
  $: filteredResumes = resumes.filter(resume => 
    resume.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resume.personalInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Temporarily disable auth redirect for debugging
  // $: {
  //   if (!$isAuthenticated && !isLoading) {
  //     goto('/auth/login');
  //   }
  // }

  onMount(async () => {
    // Only load data if authenticated
    if (!$isAuthenticated) {
      isLoading = false;
      return;
    }

    // Simplified loading for now
    isLoading = false;
  });
  
  function createNewResume() {
    console.log('Create Resume button clicked!');
    try {
      goto('/builder');
    } catch (error) {
      console.error('Error navigating to builder:', error);
    }
  }
  
  function editResume(resumeId: string) {
    goto('/builder');
  }
  
  function viewResume(resumeId: string) {
    goto(`/resume/${resumeId}`);
  }
  
  function shareResume(resume: Resume) {
    selectedResume = resume;
    showShareDialog = true;
  }
  
  async function duplicateResume(resume: Resume) {
    try {
      const newResume = await resumeStore.create(`${resume.title} (Copy)`, resume.templateId);
      // Copy data from original resume
      resumeStore.update({
        ...newResume,
        personalInfo: resume.personalInfo,
        sections: resume.sections,
        settings: resume.settings
      });
      toast.success('Resume duplicated successfully');
    } catch (error) {
      console.error('Failed to duplicate resume:', error);
      toast.error('Failed to duplicate resume');
    }
  }
  
  async function deleteResume(resumeId: string, title: string) {
    if (confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      try {
        await resumeStore.delete(resumeId);
        toast.success('Resume deleted successfully');
      } catch (error) {
        console.error('Failed to delete resume:', error);
        toast.error('Failed to delete resume');
      }
    }
  }
  
  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  function formatNumber(num: number): string {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  }
</script>

<svelte:head>
  <title>Dashboard - Digital Resume Hub</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <header class="bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center space-x-3">
          <img src="/icon.svg" alt="Digital Resume Hub" class="h-8 w-8" />
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p class="text-sm text-gray-600">Welcome back, {user?.name || 'User'}!</p>
          </div>
        </div>
        
        <button 
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          on:click={createNewResume}
        >
          + New Resume
        </button>
      </div>
    </div>
  </header>
  
  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <!-- Quick Stats -->
    {#if !isLoading && analytics}
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <Card>
          <CardContent class="p-4 md:p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs md:text-sm font-medium text-gray-600">Total Resumes</p>
                <p class="text-xl md:text-2xl font-bold">{analytics.totalResumes}</p>
              </div>
              <div class="h-10 w-10 md:h-12 md:w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <div class="text-blue-600">
                  <LogoIcon size={34} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent class="p-4 md:p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Total Views</p>
                <p class="text-2xl font-bold">{formatNumber(analytics.totalViews)}</p>
              </div>
              <div class="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <Eye class="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent class="p-4 md:p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Downloads</p>
                <p class="text-2xl font-bold">{formatNumber(analytics.totalDownloads)}</p>
              </div>
              <div class="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Download class="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent class="p-4 md:p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Shares</p>
                <p class="text-2xl font-bold">{formatNumber(analytics.totalShares)}</p>
              </div>
              <div class="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Share2 class="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    {/if}
    
    <!-- Navigation Tabs -->
    <div class="flex items-center space-x-1 mb-6">
      <Button
        variant={activeTab === 'resumes' ? 'default' : 'ghost'}
        size="sm"
        on:click={() => activeTab = 'resumes'}
      >
        <FileText class="h-4 w-4 mr-1" />
        My Resumes
      </Button>
      <Button
        variant={activeTab === 'analytics' ? 'default' : 'ghost'}
        size="sm"
        on:click={() => activeTab = 'analytics'}
      >
        <BarChart3 class="h-4 w-4 mr-1" />
        Analytics
      </Button>
      <Button
        variant={activeTab === 'templates' ? 'default' : 'ghost'}
        size="sm"
        on:click={() => activeTab = 'templates'}
      >
        <Star class="h-4 w-4 mr-1" />
        Templates
      </Button>
    </div>
    
    <!-- Content based on active tab -->
    {#if activeTab === 'resumes'}
      <!-- Resumes Tab -->
      <div class="space-y-6">
        <!-- Search and Filters -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
          <div class="flex-1 relative max-w-md">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              bind:value={searchQuery}
              placeholder="Search resumes..."
              class="pl-10 h-10 md:h-auto"
            />
          </div>
          
          <div class="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled
            >
              <Filter class="h-4 w-4 mr-1" />
              Filter
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
        
        <!-- Resumes Grid/List -->
        {#if isLoading}
          <div class="grid grid-cols-1 {viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : ''} gap-4">
            {#each Array(6) as _}
              <Card>
                <CardContent class="p-6">
                  <Skeleton class="h-6 w-3/4 mb-2" />
                  <Skeleton class="h-4 w-full mb-4" />
                  <div class="flex items-center justify-between">
                    <Skeleton class="h-4 w-20" />
                    <Skeleton class="h-8 w-20" />
                  </div>
                </CardContent>
              </Card>
            {/each}
          </div>
        {:else if filteredResumes.length === 0}
          <div class="text-center py-12">
            {#if resumes.length === 0}
              <FileText class="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 class="text-lg font-medium text-gray-900 mb-2">No resumes yet</h3>
              <p class="text-gray-600 mb-6">Create your first resume to get started</p>
              <button
                class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
                on:click={createNewResume}
              >
                <Plus class="h-4 w-4 mr-2" />
                Create Resume
              </button>
            {:else}
              <Search class="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 class="text-lg font-medium text-gray-900 mb-2">No resumes found</h3>
              <p class="text-gray-600">Try adjusting your search query</p>
            {/if}
          </div>
        {:else}
          <div class="grid grid-cols-1 {viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : ''} gap-4">
            {#each filteredResumes as resume (resume.id)}
              <Card class="group hover:shadow-lg transition-shadow {viewMode === 'list' ? 'flex' : ''}">
                <CardContent class="p-6 {viewMode === 'list' ? 'flex-1 flex items-center justify-between' : ''}">
                  <div class="{viewMode === 'list' ? 'flex-1' : ''}">
                    <div class="flex items-start justify-between mb-2">
                      <h3 class="font-semibold text-gray-900 truncate {viewMode === 'list' ? 'text-lg' : ''}">{resume.title}</h3>
                      {#if viewMode === 'grid'}
                        <div class="relative">
                          <Button variant="ghost" size="sm" class="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal class="h-4 w-4" />
                          </Button>
                        </div>
                      {/if}
                    </div>
                    
                    <p class="text-sm text-gray-600 mb-4 {viewMode === 'list' ? 'line-clamp-1' : 'line-clamp-2'}">
                      {resume.personalInfo.fullName || 'No name set'}
                    </p>
                    
                    <div class="flex items-center justify-between {viewMode === 'list' ? 'mb-0' : 'mb-4'}">
                      <div class="flex items-center space-x-4 text-xs text-gray-500">
                        <div class="flex items-center space-x-1">
                          <Eye class="h-3 w-3" />
                          <span>{resume.viewCount}</span>
                        </div>
                        <div class="flex items-center space-x-1">
                          <Download class="h-3 w-3" />
                          <span>{resume.downloadCount}</span>
                        </div>
                        <div class="flex items-center space-x-1">
                          <Share2 class="h-3 w-3" />
                          <span>{resume.shareCount}</span>
                        </div>
                      </div>
                      
                      {#if resume.isPublic}
                        <Badge variant="default" class="text-xs">Public</Badge>
                      {:else}
                        <Badge variant="secondary" class="text-xs">Private</Badge>
                      {/if}
                    </div>
                    
                    {#if viewMode === 'grid'}
                      <div class="text-xs text-gray-500 mb-4">
                        Updated {formatDate(resume.updatedAt)}
                      </div>
                    {/if}
                  </div>
                  
                  <div class="flex items-center space-x-2 {viewMode === 'list' ? 'ml-4' : ''}">
                    <Button variant="outline" size="sm" on:click={() => viewResume(resume.id)}>
                      <Eye class="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" on:click={() => editResume(resume.id)}>
                      <Edit3 class="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    
                    {#if viewMode === 'list'}
                      <Button variant="outline" size="sm" on:click={() => shareResume(resume)}>
                        <Share2 class="h-4 w-4 mr-1" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm" on:click={() => duplicateResume(resume)}>
                        <Copy class="h-4 w-4 mr-1" />
                        Duplicate
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        class="text-red-600 hover:text-red-700"
                        on:click={() => deleteResume(resume.id, resume.title)}
                      >
                        <Trash2 class="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    {/if}
                  </div>
                </CardContent>
              </Card>
            {/each}
          </div>
        {/if}
      </div>
      
    {:else if activeTab === 'analytics'}
      <!-- Analytics Tab -->
      <div class="text-center py-12">
        <BarChart3 class="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
        <p class="text-gray-600">Track your resume views, downloads, and engagement.</p>
      </div>
      
    {:else if activeTab === 'templates'}
      <!-- Templates Tab -->
      <div class="text-center py-12">
        <Star class="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Templates Coming Soon</h3>
        <p class="text-gray-600">Browse and select from professional resume templates.</p>
      </div>
    {/if}
  </main>
</div>

<!-- Share Dialog - Simplified for now -->

<style>
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>