<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { sharingStore } from '$lib/stores/sharing';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { Separator } from '$lib/components/ui/separator';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { 
    Lock, 
    Download, 
    Share2, 
    Eye, 
    Calendar,
    User,
    Mail,
    Phone,
    MapPin,
    Globe,
    Linkedin,
    Github,
    AlertCircle,
    FileText
  } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  import ResumePreview from '$lib/components/resume/ResumePreview.svelte';
  import type { Resume } from '$lib/types/resume';
  import type { ShareLink } from '$lib/stores/sharing';
  
  let token = '';
  let resume: Resume | null = null;
  let shareLink: ShareLink | null = null;
  let isLoading = true;
  let isPasswordRequired = false;
  let password = '';
  let isDownloading = false;
  let error = '';
  
  onMount(async () => {
    token = $page.params.token;
    await loadPublicResume();
  });
  
  async function loadPublicResume() {
    if (!token) {
      error = 'Invalid share link';
      isLoading = false;
      return;
    }
    
    try {
      const result = await sharingStore.getPublicResume(token, password);
      resume = result.resume;
      shareLink = result.shareLink;
      isPasswordRequired = false;
      error = '';
    } catch (err: any) {
      console.error('Failed to load public resume:', err);
      
      if (err.message === 'Invalid password') {
        isPasswordRequired = true;
        error = 'This resume is password protected';
      } else if (err.message === 'Share link has expired') {
        error = 'This share link has expired';
      } else {
        error = 'Resume not found or access denied';
      }
    } finally {
      isLoading = false;
    }
  }
  
  async function submitPassword() {
    if (!password.trim()) {
      toast.error('Please enter a password');
      return;
    }
    
    isLoading = true;
    await loadPublicResume();
  }
  
  async function downloadResume(format: 'pdf' | 'docx' = 'pdf') {
    if (!resume || !shareLink || !shareLink.allowDownload) {
      toast.error('Download not allowed');
      return;
    }
    
    isDownloading = true;
    try {
      // Track download
      await sharingStore.trackDownload(shareLink.id, format);
      
      // In a real app, you would call an API to generate and download the file
      // For now, we'll just show a success message
      toast.success(`Resume download started (${format.toUpperCase()})`);
      
      // Simulate download
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = '#'; // Would be actual file URL
        link.download = `${resume!.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.${format}`;
        // link.click(); // Uncomment when actual download is implemented
      }, 1000);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Download failed');
    } finally {
      isDownloading = false;
    }
  }
  
  async function shareResume() {
    if (!shareLink) return;
    
    const shareUrl = window.location.href;
    const title = `${resume?.personalInfo.fullName}'s Resume`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: shareUrl
        });
        
        // Track share
        await sharingStore.trackShare(shareLink.id, 'native');
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback to clipboard
      const success = await sharingStore.copyToClipboard(shareUrl);
      if (success) {
        toast.success('Link copied to clipboard');
        await sharingStore.trackShare(shareLink.id, 'clipboard');
      } else {
        toast.error('Failed to copy link');
      }
    }
  }
  
  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
</script>

<svelte:head>
  {#if resume}
    <title>{resume.personalInfo.fullName} - Resume</title>
    <meta name="description" content={resume.personalInfo.summary || `Resume of ${resume.personalInfo.fullName}`} />
    <meta property="og:title" content="{resume.personalInfo.fullName} - Resume" />
    <meta property="og:description" content={resume.personalInfo.summary || `Resume of ${resume.personalInfo.fullName}`} />
    <meta property="og:type" content="profile" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="{resume.personalInfo.fullName} - Resume" />
    <meta name="twitter:description" content={resume.personalInfo.summary || `Resume of ${resume.personalInfo.fullName}`} />
  {:else}
    <title>Resume - Digital Resume Hub</title>
  {/if}
</svelte:head>

<div class="min-h-screen bg-gray-50">
  {#if isLoading}
    <!-- Loading State -->
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="space-y-6">
        <Skeleton class="h-16 w-full" />
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div class="lg:col-span-3">
            <Skeleton class="h-96 w-full" />
          </div>
          <div class="space-y-4">
            <Skeleton class="h-32 w-full" />
            <Skeleton class="h-24 w-full" />
          </div>
        </div>
      </div>
    </div>
    
  {:else if error && !isPasswordRequired}
    <!-- Error State -->
    <div class="max-w-2xl mx-auto px-4 py-16">
      <Card>
        <CardContent class="text-center py-12">
          <AlertCircle class="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p class="text-gray-600 mb-6">{error}</p>
          <Button on:click={() => goto('/')}>
            Go to Homepage
          </Button>
        </CardContent>
      </Card>
    </div>
    
  {:else if isPasswordRequired}
    <!-- Password Required -->
    <div class="max-w-md mx-auto px-4 py-16">
      <Card>
        <CardHeader class="text-center">
          <div class="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Lock class="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle>Password Required</CardTitle>
          <CardDescription>
            This resume is password protected. Please enter the password to view it.
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              type="password"
              bind:value={password}
              placeholder="Enter password"
              on:keydown={(e) => {
                if (e.key === 'Enter') {
                  submitPassword();
                }
              }}
            />
          </div>
          
          {#if error}
            <p class="text-sm text-red-600">{error}</p>
          {/if}
          
          <Button class="w-full" on:click={submitPassword} disabled={!password.trim()}>
            <Lock class="h-4 w-4 mr-2" />
            Access Resume
          </Button>
        </CardContent>
      </Card>
    </div>
    
  {:else if resume && shareLink}
    <!-- Resume Display -->
    <div class="max-w-7xl mx-auto px-4 py-6">
      <!-- Header -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">
              {resume.personalInfo.fullName}
            </h1>
            <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              {#if resume.personalInfo.email}
                <div class="flex items-center space-x-1">
                  <Mail class="h-4 w-4" />
                  <span>{resume.personalInfo.email}</span>
                </div>
              {/if}
              {#if resume.personalInfo.phone}
                <div class="flex items-center space-x-1">
                  <Phone class="h-4 w-4" />
                  <span>{resume.personalInfo.phone}</span>
                </div>
              {/if}
              {#if resume.personalInfo.location}
                <div class="flex items-center space-x-1">
                  <MapPin class="h-4 w-4" />
                  <span>{resume.personalInfo.location}</span>
                </div>
              {/if}
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <Button variant="outline" size="sm" on:click={shareResume}>
              <Share2 class="h-4 w-4 mr-1" />
              Share
            </Button>
            
            {#if shareLink.allowDownload}
              <Button 
                size="sm" 
                on:click={() => downloadResume('pdf')}
                disabled={isDownloading}
              >
                {#if isDownloading}
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                  Downloading...
                {:else}
                  <Download class="h-4 w-4 mr-1" />
                  Download PDF
                {/if}
              </Button>
            {/if}
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Resume Content -->
        <div class="lg:col-span-3">
          <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <ResumePreview {resume} />
          </div>
        </div>
        
        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick Info -->
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center space-x-2">
                <User class="h-4 w-4" />
                <span>Quick Info</span>
              </CardTitle>
            </CardHeader>
            <CardContent class="space-y-3">
              {#if resume.personalInfo.website}
                <div class="flex items-center space-x-2">
                  <Globe class="h-4 w-4 text-gray-400" />
                  <a 
                    href={resume.personalInfo.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="text-blue-600 hover:underline text-sm"
                  >
                    Website
                  </a>
                </div>
              {/if}
              
              {#if resume.personalInfo.linkedin}
                <div class="flex items-center space-x-2">
                  <Linkedin class="h-4 w-4 text-gray-400" />
                  <a 
                    href={resume.personalInfo.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="text-blue-600 hover:underline text-sm"
                  >
                    LinkedIn
                  </a>
                </div>
              {/if}
              
              {#if resume.personalInfo.github}
                <div class="flex items-center space-x-2">
                  <Github class="h-4 w-4 text-gray-400" />
                  <a 
                    href={resume.personalInfo.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="text-blue-600 hover:underline text-sm"
                  >
                    GitHub
                  </a>
                </div>
              {/if}
            </CardContent>
          </Card>
          
          <!-- Resume Stats -->
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center space-x-2">
                <Eye class="h-4 w-4" />
                <span>Views</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900">{shareLink.viewCount}</div>
                <div class="text-sm text-gray-600">Total views</div>
              </div>
            </CardContent>
          </Card>
          
          <!-- Resume Info -->
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center space-x-2">
                <FileText class="h-4 w-4" />
                <span>Resume Info</span>
              </CardTitle>
            </CardHeader>
            <CardContent class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Status</span>
                <Badge variant={shareLink.isPublic ? 'default' : 'secondary'}>
                  {shareLink.isPublic ? 'Public' : 'Private'}
                </Badge>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Downloads</span>
                <Badge variant={shareLink.allowDownload ? 'default' : 'secondary'}>
                  {shareLink.allowDownload ? 'Allowed' : 'Disabled'}
                </Badge>
              </div>
              
              {#if shareLink.expiresAt}
                <div class="flex items-center space-x-2">
                  <Calendar class="h-4 w-4 text-gray-400" />
                  <div>
                    <div class="text-sm text-gray-600">Expires</div>
                    <div class="text-xs text-gray-500">{formatDate(shareLink.expiresAt)}</div>
                  </div>
                </div>
              {/if}
            </CardContent>
          </Card>
          
          <!-- Powered By -->
          <Card>
            <CardContent class="text-center py-4">
              <p class="text-xs text-gray-500 mb-2">Powered by</p>
              <Button variant="ghost" size="sm" on:click={() => goto('/')}>
                <span class="font-semibold">Digital Resume Hub</span>
              </Button>
              <p class="text-xs text-gray-400 mt-1">Create your own resume</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  {/if}
</div>