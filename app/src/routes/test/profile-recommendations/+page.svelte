<!--
  Profile and Recommendations Test Page
  Tests the integration between user profiles and template recommendations
-->

<script lang="ts">
  import { onMount } from 'svelte';
  import { currentUser } from '$lib/stores/auth';
  import { userProfile, userProfileStore, isLoadingProfile } from '$lib/stores/userProfile';
  import { enhancedTemplateStore, enhancedTemplates, quickstarters } from '$lib/stores/enhancedTemplates';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  
  let testResults = {
    profileLoaded: false,
    profileComplete: false,
    templatesLoaded: false,
    recommendationsGenerated: false,
    recommendationCount: 0,
    errors: []
  };
  
  let mockProfile = {
    target_industry: 'technology',
    experience_level: 'entry',
    target_job_titles: 'Software Developer, Frontend Developer, Web Developer',
    key_skills: 'JavaScript, React, HTML, CSS, Git',
    career_stage: 'first_job',
    education_level: 'bachelors',
    preferred_work_type: ['remote', 'hybrid']
  };
  
  let recommendations = [];
  let isTestingRecommendations = false;
  
  onMount(async () => {
    console.log('🧪 Starting profile and recommendations test...');
    await runTests();
  });
  
  async function runTests() {
    testResults = {
      profileLoaded: false,
      profileComplete: false,
      templatesLoaded: false,
      recommendationsGenerated: false,
      recommendationCount: 0,
      errors: []
    };
    
    try {
      // Test 1: Load user profile
      console.log('Test 1: Loading user profile...');
      if ($currentUser) {
        await userProfileStore.loadProfile($currentUser.id);
        testResults.profileLoaded = true;
        
        if ($userProfile?.profile_completed) {
          testResults.profileComplete = true;
        }
      }
      
      // Test 2: Load templates
      console.log('Test 2: Loading enhanced templates...');
      try {
        await enhancedTemplateStore.loadTemplates();
        testResults.templatesLoaded = true;
      } catch (error) {
        console.warn('Templates not available, using mock data');
        testResults.templatesLoaded = false;
      }
      
      // Test 3: Generate recommendations
      console.log('Test 3: Generating recommendations...');
      await testRecommendations();
      
    } catch (error) {
      console.error('❌ Test failed:', error);
      testResults.errors.push(error.message);
    }
  }
  
  async function testRecommendations() {
    isTestingRecommendations = true;
    
    try {
      // Test with user profile if available
      if ($userProfile) {
        console.log('Testing with user profile data...');
        recommendations = enhancedTemplateStore.getPersonalizedRecommendations();
      } else {
        console.log('Testing with mock profile data...');
        recommendations = enhancedTemplateStore.getRecommendations({
          targetIndustry: mockProfile.target_industry,
          experienceLevel: mockProfile.experience_level,
          jobTypes: mockProfile.target_job_titles.split(',').map(t => t.trim()),
          careerStage: mockProfile.career_stage,
          skills: mockProfile.key_skills.split(',').map(s => s.trim()),
          educationLevel: mockProfile.education_level,
          workType: mockProfile.preferred_work_type
        });
      }
      
      testResults.recommendationCount = recommendations.length;
      testResults.recommendationsGenerated = recommendations.length > 0;
      
      console.log(`✅ Generated ${recommendations.length} recommendations`);
      
    } catch (error) {
      console.error('❌ Recommendation test failed:', error);
      testResults.errors.push(`Recommendation error: ${error.message}`);
    } finally {
      isTestingRecommendations = false;
    }
  }
  
  async function createMockProfile() {
    try {
      const result = await userProfileStore.saveProfile(mockProfile);
      if (result) {
        console.log('✅ Mock profile created');
        await runTests();
      }
    } catch (error) {
      console.error('❌ Failed to create mock profile:', error);
      testResults.errors.push(`Profile creation error: ${error.message}`);
    }
  }
  
  function getRecommendationScore(template) {
    // Calculate a simple score for display
    const criteria = $userProfile ? {
      targetIndustry: $userProfile.target_industry,
      experienceLevel: $userProfile.experience_level,
      jobTypes: $userProfile.target_job_titles?.split(',').map(t => t.trim()),
      careerStage: $userProfile.career_stage,
      skills: $userProfile.key_skills?.split(',').map(s => s.trim()),
      educationLevel: $userProfile.education_level,
      workType: $userProfile.preferred_work_type
    } : mockProfile;
    
    return enhancedTemplateStore.calculateRelevanceScore(template, criteria);
  }
</script>

<svelte:head>
  <title>Profile & Recommendations Test - Resume Hub</title>
  <meta name="description" content="Test page for profile and recommendation integration" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <div class="max-w-6xl mx-auto py-8 px-4">
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">🧪 Profile & Recommendations Test</h1>
      <p class="text-gray-600">Testing the integration between user profiles and template recommendations</p>
    </div>
    
    <!-- Test Results Summary -->
    <Card class="mb-6">
      <CardHeader>
        <CardTitle>Test Results Summary</CardTitle>
        <CardDescription>Integration test results for profile-based recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div class="text-center">
            <div class="text-2xl font-bold {testResults.profileLoaded ? 'text-green-600' : 'text-red-600'}">
              {testResults.profileLoaded ? '✅' : '❌'}
            </div>
            <div class="text-sm text-gray-600">Profile Loaded</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold {testResults.templatesLoaded ? 'text-green-600' : 'text-red-600'}">
              {testResults.templatesLoaded ? '✅' : '❌'}
            </div>
            <div class="text-sm text-gray-600">Templates Loaded</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold {testResults.recommendationsGenerated ? 'text-green-600' : 'text-red-600'}">
              {testResults.recommendationsGenerated ? '✅' : '❌'}
            </div>
            <div class="text-sm text-gray-600">Recommendations</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{testResults.recommendationCount}</div>
            <div class="text-sm text-gray-600">Total Recommendations</div>
          </div>
        </div>
        
        <div class="flex flex-wrap gap-2 mb-4">
          <Badge variant={testResults.profileLoaded ? 'default' : 'destructive'}>
            Profile: {testResults.profileLoaded ? 'Loaded' : 'Not Loaded'}
          </Badge>
          <Badge variant={testResults.profileComplete ? 'default' : 'secondary'}>
            Profile: {testResults.profileComplete ? 'Complete' : 'Incomplete'}
          </Badge>
          <Badge variant={testResults.templatesLoaded ? 'default' : 'destructive'}>
            Templates: {testResults.templatesLoaded ? 'Available' : 'Mock Data'}
          </Badge>
        </div>
        
        {#if testResults.errors.length > 0}
          <div class="bg-red-50 border border-red-200 rounded p-3">
            <h4 class="font-medium text-red-800 mb-2">Errors:</h4>
            {#each testResults.errors as error}
              <p class="text-sm text-red-700">• {error}</p>
            {/each}
          </div>
        {/if}
      </CardContent>
    </Card>
    
    <!-- Profile Information -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Profile</CardTitle>
          <CardDescription>
            {$userProfile ? 'User profile data' : 'No profile found'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {#if $isLoadingProfile}
            <div class="flex items-center gap-2">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Loading profile...</span>
            </div>
          {:else if $userProfile}
            <div class="space-y-2 text-sm">
              <p><strong>Name:</strong> {$userProfile.first_name} {$userProfile.last_name}</p>
              <p><strong>Industry:</strong> {$userProfile.target_industry || 'Not set'}</p>
              <p><strong>Experience:</strong> {$userProfile.experience_level || 'Not set'}</p>
              <p><strong>Job Titles:</strong> {$userProfile.target_job_titles || 'Not set'}</p>
              <p><strong>Skills:</strong> {$userProfile.key_skills || 'Not set'}</p>
              <p><strong>Career Stage:</strong> {$userProfile.career_stage || 'Not set'}</p>
              <p><strong>Complete:</strong> {$userProfile.profile_completed ? 'Yes' : 'No'}</p>
            </div>
          {:else}
            <div class="text-center py-6">
              <p class="text-gray-600 mb-4">No profile found. Create a mock profile for testing.</p>
              <Button on:click={createMockProfile}>
                Create Mock Profile
              </Button>
            </div>
          {/if}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Mock Profile Data</CardTitle>
          <CardDescription>Test data used when no user profile exists</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-2 text-sm">
            <p><strong>Industry:</strong> {mockProfile.target_industry}</p>
            <p><strong>Experience:</strong> {mockProfile.experience_level}</p>
            <p><strong>Job Titles:</strong> {mockProfile.target_job_titles}</p>
            <p><strong>Skills:</strong> {mockProfile.key_skills}</p>
            <p><strong>Career Stage:</strong> {mockProfile.career_stage}</p>
            <p><strong>Education:</strong> {mockProfile.education_level}</p>
            <p><strong>Work Type:</strong> {mockProfile.preferred_work_type.join(', ')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
    
    <!-- Recommendations -->
    <Card class="mb-6">
      <CardHeader>
        <CardTitle class="flex items-center justify-between">
          Template Recommendations
          <Button 
            variant="outline" 
            size="sm" 
            on:click={testRecommendations}
            disabled={isTestingRecommendations}
          >
            {isTestingRecommendations ? 'Testing...' : 'Refresh Recommendations'}
          </Button>
        </CardTitle>
        <CardDescription>
          Templates recommended based on {$userProfile ? 'user profile' : 'mock profile'} data
        </CardDescription>
      </CardHeader>
      <CardContent>
        {#if recommendations.length === 0}
          <div class="text-center py-8">
            <p class="text-gray-600 mb-4">No recommendations generated yet.</p>
            <Button on:click={testRecommendations}>
              Generate Recommendations
            </Button>
          </div>
        {:else}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each recommendations as template}
              <div class="border border-gray-200 rounded-lg p-4">
                <div class="flex items-start justify-between mb-2">
                  <h4 class="font-medium text-gray-900">{template.name}</h4>
                  <Badge variant="outline" class="text-xs">
                    Score: {Math.round(getRecommendationScore(template))}
                  </Badge>
                </div>
                
                <p class="text-sm text-gray-600 mb-3">
                  {template.description || 'No description available'}
                </p>
                
                <div class="space-y-1 text-xs">
                  <p><strong>Category:</strong> {template.category}</p>
                  {#if template.quickstarter}
                    <p><strong>Industry:</strong> {template.quickstarter.metadata.industry}</p>
                    <p><strong>Experience:</strong> {template.quickstarter.metadata.experienceLevel}</p>
                    <p><strong>Target Jobs:</strong> {template.quickstarter.metadata.targetJobs.slice(0, 2).join(', ')}</p>
                  {/if}
                </div>
                
                {#if template.quickstarter}
                  <Badge variant="default" class="mt-2 text-xs">
                    Enhanced
                  </Badge>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </CardContent>
    </Card>
    
    <!-- Test Actions -->
    <Card>
      <CardHeader>
        <CardTitle>Test Actions</CardTitle>
        <CardDescription>Additional tests and actions</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex flex-wrap gap-3">
          <Button on:click={runTests}>
            🔄 Re-run All Tests
          </Button>
          <Button variant="outline" on:click={testRecommendations}>
            🎯 Test Recommendations
          </Button>
          {#if !$userProfile}
            <Button variant="outline" on:click={createMockProfile}>
              👤 Create Mock Profile
            </Button>
          {/if}
          <Button variant="outline" on:click={() => window.location.href = '/profile'}>
            📝 Manage Profile
          </Button>
          <Button variant="outline" on:click={() => window.location.href = '/onboarding'}>
            🚀 View Onboarding
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</div>