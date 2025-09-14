# 🚂 Deploy Backend to Railway - Step by Step

## 📋 Prerequisites
- [x] Railway token: `53da0c89-bc1b-4f30-ab46-a82dd3416f3d`
- [x] GitHub repository with backend code
- [x] Admin credentials: `ddinsmore8@gmail.com` / `MADcap(123)`

## 🚀 Step 1: Create Railway Project

### Option A: Deploy from GitHub (Recommended)
1. **Go to [railway.app](https://railway.app)**
2. **Click "Start a New Project"**
3. **Select "Deploy from GitHub repo"**
4. **Choose your repository**: `temp-resume-hub`
5. **Railway will scan and detect the Dockerfile**

### Option B: Use Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login with your token
railway login --browserless
# Enter token: 53da0c89-bc1b-4f30-ab46-a82dd3416f3d

# Deploy from backend directory
cd backend
railway up
```

## ⚙️ Step 2: Configure Service

### In Railway Dashboard:
1. **Go to your project**
2. **Click on the service**
3. **Go to "Settings" tab**

### Set Root Directory:
1. **Settings → General**
2. **Root Directory**: `backend`
3. **Save changes**

### Add Environment Variables:
1. **Settings → Variables**
2. **Add these variables**:
   ```
   PORT=8080
   ADMIN_EMAIL=ddinsmore8@gmail.com
   ADMIN_PASSWORD=MADcap(123)
   APP_NAME=Digital Resume Hub
   APP_URL=https://digitalresumehub.com
   NODE_ENV=production
   ```

## 🔧 Step 3: Configure Build

### Dockerfile Check:
Railway should automatically detect the Dockerfile in `/backend/Dockerfile`

### Build Command (if needed):
```
docker build -t pocketbase-app .
```

### Start Command:
```
/pb/pocketbase serve --http=0.0.0.0:$PORT --dir=/pb/pb_data --publicDir=/pb/pb_public
```

## 🚀 Step 4: Deploy

1. **Click "Deploy"** in Railway dashboard
2. **Wait for build to complete** (2-5 minutes)
3. **Check deployment logs** for any errors
4. **Note your Railway URL**: `https://your-app-production.up.railway.app`

## ✅ Step 5: Verify Deployment

### Test Health Endpoint:
```bash
curl https://your-app-production.up.railway.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Digital Resume Hub API is running",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "version": "1.0.0"
}
```

### Test Admin Panel:
1. **Visit**: `https://your-app-production.up.railway.app/_/`
2. **Login with**:
   - Email: `ddinsmore8@gmail.com`
   - Password: `MADcap(123)`

## 🌐 Step 6: Add Custom Domain

### In Railway Dashboard:
1. **Go to Settings → Domains**
2. **Click "Custom Domain"**
3. **Enter**: `api.digitalresumehub.com`
4. **Railway will provide DNS instructions**

### Expected DNS Record:
```
Type: CNAME
Name: api
Value: your-app-production.up.railway.app
TTL: 300
```

## 🔍 Troubleshooting

### Build Fails:
- Check Dockerfile syntax
- Verify all files are in backend directory
- Check Railway build logs

### Service Won't Start:
- Verify PORT environment variable
- Check PocketBase binary permissions
- Review startup logs

### Can't Access Admin:
- Verify admin credentials in environment variables
- Check if admin user was created (logs)
- Try manual admin creation

### Health Check Fails:
- Verify service is running on correct port
- Check if hooks are loaded properly
- Review application logs

## 📝 Railway Project Structure

After deployment, your Railway project should show:
```
Project: temp-resume-hub-backend
├── Service: backend
│   ├── Environment Variables ✅
│   ├── Custom Domain: api.digitalresumehub.com
│   ├── Build Logs ✅
│   └── Application Logs ✅
└── Volumes: pb_data (auto-created)
```

## 🎯 Success Indicators

- [ ] Build completes without errors
- [ ] Service starts and stays running
- [ ] Health endpoint returns 200 OK
- [ ] Admin panel accessible
- [ ] Can login with provided credentials
- [ ] Custom domain resolves (after DNS update)

## 📞 Need Help?

### Railway Support:
- **Docs**: [docs.railway.app](https://docs.railway.app)
- **Discord**: Railway community
- **GitHub**: Railway issues

### Common Railway URLs:
- **Dashboard**: [railway.app/dashboard](https://railway.app/dashboard)
- **CLI Docs**: [docs.railway.app/develop/cli](https://docs.railway.app/develop/cli)
- **Environment Variables**: [docs.railway.app/deploy/variables](https://docs.railway.app/deploy/variables)

## 🔄 Next Steps

Once backend is deployed:
1. ✅ Update Bluehost DNS with CNAME record
2. ✅ Test API endpoints
3. ✅ Deploy frontend to Netlify
4. ✅ Update frontend environment variables
5. ✅ Test full application flow