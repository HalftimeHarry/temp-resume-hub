<!--
  Test Page for Enhanced Templates
  Access via: /test/enhanced-templates
-->

<script lang="ts">
  import EnhancedTemplateTest from '$lib/components/test/EnhancedTemplateTest.svelte';
  import BackwardCompatibilityTest from '$lib/components/test/BackwardCompatibilityTest.svelte';
  import { Button } from '$lib/components/ui/button';
  import { onMount } from 'svelte';
  
  let currentTest = 'enhanced'; // 'enhanced' or 'compatibility'
  
  onMount(() => {
    console.log('🧪 Enhanced Template Test Page loaded');
  });
</script>

<svelte:head>
  <title>Enhanced Template Test - Resume Hub</title>
  <meta name="description" content="Test page for enhanced template system" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Test Navigation -->
  <div class="bg-white border-b border-gray-200 p-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-xl font-bold mb-4">Enhanced Template System Tests</h1>
      <div class="flex gap-2">
        <Button 
          variant={currentTest === 'enhanced' ? 'default' : 'outline'}
          on:click={() => currentTest = 'enhanced'}
        >
          🧪 Enhanced Template Test
        </Button>
        <Button 
          variant={currentTest === 'compatibility' ? 'default' : 'outline'}
          on:click={() => currentTest = 'compatibility'}
        >
          🔄 Backward Compatibility Test
        </Button>
        <Button 
          variant="outline"
          on:click={() => window.location.href = '/test/profile-recommendations'}
        >
          👤 Profile & Recommendations Test
        </Button>
      </div>
    </div>
  </div>
  
  <!-- Test Content -->
  <div class="py-6">
    {#if currentTest === 'enhanced'}
      <EnhancedTemplateTest />
    {:else if currentTest === 'compatibility'}
      <BackwardCompatibilityTest />
    {/if}
  </div>
</div>