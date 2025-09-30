# API Rules and Permissions Setup

## Overview
The API rules control who can access and modify user profile data. These rules ensure users can only see and edit their own profiles.

## API Rules Configuration

### 1. List Rule
**Rule**: `user = @request.auth.id`
**Purpose**: Users can only list their own profile records
**Explanation**: This ensures when a user queries for profiles, they only see their own

### 2. View Rule  
**Rule**: `user = @request.auth.id`
**Purpose**: Users can only view their own profile details
**Explanation**: Prevents users from viewing other users' profile information

### 3. Create Rule
**Rule**: `user = @request.auth.id`
**Purpose**: Users can only create profiles for themselves
**Explanation**: When creating a profile, the user field must match the authenticated user's ID

### 4. Update Rule
**Rule**: `user = @request.auth.id`
**Purpose**: Users can only update their own profiles
**Explanation**: Prevents users from modifying other users' profile data

### 5. Delete Rule
**Rule**: `user = @request.auth.id`
**Purpose**: Users can only delete their own profiles
**Explanation**: Allows users to remove their own profile data if needed

## How to Set These Rules

### In PocketBase Admin Interface:

1. **Go to Collections** → **user_profiles**
2. **Click on the "API Rules" tab**
3. **For each rule type**, enter the exact text: `user = @request.auth.id`

### Visual Guide:
```
┌─────────────────────────────────────────┐
│ API Rules                               │
├─────────────────────────────────────────┤
│ List rule:   user = @request.auth.id    │
│ View rule:   user = @request.auth.id    │
│ Create rule: user = @request.auth.id    │
│ Update rule: user = @request.auth.id    │
│ Delete rule: user = @request.auth.id    │
└─────────────────────────────────────────┘
```

## Rule Explanation

### `@request.auth.id`
- This represents the ID of the currently authenticated user
- Only available when a user is logged in
- Automatically provided by PocketBase authentication

### `user = @request.auth.id`
- `user` refers to the user field in the user_profiles collection
- This rule ensures the user field matches the authenticated user's ID
- Effectively creates a "users can only access their own data" policy

## Security Benefits

✅ **Data Privacy**: Users cannot see other users' profiles  
✅ **Data Integrity**: Users cannot modify other users' data  
✅ **Access Control**: Only authenticated users can access profiles  
✅ **Ownership**: Users maintain full control over their own data  

## Testing the Rules

### After setting up the rules, test:

1. **Create a user account** in your app
2. **Create a profile** for that user
3. **Try to access the profile** via the API
4. **Verify** you can only see your own profile data

### API Test Examples:

```bash
# This should work (your own profile)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8090/api/collections/user_profiles/records

# This should fail (trying to access specific profile by ID)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8090/api/collections/user_profiles/records/SOMEONE_ELSES_ID
```

## Common Issues

### "Unauthorized" errors:
- Check that the user is properly authenticated
- Verify the auth token is valid
- Ensure the user field is set correctly when creating profiles

### "Forbidden" errors:
- Double-check the API rules are set correctly
- Verify the user field in the profile matches the authenticated user
- Check that the relation field is properly configured

### Rules not working:
- Make sure you clicked "Save" after setting the rules
- Verify the field name is exactly "user" (case-sensitive)
- Check that the users collection exists and is properly configured

## Advanced Rules (Optional)

If you need more complex permissions later, you can use:

### Allow admin access:
```
user = @request.auth.id || @request.auth.role = "admin"
```

### Allow public read access to completed profiles:
```
// For view rule only
user = @request.auth.id || profile_completed = true
```

### Time-based restrictions:
```
user = @request.auth.id && @request.auth.created > "2024-01-01"
```

## Verification Checklist

- [ ] All 5 API rules are set to `user = @request.auth.id`
- [ ] Rules are saved successfully
- [ ] Test user can create their own profile
- [ ] Test user can view their own profile
- [ ] Test user can update their own profile
- [ ] Test user cannot access other users' profiles
- [ ] Unauthenticated requests are properly rejected

Once these rules are in place, your user profile system will be secure and properly isolated per user.