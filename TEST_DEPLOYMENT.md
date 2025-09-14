# 🧪 Test Backend Deployment

## 📋 Pre-Deployment Checklist

- [x] Environment files created with admin credentials
- [x] PocketBase hooks configured for auto-admin setup
- [x] Dockerfile updated with health checks
- [x] Railway configuration ready
- [x] CORS configured for your domains

## 🚀 Deploy to Railway

### Step 1: Commit and Push Changes
```bash
# Add all backend changes
git add backend/
git add RAILWAY_DEPLOY_STEPS.md
git add TEST_DEPLOYMENT.md

# Commit changes
git commit -m "Configure PocketBase backend for Railway deployment

- Add admin auto-setup with ddinsmore8@gmail.com
- Configure environment variables
- Update Dockerfile with health checks
- Add CORS for digitalresumehub.com
- Ready for Railway deployment"

# Push to GitHub
git push origin main
```

### Step 2: Deploy on Railway
1. **Go to [railway.app](https://railway.app)**
2. **Login/Signup**
3. **Click "Start a New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository**
6. **Railway will auto-detect the backend service**

### Step 3: Configure Railway Service
1. **Set Root Directory**: `backend`
2. **Verify Environment Variables**:
   ```
   PORT=8080
   ADMIN_EMAIL=ddinsmore8@gmail.com
   ADMIN_PASSWORD=MADcap(123)
   ```
3. **Deploy and wait for build**

## ✅ Testing Checklist

### 1. Health Check Test
```bash
# Replace with your Railway URL
curl https://your-app-production.up.railway.app/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Digital Resume Hub API is running",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "version": "1.0.0",
  "admin_configured": true
}
```

### 2. Admin Panel Access
1. **Visit**: `https://your-app-production.up.railway.app/_/`
2. **Login with**:
   - Email: `ddinsmore8@gmail.com`
   - Password: `MADcap(123)`
3. **Should see PocketBase admin dashboard**

### 3. API Endpoints Test
```bash
# Test collections endpoint
curl https://your-app-production.up.railway.app/api/collections

# Test users collection
curl https://your-app-production.up.railway.app/api/collections/users/records
```

### 4. CORS Test
```bash
# Test CORS headers
curl -H "Origin: https://digitalresumehub.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://your-app-production.up.railway.app/api/collections/users/records
```

**Expected Headers:**
```
Access-Control-Allow-Origin: https://digitalresumehub.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## 🔧 Troubleshooting

### Build Fails
**Check Railway build logs for:**
- Dockerfile syntax errors
- Missing files in backend directory
- Network issues downloading PocketBase

**Solutions:**
```bash
# Test Dockerfile locally
cd backend
docker build -t test-pb .
docker run -p 8080:8080 test-pb
```

### Service Won't Start
**Check Railway application logs for:**
- Port binding issues
- Permission errors
- PocketBase startup errors

**Common Issues:**
- PORT environment variable not set
- PocketBase binary not executable
- Missing directories

### Admin Not Created
**Check logs for admin creation:**
- Look for "Creating admin user" message
- Verify environment variables are set
- Check if admin already exists

**Manual Admin Creation:**
1. Access Railway service shell (if available)
2. Or recreate admin via API after startup

### Health Check Fails
**Verify:**
- Service is running on correct port
- Health endpoint is accessible
- No firewall blocking requests

## 📊 Expected Railway Dashboard

After successful deployment:

```
Project: temp-resume-hub
├── Service: backend
│   ├── Status: ✅ Running
│   ├── URL: https://your-app-production.up.railway.app
│   ├── Environment Variables: ✅ 5 variables
│   ├── Build Logs: ✅ Success
│   ├── Application Logs: ✅ Running
│   └── Metrics: CPU, Memory, Network
```

## 🎯 Success Indicators

- [ ] ✅ Build completes without errors
- [ ] ✅ Service starts and stays running  
- [ ] ✅ Health endpoint returns 200 OK
- [ ] ✅ Admin panel loads at `/_/`
- [ ] ✅ Can login with `ddinsmore8@gmail.com`
- [ ] ✅ PocketBase collections are accessible
- [ ] ✅ CORS headers are present

## 🌐 Next Steps After Success

1. **Add Custom Domain**:
   ```
   Domain: api.digitalresumehub.com
   CNAME: your-app-production.up.railway.app
   ```

2. **Update Bluehost DNS**:
   ```
   Type: CNAME
   Name: api
   Value: your-app-production.up.railway.app
   ```

3. **Test Custom Domain**:
   ```bash
   curl https://api.digitalresumehub.com/api/health
   ```

4. **Deploy Frontend**:
   - Update environment variables
   - Point to `https://api.digitalresumehub.com`

## 📞 Support

### Railway Issues:
- **Dashboard**: [railway.app/dashboard](https://railway.app/dashboard)
- **Docs**: [docs.railway.app](https://docs.railway.app)
- **Discord**: Railway community

### PocketBase Issues:
- **Docs**: [pocketbase.io/docs](https://pocketbase.io/docs)
- **GitHub**: [github.com/pocketbase/pocketbase](https://github.com/pocketbase/pocketbase)

## 🔄 Deployment Commands Summary

```bash
# 1. Commit changes
git add . && git commit -m "Backend ready for Railway"

# 2. Push to GitHub  
git push origin main

# 3. Deploy on Railway (web interface)
# - Connect GitHub repo
# - Set root directory: backend
# - Deploy

# 4. Test deployment
curl https://your-railway-url/api/health

# 5. Access admin panel
# Visit: https://your-railway-url/_/
# Login: ddinsmore8@gmail.com / MADcap(123)
```