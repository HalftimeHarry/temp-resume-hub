# Admin Dashboard Guide

## Overview

The admin dashboard provides a separate interface for users with the `admin` role to manage the system, view analytics, and manage users.

## How It Works

### Role-Based Access

1. **Job Seekers** (default role)
   - Access: `/dashboard`
   - Can create and manage their own resumes
   - Cannot access admin features

2. **Admins**
   - Access: `/dashboard/admin`
   - Automatically redirected from `/dashboard` to `/dashboard/admin`
   - Can view all users, profiles, and system statistics
   - Can manage user accounts

3. **Moderators** (future)
   - Can be given specific moderation permissions
   - Access to content moderation tools

### Automatic Routing

```typescript
// When user visits /dashboard
if (userProfile.role === 'admin') {
  redirect to /dashboard/admin
} else {
  show regular dashboard
}

// When user visits /dashboard/admin
if (userProfile.role !== 'admin') {
  redirect to /dashboard
} else {
  show admin dashboard
}
```

## Setting Default Role

### Option 1: In PocketBase Admin UI (Recommended)

1. Open PocketBase Admin: `http://localhost:8090/_/`
2. Go to Collections → user_profiles
3. Click on the `role` field
4. Set default value: `job_seeker`
5. Save

This ensures all new users get `job_seeker` role automatically.

### Option 2: In Code (Already Implemented)

The registration code already sets the default:

```typescript
// app/src/lib/stores/auth.ts
const profileData = {
  user: userId,
  first_name: firstName,
  last_name: lastName,
  role: 'job_seeker',  // ← Default role
  plan: 'free',
  verified: false,
  active: true,
  // ...
};
```

## Making a User an Admin

### Method 1: PocketBase Admin UI

1. Open PocketBase Admin: `http://localhost:8090/_/`
2. Go to Collections → user_profiles
3. Find the user you want to promote
4. Click "Edit"
5. Change `role` from `job_seeker` to `admin`
6. Save
7. User will be redirected to admin dashboard on next login

### Method 2: Direct Database Update

```javascript
// In PocketBase Admin → Settings → Backups → Console
const profile = await $app.dao().findFirstRecordByFilter(
  "user_profiles",
  "user = 'USER_ID_HERE'"
);

profile.set("role", "admin");
await $app.dao().saveRecord(profile);
```

### Method 3: API Call (for automation)

```typescript
import { pb } from '$lib/pocketbase';

async function promoteToAdmin(userId: string) {
  const profiles = await pb.collection('user_profiles').getFullList({
    filter: `user = "${userId}"`
  });
  
  if (profiles.length > 0) {
    await pb.collection('user_profiles').update(profiles[0].id, {
      role: 'admin'
    });
  }
}
```

## Admin Dashboard Features

### Statistics Cards
- Total Users
- Active Users (with verified count)
- Premium Users (Pro + Enterprise)
- Total Resumes

### Recent Users Table
- Shows latest registered users
- Displays role, plan, and verification status
- Color-coded badges for easy identification

### Recent Activity
- Shows latest resume updates
- Tracks user activity

### User Management Table
- Complete list of all users
- Filter and search capabilities
- Manage user accounts
- View detailed user information

## Role Values

⚠️ **Important**: Update your PocketBase schema to use lowercase values:

### Current (Incorrect)
```json
"values": ["Job Seeker", "Admin"]
```

### Should Be (Correct)
```json
"values": ["job_seeker", "moderator", "admin"]
```

### Why Lowercase?
- Consistent with code
- Easier to work with in filters
- Standard naming convention
- Prevents case-sensitivity issues

## Testing

### Test Role-Based Access

1. **Create a test user**
   ```bash
   # Register at /auth/register
   # Default role will be: job_seeker
   ```

2. **Test job seeker access**
   ```bash
   # Login and visit /dashboard
   # Should see regular dashboard
   # Should NOT be redirected to /dashboard/admin
   ```

3. **Promote to admin**
   ```bash
   # In PocketBase Admin, change role to 'admin'
   ```

4. **Test admin access**
   ```bash
   # Login and visit /dashboard
   # Should be redirected to /dashboard/admin
   # Should see admin dashboard with statistics
   ```

5. **Test direct admin URL**
   ```bash
   # As job_seeker, visit /dashboard/admin
   # Should be redirected back to /dashboard
   ```

## Security

### Server-Side Protection

The admin dashboard uses `+page.server.ts` for server-side role checking:

```typescript
// Checks role before loading page
if (profile.role !== 'admin') {
  throw redirect(303, '/dashboard');
}
```

This means:
- ✅ Role is checked on the server
- ✅ Cannot be bypassed by client-side manipulation
- ✅ Secure against unauthorized access

### Access Rules

PocketBase collection rules already protect data:

```javascript
// user_profiles collection
listRule: "user = @request.auth.id"
viewRule: "user = @request.auth.id"
updateRule: "user = @request.auth.id"
```

For admin access to all profiles, you may want to add:

```javascript
// Update user_profiles collection rules
listRule: "user = @request.auth.id || @request.auth.profile.role = 'admin'"
viewRule: "user = @request.auth.id || @request.auth.profile.role = 'admin'"
```

## Customization

### Add More Admin Features

Edit `app/src/routes/dashboard/admin/+page.server.ts`:

```typescript
// Add more data loading
const [users, profiles, templates, analytics] = await Promise.all([
  pb.collection('users').getList(1, 50),
  pb.collection('user_profiles').getList(1, 50),
  pb.collection('templates').getList(1, 50),  // Add this
  pb.collection('analytics').getList(1, 50)   // Add this
]);
```

### Add Admin Actions

Edit `app/src/routes/dashboard/admin/+page.svelte`:

```svelte
<Button on:click={() => handleBanUser(userId)}>
  Ban User
</Button>

<Button on:click={() => handleUpgradePlan(userId, 'pro')}>
  Upgrade to Pro
</Button>
```

### Add Moderator Role

1. Update schema: Add `moderator` to role values
2. Create `/dashboard/moderator` route
3. Add moderator-specific features
4. Update redirect logic

## Troubleshooting

### Issue: Admin not redirected to admin dashboard

**Check:**
1. Role value is exactly `admin` (lowercase)
2. Profile exists for the user
3. Browser console for errors
4. PocketBase auth is valid

**Fix:**
```typescript
// Check in browser console
const userId = pb.authStore.model?.id;
const profiles = await pb.collection('user_profiles').getFullList({
  filter: `user = "${userId}"`
});
console.log('User role:', profiles[0]?.role);
```

### Issue: Job seeker can access admin dashboard

**This should not happen** due to server-side protection. If it does:

1. Check `+page.server.ts` is present
2. Verify role check logic
3. Clear browser cache
4. Check PocketBase auth state

### Issue: Role not updating

**Check:**
1. PocketBase Admin UI shows correct role
2. User has logged out and back in
3. Profile record exists
4. No caching issues

**Fix:**
```typescript
// Force profile reload
await pb.collection('user_profiles').getFullList({
  filter: `user = "${userId}"`,
  $autoCancel: false
});
```

## Best Practices

### 1. Always Use Server-Side Checks
```typescript
// ✅ Good - Server-side
export const load: PageServerLoad = async ({ locals }) => {
  if (profile.role !== 'admin') {
    throw redirect(303, '/dashboard');
  }
};

// ❌ Bad - Client-side only
if (userRole !== 'admin') {
  goto('/dashboard');
}
```

### 2. Use Lowercase Role Values
```typescript
// ✅ Good
role: 'job_seeker'
role: 'admin'

// ❌ Bad
role: 'Job Seeker'
role: 'ADMIN'
```

### 3. Check Role on Every Protected Route
```typescript
// Every admin route should have +page.server.ts
// with role checking
```

### 4. Log Access Attempts
```typescript
if (profile.role !== 'admin') {
  console.warn(`Unauthorized access attempt by user ${userId}`);
  // Optional: Log to database for security monitoring
}
```

## Summary

✅ **What's Implemented:**
- Admin dashboard at `/dashboard/admin`
- Server-side role protection
- Automatic redirect for admins
- User management interface
- Statistics and analytics
- Recent activity tracking

✅ **What You Need to Do:**
1. Update `role` field values in PocketBase to lowercase
2. Set default role to `job_seeker`
3. Promote your first admin user
4. Test the access control

✅ **Default Behavior:**
- New users → `job_seeker` role → `/dashboard`
- Admin users → `admin` role → `/dashboard/admin`
- Secure server-side protection

That's it! Your admin dashboard is ready to use. 🎉
