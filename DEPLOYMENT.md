# Deployment Guide - Digital Resume Hub

This guide covers deploying the Resume Hub application to production with PocketBase on Railway and the frontend on Netlify/Vercel.

## Architecture Overview

```
digitalresumehub.com (Frontend - Netlify/Vercel)
    ↓
api.digitalresumehub.com (Backend - Railway + PocketBase)
```

## 1. Backend Deployment (Railway + PocketBase)

### Step 1: Create Railway Project
1. Go to [Railway](https://railway.app) and sign up/login
2. Create a new project from GitHub
3. Connect your repository
4. Select the `backend` directory as the root

### Step 2: Configure Railway
1. **Environment Variables** (in Railway dashboard):
   ```
   PORT=8080
   ```

2. **Custom Domain**:
   - Add domain: `api.digitalresumehub.com`
   - Railway will provide DNS instructions

### Step 3: DNS Configuration
Add these DNS records to your domain provider:

```
Type: CNAME
Name: api
Value: [railway-provided-domain]
TTL: 300
```

### Step 4: Verify Backend
- Visit `https://api.digitalresumehub.com/api/health`
- Should return: `{"status": "ok", "message": "Resume Hub API is running"}`
- Admin panel: `https://api.digitalresumehub.com/_/`

## 2. Frontend Deployment

### Option A: Netlify (Recommended)

#### Step 1: Netlify Setup
1. Go to [Netlify](https://netlify.com) and sign up/login
2. Connect your GitHub repository
3. Configure build settings:
   - **Build command**: `cd app && npm run build`
   - **Publish directory**: `app/build`
   - **Base directory**: `app`

#### Step 2: Environment Variables
In Netlify dashboard, add:
```
PUBLIC_POCKETBASE_URL=https://api.digitalresumehub.com
PUBLIC_APP_URL=https://digitalresumehub.com
NODE_ENV=production
```

#### Step 3: Custom Domain
1. Add custom domain: `digitalresumehub.com`
2. Configure DNS:
   ```
   Type: A
   Name: @
   Value: [netlify-ip]
   
   Type: CNAME
   Name: www
   Value: [your-site].netlify.app
   ```

### Option B: Vercel

#### Step 1: Vercel Setup
1. Go to [Vercel](https://vercel.com) and sign up/login
2. Import your GitHub repository
3. Set root directory to `app`

#### Step 2: Environment Variables
```
PUBLIC_POCKETBASE_URL=https://api.digitalresumehub.com
PUBLIC_APP_URL=https://digitalresumehub.com
NODE_ENV=production
```

#### Step 3: Custom Domain
1. Add domain in Vercel dashboard
2. Configure DNS as provided by Vercel

## 3. GitHub Actions Setup

### Required Secrets
Add these to your GitHub repository secrets:

**For Railway:**
```
RAILWAY_TOKEN=your_railway_token
```

**For Netlify:**
```
NETLIFY_AUTH_TOKEN=your_netlify_token
NETLIFY_SITE_ID=your_site_id
PUBLIC_POCKETBASE_URL=https://api.digitalresumehub.com
```

**For Vercel:**
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
PUBLIC_POCKETBASE_URL=https://api.digitalresumehub.com
```

## 4. SSL/HTTPS Configuration

Both Railway and Netlify/Vercel provide automatic SSL certificates. Ensure:

1. **Backend**: `https://api.digitalresumehub.com` has valid SSL
2. **Frontend**: `https://digitalresumehub.com` has valid SSL
3. **CORS**: Backend allows requests from your frontend domain

## 5. Database Setup

### Initial Admin Setup
1. Visit `https://api.digitalresumehub.com/_/`
2. Create admin account
3. Database schema will auto-migrate

### Collections Created
- **users**: User authentication and profiles
- **resumes**: Resume data with JSON content

## 6. Monitoring & Maintenance

### Health Checks
- Backend: `https://api.digitalresumehub.com/api/health`
- Frontend: `https://digitalresumehub.com`

### Logs
- **Railway**: View logs in Railway dashboard
- **Netlify**: View function logs and build logs
- **Vercel**: View function logs and build logs

### Backups
- PocketBase automatically creates database backups
- Consider setting up automated backups to cloud storage

## 7. Environment-Specific Configuration

### Development
```bash
# Backend
cd backend
./pocketbase serve --http=0.0.0.0:8080

# Frontend
cd app
npm run dev
```

### Production
- Backend: Deployed on Railway
- Frontend: Deployed on Netlify/Vercel
- Database: PocketBase SQLite with Railway volumes

## 8. Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Check backend CORS configuration
   - Verify domain whitelist in `pb_hooks/main.pb.js`

2. **Build Failures**:
   - Check environment variables
   - Verify Node.js version (20+)

3. **Database Connection**:
   - Verify `PUBLIC_POCKETBASE_URL` is correct
   - Check Railway service status

4. **Authentication Issues**:
   - Clear browser cookies
   - Check PocketBase admin settings

### Support
- Railway: [Railway Docs](https://docs.railway.app)
- Netlify: [Netlify Docs](https://docs.netlify.com)
- PocketBase: [PocketBase Docs](https://pocketbase.io/docs)