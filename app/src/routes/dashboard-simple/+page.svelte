<script>
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth';
  
  function logout() {
    authStore.logout();
    window.location.href = '/';
  }
  
  function createNewResume() {
    window.location.href = '/templates';
  }
</script>

<svelte:head>
  <title>Dashboard - Digital Resume Hub</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <div class="bg-white border-b">
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">🎉 Welcome to Digital Resume Hub!</h1>
          <p class="text-gray-600 mt-2">Your account has been created successfully</p>
        </div>
        <div class="flex gap-4">
          <button 
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            onclick={createNewResume}
          >
            + New Resume
          </button>
          <button 
            class="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            onclick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Success Message -->
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-green-800">Account Created Successfully!</h3>
          <div class="mt-2 text-sm text-green-700">
            <p>Your Digital Resume Hub account is ready. You can now create professional resumes, choose from templates, and share them online.</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Quick Actions -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
          <h3 class="ml-3 text-lg font-medium">Create Resume</h3>
        </div>
        <p class="text-gray-600 mb-4">Start building your professional resume with our easy-to-use editor.</p>
        <button 
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          onclick={createNewResume}
        >
          Get Started
        </button>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
          <h3 class="ml-3 text-lg font-medium">Browse Templates</h3>
        </div>
        <p class="text-gray-600 mb-4">Choose from our collection of professional resume templates.</p>
        <button 
          class="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
          onclick={() => window.location.href = '/templates'}
        >
          View Templates
        </button>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
            </svg>
          </div>
          <h3 class="ml-3 text-lg font-medium">Share & Track</h3>
        </div>
        <p class="text-gray-600 mb-4">Share your resume online and track views and engagement.</p>
        <button 
          class="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
          onclick={() => alert('Feature coming soon!')}
        >
          Learn More
        </button>
      </div>
    </div>
    
    <!-- Features Overview -->
    <div class="mt-12 bg-white rounded-lg shadow-sm border p-8">
      <h2 class="text-2xl font-bold mb-6">What's Next?</h2>
      <div class="grid md:grid-cols-2 gap-8">
        <div>
          <h3 class="text-lg font-semibold mb-3">✨ Key Features</h3>
          <ul class="space-y-2 text-gray-600">
            <li>• Professional resume templates</li>
            <li>• Real-time editing and preview</li>
            <li>• PDF export and sharing</li>
            <li>• Analytics and tracking</li>
            <li>• Mobile-responsive design</li>
          </ul>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-3">🚀 Getting Started</h3>
          <ol class="space-y-2 text-gray-600">
            <li>1. Choose a template that fits your style</li>
            <li>2. Fill in your personal information</li>
            <li>3. Add your work experience and skills</li>
            <li>4. Preview and customize the design</li>
            <li>5. Export or share your resume online</li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</div>