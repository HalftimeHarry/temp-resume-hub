<script lang="ts">
  import { goto } from '$app/navigation';
  import { authService } from '$lib/stores/auth';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Alert, AlertDescription } from '$lib/components/ui/alert';
  import { Loader2, Eye, EyeOff, Check, X } from 'lucide-svelte';

  let name = '';
  let username = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  let isLoading = false;
  let error = '';
  let showPassword = false;
  let showConfirmPassword = false;
  let usernameAvailable = true;
  let checkingUsername = false;

  $: passwordsMatch = password === confirmPassword;
  $: passwordValid = password.length >= 8;
  $: formValid = name && username && email && password && confirmPassword && passwordsMatch && passwordValid && usernameAvailable;

  // Debounced username check
  let usernameTimeout: NodeJS.Timeout;
  $: if (username && username.length >= 3) {
    clearTimeout(usernameTimeout);
    usernameTimeout = setTimeout(checkUsername, 500);
  }

  async function checkUsername() {
    if (username.length < 3) return;
    
    checkingUsername = true;
    const result = await authService.checkUsernameAvailability(username);
    usernameAvailable = result.available;
    checkingUsername = false;
  }

  async function handleRegister() {
    if (!formValid) {
      error = 'Please fill in all fields correctly';
      return;
    }

    isLoading = true;
    error = '';

    const result = await authService.register(email, password, name, username);

    if (result.success) {
      goto('/auth/verify-email?email=' + encodeURIComponent(email));
    } else {
      error = result.error || 'Registration failed';
    }

    isLoading = false;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && formValid) {
      handleRegister();
    }
  }
</script>

<Card class="w-full max-w-md mx-auto">
  <CardHeader class="space-y-1">
    <CardTitle class="text-2xl font-bold text-center">Create account</CardTitle>
    <CardDescription class="text-center">
      Join Digital Resume Hub and start building your professional presence
    </CardDescription>
  </CardHeader>
  <CardContent class="space-y-4">
    {#if error}
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    {/if}

    <div class="space-y-2">
      <Label for="name">Full Name</Label>
      <Input
        id="name"
        type="text"
        placeholder="Enter your full name"
        bind:value={name}
        disabled={isLoading}
        on:keydown={handleKeydown}
        required
      />
    </div>

    <div class="space-y-2">
      <Label for="username">Username</Label>
      <div class="relative">
        <Input
          id="username"
          type="text"
          placeholder="Choose a username"
          bind:value={username}
          disabled={isLoading}
          on:keydown={handleKeydown}
          class={username && username.length >= 3 ? (usernameAvailable ? 'pr-8' : 'pr-8 border-destructive') : ''}
          required
        />
        {#if username && username.length >= 3}
          <div class="absolute right-2 top-1/2 transform -translate-y-1/2">
            {#if checkingUsername}
              <Loader2 class="h-4 w-4 animate-spin text-muted-foreground" />
            {:else if usernameAvailable}
              <Check class="h-4 w-4 text-green-500" />
            {:else}
              <X class="h-4 w-4 text-destructive" />
            {/if}
          </div>
        {/if}
      </div>
      {#if username && username.length >= 3 && !usernameAvailable}
        <p class="text-sm text-destructive">Username is already taken</p>
      {/if}
    </div>

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
          placeholder="Create a password"
          bind:value={password}
          disabled={isLoading}
          on:keydown={handleKeydown}
          class={password && !passwordValid ? 'border-destructive' : ''}
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
      {#if password && !passwordValid}
        <p class="text-sm text-destructive">Password must be at least 8 characters</p>
      {/if}
    </div>

    <div class="space-y-2">
      <Label for="confirmPassword">Confirm Password</Label>
      <div class="relative">
        <Input
          id="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Confirm your password"
          bind:value={confirmPassword}
          disabled={isLoading}
          on:keydown={handleKeydown}
          class={confirmPassword && !passwordsMatch ? 'border-destructive' : ''}
          required
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          class="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          on:click={() => showConfirmPassword = !showConfirmPassword}
          disabled={isLoading}
        >
          {#if showConfirmPassword}
            <EyeOff class="h-4 w-4" />
          {:else}
            <Eye class="h-4 w-4" />
          {/if}
        </Button>
      </div>
      {#if confirmPassword && !passwordsMatch}
        <p class="text-sm text-destructive">Passwords do not match</p>
      {/if}
    </div>

    <Button
      type="button"
      class="w-full"
      on:click={handleRegister}
      disabled={isLoading || !formValid}
    >
      {#if isLoading}
        <Loader2 class="mr-2 h-4 w-4 animate-spin" />
        Creating account...
      {:else}
        Create account
      {/if}
    </Button>

    <div class="text-center">
      <div class="text-sm text-muted-foreground">
        Already have an account?
        <a
          href="/auth/login"
          class="text-primary hover:underline underline-offset-4"
        >
          Sign in
        </a>
      </div>
    </div>
  </CardContent>
</Card>