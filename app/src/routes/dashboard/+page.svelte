<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { goto, afterNavigate } from '$app/navigation';
  import { currentUser, isAuthenticated, authStore } from '$lib/stores/auth';
  import { pb } from '$lib/pocketbase';
  import { userResumes, resumeStore } from '$lib/stores/resume';
  import { userProfile, isProfileComplete, profileCompletionPercentage } from '$lib/stores/userProfile';
  
  let userAnalytics = {
    totalResumes: 0,
    totalViews: 0,
    totalDownloads: 0,
    totalShares: 0
  };
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { Separator } from '$lib/components/ui/separator';
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
  } from '$lib/components/ui/dialog';
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
    Star,
    LogOut,
    User,
    Settings,
    Sparkles,
    Menu,
    X
   } from 'lucide-svelte';
  import LogoIcon from '$lib/components/ui/LogoIcon.svelte';
  import { AlertCircle, CheckCircle } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  // Simplified - remove complex components for now
  import type { Resume } from '$lib/types/resume';
  import { POCKETBASE_URL } from '$lib/config';
  
  let searchQuery = '';
  let viewMode: 'grid' | 'list' = 'grid';
  let activeTab: 'resumes' | 'analytics' | 'templates' = 'resumes';
  let mobileMenuOpen = false;
  let isNavigating = false;
  
  // Debug reactive statement
  $: {
    console.log('Mobile menu state changed:', mobileMenuOpen);
  }

  // Close mobile menu when clicking outside
  function handleClickOutside(event: MouseEvent) {
    if (mobileMenuOpen && 
        !(event.target as Element).closest('.mobile-menu-container') &&
        !(event.target as Element).closest('[data-mobile-menu-button]')) {
      mobileMenuOpen = false;
    }
  }
  let isLoading = true;
  let selectedResume: Resume | null = null;
  let showShareDialog = false;
  let isImporting = false;
  let showImportDialog = false;
  let csvData = '';
  let importDebug: {
    startedAt?: string;
    url?: string;
    status?: number;
    ok?: boolean;
    bodySentBytes?: number;
    result?: any;
    error?: string;
    pocketbaseAuth?: {
      isValid: boolean;
      model: any;
    };
  } = {};
  let importDebugText = '';
  
  // Use the userProfile store instead of a separate variable
  $: currentUserProfile = $userProfile;
  
  $: resumes = $userResumes;
  $: analytics = userAnalytics;
  $: user = $currentUser;
  
  // Filter resumes based on search query
  $: filteredResumes = resumes.filter(resume =>
    (resume.title && resume.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (resume.content?.personalInfo && resume.content.personalInfo.fullName && resume.content.personalInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Redirect to login if not authenticated
  $: {
    if (!$isAuthenticated && !isLoading) {
      goto('/auth/login');
    }
  }

  // Reset navigation state after any navigation
  afterNavigate(() => {
    isNavigating = false;
  });

  onMount(async () => {
    // Reset navigation state
    isNavigating = false;
    
    // Add click outside handler for mobile menu (browser only)
    if (typeof document !== 'undefined') {
      document.addEventListener('click', handleClickOutside);
    }
    
    // Only load data if authenticated
    if (!$isAuthenticated) {
      isLoading = false;
      return;
    }

    try {
      // Note: User profile is automatically loaded by the userProfile store
      // when the user logs in, so we don't need to fetch it here
      console.log('📊 Dashboard: Current user profile:', $userProfile);
      
      // Load user's resumes
      const loadedResumes = await resumeStore.loadUserResumes();
      
      // Update analytics with real data
      userAnalytics.totalResumes = loadedResumes.length;
      userAnalytics.totalViews = loadedResumes.reduce((sum, resume) => sum + (resume.content?.viewCount || 0), 0);
      userAnalytics.totalDownloads = loadedResumes.reduce((sum, resume) => sum + (resume.content?.downloadCount || 0), 0);
      userAnalytics.totalShares = loadedResumes.reduce((sum, resume) => sum + (resume.content?.shareCount || 0), 0);
    } catch (error) {
      console.error('Failed to load resumes:', error);
      toast.error('Failed to load resumes');
    } finally {
      isLoading = false;
    }
  });

  onDestroy(() => {
    if (typeof document !== 'undefined') {
      document.removeEventListener('click', handleClickOutside);
    }
  });
  
  function createNewResume() {
    console.log('Create Resume button clicked!');
    try {
      console.log('Navigating to /builder for new resume');
      goto('/builder'); // No edit parameter = new resume
      console.log('Navigation to /builder initiated');
    } catch (error) {
      console.error('Error navigating to builder:', error);
    }
  }

  async function handleLogout() {
    console.log('🔓 Logout button clicked!');
    console.log('🔓 Attempting logout');
    try {
      const result = await authStore.logout();
      console.log('🔓 Logout result:', result);
      if (typeof window !== 'undefined') {
        console.log('🔓 Redirecting to home page');
        window.location.href = '/';
      } else {
        console.log('🔓 Using goto to redirect to home page');
        goto('/');
      }
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }
   
   function editResume(resumeId: string) {
    goto(`/builder?edit=${resumeId}`);
  }
  
  function viewResume(resume: Resume) {
    // Use slug if available, otherwise fallback to ID
    const identifier = resume.slug || resume.id;
    goto(`/resume/${identifier}`);
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
        content: {
          ...resume.content,
          personalInfo: resume.content?.personalInfo,
          sections: resume.content?.sections,
          settings: resume.content?.settings
        }
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
  
  async function importTemplatesFromCSV() {
    if (!user || !csvData) {
      console.log('Import failed: user or csvData missing', { user, csvDataLength: csvData?.length });
      importDebug = {
        error: 'Missing user or csvData',
        pocketbaseAuth: { isValid: pb.authStore.isValid, model: pb.authStore.model }
      };
      importDebugText = JSON.stringify(importDebug, null, 2);
      return;
    }
    
    console.log('Starting template import for user:', user.id);
    console.log('Current PocketBase auth state:', pb.authStore.isValid);
    console.log('Current PocketBase model:', pb.authStore.model);
    
    isImporting = true;
    importDebug = { startedAt: new Date().toISOString(), pocketbaseAuth: { isValid: pb.authStore.isValid, model: pb.authStore.model } };
    try {
      // Use the PocketBase URL directly
      const url = `${POCKETBASE_URL}/api/import-templates/${user.id}`;
      console.log('Sending request to:', url);
      importDebug.url = url;
      const body = JSON.stringify({ csvData });
      importDebug.bodySentBytes = body.length;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(pb.authStore.token ? { 'Authorization': `Bearer ${pb.authStore.token}` } : {})
        },
        body
      });
      
      importDebug.status = response.status;
      importDebug.ok = response.ok;
      console.log('Response status:', response.status);
      const result = await response.json().catch(() => ({}));
      importDebug.result = result;
      console.log('Response data:', result);
      
      if (result.success) {
        toast.success('Templates imported successfully!', {
          description: result.message
        });
        showImportDialog = false;
        csvData = '';
      } else {
        toast.error('Template import failed!', {
          description: result.message
        });
      }
    } catch (error) {
      console.error('Failed to import templates:', error);
      const msg = error instanceof Error ? error.message : String(error);
      importDebug.error = msg;
      toast.error('Failed to import templates', {
        description: msg
      });
    } finally {
      isImporting = false;
      importDebugText = JSON.stringify(importDebug, null, 2);
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
  <title>Dashboard</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <header class="bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Left side: Logo and title -->
        <div class="flex items-center space-x-3">
          <img src="/icon.svg" alt="Digital Resume Hub" class="h-8 w-8" />
          <div class="hidden sm:block">
            <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p class="text-sm text-gray-600">Welcome back, {user?.name || 'User'}!</p>
          </div>
          <div class="sm:hidden">
            <h1 class="text-xl font-bold text-gray-900">Dashboard</h1>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="sm:hidden">
          <button
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
            data-mobile-menu-button
            on:click={() => {
              console.log('Hamburger menu clicked! Current state:', mobileMenuOpen);
              mobileMenuOpen = !mobileMenuOpen;
              console.log('New state:', mobileMenuOpen);
            }}
            aria-expanded={mobileMenuOpen}
          >
            <span class="sr-only">Open main menu</span>
            <div class="relative w-6 h-6">
              <Menu class="h-6 w-6 transition-all duration-300 {mobileMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}" />
              <X class="h-6 w-6 absolute inset-0 transition-all duration-300 {mobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}" />
            </div>
          </button>
        </div>

        <!-- Desktop navigation -->
        <div class="hidden sm:flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <!-- Profile Completion Notification -->
          {#if $userProfile}
            {#if $profileCompletionPercentage < 85}
              <div class="flex items-center bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm w-full sm:w-auto">
                <AlertCircle class="h-4 w-4 text-amber-600 mr-2 flex-shrink-0" />
                <span class="text-amber-800 flex-1">
                  Profile {$profileCompletionPercentage}% complete
                </span>
                <button 
                  class="ml-2 text-amber-600 hover:text-amber-700 font-medium whitespace-nowrap"
                  on:click={() => goto('/onboarding')}
                >
                  Complete now
                </button>
              </div>
            {:else if $profileCompletionPercentage < 100}
              <div class="flex items-center bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-sm w-full sm:w-auto">
                <CheckCircle class="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                <span class="text-blue-800 flex-1">
                  Profile {$profileCompletionPercentage}% complete
                </span>
                <button 
                  class="ml-2 text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
                  on:click={() => goto('/onboarding')}
                >
                  Finish profile
                </button>
              </div>
            {:else}
              <div class="flex items-center bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm">
                <CheckCircle class="h-4 w-4 text-green-600 mr-2" />
                <span class="text-green-800">Profile 100% complete</span>
              </div>
            {/if}
          {/if}
          
          <button
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full sm:w-auto"
            on:click={createNewResume}
          >
            + New Resume
          </button>
          {#if user}
            <div class="flex items-center gap-2 ml-2">
              <div class="hidden md:flex items-center gap-2 text-sm text-gray-700">
                <User class="h-4 w-4 text-gray-500" />
                <span>{user.email}</span>
              </div>
              {#if currentUserProfile?.role === 'admin'}
                <button
                  class="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 bg-red-600 text-white hover:bg-red-700 h-8 gap-1.5 rounded-md px-3"
                  title="Admin Dashboard"
                  disabled={isNavigating}
                  on:click={async () => {
                    if (isNavigating) return;
                    isNavigating = true;
                    try {
                      await goto('/admin');
                    } catch (e) {
                      console.error('Navigation error:', e);
                      isNavigating = false;
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                  <span class="hidden lg:inline">{isNavigating ? 'Loading...' : 'Admin'}</span>
                </button>
              {/if}
              <button
                class="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5"
                title="Settings"
                on:click={() => goto('/settings')}
              >
                <Settings class="h-4 w-4" />
              </button>
              <button
                class="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5"
                title="Sign out"
                on:click={handleLogout}
              >
                <LogOut class="h-4 w-4" />
              </button>
            </div>
          {/if}
        </div>
      </div>

      <!-- Mobile menu -->
      {#if mobileMenuOpen}
        <div class="sm:hidden mobile-menu-container transition-all duration-200 ease-in-out">
          <div class="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 shadow-lg">
            <!-- Profile completion notification (mobile) -->
            {#if $userProfile && $profileCompletionPercentage < 85}
              <div class="flex items-center bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm mb-3">
                <AlertCircle class="h-4 w-4 text-amber-600 mr-2 flex-shrink-0" />
                <span class="text-amber-800 flex-1">
                  Profile {$profileCompletionPercentage}% complete
                </span>
                <button 
                  class="ml-2 text-amber-600 hover:text-amber-700 font-medium"
                  on:click={() => { goto('/onboarding'); mobileMenuOpen = false; }}
                >
                  Complete
                </button>
              </div>
            {/if}

            <!-- Admin Dashboard Button (mobile) -->
            {#if currentUserProfile?.role === 'admin'}
              <button
                class="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 active:bg-red-800 disabled:opacity-50 text-center font-medium transition-colors duration-200 shadow-sm flex items-center justify-center gap-2"
                disabled={isNavigating}
                on:click={async () => {
                  if (isNavigating) return;
                  isNavigating = true;
                  mobileMenuOpen = false;
                  try {
                    await goto('/admin');
                  } catch (e) {
                    console.error('Navigation error:', e);
                    isNavigating = false;
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
                {isNavigating ? 'Loading...' : 'Admin Dashboard'}
              </button>
            {/if}

            <!-- New Resume Button -->
            <button
              class="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 text-center font-medium transition-colors duration-200 shadow-sm"
              on:click={() => { createNewResume(); mobileMenuOpen = false; }}
            >
              + New Resume
            </button>

            <!-- User info -->
            {#if user}
              <div class="flex items-center justify-between py-3 px-3 bg-gray-50 rounded-lg mt-3 border border-gray-100">
                <div class="flex items-center gap-2">
                  <div class="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span class="text-sm text-gray-700 font-medium">{user.email}</span>
                </div>
                <div class="flex items-center gap-1">
                  <button
                    class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-md transition-colors duration-200"
                    title="Settings"
                    on:click={() => { goto('/settings'); mobileMenuOpen = false; }}
                  >
                    <Settings class="h-4 w-4" />
                  </button>
                  <button
                    class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                    title="Sign out"
                    on:click={() => { handleLogout(); mobileMenuOpen = false; }}
                  >
                    <LogOut class="h-4 w-4" />
                  </button>
                </div>
              </div>
            {/if}
          </div>
        </div>
      {/if}
    </div>
  </header>
  
  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <!-- Quick Stats and Profile -->
    {#if !isLoading && analytics}
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6 md:mb-8">
        <!-- Profile Card -->
        <div class="lg:col-span-2">
          <Card class="h-full">
            <CardContent class="p-6">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center space-x-3">
                  <div class="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">{user?.name || 'User'}</h3>
                    <p class="text-sm text-gray-600">{user?.email}</p>
                  </div>
                </div>
                <button
                  class="text-gray-400 hover:text-gray-600"
                  on:click={() => goto('/onboarding')}
                  title="Edit Profile"
                >
                  <Edit3 class="h-4 w-4" />
                </button>
              </div>
              
              {#if $userProfile}
                <div class="space-y-3">
                  <!-- Profile Completion -->
                  <div>
                    <div class="flex items-center justify-between text-sm mb-2">
                      <span class="text-gray-600">Profile Completion</span>
                      <span class="font-medium {$profileCompletionPercentage >= 85 ? 'text-green-600' : $profileCompletionPercentage >= 50 ? 'text-blue-600' : 'text-amber-600'}">
                        {$profileCompletionPercentage}%
                      </span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        class="h-2 rounded-full transition-all duration-300 {$profileCompletionPercentage >= 85 ? 'bg-green-500' : $profileCompletionPercentage >= 50 ? 'bg-blue-500' : 'bg-amber-500'}"
                        style="width: {$profileCompletionPercentage}%"
                      ></div>
                    </div>
                  </div>
                  
                  <!-- Profile Info -->
                  <div class="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span class="text-gray-500">Industry</span>
                      <p class="font-medium text-gray-900 capitalize">
                        {$userProfile.target_industry?.replace('_', ' ') || 'Not set'}
                      </p>
                    </div>
                    <div>
                      <span class="text-gray-500">Experience</span>
                      <p class="font-medium text-gray-900 capitalize">
                        {$userProfile.experience_level?.replace('_', ' ') || 'Not set'}
                      </p>
                    </div>
                  </div>
                  
                  <!-- Action Buttons -->
                  <div class="flex gap-2 mt-3">
                    {#if $profileCompletionPercentage < 100}
                      <button
                        class="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        on:click={() => goto('/onboarding')}
                      >
                        Complete Profile
                      </button>
                    {:else}
                      <button
                        class="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        on:click={() => goto('/onboarding')}
                      >
                        Edit Profile
                      </button>
                    {/if}
                    <button
                      class="bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      on:click={() => goto('/templates')}
                      title="View recommended templates"
                    >
                      <Star class="h-4 w-4" />
                    </button>
                  </div>
                </div>
              {:else}
                <div class="text-center py-4">
                  <p class="text-gray-500 text-sm mb-3">No profile information yet</p>
                  <button
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    on:click={() => goto('/onboarding')}
                  >
                    Create Profile
                  </button>
                </div>
              {/if}
            </CardContent>
          </Card>
        </div>
        
        <!-- Stats Cards -->
        <div class="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
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
          
          <Card class="md:col-span-3 lg:col-span-1">
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
      </div>
    {/if}
    
    <!-- Navigation Tabs -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-1 mb-6">
      <Button
        variant={activeTab === 'resumes' ? 'default' : 'ghost'}
        size="sm"
        class="w-full sm:w-auto justify-start sm:justify-center"
        on:click={() => activeTab = 'resumes'}
      >
        <FileText class="h-4 w-4 mr-2" />
        My Resumes
      </Button>
      <Button
        variant={activeTab === 'analytics' ? 'default' : 'ghost'}
        size="sm"
        class="w-full sm:w-auto justify-start sm:justify-center"
        on:click={() => activeTab = 'analytics'}
      >
        <BarChart3 class="h-4 w-4 mr-2" />
        Analytics
      </Button>
      <Button
        variant={activeTab === 'templates' ? 'default' : 'ghost'}
        size="sm"
        class="w-full sm:w-auto justify-start sm:justify-center"
        on:click={() => activeTab = 'templates'}
      >
        <Star class="h-4 w-4 mr-2" />
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
                    <!-- Header with title and status -->
                    <div class="flex items-start justify-between mb-3">
                      <div class="flex-1">
                        <h3 class="font-semibold text-gray-900 truncate {viewMode === 'list' ? 'text-lg' : ''}">{resume.title}</h3>
                        {#if resume.target_job}
                          <p class="text-sm text-gray-600 mt-1">{resume.target_job}</p>
                        {/if}
                        {#if resume.target_company}
                          <p class="text-xs text-gray-500">• {resume.target_company}</p>
                        {/if}
                      </div>
                      
                      <div class="flex items-center gap-2">
                        <!-- Status Badge -->
                        <Badge variant={resume.status === 'active' ? 'default' : resume.status === 'draft' ? 'secondary' : 'outline'} class="text-xs">
                          {resume.status || 'draft'}
                        </Badge>
                        
                        <!-- Version Badge -->
                        {#if resume.version && resume.version > 1}
                          <Badge variant="outline" class="text-xs">v{resume.version}</Badge>
                        {/if}
                      </div>
                    </div>
                    
                    <!-- Tags -->
                    {#if resume.tags && resume.tags.length > 0}
                      <div class="flex flex-wrap gap-1 mb-3">
                        {#each resume.tags.slice(0, 3) as tag}
                          <Badge variant="outline" class="text-xs px-2 py-0.5">{tag}</Badge>
                        {/each}
                        {#if resume.tags.length > 3}
                          <Badge variant="outline" class="text-xs px-2 py-0.5">+{resume.tags.length - 3}</Badge>
                        {/if}
                      </div>
                    {/if}
                    
                    <!-- Progress Indicators -->
                    {#if viewMode === 'grid'}
                      <div class="space-y-2 mb-4">
                        <!-- Completion Progress -->
                        {#if resume.completion_percentage !== undefined}
                          <div>
                            <div class="flex justify-between text-xs mb-1">
                              <span class="text-gray-600">Completion</span>
                              <span class="font-medium">{resume.completion_percentage}%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                class="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                                style="width: {resume.completion_percentage}%"
                              ></div>
                            </div>
                          </div>
                        {/if}
                        
                        <!-- Optimization Score -->
                        {#if resume.optimization_score !== undefined && resume.optimization_score > 0}
                          <div>
                            <div class="flex justify-between text-xs mb-1">
                              <span class="text-gray-600">Optimization</span>
                              <span class="font-medium">{resume.optimization_score}%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                class="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                                style="width: {resume.optimization_score}%"
                              ></div>
                            </div>
                          </div>
                        {/if}
                      </div>
                    {/if}
                    
                    <!-- Analytics -->
                    <div class="flex items-center justify-between {viewMode === 'list' ? 'mb-0' : 'mb-4'}">
                      <div class="flex items-center space-x-4 text-xs text-gray-500">
                        <div class="flex items-center space-x-1">
                          <Eye class="h-3 w-3" />
                          <span>{resume.view_count || 0}</span>
                        </div>
                        <div class="flex items-center space-x-1">
                          <Download class="h-3 w-3" />
                          <span>{resume.download_count || 0}</span>
                        </div>
                        <div class="flex items-center space-x-1">
                          <Share2 class="h-3 w-3" />
                          <span>{resume.share_count || 0}</span>
                        </div>
                        
                        <!-- Success Rate (if available) -->
                        {#if resume.success_metrics?.success_rate && resume.success_metrics.success_rate > 0}
                          <div class="flex items-center space-x-1 text-green-600">
                            <TrendingUp class="h-3 w-3" />
                            <span>{resume.success_metrics.success_rate}%</span>
                          </div>
                        {/if}
                      </div>
                      
                      <!-- Privacy Badge -->
                      {#if resume.is_public}
                        <Badge variant="default" class="text-xs">Public</Badge>
                      {:else}
                        <Badge variant="secondary" class="text-xs">Private</Badge>
                      {/if}
                    </div>
                    
                    <!-- Personalization Level -->
                    {#if viewMode === 'grid' && resume.personalization_level && resume.personalization_level !== 'basic'}
                      <div class="flex items-center gap-1 text-xs text-purple-600 mb-2">
                        <Sparkles class="h-3 w-3" />
                        <span class="capitalize">{resume.personalization_level.replace('_', ' ')}</span>
                      </div>
                    {/if}
                    
                    {#if viewMode === 'grid'}
                      <div class="text-xs text-gray-500 mb-4">
                        Updated {formatDate(resume.updated)}
                      </div>
                    {/if}
                  </div>
                  
                  <div class="flex items-center space-x-2 {viewMode === 'list' ? 'ml-4' : ''}">
                    <Button variant="outline" size="sm" on:click={() => viewResume(resume)}>
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
      {#await import('$lib/components/analytics/ResumeAnalyticsDashboard.svelte')}
        <div class="text-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Loading analytics...</p>
        </div>
      {:then { default: ResumeAnalyticsDashboard }}
        <ResumeAnalyticsDashboard {resumes} />
      {:catch error}
        <div class="text-center py-12">
          <BarChart3 class="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">Analytics Unavailable</h3>
          <p class="text-gray-600">Unable to load analytics. Please try again later.</p>
        </div>
      {/await}
      
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