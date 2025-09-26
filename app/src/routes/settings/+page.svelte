<!--
  Settings Page
  Main settings page that includes the settings panel
-->

<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { currentUser, isAuthenticated } from '$lib/stores/auth';
  import SettingsPanel from '$lib/components/settings/SettingsPanel.svelte';

  // Redirect to login if not authenticated
  $: {
    if (!$isAuthenticated && $currentUser === null) {
      goto('/auth/login');
    }
  }
</script>

<svelte:head>
  <title>Settings - Digital Resume Hub</title>
  <meta name="description" content="Customize your resume building experience with personalized settings" />
</svelte:head>

{#if $isAuthenticated}
  <SettingsPanel />
{:else}
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Loading...</p>
    </div>
  </div>
{/if}