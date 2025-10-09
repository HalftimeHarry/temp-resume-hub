# Testing Admin Login - Quick Guide

## The Issue (Fixed)

When logging in as an admin, you were being redirected to `/admin/login` instead of `/dashboard/admin`.

## The Fix

Updated the login flow to check user role immediately after login and redirect accordingly:

```typescript
// After successful login
1. Check user_profiles for role
2. If role === 'admin' → redirect to /dashboard/admin
3. If role !== 'admin' → redirect to /dashboard
```

## How to Test

### 1. Clear Browser Cache & Cookies
```bash
# In browser DevTools (F12)
# Application tab → Clear storage → Clear site data
```

### 2. Logout (if logged in)
```
Visit /dashboard → Click logout
```

### 3. Login as Admin
```
1. Go to /auth/login
2. Enter your admin credentials
3. Click "Sign in"
```

### Expected Result
```
✅ Should redirect to: /dashboard/admin
✅ Should see: Admin Dashboard with statistics
✅ Should NOT see: /admin/login or any error
```

### 4. Test Job Seeker Login
```
1. Logout
2. Login with a job_seeker account
3. Should redirect to: /dashboard
4. Should see: Regular dashboard with resumes
```

## Troubleshooting

### Still redirecting to wrong page?

**Step 1: Check your role in PocketBase**
```
1. Open PocketBase Admin: http://localhost:8090/_/
2. Go to Collections → user_profiles
3. Find your user
4. Verify role is exactly: admin (lowercase)
```

**Step 2: Check browser console**
```
1. Open DevTools (F12)
2. Go to Console tab
3. Look for login debug messages:
   - "Login successful, checking user role"
   - "User is admin, redirecting to admin dashboard"
```

**Step 3: Clear everything and try again**
```bash
# Clear browser cache
# Clear cookies
# Close all tabs
# Open new incognito window
# Try login again
```

### Role is correct but still not working?

**Check if profile exists:**
```javascript
// In browser console after login
const userId = pb.authStore.model?.id;
const profiles = await pb.collection('user_profiles').getFullList({
  filter: `user = "${userId}"`
});
console.log('Profile:', profiles[0]);
console.log('Role:', profiles[0]?.role);
```

**Expected output:**
```javascript
Profile: {
  id: "...",
  user: "...",
  role: "admin",  // ← Should be exactly "admin"
  plan: "free",
  // ... other fields
}
Role: "admin"
```

### Getting "Access Denied" or redirected back to /dashboard?

This means the server-side check is working correctly, but your role might not be set properly.

**Fix:**
```
1. Go to PocketBase Admin
2. Collections → user_profiles
3. Find your user
4. Edit → Change role to: admin
5. Save
6. Logout and login again
```

## Common Issues

### Issue 1: Role is "Admin" instead of "admin"
**Problem:** Role values are case-sensitive
**Fix:** Update role field values in PocketBase to lowercase

### Issue 2: No profile exists
**Problem:** User was created before profile system
**Fix:** Create profile manually or re-register

### Issue 3: Multiple profiles for same user
**Problem:** Duplicate profiles
**Fix:** Delete duplicates, keep only one

### Issue 4: Cached redirect
**Problem:** Browser cached old redirect
**Fix:** Hard refresh (Ctrl+Shift+R) or clear cache

## Verification Checklist

After login, verify:

- [ ] URL is `/dashboard/admin` (for admins)
- [ ] URL is `/dashboard` (for job seekers)
- [ ] No console errors
- [ ] Page loads correctly
- [ ] Can see appropriate content
- [ ] Role badge shows correct role
- [ ] No redirect loops

## Success Indicators

**For Admin Users:**
```
✅ URL: /dashboard/admin
✅ Title: "Admin Dashboard"
✅ See: Statistics cards
✅ See: User management table
✅ See: Recent activity
✅ Badge: [Admin] in red
```

**For Job Seeker Users:**
```
✅ URL: /dashboard
✅ Title: "Dashboard"
✅ See: Resume cards
✅ See: Create resume button
✅ Badge: [Job Seeker] in blue
```

## Still Having Issues?

1. Check browser console for errors
2. Check PocketBase logs
3. Verify role value is exactly "admin" (lowercase)
4. Try in incognito/private window
5. Clear all site data and try again

## Quick Debug Script

Run this in browser console after login:

```javascript
// Check auth state
console.log('Auth valid:', pb.authStore.isValid);
console.log('User ID:', pb.authStore.model?.id);

// Check profile
const userId = pb.authStore.model?.id;
if (userId) {
  const profiles = await pb.collection('user_profiles').getFullList({
    filter: `user = "${userId}"`
  });
  console.log('Profile found:', profiles.length > 0);
  console.log('Role:', profiles[0]?.role);
  console.log('Plan:', profiles[0]?.plan);
  console.log('Full profile:', profiles[0]);
}

// Check current URL
console.log('Current URL:', window.location.href);
```

Expected output for admin:
```
Auth valid: true
User ID: "abc123..."
Profile found: true
Role: "admin"
Plan: "free"
Current URL: "http://localhost:5173/dashboard/admin"
```

---

## Summary

The login flow now:
1. ✅ Checks role immediately after login
2. ✅ Redirects admins to `/dashboard/admin`
3. ✅ Redirects job seekers to `/dashboard`
4. ✅ No more redirect loops
5. ✅ No more `/admin/login` errors

Just make sure your role is set to `admin` (lowercase) in PocketBase! 🎉
