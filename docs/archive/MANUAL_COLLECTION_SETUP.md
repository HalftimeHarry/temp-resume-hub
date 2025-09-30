# Manual Collection Setup (Recommended)

Since the import is failing, let's create the collection manually. This is actually more reliable and gives you better control.

## Step 1: Create New Collection

1. **Go to Collections** in your PocketBase admin
2. **Click "New Collection"**
3. **Set Name**: `user_profiles`
4. **Set Type**: `Base`
5. **Click "Create"**

## Step 2: Add Fields One by One

### Field 1: user (REQUIRED)
- **Name**: `user`
- **Type**: `Relation`
- **Required**: ✅ Yes
- **Collection**: Select `users` from dropdown
- **Max select**: `1`
- **Cascade delete**: ✅ Yes

### Field 2: first_name
- **Name**: `first_name`
- **Type**: `Text`
- **Required**: ❌ No
- **Max length**: `50`

### Field 3: last_name
- **Name**: `last_name`
- **Type**: `Text`
- **Required**: ❌ No
- **Max length**: `50`

### Field 4: target_industry
- **Name**: `target_industry`
- **Type**: `Select`
- **Required**: ❌ No
- **Max select**: `1`
- **Values** (copy and paste these):
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

### Field 5: experience_level
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

### Field 6: target_job_titles
- **Name**: `target_job_titles`
- **Type**: `Text`
- **Required**: ❌ No
- **Max length**: `500`

### Field 7: key_skills
- **Name**: `key_skills`
- **Type**: `Text`
- **Required**: ❌ No
- **Max length**: `1000`

### Field 8: profile_completed
- **Name**: `profile_completed`
- **Type**: `Bool`
- **Required**: ❌ No

## Step 3: Set API Rules

In the **API Rules** tab, set all rules to:
```
user = @request.auth.id
```

Specifically:
- **List rule**: `user = @request.auth.id`
- **View rule**: `user = @request.auth.id`
- **Create rule**: `user = @request.auth.id`
- **Update rule**: `user = @request.auth.id`
- **Delete rule**: `user = @request.auth.id`

## Step 4: Save Collection

Click **"Save"** to create the collection.

## Step 5: Test Basic Functionality

### Test with Minimal Fields First:
1. Create a test profile record manually
2. Verify the user relation works
3. Test the API rules

### Add More Fields Later:
Once basic functionality works, you can add more fields:
- `phone` (Text, max 20)
- `location` (Text, max 100)
- `linkedin_url` (URL)
- `portfolio_url` (URL)
- `career_stage` (Select with values)
- `preferred_work_type` (Select, max 3)
- `salary_expectation_min` (Number, min 0)
- `salary_expectation_max` (Number, min 0)
- `education_level` (Select with values)
- `certifications` (Text, max 500)
- `willing_to_relocate` (Bool)
- `template_preferences` (JSON)
- `onboarding_data` (JSON)
- `profile_completed_at` (Date)

## Step 6: Update Your App Configuration

Set this environment variable:
```bash
PUBLIC_POCKETBASE_URL=https://pocketbase-production-1493.up.railway.app
```

## Step 7: Test Integration

1. **Deploy your app** with the environment variable
2. **Register a new user**
3. **Complete onboarding**
4. **Check PocketBase admin** for the new profile record

## Troubleshooting Tips

### If the user relation doesn't work:
- Make sure you selected the `users` collection (not `_pb_users_auth_`)
- Check that cascade delete is enabled
- Verify max select is set to 1

### If API rules don't work:
- Double-check the rule syntax: `user = @request.auth.id`
- Make sure all 5 rules are set
- Test with a logged-in user

### If select fields cause errors:
- Make sure you added the values list
- Check for typos in the values
- Ensure no extra spaces or special characters

## Success Indicators

✅ Collection appears in PocketBase admin  
✅ User relation field works correctly  
✅ API rules prevent unauthorized access  
✅ Test profile can be created manually  
✅ App can connect and create profiles  

This manual approach is more reliable than importing and gives you better control over the setup process.