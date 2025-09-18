<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Button } from '$lib/components/ui/button';
  import { X } from 'lucide-svelte';
  
  export let open = false;
  export let title: string = '';
  export let position: 'bottom' | 'top' | 'left' | 'right' = 'bottom';
  export let height = 'auto';
  export let showCloseButton = true;
  
  const dispatch = createEventDispatcher();
  
  function handleClose() {
    open = false;
    dispatch('close');
  }
  
  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }
  
  function getSheetClasses() {
    const baseClasses = 'fixed bg-white shadow-lg transition-transform duration-300 ease-in-out z-50';
    
    switch (position) {
      case 'bottom':
        return `${baseClasses} bottom-0 left-0 right-0 rounded-t-lg ${open ? 'translate-y-0' : 'translate-y-full'}`;
      case 'top':
        return `${baseClasses} top-0 left-0 right-0 rounded-b-lg ${open ? 'translate-y-0' : '-translate-y-full'}`;
      case 'left':
        return `${baseClasses} top-0 bottom-0 left-0 rounded-r-lg ${open ? 'translate-x-0' : '-translate-x-full'}`;
      case 'right':
        return `${baseClasses} top-0 bottom-0 right-0 rounded-l-lg ${open ? 'translate-x-0' : 'translate-x-full'}`;
      default:
        return baseClasses;
    }
  }
  
  function getHeightStyle() {
    if (position === 'left' || position === 'right') {
      return 'width: 300px;';
    }
    
    if (height === 'auto') {
      return 'max-height: 90vh;';
    }
    
    return `height: ${height};`;
  }
</script>

{#if open}
  <!-- Backdrop -->
  <div 
    class="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
    on:click={handleBackdropClick}
  ></div>
  
  <!-- Sheet -->
  <div 
    class={getSheetClasses()}
    style={getHeightStyle()}
  >
    <!-- Header -->
    {#if title || showCloseButton}
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        {#if title}
          <h2 class="text-lg font-semibold text-gray-900">{title}</h2>
        {:else}
          <div></div>
        {/if}
        
        {#if showCloseButton}
          <Button variant="ghost" size="sm" class="h-8 w-8 p-0" on:click={handleClose}>
            <X class="h-4 w-4" />
          </Button>
        {/if}
      </div>
    {/if}
    
    <!-- Content -->
    <div class="overflow-y-auto {position === 'left' || position === 'right' ? 'h-full' : 'max-h-full'} p-4">
      <slot />
    </div>
  </div>
{/if}