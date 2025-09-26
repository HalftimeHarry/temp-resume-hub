<!--
  User Profile Management Page
  Allows users to view and edit their profile information
-->

<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { currentUser, isAuthenticated } from '$lib/stores/auth';
  import { userProfile, userProfileStore, isLoadingProfile, profileCompletionPercentage, isProfileComplete } from '$lib/stores/userProfile';
  import ProfileSetup from '$lib/components/profile/ProfileSetup.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { Progress } from '$lib/components/ui/progress';
  
  let showSetup = false;
  let isEditing = false;
  
  onMount(async () => {
    // Redirect if not authenticated
    if (!$isAuthenticated) {
      goto('/auth/login');
      return;
    }
    
    // Load user profile
    if ($currentUser) {
      await userProfileStore.loadProfile($currentUser.id);
    }
  });
  
  function startEditing() {
    isEditing = true;
    showSetup = true;
  }
  
  function handleProfileSaved(event: CustomEvent) {
    showSetup = false;
    isEditing = false;
    // Profile will be automatically updated via the store
  }
  
  function handleProfileSkipped() {
    showSetup = false;
    isEditing = false;
  }
  
  function formatWorkTypes(workTypes: string[] | undefined): string {
    if (!workTypes || workTypes.length === 0) return 'Not specified';
    return workTypes.map(type => type.replace('_', ' ')).join(', ');
  }
  
  function formatSalaryRange(min?: number, max?: number): string {
    if (!min && !max) return 'Not specified';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `$${min.toLocaleString()}+`;
    if (max) return `Up to $${max.toLocaleString()}`;
    return 'Not specified';
  }
</script>

<svelte:head>
  <title>My Profile - Resume Hub</title>
  <meta name="description" content="Manage your profile and preferences" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <div class="max-w-4xl mx-auto py-8 px-4">
    {#if showSetup}
      <!-- Profile Setup/Edit Mode -->
      <ProfileSetup 
        on:profileSaved={handleProfileSaved}
        on:profileSkipped={handleProfileSkipped}
      />
    {:else}
      <!-- Profile View Mode -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">My Profile</h1>
            <p class="text-gray-600">Manage your profile information and preferences</p>
          </div>
          <Button on:click={startEditing}>
            {$userProfile ? 'Edit Profile' : 'Complete Profile'}
          </Button>
        </div>
        
        {#if $isLoadingProfile}
          <div class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span class="ml-3 text-gray-600">Loading profile...</span>
          </div>
        {:else if !$userProfile}
          <!-- No Profile State -->
          <Card>
            <CardContent class="text-center py-12">
              <div class="mb-4">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Complete Your Profile</h3>
              <p class="text-gray-600 mb-6">
                Set up your profile to get personalized template recommendations and better resume suggestions.
              </p>
              <Button on:click={startEditing} class="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </CardContent>
          </Card>
        {:else}
          <!-- Profile Information -->
          <div class="space-y-6">
            <!-- Profile Completion Status -->
            <Card>
              <CardHeader>
                <CardTitle class="flex items-center justify-between">
                  Profile Completion
                  <Badge variant={$isProfileComplete ? 'default' : 'secondary'}>
                    {$isProfileComplete ? 'Complete' : 'Incomplete'}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Complete your profile to get better template recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm text-gray-600">Progress</span>
                  <span class="text-sm font-medium">{$profileCompletionPercentage}%</span>
                </div>
                <Progress value={$profileCompletionPercentage} class="h-2" />
                
                {#if !$isProfileComplete}
                  <p class="text-sm text-gray-600 mt-3">
                    Complete your target industry, experience level, and job titles to unlock personalized recommendations.
                  </p>
                {/if}
              </CardContent>
            </Card>
            
            <!-- Basic Information -->
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 class="font-medium text-gray-900 mb-2">Personal Details</h4>
                    <div class="space-y-2 text-sm">
                      <p><strong>Name:</strong> {$userProfile.first_name || 'Not provided'} {$userProfile.last_name || ''}</p>
                      <p><strong>Location:</strong> {$userProfile.location || 'Not provided'}</p>
                      <p><strong>Phone:</strong> {$userProfile.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 class="font-medium text-gray-900 mb-2">Online Presence</h4>
                    <div class="space-y-2 text-sm">
                      {#if $userProfile.linkedin_url}
                        <p><strong>LinkedIn:</strong> <a href={$userProfile.linkedin_url} target="_blank" class="text-blue-600 hover:underline">View Profile</a></p>
                      {:else}
                        <p><strong>LinkedIn:</strong> Not provided</p>
                      {/if}
                      
                      {#if $userProfile.portfolio_url}
                        <p><strong>Portfolio:</strong> <a href={$userProfile.portfolio_url} target="_blank" class="text-blue-600 hover:underline">View Portfolio</a></p>
                      {:else}
                        <p><strong>Portfolio:</strong> Not provided</p>
                      {/if}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <!-- Career Information -->
            <Card>
              <CardHeader>
                <CardTitle>Career Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-3">
                    <div>
                      <h4 class="font-medium text-gray-900">Target Industry</h4>
                      <p class="text-sm text-gray-600 capitalize">
                        {$userProfile.target_industry?.replace('_', ' ') || 'Not specified'}
                      </p>
                    </div>
                    
                    <div>
                      <h4 class="font-medium text-gray-900">Experience Level</h4>
                      <p class="text-sm text-gray-600 capitalize">
                        {$userProfile.experience_level?.replace('_', ' ') || 'Not specified'}
                      </p>
                    </div>
                    
                    <div>
                      <h4 class="font-medium text-gray-900">Career Stage</h4>
                      <p class="text-sm text-gray-600 capitalize">
                        {$userProfile.career_stage?.replace('_', ' ') || 'Not specified'}
                      </p>
                    </div>
                  </div>
                  
                  <div class="space-y-3">
                    <div>
                      <h4 class="font-medium text-gray-900">Education Level</h4>
                      <p class="text-sm text-gray-600 capitalize">
                        {$userProfile.education_level?.replace('_', ' ') || 'Not specified'}
                      </p>
                    </div>
                    
                    <div>
                      <h4 class="font-medium text-gray-900">Willing to Relocate</h4>
                      <p class="text-sm text-gray-600">
                        {$userProfile.willing_to_relocate ? 'Yes' : 'No'}
                      </p>
                    </div>
                    
                    <div>
                      <h4 class="font-medium text-gray-900">Salary Expectations</h4>
                      <p class="text-sm text-gray-600">
                        {formatSalaryRange($userProfile.salary_expectation_min, $userProfile.salary_expectation_max)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <!-- Job Preferences -->
            <Card>
              <CardHeader>
                <CardTitle>Job Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="space-y-4">
                  <div>
                    <h4 class="font-medium text-gray-900 mb-2">Target Job Titles</h4>
                    <p class="text-sm text-gray-600">
                      {$userProfile.target_job_titles || 'Not specified'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 class="font-medium text-gray-900 mb-2">Key Skills</h4>
                    <p class="text-sm text-gray-600">
                      {$userProfile.key_skills || 'Not specified'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 class="font-medium text-gray-900 mb-2">Preferred Work Types</h4>
                    <p class="text-sm text-gray-600 capitalize">
                      {formatWorkTypes($userProfile.preferred_work_type)}
                    </p>
                  </div>
                  
                  {#if $userProfile.certifications}
                    <div>
                      <h4 class="font-medium text-gray-900 mb-2">Certifications</h4>
                      <p class="text-sm text-gray-600">
                        {$userProfile.certifications}
                      </p>
                    </div>
                  {/if}
                </div>
              </CardContent>
            </Card>
            
            <!-- Profile Actions -->
            <Card>
              <CardHeader>
                <CardTitle>Profile Actions</CardTitle>
                <CardDescription>Manage your profile and data</CardDescription>
              </CardHeader>
              <CardContent>
                <div class="flex flex-wrap gap-3">
                  <Button on:click={startEditing}>
                    Edit Profile
                  </Button>
                  <Button variant="outline" on:click={() => goto('/templates')}>
                    Browse Templates
                  </Button>
                  <Button variant="outline" on:click={() => goto('/dashboard')}>
                    Back to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>