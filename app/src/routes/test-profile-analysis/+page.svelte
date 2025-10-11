<script lang="ts">
  import { analyzeProfile, type ProfileAnalysisResult } from '$lib/services/ProfileAnalysis';
  import type { UserProfile } from '$lib/types';
  import ProfileCompleteness from '$lib/components/profile/ProfileCompleteness.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

  // Test profiles with different completeness levels
  const testProfiles: { name: string; profile: Partial<UserProfile> }[] = [
    {
      name: 'Complete Profile',
      profile: {
        id: 'test-1',
        user: 'test-user',
        created: '2024-01-01',
        updated: '2024-01-01',
        first_name: 'John',
        last_name: 'Doe',
        full_name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        location: 'New York, NY',
        professional_summary: 'Experienced software engineer with 5 years of experience',
        target_industry: 'Technology',
        work_experience: JSON.stringify([{
          company: 'Tech Corp',
          position: 'Software Engineer',
          start_date: '2020-01',
          end_date: '2024-01'
        }]),
        education: JSON.stringify([{
          institution: 'University',
          degree: 'Bachelor of Science',
          field: 'Computer Science'
        }]),
        skills: JSON.stringify([
          { name: 'JavaScript', level: 'advanced' }
        ]),
        role: 'user',
        plan: 'free',
        verified: true,
        active: true
      }
    },
    {
      name: 'Minimal Profile (Below Threshold)',
      profile: {
        id: 'test-2',
        user: 'test-user',
        created: '2024-01-01',
        updated: '2024-01-01',
        first_name: 'Jane',
        last_name: 'Smith',
        full_name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '',
        location: '',
        professional_summary: '',
        target_industry: '',
        work_experience: '',
        education: '',
        skills: '',
        role: 'user',
        plan: 'free',
        verified: true,
        active: true
      }
    },
    {
      name: 'Partial Profile (Above Threshold)',
      profile: {
        id: 'test-3',
        user: 'test-user',
        created: '2024-01-01',
        updated: '2024-01-01',
        first_name: 'Bob',
        last_name: 'Johnson',
        full_name: 'Bob Johnson',
        email: 'bob@example.com',
        phone: '+1234567890',
        location: 'San Francisco, CA',
        professional_summary: 'Marketing professional with 3 years of experience',
        target_industry: 'Marketing',
        work_experience: JSON.stringify([{
          company: 'Marketing Inc',
          position: 'Marketing Manager',
          start_date: '2021-01',
          end_date: '2024-01'
        }]),
        education: '',
        skills: '',
        role: 'user',
        plan: 'free',
        verified: true,
        active: true
      }
    },
    {
      name: 'Missing Critical Fields',
      profile: {
        id: 'test-4',
        user: 'test-user',
        created: '2024-01-01',
        updated: '2024-01-01',
        first_name: '',
        last_name: '',
        full_name: '',
        email: 'test@example.com',
        phone: '+1234567890',
        location: 'Boston, MA',
        professional_summary: 'Professional with experience',
        target_industry: 'Finance',
        work_experience: JSON.stringify([{
          company: 'Finance Corp',
          position: 'Analyst',
          start_date: '2022-01',
          end_date: '2024-01'
        }]),
        education: JSON.stringify([{
          institution: 'College',
          degree: 'Bachelor',
          field: 'Finance'
        }]),
        skills: JSON.stringify([
          { name: 'Excel', level: 'advanced' }
        ]),
        role: 'user',
        plan: 'free',
        verified: true,
        active: true
      }
    }
  ];

  let selectedProfile = 0;
  $: currentProfile = testProfiles[selectedProfile].profile as UserProfile;
  $: analysis = analyzeProfile(currentProfile);
</script>

<div class="container mx-auto p-8 max-w-6xl">
  <h1 class="text-3xl font-bold mb-6">Profile Analysis Test Page</h1>
  
  <div class="mb-6">
    <label class="block text-sm font-medium mb-2">Select Test Profile:</label>
    <div class="flex gap-2 flex-wrap">
      {#each testProfiles as profile, index}
        <Button
          variant={selectedProfile === index ? 'default' : 'outline'}
          on:click={() => selectedProfile = index}
        >
          {profile.name}
        </Button>
      {/each}
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Profile Completeness Component -->
    <div>
      <h2 class="text-xl font-semibold mb-4">ProfileCompleteness Component</h2>
      <ProfileCompleteness profile={currentProfile} compact={false} showActions={true} />
    </div>

    <!-- Raw Analysis Data -->
    <div>
      <h2 class="text-xl font-semibold mb-4">Raw Analysis Data</h2>
      <Card>
        <CardHeader>
          <CardTitle>Analysis Result</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4 text-sm">
            <div>
              <strong>Completeness:</strong> {analysis.completeness}%
            </div>
            <div>
              <strong>Ready for Generation:</strong> 
              <span class={analysis.isReadyForGeneration ? 'text-green-600' : 'text-red-600'}>
                {analysis.isReadyForGeneration ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <strong>Minimum Requirements Met:</strong> 
              <span class={analysis.minimumRequirementsMet ? 'text-green-600' : 'text-red-600'}>
                {analysis.minimumRequirementsMet ? 'Yes' : 'No'}
              </span>
            </div>
            
            <div>
              <strong>Breakdown:</strong>
              <ul class="ml-4 mt-2 space-y-1">
                <li>Basic: {analysis.breakdown.basic}%</li>
                <li>Professional: {analysis.breakdown.professional}%</li>
                <li>Experience: {analysis.breakdown.experience}%</li>
                <li>Education: {analysis.breakdown.education}%</li>
                <li>Skills: {analysis.breakdown.skills}%</li>
              </ul>
            </div>

            <div>
              <strong>Missing Fields ({analysis.missingFields.length}):</strong>
              <ul class="ml-4 mt-2 space-y-1">
                {#each analysis.missingFields as field}
                  <li>{field.label} ({field.category})</li>
                {/each}
              </ul>
            </div>

            <div>
              <strong>Suggestions ({analysis.suggestions.length}):</strong>
              <ul class="ml-4 mt-2 space-y-2">
                {#each analysis.suggestions as suggestion}
                  <li class="border-l-2 border-gray-300 pl-2">
                    <div class="font-medium">{suggestion.label}</div>
                    <div class="text-xs text-gray-600">{suggestion.reason}</div>
                    <div class="text-xs text-blue-600">{suggestion.action}</div>
                  </li>
                {/each}
              </ul>
            </div>

            <div>
              <strong>Strengths ({analysis.strengths.length}):</strong>
              <ul class="ml-4 mt-2 space-y-1">
                {#each analysis.strengths as strength}
                  <li class="text-green-600">{strength}</li>
                {/each}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</div>
