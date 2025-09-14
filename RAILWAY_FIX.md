# 🔧 Fix Railway Deployment Issue

## 🚨 Problem
Railway is using Nixpacks and looking at root directory instead of `backend` directory with Dockerfile.

## ✅ Solution Steps

### Step 1: Configure Service Root Directory
1. **In Railway Dashboard**:
   - Go to your service
   - Click **"Settings"**
   - Scroll to **"Source"** section
   - Set **"Root Directory"** to: `backend`
   - Click **"Update"**

### Step 2: Force Docker Build
1. **In Railway Dashboard**:
   - Go to **"Settings"** → **"Build"**
   - Set **"Builder"** to: **"Dockerfile"**
   - Set **"Dockerfile Path"** to: `Dockerfile` (relative to backend directory)
   - Click **"Update"**

### Step 3: Redeploy
1. **Click "Deploy"** button
2. **Or trigger new deployment**:
   - Go to **"Deployments"** tab
   - Click **"Redeploy"** on latest deployment

## 🎯 Alternative: Create New Service

If settings don't work, create a new service:

### Option A: Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy from backend directory
cd backend
railway up
```

### Option B: Manual Service Creation
1. **Delete current service** (if needed)
2. **Create new project**
3. **Connect GitHub repo**
4. **During setup**:
   - Set **Root Directory**: `backend`
   - Set **Builder**: `Dockerfile`

## 🔍 Verify Configuration

After fixing, Railway should show:
```
Service Settings:
├── Root Directory: backend ✅
├── Builder: Dockerfile ✅
├── Dockerfile Path: Dockerfile ✅
└── Environment Variables: ✅
```

## 📋 Expected Build Process

Railway should now:
1. ✅ Look in `backend/` directory
2. ✅ Find `Dockerfile`
3. ✅ Use Docker build (not Nixpacks)
4. ✅ Download PocketBase
5. ✅ Copy hooks and migrations
6. ✅ Start PocketBase server

## 🚀 Quick Fix Commands

If you have Railway CLI:
```bash
# Navigate to backend
cd backend

# Deploy directly
railway up

# Or link to existing project
railway link [your-project-id]
railway deploy
```

## ⚠️ Common Issues

### Issue: "No Dockerfile found"
**Solution**: Verify `backend/Dockerfile` exists and Railway root directory is set to `backend`

### Issue: "Build still uses Nixpacks"
**Solution**: Explicitly set builder to "Dockerfile" in Railway settings

### Issue: "Permission denied"
**Solution**: Check Railway token permissions and project access

## 📞 Railway Support

If issues persist:
1. **Railway Discord**: Get help from community
2. **Railway Docs**: [docs.railway.app](https://docs.railway.app)
3. **GitHub Issues**: [github.com/railwayapp/railway](https://github.com/railwayapp/railway)

## 🎯 Success Indicators

When fixed, you should see:
- [ ] ✅ Build uses Docker (not Nixpacks)
- [ ] ✅ Finds Dockerfile in backend directory
- [ ] ✅ Downloads PocketBase successfully
- [ ] ✅ Service starts on port 8080
- [ ] ✅ Health endpoint responds