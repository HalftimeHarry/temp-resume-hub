<script lang="ts">
  import { currentResume, resumeStore } from '$lib/stores/resume';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Button } from '$lib/components/ui/button';
  import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
  import { Upload, X } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  
  $: resume = $currentResume;
  $: personalInfo = resume?.personalInfo || {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    summary: '',
    profileImage: ''
  };
  
  let fileInput: HTMLInputElement;
  let isUploadingImage = false;
  
  function updateField(field: keyof typeof personalInfo, value: string) {
    resumeStore.updatePersonalInfo({ [field]: value });
  }
  
  function handleImageUpload() {
    fileInput?.click();
  }
  
  async function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }
    
    isUploadingImage = true;
    
    try {
      // Convert to base64 for now (in production, upload to storage service)
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateField('profileImage', result);
        toast.success('Profile image uploaded successfully');
        isUploadingImage = false;
      };
      reader.onerror = () => {
        toast.error('Failed to upload image');
        isUploadingImage = false;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast.error('Failed to upload image');
      isUploadingImage = false;
    }
  }
  
  function removeImage() {
    updateField('profileImage', '');
    if (fileInput) {
      fileInput.value = '';
    }
  }
  
  function getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
</script>

<div class="space-y-6">
  <!-- Profile Image -->
  <div class="flex items-center space-x-4">
    <div class="relative">
      <Avatar class="h-20 w-20">
        {#if personalInfo.profileImage}
          <AvatarImage src={personalInfo.profileImage} alt={personalInfo.fullName} />
        {/if}
        <AvatarFallback class="text-lg">
          {getInitials(personalInfo.fullName)}
        </AvatarFallback>
      </Avatar>
      
      {#if personalInfo.profileImage}
        <Button
          size="sm"
          variant="destructive"
          class="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
          on:click={removeImage}
        >
          <X class="h-3 w-3" />
        </Button>
      {/if}
    </div>
    
    <div class="space-y-2">
      <Button
        variant="outline"
        size="sm"
        on:click={handleImageUpload}
        disabled={isUploadingImage}
      >
        {#if isUploadingImage}
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
          Uploading...
        {:else}
          <Upload class="h-4 w-4 mr-2" />
          Upload Photo
        {/if}
      </Button>
      <p class="text-xs text-gray-500">
        JPG, PNG up to 5MB
      </p>
    </div>
    
    <input
      bind:this={fileInput}
      type="file"
      accept="image/*"
      class="hidden"
      on:change={handleFileChange}
    />
  </div>
  
  <!-- Basic Information -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="space-y-2">
      <Label for="fullName">Full Name *</Label>
      <Input
        id="fullName"
        value={personalInfo.fullName}
        on:input={(e) => updateField('fullName', e.currentTarget.value)}
        placeholder="John Doe"
        required
      />
    </div>
    
    <div class="space-y-2">
      <Label for="email">Email *</Label>
      <Input
        id="email"
        type="email"
        value={personalInfo.email}
        on:input={(e) => updateField('email', e.currentTarget.value)}
        placeholder="john@example.com"
        required
      />
    </div>
    
    <div class="space-y-2">
      <Label for="phone">Phone</Label>
      <Input
        id="phone"
        type="tel"
        value={personalInfo.phone || ''}
        on:input={(e) => updateField('phone', e.currentTarget.value)}
        placeholder="+1 (555) 123-4567"
      />
    </div>
    
    <div class="space-y-2">
      <Label for="location">Location</Label>
      <Input
        id="location"
        value={personalInfo.location || ''}
        on:input={(e) => updateField('location', e.currentTarget.value)}
        placeholder="New York, NY"
      />
    </div>
  </div>
  
  <!-- Links -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="space-y-2">
      <Label for="website">Website</Label>
      <Input
        id="website"
        type="url"
        value={personalInfo.website || ''}
        on:input={(e) => updateField('website', e.currentTarget.value)}
        placeholder="https://johndoe.com"
      />
    </div>
    
    <div class="space-y-2">
      <Label for="linkedin">LinkedIn</Label>
      <Input
        id="linkedin"
        type="url"
        value={personalInfo.linkedin || ''}
        on:input={(e) => updateField('linkedin', e.currentTarget.value)}
        placeholder="https://linkedin.com/in/johndoe"
      />
    </div>
    
    <div class="space-y-2">
      <Label for="github">GitHub</Label>
      <Input
        id="github"
        type="url"
        value={personalInfo.github || ''}
        on:input={(e) => updateField('github', e.currentTarget.value)}
        placeholder="https://github.com/johndoe"
      />
    </div>
  </div>
  
  <!-- Professional Summary -->
  <div class="space-y-2">
    <Label for="summary">Professional Summary</Label>
    <Textarea
      id="summary"
      value={personalInfo.summary || ''}
      on:input={(e) => updateField('summary', e.currentTarget.value)}
      placeholder="A brief overview of your professional background, key skills, and career objectives..."
      rows={4}
      class="resize-none"
    />
    <p class="text-xs text-gray-500">
      {(personalInfo.summary || '').length}/500 characters
    </p>
  </div>
</div>