# Update Existing user_profiles Collection

## Current Issues to Fix:

1. **API Rules**: All are null - need to set security rules
2. **User field**: Should be required and cascade delete
3. **Name fields**: Should not be required (optional)
4. **Select field values**: Need to add all industry/experience options
5. **Missing fields**: Need to add many more fields

## Step 1: Fix API Rules (CRITICAL)

Go to the **API Rules** tab and set:
- **List rule**: `user = @request.auth.id`
- **View rule**: `user = @request.auth.id`
- **Create rule**: `user = @request.auth.id`
- **Update rule**: `user = @request.auth.id`
- **Delete rule**: `user = @request.auth.id`

## Step 2: Update Existing Fields

### Fix user field:
- **Required**: ✅ Change to Yes
- **Cascade delete**: ✅ Change to Yes
- **Min select**: Change to 1

### Fix first_name field:
- **Required**: ❌ Change to No
- **Min length**: Remove (set to 0 or empty)

### Fix last_name field:
- **Required**: ❌ Change to No
- **Min length**: Remove (set to 0 or empty)

### Update target_industry values:
Replace the current values with this complete list:
```
technology
healthcare
finance
retail
education
manufacturing
hospitality
marketing
sales
consulting
nonprofit
government
media
real_estate
construction
transportation
energy
agriculture
legal
other
```

### Update experience_level values:
Replace the current values with:
```
entry
junior
mid
senior
executive
student
career_change
```

## Step 3: Add Missing Fields

Add these additional fields:

### phone
- **Type**: Text
- **Required**: No
- **Max length**: 20

### location
- **Type**: Text
- **Required**: No
- **Max length**: 100

### linkedin_url
- **Type**: URL
- **Required**: No

### portfolio_url
- **Type**: URL
- **Required**: No

### target_job_titles
- **Type**: Text
- **Required**: No
- **Max length**: 500

### key_skills
- **Type**: Text
- **Required**: No
- **Max length**: 1000

### career_stage
- **Type**: Select
- **Required**: No
- **Max select**: 1
- **Values**:
```
first_job
career_growth
career_change
promotion_seeking
industry_switch
returning_to_work
freelance_to_fulltime
executive_level
```

### preferred_work_type
- **Type**: Select
- **Required**: No
- **Max select**: 3
- **Values**:
```
remote
hybrid
onsite
contract
freelance
part_time
full_time
internship
```

### salary_expectation_min
- **Type**: Number
- **Required**: No
- **Min**: 0
- **Only integers**: Yes

### salary_expectation_max
- **Type**: Number
- **Required**: No
- **Min**: 0
- **Only integers**: Yes

### education_level
- **Type**: Select
- **Required**: No
- **Max select**: 1
- **Values**:
```
high_school
some_college
associates
bachelors
masters
doctorate
professional
bootcamp
certification
```

### certifications
- **Type**: Text
- **Required**: No
- **Max length**: 500

### willing_to_relocate
- **Type**: Bool
- **Required**: No

### template_preferences
- **Type**: JSON
- **Required**: No

### onboarding_data
- **Type**: JSON
- **Required**: No

### profile_completed
- **Type**: Bool
- **Required**: No

### profile_completed_at
- **Type**: Date
- **Required**: No

## Step 4: Priority Order

If you want to add fields gradually, do them in this priority order:

### High Priority (Essential):
1. Fix API rules (CRITICAL)
2. Fix user field (required + cascade delete)
3. Fix name fields (make optional)
4. Update select field values
5. Add target_job_titles
6. Add profile_completed

### Medium Priority:
7. Add key_skills
8. Add career_stage
9. Add education_level
10. Add preferred_work_type

### Low Priority:
11. Add contact fields (phone, location, urls)
12. Add salary fields
13. Add JSON fields (template_preferences, onboarding_data)

## Step 5: Test After Each Change

After making changes:
1. **Save the collection**
2. **Test creating a record manually**
3. **Verify API rules work**
4. **Test with your application**

## Quick Fix Script

If you want to test immediately with minimal changes:

1. **Set API rules** (most important)
2. **Make user field required**
3. **Make name fields optional**
4. **Update select field values**

This will make the collection functional with your app right away.

## Verification

After updates, your collection should:
- ✅ Have proper API rules set
- ✅ Allow authenticated users to create profiles
- ✅ Prevent users from seeing other users' profiles
- ✅ Have comprehensive field options
- ✅ Work with the profile forms in your app

The most critical fix is setting the API rules - without them, the collection won't work securely with your application!