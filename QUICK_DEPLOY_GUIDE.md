# ⚡ Quick Deploy Guide - GitHub Actions

## 🎯 Deploy Your Backend in 5 Minutes

### Step 1: Add Railway Token to GitHub (2 minutes)

1. **Go to**: https://github.com/HalftimeHarry/temp-resume-hub/settings/secrets/actions
2. **Click "New repository secret"**
3. **Add**:
   ```
   Name: RAILWAY_TOKEN
   Value: 53da0c89-bc1b-4f30-ab46-a82dd3416f3d
   ```
4. **Click "Add secret"**

### Step 2: Commit GitHub Actions (1 minute)

```bash
# Add the workflow files
git add .github/workflows/
git add GITHUB_ACTIONS_SETUP.md QUICK_DEPLOY_GUIDE.md

# Commit
git commit -m "🚀 Add GitHub Actions for Railway deployment

- Manual deploy workflow for testing
- Full stack deployment workflow  
- Automated backend deployment to Railway
- Health checks and verification"

# Push to GitHub
git push origin main
```

### Step 3: Trigger Manual Deployment (2 minutes)

1. **Go to**: https://github.com/HalftimeHarry/temp-resume-hub/actions
2. **Click "Manual Deploy to Railway"**
3. **Click "Run workflow"**
4. **Select**:
   - Branch: `main`
   - Environment: `production`
5. **Click "Run workflow"**

## 📊 Watch the Deployment

### Monitor Progress:
1. **Click on the running workflow**
2. **Watch each step**:
   - ✅ Checkout code
   - ✅ Install Railway CLI
   - ✅ Deploy to Railway
   - ✅ Test health endpoint
   - ✅ Deployment summary

### Expected Output:
```
🚂 Deploying to Railway...
✅ Logged in to Railway
🚀 Starting deployment...
✅ Deployment initiated
⏳ Waiting for deployment to complete...
📊 Checking deployment status...
🔍 Testing health endpoint
✅ Health check passed!
🔗 Admin panel: https://your-app.railway.app/_/
👤 Login: ddinsmore8@gmail.com / MADcap(123)
```

## 🎉 Success Indicators

When deployment works:
- [ ] ✅ GitHub Action completes without errors
- [ ] ✅ Railway shows new deployment in dashboard
- [ ] ✅ Health endpoint returns 200 OK
- [ ] ✅ Admin panel accessible
- [ ] ✅ Can login with your credentials

## 🔗 Test Your Deployment

### From GitHub Action Output:
Look for the Railway URL in the action logs, then test:

```bash
# Replace with your actual Railway URL
curl https://your-app.railway.app/api/health

# Should return:
{
  "status": "ok",
  "message": "Digital Resume Hub API is running",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "version": "1.0.0",
  "admin_configured": true
}
```

### Admin Panel Access:
1. **Visit**: `https://your-app.railway.app/_/`
2. **Login**: `ddinsmore8@gmail.com` / `MADcap(123)`
3. **Verify**: Collections (users, resumes) are visible

## 🌐 Add Custom Domain (Optional)

After successful deployment:

### In Railway Dashboard:
1. **Go to your service**
2. **Settings → Domains**
3. **Add Custom Domain**: `api.digitalresumehub.com`

### In Bluehost DNS:
```
Type: CNAME
Name: api
Value: your-app.railway.app
TTL: 300
```

## 🚨 Troubleshooting

### Action Fails - "railway command not found":
- **Solution**: Railway CLI installation failed, check logs

### Action Fails - "Invalid token":
- **Solution**: Verify Railway token in GitHub secrets

### Action Succeeds but Health Check Fails:
- **Solution**: Wait longer for container startup, check Railway logs

### Can't Access Admin Panel:
- **Solution**: Verify Railway URL, check container logs

## 🔄 Automatic Deployments

After manual deployment works, automatic deployments will trigger on:
- ✅ **Push to main branch**: Full deployment
- ✅ **Backend changes**: Backend-only deployment
- ✅ **Manual trigger**: Anytime via GitHub UI

## 📋 Workflow Files Created

- ✅ `.github/workflows/manual-deploy.yml` - Manual deployment
- ✅ `.github/workflows/deploy-backend.yml` - Auto backend deployment
- ✅ `.github/workflows/deploy-full-stack.yml` - Full stack deployment

## 🎯 Next Steps After Success

1. ✅ **Backend Working**: PocketBase running on Railway
2. ✅ **Custom Domain**: Add `api.digitalresumehub.com`
3. ✅ **Frontend Setup**: Deploy to Netlify
4. ✅ **DNS Configuration**: Point domains correctly
5. ✅ **Test Full App**: End-to-end functionality

## 📞 Quick Support

### GitHub Actions:
- **Logs**: Check action output for specific errors
- **Docs**: [docs.github.com/actions](https://docs.github.com/actions)

### Railway:
- **Dashboard**: [railway.app/dashboard](https://railway.app/dashboard)
- **Logs**: Check application logs in Railway

## ⚡ Summary Commands

```bash
# 1. Add RAILWAY_TOKEN secret (web interface)

# 2. Commit workflows
git add .github/workflows/ && git commit -m "Add GitHub Actions"

# 3. Push to GitHub  
git push origin main

# 4. Trigger deployment (web interface)
# Visit: https://github.com/HalftimeHarry/temp-resume-hub/actions

# 5. Test result
curl https://your-railway-url/api/health
```

**Your automated Railway deployment is ready!** 🚀