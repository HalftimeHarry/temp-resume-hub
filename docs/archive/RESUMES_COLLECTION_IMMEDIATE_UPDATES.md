# Immediate Resumes Collection Updates

## Priority 1: Essential Fields (Add These Now)

### New Fields to Add to PocketBase Collection

#### Analytics & Tracking
```json
{
  "name": "download_count",
  "type": "number",
  "required": false,
  "options": {
    "min": 0
  }
}
```

```json
{
  "name": "share_count", 
  "type": "number",
  "required": false,
  "options": {
    "min": 0
  }
}
```

```json
{
  "name": "last_downloaded",
  "type": "date",
  "required": false
}
```

```json
{
  "name": "last_shared",
  "type": "date", 
  "required": false
}
```

#### Profile Integration
```json
{
  "name": "profile_snapshot",
  "type": "json",
  "required": false
}
```

```json
{
  "name": "target_job",
  "type": "text",
  "required": false,
  "options": {
    "max": 200
  }
}
```

```json
{
  "name": "target_company",
  "type": "text", 
  "required": false,
  "options": {
    "max": 200
  }
}
```

```json
{
  "name": "industry_focus",
  "type": "select",
  "required": false,
  "options": {
    "values": [
      "technology",
      "healthcare", 
      "finance",
      "retail",
      "education",
      "manufacturing",
      "hospitality",
      "marketing",
      "sales",
      "consulting",
      "nonprofit",
      "government",
      "media",
      "real_estate",
      "construction",
      "transportation",
      "energy",
      "agriculture",
      "legal",
      "other"
    ]
  }
}
```

```json
{
  "name": "experience_level",
  "type": "select",
  "required": false,
  "options": {
    "values": [
      "student",
      "entry",
      "junior", 
      "mid",
      "senior",
      "executive",
      "career_change"
    ]
  }
}
```

#### Quality & Status
```json
{
  "name": "optimization_score",
  "type": "number",
  "required": false,
  "options": {
    "min": 0,
    "max": 100
  }
}
```

```json
{
  "name": "completion_percentage",
  "type": "number",
  "required": false,
  "options": {
    "min": 0,
    "max": 100
  }
}
```

```json
{
  "name": "status",
  "type": "select",
  "required": false,
  "options": {
    "values": [
      "draft",
      "active", 
      "archived",
      "template"
    ]
  }
}
```

```json
{
  "name": "version",
  "type": "number",
  "required": false,
  "options": {
    "min": 1
  }
}
```

```json
{
  "name": "tags",
  "type": "json",
  "required": false
}
```

## Updated Collection Rules

### List Rule
```javascript
// Allow users to see their own resumes and public resumes
user = @request.auth.id || is_public = true
```

### View Rule  
```javascript
// Allow users to view their own resumes and public resumes
user = @request.auth.id || is_public = true
```

### Create Rule
```javascript
// Users can only create resumes for themselves
user = @request.auth.id
```

### Update Rule
```javascript
// Users can only update their own resumes
user = @request.auth.id
```

### Delete Rule
```javascript
// Users can only delete their own resumes
user = @request.auth.id
```

## Enhanced Resume Store Implementation

### Updated Resume Interface
```typescript
// src/lib/types/resume.ts - Add to existing interface
export interface Resume {
  // Existing fields
  id: string;
  title: string;
  slug: string;
  user: string;
  template: string;
  content: ResumeContent;
  is_public: boolean;
  view_count: number;
  last_viewed?: string;
  role?: string;
  created: string;
  updated: string;
  
  // NEW FIELDS
  download_count?: number;
  share_count?: number;
  last_downloaded?: string;
  last_shared?: string;
  profile_snapshot?: ProfileSnapshot;
  target_job?: string;
  target_company?: string;
  industry_focus?: string;
  experience_level?: string;
  optimization_score?: number;
  completion_percentage?: number;
  status?: 'draft' | 'active' | 'archived' | 'template';
  version?: number;
  tags?: string[];
}

export interface ProfileSnapshot {
  target_industry?: string;
  experience_level?: string;
  target_job_titles?: string;
  key_skills?: string;
  location?: string;
  snapshot_date: string;
}
```

### Enhanced Resume Store Functions
```typescript
// src/lib/stores/resume.ts - Add these functions

export const resumeStore = {
  // ... existing functions ...
  
  // Create resume with profile integration
  async createWithProfile(title: string, templateId: string): Promise<Resume | null> {
    try {
      const profile = get(userProfile);
      const user = get(currentUser);
      
      if (!user) throw new Error('User not authenticated');
      
      // Create profile snapshot
      const profileSnapshot: ProfileSnapshot = {
        target_industry: profile?.target_industry,
        experience_level: profile?.experience_level,
        target_job_titles: profile?.target_job_titles,
        key_skills: profile?.key_skills,
        location: profile?.location,
        snapshot_date: new Date().toISOString()
      };
      
      // Generate initial tags
      const tags = generateInitialTags(profile);
      
      const resumeData = {
        title,
        slug: generateSlug(title),
        user: user.id,
        template: templateId,
        content: {}, // Will be populated by template
        is_public: false,
        view_count: 0,
        download_count: 0,
        share_count: 0,
        profile_snapshot: profileSnapshot,
        target_job: profile?.target_job_titles?.split(',')[0]?.trim(),
        industry_focus: profile?.target_industry,
        experience_level: profile?.experience_level,
        optimization_score: 0,
        completion_percentage: 0,
        status: 'draft',
        version: 1,
        tags
      };
      
      const resume = await pb.collection('resumes').create(resumeData);
      
      // Update local store
      userResumes.update(resumes => [...resumes, resume]);
      
      return resume;
    } catch (error) {
      console.error('Failed to create resume with profile:', error);
      return null;
    }
  },
  
  // Track download
  async trackDownload(resumeId: string): Promise<boolean> {
    try {
      const resume = await pb.collection('resumes').getOne(resumeId);
      const updatedResume = await pb.collection('resumes').update(resumeId, {
        download_count: (resume.download_count || 0) + 1,
        last_downloaded: new Date().toISOString()
      });
      
      // Update local store
      userResumes.update(resumes => 
        resumes.map(r => r.id === resumeId ? updatedResume : r)
      );
      
      return true;
    } catch (error) {
      console.error('Failed to track download:', error);
      return false;
    }
  },
  
  // Track share
  async trackShare(resumeId: string): Promise<boolean> {
    try {
      const resume = await pb.collection('resumes').getOne(resumeId);
      const updatedResume = await pb.collection('resumes').update(resumeId, {
        share_count: (resume.share_count || 0) + 1,
        last_shared: new Date().toISOString()
      });
      
      // Update local store
      userResumes.update(resumes => 
        resumes.map(r => r.id === resumeId ? updatedResume : r)
      );
      
      return true;
    } catch (error) {
      console.error('Failed to track share:', error);
      return false;
    }
  },
  
  // Update resume status
  async updateStatus(resumeId: string, status: 'draft' | 'active' | 'archived' | 'template'): Promise<boolean> {
    try {
      const updatedResume = await pb.collection('resumes').update(resumeId, {
        status,
        updated: new Date().toISOString()
      });
      
      // Update local store
      userResumes.update(resumes => 
        resumes.map(r => r.id === resumeId ? updatedResume : r)
      );
      
      return true;
    } catch (error) {
      console.error('Failed to update status:', error);
      return false;
    }
  },
  
  // Update optimization score
  async updateOptimizationScore(resumeId: string, score: number): Promise<boolean> {
    try {
      const updatedResume = await pb.collection('resumes').update(resumeId, {
        optimization_score: Math.max(0, Math.min(100, score)),
        updated: new Date().toISOString()
      });
      
      // Update local store
      userResumes.update(resumes => 
        resumes.map(r => r.id === resumeId ? updatedResume : r)
      );
      
      return true;
    } catch (error) {
      console.error('Failed to update optimization score:', error);
      return false;
    }
  },
  
  // Update completion percentage
  async updateCompletionPercentage(resumeId: string, percentage: number): Promise<boolean> {
    try {
      const updatedResume = await pb.collection('resumes').update(resumeId, {
        completion_percentage: Math.max(0, Math.min(100, percentage)),
        updated: new Date().toISOString()
      });
      
      // Update local store
      userResumes.update(resumes => 
        resumes.map(r => r.id === resumeId ? updatedResume : r)
      );
      
      return true;
    } catch (error) {
      console.error('Failed to update completion percentage:', error);
      return false;
    }
  },
  
  // Add tags to resume
  async addTags(resumeId: string, newTags: string[]): Promise<boolean> {
    try {
      const resume = await pb.collection('resumes').getOne(resumeId);
      const currentTags = resume.tags || [];
      const updatedTags = [...new Set([...currentTags, ...newTags])]; // Remove duplicates
      
      const updatedResume = await pb.collection('resumes').update(resumeId, {
        tags: updatedTags,
        updated: new Date().toISOString()
      });
      
      // Update local store
      userResumes.update(resumes => 
        resumes.map(r => r.id === resumeId ? updatedResume : r)
      );
      
      return true;
    } catch (error) {
      console.error('Failed to add tags:', error);
      return false;
    }
  },
  
  // Create new version of resume
  async createVersion(resumeId: string, title?: string): Promise<Resume | null> {
    try {
      const originalResume = await pb.collection('resumes').getOne(resumeId);
      
      const newResumeData = {
        ...originalResume,
        id: undefined, // Let PocketBase generate new ID
        title: title || `${originalResume.title} (v${(originalResume.version || 1) + 1})`,
        slug: generateSlug(title || `${originalResume.title}-v${(originalResume.version || 1) + 1}`),
        version: (originalResume.version || 1) + 1,
        status: 'draft',
        created: undefined,
        updated: undefined
      };
      
      const newResume = await pb.collection('resumes').create(newResumeData);
      
      // Update local store
      userResumes.update(resumes => [...resumes, newResume]);
      
      return newResume;
    } catch (error) {
      console.error('Failed to create resume version:', error);
      return null;
    }
  }
};

// Helper functions
function generateInitialTags(profile: any): string[] {
  const tags: string[] = [];
  
  if (profile?.target_industry) {
    tags.push(profile.target_industry);
  }
  
  if (profile?.experience_level) {
    tags.push(profile.experience_level);
  }
  
  if (profile?.key_skills) {
    const skills = profile.key_skills.split(',').map((s: string) => s.trim().toLowerCase());
    tags.push(...skills.slice(0, 3)); // Add first 3 skills
  }
  
  if (profile?.preferred_work_type) {
    tags.push(...profile.preferred_work_type);
  }
  
  return tags;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}
```

## Dashboard Integration

### Enhanced Resume Cards
```svelte
<!-- Enhanced resume card with new fields -->
<Card class="group hover:shadow-lg transition-shadow">
  <CardContent class="p-6">
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <h3 class="font-semibold text-lg mb-1">{resume.title}</h3>
        <p class="text-sm text-gray-600 mb-2">
          {resume.target_job || 'General Resume'}
          {#if resume.target_company}
            • {resume.target_company}
          {/if}
        </p>
        
        <!-- Status Badge -->
        <Badge variant={resume.status === 'active' ? 'default' : 'secondary'} class="mb-2">
          {resume.status || 'draft'}
        </Badge>
        
        <!-- Tags -->
        {#if resume.tags?.length}
          <div class="flex flex-wrap gap-1 mb-2">
            {#each resume.tags.slice(0, 3) as tag}
              <Badge variant="outline" class="text-xs">{tag}</Badge>
            {/each}
            {#if resume.tags.length > 3}
              <Badge variant="outline" class="text-xs">+{resume.tags.length - 3}</Badge>
            {/if}
          </div>
        {/if}
      </div>
      
      <!-- Optimization Score -->
      {#if resume.optimization_score}
        <div class="text-right">
          <div class="text-sm font-medium text-gray-900">{resume.optimization_score}%</div>
          <div class="text-xs text-gray-500">Optimized</div>
        </div>
      {/if}
    </div>
    
    <!-- Progress Bar -->
    {#if resume.completion_percentage}
      <div class="mb-4">
        <div class="flex justify-between text-sm mb-1">
          <span class="text-gray-600">Completion</span>
          <span class="font-medium">{resume.completion_percentage}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div 
            class="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style="width: {resume.completion_percentage}%"
          ></div>
        </div>
      </div>
    {/if}
    
    <!-- Analytics -->
    <div class="grid grid-cols-3 gap-4 text-center text-sm mb-4">
      <div>
        <div class="font-medium text-gray-900">{resume.view_count || 0}</div>
        <div class="text-gray-500">Views</div>
      </div>
      <div>
        <div class="font-medium text-gray-900">{resume.download_count || 0}</div>
        <div class="text-gray-500">Downloads</div>
      </div>
      <div>
        <div class="font-medium text-gray-900">{resume.share_count || 0}</div>
        <div class="text-gray-500">Shares</div>
      </div>
    </div>
    
    <!-- Actions -->
    <div class="flex gap-2">
      <Button size="sm" on:click={() => viewResume(resume)}>View</Button>
      <Button size="sm" variant="outline" on:click={() => editResume(resume)}>Edit</Button>
      <Button size="sm" variant="outline" on:click={() => shareResume(resume)}>Share</Button>
    </div>
  </CardContent>
</Card>
```

## Implementation Steps

### Step 1: Add Fields to PocketBase (5 minutes)
1. Go to PocketBase admin
2. Open `resumes` collection
3. Add each field from the list above
4. Save collection

### Step 2: Update TypeScript Types (5 minutes)
1. Update `src/lib/types/resume.ts` with new interface
2. Add ProfileSnapshot interface

### Step 3: Enhance Resume Store (15 minutes)
1. Add new functions to `src/lib/stores/resume.ts`
2. Update existing functions to use new fields
3. Add helper functions

### Step 4: Update UI Components (10 minutes)
1. Enhance dashboard resume cards
2. Add analytics display
3. Update resume creation flow

### Step 5: Test Integration (10 minutes)
1. Create new resume with profile
2. Test analytics tracking
3. Verify status updates
4. Check tag functionality

## Expected Benefits

### Immediate Value
- ✅ Better resume organization with status and tags
- ✅ Analytics tracking for user engagement
- ✅ Profile integration for personalization
- ✅ Completion tracking for better UX

### Future Opportunities
- ✅ Template effectiveness analysis
- ✅ Success rate optimization
- ✅ AI-powered recommendations
- ✅ Advanced analytics dashboard

This enhancement will significantly improve the resume management experience and provide valuable data for future optimizations!