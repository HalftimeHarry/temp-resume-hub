<script lang="ts">
  import { onMount } from 'svelte';
  import { currentShareLink, sharingStore, isLoadingShare } from '$lib/stores/sharing';
  import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Switch } from '$lib/components/ui/switch';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Badge } from '$lib/components/ui/badge';
  import { Separator } from '$lib/components/ui/separator';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { 
    Share2, 
    Copy, 
    Eye, 
    Download, 
    Lock, 
    Globe, 
    Calendar,
    Twitter,
    Linkedin,
    Facebook,
    Mail,
    Link2,
    Settings,
    BarChart3,
    Check
  } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  import type { Resume } from '$lib/types/resume';
  import type { ShareSettings } from '$lib/stores/sharing';
  
  export let open = false;
  export let resume: Resume;
  
  let shareSettings: ShareSettings = {
    isPublic: false,
    allowDownload: true,
    allowComments: false,
    isPasswordProtected: false,
    password: '',
    expiresAt: '',
    customDomain: ''
  };
  
  let shareUrl = '';
  let copied = false;
  let showAdvanced = false;
  
  $: shareLink = $currentShareLink;
  $: loading = $isLoadingShare;
  
  onMount(async () => {
    if (resume) {
      const existingLink = await sharingStore.getShareLink(resume.id);
      if (existingLink) {
        shareSettings = {
          isPublic: existingLink.isPublic,
          allowDownload: existingLink.allowDownload,
          allowComments: existingLink.allowComments,
          isPasswordProtected: existingLink.isPasswordProtected,
          password: existingLink.password || '',
          expiresAt: existingLink.expiresAt || '',
          customDomain: existingLink.customDomain || ''
        };
        shareUrl = sharingStore.getShareUrl(existingLink.token, existingLink.customDomain);
      }
    }
  });
  
  async function createOrUpdateShare() {
    if (!resume) return;
    
    try {
      const link = await sharingStore.createShareLink(resume.id, shareSettings);
      shareUrl = sharingStore.getShareUrl(link.token, link.customDomain);
      toast.success('Share link created successfully');
    } catch (error) {
      console.error('Failed to create share link:', error);
      toast.error('Failed to create share link');
    }
  }
  
  async function copyShareUrl() {
    if (!shareUrl) return;
    
    const success = await sharingStore.copyToClipboard(shareUrl);
    if (success) {
      copied = true;
      toast.success('Link copied to clipboard');
      setTimeout(() => copied = false, 2000);
    } else {
      toast.error('Failed to copy link');
    }
  }
  
  function shareToSocial(platform: string) {
    if (!shareUrl) return;
    
    const title = `Check out my resume: ${resume.personalInfo.fullName}`;
    sharingStore.shareToSocial(platform, shareUrl, title);
    
    // Track share
    if (shareLink) {
      sharingStore.trackShare(shareLink.id, platform);
    }
  }
  
  function generatePassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    shareSettings.password = password;
  }
  
  function setExpiryDate(days: number) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    shareSettings.expiresAt = date.toISOString().split('T')[0];
  }
  
  function clearExpiry() {
    shareSettings.expiresAt = '';
  }
</script>

<Dialog bind:open>
  <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle class="flex items-center space-x-2">
        <Share2 class="h-5 w-5" />
        <span>Share Resume</span>
      </DialogTitle>
      <DialogDescription>
        Share your resume with others or make it publicly accessible
      </DialogDescription>
    </DialogHeader>
    
    <div class="space-y-6">
      <!-- Share Settings -->
      <Card>
        <CardHeader>
          <CardTitle class="text-lg">Privacy Settings</CardTitle>
          <CardDescription>
            Control who can access your resume and what they can do
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <!-- Public Access -->
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <Label class="flex items-center space-x-2">
                <Globe class="h-4 w-4" />
                <span>Make Public</span>
              </Label>
              <p class="text-sm text-gray-600">
                Anyone with the link can view your resume
              </p>
            </div>
            <Switch 
              checked={shareSettings.isPublic}
              onCheckedChange={(checked) => shareSettings.isPublic = checked}
            />
          </div>
          
          <!-- Allow Downloads -->
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <Label class="flex items-center space-x-2">
                <Download class="h-4 w-4" />
                <span>Allow Downloads</span>
              </Label>
              <p class="text-sm text-gray-600">
                Visitors can download your resume as PDF
              </p>
            </div>
            <Switch 
              checked={shareSettings.allowDownload}
              onCheckedChange={(checked) => shareSettings.allowDownload = checked}
            />
          </div>
          
          <!-- Password Protection -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="space-y-1">
                <Label class="flex items-center space-x-2">
                  <Lock class="h-4 w-4" />
                  <span>Password Protection</span>
                </Label>
                <p class="text-sm text-gray-600">
                  Require a password to view your resume
                </p>
              </div>
              <Switch 
                checked={shareSettings.isPasswordProtected}
                onCheckedChange={(checked) => shareSettings.isPasswordProtected = checked}
              />
            </div>
            
            {#if shareSettings.isPasswordProtected}
              <div class="flex space-x-2">
                <Input
                  bind:value={shareSettings.password}
                  placeholder="Enter password"
                  type="text"
                  class="flex-1"
                />
                <Button variant="outline" size="sm" on:click={generatePassword}>
                  Generate
                </Button>
              </div>
            {/if}
          </div>
        </CardContent>
      </Card>
      
      <!-- Advanced Settings -->
      <Card>
        <CardHeader>
          <CardTitle class="text-lg flex items-center justify-between">
            <span>Advanced Settings</span>
            <Button 
              variant="ghost" 
              size="sm" 
              on:click={() => showAdvanced = !showAdvanced}
            >
              <Settings class="h-4 w-4 mr-1" />
              {showAdvanced ? 'Hide' : 'Show'}
            </Button>
          </CardTitle>
        </CardHeader>
        
        {#if showAdvanced}
          <CardContent class="space-y-4">
            <!-- Expiry Date -->
            <div class="space-y-3">
              <Label class="flex items-center space-x-2">
                <Calendar class="h-4 w-4" />
                <span>Link Expiry</span>
              </Label>
              <div class="flex space-x-2">
                <Input
                  bind:value={shareSettings.expiresAt}
                  type="date"
                  class="flex-1"
                  min={new Date().toISOString().split('T')[0]}
                />
                <Button variant="outline" size="sm" on:click={() => setExpiryDate(7)}>
                  7 days
                </Button>
                <Button variant="outline" size="sm" on:click={() => setExpiryDate(30)}>
                  30 days
                </Button>
                <Button variant="outline" size="sm" on:click={clearExpiry}>
                  Never
                </Button>
              </div>
            </div>
            
            <!-- Custom Domain -->
            <div class="space-y-2">
              <Label for="custom-domain">Custom Domain (Optional)</Label>
              <Input
                id="custom-domain"
                bind:value={shareSettings.customDomain}
                placeholder="https://your-domain.com"
                type="url"
              />
              <p class="text-xs text-gray-500">
                Use your own domain for the share link
              </p>
            </div>
          </CardContent>
        {/if}
      </Card>
      
      <!-- Create/Update Share Link -->
      {#if !shareLink || !shareUrl}
        <Button 
          class="w-full" 
          on:click={createOrUpdateShare}
          disabled={loading}
        >
          {#if loading}
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Creating Share Link...
          {:else}
            <Link2 class="h-4 w-4 mr-2" />
            Create Share Link
          {/if}
        </Button>
      {:else}
        <!-- Share Link Display -->
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Share Link</CardTitle>
            <CardDescription>
              Your resume is now shareable with the link below
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <!-- Share URL -->
            <div class="flex space-x-2">
              <Input
                value={shareUrl}
                readonly
                class="flex-1 font-mono text-sm"
              />
              <Button variant="outline" size="sm" on:click={copyShareUrl}>
                {#if copied}
                  <Check class="h-4 w-4" />
                {:else}
                  <Copy class="h-4 w-4" />
                {/if}
              </Button>
            </div>
            
            <!-- Share Stats -->
            {#if shareLink}
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center justify-center space-x-1 text-sm text-gray-600 mb-1">
                    <Eye class="h-4 w-4" />
                    <span>Views</span>
                  </div>
                  <div class="text-lg font-semibold">{shareLink.viewCount}</div>
                </div>
                
                <div class="text-center p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center justify-center space-x-1 text-sm text-gray-600 mb-1">
                    <BarChart3 class="h-4 w-4" />
                    <span>Status</span>
                  </div>
                  <Badge variant={shareLink.isPublic ? 'default' : 'secondary'}>
                    {shareLink.isPublic ? 'Public' : 'Private'}
                  </Badge>
                </div>
              </div>
            {/if}
            
            <!-- Social Sharing -->
            <div class="space-y-3">
              <Label>Share on Social Media</Label>
              <div class="grid grid-cols-4 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  class="flex flex-col items-center space-y-1 h-auto py-3"
                  on:click={() => shareToSocial('twitter')}
                >
                  <Twitter class="h-4 w-4" />
                  <span class="text-xs">Twitter</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  class="flex flex-col items-center space-y-1 h-auto py-3"
                  on:click={() => shareToSocial('linkedin')}
                >
                  <Linkedin class="h-4 w-4" />
                  <span class="text-xs">LinkedIn</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  class="flex flex-col items-center space-y-1 h-auto py-3"
                  on:click={() => shareToSocial('facebook')}
                >
                  <Facebook class="h-4 w-4" />
                  <span class="text-xs">Facebook</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  class="flex flex-col items-center space-y-1 h-auto py-3"
                  on:click={() => shareToSocial('email')}
                >
                  <Mail class="h-4 w-4" />
                  <span class="text-xs">Email</span>
                </Button>
              </div>
            </div>
            
            <!-- Update Settings -->
            <Button 
              variant="outline" 
              class="w-full" 
              on:click={createOrUpdateShare}
              disabled={loading}
            >
              {#if loading}
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                Updating...
              {:else}
                <Settings class="h-4 w-4 mr-2" />
                Update Settings
              {/if}
            </Button>
          </CardContent>
        </Card>
      {/if}
    </div>
  </DialogContent>
</Dialog>