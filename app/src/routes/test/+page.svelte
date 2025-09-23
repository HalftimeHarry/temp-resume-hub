 s<script lang="ts">
  import { onMount } from 'svelte';
  import { pb } from '$lib/pocketbase';
  import { toast } from 'svelte-sonner';

  let resumeData: any = null;
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      // Fetch a single resume record by ID
      const record = await pb.collection('resumes').getOne('0jwsxq9bibi4k54', {
        expand: 'user'
      });
      
      resumeData = record;
      console.log('Resume data:', record);
      toast.success('Resume loaded successfully');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error fetching resume:', err);
      toast.error('Failed to load resume');
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Test Resume Fetch - Digital Resume Hub</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-12">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Test Resume Fetch</h1>
      
      {#if loading}
        <p>Loading resume data...</p>
      {:else if error}
        <div class="bg-red-50 border border-red-200 rounded-md p-4">
          <h2 class="text-lg font-semibold text-red-800 mb-2">Error</h2>
          <p class="text-red-600">{error}</p>
        </div>
      {:else if resumeData}
        <div class="space-y-4">
          <h2 class="text-xl font-semibold text-gray-800">Resume Details</h2>
          
          <div class="bg-gray-50 rounded-md p-4">
            <h3 class="font-medium text-gray-700 mb-2">Basic Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500">ID</p>
                <p class="font-mono text-sm">{resumeData.id}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Title</p>
                <p class="font-medium">{resumeData.title}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Created</p>
                <p class="text-sm">{resumeData.created}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Updated</p>
                <p class="text-sm">{resumeData.updated}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 rounded-md p-4">
            <h3 class="font-medium text-gray-700 mb-2">Content</h3>
            <pre class="bg-black text-green-400 p-4 rounded-md overflow-x-auto text-sm">
              {JSON.stringify(resumeData.content, null, 2)}
            </pre>
          </div>
          
          {#if resumeData.expand?.user}
            <div class="bg-gray-50 rounded-md p-4">
              <h3 class="font-medium text-gray-700 mb-2">User Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">User ID</p>
                  <p class="font-mono text-sm">{resumeData.expand.user.id}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Username</p>
                  <p class="font-medium">{resumeData.expand.user.username}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Email</p>
                  <p class="text-sm">{resumeData.expand.user.email}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Name</p>
                  <p class="text-sm">{resumeData.expand.user.name || 'Not provided'}</p>
                </div>
              </div>
            </div>
          {/if}
        </div>
      {:else}
        <p>No resume data found</p>
      {/if}
    </div>
  </div>
</div>