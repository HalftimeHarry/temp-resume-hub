# 🚀 Quick Start Guide - Digital Resume Hub

## 📋 Prerequisites Checklist
- [x] Railway token: `53da0c89-bc1b-4f30-ab46-a82dd3416f3d`
- [x] Domain: `digitalresumehub.com` (Bluehost DNS)
- [x] GitHub repository with all code
- [ ] Railway account
- [ ] Netlify account (recommended)

## ⚡ 15-Minute Deployment

### Step 1: Deploy Backend (5 minutes)
1. **Go to [railway.app](https://railway.app)**
2. **Create new project from GitHub**
3. **Select your repository**
4. **Set root directory**: `backend`
5. **Add environment variable**: `PORT=8080`
6. **Wait for deployment** (2-3 minutes)
7. **Note your Railway URL**: `https://your-app-production.up.railway.app`

### Step 2: Add Custom Domain (2 minutes)
1. **In Railway dashboard**: Settings → Domains
2. **Add custom domain**: `api.digitalresumehub.com`
3. **Copy the CNAME target** (e.g., `your-app-production.up.railway.app`)

### Step 3: Update DNS (3 minutes)
1. **Login to Bluehost cPanel**
2. **Go to DNS Zone Editor**
3. **Add CNAME record**:
   ```
   Type: CNAME
   Name: api
   Points To: your-app-production.up.railway.app
   TTL: 14400
   ```

### Step 4: Deploy Frontend (5 minutes)
1. **Go to [netlify.com](https://netlify.com)**
2. **New site from Git** → GitHub → Your repository
3. **Build settings**:
   ```
   Base directory: app
   Build command: npm run build
   Publish directory: app/build
   ```
4. **Environment variables**:
   ```
   PUBLIC_POCKETBASE_URL=https://api.digitalresumehub.com
   PUBLIC_APP_URL=https://digitalresumehub.com
   ```
5. **Add custom domain**: `digitalresumehub.com`

### Step 5: Final DNS Update
**Update your Bluehost DNS**:
```
A     @     75.2.60.5
CNAME www   your-site.netlify.app
CNAME api   your-app-production.up.railway.app
```

## ✅ Verification (2 minutes)

Test these URLs:
1. **Backend**: `https://api.digitalresumehub.com/api/health`
2. **Admin**: `https://api.digitalresumehub.com/_/`
3. **Frontend**: `https://digitalresumehub.com`

## 🎯 What You'll Have

### Live URLs:
- **Main App**: `https://digitalresumehub.com`
- **API**: `https://api.digitalresumehub.com`
- **Admin Panel**: `https://api.digitalresumehub.com/_/`

### Features Working:
- ✅ User registration/login
- ✅ Resume creation and editing
- ✅ Public resume sharing
- ✅ Responsive design
- ✅ Real-time updates
- ✅ Secure authentication

### Infrastructure:
- ✅ **Backend**: Railway (PocketBase + SQLite)
- ✅ **Frontend**: Netlify (SvelteKit)
- ✅ **Database**: Automatic backups
- ✅ **SSL**: Automatic certificates
- ✅ **CDN**: Global distribution

## 🔧 GitHub Secrets Setup

Add these to your repository secrets for automated deployments:

```
RAILWAY_TOKEN=53da0c89-bc1b-4f30-ab46-a82dd3416f3d
NETLIFY_AUTH_TOKEN=[get from netlify.com/user/applications]
NETLIFY_SITE_ID=[get from site settings]
PUBLIC_POCKETBASE_URL=https://api.digitalresumehub.com
```

## 🆘 If Something Goes Wrong

### Backend Issues:
- Check Railway deployment logs
- Verify environment variables
- Test health endpoint

### Frontend Issues:
- Check Netlify build logs
- Verify environment variables
- Test local build: `cd app && npm run build`

### DNS Issues:
- Wait 2-24 hours for propagation
- Use [dnschecker.org](https://dnschecker.org) to verify
- Clear browser DNS cache

### CORS Issues:
- Verify backend allows your domain
- Check browser console for errors
- Test API directly with curl

## 📞 Support Resources

- **Railway**: [docs.railway.app](https://docs.railway.app)
- **Netlify**: [docs.netlify.com](https://docs.netlify.com)
- **PocketBase**: [pocketbase.io/docs](https://pocketbase.io/docs)
- **SvelteKit**: [kit.svelte.dev](https://kit.svelte.dev)

## 🎉 Success!

Once everything is working:
1. **Create your admin account** at `https://api.digitalresumehub.com/_/`
2. **Test user registration** on your main site
3. **Create your first resume**
4. **Share it publicly** with a custom URL

Your **Digital Resume Hub** is now live and ready for users! 🚀