# Enhanced Resumes Collection Test Guide

## Overview
Test the enhanced resumes collection with new fields and functionality after adding them to PocketBase.

## Prerequisites

### 1. Add Fields to PocketBase Collection
Before testing, ensure these fields are added to the `resumes` collection:

**Analytics Fields:**
- `download_count` (number, min: 0, default: 0)
- `share_count` (number, min: 0, default: 0)
- `last_downloaded` (date, optional)
- `last_shared` (date, optional)

**Profile Integration Fields:**
- `profile_snapshot` (json, optional)
- `target_job` (text, max: 200, optional)
- `target_company` (text, max: 200, optional)
- `industry_focus` (select with industry values, optional)
- `experience_level` (select with experience values, optional)

**Quality & Status Fields:**
- `optimization_score` (number, min: 0, max: 100, default: 0)
- `completion_percentage` (number, min: 0, max: 100, default: 0)
- `status` (select: draft/active/archived/template, default: draft)
- `version` (number, min: 1, default: 1)
- `tags` (json, optional)

## Test Scenarios

### Test 1: Enhanced Resume Creation
**Objective**: Verify new resumes are created with profile integration

**Steps**:
1. Ensure user has a complete profile
2. Create a new resume
3. Check that resume includes:
   - Profile snapshot
   - Auto-populated personal info
   - Industry focus from profile
   - Experience level from profile
   - Initial tags
   - Default status as 'draft'

**Expected Result**:
```json
{
  "title": "Software Engineer Resume",
  "profile_snapshot": {
    "target_industry": "technology",
    "experience_level": "mid",
    "target_job_titles": "Software Engineer, Full Stack Developer",
    "key_skills": "JavaScript, React, Node.js",
    "location": "San Francisco, CA",
    "snapshot_date": "2025-09-26T18:00:00Z"
  },
  "target_job": "Software Engineer",
  "industry_focus": "technology",
  "experience_level": "mid",
  "status": "draft",
  "version": 1,
  "tags": ["technology", "mid", "javascript", "react", "nodejs"],
  "completion_percentage": 20,
  "optimization_score": 0
}
```

### Test 2: Analytics Tracking
**Objective**: Verify download and share tracking works

**Steps**:
1. Create or load a resume
2. Call `resumeStore.trackDownload(resumeId)`
3. Call `resumeStore.trackShare(resumeId)`
4. Verify counters increment
5. Check timestamps are set

**Expected Result**:
- `download_count` increases by 1
- `share_count` increases by 1
- `last_downloaded` and `last_shared` timestamps are set
- Local store updates reflect changes

### Test 3: Status Management
**Objective**: Test resume status updates

**Steps**:
1. Create a resume (should be 'draft')
2. Update status to 'active'
3. Update status to 'archived'
4. Verify status changes persist

**Expected Result**:
- Status updates successfully
- Local store reflects changes
- Database is updated

### Test 4: Completion Tracking
**Objective**: Test completion percentage calculation

**Steps**:
1. Create a resume with minimal content
2. Call `resumeStore.calculateAndUpdateCompletion(resumeId)`
3. Add more content (experience, education, skills)
4. Recalculate completion
5. Verify percentage increases

**Expected Result**:
- Initial completion: ~20% (just personal info)
- After adding experience: ~40%
- After adding education: ~60%
- After adding skills: ~80%
- After adding summary: ~100%

### Test 5: Tags Management
**Objective**: Test tag addition and management

**Steps**:
1. Create a resume
2. Add tags using `resumeStore.addTags(resumeId, ['remote', 'senior'])`
3. Verify tags are added without duplicates
4. Check tags appear in UI

**Expected Result**:
- Tags are added to resume
- No duplicate tags
- Local store updates
- Tags visible in dashboard

### Test 6: Version Creation
**Objective**: Test resume versioning

**Steps**:
1. Create a resume
2. Create a new version using `resumeStore.createVersion(resumeId, 'New Title')`
3. Verify new resume is created
4. Check version number increments

**Expected Result**:
- New resume created with incremented version
- Original resume unchanged
- New resume has 'draft' status
- Analytics counters reset to 0

## Manual Testing in Browser

### Console Testing Commands

```javascript
// Test enhanced resume creation
const newResume = await resumeStore.create('Test Resume', 'template_id');
console.log('Created resume:', newResume);

// Test analytics tracking
await resumeStore.trackDownload(newResume.id);
await resumeStore.trackShare(newResume.id);
console.log('Analytics tracked');

// Test status update
await resumeStore.updateStatus(newResume.id, 'active');
console.log('Status updated to active');

// Test completion calculation
const completion = await resumeStore.calculateAndUpdateCompletion(newResume.id);
console.log('Completion percentage:', completion);

// Test tag addition
await resumeStore.addTags(newResume.id, ['remote', 'senior', 'tech']);
console.log('Tags added');

// Test version creation
const newVersion = await resumeStore.createVersion(newResume.id, 'Resume v2');
console.log('New version created:', newVersion);
```

### UI Testing

1. **Dashboard View**:
   - Check resume cards show new fields
   - Verify analytics display (views, downloads, shares)
   - Check status badges
   - Verify completion progress bars
   - Check tags display

2. **Resume Builder**:
   - Verify profile data auto-populates
   - Check completion tracking updates
   - Verify status can be changed

3. **Resume Actions**:
   - Test download tracking
   - Test share tracking
   - Test status changes

## Database Verification

### Check PocketBase Records
```sql
-- View enhanced resume data
SELECT 
  id, 
  title, 
  status, 
  completion_percentage, 
  optimization_score,
  download_count,
  share_count,
  tags,
  industry_focus,
  target_job
FROM resumes 
WHERE user = 'user_id'
ORDER BY updated DESC;
```

### Verify Profile Snapshots
```javascript
// Check profile snapshot data
const resume = await pb.collection('resumes').getOne('resume_id');
console.log('Profile snapshot:', resume.profile_snapshot);
```

## Expected Benefits After Implementation

### 1. **Better User Experience**
- ✅ Auto-populated personal information
- ✅ Progress tracking and completion indicators
- ✅ Better organization with status and tags
- ✅ Version management for iterations

### 2. **Enhanced Analytics**
- ✅ Track resume performance (downloads, shares)
- ✅ Understand user engagement
- ✅ Measure resume effectiveness

### 3. **Improved Personalization**
- ✅ Profile-driven content suggestions
- ✅ Industry-specific optimizations
- ✅ Experience-level appropriate guidance

### 4. **Better Data Insights**
- ✅ Template effectiveness analysis
- ✅ User behavior patterns
- ✅ Success rate optimization

## Troubleshooting

### Common Issues

1. **Fields not saving**: Check PocketBase collection has all new fields
2. **Profile data not populating**: Verify user has completed profile
3. **Analytics not tracking**: Check authentication and permissions
4. **Completion percentage not updating**: Verify content structure

### Debug Commands

```javascript
// Check current user and profile
console.log('Current user:', get(currentUser));
console.log('User profile:', get(userProfile));

// Check resume store state
console.log('Current resume:', get(currentResume));
console.log('User resumes:', get(userResumes));

// Test PocketBase connection
console.log('PocketBase auth:', pb.authStore.isValid);
console.log('PocketBase model:', pb.authStore.model);
```

## Success Criteria

### ✅ Resume Creation
- [ ] Profile data auto-populates
- [ ] Profile snapshot is saved
- [ ] Initial tags are generated
- [ ] Status defaults to 'draft'
- [ ] Completion percentage calculated

### ✅ Analytics Tracking
- [ ] Download tracking works
- [ ] Share tracking works
- [ ] Counters increment correctly
- [ ] Timestamps are set

### ✅ Status Management
- [ ] Status can be updated
- [ ] Changes persist in database
- [ ] Local store updates

### ✅ Completion Tracking
- [ ] Percentage calculates correctly
- [ ] Updates when content changes
- [ ] Reflects in UI

### ✅ Tags & Organization
- [ ] Tags can be added
- [ ] No duplicates created
- [ ] Tags display in UI

### ✅ Version Management
- [ ] New versions can be created
- [ ] Version numbers increment
- [ ] Analytics reset for new versions

This enhanced resumes collection will provide a much richer foundation for analytics, personalization, and user experience improvements!