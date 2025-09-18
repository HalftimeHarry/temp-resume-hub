<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { Separator } from '$lib/components/ui/separator';
  import { 
    LayoutDashboard,
    FileText,
    BarChart3,
    Star,
    Settings,
    User,
    LogOut,
    Plus,
    Folder,
    Share2,
    Download,
    HelpCircle,
    Sparkles
  } from 'lucide-svelte';
  
  export let collapsed = false;
  
  $: user = $authStore.user;
  $: currentPath = $page.url.pathname;
  
  const navigationItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      active: currentPath === '/dashboard'
    },
    {
      label: 'My Resumes',
      href: '/resumes',
      icon: FileText,
      active: currentPath.startsWith('/resumes')
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
  
  const quickActions = [
    {
      label: 'New Resume',
      action: () => goto('/editor/new'),
      icon: Plus,
      variant: 'default' as const
    },
    {
      label: 'Browse Templates',
      action: () => goto('/templates'),
      icon: Sparkles,
      variant: 'outline' as const
    }
  ];
  
  const bottomItems = [
    {
      label: 'Settings',
      href: '/settings',
      icon: Settings,
      active: currentPath.startsWith('/settings')
    },
    {
      label: 'Help & Support',
      href: '/help',
      icon: HelpCircle,
      active: currentPath.startsWith('/help')
    }
  ];
  
  async function handleLogout() {
    try {
      await authStore.logout();
      goto('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
  
  function navigate(href: string) {
    goto(href);
  }
</script>

<aside class="bg-white border-r border-gray-200 flex flex-col h-full {collapsed ? 'w-16' : 'w-64'}">
  <!-- Logo/Brand -->
  <div class="p-4 border-b border-gray-200">
    {#if collapsed}
      <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
        <FileText class="h-5 w-5 text-white" />
      </div>
    {:else}
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <FileText class="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 class="text-lg font-bold text-gray-900">Resume Hub</h1>
          <p class="text-xs text-gray-500">Digital Resume Builder</p>
        </div>
      </div>
    {/if}
  </div>
  
  <!-- Quick Actions -->
  {#if !collapsed}
    <div class="p-4 space-y-2">
      {#each quickActions as action}
        <Button
          variant={action.variant}
          size="sm"
          class="w-full justify-start"
          on:click={action.action}
        >
          <svelte:component this={action.icon} class="h-4 w-4 mr-2" />
          {action.label}
        </Button>
      {/each}
    </div>
    
    <Separator />
  {/if}
  
  <!-- Navigation -->
  <nav class="flex-1 p-4 space-y-1">
    {#each navigationItems as item}
      <button
        class="w-full flex items-center {collapsed ? 'justify-center' : 'justify-start'} px-3 py-2 text-sm font-medium rounded-lg transition-colors {
          item.active 
            ? 'bg-blue-100 text-blue-700' 
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        }"
        on:click={() => navigate(item.href)}
      >
        <svelte:component this={item.icon} class="h-5 w-5 {collapsed ? '' : 'mr-3'}" />
        {#if !collapsed}
          <span>{item.label}</span>
        {/if}
      </button>
    {/each}
    
    {#if !collapsed}
      <Separator class="my-4" />
      
      <!-- Recent Resumes -->
      <div class="space-y-2">
        <h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Recent
        </h3>
        <!-- This would be populated with recent resumes -->
        <div class="space-y-1">
          <button class="w-full flex items-center justify-start px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
            <Folder class="h-4 w-4 mr-3" />
            <span class="truncate">Software Engineer Resume</span>
          </button>
          <button class="w-full flex items-center justify-start px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
            <Folder class="h-4 w-4 mr-3" />
            <span class="truncate">Marketing Manager CV</span>
          </button>
        </div>
      </div>
    {/if}
  </nav>
  
  <!-- Bottom Section -->
  <div class="border-t border-gray-200">
    {#if !collapsed}
      <!-- User Stats -->
      <div class="p-4 space-y-3">
        <div class="grid grid-cols-3 gap-2 text-center">
          <div>
            <div class="text-lg font-semibold text-gray-900">3</div>
            <div class="text-xs text-gray-500">Resumes</div>
          </div>
          <div>
            <div class="text-lg font-semibold text-gray-900">127</div>
            <div class="text-xs text-gray-500">Views</div>
          </div>
          <div>
            <div class="text-lg font-semibold text-gray-900">8</div>
            <div class="text-xs text-gray-500">Downloads</div>
          </div>
        </div>
      </div>
      
      <Separator />
    {/if}
    
    <!-- Bottom Navigation -->
    <div class="p-4 space-y-1">
      {#each bottomItems as item}
        <button
          class="w-full flex items-center {collapsed ? 'justify-center' : 'justify-start'} px-3 py-2 text-sm font-medium rounded-lg transition-colors {
            item.active 
              ? 'bg-blue-100 text-blue-700' 
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          }"
          on:click={() => navigate(item.href)}
        >
          <svelte:component this={item.icon} class="h-5 w-5 {collapsed ? '' : 'mr-3'}" />
          {#if !collapsed}
            <span>{item.label}</span>
          {/if}
        </button>
      {/each}
    </div>
    
    <Separator />
    
    <!-- User Profile -->
    <div class="p-4">
      {#if collapsed}
        <button
          class="w-full flex items-center justify-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          on:click={() => navigate('/profile')}
        >
          <User class="h-5 w-5" />
        </button>
      {:else}
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User class="h-5 w-5 text-gray-600" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">
              {user?.name || 'User'}
            </p>
            <p class="text-xs text-gray-500 truncate">
              {user?.email || 'user@example.com'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            class="h-8 w-8 p-0"
            on:click={handleLogout}
            title="Logout"
          >
            <LogOut class="h-4 w-4" />
          </Button>
        </div>
      {/if}
    </div>
  </div>
</aside>