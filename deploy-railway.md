# Railway Deployment Steps

## 🚀 Deploy Backend to Railway

### Step 1: Create Railway Project
1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `temp-resume-hub` repository
5. Railway will detect the Dockerfile in the `backend` directory

### Step 2: Configure Service
1. **Root Directory**: Set to `backend`
2. **Environment Variables**: Add these in Railway dashboard:
   ```
   PORT=8080
   ```

### Step 3: Deploy
1. Railway will automatically build and deploy
2. Wait for deployment to complete
3. Note your Railway app URL (e.g., `your-app-production.up.railway.app`)

### Step 4: Test Deployment
Visit your Railway URL + `/api/health`:
```
https://your-app-production.up.railway.app/api/health
```

Should return:
```json
{"status": "ok", "message": "Resume Hub API is running"}
```

### Step 5: Set Up Admin Account
1. Visit: `https://your-app-production.up.railway.app/_/`
2. Create your admin account
3. This will be your PocketBase admin panel

## 🌐 Add Custom Domain

### In Railway Dashboard:
1. Go to your service
2. Click "Settings" → "Domains"
3. Click "Custom Domain"
4. Enter: `api.digitalresumehub.com`
5. Railway will provide DNS instructions

### Expected Result:
- Railway will give you a CNAME target
- Example: `your-app-production.up.railway.app`