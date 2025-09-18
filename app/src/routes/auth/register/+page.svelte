<script>
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth';
  import { Input } from '$lib/components/ui/input';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  
  let email = '';
  let password = '';
  let confirmPassword = '';
  let name = '';
  let username = '';
  let isLoading = false;
  let error = '';
  
  async function handleRegister() {
    
    if (!email || !password || !name || !username) {
      error = 'Please fill in all fields';
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      error = 'Please enter a valid email address';
      return;
    }
    
    if (password !== confirmPassword) {
      error = 'Passwords do not match';
      return;
    }
    
    if (password.length < 8) {
      error = 'Password must be at least 8 characters long';
      return;
    }
    
    isLoading = true;
    error = '';
    
    try {
      const result = await authStore.register(email, password, name, username);
      
      if (result.success) {
        // Use window.location for redirect to ensure it works
        window.location.href = '/dashboard-simple';
      } else {
        error = result.error || 'Registration failed';
      }
    } catch (err) {
      console.error('Registration error:', err);
      error = 'Registration failed. Please try again.';
    } finally {
      isLoading = false;
    }
  }
  

  
  function goToLogin() {
    goto('/auth/login');
  }
</script>

<svelte:head>
  <title>Register - Digital Resume Hub</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
  <Card class="w-full max-w-md">
    <CardHeader class="text-center">
      <CardTitle class="text-2xl font-bold">Create Account</CardTitle>
      <CardDescription>Join Digital Resume Hub and start building your professional resume</CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      {#if error}
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      {/if}
      
      <div class="space-y-2">
        <label for="name" class="text-sm font-medium">Full Name</label>
        <Input
          id="name"
          type="text"
          bind:value={name}
          placeholder="John Doe"
          disabled={isLoading}
          required
        />
      </div>
      
      <div class="space-y-2">
        <label for="username" class="text-sm font-medium">Username</label>
        <Input
          id="username"
          type="text"
          bind:value={username}
          placeholder="dustind"
          disabled={isLoading}
          required
        />
        <p class="text-xs text-gray-500">Choose a unique username</p>
      </div>
      
      <div class="space-y-2">
        <label for="email" class="text-sm font-medium">Email</label>
        <Input
          id="email"
          type="email"
          bind:value={email}
          placeholder="dustin@example.com"
          disabled={isLoading}
          required
        />
        <p class="text-xs text-gray-500">Enter a valid email address</p>
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
        <p class="text-xs text-gray-500">Minimum 8 characters</p>
      </div>
      
      <div class="space-y-2">
        <label for="confirmPassword" class="text-sm font-medium">Confirm Password</label>
        <Input
          id="confirmPassword"
          type="password"
          bind:value={confirmPassword}
          placeholder="••••••••"
          disabled={isLoading}
          required
        />
      </div>
      
      <button
        class="w-full bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        onclick={handleRegister}
        disabled={isLoading || !email || !password || !confirmPassword || !name || !username}
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </button>
      

      
      <div class="text-center">
        <p class="text-sm text-gray-600">
          Already have an account?
          <button
            class="text-blue-600 hover:underline font-medium"
            onclick={goToLogin}
          >
            Sign in
          </button>
        </p>
      </div>
    </CardContent>
  </Card>
</div>