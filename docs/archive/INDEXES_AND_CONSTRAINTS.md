# Recommended Indexes and Constraints for user_profiles

## Essential Indexes to Add

### 1. Unique Constraint on User Field (CRITICAL)
**Purpose**: Ensure each user can only have one profile
**Index**: 
```sql
CREATE UNIQUE INDEX `idx_unique_user_profile` ON `user_profiles` (`user`)
```

**Why needed**: Prevents duplicate profiles for the same user

### 2. Performance Index on User Field
**Purpose**: Fast lookups when loading user profiles
**Index**:
```sql
CREATE INDEX `idx_user_profiles_user` ON `user_profiles` (`user`)
```

**Why needed**: Your API rules filter by `user = @request.auth.id`, so this speeds up queries

### 3. Industry + Experience Index
**Purpose**: Fast recommendation queries
**Index**:
```sql
CREATE INDEX `idx_industry_experience` ON `user_profiles` (`target_industry`, `experience_level`)
```

**Why needed**: Template recommendations filter by these fields

### 4. Profile Completion Index
**Purpose**: Find incomplete profiles quickly
**Index**:
```sql
CREATE INDEX `idx_profile_completed` ON `user_profiles` (`profile_completed`)
```

**Why needed**: For analytics and onboarding flow optimization

## How to Add Indexes in PocketBase

### Method 1: Through Admin Interface
1. **Go to your user_profiles collection**
2. **Click on "Indexes" tab**
3. **Add each index one by one**

### Method 2: Copy-Paste Ready Indexes
Add these indexes in the PocketBase admin:

```sql
CREATE UNIQUE INDEX `idx_unique_user_profile` ON `user_profiles` (`user`)
```

```sql
CREATE INDEX `idx_user_profiles_user` ON `user_profiles` (`user`)
```

```sql
CREATE INDEX `idx_industry_experience` ON `user_profiles` (`target_industry`, `experience_level`)
```

```sql
CREATE INDEX `idx_profile_completed` ON `user_profiles` (`profile_completed`)
```

```sql
CREATE INDEX `idx_created_profiles` ON `user_profiles` (`created`)
```

## Priority Order

### High Priority (Add First):
1. **Unique user constraint** - Prevents data integrity issues
2. **User index** - Essential for performance with your API rules

### Medium Priority:
3. **Industry + experience index** - Improves recommendation performance
4. **Profile completion index** - Useful for analytics

### Low Priority:
5. **Created date index** - Nice for admin queries

## Expected Benefits

### Performance Improvements:
- ✅ **Faster profile loading** (user index)
- ✅ **Faster recommendations** (industry/experience index)
- ✅ **Better admin queries** (completion/date indexes)

### Data Integrity:
- ✅ **No duplicate profiles** (unique user constraint)
- ✅ **Consistent data structure**

### Scalability:
- ✅ **Handles more users efficiently**
- ✅ **Faster as database grows**

## Verification

After adding indexes:

### Test Performance:
1. **Create several test profiles**
2. **Test profile loading speed**
3. **Test recommendation generation**
4. **Check admin query performance**

### Test Constraints:
1. **Try creating duplicate profile** (should fail)
2. **Verify existing profiles still work**
3. **Test profile updates**

## Index Monitoring

### In PocketBase Admin:
- Check query performance in logs
- Monitor database size
- Watch for slow queries

### Expected Index Usage:
- User lookups: Uses user index
- Recommendations: Uses industry/experience index
- Admin queries: Uses completion/date indexes

## Troubleshooting

### If unique constraint fails:
- Check for existing duplicate profiles
- Clean up duplicates before adding constraint
- Verify user field is properly set

### If indexes slow down writes:
- This is normal - indexes trade write speed for read speed
- Profile updates are infrequent, so this is acceptable

### If indexes don't improve performance:
- Check that queries are actually using the indexes
- Verify index syntax is correct
- Monitor PocketBase query logs

## Recommended Final Index Set

For optimal performance and data integrity:

```sql
-- Essential for data integrity
CREATE UNIQUE INDEX `idx_unique_user_profile` ON `user_profiles` (`user`);

-- Essential for performance  
CREATE INDEX `idx_user_profiles_user` ON `user_profiles` (`user`);

-- Improves recommendations
CREATE INDEX `idx_industry_experience` ON `user_profiles` (`target_industry`, `experience_level`);

-- Useful for analytics
CREATE INDEX `idx_profile_completed` ON `user_profiles` (`profile_completed`);

-- Admin convenience
CREATE INDEX `idx_created_profiles` ON `user_profiles` (`created`);
```

## Impact on Your Application

### Immediate Benefits:
- Faster profile loading
- Better data integrity
- Improved recommendation performance

### Long-term Benefits:
- Scales better with more users
- Prevents data corruption
- Better admin experience

The unique user constraint is the most critical - it prevents users from having multiple profiles, which could break your application logic.