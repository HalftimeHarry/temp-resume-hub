<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { authStore } from '$lib/stores/auth';
  import Header from './Header.svelte';
  import Sidebar from './Sidebar.svelte';
  import MobileNav from '$lib/components/ui/mobile-nav.svelte';
  import { Toaster } from 'svelte-sonner';
  import { initDeviceDetection, deviceInfo } from '$lib/utils/responsive';
  
  export let showSidebar = true;
  export let sidebarCollapsed = false;
  
  let isMobile = false;
  let sidebarOpen = false;
  
  $: currentPath = $page.url.pathname;
  $: isAuthenticated = $authStore.isAuthenticated;
  
  // Paths that should show the full app layout
  const appPaths = ['/dashboard', '/editor', '/resumes', '/templates', '/analytics', '/settings', '/profile'];
  $: showAppLayout = isAuthenticated && appPaths.some(path => currentPath.startsWith(path));
  
  onMount(() => {
    // Initialize device detection
    const cleanup = initDeviceDetection();
    
    // Subscribe to device info changes
    const unsubscribe = deviceInfo.subscribe(info => {
      isMobile = info.isMobile;
      if (isMobile) {
        sidebarCollapsed = false;
        sidebarOpen = false;
      }
    });
    
    return () => {
      cleanup?.();
      unsubscribe();
    };
  });
  
  function toggleSidebar() {
    if (isMobile) {
      sidebarOpen = !sidebarOpen;
    } else {
      sidebarCollapsed = !sidebarCollapsed;
    }
  }
  
  function closeMobileSidebar() {
    if (isMobile) {
      sidebarOpen = false;
    }
  }
</script>

{#if showAppLayout && showSidebar}
  <!-- App Layout with Sidebar -->
  <div class="flex h-screen bg-gray-50">
    <!-- Mobile Sidebar Overlay -->
    {#if isMobile && sidebarOpen}
      <div 
        class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        on:click={closeMobileSidebar}
      ></div>
    {/if}
    
    <!-- Sidebar -->
    <div class="
      {isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'} 
      {isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
      transition-transform duration-300 ease-in-out
      lg:translate-x-0
    ">
      <Sidebar collapsed={!isMobile && sidebarCollapsed} />
    </div>
    
    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <Header 
        showSidebarToggle={true}
        on:toggleSidebar={toggleSidebar}
      />
      
      <main class="flex-1 overflow-y-auto {showAppLayout ? 'pb-16 md:pb-0' : ''}">
        <slot />
      </main>
    </div>
    
    <!-- Mobile Bottom Navigation -->
    {#if showAppLayout}
      <MobileNav />
    {/if}
  </div>
{:else}
  <!-- Simple Layout without Sidebar -->
  <div class="min-h-screen bg-gray-50">
    {#if showAppLayout}
      <Header showSidebarToggle={false} />
    {/if}
    
    <main class="{showAppLayout ? 'pb-16 md:pb-0' : 'min-h-screen'}">
      <slot />
    </main>
    
    <!-- Mobile Bottom Navigation -->
    {#if showAppLayout}
      <MobileNav />
    {/if}
  </div>
{/if}

<!-- Global Toast Notifications -->
<Toaster 
  position="top-right"
  richColors
  closeButton
  duration={4000}
/>

<!-- Global Styles -->
<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }
  
  :global(*) {
    box-sizing: border-box;
  }
  
  /* Scrollbar Styling */
  :global(::-webkit-scrollbar) {
    width: 6px;
    height: 6px;
  }
  
  :global(::-webkit-scrollbar-track) {
    background: #f1f1f1;
  }
  
  :global(::-webkit-scrollbar-thumb) {
    background: #c1c1c1;
    border-radius: 3px;
  }
  
  :global(::-webkit-scrollbar-thumb:hover) {
    background: #a8a8a8;
  }
  
  /* Focus Styles */
  :global(:focus-visible) {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
  
  /* Print Styles */
  @media print {
    :global(.no-print) {
      display: none !important;
    }
  }
  
  /* Animation Classes */
  :global(.fade-in) {
    animation: fadeIn 0.3s ease-in-out;
  }
  
  :global(.slide-in-right) {
    animation: slideInRight 0.3s ease-in-out;
  }
  
  :global(.slide-in-left) {
    animation: slideInLeft 0.3s ease-in-out;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
  
  @keyframes slideInLeft {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }
  
  /* Utility Classes */
  :global(.text-balance) {
    text-wrap: balance;
  }
  
  :global(.text-pretty) {
    text-wrap: pretty;
  }
  
  /* Loading States */
  :global(.loading) {
    pointer-events: none;
    opacity: 0.6;
  }
  
  :global(.loading::after) {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin: -10px 0 0 -10px;
    border: 2px solid #f3f3f3;
    border-top: 2px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Responsive Utilities */
  @media (max-width: 640px) {
    :global(.sm-hidden) {
      display: none !important;
    }
    
    :global(.sm-full-width) {
      width: 100% !important;
    }
    
    :global(.sm-text-sm) {
      font-size: 0.875rem !important;
    }
  }
  
  @media (max-width: 768px) {
    :global(.md-hidden) {
      display: none !important;
    }
    
    :global(.md-full-width) {
      width: 100% !important;
    }
    
    :global(.md-stack) {
      flex-direction: column !important;
    }
  }
  
  @media (max-width: 1024px) {
    :global(.lg-hidden) {
      display: none !important;
    }
  }
  
  /* Touch-friendly sizing */
  @media (hover: none) and (pointer: coarse) {
    :global(button), :global(input), :global(select), :global(textarea) {
      min-height: 44px;
    }
    
    :global(.touch-target) {
      min-height: 44px;
      min-width: 44px;
    }
  }
  
  /* Safe area support for devices with notches */
  :global(.safe-area-top) {
    padding-top: env(safe-area-inset-top);
  }
  
  :global(.safe-area-bottom) {
    padding-bottom: env(safe-area-inset-bottom);
  }
  
  :global(.safe-area-left) {
    padding-left: env(safe-area-inset-left);
  }
  
  :global(.safe-area-right) {
    padding-right: env(safe-area-inset-right);
  }
  
  /* Dark Mode Support (for future implementation) */
  :global(.dark) {
    color-scheme: dark;
  }
  
  :global(.dark body) {
    background-color: #0f172a;
    color: #f1f5f9;
  }
  
  /* High Contrast Mode */
  @media (prefers-contrast: high) {
    :global(*) {
      border-color: currentColor !important;
    }
  }
  
  /* Reduced Motion */
  @media (prefers-reduced-motion: reduce) {
    :global(*) {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
</style>