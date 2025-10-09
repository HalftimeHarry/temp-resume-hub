/**
 * Industry seed data for bootstrapping resumes
 * Separates content/data from visual templates
 */

import { ENTRY_LEVEL_SEED_DATA } from './entry-level';
import { PROFESSIONAL_SEED_DATA } from './professional';
import type { IndustrySeedData } from './types';

export * from './types';

/**
 * All available industry seed data
 */
export const INDUSTRY_SEED_DATA: Record<string, IndustrySeedData> = {
  ...ENTRY_LEVEL_SEED_DATA,
  ...PROFESSIONAL_SEED_DATA
};

/**
 * Get seed data by industry ID
 */
export function getSeedData(industryId: string): IndustrySeedData | undefined {
  return INDUSTRY_SEED_DATA[industryId];
}

/**
 * Get all seed data IDs
 */
export function getSeedDataIds(): string[] {
  return Object.keys(INDUSTRY_SEED_DATA);
}

/**
 * Get seed data by category
 */
export function getSeedDataByCategory(category: 'entry-level' | 'professional' | 'specialized'): IndustrySeedData[] {
  return Object.values(INDUSTRY_SEED_DATA).filter(data => data.category === category);
}

/**
 * Search seed data by role or industry
 */
export function searchSeedData(query: string): IndustrySeedData[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(INDUSTRY_SEED_DATA).filter(data =>
    data.name.toLowerCase().includes(lowerQuery) ||
    data.description.toLowerCase().includes(lowerQuery) ||
    data.targetRoles.some(role => role.toLowerCase().includes(lowerQuery)) ||
    data.targetIndustries.some(industry => industry.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get recommended seed data based on user profile
 */
export function getRecommendedSeedData(profile: {
  target_industry?: string;
  experience_level?: string;
  target_job_titles?: string;
}): IndustrySeedData[] {
  const recommendations: Array<{ data: IndustrySeedData; score: number }> = [];
  
  Object.values(INDUSTRY_SEED_DATA).forEach(data => {
    let score = 0;
    
    // Match industry
    if (profile.target_industry && data.targetIndustries.includes(profile.target_industry)) {
      score += 50;
    }
    
    // Match experience level
    if (profile.experience_level && data.experienceLevel.includes(profile.experience_level)) {
      score += 30;
    }
    
    // Match job titles
    if (profile.target_job_titles) {
      const jobTitles = profile.target_job_titles.toLowerCase();
      const hasMatch = data.targetRoles.some(role => 
        jobTitles.includes(role.toLowerCase())
      );
      if (hasMatch) {
        score += 40;
      }
    }
    
    if (score > 0) {
      recommendations.push({ data, score });
    }
  });
  
  // Sort by score and return top results
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(item => item.data);
}
