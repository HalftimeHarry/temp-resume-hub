/**
 * User Profile Store - Manages user profile data and preferences
 * Used for enhanced template recommendations and personalization
 */

import { writable, derived } from 'svelte/store';
import { pb } from '$lib/pocketbase';
import { currentUser } from './auth';

// User profile interface
export interface UserProfile {
  id: string;
  user: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  location?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  target_industry?: string;
  experience_level?: 'entry' | 'junior' | 'mid' | 'senior' | 'executive' | 'student' | 'career_change';
  target_job_titles?: string;
  key_skills?: string;
  career_stage?: 'first_job' | 'career_growth' | 'career_change' | 'promotion_seeking' | 'industry_switch' | 'returning_to_work' | 'freelance_to_fulltime' | 'executive_level';
  preferred_work_type?: string[];
  salary_expectation_min?: number;
  salary_expectation_max?: number;
  education_level?: 'high_school' | 'some_college' | 'associates' | 'bachelors' | 'masters' | 'doctorate' | 'professional' | 'bootcamp' | 'certification';
  certifications?: string;
  willing_to_relocate?: boolean;
  template_preferences?: any;
  onboarding_data?: any;
  profile_completed?: boolean;
  profile_completed_at?: string;
  created: string;
  updated: string;
}

// Profile stores
export const userProfile = writable<UserProfile | null>(null);
export const isLoadingProfile = writable(false);
export const profileError = writable<string | null>(null);

// Derived stores
export const profileCompletionPercentage = derived(userProfile, ($profile) => {
  if (!$profile) return 0;
  
  // Comprehensive list of important profile fields
  const allFields = [
    'first_name',
    'last_name',
    'location',
    'phone',
    'linkedin_url',
    'target_industry',
    'experience_level',
    'target_job_titles',
    'key_skills',
    'career_stage',
    'education_level',
    'preferred_work_type'
  ];
  
  const filledFields = allFields.filter(field => {
    const value = $profile[field as keyof UserProfile];
    if (field === 'preferred_work_type') {
      // Check if array has at least one item
      return Array.isArray(value) && value.length > 0;
    }
    return value && value !== '';
  });
  
  return Math.round((filledFields.length / allFields.length) * 100);
});

export const isProfileComplete = derived(profileCompletionPercentage, ($percentage) => {
  // Consider profile complete when it's 85% or higher
  return $percentage >= 85;
});

// Profile operations
export const userProfileStore = {
  // Load user profile
  async loadProfile(userId?: string): Promise<UserProfile | null> {
    isLoadingProfile.set(true);
    profileError.set(null);
    
    try {
      const targetUserId = userId || pb.authStore.model?.id;
      if (!targetUserId) {
        throw new Error('No user ID provided');
      }
      
      console.log('🔄 Loading user profile for:', targetUserId);
      
      const profiles = await pb.collection('user_profiles').getFullList({
        filter: `user = "${targetUserId}"`
      });
      
      if (profiles.length === 0) {
        console.log('📝 No profile found, user needs to complete profile');
        userProfile.set(null);
        return null;
      }
      
      const profile = profiles[0] as UserProfile;
      console.log('✅ User profile loaded:', profile.id);
      
      userProfile.set(profile);
      return profile;
      
    } catch (error: any) {
      console.error('❌ Error loading user profile:', error);
      profileError.set(error.message || 'Failed to load profile');
      
      // If collection doesn't exist, that's expected during development
      if (error.status === 404) {
        console.warn('⚠️ user_profiles collection not found');
        profileError.set('Profile system not yet set up');
      }
      
      return null;
    } finally {
      isLoadingProfile.set(false);
    }
  },
  
  // Create or update profile
  async saveProfile(profileData: Partial<UserProfile>): Promise<UserProfile | null> {
    isLoadingProfile.set(true);
    profileError.set(null);
    
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // Check if profile exists
      const existingProfiles = await pb.collection('user_profiles').getFullList({
        filter: `user = "${userId}"`
      });
      
      let profile: UserProfile;
      
      if (existingProfiles.length > 0) {
        // Update existing profile
        console.log('🔄 Updating existing profile:', existingProfiles[0].id);
        
        const updateData = {
          ...profileData,
          profile_completed: this.checkProfileCompletion(profileData),
          profile_completed_at: this.checkProfileCompletion(profileData) ? new Date().toISOString() : undefined
        };
        
        profile = await pb.collection('user_profiles').update(existingProfiles[0].id, updateData);
      } else {
        // Create new profile
        console.log('🆕 Creating new profile for user:', userId);
        
        const createData = {
          user: userId,
          ...profileData,
          profile_completed: this.checkProfileCompletion(profileData),
          profile_completed_at: this.checkProfileCompletion(profileData) ? new Date().toISOString() : undefined
        };
        
        profile = await pb.collection('user_profiles').create(createData);
      }
      
      console.log('✅ Profile saved successfully:', profile.id);
      userProfile.set(profile);
      return profile;
      
    } catch (error: any) {
      console.error('❌ Error saving profile:', error);
      profileError.set(error.message || 'Failed to save profile');
      return null;
    } finally {
      isLoadingProfile.set(false);
    }
  },
  
  // Check if profile is complete enough for recommendations
  checkProfileCompletion(profileData: Partial<UserProfile>): boolean {
    // Calculate completion percentage for this profile data
    const allFields = [
      'first_name',
      'last_name',
      'location',
      'phone',
      'linkedin_url',
      'target_industry',
      'experience_level',
      'target_job_titles',
      'key_skills',
      'career_stage',
      'education_level',
      'preferred_work_type'
    ];
    
    const filledFields = allFields.filter(field => {
      const value = profileData[field as keyof UserProfile];
      if (field === 'preferred_work_type') {
        return Array.isArray(value) && value.length > 0;
      }
      return value && value !== '';
    });
    
    const percentage = Math.round((filledFields.length / allFields.length) * 100);
    return percentage >= 85;
  },
  
  // Get profile data for template recommendations
  getRecommendationCriteria(): any {
    const profile = userProfile;
    let currentProfile: UserProfile | null = null;
    
    profile.subscribe(p => currentProfile = p)();
    
    if (!currentProfile) {
      return {
        targetIndustry: 'general',
        experienceLevel: 'entry',
        jobTypes: ['general']
      };
    }
    
    return {
      targetIndustry: currentProfile.target_industry || 'general',
      experienceLevel: currentProfile.experience_level || 'entry',
      jobTypes: currentProfile.target_job_titles?.split(',').map(t => t.trim()) || ['general'],
      careerStage: currentProfile.career_stage,
      skills: currentProfile.key_skills?.split(',').map(s => s.trim()) || [],
      educationLevel: currentProfile.education_level,
      workType: currentProfile.preferred_work_type || []
    };
  },
  
  // Update template preferences
  async updateTemplatePreferences(preferences: any): Promise<boolean> {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) return false;
      
      const result = await this.saveProfile({
        template_preferences: preferences
      });
      
      return result !== null;
    } catch (error) {
      console.error('Error updating template preferences:', error);
      return false;
    }
  },
  
  // Mark onboarding as complete
  async completeOnboarding(onboardingData: any): Promise<boolean> {
    try {
      const result = await this.saveProfile({
        onboarding_data: {
          ...onboardingData,
          completed_at: new Date().toISOString()
        }
      });
      
      return result !== null;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return false;
    }
  }
};

// Auto-load profile when user changes
currentUser.subscribe(async (user) => {
  if (user) {
    console.log('👤 User changed, loading profile for:', user.email);
    await userProfileStore.loadProfile(user.id);
  } else {
    console.log('👤 User logged out, clearing profile');
    userProfile.set(null);
  }
});