# Settings & Resume Sharing Configuration Plan

## Current State Analysis

### 1. **Global Settings** (`/settings`)
**Location**: `app/src/routes/settings/+page.svelte` → `SettingsPanel.svelte`

**Current Tabs**:
- Builder (default preferences)
- Templates (template preferences)
- AI & Personalization (AI settings)
- Privacy (privacy controls)
- Notifications (notification preferences)
- Appearance (UI theme)

**Purpose**: User-wide preferences that apply to ALL resumes

### 2. **Resume-Specific Settings** (Currently in `/resume/[slug]`)
**Location**: `app/src/routes/resume/[slug]/+page.svelte` → Styling Panel

**Current Options**:
- Theme presets (color + layout combinations)
- Color schemes (blue, green, purple, black, orange)
- Layout options (single-column, two-column, with-image)

**Purpose**: Per-resume styling and presentation

### 3. **Resume Database Fields**
**Sharing/Privacy Fields**:
- `is_public` (boolean) - Whether resume is publicly accessible
- `slug` (string) - Public URL identifier
- `status` ('draft' | 'active' | 'archived' | 'template')

**Analytics Fields**:
- `view_count`, `download_count`, `share_count`
- `last_viewed`, `last_downloaded`, `last_shared`

**Settings Fields** (in `content.settings`):
- `template`, `colorScheme`, `fontSize`, `spacing`
- `showProfileImage`, `sectionOrder`, `customCSS`

## The Problem

**Current Flow**:
1. User creates resume in `/builder` (draft mode)
2. User saves/publishes → resume goes to database
3. User can style resume on `/resume/[slug]` via 🎨 Style Resume button
4. **Missing**: No clear place to configure sharing/privacy settings

**Issues**:
- No dedicated "Resume Settings" page per resume
- Sharing configuration is unclear
- Privacy settings (is_public) not easily accessible
- No way to manage multiple resume versions/purposes

## Recommended Solution

### **Option 1: Add "Resume Settings" Tab to Dashboard** (Recommended)

**Implementation**:
1. Add a settings icon/button to each resume card on dashboard
2. Opens a modal or side panel with resume-specific settings
3. Settings include:
   - **Sharing & Privacy**
     - Public/Private toggle
     - Custom slug editor
     - Share link with copy button
     - QR code generator
   - **Styling** (same as current 🎨 Style Resume)
     - Theme presets
     - Color schemes
     - Layout options
   - **Metadata**
     - Resume title
     - Target industry
     - Purpose/description
     - Tags
   - **Status**
     - Draft/Active/Archived
     - Version number
   - **Analytics** (read-only)
     - View count
     - Download count
     - Last viewed date

**Benefits**:
- ✅ Centralized settings per resume
- ✅ Easy to find and manage
- ✅ Doesn't clutter the builder
- ✅ Accessible from dashboard
- ✅ Can manage multiple resumes easily

**User Flow**:
```
Dashboard → Resume Card → ⚙️ Settings Icon → Settings Modal
  ├─ Sharing & Privacy
  ├─ Styling
  ├─ Metadata
  ├─ Status
  └─ Analytics
```

### **Option 2: Add Settings Step to Builder** (Not Recommended)

**Why Not**:
- ❌ Clutters the builder flow
- ❌ User doesn't know sharing options until after content creation
- ❌ Settings should be adjustable after creation
- ❌ Goes against "content first, styling later" principle

### **Option 3: Dedicated `/resume/[slug]/settings` Route**

**Implementation**:
- Add a settings route for each resume
- Accessible from resume view page
- Full-page settings interface

**Benefits**:
- ✅ Dedicated space for all settings
- ✅ Can be more comprehensive
- ✅ Clear URL structure

**Drawbacks**:
- ❌ Extra navigation step
- ❌ Not as discoverable
- ❌ Requires more routing logic

## Recommended Implementation Plan

### **Phase 1: Add Resume Settings Modal to Dashboard**

**Files to Create/Modify**:

1. **Create**: `app/src/lib/components/dashboard/ResumeSettingsModal.svelte`
   ```typescript
   // Props
   export let resume: Resume;
   export let open: boolean;
   
   // Tabs
   - Sharing & Privacy
   - Styling
   - Metadata
   - Analytics
   ```

2. **Modify**: `app/src/routes/dashboard/+page.svelte`
   - Add settings icon to resume cards
   - Add ResumeSettingsModal component
   - Handle open/close state

3. **Create**: `app/src/lib/stores/resumeSettings.ts`
   ```typescript
   // Functions
   - updateResumePrivacy(resumeId, isPublic)
   - updateResumeSlug(resumeId, slug)
   - updateResumeMetadata(resumeId, metadata)
   - updateResumeStatus(resumeId, status)
   ```

**Settings Modal Structure**:
```
┌─────────────────────────────────────┐
│  Resume Settings: [Resume Title]    │
├─────────────────────────────────────┤
│ [Sharing] [Styling] [Info] [Stats]  │ ← Tabs
├─────────────────────────────────────┤
│                                     │
│  [Tab Content Here]                 │
│                                     │
│                                     │
├─────────────────────────────────────┤
│         [Cancel]  [Save Changes]    │
└─────────────────────────────────────┘
```

### **Phase 2: Enhance Sharing Features**

**Sharing & Privacy Tab Content**:
```
┌─────────────────────────────────────┐
│ 🔒 Privacy                          │
│ ○ Private (Only you can view)       │
│ ● Public (Anyone with link)         │
│                                     │
│ 🔗 Share Link                       │
│ https://app.com/resume/john-doe-... │
│ [Copy Link] [QR Code]               │
│                                     │
│ 📝 Custom URL (Pro)                 │
│ /resume/[john-doe-tech]             │
│                                     │
│ 📊 Sharing Stats                    │
│ Views: 42 | Downloads: 5            │
│ Last viewed: 2 hours ago            │
└─────────────────────────────────────┘
```

### **Phase 3: Integrate with Builder**

**After Publishing from Builder**:
```javascript
// In builder after publish
const result = await publishResume();

// Show success toast with actions
toast.success('Resume Published!', {
  description: 'Your resume is now live',
  action: {
    label: 'Configure Sharing',
    onClick: () => openResumeSettings(result.record.id)
  }
});
```

### **Phase 4: Add Quick Actions to Resume View**

**On `/resume/[slug]` page**:
- Keep 🎨 Style Resume button (opens styling tab of settings)
- Add ⚙️ Settings button (opens full settings modal)
- Add 🔗 Share button (opens sharing tab of settings)

## Database Schema Considerations

**Current Fields** (already exist):
- `is_public` ✅
- `slug` ✅
- `status` ✅
- `view_count`, `download_count`, `share_count` ✅

**Potential New Fields**:
- `share_settings` (JSON):
  ```json
  {
    "allow_download": true,
    "allow_print": true,
    "password_protected": false,
    "expiry_date": null,
    "custom_domain": null
  }
  ```
- `seo_metadata` (JSON):
  ```json
  {
    "title": "John Doe - Software Engineer",
    "description": "Experienced software engineer...",
    "keywords": ["software", "engineer", "react"]
  }
  ```

## Migration Path

### **Step 1**: Create ResumeSettingsModal component
### **Step 2**: Add to dashboard with basic sharing/privacy
### **Step 3**: Move styling options from resume view to settings modal
### **Step 4**: Add metadata and analytics tabs
### **Step 5**: Integrate with builder publish flow
### **Step 6**: Add quick actions to resume view page

## User Stories

### **Story 1: Configure Sharing After Creation**
```
As a user,
When I publish my resume from the builder,
I want to immediately configure sharing settings,
So that I can control who sees my resume.
```

### **Story 2: Manage Multiple Resume Versions**
```
As a user with multiple resumes,
When I'm on the dashboard,
I want to easily access settings for each resume,
So that I can manage them independently.
```

### **Story 3: Quick Styling Adjustments**
```
As a user viewing my resume,
When I want to change the styling,
I want quick access to theme presets,
So that I can see changes immediately.
```

## Technical Considerations

### **State Management**:
- Use existing `resumeStore` for CRUD operations
- Add new functions for settings-specific updates
- Maintain reactivity with Svelte stores

### **Permissions**:
- Only resume owner can access settings
- Check `resume.user === currentUser.id`
- Handle unauthorized access gracefully

### **Validation**:
- Slug uniqueness check
- URL format validation
- Privacy setting constraints (e.g., free users limited to 3 public resumes)

### **Performance**:
- Lazy load settings modal
- Cache resume data
- Debounce slug availability checks

## Next Steps

1. **Review this plan** with team/stakeholders
2. **Prioritize features** (MVP vs. nice-to-have)
3. **Create tickets** for each phase
4. **Design mockups** for settings modal
5. **Implement Phase 1** (basic settings modal)
6. **Iterate** based on user feedback

## Questions to Answer

1. Should settings be accessible during draft mode or only after publishing?
2. What sharing features are MVP vs. premium?
3. Should we allow custom domains for resumes (pro feature)?
4. Do we need password protection for resumes?
5. Should analytics be real-time or batch updated?
6. How do we handle resume versioning?
7. Should users be able to duplicate settings across resumes?

## Conclusion

**Recommended Approach**: Option 1 - Add Resume Settings Modal to Dashboard

This provides the best balance of:
- User experience (easy to find, centralized)
- Development effort (reuse existing components)
- Flexibility (can expand features easily)
- Consistency (matches existing patterns)

The settings modal becomes the central hub for managing each resume's configuration, accessible from the dashboard where users already manage their resumes.
