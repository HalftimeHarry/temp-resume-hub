# Bluehost DNS Configuration for digitalresumehub.com

## 🎯 Current Setup
Your domain currently has:
```
A     @     66.81.203.198  (under construction page)
A     www   66.81.203.198  (under construction page)
NS1.BLUEHOST.COM
NS2.BLUEHOST.COM
```

## 🔄 Required Changes

### Step 1: Keep Frontend on Bluehost (Temporary)
For now, we'll only add the API subdomain and keep the main site:

```
# Keep existing (for now)
A     @     66.81.203.198
A     www   66.81.203.198

# Add new API subdomain
CNAME api   [your-railway-app].up.railway.app
```

### Step 2: Add API Subdomain in Bluehost

1. **Login to Bluehost cPanel**
2. **Go to "Advanced DNS Zone Editor"** or **"DNS Zone Editor"**
3. **Add New Record**:
   ```
   Type: CNAME
   Name: api
   CNAME: [your-railway-app].up.railway.app
   TTL: 14400 (4 hours)
   ```

### Step 3: Alternative - Simple DNS Manager

If using Bluehost's simple DNS manager:

1. **Go to "Domains" → "Zone Editor"**
2. **Find digitalresumehub.com**
3. **Click "Manage"**
4. **Add CNAME Record**:
   - **Host Record**: `api`
   - **Points To**: `[your-railway-app].up.railway.app`
   - **TTL**: `14400`

## 🚀 Future Frontend Deployment

Once you're ready to deploy the frontend (SvelteKit app):

### Option A: Deploy to Netlify
```
# Update main domain to point to Netlify
A     @     75.2.60.5
CNAME www   [your-site].netlify.app
CNAME api   [your-railway-app].up.railway.app
```

### Option B: Deploy to Vercel
```
# Update main domain to point to Vercel  
A     @     76.76.19.61
CNAME www   cname.vercel-dns.com
CNAME api   [your-railway-app].up.railway.app
```

### Option C: Keep on Bluehost
Upload the built SvelteKit app to Bluehost:
```
# Keep existing
A     @     66.81.203.198
A     www   66.81.203.198
CNAME api   [your-railway-app].up.railway.app
```

## ⏱️ DNS Propagation Timeline

- **Local Changes**: 5-15 minutes
- **Global Propagation**: 2-24 hours
- **SSL Certificate**: 5-15 minutes after DNS resolves

## 🔍 Verification Commands

Test DNS propagation:
```bash
# Check if API subdomain resolves
nslookup api.digitalresumehub.com

# Check if it points to Railway
dig api.digitalresumehub.com CNAME

# Test the API endpoint
curl https://api.digitalresumehub.com/api/health
```

## 📞 Bluehost Support

If you need help with DNS changes:
- **Phone**: Available in your Bluehost account
- **Chat**: Available 24/7 in cPanel
- **Tickets**: Submit through Bluehost portal

## ⚠️ Important Notes

1. **Backup Current Settings**: Screenshot your current DNS before changes
2. **Test Subdomain First**: Make sure `api.digitalresumehub.com` works before changing main domain
3. **Email Considerations**: If you have email on this domain, don't change MX records
4. **Gradual Migration**: You can test everything on the API subdomain first

## 🎯 Next Steps

1. Deploy backend to Railway (get the Railway URL)
2. Add CNAME record in Bluehost for `api` subdomain
3. Wait for DNS propagation (15 minutes - 2 hours)
4. Test API endpoint
5. Deploy frontend when ready