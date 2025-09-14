# 🚀 GitHub Actions Setup for Automated Deployment

## 📋 Overview
Set up automated deployment using GitHub Actions to deploy your backend to Railway and frontend to Netlify.

## 🔐 Step 1: Add GitHub Secrets

### Go to GitHub Repository Settings:
1. **Navigate to**: https://github.com/HalftimeHarry/temp-resume-hub/settings/secrets/actions
2. **Click "New repository secret"**
3. **Add these secrets one by one**:

### Required Secrets:

#### Railway Backend:
```
Name: RAILWAY_TOKEN
Value: 53da0c89-bc1b-4f30-ab46-a82dd3416f3d
```

#### PocketBase Configuration:
```
Name: PUBLIC_POCKETBASE_URL
Value: https://api.digitalresumehub.com
```

#### Optional (for Netlify frontend deployment):
```
Name: NETLIFY_AUTH_TOKEN
Value: [get from netlify.com/user/applications]

Name: NETLIFY_SITE_ID  
Value: [get from netlify site settings]
```

## 🎯 Step 2: Trigger Deployment

### Option A: Push to Main Branch
```bash
# Commit your changes
git add .
git commit -m "Set up GitHub Actions for automated deployment"
git push origin main
```

### Option B: Manual Trigger
1. **Go to**: https://github.com/HalftimeHarry/temp-resume-hub/actions
2. **Click "Deploy Full Stack Application"**
3. **Click "Run workflow"**
4. **Select branch: main**
5. **Click "Run workflow"**

## 📊 Step 3: Monitor Deployment

### Watch the Action:
1. **Go to**: https://github.com/HalftimeHarry/temp-resume-hub/actions
2. **Click on the running workflow**
3. **Monitor each job**:
   - ✅ Deploy Backend to Railway
   - ✅ Deploy Frontend to Netlify (if configured)

### Expected Output:
```
✅ Backend deployed to Railway
✅ Health check passed
✅ Admin panel accessible
✅ Frontend built successfully
✅ Deployed to production
```

## 🔍 Step 4: Verify Deployment

### Backend Verification:
```bash
# Health check (replace with your Railway URL)
curl https://your-railway-url/api/health

# Admin panel
# Visit: https://your-railway-url/_/
# Login: ddinsmore8@gmail.com / MADcap(123)
```

### Frontend Verification:
```bash
# If deployed to Netlify
curl https://digitalresumehub.com

# Check if it can connect to backend
# Open browser dev tools and check network requests
```

## ⚙️ Workflow Features

### Automatic Triggers:
- ✅ **Push to main branch**: Deploys both backend and frontend
- ✅ **Backend changes**: Only deploys backend when `backend/` files change
- ✅ **Manual trigger**: Run deployment anytime via GitHub UI

### Smart Deployment:
- ✅ **Backend first**: Ensures API is available before frontend
- ✅ **Health checks**: Verifies backend is working
- ✅ **Environment variables**: Automatically configured
- ✅ **Error handling**: Stops if backend deployment fails

### Deployment Outputs:
- ✅ **Railway URL**: Shows where backend is deployed
- ✅ **Build logs**: Detailed information about each step
- ✅ **Test results**: Health check and connectivity tests

## 🚨 Troubleshooting

### Action Fails - Railway Token:
- **Check**: Token is correctly added to GitHub secrets
- **Verify**: Token has correct permissions in Railway
- **Test**: Token works with Railway CLI locally

### Action Fails - Build:
- **Check**: Dockerfile is in repository root
- **Verify**: Backend directory has all required files
- **Review**: Build logs for specific error messages

### Backend Deploys but Health Check Fails:
- **Wait**: Give container 30-60 seconds to start
- **Check**: Railway application logs
- **Verify**: Environment variables are set correctly

### Frontend Build Fails:
- **Check**: Node.js version compatibility
- **Verify**: All dependencies are in package.json
- **Review**: Build logs for missing packages

## 📈 Advanced Configuration

### Custom Environment Variables:
Add to GitHub secrets and reference in workflow:
```yaml
env:
  CUSTOM_VAR: ${{ secrets.CUSTOM_VAR }}
```

### Multiple Environments:
Create separate workflows for staging/production:
```yaml
# .github/workflows/deploy-staging.yml
on:
  push:
    branches: [develop]
```

### Slack/Discord Notifications:
Add notification steps to workflow:
```yaml
- name: Notify on success
  if: success()
  run: echo "Deployment successful!"
```

## 🎯 Success Indicators

When everything works:
- [ ] ✅ GitHub Action completes without errors
- [ ] ✅ Railway shows new deployment
- [ ] ✅ Backend health check passes
- [ ] ✅ Admin panel accessible with your credentials
- [ ] ✅ Frontend builds and deploys (if Netlify configured)
- [ ] ✅ Full application works end-to-end

## 🔄 Next Steps

After successful automated deployment:
1. ✅ **Add custom domain**: `api.digitalresumehub.com` in Railway
2. ✅ **Configure DNS**: Update Bluehost with CNAME
3. ✅ **Set up Netlify**: For frontend deployment
4. ✅ **Test full flow**: User registration → resume creation → sharing

## 📞 Support

### GitHub Actions Issues:
- **Docs**: [docs.github.com/actions](https://docs.github.com/actions)
- **Community**: [github.community](https://github.community)

### Railway Issues:
- **CLI Docs**: [docs.railway.app/develop/cli](https://docs.railway.app/develop/cli)
- **Discord**: Railway community

## 🚀 Quick Start Commands

```bash
# 1. Add secrets to GitHub (web interface)
# 2. Commit and push
git add .github/workflows/
git commit -m "Add GitHub Actions for automated deployment"
git push origin main

# 3. Watch deployment
# Visit: https://github.com/HalftimeHarry/temp-resume-hub/actions

# 4. Test result
curl https://your-railway-url/api/health
```

Your automated deployment pipeline is ready! 🎉