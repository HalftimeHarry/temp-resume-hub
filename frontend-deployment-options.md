# Frontend Deployment Options for digitalresumehub.com

## 🎯 Three Deployment Strategies

### Option 1: Netlify (Recommended) 🌟

**Pros:**
- ✅ Automatic deployments from GitHub
- ✅ Built-in CDN and SSL
- ✅ Excellent SvelteKit support
- ✅ Free tier available
- ✅ Easy custom domain setup

**Setup:**
1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub repository
3. Build settings:
   ```
   Base directory: app
   Build command: npm run build
   Publish directory: app/build
   ```
4. Environment variables:
   ```
   PUBLIC_POCKETBASE_URL=https://api.digitalresumehub.com
   PUBLIC_APP_URL=https://digitalresumehub.com
   NODE_ENV=production
   ```
5. Add custom domain: `digitalresumehub.com`

**DNS Changes for Bluehost:**
```
A     @     75.2.60.5
CNAME www   [your-site].netlify.app
CNAME api   [your-railway-app].up.railway.app
```

### Option 2: Vercel

**Pros:**
- ✅ Excellent performance
- ✅ Great developer experience
- ✅ Automatic deployments
- ✅ Edge functions support

**Setup:**
1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Set root directory: `app`
4. Environment variables (same as Netlify)
5. Add custom domain

**DNS Changes for Bluehost:**
```
A     @     76.76.19.61
CNAME www   cname.vercel-dns.com
CNAME api   [your-railway-app].up.railway.app
```

### Option 3: Bluehost Hosting

**Pros:**
- ✅ Keep everything in one place
- ✅ No additional hosting costs
- ✅ Full control over server

**Cons:**
- ❌ Manual deployment process
- ❌ No automatic builds
- ❌ Need to handle Node.js build process

**Setup:**
1. Build the app locally:
   ```bash
   cd app
   npm run build
   ```
2. Upload `app/build` contents to Bluehost public_html
3. Configure environment variables in hosting

**DNS (No Changes Needed):**
```
A     @     66.81.203.198  (your current Bluehost)
A     www   66.81.203.198  (your current Bluehost)
CNAME api   [your-railway-app].up.railway.app
```

## 🚀 Recommended Approach: Netlify

### Step-by-Step Netlify Setup

1. **Create Netlify Account**
   - Go to netlify.com
   - Sign up with GitHub

2. **Connect Repository**
   - Click "New site from Git"
   - Choose GitHub
   - Select your repository

3. **Configure Build**
   ```
   Repository: your-username/temp-resume-hub
   Branch: main
   Base directory: app
   Build command: npm run build
   Publish directory: app/build
   ```

4. **Add Environment Variables**
   Go to Site settings → Environment variables:
   ```
   PUBLIC_POCKETBASE_URL=https://api.digitalresumehub.com
   PUBLIC_APP_URL=https://digitalresumehub.com
   NODE_ENV=production
   ```

5. **Deploy**
   - Netlify will build and deploy automatically
   - You'll get a temporary URL like `amazing-site-123.netlify.app`

6. **Add Custom Domain**
   - Go to Site settings → Domain management
   - Add custom domain: `digitalresumehub.com`
   - Netlify will provide DNS instructions

7. **Update Bluehost DNS**
   Replace your current A records:
   ```
   A     @     75.2.60.5
   CNAME www   amazing-site-123.netlify.app
   CNAME api   [your-railway-app].up.railway.app
   ```

## 🔄 GitHub Actions Setup

Add these secrets to your GitHub repository:

```
NETLIFY_AUTH_TOKEN=your_netlify_token
NETLIFY_SITE_ID=your_site_id
PUBLIC_POCKETBASE_URL=https://api.digitalresumehub.com
RAILWAY_TOKEN=53da0c89-bc1b-4f30-ab46-a82dd3416f3d
```

## ✅ Verification Checklist

After deployment, verify:

### Backend (Railway)
- [ ] `https://api.digitalresumehub.com/api/health` returns success
- [ ] `https://api.digitalresumehub.com/_/` shows admin panel
- [ ] SSL certificate is valid
- [ ] CORS allows your frontend domain

### Frontend (Netlify)
- [ ] `https://digitalresumehub.com` loads the app
- [ ] `https://www.digitalresumehub.com` redirects to main domain
- [ ] SSL certificate is valid
- [ ] App can connect to backend API

### DNS
- [ ] `nslookup digitalresumehub.com` resolves correctly
- [ ] `nslookup api.digitalresumehub.com` resolves correctly
- [ ] No DNS propagation issues

### Functionality
- [ ] User registration works
- [ ] User login works
- [ ] Resume creation works
- [ ] Public resume sharing works

## 🆘 Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check Node.js version (should be 20+)
   - Verify environment variables
   - Check build logs in Netlify

2. **CORS Errors**
   - Verify backend CORS configuration
   - Check domain whitelist in PocketBase hooks

3. **DNS Issues**
   - Wait 24-48 hours for full propagation
   - Use DNS checker tools
   - Clear browser DNS cache

4. **SSL Issues**
   - Wait for automatic certificate provisioning
   - Verify domain ownership
   - Check DNS configuration