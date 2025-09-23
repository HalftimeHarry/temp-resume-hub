<script>
  import { goto } from '$app/navigation';
  import TemplateGallery from '$lib/components/templates/TemplateGallery.svelte';
  import { Button } from '$lib/components/ui/button';
  
  function goHome() {
    goto('/');
  }
</script>

<svelte:head>
  <title>Templates - Digital Resume Hub</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <div class="bg-white border-b">
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Resume Templates</h1>
          <p class="text-gray-600">Choose from professional templates to get started quickly</p>
        </div>
        
        <Button 
          variant="outline"
          on:click={goHome}
        >
          Home
        </Button>
      </div>
    </div>
  </div>
  
  <!-- Template Gallery -->
  <div class="max-w-7xl mx-auto px-4 py-8">
    <TemplateGallery />
  </div>
</div>