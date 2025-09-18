<script lang="ts">
  import { goto } from '$app/navigation';
  import { auth } from '$lib/stores/auth';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Alert, AlertDescription } from '$lib/components/ui/alert';
  import { Loader2, Eye, EyeOff } from 'lucide-svelte';

  let email = '';
  let password = '';
  let isLoading = false;
  let error = '';
  let showPassword = false;

  async function handleLogin() {
    if (!email || !password) {
      error = 'Please fill in all fields';
      return;
    }

    isLoading = true;
    error = '';

    const result = await auth.login(email, password);

    if (result.success) {
      goto('/dashboard');
    } else {
      error = result.error || 'Login failed';
    }

    isLoading = false;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleLogin();
    }
  }
</script>

<Card class="w-full max-w-md mx-auto">
  <CardHeader class="space-y-1">
    <CardTitle class="text-2xl font-bold text-center">Welcome back</CardTitle>
    <CardDescription class="text-center">
      Sign in to your Digital Resume Hub account
    </CardDescription>
  </CardHeader>
  <CardContent class="space-y-4">
    {#if error}
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    {/if}

    <div class="space-y-2">
      <Label for="email">Email</Label>
      <Input
        id="email"
        type="email"
        placeholder="Enter your email"
        bind:value={email}
        disabled={isLoading}
        on:keydown={handleKeydown}
        required
      />
    </div>

    <div class="space-y-2">
      <Label for="password">Password</Label>
      <div class="relative">
        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          bind:value={password}
          disabled={isLoading}
          on:keydown={handleKeydown}
          required
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          class="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          on:click={() => showPassword = !showPassword}
          disabled={isLoading}
        >
          {#if showPassword}
            <EyeOff class="h-4 w-4" />
          {:else}
            <Eye class="h-4 w-4" />
          {/if}
        </Button>
      </div>
    </div>

    <Button
      type="button"
      class="w-full"
      on:click={handleLogin}
      disabled={isLoading}
    >
      {#if isLoading}
        <Loader2 class="mr-2 h-4 w-4 animate-spin" />
        Signing in...
      {:else}
        Sign in
      {/if}
    </Button>

    <div class="text-center space-y-2">
      <a
        href="/auth/forgot-password"
        class="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
      >
        Forgot your password?
      </a>
      
      <div class="text-sm text-muted-foreground">
        Don't have an account?
        <a
          href="/auth/register"
          class="text-primary hover:underline underline-offset-4"
        >
          Sign up
        </a>
      </div>
    </div>
  </CardContent>
</Card>