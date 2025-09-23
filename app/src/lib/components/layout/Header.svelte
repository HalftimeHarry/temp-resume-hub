<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Badge } from '$lib/components/ui/badge';
  import { 
    Search,
    Bell,
    Settings,
    User,
    LogOut,
    Menu,
    Plus,
    HelpCircle,
    Moon,
    Sun
  } from 'lucide-svelte';
  import { createEventDispatcher } from 'svelte';
  
  export let showSidebarToggle = true;
  
  const dispatch = createEventDispatcher();
  
  $: user = $authStore.user;
  $: currentPath = $page.url.pathname;
  
  let searchQuery = '';
  let showUserMenu = false;
  let showNotifications = false;
  let darkMode = false;
  
  // Mock notifications
  const notifications = [
    {
      id: '1',
      title: 'Resume viewed',
      message: 'Your Software Engineer resume was viewed 5 times today',
      time: '2 hours ago',
      unread: true
    },
    {
      id: '2',
      title: 'New template available',
      message: 'Check out our new Creative Designer template',
      time: '1 day ago',
      unread: true
    },
    {
      id: '3',
      title: 'Resume downloaded',
      message: 'Someone downloaded your resume as PDF',
      time: '2 days ago',
      unread: false
    }
  ];
  
  function toggleSidebar() {
    dispatch('toggleSidebar');
  }
  
  function handleSearch() {
    if (searchQuery.trim()) {
      goto(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  }
  
  function createNewResume() {
    goto('/editor/new');
  }
  
  async function handleLogout() {
    console.log('Logout button clicked');
    try {
      console.log('Calling authStore.logout()');
      await authStore.logout();
      console.log('authStore.logout() completed');
      // Use hard navigation to ensure all state is cleared and route guards re-evaluate
      if (typeof window !== 'undefined') {
        console.log('Redirecting to home page');
        window.location.href = '/';
      } else {
        console.log('Using goto to redirect to home page');
        goto('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
  
  function toggleDarkMode() {
    darkMode = !darkMode;
    // In a real app, you'd persist this preference and apply theme changes
  }
  
  function markNotificationAsRead(notificationId: string) {
    // In a real app, you'd update the notification status
    console.log('Mark notification as read:', notificationId);
  }
  
  function getPageTitle(): string {
    if (currentPath === '/dashboard') return 'Dashboard';
    if (currentPath.startsWith('/editor')) return 'Resume Editor';
    if (currentPath.startsWith('/templates')) return 'Templates';
    if (currentPath.startsWith('/analytics')) return 'Analytics';
    if (currentPath.startsWith('/settings')) return 'Settings';
    return 'Digital Resume Hub';
  }
</script>

<header class="bg-white border-b border-gray-200 sticky top-0 z-40">
  <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
    <!-- Left Section -->
    <div class="flex items-center space-x-4">
      {#if showSidebarToggle}
        <Button
          variant="ghost"
          size="sm"
          class="lg:hidden"
          on:click={toggleSidebar}
        >
          <Menu class="h-5 w-5" />
        </Button>
      {/if}
      
      <div class="hidden lg:block">
        <h1 class="text-xl font-semibold text-gray-900">{getPageTitle()}</h1>
      </div>
      
      <!-- Search Bar -->
      <div class="hidden md:block relative">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          bind:value={searchQuery}
          placeholder="Search resumes, templates..."
          class="pl-10 w-64"
          on:keydown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
      </div>
    </div>
    
    <!-- Right Section -->
    <div class="flex items-center space-x-2">
      <!-- Quick Actions -->
      <Button
        variant="outline"
        size="sm"
        class="hidden sm:flex"
        on:click={createNewResume}
      >
        <Plus class="h-4 w-4 mr-1" />
        New Resume
      </Button>
      
      <!-- Dark Mode Toggle -->
      <Button
        variant="ghost"
        size="sm"
        class="h-9 w-9 p-0"
        on:click={toggleDarkMode}
        title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {#if darkMode}
          <Sun class="h-4 w-4" />
        {:else}
          <Moon class="h-4 w-4" />
        {/if}
      </Button>
      
      <!-- Help -->
      <Button
        variant="ghost"
        size="sm"
        class="h-9 w-9 p-0"
        on:click={() => goto('/help')}
        title="Help & Support"
      >
        <HelpCircle class="h-4 w-4" />
      </Button>
      
      <!-- Notifications -->
      <div class="relative">
        <Button
          variant="ghost"
          size="sm"
          class="h-9 w-9 p-0 relative"
          on:click={() => showNotifications = !showNotifications}
          title="Notifications"
        >
          <Bell class="h-4 w-4" />
          {#if notifications.some(n => n.unread)}
            <div class="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></div>
          {/if}
        </Button>
        
        <!-- Notifications Dropdown -->
        {#if showNotifications}
          <div class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div class="p-4 border-b border-gray-200">
              <h3 class="text-sm font-semibold text-gray-900">Notifications</h3>
            </div>
            
            <div class="max-h-64 overflow-y-auto">
              {#each notifications as notification}
                <button
                  class="w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  on:click={() => markNotificationAsRead(notification.id)}
                >
                  <div class="flex items-start space-x-3">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center space-x-2">
                        <p class="text-sm font-medium text-gray-900">{notification.title}</p>
                        {#if notification.unread}
                          <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {/if}
                      </div>
                      <p class="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p class="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                </button>
              {/each}
            </div>
            
            <div class="p-4 border-t border-gray-200">
              <Button variant="ghost" size="sm" class="w-full">
                View all notifications
              </Button>
            </div>
          </div>
        {/if}
      </div>

      {#if user}
        <!-- Visible email + logout for authenticated users -->
        <div class="hidden md:flex items-center space-x-2">
          <span class="text-sm text-gray-700">{user.email}</span>
          <Button variant="outline" size="sm" on:click={handleLogout}>
            <LogOut class="h-4 w-4 mr-1" />
            Sign out
          </Button>
        </div>
        <div class="md:hidden">
          <Button variant="ghost" size="sm" class="h-9 w-9 p-0" title="Sign out" on:click={handleLogout}>
            <LogOut class="h-4 w-4" />
          </Button>
        </div>
      {/if}
      
      <!-- User Menu -->
      <div class="relative">
        <Button
          variant="ghost"
          size="sm"
          class="flex items-center space-x-2 h-9"
          on:click={() => showUserMenu = !showUserMenu}
        >
          <div class="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
            <User class="h-4 w-4 text-gray-600" />
          </div>
          <span class="hidden sm:block text-sm font-medium text-gray-700">
            {user?.name || 'User'}
          </span>
        </Button>
        
        <!-- User Dropdown -->
        {#if showUserMenu}
          <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div class="p-4 border-b border-gray-200">
              <p class="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
              <p class="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
            </div>
            
            <div class="py-2">
              <button
                class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                on:click={() => goto('/profile')}
              >
                <User class="h-4 w-4" />
                <span>Profile</span>
              </button>
              
              <button
                class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                on:click={() => goto('/settings')}
              >
                <Settings class="h-4 w-4" />
                <span>Settings</span>
              </button>
              
              <div class="border-t border-gray-200 my-2"></div>
              
              <button
                class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                on:click={handleLogout}
              >
                <LogOut class="h-4 w-4" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
  
  <!-- Mobile Search -->
  <div class="md:hidden px-4 pb-4">
    <div class="relative">
      <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        bind:value={searchQuery}
        placeholder="Search..."
        class="pl-10 w-full"
        on:keydown={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      />
    </div>
  </div>
</header>

<!-- Click outside to close dropdowns -->
<svelte:window 
  on:click={(e) => {
    if (!e.target.closest('.relative')) {
      showUserMenu = false;
      showNotifications = false;
    }
  }}
/>