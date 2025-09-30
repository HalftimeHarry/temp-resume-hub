# Backend Documentation

## PocketBase Setup

### Installation & Running
```bash
cd backend
./pocketbase serve --http=0.0.0.0:8090
```

### Admin Access
- **URL**: http://localhost:8090/_/
- **First Run**: Create admin account
- **Collections**: Manage data schemas
- **API Rules**: Configure permissions

## Database Schema

### Core Collections

#### users (Built-in)
- Authentication and basic user data
- Email, username, avatar
- Managed by PocketBase auth

#### user_profiles
```javascript
{
  id: "string",
  user: "relation(users)",
  full_name: "string",
  phone: "string", 
  location: "string",
  portfolio_url: "string",
  linkedin_url: "string",
  github_url: "string",
  professional_summary: "text",
  target_industry: "string",
  experience_level: "string",
  target_job_titles: "string",
  career_stage: "string",
  key_skills: "string",
  education_level: "string",
  preferred_work_type: "json",
  work_experience: "json",
  education: "json",
  created: "datetime",
  updated: "datetime"
}
```

#### user_settings  
```javascript
{
  id: "string",
  user: "relation(users)",
  email_notifications: "bool",
  analytics_enabled: "bool", 
  public_profile: "bool",
  builder_preferences: "json",
  template_preferences: "json",
  ai_assistance_enabled: "bool",
  privacy_settings: "json",
  notification_settings: "json",
  appearance_settings: "json",
  created: "datetime",
  updated: "datetime"
}
```

#### resumes
```javascript
{
  id: "string",
  user: "relation(users)",
  title: "string",
  content: "json",
  template: "string",
  settings: "json", 
  is_published: "bool",
  published_url: "string",
  created: "datetime",
  updated: "datetime"
}
```

#### templates
```javascript
{
  id: "string",
  name: "string",
  description: "text",
  thumbnail: "file",
  category: "string",
  settings: "json",
  starterData: "json",
  is_active: "bool",
  created: "datetime",
  updated: "datetime"
}
```

## API Rules & Permissions

### Security Model
- **Authentication**: Required for all user data
- **Authorization**: Users can only access their own data
- **Public Access**: Templates and published resumes only

### Collection Rules

#### user_profiles
```javascript
// List/Search: @request.auth.id != ""
// View: @request.auth.id = user.id  
// Create: @request.auth.id != "" && @request.auth.id = user.id
// Update: @request.auth.id = user.id
// Delete: @request.auth.id = user.id
```

#### resumes
```javascript
// List: @request.auth.id = user.id
// View: @request.auth.id = user.id || is_published = true
// Create: @request.auth.id != "" && @request.auth.id = user.id  
// Update: @request.auth.id = user.id
// Delete: @request.auth.id = user.id
```

## Production Setup

### Environment Configuration
```bash
# Production environment variables
PB_ENCRYPTION_KEY=your-32-char-key
PUBLIC_POCKETBASE_URL=https://your-domain.com
```

### Deployment Checklist
- [ ] Set encryption key
- [ ] Configure CORS settings
- [ ] Set up SSL/TLS
- [ ] Configure file storage
- [ ] Set up backups
- [ ] Configure email settings
- [ ] Test API rules

### Backup Strategy
```bash
# Manual backup
cp -r pb_data pb_data_backup_$(date +%Y%m%d)

# Automated backup (add to cron)
0 2 * * * cd /path/to/backend && cp -r pb_data pb_data_backup_$(date +\%Y\%m\%d)
```

## Troubleshooting

### Common Issues

#### CORS Errors
1. Check PocketBase admin settings
2. Verify allowed origins
3. Ensure proper headers

#### Migration Failures  
1. Check migration syntax
2. Verify collection dependencies
3. Review field types and constraints

#### Performance Issues
1. Add database indexes
2. Optimize API rules
3. Implement pagination
4. Use proper relations

### Debugging Tools
- **Logs**: PocketBase console output
- **Admin UI**: Real-time data inspection  
- **API Explorer**: Test endpoints directly
- **Network Tab**: Monitor API calls

### Reset Database (Development Only)
```bash
# ⚠️ WARNING: This deletes all data
rm -rf pb_data
./pocketbase serve
# Recreate admin account and collections
```