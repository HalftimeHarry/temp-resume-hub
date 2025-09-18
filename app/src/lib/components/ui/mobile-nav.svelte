<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { 
    LayoutDashboard,
    FileText,
    Star,
    BarChart3,
    Plus,
    User,
    Settings
  } from 'lucide-svelte';
  
  $: currentPath = $page.url.pathname;
  
  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      active: currentPath === '/dashboard'
    },
    {
      label: 'Resumes',
      href: '/resumes',
      icon: FileText,
      active: currentPath.startsWith('/resumes'),
      badge: '3'
    },
    {
      label: 'Create',
      href: '/editor/new',
      icon: Plus,
      active: currentPath.startsWith('/editor'),
      primary: true
    },
    {
      label: 'Templates',
      href: '/templates',
      icon: Star,
      active: currentPath.startsWith('/templates')
    },
    {
      label: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      active: currentPath.startsWith('/analytics')
    }
  ];
  
  function navigate(href: string) {
    goto(href);
  }
</script>

<!-- Mobile Bottom Navigation -->
<nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
  <div class="grid grid-cols-5 h-16">
    {#each navItems as item}
      <button
        class="flex flex-col items-center justify-center space-y-1 px-2 py-1 transition-colors {
          item.active 
            ? 'text-blue-600 bg-blue-50' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        } {item.primary ? 'relative' : ''}"
        on:click={() => navigate(item.href)}
      >
        {#if item.primary}
          <!-- Special styling for create button -->
          <div class="absolute -top-3 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <svelte:component this={item.icon} class="h-6 w-6 text-white" />
          </div>
          <span class="text-xs font-medium mt-6">{item.label}</span>
        {:else}
          <div class="relative">
            <svelte:component this={item.icon} class="h-5 w-5" />
            {#if item.badge}
              <Badge 
                variant="destructive" 
                class="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs flex items-center justify-center"
              >
                {item.badge}
              </Badge>
            {/if}
          </div>
          <span class="text-xs font-medium">{item.label}</span>
        {/if}
      </button>
    {/each}
  </div>
</nav>

<!-- Spacer to prevent content from being hidden behind bottom nav -->
<div class="h-16 md:hidden"></div>