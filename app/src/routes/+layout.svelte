<script lang="ts">
  import '../app.css';
</script>

<svelte:head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="Create professional resumes with our easy-to-use resume builder. Choose from templates, customize your design, and share your resume online." />
  <meta name="keywords" content="resume builder, CV maker, professional resume, job application, career tools" />
  <meta name="author" content="Digital Resume Hub" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Digital Resume Hub - Professional Resume Builder" />
  <meta property="og:description" content="Create professional resumes with our easy-to-use resume builder. Choose from templates, customize your design, and share your resume online." />
  <meta property="og:image" content="/og-image.png" />
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:title" content="Digital Resume Hub - Professional Resume Builder" />
  <meta property="twitter:description" content="Create professional resumes with our easy-to-use resume builder. Choose from templates, customize your design, and share your resume online." />
  <meta property="twitter:image" content="/og-image.png" />
  
  <!-- Favicon -->
  <link rel="icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  
  <!-- Theme Color -->
  <meta name="theme-color" content="#3b82f6" />
  
  <!-- PWA Manifest -->
  <link rel="manifest" href="/manifest.json" />
</svelte:head>

<main class="min-h-screen bg-background" style="background-color: #f8fafc; min-height: 100vh;">
  <slot />
</main>

<style>
  :global(html) {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }
</style>