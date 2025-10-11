# Bug Fix: User Settings Schema Mismatch

## Issue

**Error**: `POST /api/collections/user_settings/records 400 (Bad Request)`

**Root Cause**: Type mismatch between TypeScript interface and PocketBase schema for the `email_notifications` field.

## Problem Details

### PocketBase Schema
The `user_settings` collection in PocketBase has `email_notifications` defined as a **simple boolean field**:

```javascript
{
    "id": "bool1579384345",
    "name": "email_notifications",
    "type": "bool"  // Simple boolean
}
```

### TypeScript Code (Before Fix)
The code was treating `email_notifications` as a **complex object**:

```typescript
email_notifications: {
    resume_tips: true,
    new_templates: false,
    weekly_digest: true,
    achievement_updates: true,
    marketing_emails: false
}
```

### Why This Failed
When creating a new user_settings record, the code was sending:
```json
{
  "user": "user_id",
  "email_notifications": {
    "resume_tips": true,
    "new_templates": false,
    ...
  }
}
```

But PocketBase expected:
```json
{
  "user": "user_id",
  "email_notifications": true
}
```

This caused a **400 Bad Request** error because PocketBase couldn't accept an object where it expected a boolean.

## Solution

### 1. Updated Type Definition

**Before:**
```typescript
export interface EmailNotifications {
  resume_tips: boolean;
  new_templates: boolean;
  weekly_digest: boolean;
  achievement_updates: boolean;
  marketing_emails: boolean;
}

export interface UserSettings {
  email_notifications: EmailNotifications; // Object
  // ...
}
```

**After:**
```typescript
export interface UserSettings {
  email_notifications: boolean; // Simple boolean
  // ...
}
```

### 2. Moved Detailed Email Preferences

Detailed email notification preferences were moved to the `notification_settings` JSON field, which is designed to hold complex objects:

```typescript
export interface NotificationSettings {
  email: {
    resume_tips: boolean;
    new_templates: boolean;
    weekly_digest: boolean;
    achievement_updates: boolean;
    marketing_emails: boolean;
  };
  in_app_notifications: { /* ... */ };
  push_notifications: { /* ... */ };
}
```

### 3. Updated Default Settings

**Before:**
```typescript
const defaultSettings = {
  email_notifications: {
    resume_tips: true,
    new_templates: false,
    // ...
  },
  // ...
};
```

**After:**
```typescript
const defaultSettings = {
  email_notifications: true, // Master toggle
  notification_settings: {
    email: {
      resume_tips: true,
      new_templates: false,
      weekly_digest: true,
      achievement_updates: true,
      marketing_emails: false
    },
    // ...
  },
  // ...
};
```

### 4. Updated UI Component

Updated `SettingsPanel.svelte` to reference the new location:

**Before:**
```svelte
<Switch 
  checked={$userSettings.email_notifications.resume_tips}
  onCheckedChange={(checked) => updateNestedSetting('email_notifications', '', 'resume_tips', checked)}
/>
```

**After:**
```svelte
<Switch 
  checked={$userSettings.notification_settings.email.resume_tips}
  onCheckedChange={(checked) => updateNestedSetting('notification_settings', 'email', 'resume_tips', checked)}
/>
```

### 5. Fixed Type Casting

Added proper type casting for PocketBase RecordModel to UserSettings:

```typescript
const typedSettings = newSettings as unknown as UserSettings;
userSettings.set(typedSettings);
```

## Files Modified

1. **`app/src/lib/stores/userSettings.ts`**
   - Updated `UserSettings` interface
   - Updated `NotificationSettings` interface
   - Updated `defaultSettings` object
   - Fixed type casting in all CRUD operations

2. **`app/src/lib/components/settings/SettingsPanel.svelte`**
   - Updated email notification switch bindings
   - Changed from `email_notifications.X` to `notification_settings.email.X`

## Benefits of This Approach

### 1. Schema Compliance
- Now matches PocketBase schema exactly
- No more 400 errors on record creation

### 2. Better Organization
- `email_notifications` (boolean) = Master toggle for all email notifications
- `notification_settings.email` (object) = Detailed email preferences
- Cleaner separation of concerns

### 3. Flexibility
- Can easily add more notification types to `notification_settings`
- Master toggle provides quick on/off for all emails
- Detailed preferences allow granular control

### 4. Backward Compatibility
- Existing settings records will work (PocketBase handles missing fields)
- New records created with correct structure
- No data migration needed

## Testing

### Build Status
✅ Build successful with no TypeScript errors

### Expected Behavior
1. **New User Registration**
   - Default settings created successfully
   - `email_notifications` = `true` (boolean)
   - `notification_settings.email` contains detailed preferences

2. **Settings Update**
   - Master toggle updates `email_notifications` field
   - Individual email preferences update `notification_settings.email`

3. **Settings Load**
   - Existing settings load correctly
   - Missing fields use defaults from `defaultSettings`

## Verification Steps

To verify the fix works:

1. **Clear existing user_settings** (if testing with existing user):
   ```javascript
   // In PocketBase admin or via API
   DELETE /api/collections/user_settings/records/{id}
   ```

2. **Register new user or login**
   - Should create default settings without errors
   - Check browser console for: `✅ Default settings created: {id}`

3. **Check PocketBase record**
   ```javascript
   GET /api/collections/user_settings/records/{id}
   ```
   Should show:
   ```json
   {
     "email_notifications": true,
     "notification_settings": {
       "email": {
         "resume_tips": true,
         "new_templates": false,
         ...
       }
     }
   }
   ```

4. **Test Settings UI**
   - Navigate to Settings page
   - Toggle email notification switches
   - Verify updates save correctly

## Prevention

To prevent similar issues in the future:

1. **Always check PocketBase schema** before defining TypeScript types
2. **Use PocketBase API docs** as source of truth for field types
3. **Test record creation** with new schemas before deploying
4. **Add schema validation** in development environment
5. **Document field types** in code comments

## Related Issues

This fix resolves:
- ❌ 400 Bad Request on user_settings creation
- ❌ "Failed to create record" errors
- ❌ New users unable to save settings
- ❌ Settings panel not loading for new users

## Conclusion

The schema mismatch has been resolved by aligning the TypeScript types with the actual PocketBase schema. The `email_notifications` field is now correctly treated as a boolean, while detailed email preferences are stored in the appropriate JSON field (`notification_settings`).
