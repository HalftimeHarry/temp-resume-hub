/**
 * Role-based access control (RBAC) and permission management
 */

import type { User } from '$lib/types';

// Role definitions
export const ROLES = {
  JOB_SEEKER: 'job_seeker',
  MODERATOR: 'moderator',
  ADMIN: 'admin'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

// Permission definitions
export const PERMISSIONS = {
  // Basic resume permissions (all authenticated users)
  CREATE_RESUME: 'create_resume',
  EDIT_OWN_RESUME: 'edit_own_resume',
  DELETE_OWN_RESUME: 'delete_own_resume',
  VIEW_OWN_RESUME: 'view_own_resume',
  
  // Template permissions
  VIEW_TEMPLATES: 'view_templates',
  USE_FREE_TEMPLATES: 'use_free_templates',
  USE_PREMIUM_TEMPLATES: 'use_premium_templates',
  
  // Export permissions
  EXPORT_PDF: 'export_pdf',
  EXPORT_DOCX: 'export_docx',
  
  // Sharing permissions
  SHARE_RESUME: 'share_resume',
  CUSTOM_DOMAIN: 'custom_domain',
  
  // Analytics permissions
  VIEW_OWN_ANALYTICS: 'view_own_analytics',
  VIEW_ALL_ANALYTICS: 'view_all_analytics',
  
  // Moderation permissions
  VIEW_ALL_RESUMES: 'view_all_resumes',
  MODERATE_CONTENT: 'moderate_content',
  BAN_USERS: 'ban_users',
  
  // Admin permissions
  MANAGE_USERS: 'manage_users',
  MANAGE_TEMPLATES: 'manage_templates',
  MANAGE_BILLING: 'manage_billing',
  VIEW_SYSTEM_LOGS: 'view_system_logs',
  MANAGE_SETTINGS: 'manage_settings'
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Role-based permissions mapping
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.JOB_SEEKER]: [
    PERMISSIONS.CREATE_RESUME,
    PERMISSIONS.EDIT_OWN_RESUME,
    PERMISSIONS.DELETE_OWN_RESUME,
    PERMISSIONS.VIEW_OWN_RESUME,
    PERMISSIONS.VIEW_TEMPLATES,
    PERMISSIONS.USE_FREE_TEMPLATES,
    PERMISSIONS.SHARE_RESUME,
    PERMISSIONS.VIEW_OWN_ANALYTICS
  ],
  [ROLES.MODERATOR]: [
    // Inherits all job_seeker permissions
    PERMISSIONS.CREATE_RESUME,
    PERMISSIONS.EDIT_OWN_RESUME,
    PERMISSIONS.DELETE_OWN_RESUME,
    PERMISSIONS.VIEW_OWN_RESUME,
    PERMISSIONS.VIEW_TEMPLATES,
    PERMISSIONS.USE_FREE_TEMPLATES,
    PERMISSIONS.SHARE_RESUME,
    PERMISSIONS.VIEW_OWN_ANALYTICS,
    // Plus moderation permissions
    PERMISSIONS.VIEW_ALL_RESUMES,
    PERMISSIONS.MODERATE_CONTENT,
    PERMISSIONS.BAN_USERS
  ],
  [ROLES.ADMIN]: [
    // Inherits all moderator permissions
    PERMISSIONS.CREATE_RESUME,
    PERMISSIONS.EDIT_OWN_RESUME,
    PERMISSIONS.DELETE_OWN_RESUME,
    PERMISSIONS.VIEW_OWN_RESUME,
    PERMISSIONS.VIEW_TEMPLATES,
    PERMISSIONS.USE_FREE_TEMPLATES,
    PERMISSIONS.SHARE_RESUME,
    PERMISSIONS.VIEW_OWN_ANALYTICS,
    PERMISSIONS.VIEW_ALL_RESUMES,
    PERMISSIONS.MODERATE_CONTENT,
    PERMISSIONS.BAN_USERS,
    // Plus admin permissions
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_TEMPLATES,
    PERMISSIONS.MANAGE_BILLING,
    PERMISSIONS.VIEW_SYSTEM_LOGS,
    PERMISSIONS.MANAGE_SETTINGS,
    PERMISSIONS.VIEW_ALL_ANALYTICS,
    // Admin gets all premium features
    PERMISSIONS.USE_PREMIUM_TEMPLATES,
    PERMISSIONS.EXPORT_PDF,
    PERMISSIONS.EXPORT_DOCX,
    PERMISSIONS.CUSTOM_DOMAIN
  ]
};

// Plan-based permissions (subscription features)
export const PLAN_PERMISSIONS: Record<string, Permission[]> = {
  free: [
    // Free plan gets basic permissions only
  ],
  pro: [
    PERMISSIONS.USE_PREMIUM_TEMPLATES,
    PERMISSIONS.EXPORT_PDF,
    PERMISSIONS.EXPORT_DOCX
  ],
  enterprise: [
    PERMISSIONS.USE_PREMIUM_TEMPLATES,
    PERMISSIONS.EXPORT_PDF,
    PERMISSIONS.EXPORT_DOCX,
    PERMISSIONS.CUSTOM_DOMAIN,
    PERMISSIONS.VIEW_OWN_ANALYTICS
  ]
};

/**
 * Check if user has a specific permission
 */
export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false;
  
  // Check role-based permissions
  const rolePermissions = ROLE_PERMISSIONS[user.role as Role] || [];
  if (rolePermissions.includes(permission)) {
    return true;
  }
  
  // Check plan-based permissions (only if plan is active)
  if (isPlanActive(user)) {
    const planPermissions = PLAN_PERMISSIONS[user.plan] || [];
    if (planPermissions.includes(permission)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: User | null, role: Role): boolean {
  if (!user) return false;
  return user.role === role;
}

/**
 * Check if user is admin
 */
export function isAdmin(user: User | null): boolean {
  return hasRole(user, ROLES.ADMIN);
}

/**
 * Check if user is moderator or admin
 */
export function isModerator(user: User | null): boolean {
  if (!user) return false;
  return user.role === ROLES.MODERATOR || user.role === ROLES.ADMIN;
}

/**
 * Check if user's plan is active
 */
export function isPlanActive(user: User | null): boolean {
  if (!user) return false;
  
  // Free plan is always active
  if (user.plan === 'free') return true;
  
  // Check if plan has expired
  if (!user.plan_expires) return false;
  
  const expiryDate = new Date(user.plan_expires);
  const now = new Date();
  
  return expiryDate > now;
}

/**
 * Get days until plan expires
 */
export function getDaysUntilExpiry(user: User | null): number | null {
  if (!user || !user.plan_expires) return null;
  
  const expiryDate = new Date(user.plan_expires);
  const now = new Date();
  const diffTime = expiryDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Check if user can upgrade to a specific plan
 */
export function canUpgradeTo(user: User | null, targetPlan: 'pro' | 'enterprise'): boolean {
  if (!user) return false;
  
  const planHierarchy = { free: 0, pro: 1, enterprise: 2 };
  const currentLevel = planHierarchy[user.plan] || 0;
  const targetLevel = planHierarchy[targetPlan] || 0;
  
  return targetLevel > currentLevel;
}

/**
 * Get all permissions for a user
 */
export function getUserPermissions(user: User | null): Permission[] {
  if (!user) return [];
  
  const rolePermissions = ROLE_PERMISSIONS[user.role as Role] || [];
  const planPermissions = isPlanActive(user) ? (PLAN_PERMISSIONS[user.plan] || []) : [];
  
  // Combine and deduplicate
  return [...new Set([...rolePermissions, ...planPermissions])];
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(user: User | null, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(user, permission));
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(user: User | null, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(user, permission));
}

/**
 * Get user's role display name
 */
export function getRoleDisplayName(role: Role): string {
  const displayNames: Record<Role, string> = {
    [ROLES.JOB_SEEKER]: 'Job Seeker',
    [ROLES.MODERATOR]: 'Moderator',
    [ROLES.ADMIN]: 'Administrator'
  };
  return displayNames[role] || role;
}

/**
 * Get plan display name
 */
export function getPlanDisplayName(plan: string): string {
  const displayNames: Record<string, string> = {
    free: 'Free',
    pro: 'Pro',
    enterprise: 'Enterprise'
  };
  return displayNames[plan] || plan;
}
