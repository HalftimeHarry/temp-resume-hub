<script lang="ts">
  import { onMount } from 'svelte';
  import { pb } from '$lib/pocketbase';
  import { Shield } from 'lucide-svelte';
  
  let isAdmin = false;
  
  onMount(async () => {
    const userId = pb.authStore.model?.id;
    if (userId) {
      try {
        const profiles = await pb.collection('user_profiles').getFullList({
          filter: `user = "${userId}"`
        });
        
        if (profiles.length > 0) {
          isAdmin = profiles[0].role === 'admin';
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    }
  });
</script>

{#if isAdmin}
  <a 
    href="/dashboard/admin"
    class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
  >
    <Shield class="w-4 h-4" />
    Admin Dashboard
  </a>
{/if}
