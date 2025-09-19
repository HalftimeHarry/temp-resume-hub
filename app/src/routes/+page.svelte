<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { isAuthenticated } from '$lib/stores/auth';
  import Logo from '$lib/components/ui/Logo.svelte';
  import * as Dialog from '$lib/components/ui/dialog';
  
  // Redirect authenticated users to dashboard
  onMount(() => {
    const unsubscribe = isAuthenticated.subscribe(value => {
      if (value) {
        console.log('🔐 Auth Debug: User is authenticated, redirecting to dashboard');
        goto('/dashboard');
      }
    });
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  });
  
  function handleGetStarted() {
    console.log('Get Started button clicked');
    goto('/auth/register');
  }
  
  function handleSignIn() {
    console.log('Sign In button clicked');
    goto('/auth/login');
  }
  
  function handleViewTemplates() {
    console.log('View Templates button clicked');
    goto('/templates');
  }
  
  // Modal states
  let showTermsModal = false;
  let showPrivacyModal = false;
  let showContactModal = false;
  
  // Functions to open modals
  function openTermsModal() {
    console.log('Open Terms modal clicked');
    showTermsModal = true;
  }
  
  function openPrivacyModal() {
    console.log('Open Privacy modal clicked');
    showPrivacyModal = true;
  }
  
  function openContactModal() {
    console.log('Open Contact modal clicked');
    showContactModal = true;
  }
  
  // Functions to close modals
  function closeTermsModal() {
    showTermsModal = false;
  }
  
  function closePrivacyModal() {
    showPrivacyModal = false;
  }
  
  function closeContactModal() {
    showContactModal = false;
  }
</script>

<svelte:head>
  <title>Digital Resume Hub - Professional Resume Builder</title>
  <meta name="description" content="Create professional resumes with our easy-to-use resume builder. Choose from templates, customize your design, and share your resume online." />
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-blue-50 to-indigo-100 py-20" style="background: linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%); padding: 5rem 0;">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style="max-width: 80rem; margin: 0 auto; padding: 0 1rem;">
    <div class="text-center" style="text-align: center;">
      <!-- Logo -->
      <div class="flex justify-center mb-8">
        <img src="/logo.svg" alt="Digital Resume Hub" class="h-32" />
      </div>
      
      <h1 class="text-8xl md:text-9xl font-bold text-gray-900 mb-6">
        Build Your Perfect
        <span class="text-blue-600">Resume</span>
      </h1>
      <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
        Create professional resumes in minutes with our intuitive builder. 
        Choose from beautiful templates, customize your design, and share your resume with the world.
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          class="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
          onclick={handleGetStarted}
        >
          Get Started Free
        </button>
        <button
          class="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-50 transition-colors"
          onclick={handleSignIn}
        >
          Sign In
        </button>
      </div>
      
      <div class="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-500">
        <span>✓ No credit card required</span>
        <span>✓ Free templates</span>
        <span>✓ Export to PDF</span>
      </div>
    </div>
  </div>
</section>

<!-- Features Section -->
<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <h2 class="text-3xl font-bold text-gray-900 mb-4">Why Choose Digital Resume Hub?</h2>
      <p class="text-xl text-gray-600">Everything you need to create a standout resume</p>
    </div>
    
    <div class="grid md:grid-cols-3 gap-8">
      <div class="text-center">
        <div class="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1V9a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V5a1 1 0 011-1h3a1 1 0 001-1V2a2 2 0 012-2z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">Easy Builder</h3>
        <p class="text-gray-600">Intuitive interface makes creating your resume simple and fast.</p>
      </div>

      <div class="text-center">
        <div class="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">Professional Templates</h3>
        <p class="text-gray-600">Choose from dozens of professionally designed templates.</p>
      </div>

      <div class="text-center">
        <div class="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">Share & Track</h3>
        <p class="text-gray-600">Share your resume online and track views and engagement.</p>
      </div>
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="py-20 bg-gray-50">
  <div class="max-w-4xl mx-auto text-center px-4">
    <h2 class="text-3xl font-bold text-gray-900 mb-4">Ready to Build Your Resume?</h2>
    <p class="text-xl text-gray-600 mb-8">Join thousands of professionals who have created stunning resumes with our platform.</p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        class="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
        onclick={handleGetStarted}
      >
        Start Building Now
      </button>
      <button
        class="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors"
        onclick={handleViewTemplates}
      >
        Browse Templates
      </button>
    </div>
  </div>
</section>
<!-- Footer Section -->
<section class="py-8 bg-gray-100 border-t border-gray-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
    <div class="flex items-center mb-4 md:mb-0">
      <div class="transform scale-300">
        <Logo size="sm" showText={true} />
      </div>
      <span class="ml-2 text-gray-600">© 2025 Digital Resume Hub. All rights reserved.</span>
    </div>
    <div class="flex space-x-6">
      <button onclick={openTermsModal} class="text-gray-600 hover:text-gray-900">Terms</button>
      <button onclick={openPrivacyModal} class="text-gray-600 hover:text-gray-900">Privacy</button>
      <button onclick={openContactModal} class="text-gray-600 hover:text-gray-900">Contact</button>
    </div>
  </div>
</section>

<!-- Terms Modal -->
<Dialog.Root bind:open={showTermsModal}>
  <Dialog.Content class="max-w-md">
    <Dialog.Header>
      <Dialog.Title>Terms of Service</Dialog.Title>
      <Dialog.Description>Coming soon</Dialog.Description>
    </Dialog.Header>
    <div class="py-4">
      <p class="text-gray-600">We're working on our terms of service. Please check back later.</p>
    </div>
    <Dialog.Footer>
      <button onclick={closeTermsModal} class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Close
      </button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<!-- Privacy Modal -->
<Dialog.Root bind:open={showPrivacyModal}>
  <Dialog.Content class="max-w-md">
    <Dialog.Header>
      <Dialog.Title>Privacy Policy</Dialog.Title>
      <Dialog.Description>Coming soon</Dialog.Description>
    </Dialog.Header>
    <div class="py-4">
      <p class="text-gray-600">We're working on our privacy policy. Please check back later.</p>
    </div>
    <Dialog.Footer>
      <button onclick={closePrivacyModal} class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Close
      </button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<!-- Contact Modal -->
<Dialog.Root bind:open={showContactModal}>
  <Dialog.Content class="max-w-md">
    <Dialog.Header>
      <Dialog.Title>Contact Us</Dialog.Title>
      <Dialog.Description>Coming soon</Dialog.Description>
    </Dialog.Header>
    <div class="py-4">
      <p class="text-gray-600">We're working on our contact information. Please check back later.</p>
    </div>
    <Dialog.Footer>
      <button onclick={closeContactModal} class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Close
      </button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>