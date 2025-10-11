<script lang="ts">
  import { analyzeProfile, type ProfileAnalysisResult } from '$lib/services/ProfileAnalysis';
  import type { UserProfile } from '$lib/types';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Progress } from '$lib/components/ui/progress';
  import { 
    CheckCircle2, 
    AlertCircle, 
    TrendingUp, 
    ExternalLink,
    Sparkles,
    User,
    Briefcase,
    GraduationCap,
    Code,
    FileText
  } from 'lucide-svelte';
  import { goto } from '$app/navigation';

  export let profile: UserProfile;
  export let compact: boolean = false;
  export let showActions: boolean = true;

  $: analysis = analyzeProfile(profile);
  
  function getCompletenessColor(completeness: number): string {
    if (completeness >= 80) return 'text-green-600';
    if (completeness >= 60) return 'text-blue-600';
    if (completeness >= 40) return 'text-yellow-600';
    return 'text-red-600';
  }
  
  function getCompletenessLabel(completeness: number): string {
    if (completeness >= 80) return 'Excellent';
    if (completeness >= 60) return 'Good';
    if (completeness >= 40) return 'Fair';
    return 'Needs Improvement';
  }
  
  function getCategoryIcon(category: string) {
    switch (category) {
      case 'basic': return User;
      case 'professional': return FileText;
      case 'experience': return Briefcase;
      case 'education': return GraduationCap;
      case 'skills': return Code;
      default: return FileText;
    }
  }
  
  function getImpactColor(impact: string): string {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }
  
  function goToProfile() {
    goto('/profile');
  }
</script>

{#if compact}
  <!-- Compact View -->
  <div class="flex items-center gap-3">
    <div class="flex-1">
      <div class="flex items-center justify-between mb-1">
        <span class="text-sm font-medium text-gray-700">Profile Completeness</span>
        <span class="text-sm font-semibold {getCompletenessColor(analysis.completeness)}">
          {analysis.completeness}%
        </span>
      </div>
      <Progress value={analysis.completeness} class="h-2" />
    </div>
    
    {#if showActions && analysis.completeness < 100}
      <Button variant="outline" size="sm" on:click={goToProfile}>
        <TrendingUp class="h-3 w-3 mr-1" />
        Improve
      </Button>
    {/if}
  </div>
{:else}
  <!-- Full View -->
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between">
        <div>
          <CardTitle class="flex items-center gap-2">
            <Sparkles class="h-5 w-5 text-purple-600" />
            Profile Completeness
          </CardTitle>
          <CardDescription>
            {#if analysis.isReadyForGeneration}
              Your profile is ready for resume generation
            {:else}
              Complete your profile for better resume generation
            {/if}
          </CardDescription>
        </div>
        
        <div class="text-right">
          <div class="text-3xl font-bold {getCompletenessColor(analysis.completeness)}">
            {analysis.completeness}%
          </div>
          <div class="text-sm text-gray-500">
            {getCompletenessLabel(analysis.completeness)}
          </div>
        </div>
      </div>
    </CardHeader>
    
    <CardContent class="space-y-6">
      <!-- Overall Progress -->
      <div>
        <Progress value={analysis.completeness} class="h-3" />
      </div>
      
      <!-- Status Badge -->
      <div class="flex items-center gap-2">
        {#if analysis.isReadyForGeneration}
          <Badge class="bg-green-100 text-green-800 border-green-200">
            <CheckCircle2 class="h-3 w-3 mr-1" />
            Ready for Generation
          </Badge>
        {:else}
          <Badge class="bg-yellow-100 text-yellow-800 border-yellow-200">
            <AlertCircle class="h-3 w-3 mr-1" />
            Needs Improvement
          </Badge>
        {/if}
        
        {#if !analysis.minimumRequirementsMet}
          <Badge class="bg-red-100 text-red-800 border-red-200">
            <AlertCircle class="h-3 w-3 mr-1" />
            Missing Required Fields
          </Badge>
        {/if}
      </div>
      
      <!-- Category Breakdown -->
      <div>
        <h4 class="text-sm font-semibold text-gray-700 mb-3">Breakdown by Category</h4>
        <div class="space-y-3">
          {#each Object.entries(analysis.breakdown) as [category, percentage]}
            {@const Icon = getCategoryIcon(category)}
            <div>
              <div class="flex items-center justify-between mb-1">
                <div class="flex items-center gap-2">
                  <Icon class="h-4 w-4 text-gray-500" />
                  <span class="text-sm text-gray-700 capitalize">{category}</span>
                </div>
                <span class="text-sm font-medium {getCompletenessColor(percentage)}">
                  {percentage}%
                </span>
              </div>
              <Progress value={percentage} class="h-2" />
            </div>
          {/each}
        </div>
      </div>
      
      <!-- Strengths -->
      {#if analysis.strengths.length > 0}
        <div>
          <h4 class="text-sm font-semibold text-gray-700 mb-2">Strengths</h4>
          <div class="flex flex-wrap gap-2">
            {#each analysis.strengths as strength}
              <Badge variant="outline" class="bg-green-50 text-green-700 border-green-200">
                <CheckCircle2 class="h-3 w-3 mr-1" />
                {strength}
              </Badge>
            {/each}
          </div>
        </div>
      {/if}
      
      <!-- Suggestions -->
      {#if analysis.suggestions.length > 0}
        <div>
          <h4 class="text-sm font-semibold text-gray-700 mb-3">Improvement Suggestions</h4>
          <div class="space-y-2">
            {#each analysis.suggestions.slice(0, 5) as suggestion}
              <div class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div class="flex-shrink-0 mt-0.5">
                  <Badge class={getImpactColor(suggestion.impact)} variant="outline">
                    {suggestion.impact}
                  </Badge>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-sm text-gray-900 mb-1">
                    {suggestion.label}
                  </div>
                  <div class="text-xs text-gray-600 mb-1">
                    {suggestion.reason}
                  </div>
                  <div class="text-xs text-gray-500">
                    💡 {suggestion.action}
                  </div>
                </div>
              </div>
            {/each}
          </div>
          
          {#if analysis.suggestions.length > 5}
            <p class="text-xs text-gray-500 mt-2">
              +{analysis.suggestions.length - 5} more suggestions
            </p>
          {/if}
        </div>
      {/if}
      
      <!-- Actions -->
      {#if showActions}
        <div class="flex items-center gap-2 pt-2">
          <Button on:click={goToProfile} class="flex-1">
            <ExternalLink class="h-4 w-4 mr-2" />
            Complete Profile
          </Button>
          
          {#if analysis.isReadyForGeneration}
            <Button variant="outline" disabled>
              <CheckCircle2 class="h-4 w-4 mr-2" />
              Profile Complete
            </Button>
          {/if}
        </div>
      {/if}
    </CardContent>
  </Card>
{/if}
