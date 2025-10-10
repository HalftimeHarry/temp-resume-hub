<!--
  User Onboarding Page
  Guides new users through profile setup after registration
-->

<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { currentUser, isAuthenticated } from '$lib/stores/auth';
  import { userProfile, userProfileStore } from '$lib/stores/userProfile';
  import ProfileSetup from '$lib/components/profile/ProfileSetup.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  
  let currentStep = 'welcome'; // 'welcome', 'profile', 'complete'
  
  onMount(async () => {
    // Redirect if not authenticated
    if (!$isAuthenticated) {
      goto('/auth/login');
      return;
    }
    
    // Load user profile
    if ($currentUser) {
      await userProfileStore.loadProfile($currentUser.id);
      
      // If profile exists and is complete, skip welcome screen and go directly to profile editing
      if ($userProfile?.profile_completed) {
        currentStep = 'profile';
      }
    }
  });
  
  function startProfileSetup() {
    currentStep = 'profile';
  }
  
  function handleProfileSaved(event: CustomEvent) {
    // If profile was already complete (user was editing), redirect to dashboard
    if ($userProfile?.profile_completed) {
      setTimeout(() => {
        goto('/dashboard');
      }, 1500);
    } else {
      // New profile completion, show completion screen
      currentStep = 'complete';
    }
  }
  
  function handleProfileSkipped() {
    goto('/dashboard');
  }
  
  function goToDashboard() {
    goto('/dashboard');
  }
  
  function goToTemplates() {
    goto('/templates');
  }
</script>

<svelte:head>
  <title>Welcome to Resume Hub</title>
  <meta name="description" content="Get started with your professional resume" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
  <div class="max-w-4xl mx-auto py-12 px-4">
    
    {#if currentStep === 'welcome'}
      <!-- Welcome Step -->
      <div class="text-center mb-12">
        <div class="mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Resume Hub! 🎉
          </h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            You're just a few steps away from creating professional resumes that get you noticed.
          </p>
        </div>
        
        <Card class="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Let's Get You Started</CardTitle>
            <CardDescription>
              Complete your profile to unlock personalized template recommendations and industry-specific tips.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div class="text-center">
                <div class="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 class="font-medium text-gray-900 mb-1">Complete Profile</h3>
                <p class="text-sm text-gray-600">Tell us about your career goals</p>
              </div>
              
              <div class="text-center">
                <div class="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 class="font-medium text-gray-900 mb-1">Get Recommendations</h3>
                <p class="text-sm text-gray-600">See templates perfect for your field</p>
              </div>
              
              <div class="text-center">
                <div class="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 class="font-medium text-gray-900 mb-1">Create Resume</h3>
                <p class="text-sm text-gray-600">Build your professional resume</p>
              </div>
            </div>
            
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <Button on:click={startProfileSetup} class="bg-blue-600 hover:bg-blue-700">
                Complete Profile (2 minutes)
              </Button>
              <Button variant="outline" on:click={handleProfileSkipped}>
                Skip for now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
    {:else if currentStep === 'profile'}
      <!-- Profile Setup Step -->
      <div class="mb-8">
        <Button variant="ghost" on:click={() => currentStep = 'welcome'} class="mb-4">
          ← Back
        </Button>
      </div>
      
      <ProfileSetup 
        on:profileSaved={handleProfileSaved}
        on:profileSkipped={handleProfileSkipped}
      />
      
    {:else if currentStep === 'complete'}
      <!-- Completion Step -->
      <div class="text-center">
        <div class="mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            Profile Complete! ✨
          </h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Great job! Your profile is now set up and you'll receive personalized template recommendations.
          </p>
        </div>
        
        <Card class="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            <CardDescription>
              Now that your profile is complete, here's what you can do
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div class="text-center p-4 border border-gray-200 rounded-lg">
                <div class="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 class="font-medium text-gray-900 mb-2">Browse Templates</h3>
                <p class="text-sm text-gray-600 mb-4">
                  Explore our collection of professional resume templates, now personalized for your industry.
                </p>
                <Button on:click={goToTemplates} class="w-full">
                  View Templates
                </Button>
              </div>
              
              <div class="text-center p-4 border border-gray-200 rounded-lg">
                <div class="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                  </svg>
                </div>
                <h3 class="font-medium text-gray-900 mb-2">Go to Dashboard</h3>
                <p class="text-sm text-gray-600 mb-4">
                  Access your dashboard to manage resumes, view analytics, and update your profile.
                </p>
                <Button variant="outline" on:click={goToDashboard} class="w-full">
                  Open Dashboard
                </Button>
              </div>
            </div>
            
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 class="font-medium text-blue-900 mb-2">🎯 Profile Benefits Unlocked</h4>
              <ul class="text-sm text-blue-800 space-y-1">
                <li>• Personalized template recommendations based on your industry</li>
                <li>• Industry-specific resume tips and guidance</li>
                <li>• Quickstart content tailored to your career level</li>
                <li>• Templates used by successful professionals in your field</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    {/if}
  </div>
</div>