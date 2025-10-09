# Spam Prevention & Role Management - Implementation Guide

## ✅ What's Been Implemented

### 1. Spam Prevention

#### ✅ Honeypot Fields
- **Location**: `app/src/routes/auth/register/+page.svelte`, `app/src/routes/auth/login/+page.svelte`
- **How it works**: Hidden field that bots fill but humans don't see
- **Status**: Fully implemented and active

#### ✅ Submit-Time Threshold
- **Location**: Both registration and login forms
- **Thresholds**:
  - Registration: 3-30 minutes
  - Login: 2 seconds minimum
- **Status**: Fully implemented and active

#### ✅ Rate Limiting
- **Location**: `app/src/lib/utils/rate-limiter.ts`
- **Limits**:
  - Registration: 3 attempts per hour
  - Login: 5 attempts per 15 minutes
- **Storage**: LocalStorage (client-side)
- **Status**: Fully implemented and active

#### ✅ CSRF Protection
- **Provider**: PocketBase built-in
- **Method**: HTTP-only cookies with automatic token validation
- **Status**: Active (no additional code needed)

#### ✅ Email Obfuscation
- **Location**: `app/src/lib/components/ObfuscatedEmail.svelte`
- **Usage**: `<ObfuscatedEmail email="contact@example.com" />`
- **Status**: Component created, ready to use

### 2. Role Management

#### ✅ User Type System
- **Location**: `app/src/lib/types/index.ts`
- **Roles**: `job_seeker`, `moderator`, `admin`
- **Plans**: `free`, `pro`, `enterprise`
- **Status**: Type definitions updated

#### ✅ Permission System
- **Location**: `app/src/lib/utils/permissions.ts`
- **Features**:
  - Role-based permissions
  - Plan-based permissions
  - Permission checking functions
  - Plan expiry validation
- **Status**: Fully implemented

#### ✅ Plan Upgrade System
- **Location**: `app/src/lib/utils/plan-upgrade.ts`
- **Features**:
  - Upgrade to Pro/Enterprise
  - Downgrade to Free
  - Pricing configuration
  - Expiry management
- **Status**: Framework implemented (payment integration needed)

---

## 🔧 Next Steps for Production

### Phase 1: Database Schema Updates (Required)

⚠️ **IMPORTANT**: Add fields to `user_profiles` collection, NOT `users` collection!

You need to update your PocketBase `user_profiles` collection schema:

```javascript
// Update/add these fields to the user_profiles collection in PocketBase Admin UI:

{
  // UPDATE EXISTING FIELD
  "role": {
    "type": "select",
    "options": ["job_seeker", "moderator", "admin"],
    "default": "job_seeker",
    "required": true
  },
  
  // ADD NEW FIELDS
  "plan": {
    "type": "select",
    "options": ["free", "pro", "enterprise"],
    "default": "free",
    "required": true
  },
  "plan_expires": {
    "type": "date",
    "required": false
  },
  "plan_payment_id": {
    "type": "text",
    "required": false
  },
  "verified": {
    "type": "bool",
    "default": false
  },
  "active": {
    "type": "bool",
    "default": true
  },
  "last_login": {
    "type": "date",
    "required": false
  }
}
```

**How to do this:**
1. Open PocketBase Admin UI (usually `http://localhost:8090/_/`)
2. Go to Collections → **user_profiles** (NOT users!)
3. Click "Edit collection"
4. Update the `role` field options
5. Add the new fields above
6. Save changes

**Why user_profiles?**
- Keeps authentication separate from business logic
- You already have a `role` field there
- Easier to extend without touching core auth
- Better for GDPR compliance

See `USER_PROFILES_SCHEMA_UPDATE.md` for detailed explanation.

### Phase 2: Email Verification (Recommended)

Enable PocketBase's built-in email verification:

```typescript
// In your registration flow, add:
await pb.collection('users').requestVerification(email);

// This will:
// 1. Send verification email to user
// 2. Set verified: false initially
// 3. User clicks link to verify
// 4. verified: true after confirmation
```

**Configuration:**
1. In PocketBase Admin UI → Settings → Mail settings
2. Configure SMTP settings (Gmail, SendGrid, Mailgun, etc.)
3. Customize email templates

### Phase 3: Server-Side Rate Limiting (Production)

**Option A: Cloudflare (Recommended - Free)**

1. Add your domain to Cloudflare
2. Enable "Bot Fight Mode" (Security → Bots)
3. Create rate limiting rules:
   ```
   Rule 1: Registration
   - Path: /auth/register
   - Requests: 5 per hour per IP
   - Action: Block
   
   Rule 2: Login
   - Path: /auth/login
   - Requests: 10 per 15 minutes per IP
   - Action: Challenge (CAPTCHA)
   ```

**Option B: PocketBase Middleware**

Create a custom middleware in PocketBase:

```go
// pb_hooks/rate_limit.pb.js
onBeforeServe((e) => {
  e.Router.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
    return func(c echo.Context) error {
      // Implement rate limiting logic
      ip := c.RealIP()
      // Check rate limit for this IP
      // Return 429 if exceeded
      return next(c)
    }
  })
})
```

### Phase 4: Payment Integration (For Paid Plans)

**Recommended: Stripe**

```bash
npm install @stripe/stripe-js stripe
```

```typescript
// lib/utils/stripe.ts
import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(PUBLIC_STRIPE_KEY);

export async function createCheckoutSession(plan: 'pro' | 'enterprise', billingCycle: 'monthly' | 'yearly') {
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan, billingCycle })
  });
  
  const { sessionId } = await response.json();
  const stripe = await stripePromise;
  await stripe?.redirectToCheckout({ sessionId });
}
```

**Alternative: LemonSqueezy** (Easier setup, higher fees)
- No code required
- Hosted checkout
- Automatic tax handling

### Phase 5: reCAPTCHA Integration (If Spam Persists)

```bash
npm install @types/grecaptcha
```

```svelte
<!-- In register/login forms -->
<script>
  import { onMount } from 'svelte';
  
  let recaptchaLoaded = false;
  
  onMount(() => {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?render=YOUR_SITE_KEY';
    script.onload = () => { recaptchaLoaded = true; };
    document.head.appendChild(script);
  });
  
  async function handleSubmit() {
    if (recaptchaLoaded) {
      const token = await grecaptcha.execute('YOUR_SITE_KEY', { action: 'register' });
      // Send token with registration request
    }
  }
</script>
```

---

## 📊 Monitoring & Analytics

### Track Spam Attempts

Create a `spam_logs` collection in PocketBase:

```javascript
{
  "type": "text",        // honeypot, timing, rate_limit, etc.
  "ip": "text",
  "user_agent": "text",
  "details": "json",
  "timestamp": "date"
}
```

### Usage Example

```typescript
// Log spam attempt
await pb.collection('spam_logs').create({
  type: 'honeypot',
  ip: request.headers.get('cf-connecting-ip'),
  user_agent: request.headers.get('user-agent'),
  details: { email, honeypot_value: honeypot },
  timestamp: new Date().toISOString()
});
```

### Dashboard Metrics

Track these KPIs:
- Total registrations
- Spam attempts blocked
- Honeypot catches
- Rate limit hits
- Verification rate
- Plan upgrade conversion

---

## 🔐 Security Best Practices

### 1. Environment Variables

```bash
# .env
PUBLIC_POCKETBASE_URL=https://your-domain.com
POCKETBASE_ADMIN_EMAIL=admin@example.com
POCKETBASE_ADMIN_PASSWORD=strong-password-here

# Payment (if using Stripe)
PUBLIC_STRIPE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# reCAPTCHA (if using)
PUBLIC_RECAPTCHA_SITE_KEY=6Lc...
RECAPTCHA_SECRET_KEY=6Lc...
```

### 2. HTTPS Only

Ensure your production site uses HTTPS:
- Cloudflare: Automatic
- Custom server: Use Let's Encrypt

### 3. Secure Cookies

PocketBase handles this automatically, but verify:
- `HttpOnly`: ✅ (prevents XSS)
- `Secure`: ✅ (HTTPS only)
- `SameSite`: ✅ (prevents CSRF)

### 4. Regular Updates

```bash
# Update dependencies monthly
npm update
npm audit fix

# Update PocketBase
# Download latest from https://pocketbase.io/
```

---

## 🧪 Testing

### Test Spam Prevention

```typescript
// Test honeypot
// 1. Fill hidden field → Should be rejected
// 2. Leave hidden field empty → Should work

// Test timing
// 1. Submit immediately → Should be rejected
// 2. Wait 3+ seconds → Should work

// Test rate limiting
// 1. Register 3 times quickly → 4th should be blocked
// 2. Wait 1 hour → Should work again
```

### Test Permissions

```typescript
import { hasPermission, PERMISSIONS } from '$lib/utils/permissions';

// Test job seeker
const jobSeeker = { role: 'job_seeker', plan: 'free', ... };
console.assert(hasPermission(jobSeeker, PERMISSIONS.CREATE_RESUME) === true);
console.assert(hasPermission(jobSeeker, PERMISSIONS.USE_PREMIUM_TEMPLATES) === false);

// Test pro user
const proUser = { role: 'job_seeker', plan: 'pro', plan_expires: '2025-12-31', ... };
console.assert(hasPermission(proUser, PERMISSIONS.USE_PREMIUM_TEMPLATES) === true);
console.assert(hasPermission(proUser, PERMISSIONS.EXPORT_PDF) === true);

// Test admin
const admin = { role: 'admin', plan: 'free', ... };
console.assert(hasPermission(admin, PERMISSIONS.MANAGE_USERS) === true);
```

---

## 📝 Usage Examples

### Check Permission in Component

```svelte
<script>
  import { currentUser } from '$lib/stores/auth';
  import { hasPermission, PERMISSIONS } from '$lib/utils/permissions';
  
  $: canExportPDF = hasPermission($currentUser, PERMISSIONS.EXPORT_PDF);
</script>

{#if canExportPDF}
  <button on:click={exportToPDF}>Export PDF</button>
{:else}
  <button on:click={showUpgradeModal}>
    Upgrade to Pro to Export PDF
  </button>
{/if}
```

### Protect Route

```typescript
// +page.server.ts
import { redirect } from '@sveltejs/kit';
import { hasPermission, PERMISSIONS } from '$lib/utils/permissions';

export async function load({ locals }) {
  const user = locals.user;
  
  if (!hasPermission(user, PERMISSIONS.MANAGE_USERS)) {
    throw redirect(303, '/dashboard');
  }
  
  return { user };
}
```

### Show Plan Upgrade Prompt

```svelte
<script>
  import { currentUser } from '$lib/stores/auth';
  import { isPlanActive, getDaysUntilExpiry } from '$lib/utils/permissions';
  
  $: planActive = isPlanActive($currentUser);
  $: daysLeft = getDaysUntilExpiry($currentUser);
</script>

{#if !planActive}
  <div class="alert alert-warning">
    Your {$currentUser.plan} plan has expired. 
    <a href="/pricing">Renew now</a>
  </div>
{:else if daysLeft && daysLeft < 7}
  <div class="alert alert-info">
    Your plan expires in {daysLeft} days. 
    <a href="/billing">Manage subscription</a>
  </div>
{/if}
```

---

## 🚀 Deployment Checklist

### Before Going Live

- [ ] Update PocketBase users collection schema
- [ ] Configure SMTP for email verification
- [ ] Enable Cloudflare Bot Fight Mode
- [ ] Set up rate limiting rules
- [ ] Configure environment variables
- [ ] Test all spam prevention measures
- [ ] Test permission system
- [ ] Set up payment provider (if offering paid plans)
- [ ] Create pricing page
- [ ] Set up webhook for payment events
- [ ] Test plan upgrade flow
- [ ] Create admin dashboard
- [ ] Set up monitoring/logging
- [ ] Configure backup strategy
- [ ] Test email verification flow
- [ ] Review security headers
- [ ] Enable HTTPS
- [ ] Test on mobile devices
- [ ] Load testing
- [ ] Security audit

### Post-Launch Monitoring

- Monitor spam attempt logs daily (first week)
- Check registration conversion rate
- Monitor plan upgrade rate
- Review false positives (legitimate users blocked)
- Adjust rate limits if needed
- Monitor server performance
- Check email deliverability

---

## 💰 Cost Estimate

| Service | Free Tier | Paid (if needed) |
|---------|-----------|------------------|
| Cloudflare | ✅ Bot Fight Mode | $20/mo for advanced rules |
| reCAPTCHA | ✅ 1M requests/mo | Free for most sites |
| Email (SendGrid) | ✅ 100 emails/day | $15/mo for 40k emails |
| Stripe | No monthly fee | 2.9% + $0.30 per transaction |
| PocketBase | ✅ Free & open source | Hosting costs only |

**Total estimated cost: $0-50/month** depending on scale

---

## 🆘 Troubleshooting

### Issue: Legitimate users being blocked

**Solution**: Adjust rate limits in `rate-limiter.ts`:
```typescript
REGISTRATION: {
  maxAttempts: 5, // Increase from 3
  windowMs: 3600000
}
```

### Issue: Too much spam getting through

**Solutions**:
1. Add reCAPTCHA
2. Enable Cloudflare Bot Fight Mode
3. Add disposable email blocking
4. Require email verification before access

### Issue: Users can't verify email

**Check**:
1. SMTP settings in PocketBase
2. Email not in spam folder
3. Verification link not expired
4. Email template is correct

### Issue: Plan not upgrading

**Check**:
1. PocketBase schema has `plan_expires` field
2. Payment webhook is configured
3. User has active payment method
4. Check browser console for errors

---

## 📚 Additional Resources

- [PocketBase Documentation](https://pocketbase.io/docs/)
- [Stripe Integration Guide](https://stripe.com/docs/payments/checkout)
- [Cloudflare Rate Limiting](https://developers.cloudflare.com/waf/rate-limiting-rules/)
- [reCAPTCHA v3 Guide](https://developers.google.com/recaptcha/docs/v3)
- [OWASP Security Guidelines](https://owasp.org/www-project-web-security-testing-guide/)

---

## 🎯 Summary

You now have:

✅ **Spam Prevention**
- Honeypot fields (active)
- Timing checks (active)
- Rate limiting (active)
- CSRF protection (active)
- Email obfuscation (component ready)

✅ **Role Management**
- Role system (job_seeker, moderator, admin)
- Permission system (role + plan based)
- Plan upgrade framework
- Expiry management

**Next immediate steps:**
1. Update PocketBase schema (5 minutes)
2. Test registration with new fields
3. Configure email verification
4. Set up Cloudflare (if using)
5. Integrate payment provider (if offering paid plans)

**Estimated time to production-ready: 2-4 hours** (excluding payment integration)
