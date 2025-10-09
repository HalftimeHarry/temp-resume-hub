/**
 * Plan upgrade and subscription management utilities
 * Works with user_profiles collection
 */

import { pb } from '$lib/pocketbase';
import type { UserProfile } from '$lib/types';

export interface UpgradeResult {
  success: boolean;
  profile?: UserProfile;
  error?: string;
}

export interface PlanPricing {
  plan: 'pro' | 'enterprise';
  monthly: number;
  yearly: number;
  features: string[];
}

// Plan pricing configuration
export const PLAN_PRICING: Record<'pro' | 'enterprise', PlanPricing> = {
  pro: {
    plan: 'pro',
    monthly: 9.99,
    yearly: 99.99, // ~$8.33/month
    features: [
      'Unlimited resumes',
      'Premium templates',
      'PDF & DOCX export',
      'Priority support',
      'No watermark',
      'Custom colors'
    ]
  },
  enterprise: {
    plan: 'enterprise',
    monthly: 29.99,
    yearly: 299.99, // ~$25/month
    features: [
      'Everything in Pro',
      'Custom domain',
      'Advanced analytics',
      'Team collaboration',
      'API access',
      'Dedicated support',
      'White-label option'
    ]
  }
};

/**
 * Upgrade user to Pro plan
 * Note: This is a placeholder. In production, integrate with:
 * - Stripe (recommended)
 * - PayPal
 * - Paddle
 * - LemonSqueezy
 */
export async function upgradeToPro(
  userId: string,
  billingCycle: 'monthly' | 'yearly',
  paymentData?: any
): Promise<UpgradeResult> {
  try {
    // TODO: Process payment with payment provider
    // const payment = await processStripePayment(paymentData);
    // if (!payment.success) {
    //   return { success: false, error: 'Payment failed' };
    // }
    
    // Calculate expiry date
    const expiryDate = new Date();
    if (billingCycle === 'monthly') {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    } else {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    }
    
    // Get user's profile
    const profiles = await pb.collection('user_profiles').getFullList({
      filter: `user = "${userId}"`
    });
    
    if (profiles.length === 0) {
      return { success: false, error: 'User profile not found' };
    }
    
    // Update profile with new plan
    const updatedProfile = await pb.collection('user_profiles').update(profiles[0].id, {
      plan: 'pro',
      plan_expires: expiryDate.toISOString(),
      plan_payment_id: paymentData?.paymentId || null
    });
    
    // TODO: Create subscription record
    // await pb.collection('subscriptions').create({
    //   user: userId,
    //   plan: 'pro',
    //   billing_cycle: billingCycle,
    //   status: 'active',
    //   payment_id: payment.id,
    //   started_at: new Date().toISOString(),
    //   expires_at: expiryDate.toISOString(),
    //   amount: billingCycle === 'monthly' ? PLAN_PRICING.pro.monthly : PLAN_PRICING.pro.yearly
    // });
    
    // TODO: Send confirmation email
    // await sendPlanUpgradeEmail(user.email, 'pro', billingCycle);
    
    return { success: true, profile: updatedProfile };
  } catch (error: any) {
    console.error('Plan upgrade error:', error);
    return { 
      success: false, 
      error: error.message || 'Upgrade failed. Please try again.' 
    };
  }
}

/**
 * Upgrade user to Enterprise plan
 */
export async function upgradeToEnterprise(
  userId: string,
  billingCycle: 'monthly' | 'yearly',
  paymentData?: any
): Promise<UpgradeResult> {
  try {
    // TODO: Process payment
    
    const expiryDate = new Date();
    if (billingCycle === 'monthly') {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    } else {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    }
    
    // Get user's profile
    const profiles = await pb.collection('user_profiles').getFullList({
      filter: `user = "${userId}"`
    });
    
    if (profiles.length === 0) {
      return { success: false, error: 'User profile not found' };
    }
    
    const updatedProfile = await pb.collection('user_profiles').update(profiles[0].id, {
      plan: 'enterprise',
      plan_expires: expiryDate.toISOString(),
      plan_payment_id: paymentData?.paymentId || null
    });
    
    // TODO: Create subscription record and send email
    
    return { success: true, profile: updatedProfile };
  } catch (error: any) {
    console.error('Plan upgrade error:', error);
    return { 
      success: false, 
      error: error.message || 'Upgrade failed. Please try again.' 
    };
  }
}

/**
 * Downgrade user to free plan
 */
export async function downgradeToFree(userId: string): Promise<UpgradeResult> {
  try {
    // Get user's profile
    const profiles = await pb.collection('user_profiles').getFullList({
      filter: `user = "${userId}"`
    });
    
    if (profiles.length === 0) {
      return { success: false, error: 'User profile not found' };
    }
    
    const updatedProfile = await pb.collection('user_profiles').update(profiles[0].id, {
      plan: 'free',
      plan_expires: null,
      plan_payment_id: null
    });
    
    // TODO: Cancel subscription with payment provider
    // TODO: Send downgrade confirmation email
    
    return { success: true, profile: updatedProfile };
  } catch (error: any) {
    console.error('Plan downgrade error:', error);
    return { 
      success: false, 
      error: error.message || 'Downgrade failed. Please try again.' 
    };
  }
}

/**
 * Check and process expired plans
 * This should be run as a cron job or scheduled task
 */
export async function processExpiredPlans(): Promise<void> {
  try {
    // Find profiles with expired plans
    const expiredProfiles = await pb.collection('user_profiles').getFullList({
      filter: 'plan != "free" && plan_expires < @now'
    });
    
    console.log(`Found ${expiredProfiles.length} expired plans to process`);
    
    for (const profile of expiredProfiles) {
      try {
        // Downgrade to free
        await pb.collection('user_profiles').update(profile.id, {
          plan: 'free',
          plan_expires: null
        });
        
        // TODO: Send expiry notification email
        // Get user email from users collection
        // const user = await pb.collection('users').getOne(profile.user);
        // await sendPlanExpiredEmail(user.email, profile.plan);
        
        console.log(`Downgraded profile ${profile.id} from ${profile.plan} to free`);
      } catch (error) {
        console.error(`Failed to downgrade profile ${profile.id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error processing expired plans:', error);
  }
}

/**
 * Get plan comparison data for pricing page
 */
export function getPlanComparison() {
  return {
    free: {
      name: 'Free',
      price: 0,
      features: [
        '1 resume',
        'Basic templates',
        'Online sharing',
        'Community support'
      ],
      limitations: [
        'Watermark on exports',
        'Limited templates',
        'No PDF export'
      ]
    },
    pro: {
      name: 'Pro',
      monthlyPrice: PLAN_PRICING.pro.monthly,
      yearlyPrice: PLAN_PRICING.pro.yearly,
      features: PLAN_PRICING.pro.features,
      popular: true
    },
    enterprise: {
      name: 'Enterprise',
      monthlyPrice: PLAN_PRICING.enterprise.monthly,
      yearlyPrice: PLAN_PRICING.enterprise.yearly,
      features: PLAN_PRICING.enterprise.features
    }
  };
}

/**
 * Calculate savings for yearly billing
 */
export function calculateYearlySavings(plan: 'pro' | 'enterprise'): number {
  const pricing = PLAN_PRICING[plan];
  const monthlyTotal = pricing.monthly * 12;
  const yearlySavings = monthlyTotal - pricing.yearly;
  return Math.round(yearlySavings * 100) / 100;
}

/**
 * Get savings percentage for yearly billing
 */
export function getYearlySavingsPercentage(plan: 'pro' | 'enterprise'): number {
  const pricing = PLAN_PRICING[plan];
  const monthlyTotal = pricing.monthly * 12;
  const savings = monthlyTotal - pricing.yearly;
  const percentage = (savings / monthlyTotal) * 100;
  return Math.round(percentage);
}
