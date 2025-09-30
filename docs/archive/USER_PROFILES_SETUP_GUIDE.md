# User Profiles Collection Setup Guide

## Step 1: Access PocketBase Admin Interface

1. **Start PocketBase** (if not already running):
   ```bash
   cd backend
   ./pocketbase serve --http=0.0.0.0:8090
   ```

2. **Open Admin Interface**:
   - Navigate to: `http://localhost:8090/_/`
   - Login with admin credentials (check console output for password)

## Step 2: Create user_profiles Collection

1. **Go to Collections** in the left sidebar
2. **Click "New Collection"**
3. **Set Collection Name**: `user_profiles`
4. **Set Collection Type**: `Base`

## Step 3: Configure Fields

Add the following fields **in this exact order**:

### Field 1: user (Relation)
- **Name**: `user`
- **Type**: `Relation`
- **Required**: ✅ Yes
- **Collection**: `users` (select from dropdown)
- **Max select**: `1`
- **Cascade delete**: ✅ Yes

### Field 2: first_name (Text)
- **Name**: `first_name`
- **Type**: `Text`
- **Required**: ❌ No
- **Max length**: `50`

### Field 3: last_name (Text)
- **Name**: `last_name`
- **Type**: `Text`
- **Required**: ❌ No
- **Max length**: `50`

### Field 4: phone (Text)
- **Name**: `phone`
- **Type**: `Text`
- **Required**: ❌ No
- **Max length**: `20`

### Field 5: location (Text)
- **Name**: `location`
- **Type**: `Text`
- **Required**: ❌ No
- **Max length**: `100`

### Field 6: linkedin_url (URL)
- **Name**: `linkedin_url`
- **Type**: `URL`
- **Required**: ❌ No

### Field 7: portfolio_url (URL)
- **Name**: `portfolio_url`
- **Type**: `URL`
- **Required**: ❌ No

### Field 8: target_industry (Select)
- **Name**: `target_industry`
- **Type**: `Select`
- **Required**: ❌ No
- **Max select**: `1`
- **Values** (add these options):
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

### Field 9: experience_level (Select)
- **Name**: `experience_level`
- **Type**: `Select`
- **Required**: ❌ No
- **Max select**: `1`
- **Values**:
  ```
  entry
  junior
  mid
  senior
  executive
  student
  career_change
  ```

### Field 10: target_job_titles (Text)
- **Name**: `target_job_titles`
- **Type**: `Text`
- **Required**: ❌ No
- **Max length**: `500`

### Field 11: key_skills (Text)
- **Name**: `key_skills`
- **Type**: `Text`
- **Required**: ❌ No
- **Max length**: `1000`

### Field 12: career_stage (Select)
- **Name**: `career_stage`
- **Type**: `Select`
- **Required**: ❌ No
- **Max select**: `1`
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

### Field 13: preferred_work_type (Select)
- **Name**: `preferred_work_type`
- **Type**: `Select`
- **Required**: ❌ No
- **Max select**: `3`
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

### Field 14: salary_expectation_min (Number)
- **Name**: `salary_expectation_min`
- **Type**: `Number`
- **Required**: ❌ No
- **Min**: `0`
- **Only integers**: ✅ Yes

### Field 15: salary_expectation_max (Number)
- **Name**: `salary_expectation_max`
- **Type**: `Number`
- **Required**: ❌ No
- **Min**: `0`
- **Only integers**: ✅ Yes

### Field 16: education_level (Select)
- **Name**: `education_level`
- **Type**: `Select`
- **Required**: ❌ No
- **Max select**: `1`
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

### Field 17: certifications (Text)
- **Name**: `certifications`
- **Type**: `Text`
- **Required**: ❌ No
- **Max length**: `500`

### Field 18: willing_to_relocate (Bool)
- **Name**: `willing_to_relocate`
- **Type**: `Bool`
- **Required**: ❌ No

### Field 19: template_preferences (JSON)
- **Name**: `template_preferences`
- **Type**: `JSON`
- **Required**: ❌ No

### Field 20: onboarding_data (JSON)
- **Name**: `onboarding_data`
- **Type**: `JSON`
- **Required**: ❌ No

### Field 21: profile_completed (Bool)
- **Name**: `profile_completed`
- **Type**: `Bool`
- **Required**: ❌ No

### Field 22: profile_completed_at (Date)
- **Name**: `profile_completed_at`
- **Type**: `Date`
- **Required**: ❌ No

## Step 4: Configure API Rules

In the **API Rules** section, set:

- **List rule**: `user = @request.auth.id`
- **View rule**: `user = @request.auth.id`
- **Create rule**: `user = @request.auth.id`
- **Update rule**: `user = @request.auth.id`
- **Delete rule**: `user = @request.auth.id`

## Step 5: Save Collection

Click **"Save"** to create the collection.

## Step 6: Test the Collection

1. **Go to the Records tab** for the user_profiles collection
2. **Try creating a test record** manually
3. **Verify all fields are working correctly**

## Step 7: Test Integration

1. **Navigate to**: `/test/profile-recommendations` in your app
2. **Click "Create Mock Profile"** to test profile creation
3. **Verify the profile appears** in PocketBase admin

## Troubleshooting

### If you get validation errors:
1. **Check field names** match exactly (case-sensitive)
2. **Verify select field values** are entered correctly
3. **Ensure relation field** points to the correct collection
4. **Check API rules** are set properly

### If PocketBase won't start:
1. **Check if port 8090 is in use**: `lsof -i :8090`
2. **Try a different port**: `./pocketbase serve --http=0.0.0.0:8091`
3. **Check file permissions**: `chmod +x pocketbase`
4. **Remove old database**: `rm -f pb_data/data.db`

### If the app can't connect:
1. **Update the config** in `app/src/lib/config.ts` if using different port
2. **Check CORS settings** in PocketBase
3. **Verify API rules** allow authenticated users

## Success Indicators

✅ Collection appears in PocketBase admin  
✅ All fields are configured correctly  
✅ API rules are set properly  
✅ Test profile creation works  
✅ App can read/write profile data  
✅ Recommendations system works  

Once complete, users will be able to:
- Complete profiles during onboarding
- Get personalized template recommendations
- Manage their profile information
- Receive industry-specific guidance