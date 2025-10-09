# User Profiles Schema Update

## ✅ Correct Approach: Use `user_profiles` Collection

You're absolutely right! We should add the role and plan fields to `user_profiles` instead of `users`.

### Why This Is Better

1. **Separation of Concerns**
   - `users` = Authentication only (email, password, username)
   - `user_profiles` = Business logic (role, plan, profile data)

2. **Already Has Role Field**
   - You already have a `role` field in `user_profiles`
   - Just need to update its options

3. **Easier to Extend**
   - Don't touch core authentication
   - Add business fields without affecting auth

4. **Better Security**
   - Keep sensitive auth data separate
   - Profile data can have different access rules

5. **GDPR Compliance**
   - Easier to export/delete user data
   - Clear separation of PII

---

## 📋 Required Schema Changes

### Update `user_profiles` Collection

Add/modify these fields in PocketBase Admin UI:

```javascript
{
  // EXISTING FIELD - Update options
  "role": {
    "type": "select",
    "options": [
      "job_seeker",    // Default for new users
      "moderator",     // For content moderation
      "admin"          // Full system access
    ],
    "default": "job_seeker",
    "required": true
  },
  
  // NEW FIELDS - Add these
  "plan": {
    "type": "select",
    "options": ["free", "pro", "enterprise"],
    "default": "free",
    "required": true
  },
  
  "plan_expires": {
    "type": "date",
    "required": false,
    "description": "When the paid plan expires (null for free plan)"
  },
  
  "plan_payment_id": {
    "type": "text",
    "required": false,
    "max": 255,
    "description": "Reference to payment/subscription ID (Stripe, PayPal, etc.)"
  },
  
  "verified": {
    "type": "bool",
    "default": false,
    "description": "Email verification status"
  },
  
  "active": {
    "type": "bool",
    "default": true,
    "description": "Account active status (for banning/suspending)"
  },
  
  "last_login": {
    "type": "date",
    "required": false,
    "description": "Track user activity"
  }
}
```

---

## 🔧 How to Update in PocketBase Admin

1. **Open PocketBase Admin UI**
   ```
   http://localhost:8090/_/
   ```

2. **Navigate to Collections**
   - Click "Collections" in sidebar
   - Find and click "user_profiles"

3. **Update Existing `role` Field**
   - Click on the `role` field
   - Update options to: `job_seeker`, `moderator`, `admin`
   - Set default to `job_seeker`
   - Save

4. **Add New Fields**
   - Click "New field" button
   - Add each field from the schema above
   - Save after each field

5. **Test the Changes**
   - Create a test user
   - Verify profile is created with correct defaults

---

## 🔄 Updated Type Definition

```typescript
// app/src/lib/types/index.ts

export interface User {
  // From users collection (authentication)
  id: string;
  email: string;
  name: string;
  username: string;
  avatar?: string;
  created: string;
  updated: string;
}

export interface UserProfile {
  // From user_profiles collection (business logic)
  id: string;
  user: string; // Reference to users.id
  
  // Personal info
  first_name: string;
  last_name: string;
  phone?: string;
  location?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  
  // Career info
  target_industry?: string;
  experience_level?: string;
  target_job_titles?: string;
  key_skills?: string;
  career_stage?: string;
  
  // Role & Plan (NEW/UPDATED)
  role: 'job_seeker' | 'moderator' | 'admin';
  plan: 'free' | 'pro' | 'enterprise';
  plan_expires?: string;
  plan_payment_id?: string;
  verified: boolean;
  active: boolean;
  last_login?: string;
  
  // Profile completion
  profile_completed: boolean;
  profile_completed_at?: string;
  
  // Additional fields
  preferred_work_type?: string;
  salary_expectation_min?: number;
  salary_expectation_max?: number;
  education_level?: string;
  certifications?: string;
  willing_to_relocate?: boolean;
  template_preferences?: any;
  onboarding_data?: any;
  
  // Student/Entry-level specific
  academic_projects?: string;
  volunteer_experience?: string;
  extracurricular_activities?: string;
  personal_projects?: string;
  internships_completed?: string;
  technical_proficiencies?: string;
  soft_skills_examples?: string;
  achievements_awards?: string;
  relevant_coursework?: string;
  
  created: string;
  updated: string;
}

// Combined user data (for convenience)
export interface UserWithProfile extends User {
  profile?: UserProfile;
}
```

---

## 🔄 Updated Auth Store

```typescript
// app/src/lib/stores/auth.ts

// Update the register function
async register(email: string, password: string, name: string, username: string) {
  try {
    // 1. Create user (authentication only)
    const userData = {
      email,
      password,
      passwordConfirm: password,
      name,
      username
    };

    const user = await pb.collection('users').create(userData);
    
    // 2. Auto-login
    const authData = await pb.collection('users').authWithPassword(email, password);
    
    // 3. Create user profile with role and plan
    try {
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      await pb.collection('user_profiles').create({
        user: authData.record.id,
        first_name: firstName,
        last_name: lastName,
        role: 'job_seeker',  // Default role
        plan: 'free',        // Default plan
        verified: false,     // Requires email verification
        active: true,        // Account active by default
        profile_completed: false,
        onboarding_data: {
          registration_date: new Date().toISOString(),
          registration_source: 'web',
          initial_name: name
        }
      });
      
      console.log('✅ User profile created with role and plan');
    } catch (profileError) {
      console.warn('⚠️ Failed to create user profile:', profileError);
    }
    
    currentUser.set(convertToUser(authData.record));
    isAuthenticated.set(true);
    
    return { success: true, user: authData.record };
  } catch (error: any) {
    console.error('Registration error:', error);
    return { 
      success: false, 
      error: error.message || 'Registration failed' 
    };
  }
}

// Add function to load user with profile
async loadUserWithProfile(userId: string) {
  try {
    const user = await pb.collection('users').getOne(userId);
    const profiles = await pb.collection('user_profiles').getFullList({
      filter: `user = "${userId}"`
    });
    
    return {
      success: true,
      user,
      profile: profiles[0] || null
    };
  } catch (error: any) {
    console.error('Error loading user with profile:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
```

---

## 🔄 Updated Permissions System

```typescript
// app/src/lib/utils/permissions.ts

import type { UserProfile } from '$lib/types';

/**
 * Check if user has a specific permission
 * Now uses UserProfile instead of User
 */
export function hasPermission(profile: UserProfile | null, permission: Permission): boolean {
  if (!profile) return false;
  
  // Check role-based permissions
  const rolePermissions = ROLE_PERMISSIONS[profile.role as Role] || [];
  if (rolePermissions.includes(permission)) {
    return true;
  }
  
  // Check plan-based permissions (only if plan is active)
  if (isPlanActive(profile)) {
    const planPermissions = PLAN_PERMISSIONS[profile.plan] || [];
    if (planPermissions.includes(permission)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Check if user's plan is active
 */
export function isPlanActive(profile: UserProfile | null): boolean {
  if (!profile) return false;
  
  // Free plan is always active
  if (profile.plan === 'free') return true;
  
  // Check if plan has expired
  if (!profile.plan_expires) return false;
  
  const expiryDate = new Date(profile.plan_expires);
  const now = new Date();
  
  return expiryDate > now;
}

// Update all other functions to use UserProfile instead of User
```

---

## 🔄 Updated Plan Upgrade

```typescript
// app/src/lib/utils/plan-upgrade.ts

export async function upgradeToPro(
  userId: string,
  billingCycle: 'monthly' | 'yearly',
  paymentData?: any
): Promise<UpgradeResult> {
  try {
    // Calculate expiry date
    const expiryDate = new Date();
    if (billingCycle === 'monthly') {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    } else {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    }
    
    // Get user's profile
    const profiles = await pb.collection('user_profiles').getFullList({
      filter: `user = "${userId}"`
    });
    
    if (profiles.length === 0) {
      return { success: false, error: 'User profile not found' };
    }
    
    // Update profile with new plan
    const updatedProfile = await pb.collection('user_profiles').update(profiles[0].id, {
      plan: 'pro',
      plan_expires: expiryDate.toISOString(),
      plan_payment_id: paymentData?.paymentId || null
    });
    
    return { success: true, profile: updatedProfile };
  } catch (error: any) {
    console.error('Plan upgrade error:', error);
    return { 
      success: false, 
      error: error.message || 'Upgrade failed. Please try again.' 
    };
  }
}
```

---

## 🔄 Usage in Components

```svelte
<script>
  import { onMount } from 'svelte';
  import { pb } from '$lib/pocketbase';
  import { hasPermission, PERMISSIONS } from '$lib/utils/permissions';
  
  let userProfile = null;
  
  onMount(async () => {
    // Load user profile
    const userId = pb.authStore.model?.id;
    if (userId) {
      const profiles = await pb.collection('user_profiles').getFullList({
        filter: `user = "${userId}"`
      });
      userProfile = profiles[0] || null;
    }
  });
  
  $: canExportPDF = hasPermission(userProfile, PERMISSIONS.EXPORT_PDF);
  $: isAdmin = userProfile?.role === 'admin';
</script>

{#if canExportPDF}
  <button>Export PDF</button>
{:else}
  <button>Upgrade to Pro</button>
{/if}

{#if isAdmin}
  <a href="/admin">Admin Dashboard</a>
{/if}
```

---

## 🔄 Create User Profile Store

```typescript
// app/src/lib/stores/userProfile.ts (update existing)

import { writable } from 'svelte/store';
import { pb } from '$lib/pocketbase';
import type { UserProfile } from '$lib/types';

export const userProfile = writable<UserProfile | null>(null);

// Load profile when user logs in
export async function loadUserProfile(userId: string) {
  try {
    const profiles = await pb.collection('user_profiles').getFullList({
      filter: `user = "${userId}"`
    });
    
    if (profiles.length > 0) {
      userProfile.set(profiles[0]);
      return { success: true, profile: profiles[0] };
    }
    
    return { success: false, error: 'Profile not found' };
  } catch (error: any) {
    console.error('Error loading profile:', error);
    return { success: false, error: error.message };
  }
}

// Update profile
export async function updateUserProfile(profileId: string, data: Partial<UserProfile>) {
  try {
    const updated = await pb.collection('user_profiles').update(profileId, data);
    userProfile.set(updated);
    return { success: true, profile: updated };
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return { success: false, error: error.message };
  }
}

// Clear profile on logout
export function clearUserProfile() {
  userProfile.set(null);
}
```

---

## 📋 Migration Checklist

### 1. Update PocketBase Schema
- [ ] Open PocketBase Admin UI
- [ ] Update `role` field in `user_profiles`
- [ ] Add `plan` field
- [ ] Add `plan_expires` field
- [ ] Add `plan_payment_id` field
- [ ] Add `verified` field
- [ ] Add `active` field
- [ ] Add `last_login` field (optional)

### 2. Update Code
- [ ] Update type definitions
- [ ] Update auth store registration
- [ ] Update permissions system
- [ ] Update plan upgrade utilities
- [ ] Update components to use userProfile

### 3. Test
- [ ] Register new user → Check profile created with defaults
- [ ] Login → Check profile loads correctly
- [ ] Test permissions → Verify role/plan checks work
- [ ] Test plan upgrade → Verify expiry tracking works

### 4. Migrate Existing Users (if any)
```typescript
// Run this once to add defaults to existing profiles
const profiles = await pb.collection('user_profiles').getFullList();

for (const profile of profiles) {
  if (!profile.role) {
    await pb.collection('user_profiles').update(profile.id, {
      role: 'job_seeker',
      plan: 'free',
      verified: false,
      active: true
    });
  }
}
```

---

## ✅ Benefits of This Approach

1. **Clean Separation**
   - Auth data in `users`
   - Business data in `user_profiles`

2. **Already Structured**
   - You have `role` field
   - Just adding plan management

3. **Easier Access Control**
   - Different rules for auth vs profile
   - Can make profile public while keeping auth private

4. **Better Performance**
   - Don't load profile data on every auth check
   - Load profile only when needed

5. **Scalability**
   - Easy to add more profile fields
   - Won't affect authentication

---

## 🎯 Summary

**DO THIS:**
- ✅ Add fields to `user_profiles` collection
- ✅ Keep `users` collection for auth only
- ✅ Update code to use `userProfile` store

**DON'T DO THIS:**
- ❌ Add business logic fields to `users` collection
- ❌ Mix authentication and profile data

This is the correct, scalable approach! 🎉
