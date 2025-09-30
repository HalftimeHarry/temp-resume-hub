# PocketBase Troubleshooting Guide

## Current Issue
PocketBase is failing to start with: `SQL logic error: no such table: _admins`

## Solutions to Try

### Option 1: Fresh PocketBase Installation
```bash
cd backend
# Download fresh PocketBase
wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.20/pocketbase_0.22.20_linux_amd64.zip
unzip pocketbase_0.22.20_linux_amd64.zip
chmod +x pocketbase

# Remove old data
rm -rf pb_data/

# Start fresh
./pocketbase serve --http=0.0.0.0:8090
```

### Option 2: Use Different Port
```bash
cd backend
./pocketbase serve --http=0.0.0.0:8091
```
Then update `app/src/lib/config.ts`:
```typescript
export const POCKETBASE_URL = PUBLIC_POCKETBASE_URL || 'http://localhost:8091';
```

### Option 3: Manual Database Initialization
```bash
cd backend
# Create admin manually
./pocketbase admin create admin@example.com admin123456
# Then start server
./pocketbase serve --http=0.0.0.0:8090
```

### Option 4: Use Gitpod Port Forwarding
If running in Gitpod, the port might need to be exposed:
1. Go to Gitpod ports tab
2. Add port 8090
3. Set visibility to public
4. Access via the provided URL

## Alternative: Use Existing Collections
If you have existing collections working, you can:
1. Export current schema: Collections → Export
2. Add user_profiles to the export
3. Import the updated schema

## Testing Connection
```bash
# Test if PocketBase is running
curl http://localhost:8090/api/health

# Test admin access
curl http://localhost:8090/_/
```

## Admin Interface Access
Once running, access:
- Local: `http://localhost:8090/_/`
- Gitpod: Use the port forwarding URL + `/_/`

## Default Admin Credentials
- Email: `ddinsmore8@gmail.com` (or admin@example.com)
- Password: Check console output when starting PocketBase

## If All Else Fails
You can:
1. Use the existing collections for now
2. Add user profile fields to the users collection directly
3. Set up PocketBase on a different environment
4. Use a cloud PocketBase instance

The application will work with mock data for testing even without the user_profiles collection.