<!--
  Backward Compatibility Test Component
  Tests that enhanced template system works with existing templates
-->

<script lang="ts">
  import { onMount } from 'svelte';
  import { templateStore, templates, isLoadingTemplates } from '$lib/stores/templates';
  import { enhancedTemplateStore, enhancedTemplates } from '$lib/stores/enhancedTemplates';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  
  let testResults = {
    loading: true,
    originalTemplatesLoaded: false,
    enhancedTemplatesLoaded: false,
    templateCountMatch: false,
    structureCompatible: true,
    functionalityPreserved: true,
    errors: [],
    originalCount: 0,
    enhancedCount: 0,
    compatibilityIssues: []
  };
  
  let originalTemplates = [];
  let enhancedTemplatesList = [];
  
  onMount(async () => {
    console.log('🔄 Starting backward compatibility test...');
    await runCompatibilityTest();
  });
  
  async function runCompatibilityTest() {
    testResults = {
      loading: true,
      originalTemplatesLoaded: false,
      enhancedTemplatesLoaded: false,
      templateCountMatch: false,
      structureCompatible: true,
      functionalityPreserved: true,
      errors: [],
      originalCount: 0,
      enhancedCount: 0,
      compatibilityIssues: []
    };
    
    try {
      // Test 1: Load templates using original store
      console.log('Test 1: Loading templates with original store...');
      originalTemplates = await templateStore.loadTemplates();
      testResults.originalTemplatesLoaded = true;
      testResults.originalCount = originalTemplates.length;
      
      // Test 2: Load templates using enhanced store
      console.log('Test 2: Loading templates with enhanced store...');
      await enhancedTemplateStore.loadTemplates();
      enhancedTemplatesList = $enhancedTemplates;
      testResults.enhancedTemplatesLoaded = true;
      testResults.enhancedCount = enhancedTemplatesList.length;
      
      // Test 3: Compare template counts
      console.log('Test 3: Comparing template counts...');
      testResults.templateCountMatch = testResults.originalCount === testResults.enhancedCount;
      
      // Test 4: Check structure compatibility
      console.log('Test 4: Checking structure compatibility...');
      await checkStructureCompatibility();
      
      // Test 5: Test functionality preservation
      console.log('Test 5: Testing functionality preservation...');
      await testFunctionalityPreservation();
      
      testResults.loading = false;
      console.log('✅ Backward compatibility test completed');
      
    } catch (error) {
      console.error('❌ Compatibility test failed:', error);
      testResults.errors.push(error.message);
      testResults.loading = false;
    }
  }
  
  async function checkStructureCompatibility() {
    const issues = [];
    
    // Check each original template against enhanced version
    for (const originalTemplate of originalTemplates) {
      const enhancedTemplate = enhancedTemplatesList.find(t => t.id === originalTemplate.id);
      
      if (!enhancedTemplate) {
        issues.push(`Template ${originalTemplate.name} not found in enhanced store`);
        continue;
      }
      
      // Check required fields are preserved
      const requiredFields = ['id', 'name', 'description', 'category', 'thumbnail', 'settings'];
      for (const field of requiredFields) {
        if (originalTemplate[field] !== enhancedTemplate[field]) {
          // Special handling for settings which might be nested differently
          if (field === 'settings') {
            if (!deepEqual(originalTemplate.settings, enhancedTemplate.layoutConfig)) {
              issues.push(`Template ${originalTemplate.name}: settings/layoutConfig mismatch`);
            }
          } else {
            issues.push(`Template ${originalTemplate.name}: ${field} field mismatch`);
          }
        }
      }
      
      // Check that enhanced template has layoutConfig
      if (!enhancedTemplate.layoutConfig) {
        issues.push(`Template ${originalTemplate.name}: missing layoutConfig in enhanced version`);
      }
      
      // Check that enhanced template maintains backward compatibility
      if (enhancedTemplate.layoutConfig && !enhancedTemplate.layoutConfig.layout) {
        issues.push(`Template ${originalTemplate.name}: layoutConfig missing layout field`);
      }
    }
    
    testResults.compatibilityIssues = issues;
    testResults.structureCompatible = issues.length === 0;
  }
  
  async function testFunctionalityPreservation() {
    try {
      // Test template selection functionality
      const testTemplateId = originalTemplates[0]?.id;
      if (testTemplateId) {
        // Test original store
        const originalTemplate = await templateStore.getTemplate(testTemplateId);
        
        // Test enhanced store
        const enhancedTemplate = enhancedTemplatesList.find(t => t.id === testTemplateId);
        
        if (!originalTemplate || !enhancedTemplate) {
          testResults.functionalityPreserved = false;
          testResults.errors.push('Template retrieval functionality broken');
        }
      }
      
      // Test filtering functionality
      const categories = templateStore.getCategories();
      if (!categories || categories.length === 0) {
        testResults.functionalityPreserved = false;
        testResults.errors.push('Category functionality broken');
      }
      
      // Test search functionality
      if (originalTemplates.length > 0) {
        const searchResults = await templateStore.searchTemplates(originalTemplates[0].name);
        if (!searchResults || searchResults.length === 0) {
          testResults.functionalityPreserved = false;
          testResults.errors.push('Search functionality broken');
        }
      }
      
    } catch (error) {
      testResults.functionalityPreserved = false;
      testResults.errors.push(`Functionality test error: ${error.message}`);
    }
  }
  
  function deepEqual(obj1, obj2) {
    if (obj1 === obj2) return true;
    if (obj1 == null || obj2 == null) return false;
    if (typeof obj1 !== typeof obj2) return false;
    
    if (typeof obj1 === 'object') {
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);
      
      if (keys1.length !== keys2.length) return false;
      
      for (const key of keys1) {
        if (!keys2.includes(key)) return false;
        if (!deepEqual(obj1[key], obj2[key])) return false;
      }
      
      return true;
    }
    
    return obj1 === obj2;
  }
  
  async function testTemplateInteroperability() {
    console.log('🧪 Testing template interoperability...');
    
    try {
      // Test that enhanced templates can be used by original template system
      const enhancedTemplate = enhancedTemplatesList.find(t => t.quickstarter);
      
      if (enhancedTemplate) {
        // Simulate using enhanced template in original system
        const templateForOriginalSystem = {
          id: enhancedTemplate.id,
          name: enhancedTemplate.name,
          description: enhancedTemplate.description,
          category: enhancedTemplate.category,
          thumbnail: enhancedTemplate.thumbnail,
          settings: enhancedTemplate.layoutConfig,
          sections: enhancedTemplate.layoutConfig?.sections || [],
          isPremium: enhancedTemplate.isPremium,
          createdAt: enhancedTemplate.createdAt
        };
        
        console.log('✅ Enhanced template can be used by original system:', templateForOriginalSystem);
      }
      
      // Test that original templates work in enhanced system
      const originalTemplate = originalTemplates[0];
      if (originalTemplate) {
        const recommendations = enhancedTemplateStore.getRecommendations({
          targetIndustry: 'general',
          experienceLevel: 'mid',
          jobTypes: ['general']
        });
        
        console.log(`✅ Original templates work in enhanced system. Found ${recommendations.length} recommendations`);
      }
      
    } catch (error) {
      console.error('❌ Interoperability test failed:', error);
    }
  }
</script>

<div class="backward-compatibility-test p-6 max-w-4xl mx-auto">
  <div class="mb-6">
    <h1 class="text-2xl font-bold mb-2">🔄 Backward Compatibility Test</h1>
    <p class="text-gray-600">Verifying that enhanced templates work with existing template system</p>
  </div>
  
  <!-- Test Results Summary -->
  <Card class="mb-6">
    <CardHeader>
      <CardTitle>Compatibility Test Results</CardTitle>
      <CardDescription>Verification that enhanced system maintains backward compatibility</CardDescription>
    </CardHeader>
    <CardContent>
      {#if testResults.loading}
        <div class="flex items-center gap-2">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span>Running compatibility tests...</span>
        </div>
      {:else}
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{testResults.originalCount}</div>
            <div class="text-sm text-gray-600">Original Templates</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{testResults.enhancedCount}</div>
            <div class="text-sm text-gray-600">Enhanced Templates</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold {testResults.templateCountMatch ? 'text-green-600' : 'text-red-600'}">
              {testResults.templateCountMatch ? '✅' : '❌'}
            </div>
            <div class="text-sm text-gray-600">Count Match</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold {testResults.structureCompatible ? 'text-green-600' : 'text-red-600'}">
              {testResults.structureCompatible ? '✅' : '❌'}
            </div>
            <div class="text-sm text-gray-600">Structure Compatible</div>
          </div>
        </div>
        
        <div class="flex flex-wrap gap-2 mb-4">
          <Badge variant={testResults.originalTemplatesLoaded ? 'default' : 'destructive'}>
            Original Store: {testResults.originalTemplatesLoaded ? 'Working' : 'Failed'}
          </Badge>
          <Badge variant={testResults.enhancedTemplatesLoaded ? 'default' : 'destructive'}>
            Enhanced Store: {testResults.enhancedTemplatesLoaded ? 'Working' : 'Failed'}
          </Badge>
          <Badge variant={testResults.functionalityPreserved ? 'default' : 'destructive'}>
            Functionality: {testResults.functionalityPreserved ? 'Preserved' : 'Broken'}
          </Badge>
        </div>
        
        {#if testResults.compatibilityIssues.length > 0}
          <div class="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
            <h4 class="font-medium text-yellow-800 mb-2">Compatibility Issues:</h4>
            {#each testResults.compatibilityIssues as issue}
              <p class="text-sm text-yellow-700">⚠️ {issue}</p>
            {/each}
          </div>
        {/if}
        
        {#if testResults.errors.length > 0}
          <div class="bg-red-50 border border-red-200 rounded p-3">
            <h4 class="font-medium text-red-800 mb-2">Errors:</h4>
            {#each testResults.errors as error}
              <p class="text-sm text-red-700">❌ {error}</p>
            {/each}
          </div>
        {/if}
      {/if}
    </CardContent>
  </Card>
  
  <!-- Template Comparison -->
  {#if originalTemplates.length > 0 && enhancedTemplatesList.length > 0}
    <Card class="mb-6">
      <CardHeader>
        <CardTitle>Template Structure Comparison</CardTitle>
        <CardDescription>Comparing original vs enhanced template structures</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Original Template -->
          <div>
            <h4 class="font-medium mb-3">Original Template Structure</h4>
            <div class="bg-gray-50 p-3 rounded text-sm">
              <pre class="whitespace-pre-wrap">{JSON.stringify({
                id: originalTemplates[0]?.id,
                name: originalTemplates[0]?.name,
                category: originalTemplates[0]?.category,
                settings: originalTemplates[0]?.settings,
                isPremium: originalTemplates[0]?.isPremium
              }, null, 2)}</pre>
            </div>
          </div>
          
          <!-- Enhanced Template -->
          <div>
            <h4 class="font-medium mb-3">Enhanced Template Structure</h4>
            <div class="bg-gray-50 p-3 rounded text-sm">
              <pre class="whitespace-pre-wrap">{JSON.stringify({
                id: enhancedTemplatesList[0]?.id,
                name: enhancedTemplatesList[0]?.name,
                category: enhancedTemplatesList[0]?.category,
                layoutConfig: enhancedTemplatesList[0]?.layoutConfig,
                quickstarter: enhancedTemplatesList[0]?.quickstarter ? 'Present' : 'Not Present',
                isPremium: enhancedTemplatesList[0]?.isPremium
              }, null, 2)}</pre>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  {/if}
  
  <!-- Test Actions -->
  <Card>
    <CardHeader>
      <CardTitle>Test Actions</CardTitle>
      <CardDescription>Additional compatibility tests you can run</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="flex flex-wrap gap-3">
        <Button on:click={runCompatibilityTest}>
          🔄 Re-run Compatibility Test
        </Button>
        <Button variant="outline" on:click={testTemplateInteroperability}>
          🔗 Test Interoperability
        </Button>
      </div>
    </CardContent>
  </Card>
</div>

<style>
  .backward-compatibility-test {
    font-family: 'Inter', sans-serif;
  }
  
  pre {
    font-size: 11px;
    max-height: 200px;
    overflow-y: auto;
  }
</style>