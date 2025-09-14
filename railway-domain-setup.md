# Railway Custom Domain Setup

## 🌐 Configure api.digitalresumehub.com

### Step 1: Add Domain in Railway
1. In Railway dashboard, go to your service
2. Click "Settings" → "Domains"  
3. Click "Custom Domain"
4. Enter: `api.digitalresumehub.com`
5. Click "Add Domain"

### Step 2: Get DNS Instructions
Railway will show you the DNS record to add:
```
Type: CNAME
Name: api
Value: [your-railway-app].up.railway.app
```

### Step 3: Verify Domain
1. Railway will automatically verify the domain
2. SSL certificate will be provisioned automatically
3. This may take 5-15 minutes

## 🔧 What Railway Provides

- **Automatic SSL**: Let's Encrypt certificate
- **Global CDN**: Fast worldwide access
- **Health Monitoring**: Automatic restarts
- **Logs**: Real-time application logs
- **Metrics**: CPU, memory, network usage

## ✅ Verification

Once set up, test these URLs:

1. **Health Check**:
   ```
   https://api.digitalresumehub.com/api/health
   ```
   Should return: `{"status": "ok", "message": "Resume Hub API is running"}`

2. **Admin Panel**:
   ```
   https://api.digitalresumehub.com/_/
   ```
   Should show PocketBase admin login

3. **API Documentation**:
   ```
   https://api.digitalresumehub.com/api/
   ```
   Should show PocketBase API info