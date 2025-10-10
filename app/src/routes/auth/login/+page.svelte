<script>
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth';
  import { pb } from '$lib/pocketbase';
  import { Input } from '$lib/components/ui/input';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { onMount } from 'svelte';
  import { rateLimiter, RATE_LIMITS, formatRetryTime } from '$lib/utils/rate-limiter';
  
  let email = '';
  let password = '';
  let isLoading = false;
  let error = '';
  
  // Spam prevention
  let honeypot = '';
  let formStartTime = 0;
  
  onMount(() => {
    formStartTime = Date.now();
  });
  
  async function handleLogin() {
    // Honeypot check
    if (honeypot !== '') {
      console.warn('Honeypot triggered - potential bot');
      error = 'Invalid submission. Please try again.';
      return;
    }
    
    // Timing check
    const submitTime = Date.now() - formStartTime;
    if (submitTime < 2000) { // 2 seconds for login (faster than registration)
      error = 'Please take your time';
      return;
    }
    
    // Rate limiting check
    const rateLimitKey = `login:${email}`;
    const rateCheck = rateLimiter.checkLimit(
      rateLimitKey,
      RATE_LIMITS.LOGIN.maxAttempts,
      RATE_LIMITS.LOGIN.windowMs,
      RATE_LIMITS.LOGIN.blockDurationMs
    );
    
    if (!rateCheck.allowed) {
      error = `Too many login attempts. Please try again in ${formatRetryTime(rateCheck.retryAfter || 60)}.`;
      return;
    }
    
    console.log('🔐 Login Debug: Attempting login for:', email);
    isLoading = true;
    error = '';
    
    try {
      console.log('🔐 Login Debug: Calling authStore.login...');
      const result = await authStore.login(email, password);
      console.log('🔐 Login Debug: Login result:', result);
      console.log('🔐 Login Debug: Result success?', result?.success);
      
      if (result.success) {
        console.log('🔐 Login Debug: Login successful');
        
        // Add a small delay to ensure cookie is written
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Check user role to determine redirect destination
        try {
          console.log('🔐 Login Debug: Loading user profile...');
          const profileResult = await authStore.loadUserProfile();
          console.log('🔐 Login Debug: Profile result:', profileResult);
          
          if (profileResult.success && profileResult.profile) {
            const userRole = profileResult.profile.role;
            console.log('🔐 Login Debug: User role:', userRole);
            
            // Redirect based on role
            if (userRole === 'admin') {
              console.log('🔐 Login Debug: Redirecting admin to /admin');
              window.location.href = '/admin';
            } else {
              console.log('🔐 Login Debug: Redirecting user to /dashboard');
              window.location.href = '/dashboard';
            }
          } else {
            // No profile found, redirect to regular dashboard
            console.log('🔐 Login Debug: No profile found, redirecting to /dashboard');
            window.location.href = '/dashboard';
          }
        } catch (profileError) {
          console.error('🔐 Login Debug: Error loading profile:', profileError);
          // Fallback to regular dashboard
          console.log('🔐 Login Debug: Fallback redirect to /dashboard');
          window.location.href = '/dashboard';
        }
      } else {
        console.log('🔐 Login Debug: Login failed:', result.error);
        error = result.error || 'Login failed';
      }
    } catch (err) {
      console.error('🔐 Login Debug: Login error:', err);
      error = 'Login failed. Please try again.';
    } finally {
      isLoading = false;
    }
  }
  
  function goToRegister() {
    goto('/auth/register');
  }
  
  function goHome() {
    goto('/');
  }
</script>

<svelte:head>
  <title>Login - Digital Resume Hub</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
  <Card class="w-full max-w-md">
    <CardHeader class="text-center">
      <CardTitle class="text-2xl font-bold">Welcome Back</CardTitle>
      <CardDescription>Sign in to your Digital Resume Hub account</CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      {#if error}
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      {/if}
      
      <div class="space-y-2">
        <label for="email" class="text-sm font-medium">Email</label>
        <Input
          id="email"
          type="email"
          bind:value={email}
          placeholder="john@example.com"
          disabled={isLoading}
          required
        />
      </div>
      
      <div class="space-y-2">
        <label for="password" class="text-sm font-medium">Password</label>
        <Input
          id="password"
          type="password"
          bind:value={password}
          placeholder="••••••••"
          disabled={isLoading}
          required
        />
      </div>
      
      <!-- Honeypot field -->
      <input
        type="text"
        name="website_url"
        id="website_url"
        bind:value={honeypot}
        autocomplete="off"
        tabindex="-1"
        aria-hidden="true"
        style="position: absolute; left: -9999px; opacity: 0; height: 0; width: 0;"
      />
      
      <button
        class="w-full bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        onclick={handleLogin}
        disabled={isLoading || !email || !password}
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </button>
      
      <div class="text-center space-y-2">
        <p class="text-sm text-gray-600">
          Don't have an account?
          <button
            class="text-blue-600 hover:underline font-medium"
            onclick={goToRegister}
          >
            Create one
          </button>
        </p>
        <button
          class="text-sm text-gray-500 hover:underline"
          onclick={goHome}
        >
          ← Back to home
        </button>
      </div>
    </CardContent>
  </Card>
</div>