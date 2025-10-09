# Spam Prevention & Role Management Strategy

## Current State Analysis

### ✅ Existing Protections
- Basic email validation (regex)
- Password strength requirement (8+ characters)
- Client-side form validation
- PocketBase built-in validation

### ❌ Missing Protections
- No honeypot fields
- No timing checks
- No CSRF protection
- No rate limiting
- No CAPTCHA
- No email obfuscation
- No server-side validation layer
- No double opt-in

### Current Role System
- **Plan-based**: `free`, `pro`, `enterprise`
- **No role field**: Missing `job_seeker` vs `admin` distinction
- **No permission system**: No granular access control

---

## Recommended Spam Prevention Strategy

### 1. **Honeypot Field** (Easy Win - Implement First)
**Priority: HIGH | Effort: LOW | Effectiveness: MEDIUM**

```typescript
// Add hidden field that bots will fill but humans won't see
<input
  type="text"
  name="website_url"
  id="website_url"
  autocomplete="off"
  tabindex="-1"
  style="position: absolute; left: -9999px; opacity: 0;"
  bind:value={honeypot}
/>

// Server-side check
if (honeypot !== '') {
  return { success: false, error: 'Invalid submission' };
}
```

**Benefits:**
- Catches 60-70% of basic bots
- Zero user friction
- Easy to implement

---

### 2. **Submit-Time Threshold** (Easy Win)
**Priority: HIGH | Effort: LOW | Effectiveness: MEDIUM**

```typescript
let formStartTime = Date.now();

async function handleRegister() {
  const submitTime = Date.now() - formStartTime;
  
  // Reject if submitted too fast (< 3 seconds)
  if (submitTime < 3000) {
    error = 'Please take your time filling out the form';
    return;
  }
  
  // Reject if submitted too slow (> 30 minutes)
  if (submitTime > 1800000) {
    error = 'Form session expired. Please refresh and try again';
    return;
  }
  
  // Continue with registration...
}
```

**Benefits:**
- Stops automated form submissions
- Detects suspicious behavior
- No user impact for legitimate users

---

### 3. **CSRF Token Protection** (Critical)
**Priority: HIGH | Effort: MEDIUM | Effectiveness: HIGH**

PocketBase has built-in CSRF protection, but we should verify it's enabled:

```typescript
// In hooks.server.ts or +page.server.ts
import { pb } from '$lib/pocketbase';

export async function load({ cookies }) {
  // PocketBase automatically handles CSRF via cookies
  // Ensure cookies are being sent with requests
  pb.authStore.loadFromCookie(cookies.get('pb_auth') || '');
  
  return {
    csrfToken: pb.authStore.token // If needed for additional protection
  };
}
```

**Benefits:**
- Prevents cross-site request forgery
- Essential security measure
- Already partially implemented via PocketBase

---

### 4. **Rate Limiting** (Critical for Production)
**Priority: HIGH | Effort: MEDIUM-HIGH | Effectiveness: HIGH**

**Option A: Cloudflare (Recommended)**
```
Enable in Cloudflare Dashboard:
1. Security > WAF > Rate limiting rules
2. Create rule: 5 registration attempts per IP per hour
3. Create rule: 10 login attempts per IP per 15 minutes
4. Enable "Bot Fight Mode" (free tier)
```

**Option B: Server-Side (If not using Cloudflare)**
```typescript
// lib/utils/rate-limiter.ts
import { writable } from 'svelte/store';

const rateLimitStore = writable<Map<string, number[]>>(new Map());

export function checkRateLimit(
  identifier: string, 
  maxAttempts: number, 
  windowMs: number
): boolean {
  const now = Date.now();
  const attempts = rateLimitStore.get(identifier) || [];
  
  // Remove old attempts outside the window
  const recentAttempts = attempts.filter(time => now - time < windowMs);
  
  if (recentAttempts.length >= maxAttempts) {
    return false; // Rate limit exceeded
  }
  
  recentAttempts.push(now);
  rateLimitStore.set(identifier, recentAttempts);
  return true;
}

// Usage in register
const clientIP = request.headers.get('cf-connecting-ip') || 
                 request.headers.get('x-forwarded-for') || 
                 'unknown';

if (!checkRateLimit(clientIP, 5, 3600000)) { // 5 per hour
  return { success: false, error: 'Too many registration attempts' };
}
```

**Benefits:**
- Prevents brute force attacks
- Stops automated spam
- Essential for production

---

### 5. **reCAPTCHA v3 (Invisible)** (Recommended)
**Priority: MEDIUM | Effort: MEDIUM | Effectiveness: HIGH**

```typescript
// Add to register page
<script>
  import { onMount } from 'svelte';
  
  let recaptchaToken = '';
  
  onMount(() => {
    // Load reCAPTCHA script
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?render=YOUR_SITE_KEY';
    document.head.appendChild(script);
  });
  
  async function handleRegister() {
    // Get reCAPTCHA token
    recaptchaToken = await grecaptcha.execute('YOUR_SITE_KEY', {
      action: 'register'
    });
    
    // Send token with registration request
    const result = await authStore.register(
      email, 
      password, 
      name, 
      username,
      recaptchaToken
    );
  }
</script>
```

**Server-side verification:**
```typescript
// Verify reCAPTCHA token
const verifyResponse = await fetch(
  'https://www.google.com/recaptcha/api/siteverify',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${RECAPTCHA_SECRET}&response=${recaptchaToken}`
  }
);

const verifyData = await verifyResponse.json();

if (!verifyData.success || verifyData.score < 0.5) {
  return { success: false, error: 'Verification failed' };
}
```

**Benefits:**
- Invisible to users (no checkbox)
- Highly effective against bots
- Industry standard
- Free tier available

**Alternative: hCaptcha** (Privacy-focused, GDPR-compliant)

---

### 6. **Email Obfuscation** (Low Priority)
**Priority: LOW | Effort: LOW | Effectiveness: LOW**

```svelte
<!-- Instead of plain text -->
<a href="mailto:contact@example.com">contact@example.com</a>

<!-- Use obfuscation -->
<a href="mailto:contact{String.fromCharCode(64)}example.com">
  contact<span aria-hidden="true">@</span>example.com
</a>

<!-- Or JavaScript injection -->
<script>
  const email = ['contact', 'example.com'].join('@');
</script>
<a href="mailto:{email}">{email}</a>
```

**Benefits:**
- Reduces email harvesting
- Minimal effort
- No user impact

---

### 7. **Double Opt-In** (Recommended for Production)
**Priority: MEDIUM | Effort: MEDIUM | Effectiveness: HIGH**

```typescript
// After registration
async register(email, password, name, username) {
  // Create user with verified: false
  const user = await pb.collection('users').create({
    email,
    password,
    passwordConfirm: password,
    name,
    username,
    verified: false,
    plan: 'free',
    role: 'job_seeker'
  });
  
  // Send verification email
  await pb.collection('users').requestVerification(email);
  
  return { 
    success: true, 
    message: 'Please check your email to verify your account' 
  };
}
```

**Benefits:**
- Confirms real email addresses
- Reduces fake accounts
- Industry best practice
- PocketBase has built-in support

---

### 8. **Server-Side Validation Layer**
**Priority: HIGH | Effort: MEDIUM | Effectiveness: HIGH**

```typescript
// lib/utils/validation.ts
export function validateRegistration(data: {
  email: string;
  password: string;
  name: string;
  username: string;
  honeypot?: string;
  submitTime?: number;
}) {
  const errors: string[] = [];
  
  // Honeypot check
  if (data.honeypot) {
    return { valid: false, errors: ['Invalid submission'] };
  }
  
  // Timing check
  if (data.submitTime && data.submitTime < 3000) {
    return { valid: false, errors: ['Please slow down'] };
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    errors.push('Invalid email format');
  }
  
  // Block disposable email domains
  const disposableDomains = [
    'tempmail.com', 'guerrillamail.com', '10minutemail.com',
    'mailinator.com', 'throwaway.email'
  ];
  const emailDomain = data.email.split('@')[1]?.toLowerCase();
  if (disposableDomains.includes(emailDomain)) {
    errors.push('Disposable email addresses are not allowed');
  }
  
  // Password strength
  if (data.password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  
  // Username validation
  if (!/^[a-zA-Z0-9_-]{3,20}$/.test(data.username)) {
    errors.push('Username must be 3-20 characters (letters, numbers, _, -)');
  }
  
  // Name validation
  if (data.name.length < 2 || data.name.length > 100) {
    errors.push('Name must be 2-100 characters');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
```

---

### 9. **Spam TLD Blocklist** (Optional)
**Priority: LOW | Effort: LOW | Effectiveness: LOW**

```typescript
const spamTLDs = ['.xyz', '.top', '.work', '.click', '.link'];
const emailDomain = email.split('@')[1]?.toLowerCase();

if (spamTLDs.some(tld => emailDomain.endsWith(tld))) {
  return { 
    success: false, 
    error: 'This email domain is not supported' 
  };
}
```

**Note:** Be careful with this - some legitimate users may use these TLDs.

---

## Role Management Strategy

### Recommended Role System

```typescript
// Update User interface
export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  avatar?: string;
  
  // Role system
  role: 'job_seeker' | 'admin' | 'moderator';
  
  // Plan system (separate from roles)
  plan: 'free' | 'pro' | 'enterprise';
  plan_expires?: string; // For subscription management
  
  // Permissions
  permissions?: string[]; // ['create_resume', 'edit_templates', 'manage_users']
  
  // Status
  verified: boolean;
  active: boolean;
  
  created: string;
  updated: string;
}
```

### Role Hierarchy

```typescript
// lib/utils/permissions.ts
export const ROLES = {
  JOB_SEEKER: 'job_seeker',
  MODERATOR: 'moderator',
  ADMIN: 'admin'
} as const;

export const PERMISSIONS = {
  // Job Seeker permissions
  CREATE_RESUME: 'create_resume',
  EDIT_OWN_RESUME: 'edit_own_resume',
  DELETE_OWN_RESUME: 'delete_own_resume',
  VIEW_TEMPLATES: 'view_templates',
  
  // Pro plan permissions
  USE_PREMIUM_TEMPLATES: 'use_premium_templates',
  EXPORT_PDF: 'export_pdf',
  CUSTOM_DOMAIN: 'custom_domain',
  
  // Moderator permissions
  VIEW_ALL_RESUMES: 'view_all_resumes',
  MODERATE_CONTENT: 'moderate_content',
  
  // Admin permissions
  MANAGE_USERS: 'manage_users',
  MANAGE_TEMPLATES: 'manage_templates',
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_BILLING: 'manage_billing'
} as const;

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  [ROLES.JOB_SEEKER]: [
    PERMISSIONS.CREATE_RESUME,
    PERMISSIONS.EDIT_OWN_RESUME,
    PERMISSIONS.DELETE_OWN_RESUME,
    PERMISSIONS.VIEW_TEMPLATES
  ],
  [ROLES.MODERATOR]: [
    ...ROLE_PERMISSIONS[ROLES.JOB_SEEKER],
    PERMISSIONS.VIEW_ALL_RESUMES,
    PERMISSIONS.MODERATE_CONTENT
  ],
  [ROLES.ADMIN]: [
    ...ROLE_PERMISSIONS[ROLES.MODERATOR],
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_TEMPLATES,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_BILLING
  ]
};

// Check if user has permission
export function hasPermission(user: User, permission: string): boolean {
  const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
  
  // Check role-based permissions
  if (rolePermissions.includes(permission)) {
    return true;
  }
  
  // Check plan-based permissions
  if (user.plan === 'pro' || user.plan === 'enterprise') {
    const proPlanPermissions = [
      PERMISSIONS.USE_PREMIUM_TEMPLATES,
      PERMISSIONS.EXPORT_PDF
    ];
    if (proPlanPermissions.includes(permission)) {
      return true;
    }
  }
  
  if (user.plan === 'enterprise') {
    if (permission === PERMISSIONS.CUSTOM_DOMAIN) {
      return true;
    }
  }
  
  return false;
}

// Check if user has role
export function hasRole(user: User, role: string): boolean {
  return user.role === role;
}

// Check if user is admin
export function isAdmin(user: User): boolean {
  return user.role === ROLES.ADMIN;
}
```

### Plan Upgrade Strategy

```typescript
// lib/utils/plan-upgrade.ts
export async function upgradeToPro(userId: string, paymentData: any) {
  try {
    // 1. Process payment (Stripe, PayPal, etc.)
    const payment = await processPayment(paymentData);
    
    if (!payment.success) {
      return { success: false, error: 'Payment failed' };
    }
    
    // 2. Update user plan
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1); // 1 month subscription
    
    const updatedUser = await pb.collection('users').update(userId, {
      plan: 'pro',
      plan_expires: expiryDate.toISOString(),
      plan_payment_id: payment.id
    });
    
    // 3. Create subscription record
    await pb.collection('subscriptions').create({
      user: userId,
      plan: 'pro',
      status: 'active',
      payment_id: payment.id,
      started_at: new Date().toISOString(),
      expires_at: expiryDate.toISOString()
    });
    
    // 4. Send confirmation email
    await sendPlanUpgradeEmail(updatedUser.email, 'pro');
    
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error('Plan upgrade error:', error);
    return { success: false, error: 'Upgrade failed' };
  }
}

// Check if plan is active
export function isPlanActive(user: User): boolean {
  if (user.plan === 'free') return true;
  
  if (!user.plan_expires) return false;
  
  const expiryDate = new Date(user.plan_expires);
  return expiryDate > new Date();
}

// Downgrade expired plans (run as cron job)
export async function checkExpiredPlans() {
  const users = await pb.collection('users').getFullList({
    filter: 'plan != "free" && plan_expires < @now'
  });
  
  for (const user of users) {
    await pb.collection('users').update(user.id, {
      plan: 'free',
      plan_expires: null
    });
    
    await sendPlanExpiredEmail(user.email);
  }
}
```

### Registration with Role

```typescript
// Update registration to include role
async register(email, password, name, username) {
  const userData = {
    email,
    password,
    passwordConfirm: password,
    name,
    username,
    role: 'job_seeker', // Default role
    plan: 'free',       // Default plan
    verified: false,    // Requires email verification
    active: true
  };
  
  const user = await pb.collection('users').create(userData);
  
  // Send verification email
  await pb.collection('users').requestVerification(email);
  
  return { 
    success: true, 
    message: 'Please verify your email to complete registration' 
  };
}
```

---

## Implementation Priority

### Phase 1: Quick Wins (Week 1)
1. ✅ Honeypot field
2. ✅ Submit-time threshold
3. ✅ Server-side validation layer
4. ✅ Role field in User model
5. ✅ Basic permission system

### Phase 2: Essential Security (Week 2)
1. ✅ CSRF verification
2. ✅ Rate limiting (Cloudflare or server-side)
3. ✅ Double opt-in email verification
4. ✅ Disposable email blocking

### Phase 3: Advanced Protection (Week 3-4)
1. ✅ reCAPTCHA v3 integration
2. ✅ Email obfuscation
3. ✅ Plan upgrade system
4. ✅ Subscription management
5. ✅ Admin dashboard for user management

### Phase 4: Monitoring & Optimization (Ongoing)
1. ✅ Analytics for spam attempts
2. ✅ Automated plan expiry checks
3. ✅ User behavior monitoring
4. ✅ Regular security audits

---

## Cost Considerations

| Solution | Cost | Effectiveness |
|----------|------|---------------|
| Honeypot | Free | Medium |
| Timing checks | Free | Medium |
| CSRF tokens | Free | High |
| Rate limiting (Cloudflare) | Free tier available | High |
| reCAPTCHA v3 | Free (1M requests/month) | High |
| hCaptcha | Free | High |
| Email verification | Free (PocketBase built-in) | High |
| Server-side validation | Free | High |

**Total estimated cost for recommended setup: $0-20/month**

---

## Monitoring & Metrics

Track these metrics to measure effectiveness:

```typescript
// lib/stores/spam-metrics.ts
export interface SpamMetrics {
  honeypot_catches: number;
  timing_violations: number;
  rate_limit_hits: number;
  captcha_failures: number;
  disposable_email_blocks: number;
  total_registrations: number;
  verified_registrations: number;
}

// Log spam attempts
export async function logSpamAttempt(type: string, details: any) {
  await pb.collection('spam_logs').create({
    type,
    details,
    ip: details.ip,
    user_agent: details.userAgent,
    timestamp: new Date().toISOString()
  });
}
```

---

## Conclusion

**Recommended Minimal Setup (Production-Ready):**
1. Honeypot field ✅
2. Submit-time threshold ✅
3. Rate limiting (Cloudflare) ✅
4. Double opt-in email verification ✅
5. Server-side validation ✅
6. Role-based access control ✅
7. Plan upgrade system ✅

**Optional Enhancements:**
- reCAPTCHA v3 (if spam persists)
- Email obfuscation (low priority)
- TLD blocklist (use with caution)

This strategy provides **layered defense** - if one measure fails, others catch the spam. The combination of honeypot, timing, rate limiting, and email verification should block 95%+ of automated spam while maintaining excellent user experience.
