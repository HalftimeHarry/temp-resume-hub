import { describe, it, expect, beforeEach } from 'vitest';
import { 
  TemplateRecommendationService,
  getTemplateRecommendations,
  getTopRecommendations,
  isTemplateRecommended,
  getRecommendationReasons
} from '$lib/services/TemplateRecommendation';
import type { UserProfile } from '$lib/types';
import type { ExtendedResumeTemplate } from '$lib/templates/types';

// Mock user profiles
const softwareEngineerProfile: UserProfile = {
  id: 'user1',
  user: 'user1@example.com',
  first_name: 'John',
  last_name: 'Doe',
  target_industry: 'software-engineering',
  created: '2024-01-01',
  updated: '2024-01-01'
} as UserProfile;

const entryLevelProfile: UserProfile = {
  id: 'user2',
  user: 'user2@example.com',
  first_name: 'Jane',
  last_name: 'Smith',
  target_industry: 'web-development',
  created: '2024-01-01',
  updated: '2024-01-01'
} as UserProfile;

const seniorProfile: UserProfile = {
  id: 'user3',
  user: 'user3@example.com',
  first_name: 'Bob',
  last_name: 'Johnson',
  target_industry: 'data-science',
  created: '2024-01-01',
  updated: '2024-01-01',
  work_experience: JSON.stringify([
    {
      company: 'Tech Corp',
      position: 'Senior Data Scientist',
      start_date: '2015-01-01',
      end_date: '2020-01-01'
    },
    {
      company: 'Data Inc',
      position: 'Lead Data Scientist',
      start_date: '2020-01-01',
      current: true
    }
  ])
} as any;

// Mock templates
const mockTemplates: ExtendedResumeTemplate[] = [
  {
    id: 'template1',
    name: 'Modern Software Engineer',
    description: 'Perfect for software engineers',
    category: 'software-engineering',
    tags: ['modern', 'technical', 'ats-friendly'],
    thumbnail: '/thumb1.jpg',
    popularity: 85,
    isPremium: false,
    isPopular: true,
    settings: {
      template: 'template1',
      colorScheme: 'blue',
      fontSize: 'medium',
      spacing: 'normal',
      showProfileImage: false,
      sectionOrder: []
    }
  },
  {
    id: 'template2',
    name: 'Creative Designer',
    description: 'For creative professionals',
    category: 'design',
    tags: ['creative', 'colorful', 'modern'],
    thumbnail: '/thumb2.jpg',
    popularity: 70,
    isPremium: false,
    isPopular: false,
    settings: {
      template: 'template2',
      colorScheme: 'purple',
      fontSize: 'medium',
      spacing: 'normal',
      showProfileImage: true,
      sectionOrder: []
    }
  },
  {
    id: 'template3',
    name: 'Entry Level Simple',
    description: 'Clean and simple for beginners',
    category: 'general',
    tags: ['simple', 'clean', 'student-friendly'],
    thumbnail: '/thumb3.jpg',
    popularity: 60,
    isPremium: false,
    isPopular: false,
    settings: {
      template: 'template3',
      colorScheme: 'blue',
      fontSize: 'medium',
      spacing: 'normal',
      showProfileImage: false,
      sectionOrder: []
    }
  },
  {
    id: 'template4',
    name: 'Executive Professional',
    description: 'Sophisticated design for executives',
    category: 'executive',
    tags: ['executive', 'sophisticated', 'professional'],
    thumbnail: '/thumb4.jpg',
    popularity: 90,
    isPremium: true,
    isPopular: true,
    settings: {
      template: 'template4',
      colorScheme: 'black',
      fontSize: 'medium',
      spacing: 'normal',
      showProfileImage: false,
      sectionOrder: []
    }
  },
  {
    id: 'template5',
    name: 'Data Science Pro',
    description: 'Technical template for data scientists',
    category: 'data-science',
    tags: ['technical', 'analytical', 'modern', 'ats-friendly'],
    thumbnail: '/thumb5.jpg',
    popularity: 75,
    isPremium: false,
    isPopular: false,
    settings: {
      template: 'template5',
      colorScheme: 'teal',
      fontSize: 'medium',
      spacing: 'normal',
      showProfileImage: false,
      sectionOrder: []
    }
  }
];

describe('TemplateRecommendationService', () => {
  describe('constructor', () => {
    it('should create service with profile and templates', () => {
      const service = new TemplateRecommendationService(softwareEngineerProfile, mockTemplates);
      expect(service).toBeTruthy();
    });
  });

  describe('getRecommendations', () => {
    it('should return recommendations sorted by score', () => {
      const service = new TemplateRecommendationService(softwareEngineerProfile, mockTemplates);
      const recommendations = service.getRecommendations();
      
      expect(recommendations.length).toBe(mockTemplates.length);
      
      // Check that recommendations are sorted by score (descending)
      for (let i = 0; i < recommendations.length - 1; i++) {
        expect(recommendations[i].score.score).toBeGreaterThanOrEqual(
          recommendations[i + 1].score.score
        );
      }
    });

    it('should mark top 3 as recommended', () => {
      const service = new TemplateRecommendationService(softwareEngineerProfile, mockTemplates);
      const recommendations = service.getRecommendations();
      
      const recommendedCount = recommendations.filter(r => r.isRecommended).length;
      expect(recommendedCount).toBe(3);
      
      // First 3 should be recommended
      expect(recommendations[0].isRecommended).toBe(true);
      expect(recommendations[1].isRecommended).toBe(true);
      expect(recommendations[2].isRecommended).toBe(true);
      expect(recommendations[3]?.isRecommended).toBe(false);
    });

    it('should assign ranks correctly', () => {
      const service = new TemplateRecommendationService(softwareEngineerProfile, mockTemplates);
      const recommendations = service.getRecommendations();
      
      recommendations.forEach((rec, index) => {
        expect(rec.rank).toBe(index + 1);
      });
    });
  });

  describe('scoreTemplate - Industry Match', () => {
    it('should score software engineering template highly for software engineer', () => {
      const service = new TemplateRecommendationService(softwareEngineerProfile, mockTemplates);
      const template = mockTemplates.find(t => t.id === 'template1')!;
      const score = service.scoreTemplate(template);
      
      expect(score.breakdown.industry).toBeGreaterThan(15);
      expect(score.reasons.some(r => r.toLowerCase().includes('software'))).toBe(true);
    });

    it('should score design template lower for software engineer', () => {
      const service = new TemplateRecommendationService(softwareEngineerProfile, mockTemplates);
      const template = mockTemplates.find(t => t.id === 'template2')!;
      const score = service.scoreTemplate(template);
      
      // Design template should score lower for software engineer
      const swTemplate = mockTemplates.find(t => t.id === 'template1')!;
      const swScore = service.scoreTemplate(swTemplate);
      
      expect(score.score).toBeLessThan(swScore.score);
    });

    it('should handle profile without target industry', () => {
      const profileNoIndustry = { ...softwareEngineerProfile, target_industry: '' };
      const service = new TemplateRecommendationService(profileNoIndustry, mockTemplates);
      const template = mockTemplates[0];
      const score = service.scoreTemplate(template);
      
      expect(score.breakdown.industry).toBeGreaterThan(0);
      expect(score.score).toBeGreaterThan(0);
    });
  });

  describe('scoreTemplate - Experience Level', () => {
    it('should score simple template highly for entry level', () => {
      const service = new TemplateRecommendationService(entryLevelProfile, mockTemplates);
      const template = mockTemplates.find(t => t.id === 'template3')!;
      const score = service.scoreTemplate(template);
      
      expect(score.breakdown.experienceLevel).toBeGreaterThan(0);
      expect(score.reasons.some(r => r.includes('entry') || r.includes('Clean'))).toBe(true);
    });

    it('should score executive template highly for senior profile', () => {
      const service = new TemplateRecommendationService(seniorProfile, mockTemplates);
      const template = mockTemplates.find(t => t.id === 'template4')!;
      const score = service.scoreTemplate(template);
      
      expect(score.breakdown.experienceLevel).toBeGreaterThan(0);
    });

    it('should calculate experience years correctly', () => {
      const service = new TemplateRecommendationService(seniorProfile, mockTemplates);
      const recommendations = service.getRecommendations();
      
      // Senior profile should prefer executive/sophisticated templates
      const execTemplate = recommendations.find(r => r.template.id === 'template4');
      expect(execTemplate).toBeTruthy();
    });
  });

  describe('scoreTemplate - Style Preferences', () => {
    it('should give bonus for popular templates', () => {
      const service = new TemplateRecommendationService(softwareEngineerProfile, mockTemplates);
      const popularTemplate = mockTemplates.find(t => t.popularity && t.popularity > 80)!;
      const score = service.scoreTemplate(popularTemplate);
      
      expect(score.breakdown.style).toBeGreaterThan(0);
      expect(score.reasons.some(r => r.includes('popular'))).toBe(true);
    });

    it('should give bonus for ATS-friendly templates', () => {
      const service = new TemplateRecommendationService(softwareEngineerProfile, mockTemplates);
      const atsTemplate = mockTemplates.find(t => t.tags?.includes('ats-friendly'))!;
      const score = service.scoreTemplate(atsTemplate);
      
      expect(score.reasons.some(r => r.includes('ATS'))).toBe(true);
    });

    it('should give bonus for modern templates', () => {
      const service = new TemplateRecommendationService(softwareEngineerProfile, mockTemplates);
      const modernTemplate = mockTemplates.find(t => t.tags?.includes('modern'))!;
      const score = service.scoreTemplate(modernTemplate);
      
      expect(score.reasons.some(r => r.includes('Modern'))).toBe(true);
    });
  });

  describe('scoreTemplate - Profile Completeness', () => {
    it('should score appropriately for complete profile', () => {
      const completeProfile = {
        ...seniorProfile,
        education: JSON.stringify([{ degree: 'BS', institution: 'University' }]),
        skills: JSON.stringify(['Python', 'Machine Learning'])
      };
      
      const service = new TemplateRecommendationService(completeProfile, mockTemplates);
      const template = mockTemplates[0];
      const score = service.scoreTemplate(template);
      
      expect(score.breakdown.completeness).toBeGreaterThan(0);
    });

    it('should score appropriately for incomplete profile', () => {
      const incompleteProfile = { ...entryLevelProfile };
      const service = new TemplateRecommendationService(incompleteProfile, mockTemplates);
      const template = mockTemplates[0];
      const score = service.scoreTemplate(template);
      
      expect(score.breakdown.completeness).toBeGreaterThan(0);
    });
  });

  describe('scoreTemplate - Total Score', () => {
    it('should return score between 0 and 100', () => {
      const service = new TemplateRecommendationService(softwareEngineerProfile, mockTemplates);
      
      mockTemplates.forEach(template => {
        const score = service.scoreTemplate(template);
        expect(score.score).toBeGreaterThanOrEqual(0);
        expect(score.score).toBeLessThanOrEqual(100);
      });
    });

    it('should include reasons for score', () => {
      const service = new TemplateRecommendationService(softwareEngineerProfile, mockTemplates);
      const template = mockTemplates[0];
      const score = service.scoreTemplate(template);
      
      expect(score.reasons.length).toBeGreaterThan(0);
      expect(Array.isArray(score.reasons)).toBe(true);
    });

    it('should include breakdown of scores', () => {
      const service = new TemplateRecommendationService(softwareEngineerProfile, mockTemplates);
      const template = mockTemplates[0];
      const score = service.scoreTemplate(template);
      
      expect(score.breakdown).toBeTruthy();
      expect(score.breakdown.industry).toBeGreaterThanOrEqual(0);
      expect(score.breakdown.experienceLevel).toBeGreaterThanOrEqual(0);
      expect(score.breakdown.jobType).toBeGreaterThanOrEqual(0);
      expect(score.breakdown.style).toBeGreaterThanOrEqual(0);
      expect(score.breakdown.completeness).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Convenience Functions', () => {
    it('getTemplateRecommendations should work', () => {
      const recommendations = getTemplateRecommendations(softwareEngineerProfile, mockTemplates);
      
      expect(recommendations.length).toBe(mockTemplates.length);
      expect(recommendations[0].score.score).toBeGreaterThanOrEqual(
        recommendations[1].score.score
      );
    });

    it('getTopRecommendations should return top N', () => {
      const top3 = getTopRecommendations(softwareEngineerProfile, mockTemplates, 3);
      expect(top3.length).toBe(3);
      
      const top2 = getTopRecommendations(softwareEngineerProfile, mockTemplates, 2);
      expect(top2.length).toBe(2);
    });

    it('isTemplateRecommended should work', () => {
      const recommendations = getTopRecommendations(softwareEngineerProfile, mockTemplates, 3);
      const topTemplateId = recommendations[0].template.id;
      
      const isRecommended = isTemplateRecommended(topTemplateId, softwareEngineerProfile, mockTemplates);
      expect(isRecommended).toBe(true);
      
      // A template not in top 3 should not be recommended
      const allRecommendations = getTemplateRecommendations(softwareEngineerProfile, mockTemplates);
      if (allRecommendations.length > 3) {
        const notTopTemplateId = allRecommendations[4].template.id;
        const isNotRecommended = isTemplateRecommended(notTopTemplateId, softwareEngineerProfile, mockTemplates);
        expect(isNotRecommended).toBe(false);
      }
    });

    it('getRecommendationReasons should return reasons', () => {
      const template = mockTemplates[0];
      const reasons = getRecommendationReasons(template.id, softwareEngineerProfile, mockTemplates);
      
      expect(Array.isArray(reasons)).toBe(true);
      expect(reasons.length).toBeGreaterThan(0);
    });

    it('getRecommendationReasons should return empty array for invalid template', () => {
      const reasons = getRecommendationReasons('invalid-id', softwareEngineerProfile, mockTemplates);
      expect(reasons).toEqual([]);
    });
  });

  describe('Different Industries', () => {
    it('should recommend data science template for data scientist', () => {
      const dataProfile: UserProfile = {
        ...softwareEngineerProfile,
        target_industry: 'data-science'
      };
      
      const service = new TemplateRecommendationService(dataProfile, mockTemplates);
      const recommendations = service.getRecommendations();
      
      // Data science template should be highly ranked
      const dataTemplate = recommendations.find(r => r.template.id === 'template5');
      expect(dataTemplate).toBeTruthy();
      expect(dataTemplate!.rank).toBeLessThanOrEqual(3);
    });

    it('should handle unknown industry gracefully', () => {
      const unknownProfile: UserProfile = {
        ...softwareEngineerProfile,
        target_industry: 'unknown-industry'
      };
      
      const service = new TemplateRecommendationService(unknownProfile, mockTemplates);
      const recommendations = service.getRecommendations();
      
      expect(recommendations.length).toBe(mockTemplates.length);
      expect(recommendations[0].score.score).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty templates array', () => {
      const service = new TemplateRecommendationService(softwareEngineerProfile, []);
      const recommendations = service.getRecommendations();
      
      expect(recommendations.length).toBe(0);
    });

    it('should handle single template', () => {
      const service = new TemplateRecommendationService(softwareEngineerProfile, [mockTemplates[0]]);
      const recommendations = service.getRecommendations();
      
      expect(recommendations.length).toBe(1);
      expect(recommendations[0].isRecommended).toBe(true);
      expect(recommendations[0].rank).toBe(1);
    });

    it('should handle profile with no data', () => {
      const emptyProfile: UserProfile = {
        id: 'empty',
        user: 'empty@example.com',
        first_name: '',
        last_name: '',
        target_industry: '',
        created: '2024-01-01',
        updated: '2024-01-01'
      } as UserProfile;
      
      const service = new TemplateRecommendationService(emptyProfile, mockTemplates);
      const recommendations = service.getRecommendations();
      
      expect(recommendations.length).toBe(mockTemplates.length);
      expect(recommendations[0].score.score).toBeGreaterThan(0);
    });

    it('should handle templates without tags', () => {
      const templateNoTags: ExtendedResumeTemplate = {
        ...mockTemplates[0],
        tags: undefined
      };
      
      const service = new TemplateRecommendationService(softwareEngineerProfile, [templateNoTags]);
      const score = service.scoreTemplate(templateNoTags);
      
      expect(score.score).toBeGreaterThan(0);
    });

    it('should handle templates without category', () => {
      const templateNoCategory: ExtendedResumeTemplate = {
        ...mockTemplates[0],
        category: undefined
      };
      
      const service = new TemplateRecommendationService(softwareEngineerProfile, [templateNoCategory]);
      const score = service.scoreTemplate(templateNoCategory);
      
      expect(score.score).toBeGreaterThan(0);
    });
  });
});
