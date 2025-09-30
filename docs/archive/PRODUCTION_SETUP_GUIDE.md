# Production Setup Guide

## Step 1: Import user_profiles Collection

### Using the Import File:
1. **Copy the content** from `user_profiles_collection_import.json`
2. **Go to your PocketBase admin**: https://pocketbase-production-1493.up.railway.app/_/#/settings/import-collections
3. **Paste the JSON** into the import field
4. **Click "Review"** to validate the import
5. **Click "Import"** to create the collection

### Alternative: Manual Creation
If import fails, create manually using `FIELD_CHECKLIST.md`:
1. Go to Collections → New Collection
2. Name: `user_profiles`, Type: `base`
3. Add each field from the checklist
4. Set API rules: `user = @request.auth.id`

## Step 2: Configure Production Environment

### Update Environment Variables:
Set the following environment variable in your deployment platform:

```bash
PUBLIC_POCKETBASE_URL=https://pocketbase-production-1493.up.railway.app
```

### For Different Platforms:

#### Netlify:
1. Go to Site Settings → Environment Variables
2. Add: `PUBLIC_POCKETBASE_URL` = `https://pocketbase-production-1493.up.railway.app`

#### Vercel:
1. Go to Project Settings → Environment Variables
2. Add: `PUBLIC_POCKETBASE_URL` = `https://pocketbase-production-1493.up.railway.app`

#### Railway:
1. Go to Variables tab
2. Add: `PUBLIC_POCKETBASE_URL` = `https://pocketbase-production-1493.up.railway.app`

## Step 3: Test the Integration

### 1. Verify Collection Creation:
- Go to your PocketBase admin
- Check that `user_profiles` collection exists
- Verify all fields are present
- Confirm API rules are set

### 2. Test API Connection:
```bash
# Test health endpoint
curl https://pocketbase-production-1493.up.railway.app/api/health

# Test collections endpoint (should require auth)
curl https://pocketbase-production-1493.up.railway.app/api/collections/user_profiles/records
```

### 3. Test in Application:
1. **Deploy your app** with the new environment variable
2. **Register a new user** to test profile creation
3. **Complete onboarding** to test profile saving
4. **Check PocketBase admin** to verify profile was created

## Step 4: Verify Profile System

### Test URLs (replace with your domain):
- Profile Management: `/profile`
- Onboarding Flow: `/onboarding`
- Profile Testing: `/test/profile-recommendations`

### Expected Behavior:
1. **Registration** → Automatic redirect to `/onboarding`
2. **Profile Creation** → Data saves to PocketBase
3. **Recommendations** → Personalized templates based on profile
4. **Profile Management** → Users can edit their profiles

## Step 5: Monitor and Debug

### Check Application Logs:
Look for these success messages:
```
✅ User profile created: [profile_id]
✅ Profile saved successfully: [profile_id]
✅ Generated X recommendations
```

### Check for Errors:
Common issues and solutions:
- **CORS errors**: Ensure PocketBase allows your domain
- **Auth errors**: Check API rules are set correctly
- **Connection errors**: Verify the PocketBase URL is correct

### PocketBase Admin Monitoring:
- Check Records tab for new profiles
- Monitor API logs for requests
- Verify user authentication is working

## Step 6: Production Checklist

### ✅ Pre-Launch Verification:
- [ ] user_profiles collection created successfully
- [ ] All 22 fields are present and configured
- [ ] API rules set to `user = @request.auth.id`
- [ ] Environment variable configured
- [ ] Application deployed with new config
- [ ] Registration flow works end-to-end
- [ ] Profile creation saves to database
- [ ] Profile editing works correctly
- [ ] Recommendations generate properly
- [ ] No console errors in production

### ✅ User Experience Testing:
- [ ] New user registration → onboarding flow
- [ ] Profile completion tracking works
- [ ] Form validation functions correctly
- [ ] Progress indicators update properly
- [ ] Responsive design works on mobile
- [ ] Template recommendations are relevant

## Troubleshooting

### If Import Fails:
1. **Check JSON format**: Ensure no syntax errors
2. **Try smaller chunks**: Import one field at a time
3. **Manual creation**: Use the field checklist instead
4. **Check permissions**: Ensure admin access

### If Connection Fails:
1. **Verify URL**: Check the PocketBase URL is accessible
2. **Check CORS**: Ensure your domain is allowed
3. **Test API**: Use curl to test endpoints directly
4. **Check logs**: Look at both app and PocketBase logs

### If Profiles Don't Save:
1. **Check API rules**: Ensure they allow authenticated users
2. **Verify auth**: Make sure users are properly logged in
3. **Check field validation**: Ensure required fields are set
4. **Test manually**: Try creating a profile in PocketBase admin

## Success Indicators

### ✅ System Working Correctly:
- Users can register and complete onboarding
- Profiles save to PocketBase successfully
- Recommendations generate based on profile data
- Profile editing works without errors
- No critical console errors

### ✅ Data Flow Working:
- Registration → Profile creation → Onboarding → Recommendations
- Profile updates → Updated recommendations
- User authentication → Profile access control

## Next Steps After Setup

1. **User Testing**: Get feedback from real users
2. **Analytics**: Monitor profile completion rates
3. **Optimization**: Improve recommendation algorithm
4. **Enhancement**: Add more profile fields as needed
5. **Scaling**: Monitor performance and optimize as needed

The profile system will significantly enhance user experience by providing personalized template recommendations and guided onboarding!