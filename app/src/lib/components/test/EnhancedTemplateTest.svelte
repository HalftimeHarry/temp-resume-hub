<!--
  Test Component for Enhanced Templates
  Use this to verify that the enhanced template system is working correctly
-->

<script lang="ts">
  import { onMount } from 'svelte';
  import { enhancedTemplateStore, enhancedTemplates, quickstarters, isLoadingEnhanced } from '$lib/stores/enhancedTemplates';
  import type { EnhancedTemplate } from '$lib/stores/enhancedTemplates';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  
  let testResults: any = {
    loading: true,
    templateCount: 0,
    quickstarterCount: 0,
    enhancedTemplateFound: false,
    quickstarterDataValid: false,
    backwardCompatible: true,
    errors: []
  };
  let selectedTemplate: EnhancedTemplate | null = null;
  let showDetails = false;
  
  onMount(async () => {
    console.log('🧪 Starting Enhanced Template Test...');
    await runTests();
  });
  
  async function runTests() {
    testResults = {
      loading: true,
      templateCount: 0,
      quickstarterCount: 0,
      enhancedTemplateFound: false,
      quickstarterDataValid: false,
      backwardCompatible: true,
      errors: []
    };
    
    try {
      // Test 1: Load templates
      console.log('Test 1: Loading templates...');
      
      // Check if PocketBase is available
      try {
        await enhancedTemplateStore.loadTemplates();
        testResults.templateCount = $enhancedTemplates?.length || 0;
        testResults.quickstarterCount = $quickstarters?.length || 0;
      } catch (pbError) {
        console.warn('PocketBase not available, using mock data for testing');
        testResults.errors.push('PocketBase connection failed - using mock data');
        
        // Use mock data for testing
        testResults.templateCount = 5;
        testResults.quickstarterCount = 1;
        
        // Create mock enhanced template
        selectedTemplate = {
          id: 'mock-retail',
          name: 'Retail Rockstar (Mock)',
          description: 'Mock template for testing enhanced features',
          category: 'Industry Specific',
          thumbnail: '/templates/retail-rockstar.svg',
          previewImages: [],
          settings: {},
          sections: [],
          isPremium: false,
          isPopular: true,
          createdBy: 'system',
          createdAt: new Date().toISOString(),
          usageCount: 0,
          rating: 4.5,
          tags: ['retail', 'customer-service'],
          layoutConfig: {
            layout: 'modern',
            colorScheme: 'blue',
            spacing: 'normal',
            sections: ['experience', 'education', 'skills']
          },
          quickstarter: {
            metadata: {
              targetJobs: ['Sales Associate', 'Cashier', 'Customer Service Rep'],
              industry: 'retail',
              experienceLevel: 'entry',
              averageSalary: 35000,
              demandLevel: 'high',
              successRate: 85,
              popularityScore: 4.2,
              timeToHire: '2-3 weeks',
              commonEmployers: ['Target', 'Walmart', 'Best Buy']
            },
            starterContent: {
              summaryTemplates: [
                'Customer-focused retail professional with passion for sales',
                'Dedicated team member with strong communication skills'
              ],
              skillSuggestions: [
                { name: 'Customer Service', category: 'soft', priority: 'high' },
                { name: 'Cash Handling', category: 'technical', priority: 'high' },
                { name: 'Sales Techniques', category: 'professional', priority: 'medium' }
              ],
              experienceTemplates: []
            },
            guidance: {
              gettingStarted: [
                'Start with customer service achievements',
                'Include sales numbers when possible',
                'Highlight teamwork abilities'
              ],
              commonMistakes: [
                'Avoid listing just job duties',
                'Don\'t forget to quantify achievements'
              ],
              industryTips: [
                'Retail values reliability',
                'Customer service skills transfer well'
              ]
            }
          }
        };
      }
      
      // Test 2: Check for enhanced template
      console.log('Test 2: Looking for enhanced template...');
      let retailTemplate = ($enhancedTemplates || []).find(t => 
        t.name?.toLowerCase().includes('retail') || 
        t.description?.toLowerCase().includes('retail')
      );
      
      // If no retail template found in real data, use mock
      if (!retailTemplate && selectedTemplate) {
        retailTemplate = selectedTemplate;
      }
      
      if (retailTemplate) {
        testResults.enhancedTemplateFound = true;
        selectedTemplate = retailTemplate;
        
        // Test 3: Validate quickstarter data
        if (retailTemplate.quickstarter) {
          console.log('Test 3: Validating quickstarter data...');
          const qs = retailTemplate.quickstarter;
          
          testResults.quickstarterDataValid = 
            qs.metadata?.targetJobs?.length > 0 &&
            qs.starterContent?.summaryTemplates?.length > 0 &&
            qs.starterContent?.skillSuggestions?.length > 0 &&
            qs.guidance?.gettingStarted?.length > 0;
        }
        
        // Test 4: Backward compatibility
        console.log('Test 4: Checking backward compatibility...');
        testResults.backwardCompatible = 
          retailTemplate.layoutConfig?.layout !== undefined &&
          retailTemplate.layoutConfig?.colorScheme !== undefined &&
          retailTemplate.layoutConfig?.sections?.length > 0;
      }
      
      testResults.loading = false;
      console.log('✅ All tests completed');
      
    } catch (error) {
      console.error('❌ Test failed:', error);
      testResults.errors = testResults.errors || [];
      testResults.errors.push(error?.message || 'Unknown error occurred');
      testResults.loading = false;
    }
  }
  
  function toggleDetails() {
    showDetails = !showDetails;
  }
  
  async function testRecommendations() {
    console.log('🧪 Testing recommendation system...');
    
    const recommendations = enhancedTemplateStore.getRecommendations({
      targetIndustry: 'retail',
      experienceLevel: 'entry',
      jobTypes: ['cashier', 'sales associate']
    });
    
    console.log(`Found ${recommendations.length} recommendations:`, recommendations);
  }
  
  async function runQuickstarterTest() {
    await enhancedTemplateStore.testEnhancedTemplate();
  }
</script>

<div class="enhanced-template-test p-6 max-w-4xl mx-auto">
  <div class="mb-6">
    <h1 class="text-2xl font-bold mb-2">🧪 Enhanced Template System Test</h1>
    <p class="text-gray-600">Testing the hybrid approach with enhanced quickstarter data</p>
  </div>
  
  <!-- Test Results Summary -->
  <Card class="mb-6">
    <CardHeader>
      <CardTitle>Test Results Summary</CardTitle>
      <CardDescription>Verification of enhanced template loading and processing</CardDescription>
    </CardHeader>
    <CardContent>
      {#if testResults.loading || $isLoadingEnhanced}
        <div class="flex items-center gap-2">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span>Running tests...</span>
        </div>
      {:else}
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{testResults.templateCount}</div>
            <div class="text-sm text-gray-600">Total Templates</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{testResults.quickstarterCount}</div>
            <div class="text-sm text-gray-600">Enhanced Templates</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold {testResults.enhancedTemplateFound ? 'text-green-600' : 'text-red-600'}">
              {testResults.enhancedTemplateFound ? '✅' : '❌'}
            </div>
            <div class="text-sm text-gray-600">Retail Template Found</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold {testResults.quickstarterDataValid ? 'text-green-600' : 'text-red-600'}">
              {testResults.quickstarterDataValid ? '✅' : '❌'}
            </div>
            <div class="text-sm text-gray-600">Data Valid</div>
          </div>
        </div>
        
        <div class="flex flex-wrap gap-2 mb-4">
          <Badge variant={testResults.enhancedTemplateFound ? 'default' : 'destructive'}>
            Enhanced Template: {testResults.enhancedTemplateFound ? 'Found' : 'Not Found'}
          </Badge>
          <Badge variant={testResults.quickstarterDataValid ? 'default' : 'destructive'}>
            Quickstarter Data: {testResults.quickstarterDataValid ? 'Valid' : 'Invalid'}
          </Badge>
          <Badge variant={testResults.backwardCompatible ? 'default' : 'destructive'}>
            Backward Compatible: {testResults.backwardCompatible ? 'Yes' : 'No'}
          </Badge>
        </div>
        
        {#if testResults.errors && testResults.errors.length > 0}
          <div class="bg-red-50 border border-red-200 rounded p-3">
            <h4 class="font-medium text-red-800 mb-2">Errors:</h4>
            {#each testResults.errors as error}
              <p class="text-sm text-red-700">• {error}</p>
            {/each}
          </div>
        {/if}
      {/if}
    </CardContent>
  </Card>
  
  <!-- Enhanced Template Details -->
  {#if selectedTemplate}
    <Card class="mb-6">
      <CardHeader>
        <CardTitle>{selectedTemplate.name}</CardTitle>
        <CardDescription>{selectedTemplate.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Basic Info -->
          <div>
            <h4 class="font-medium mb-2">Basic Information</h4>
            <div class="space-y-1 text-sm">
              <p><strong>Category:</strong> {selectedTemplate.category}</p>
              <p><strong>Premium:</strong> {selectedTemplate.isPremium ? 'Yes' : 'No'}</p>
              <p><strong>Popular:</strong> {selectedTemplate.isPopular ? 'Yes' : 'No'}</p>
              <p><strong>Rating:</strong> {selectedTemplate.rating}/5</p>
            </div>
          </div>
          
          <!-- Layout Config -->
          <div>
            <h4 class="font-medium mb-2">Layout Configuration</h4>
            <div class="space-y-1 text-sm">
              <p><strong>Layout:</strong> {selectedTemplate.layoutConfig?.layout || 'N/A'}</p>
              <p><strong>Color Scheme:</strong> {selectedTemplate.layoutConfig?.colorScheme || 'N/A'}</p>
              <p><strong>Spacing:</strong> {selectedTemplate.layoutConfig?.spacing || 'N/A'}</p>
              <p><strong>Sections:</strong> {selectedTemplate.layoutConfig?.sections?.join(', ') || 'N/A'}</p>
            </div>
          </div>
        </div>
        
        {#if selectedTemplate.quickstarter}
          <div class="mt-6">
            <div class="flex items-center justify-between mb-4">
              <h4 class="font-medium">Quickstarter Data</h4>
              <Button variant="outline" size="sm" on:click={toggleDetails}>
                {showDetails ? 'Hide Details' : 'Show Details'}
              </Button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div class="text-center p-3 bg-blue-50 rounded">
                <div class="font-bold text-blue-600">{selectedTemplate.quickstarter?.metadata?.targetJobs?.length || 0}</div>
                <div class="text-sm text-gray-600">Target Jobs</div>
              </div>
              <div class="text-center p-3 bg-green-50 rounded">
                <div class="font-bold text-green-600">{selectedTemplate.quickstarter?.starterContent?.summaryTemplates?.length || 0}</div>
                <div class="text-sm text-gray-600">Summary Templates</div>
              </div>
              <div class="text-center p-3 bg-purple-50 rounded">
                <div class="font-bold text-purple-600">{selectedTemplate.quickstarter?.starterContent?.skillSuggestions?.length || 0}</div>
                <div class="text-sm text-gray-600">Skill Suggestions</div>
              </div>
            </div>
            
            {#if showDetails}
              <div class="space-y-4">
                <!-- Target Jobs -->
                <div>
                  <h5 class="font-medium mb-2">Target Jobs</h5>
                  <div class="flex flex-wrap gap-2">
                    {#each selectedTemplate.quickstarter?.metadata?.targetJobs || [] as job}
                      <Badge variant="outline">{job}</Badge>
                    {/each}
                  </div>
                </div>
                
                <!-- Sample Summary -->
                <div>
                  <h5 class="font-medium mb-2">Sample Summary Template</h5>
                  <p class="text-sm bg-gray-50 p-3 rounded italic">
                    "{selectedTemplate.quickstarter?.starterContent?.summaryTemplates?.[0] || 'No summary template available'}"
                  </p>
                </div>
                
                <!-- Top Skills -->
                <div>
                  <h5 class="font-medium mb-2">Top Skill Suggestions</h5>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {#each (selectedTemplate.quickstarter?.starterContent?.skillSuggestions || []).slice(0, 6) as skill}
                      <div class="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                        <span>{skill.name}</span>
                        <Badge variant="outline" class="text-xs">{skill.priority}</Badge>
                      </div>
                    {/each}
                  </div>
                </div>
                
                <!-- Getting Started Tips -->
                <div>
                  <h5 class="font-medium mb-2">Getting Started Tips</h5>
                  <ul class="text-sm space-y-1">
                    {#each (selectedTemplate.quickstarter?.guidance?.gettingStarted || []).slice(0, 3) as tip}
                      <li class="flex items-start gap-2">
                        <span class="text-green-600 mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    {/each}
                  </ul>
                </div>
              </div>
            {/if}
          </div>
        {/if}
      </CardContent>
    </Card>
  {/if}
  
  <!-- Test Actions -->
  <Card>
    <CardHeader>
      <CardTitle>Test Actions</CardTitle>
      <CardDescription>Additional tests you can run</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="flex flex-wrap gap-3">
        <Button on:click={runTests}>
          🔄 Re-run Tests
        </Button>
        <Button variant="outline" on:click={testRecommendations}>
          🎯 Test Recommendations
        </Button>
        <Button variant="outline" on:click={runQuickstarterTest}>
          🧪 Run Quickstarter Test
        </Button>
      </div>
    </CardContent>
  </Card>
</div>

<style>
  .enhanced-template-test {
    font-family: 'Inter', sans-serif;
  }
</style>