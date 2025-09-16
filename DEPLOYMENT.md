# 🚀 **Deployment Guide**

Complete guide for deploying Digital Resume Hub to production with Railway (backend) and Netlify (frontend).

## 📋 **Overview**

### **Current Production Setup**
- **Backend**: Railway PocketBase service ✅
- **Frontend**: Netlify (planned) 🔄
- **Domain**: digitalresumehub.com
- **API Subdomain**: api.digitalresumehub.com (planned)

### **Live URLs**
- **Backend API**: https://pocketbase-production-1493.up.railway.app
- **Admin Panel**: https://pocketbase-production-1493.up.railway.app/_/
- **Frontend**: https://digitalresumehub.com (to be deployed)

## 🔧 **Backend Deployment (Railway)**

### **✅ Current Status: DEPLOYED**
The backend is already deployed and working on Railway.

### **Service Details**
- **Service Name**: `pocketbase-production-1493`
- **Project**: `resourceful-patience`
- **Region**: us-west2
- **Status**: ✅ Running

### **Manual Deployment**
```bash
# Install Railway CLI
curl -fsSL https://railway.app/install.sh | sh

# Deploy to existing service
export RAILWAY_TOKEN=<your-project-token>
railway up --service pocketbase-production-1493 --detach
```

### **Automated Deployment**
GitHub Actions automatically deploys on workflow dispatch:

```bash
# Trigger deployment
Go to: https://github.com/HalftimeHarry/temp-resume-hub/actions/workflows/manual-deploy.yml
Click: "Run workflow" → "production" → "Run workflow"
```

### **Environment Variables**
Set in Railway dashboard:
```bash
ADMIN_EMAIL=ddinsmore8@gmail.com
ADMIN_PASSWORD=MADcap(123)
APP_NAME=Digital Resume Hub
NODE_ENV=production
```

## 🌐 **Frontend Deployment (Netlify)**

### **🔄 Status: TO BE DEPLOYED**

### **Deployment Steps**

#### **1. Connect Repository**
1. **Login to Netlify**: https://app.netlify.com
2. **New Site**: "Import from Git"
3. **Connect GitHub**: Authorize Netlify
4. **Select Repository**: `HalftimeHarry/temp-resume-hub`

#### **2. Configure Build Settings**
```bash
Base directory: app
Build command: npm run build
Publish directory: app/build
Node version: 18
```

#### **3. Environment Variables**
Add in Netlify dashboard:
```bash
PUBLIC_POCKETBASE_URL=https://pocketbase-production-1493.up.railway.app
POCKETBASE_URL=https://pocketbase-production-1493.up.railway.app
PUBLIC_APP_URL=https://digitalresumehub.com
ORIGIN=https://digitalresumehub.com
NODE_ENV=production
```

#### **4. Custom Domain Setup**
1. **Netlify Dashboard**: Site settings → Domain management
2. **Add Domain**: digitalresumehub.com
3. **DNS Configuration**: Point to Netlify
4. **SSL**: Automatic via Let's Encrypt

## 🌍 **DNS Configuration**

### **Domain: digitalresumehub.com**
Hosted with Bluehost:

#### **Frontend (Netlify)**
```bash
# A Record
@ → Netlify IP (provided by Netlify)

# CNAME Record  
www → your-site.netlify.app
```

#### **Backend API (Railway) - Planned**
```bash
# CNAME Record
api → pocketbase-production-1493.up.railway.app
```

## 🔐 **Security & Environment**

### **GitHub Secrets**
Required for automated deployment:
```bash
RAILWAY_TOKEN=<project-token-for-pocketbase-service>
```

### **Admin Access**
- **URL**: https://pocketbase-production-1493.up.railway.app/_/
- **Email**: ddinsmore8@gmail.com
- **Password**: MADcap(123)

## 🧪 **Testing Deployment**

### **Backend Health Check**
```bash
curl https://pocketbase-production-1493.up.railway.app/api/health
# Expected: {"message":"API is healthy.","code":200,"data":{}}
```

### **Frontend Testing**
```bash
cd app
npm run dev  # Local development
npm run build && npm run preview  # Production build test
```

## 🚨 **Troubleshooting**

### **Railway Issues**
```bash
# Check service logs
railway logs --service pocketbase-production-1493

# Redeploy
railway up --service pocketbase-production-1493 --detach
```

### **Netlify Issues**
- Check build logs in Netlify dashboard
- Verify environment variables
- Ensure Node.js version compatibility

## 📊 **Deployment Status**

### **Completed ✅**
- [x] Railway backend deployed
- [x] Domain accessible
- [x] Admin panel working
- [x] API endpoints responding
- [x] GitHub Actions configured

### **Pending 🔄**
- [ ] Netlify frontend deployment
- [ ] Custom domain configuration
- [ ] SSL certificate setup
- [ ] End-to-end testing

---

**Current Status**: Backend ✅ | Frontend 🔄 | DNS 🔄