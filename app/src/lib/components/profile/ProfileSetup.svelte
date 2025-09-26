<!--
  User Profile Setup Component
  Helps users complete their profile for better template recommendations
-->

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { userProfileStore, userProfile, isLoadingProfile, profileCompletionPercentage } from '$lib/stores/userProfile';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { Progress } from '$lib/components/ui/progress';
  
  const dispatch = createEventDispatcher();
  
  // Form data
  let formData = {
    first_name: '',
    last_name: '',
    location: '',
    phone: '',
    linkedin_url: '',
    portfolio_url: '',
    target_industry: '',
    experience_level: '',
    target_job_titles: '',
    key_skills: '',
    career_stage: '',
    preferred_work_type: [],
    education_level: '',
    certifications: '',
    willing_to_relocate: false,
    salary_expectation_min: null,
    salary_expectation_max: null
  };
  
  let currentStep = 1;
  let totalSteps = 4;
  let isSubmitting = false;
  let error = '';
  
  // Industry options
  const industries = [
    { value: 'technology', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' },
    { value: 'retail', label: 'Retail' },
    { value: 'education', label: 'Education' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'hospitality', label: 'Hospitality' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'nonprofit', label: 'Non-profit' },
    { value: 'government', label: 'Government' },
    { value: 'media', label: 'Media' },
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'construction', label: 'Construction' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'energy', label: 'Energy' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'legal', label: 'Legal' },
    { value: 'other', label: 'Other' }
  ];
  
  const experienceLevels = [
    { value: 'student', label: 'Student' },
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'junior', label: 'Junior (2-4 years)' },
    { value: 'mid', label: 'Mid Level (4-7 years)' },
    { value: 'senior', label: 'Senior (7+ years)' },
    { value: 'executive', label: 'Executive/Leadership' },
    { value: 'career_change', label: 'Career Change' }
  ];
  
  const careerStages = [
    { value: 'first_job', label: 'Looking for my first job' },
    { value: 'career_growth', label: 'Growing in my current field' },
    { value: 'career_change', label: 'Changing careers' },
    { value: 'promotion_seeking', label: 'Seeking promotion' },
    { value: 'industry_switch', label: 'Switching industries' },
    { value: 'returning_to_work', label: 'Returning to work' },
    { value: 'freelance_to_fulltime', label: 'Freelance to full-time' },
    { value: 'executive_level', label: 'Executive level' }
  ];
  
  const workTypes = [
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'onsite', label: 'On-site' },
    { value: 'contract', label: 'Contract' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'part_time', label: 'Part-time' },
    { value: 'full_time', label: 'Full-time' },
    { value: 'internship', label: 'Internship' }
  ];
  
  const educationLevels = [
    { value: 'high_school', label: 'High School' },
    { value: 'some_college', label: 'Some College' },
    { value: 'associates', label: 'Associate Degree' },
    { value: 'bachelors', label: 'Bachelor\'s Degree' },
    { value: 'masters', label: 'Master\'s Degree' },
    { value: 'doctorate', label: 'Doctorate' },
    { value: 'professional', label: 'Professional Degree' },
    { value: 'bootcamp', label: 'Bootcamp/Certificate' },
    { value: 'certification', label: 'Industry Certification' }
  ];
  
  // Load existing profile data
  $: if ($userProfile) {
    formData = {
      first_name: $userProfile.first_name || '',
      last_name: $userProfile.last_name || '',
      location: $userProfile.location || '',
      phone: $userProfile.phone || '',
      linkedin_url: $userProfile.linkedin_url || '',
      portfolio_url: $userProfile.portfolio_url || '',
      target_industry: $userProfile.target_industry || '',
      experience_level: $userProfile.experience_level || '',
      target_job_titles: $userProfile.target_job_titles || '',
      key_skills: $userProfile.key_skills || '',
      career_stage: $userProfile.career_stage || '',
      preferred_work_type: $userProfile.preferred_work_type || [],
      education_level: $userProfile.education_level || '',
      certifications: $userProfile.certifications || '',
      willing_to_relocate: $userProfile.willing_to_relocate || false,
      salary_expectation_min: $userProfile.salary_expectation_min || null,
      salary_expectation_max: $userProfile.salary_expectation_max || null
    };
  }
  
  function nextStep() {
    if (currentStep < totalSteps) {
      currentStep++;
    }
  }
  
  function prevStep() {
    if (currentStep > 1) {
      currentStep--;
    }
  }
  
  function toggleWorkType(type: string) {
    if (formData.preferred_work_type.includes(type)) {
      formData.preferred_work_type = formData.preferred_work_type.filter(t => t !== type);
    } else {
      formData.preferred_work_type = [...formData.preferred_work_type, type];
    }
  }
  
  async function saveProfile() {
    isSubmitting = true;
    error = '';
    
    try {
      const result = await userProfileStore.saveProfile(formData);
      
      if (result) {
        dispatch('profileSaved', { profile: result });
      } else {
        error = 'Failed to save profile. Please try again.';
      }
    } catch (err: any) {
      error = err.message || 'An error occurred while saving your profile.';
    } finally {
      isSubmitting = false;
    }
  }
  
  async function skipForNow() {
    dispatch('profileSkipped');
  }
  
  // Reactive validation for current step
  $: isCurrentStepValid = (() => {
    switch (currentStep) {
      case 1:
        const step1Valid = formData.first_name.trim() !== '' && formData.last_name.trim() !== '';
        console.log('Step 1 validation:', { 
          first_name: formData.first_name, 
          last_name: formData.last_name, 
          valid: step1Valid 
        });
        return step1Valid;
      case 2:
        return formData.target_industry !== '' && formData.experience_level !== '';
      case 3:
        return formData.target_job_titles.trim() !== '';
      case 4:
        return true; // Optional step
      default:
        return false;
    }
  })();

  function isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        return formData.first_name.trim() !== '' && formData.last_name.trim() !== '';
      case 2:
        return formData.target_industry !== '' && formData.experience_level !== '';
      case 3:
        return formData.target_job_titles.trim() !== '';
      case 4:
        return true; // Optional step
      default:
        return false;
    }
  }
</script>

<div class="profile-setup max-w-2xl mx-auto p-6">
  <div class="mb-8">
    <h1 class="text-3xl font-bold mb-2">Complete Your Profile</h1>
    <p class="text-gray-600 mb-4">
      Help us recommend the perfect resume templates for your career goals.
    </p>
    
    <!-- Progress indicator -->
    <div class="mb-6">
      <div class="flex justify-between text-sm text-gray-500 mb-2">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
      </div>
      <Progress value={(currentStep / totalSteps) * 100} class="h-2" />
    </div>
  </div>
  
  {#if error}
    <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <p class="text-red-700">{error}</p>
    </div>
  {/if}
  
  <!-- Step 1: Basic Information -->
  {#if currentStep === 1}
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>Let's start with your basic details</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label for="first_name">First Name *</Label>
            <Input
              id="first_name"
              bind:value={formData.first_name}
              placeholder="Enter your first name"
              required
            />
          </div>
          <div>
            <Label for="last_name">Last Name *</Label>
            <Input
              id="last_name"
              bind:value={formData.last_name}
              placeholder="Enter your last name"
              required
            />
          </div>
        </div>
        
        <div>
          <Label for="location">Location</Label>
          <Input
            id="location"
            bind:value={formData.location}
            placeholder="City, State/Country"
          />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label for="phone">Phone Number</Label>
            <Input
              id="phone"
              bind:value={formData.phone}
              placeholder="(555) 123-4567"
              type="tel"
            />
          </div>
          <div>
            <Label for="linkedin_url">LinkedIn URL</Label>
            <Input
              id="linkedin_url"
              bind:value={formData.linkedin_url}
              placeholder="https://linkedin.com/in/yourname"
              type="url"
            />
          </div>
        </div>
        
        <div>
          <Label for="portfolio_url">Portfolio/Website URL</Label>
          <Input
            id="portfolio_url"
            bind:value={formData.portfolio_url}
            placeholder="https://yourportfolio.com"
            type="url"
          />
        </div>
      </CardContent>
    </Card>
  {/if}
  
  <!-- Step 2: Career Information -->
  {#if currentStep === 2}
    <Card>
      <CardHeader>
        <CardTitle>Career Information</CardTitle>
        <CardDescription>Tell us about your career goals and experience</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div>
          <Label for="target_industry">Target Industry *</Label>
          <select
            id="target_industry"
            bind:value={formData.target_industry}
            class="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select an industry</option>
            {#each industries as industry}
              <option value={industry.value}>{industry.label}</option>
            {/each}
          </select>
        </div>
        
        <div>
          <Label for="experience_level">Experience Level *</Label>
          <select
            id="experience_level"
            bind:value={formData.experience_level}
            class="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select your experience level</option>
            {#each experienceLevels as level}
              <option value={level.value}>{level.label}</option>
            {/each}
          </select>
        </div>
        
        <div>
          <Label for="career_stage">Career Stage</Label>
          <select
            id="career_stage"
            bind:value={formData.career_stage}
            class="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select your career stage</option>
            {#each careerStages as stage}
              <option value={stage.value}>{stage.label}</option>
            {/each}
          </select>
        </div>
        
        <div>
          <Label for="education_level">Education Level</Label>
          <select
            id="education_level"
            bind:value={formData.education_level}
            class="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select your education level</option>
            {#each educationLevels as level}
              <option value={level.value}>{level.label}</option>
            {/each}
          </select>
        </div>
      </CardContent>
    </Card>
  {/if}
  
  <!-- Step 3: Job Preferences -->
  {#if currentStep === 3}
    <Card>
      <CardHeader>
        <CardTitle>Job Preferences</CardTitle>
        <CardDescription>What type of roles are you targeting?</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div>
          <Label for="target_job_titles">Target Job Titles *</Label>
          <Input
            id="target_job_titles"
            bind:value={formData.target_job_titles}
            placeholder="Software Developer, Frontend Engineer, Web Developer"
            required
          />
          <p class="text-sm text-gray-500 mt-1">
            Separate multiple job titles with commas
          </p>
        </div>
        
        <div>
          <Label for="key_skills">Key Skills</Label>
          <Input
            id="key_skills"
            bind:value={formData.key_skills}
            placeholder="JavaScript, React, Node.js, Python"
          />
          <p class="text-sm text-gray-500 mt-1">
            List your most important skills, separated by commas
          </p>
        </div>
        
        <div>
          <Label>Preferred Work Types</Label>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
            {#each workTypes as type}
              <button
                type="button"
                class="p-2 text-sm border rounded-md transition-colors {formData.preferred_work_type.includes(type.value) 
                  ? 'bg-blue-100 border-blue-300 text-blue-700' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}"
                on:click={() => toggleWorkType(type.value)}
              >
                {type.label}
              </button>
            {/each}
          </div>
        </div>
        
        <div>
          <Label for="certifications">Certifications</Label>
          <Input
            id="certifications"
            bind:value={formData.certifications}
            placeholder="AWS Certified, Google Analytics, etc."
          />
        </div>
      </CardContent>
    </Card>
  {/if}
  
  <!-- Step 4: Additional Preferences -->
  {#if currentStep === 4}
    <Card>
      <CardHeader>
        <CardTitle>Additional Preferences</CardTitle>
        <CardDescription>Optional information to further personalize your experience</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label for="salary_min">Minimum Salary Expectation</Label>
            <Input
              id="salary_min"
              bind:value={formData.salary_expectation_min}
              placeholder="50000"
              type="number"
              min="0"
            />
          </div>
          <div>
            <Label for="salary_max">Maximum Salary Expectation</Label>
            <Input
              id="salary_max"
              bind:value={formData.salary_expectation_max}
              placeholder="80000"
              type="number"
              min="0"
            />
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <input
            id="willing_to_relocate"
            type="checkbox"
            bind:checked={formData.willing_to_relocate}
            class="rounded border-gray-300"
          />
          <Label for="willing_to_relocate">I'm willing to relocate for the right opportunity</Label>
        </div>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 class="font-medium text-blue-900 mb-2">🎯 Profile Benefits</h4>
          <ul class="text-sm text-blue-800 space-y-1">
            <li>• Get personalized template recommendations</li>
            <li>• Receive industry-specific resume tips</li>
            <li>• Access quickstart content for your field</li>
            <li>• See templates used by successful professionals in your industry</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  {/if}
  
  <!-- Navigation buttons -->
  <div class="flex justify-between mt-8">
    <div>
      {#if currentStep > 1}
        <Button variant="outline" on:click={prevStep}>
          Previous
        </Button>
      {/if}
    </div>
    
    <div class="flex gap-3">
      <Button variant="ghost" on:click={skipForNow}>
        Skip for now
      </Button>
      
      {#if currentStep < totalSteps}
        <Button 
          on:click={nextStep}
          disabled={!isCurrentStepValid}
        >
          Next
        </Button>
      {:else}
        <Button 
          on:click={saveProfile}
          disabled={isSubmitting || $isLoadingProfile}
          class="bg-blue-600 hover:bg-blue-700"
        >
          {#if isSubmitting || $isLoadingProfile}
            Saving...
          {:else}
            Complete Profile
          {/if}
        </Button>
      {/if}
    </div>
  </div>
</div>

<style>
  .profile-setup {
    font-family: 'Inter', sans-serif;
  }
</style>