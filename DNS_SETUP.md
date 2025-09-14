# DNS Configuration for digitalresumehub.com

## Overview
Configure your domain to point to the deployed services:
- **Frontend**: `digitalresumehub.com` → Netlify/Vercel
- **Backend API**: `api.digitalresumehub.com` → Railway

## DNS Records Setup

### 1. Main Domain (Frontend)

#### For Netlify:
```
Type: A
Name: @
Value: 75.2.60.5
TTL: 300

Type: CNAME  
Name: www
Value: [your-site-name].netlify.app
TTL: 300
```

#### For Vercel:
```
Type: A
Name: @  
Value: 76.76.19.61
TTL: 300

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 300
```

### 2. API Subdomain (Backend)

#### For Railway:
```
Type: CNAME
Name: api
Value: [your-railway-app].railway.app
TTL: 300
```

## Step-by-Step Instructions

### 1. Get Your Service URLs

#### Railway (Backend):
1. Go to your Railway project dashboard
2. Click on your service
3. Go to "Settings" → "Domains"
4. Copy the generated domain (e.g., `your-app-production.up.railway.app`)

#### Netlify (Frontend):
1. Go to your Netlify site dashboard
2. Go to "Site settings" → "Domain management"
3. Note your site name (e.g., `amazing-site-123456.netlify.app`)

#### Vercel (Frontend):
1. Go to your Vercel project dashboard
2. Go to "Settings" → "Domains"
3. Note your deployment URL

### 2. Configure DNS at Your Domain Provider

#### Popular Domain Providers:

**Cloudflare:**
1. Login to Cloudflare dashboard
2. Select your domain
3. Go to "DNS" → "Records"
4. Add the records above
5. Set Proxy status to "Proxied" for better performance

**Namecheap:**
1. Login to Namecheap account
2. Go to "Domain List" → "Manage"
3. Go to "Advanced DNS"
4. Add the records above

**GoDaddy:**
1. Login to GoDaddy account
2. Go to "My Products" → "DNS"
3. Add the records above

**Google Domains:**
1. Login to Google Domains
2. Select your domain
3. Go to "DNS"
4. Add the records above

### 3. Verify Configuration

#### Check DNS Propagation:
Use online tools like:
- [DNS Checker](https://dnschecker.org)
- [What's My DNS](https://whatsmydns.net)

#### Test Endpoints:
```bash
# Frontend
curl -I https://digitalresumehub.com
curl -I https://www.digitalresumehub.com

# Backend API
curl https://api.digitalresumehub.com/api/health
```

Expected responses:
- Frontend: HTTP 200 with HTML content
- Backend: `{"status": "ok", "message": "Resume Hub API is running"}`

## SSL/TLS Configuration

### Automatic SSL (Recommended)
Both Netlify/Vercel and Railway provide automatic SSL certificates:

1. **Netlify/Vercel**: Automatically provisions Let's Encrypt certificates
2. **Railway**: Automatically provisions SSL for custom domains

### Force HTTPS
Ensure all traffic is redirected to HTTPS:

#### Netlify:
Add to `netlify.toml`:
```toml
[[redirects]]
  from = "http://digitalresumehub.com/*"
  to = "https://digitalresumehub.com/:splat"
  status = 301
  force = true

[[redirects]]
  from = "http://www.digitalresumehub.com/*"
  to = "https://digitalresumehub.com/:splat"
  status = 301
  force = true
```

#### Cloudflare (if using):
1. Go to "SSL/TLS" → "Edge Certificates"
2. Enable "Always Use HTTPS"

## Troubleshooting

### Common Issues:

1. **DNS Not Propagating**:
   - Wait 24-48 hours for full propagation
   - Clear your DNS cache: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)

2. **SSL Certificate Issues**:
   - Wait for automatic provisioning (can take up to 24 hours)
   - Verify domain ownership in hosting provider

3. **CORS Errors**:
   - Ensure backend allows your frontend domain
   - Check `pb_hooks/main.pb.js` configuration

4. **Subdomain Not Working**:
   - Verify CNAME record is correct
   - Check Railway domain configuration

### Verification Commands:

```bash
# Check DNS resolution
nslookup digitalresumehub.com
nslookup api.digitalresumehub.com

# Check SSL certificate
openssl s_client -connect digitalresumehub.com:443 -servername digitalresumehub.com

# Test API connectivity
curl -v https://api.digitalresumehub.com/api/health
```

## Timeline

- **DNS Changes**: 5 minutes to 48 hours
- **SSL Provisioning**: 5 minutes to 24 hours  
- **Full Propagation**: Up to 48 hours globally

## Support Contacts

- **Domain Issues**: Contact your domain registrar
- **Netlify Issues**: [Netlify Support](https://www.netlify.com/support/)
- **Vercel Issues**: [Vercel Support](https://vercel.com/support)
- **Railway Issues**: [Railway Support](https://railway.app/help)