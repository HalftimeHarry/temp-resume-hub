# 🔐 Admin Access Verification Guide

## 👤 Admin Credentials
- **Email**: `ddinsmore8@gmail.com`
- **Password**: `MADcap(123)`

## 🎯 Verification Steps

### Step 1: Access Admin Panel
1. **URL**: `https://your-railway-url/_/`
2. **Login with your credentials**
3. **Should see PocketBase admin dashboard**

### Step 2: Verify Collections
After login, you should see:
- **users** collection (auth type)
- **resumes** collection (base type)
- **Settings** panel
- **Logs** section

### Step 3: Test Admin Functions

#### Create Test User:
1. **Go to Collections → users**
2. **Click "New record"**
3. **Fill in**:
   ```
   email: test@example.com
   password: testpass123
   passwordConfirm: testpass123
   name: Test User
   ```
4. **Save record**

#### Verify Database Schema:
1. **Check users collection fields**:
   - id (text, system)
   - email (email, required)
   - password (password, required)
   - name (text, optional)
   - avatar (file, optional)

2. **Check resumes collection fields**:
   - id (text, system)
   - title (text, required)
   - user (relation to users)
   - content (json)
   - template (text)
   - is_public (bool)
   - slug (text, unique)

### Step 4: API Access Test

#### Test Authentication API:
```bash
# Test user login
curl -X POST https://your-railway-url/api/collections/users/auth-with-password \
  -H "Content-Type: application/json" \
  -d '{
    "identity": "test@example.com",
    "password": "testpass123"
  }'
```

**Expected Response:**
```json
{
  "token": "jwt-token-here",
  "record": {
    "id": "user-id",
    "email": "test@example.com",
    "name": "Test User",
    "created": "timestamp",
    "updated": "timestamp"
  }
}
```

#### Test Collections API:
```bash
# Get users (should require auth)
curl https://your-railway-url/api/collections/users/records

# Get resumes (should require auth)  
curl https://your-railway-url/api/collections/resumes/records
```

## 🔧 Admin Panel Features

### Dashboard Overview:
- **Collections**: Manage data tables
- **Logs**: View application logs
- **Settings**: Configure app settings
- **Admins**: Manage admin users

### Collections Management:
- **View Records**: Browse all data
- **Create Records**: Add new entries
- **Edit Records**: Modify existing data
- **Delete Records**: Remove data
- **Import/Export**: Backup and restore

### Settings Configuration:
- **App Settings**: General configuration
- **Mail Settings**: Email configuration
- **S3 Settings**: File storage
- **Backups**: Database backups

## 🚨 Security Checklist

### Admin Security:
- [ ] ✅ Admin password is strong
- [ ] ✅ Admin email is accessible
- [ ] ✅ HTTPS is enabled
- [ ] ✅ Admin panel is not publicly indexed

### API Security:
- [ ] ✅ CORS is properly configured
- [ ] ✅ Authentication is required for sensitive endpoints
- [ ] ✅ Rate limiting is in place (PocketBase default)
- [ ] ✅ Input validation is active

### Data Security:
- [ ] ✅ User passwords are hashed
- [ ] ✅ JWT tokens have expiration
- [ ] ✅ File uploads are restricted
- [ ] ✅ Database backups are enabled

## 🔄 Common Admin Tasks

### User Management:
```javascript
// In admin panel console
// Create user programmatically
const user = new Record($app.dao().findCollectionByNameOrId("users"))
user.set("email", "newuser@example.com")
user.set("password", "securepass123")
user.set("name", "New User")
$app.dao().saveRecord(user)
```

### Collection Rules:
```javascript
// Users collection rules (already configured)
listRule: "id = @request.auth.id"
viewRule: "id = @request.auth.id" 
createRule: ""
updateRule: "id = @request.auth.id"
deleteRule: "id = @request.auth.id"

// Resumes collection rules (already configured)
listRule: "user = @request.auth.id || is_public = true"
viewRule: "user = @request.auth.id || is_public = true"
createRule: "user = @request.auth.id"
updateRule: "user = @request.auth.id"
deleteRule: "user = @request.auth.id"
```

## 📊 Monitoring

### Health Monitoring:
- **Health Endpoint**: `/api/health`
- **Admin Panel**: `/_/`
- **Logs**: Real-time in admin panel
- **Metrics**: Railway dashboard

### Performance Metrics:
- **Response Time**: < 200ms for API calls
- **Uptime**: 99.9% target
- **Memory Usage**: Monitor in Railway
- **Database Size**: Check in admin panel

## 🆘 Troubleshooting

### Can't Access Admin Panel:
1. **Check URL**: Ensure `/_/` path is correct
2. **Verify Credentials**: Double-check email/password
3. **Check Logs**: Look for authentication errors
4. **Reset Admin**: Use Railway console if needed

### Admin Login Fails:
1. **Verify Admin Creation**: Check startup logs
2. **Password Issues**: Ensure special characters are handled
3. **Email Case**: Try lowercase email
4. **Clear Browser**: Clear cookies and cache

### Database Issues:
1. **Check Migrations**: Verify schema was created
2. **Permissions**: Ensure proper file permissions
3. **Storage**: Check Railway volume status
4. **Backups**: Restore from backup if needed

## 🎉 Success Indicators

When everything is working:
- [ ] ✅ Admin panel loads without errors
- [ ] ✅ Can login with `ddinsmore8@gmail.com`
- [ ] ✅ Collections are visible and accessible
- [ ] ✅ Can create/edit/delete records
- [ ] ✅ API endpoints respond correctly
- [ ] ✅ Authentication works for test users
- [ ] ✅ CORS allows frontend connections

## 📞 Support Contacts

### PocketBase Admin Issues:
- **Documentation**: [pocketbase.io/docs/admin-ui](https://pocketbase.io/docs/admin-ui)
- **GitHub Issues**: [github.com/pocketbase/pocketbase/issues](https://github.com/pocketbase/pocketbase/issues)

### Railway Platform Issues:
- **Support**: [railway.app/help](https://railway.app/help)
- **Discord**: Railway community
- **Documentation**: [docs.railway.app](https://docs.railway.app)