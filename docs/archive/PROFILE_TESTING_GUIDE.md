# Profile System Testing Guide

## Testing Options

### Option 1: With PocketBase Running
If you successfully set up the user_profiles collection in PocketBase:

### Option 2: Without PocketBase (Mock Testing)
If PocketBase isn't working, you can still test the UI components:

## Test Scenarios

### 1. Test Profile Creation Interface

**URL**: `/test/profile-recommendations`

**What to test**:
- [ ] Page loads without errors
- [ ] "Create Mock Profile" button works
- [ ] Profile form appears and is functional
- [ ] All form fields are present and working
- [ ] Form validation works correctly

### 2. Test Onboarding Flow

**URL**: `/onboarding`

**What to test**:
- [ ] Welcome screen displays correctly
- [ ] Profile setup wizard launches
- [ ] Multi-step form navigation works
- [ ] Progress indicator updates
- [ ] Form validation on each step
- [ ] Completion screen appears

### 3. Test Profile Management

**URL**: `/profile`

**What to test**:
- [ ] Profile page loads
- [ ] Shows "Complete Profile" if no profile exists
- [ ] Profile setup form works
- [ ] Profile editing functionality
- [ ] Profile completion percentage
- [ ] Profile information display

### 4. Test Registration Flow

**Steps**:
1. Go to `/auth/register`
2. Create a new account
3. Should redirect to `/onboarding`
4. Complete the onboarding flow
5. Verify profile is created

### 5. Test Template Recommendations

**URL**: `/test/profile-recommendations`

**What to test**:
- [ ] Recommendations generate with mock data
- [ ] Recommendation scoring works
- [ ] Different profile criteria produce different results
- [ ] Enhanced templates are prioritized correctly

## Manual Testing Steps

### Step 1: Test UI Components
```bash
# Start the development server
cd app && npm run dev
```

Navigate to each test URL and verify the interfaces work.

### Step 2: Test Mock Profile Creation
1. Go to `/test/profile-recommendations`
2. Click "Create Mock Profile"
3. Verify the form appears
4. Fill out the form
5. Submit and check for errors

### Step 3: Test Recommendation Engine
1. On the same page, click "Generate Recommendations"
2. Verify recommendations appear
3. Check that scores are calculated
4. Verify enhanced templates are shown

### Step 4: Test Onboarding Flow
1. Go to `/onboarding`
2. Click through the welcome screen
3. Complete the profile setup
4. Verify the completion screen

## Expected Results

### ✅ Success Indicators:
- All pages load without console errors
- Forms are functional and responsive
- Navigation between steps works
- Mock data creates properly
- Recommendations generate correctly
- UI components display properly

### ❌ Potential Issues:
- Console errors about PocketBase connection
- Forms not submitting (expected without PocketBase)
- Missing UI components
- Broken navigation
- Styling issues

## Testing Without PocketBase

The system is designed to work with mock data when PocketBase isn't available:

### Mock Profile Data:
```javascript
{
  target_industry: 'technology',
  experience_level: 'entry',
  target_job_titles: 'Software Developer, Frontend Developer',
  key_skills: 'JavaScript, React, HTML, CSS',
  career_stage: 'first_job',
  education_level: 'bachelors'
}
```

### Mock Recommendations:
The system will generate recommendations based on this mock data and show how the scoring algorithm works.

## Console Testing

Open browser developer tools and check for:

### Expected Messages:
```
🧪 Starting profile and recommendations test...
🔄 Loading user profile...
⚠️ PocketBase connection failed - using mock data
✅ Generated X recommendations
```

### Error Messages to Ignore:
```
❌ Error loading user profile: fetch failed
❌ user_profiles collection not found
Connection refused 127.0.0.1:8090
```

These are expected when PocketBase isn't running.

## Integration Testing (When PocketBase Works)

### Test Profile CRUD Operations:
```javascript
// In browser console
const profileStore = window.userProfileStore;

// Test profile creation
await profileStore.saveProfile({
  first_name: 'Test',
  last_name: 'User',
  target_industry: 'technology',
  experience_level: 'entry'
});

// Test profile loading
await profileStore.loadProfile();
```

### Test Recommendation Integration:
```javascript
// Test recommendations with profile data
const recommendations = enhancedTemplateStore.getPersonalizedRecommendations();
console.log('Recommendations:', recommendations);
```

## Performance Testing

### Load Time Testing:
- [ ] Profile page loads in < 2 seconds
- [ ] Onboarding flow is responsive
- [ ] Form interactions are smooth
- [ ] No memory leaks during navigation

### Mobile Testing:
- [ ] Forms work on mobile devices
- [ ] Touch interactions work properly
- [ ] Responsive design functions correctly
- [ ] No horizontal scrolling issues

## Accessibility Testing

### Keyboard Navigation:
- [ ] All forms are keyboard accessible
- [ ] Tab order is logical
- [ ] Focus indicators are visible
- [ ] Screen reader compatibility

### Visual Testing:
- [ ] Sufficient color contrast
- [ ] Text is readable at all sizes
- [ ] Form labels are properly associated
- [ ] Error messages are clear

## Troubleshooting

### If pages don't load:
1. Check the development server is running
2. Verify no TypeScript errors
3. Check browser console for errors
4. Clear browser cache

### If forms don't work:
1. Check form validation logic
2. Verify event handlers are attached
3. Check for JavaScript errors
4. Test with different browsers

### If recommendations don't generate:
1. Verify mock data is properly formatted
2. Check recommendation algorithm logic
3. Ensure enhanced templates store is working
4. Check console for scoring errors

## Success Criteria

The profile system passes testing when:
- ✅ All UI components render correctly
- ✅ Forms are functional and validated
- ✅ Navigation flows work smoothly
- ✅ Mock data generates recommendations
- ✅ No critical console errors
- ✅ Responsive design works on all devices
- ✅ Accessibility requirements are met

Even without PocketBase, you should be able to verify that the entire user interface and recommendation logic works correctly.