# 📊 Data Models & Interfaces

## 🎯 Enhanced Resume Types

### **Core Resume Data Structure**
```typescript
// Enhanced Resume interface
export interface Resume {
  id: string;
  title: string;
  user: string;
  content: ResumeContent;
  metadata: ResumeMetadata;
  versions: ResumeVersion[];
  applications: Application[];
  analytics: ResumeAnalytics;
  is_public: boolean;
  slug?: string;
  created: string;
  updated: string;
  expand?: {
    user?: User;
    versions?: ResumeVersion[];
  };
}

export interface ResumeContent {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  volunteer: Volunteer[];
  references: Reference[];
  customSections: CustomSection[];
  styling: ResumeStyling;
}

export interface ResumeMetadata {
  template: string;
  industry: string;
  jobTypes: string[];
  experienceLevel: 'entry' | 'mid' | 'senior';
  targetSalary?: number;
  preferredLocations: string[];
  workAuthorization: string;
  availability: Availability;
  lastOptimized: string;
  atsScore: number;
  completionScore: number;
}
```

## 🚀 Onboarding System

### **Onboarding Data Models**
```typescript
export interface OnboardingData {
  userId: string;
  currentStep: number;
  totalSteps: number;
  completedSteps: string[];
  userProfile: UserProfile;
  preferences: UserPreferences;
  goals: UserGoals;
  startedAt: string;
  completedAt?: string;
}

export interface UserProfile {
  userType: 'first-timer' | 'experienced' | 'career-changer' | 'student';
  age?: number;
  location: string;
  educationLevel: 'high-school' | 'some-college' | 'bachelors' | 'masters' | 'phd';
  workAuthorization: 'citizen' | 'permanent-resident' | 'work-visa' | 'student-visa';
  hasWorkExperience: boolean;
  previousIndustries: string[];
  currentSituation: 'unemployed' | 'employed' | 'student' | 'career-change';
}

export interface UserPreferences {
  targetIndustries: string[];
  preferredJobTypes: string[];
  workEnvironment: 'remote' | 'hybrid' | 'in-person' | 'flexible';
  schedulePreference: 'full-time' | 'part-time' | 'contract' | 'internship';
  salaryExpectations: {
    min: number;
    max: number;
    currency: string;
  };
  benefits: string[];
  commuteTolerance: number; // in miles
}

export interface UserGoals {
  primaryGoal: 'first-job' | 'career-change' | 'promotion' | 'better-pay' | 'better-culture';
  timeline: 'immediate' | '1-month' | '3-months' | '6-months' | 'exploring';
  applicationsPerWeek: number;
  targetCompanies: string[];
  skillsToImprove: string[];
  certificationGoals: string[];
}
```

## 🎨 Enhanced Quickstarters

### **Smart Quickstarter Models**
```typescript
export interface SmartQuickstarter {
  id: string;
  name: string;
  description: string;
  category: string;
  targetJobs: JobTarget[];
  industry: string;
  experienceLevel: 'entry' | 'mid' | 'senior';
  popularity: number;
  successRate: number;
  
  // Pre-filled content
  template: ResumeTemplate;
  starterContent: QuickstarterContent;
  
  // Guidance and tips
  guidance: QuickstarterGuidance;
  
  // Metadata
  tags: string[];
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobTarget {
  title: string;
  commonTitles: string[];
  industry: string;
  averageSalary: number;
  demandLevel: 'low' | 'medium' | 'high';
  requiredSkills: string[];
  preferredSkills: string[];
  commonCertifications: string[];
}

export interface QuickstarterContent {
  personalInfo: Partial<PersonalInfo>;
  summaryTemplates: string[];
  experienceExamples: Experience[];
  educationExamples: Education[];
  skillSuggestions: Skill[];
  projectIdeas: Project[];
  certificationSuggestions: Certification[];
  industryKeywords: string[];
  actionVerbs: string[];
}

export interface QuickstarterGuidance {
  gettingStarted: string[];
  commonMistakes: string[];
  successTips: string[];
  industryInsights: string[];
  interviewPrep: string[];
  salaryNegotiation: string[];
  careerProgression: string[];
}
```

## 🔄 Resume Versioning System

### **Versioning Models**
```typescript
export interface ResumeVersion {
  id: string;
  parentResumeId: string;
  name: string;
  description?: string;
  targetJob: JobTarget;
  customizations: VersionCustomizations;
  performance: VersionPerformance;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VersionCustomizations {
  emphasizedSkills: string[];
  tailoredSummary: string;
  reorderedSections: string[];
  addedKeywords: string[];
  removedSections: string[];
  modifiedExperience: ExperienceModification[];
  industrySpecificContent: Record<string, any>;
}

export interface ExperienceModification {
  experienceId: string;
  originalDescription: string;
  tailoredDescription: string;
  addedAchievements: string[];
  emphasizedSkills: string[];
}

export interface VersionPerformance {
  applicationsCount: number;
  viewCount: number;
  downloadCount: number;
  interviewCallbacks: number;
  jobOffers: number;
  averageResponseTime: number; // in days
  successRate: number; // percentage
  lastUsed: string;
}
```

## 📱 Application Tracking

### **Application Management Models**
```typescript
export interface Application {
  id: string;
  resumeVersionId: string;
  jobPosting: JobPosting;
  applicationData: ApplicationData;
  timeline: ApplicationTimeline[];
  status: ApplicationStatus;
  feedback?: ApplicationFeedback;
  analytics: ApplicationAnalytics;
  createdAt: string;
  updatedAt: string;
}

export interface JobPosting {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  preferredQualifications: string[];
  salary?: SalaryRange;
  benefits: string[];
  workType: 'remote' | 'hybrid' | 'on-site';
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  industry: string;
  postedDate: string;
  applicationDeadline?: string;
  source: string; // Indeed, LinkedIn, company website, etc.
  url?: string;
}

export interface ApplicationData {
  appliedVia: string; // platform used
  coverLetter?: string;
  customFields: Record<string, any>;
  attachments: string[];
  referral?: {
    name: string;
    relationship: string;
    contact?: string;
  };
}

export interface ApplicationTimeline {
  id: string;
  event: 'applied' | 'viewed' | 'phone-screen' | 'interview' | 'offer' | 'rejection' | 'follow-up';
  date: string;
  notes?: string;
  nextSteps?: string[];
  contacts?: Contact[];
}

export interface ApplicationStatus {
  current: 'applied' | 'under-review' | 'interview-scheduled' | 'interviewed' | 'offer' | 'rejected' | 'withdrawn';
  lastUpdated: string;
  expectedNextStep?: string;
  followUpDate?: string;
}

export interface ApplicationFeedback {
  source: 'recruiter' | 'hiring-manager' | 'interview' | 'rejection-email';
  feedback: string;
  suggestions: string[];
  rating?: number;
  wouldRecommend?: boolean;
}
```

## 🤖 AI Content Assistant

### **AI Service Models**
```typescript
export interface ContentAssistant {
  generateSummary(params: SummaryGenerationParams): Promise<string[]>;
  improveBulletPoints(params: BulletPointParams): Promise<string[]>;
  optimizeForATS(params: ATSOptimizationParams): Promise<ATSOptimizationResult>;
  suggestSkills(params: SkillSuggestionParams): Promise<Skill[]>;
  analyzeJobMatch(params: JobMatchParams): Promise<JobMatchAnalysis>;
  generateCoverLetter(params: CoverLetterParams): Promise<string>;
}

export interface SummaryGenerationParams {
  jobTitle: string;
  industry: string;
  experienceLevel: string;
  keySkills: string[];
  achievements: string[];
  targetCompany?: string;
  tone: 'professional' | 'friendly' | 'confident' | 'creative';
}

export interface ATSOptimizationParams {
  resumeContent: ResumeContent;
  jobDescription: string;
  targetKeywords: string[];
}

export interface ATSOptimizationResult {
  score: number;
  improvements: ATSImprovement[];
  keywordMatches: KeywordMatch[];
  suggestions: string[];
  optimizedContent: Partial<ResumeContent>;
}

export interface ATSImprovement {
  section: string;
  issue: string;
  suggestion: string;
  impact: 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface JobMatchAnalysis {
  overallMatch: number;
  skillsMatch: number;
  experienceMatch: number;
  educationMatch: number;
  missingSkills: string[];
  strongPoints: string[];
  improvementAreas: string[];
  recommendations: string[];
}
```

## 🎮 Gamification System

### **Gamification Models**
```typescript
export interface UserProgress {
  userId: string;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  achievements: Achievement[];
  streaks: Streak[];
  challenges: Challenge[];
  rewards: Reward[];
  statistics: UserStatistics;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'resume' | 'application' | 'skill' | 'milestone' | 'social';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlockedAt?: string;
  progress?: {
    current: number;
    target: number;
  };
}

export interface Streak {
  id: string;
  type: 'daily-login' | 'applications' | 'skill-building' | 'profile-updates';
  current: number;
  longest: number;
  lastActivity: string;
  isActive: boolean;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  difficulty: 'easy' | 'medium' | 'hard';
  requirements: ChallengeRequirement[];
  rewards: ChallengeReward[];
  startDate: string;
  endDate: string;
  isCompleted: boolean;
  progress: number;
}

export interface ChallengeRequirement {
  action: string;
  target: number;
  current: number;
}

export interface ChallengeReward {
  type: 'points' | 'badge' | 'premium-feature' | 'template-unlock';
  value: string | number;
  description: string;
}
```

## 📊 Analytics & Insights

### **Analytics Models**
```typescript
export interface UserAnalytics {
  userId: string;
  resumeMetrics: ResumeMetrics;
  applicationMetrics: ApplicationMetrics;
  engagementMetrics: EngagementMetrics;
  successMetrics: SuccessMetrics;
  trends: AnalyticsTrends;
  insights: AnalyticsInsights;
}

export interface ResumeMetrics {
  totalResumes: number;
  activeVersions: number;
  averageCompletionScore: number;
  averageATSScore: number;
  mostUsedTemplate: string;
  lastUpdated: string;
}

export interface ApplicationMetrics {
  totalApplications: number;
  applicationsByStatus: Record<ApplicationStatus['current'], number>;
  averageResponseTime: number;
  interviewRate: number;
  offerRate: number;
  applicationsByIndustry: Record<string, number>;
  applicationsByJobType: Record<string, number>;
}

export interface SuccessMetrics {
  jobOffersReceived: number;
  interviewsScheduled: number;
  averageSalaryOffered: number;
  timeToFirstInterview: number; // in days
  timeToFirstOffer: number; // in days
  successfulApplicationRate: number;
}

export interface AnalyticsInsights {
  recommendations: string[];
  trends: string[];
  opportunities: string[];
  warnings: string[];
  nextSteps: string[];
}
```

## 🔧 Database Schema Updates

### **PocketBase Collections**

```javascript
// New collections to add
const collections = [
  {
    name: 'onboarding_data',
    schema: [
      { name: 'user', type: 'relation', options: { collectionId: 'users' } },
      { name: 'data', type: 'json' },
      { name: 'completed', type: 'bool', default: false }
    ]
  },
  {
    name: 'resume_versions',
    schema: [
      { name: 'parent_resume', type: 'relation', options: { collectionId: 'resumes' } },
      { name: 'name', type: 'text', required: true },
      { name: 'customizations', type: 'json' },
      { name: 'performance', type: 'json' },
      { name: 'is_active', type: 'bool', default: true }
    ]
  },
  {
    name: 'applications',
    schema: [
      { name: 'resume_version', type: 'relation', options: { collectionId: 'resume_versions' } },
      { name: 'job_posting', type: 'json' },
      { name: 'application_data', type: 'json' },
      { name: 'timeline', type: 'json' },
      { name: 'status', type: 'select', options: { values: ['applied', 'under-review', 'interview-scheduled', 'interviewed', 'offer', 'rejected', 'withdrawn'] } }
    ]
  },
  {
    name: 'user_progress',
    schema: [
      { name: 'user', type: 'relation', options: { collectionId: 'users' } },
      { name: 'level', type: 'number', default: 1 },
      { name: 'experience', type: 'number', default: 0 },
      { name: 'achievements', type: 'json' },
      { name: 'streaks', type: 'json' },
      { name: 'statistics', type: 'json' }
    ]
  }
];
```

## 🔄 Migration Scripts

### **Data Migration Strategy**
```typescript
export interface MigrationPlan {
  version: string;
  description: string;
  steps: MigrationStep[];
  rollbackSteps: MigrationStep[];
  estimatedTime: number; // in minutes
  riskLevel: 'low' | 'medium' | 'high';
}

export interface MigrationStep {
  id: string;
  description: string;
  sql?: string;
  script?: string;
  validation?: string;
  dependencies: string[];
}
```

---

*This data model documentation provides the foundation for implementing all the enhanced features. Each interface should be implemented incrementally, starting with the core Resume enhancements and building up to the advanced features.*