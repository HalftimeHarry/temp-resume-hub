<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '$lib/components/ui/dialog';
  import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '$lib/components/ui/drawer';
  import { Button } from '$lib/components/ui/button';
  import { X } from 'lucide-svelte';
  
  export let open = false;
  export let title: string = '';
  export let description: string = '';
  export let showCloseButton = true;
  export let maxWidth = 'max-w-lg';
  
  const dispatch = createEventDispatcher();
  
  let isMobile = false;
  
  // Check if mobile on mount and resize
  function checkMobile() {
    isMobile = window.innerWidth < 768;
  }
  
  // Initialize mobile check
  if (typeof window !== 'undefined') {
    checkMobile();
    window.addEventListener('resize', checkMobile);
  }
  
  function handleClose() {
    open = false;
    dispatch('close');
  }
</script>

<svelte:window on:resize={checkMobile} />

{#if isMobile}
  <!-- Mobile: Use Drawer -->
  <Drawer bind:open>
    <DrawerContent class="max-h-[90vh]">
      <DrawerHeader class="text-left">
        <div class="flex items-center justify-between">
          <div>
            {#if title}
              <DrawerTitle>{title}</DrawerTitle>
            {/if}
            {#if description}
              <DrawerDescription>{description}</DrawerDescription>
            {/if}
          </div>
          {#if showCloseButton}
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" on:click={handleClose}>
              <X class="h-4 w-4" />
            </Button>
          {/if}
        </div>
      </DrawerHeader>
      
      <div class="px-4 pb-4 overflow-y-auto">
        <slot />
      </div>
    </DrawerContent>
  </Drawer>
{:else}
  <!-- Desktop: Use Dialog -->
  <Dialog bind:open>
    <DialogContent class="{maxWidth} max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <div class="flex items-center justify-between">
          <div>
            {#if title}
              <DialogTitle>{title}</DialogTitle>
            {/if}
            {#if description}
              <DialogDescription>{description}</DialogDescription>
            {/if}
          </div>
          {#if showCloseButton}
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" on:click={handleClose}>
              <X class="h-4 w-4" />
            </Button>
          {/if}
        </div>
      </DialogHeader>
      
      <div class="mt-4">
        <slot />
      </div>
    </DialogContent>
  </Dialog>
{/if}