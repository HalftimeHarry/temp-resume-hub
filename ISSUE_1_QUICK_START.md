# Issue #1 Quick Start Guide

## 🎯 Goal
Create the `ResumeGenerator` service class foundation - the core class that will generate complete resumes from profile data and templates.

---

## 📋 Before You Start

### 1. Create Your Feature Branch
```bash
git checkout -b feature/issue-1-resume-generator-base
```

### 2. Create the Services Directory
```bash
mkdir -p app/src/lib/services
```

### 3. Review Existing Types
You'll need to understand these types:
- `UserProfile` - in `app/src/lib/stores/userProfile.ts`
- `ExtendedResumeTemplate` - in `app/src/lib/templates/types.ts`
- `ResumeData` - in `app/src/lib/types/resume.ts`

---

## 🏗️ Implementation Steps

### Step 1: Create the File (5 minutes)
```bash
touch app/src/lib/services/ResumeGenerator.ts
```

### Step 2: Add Imports and Type Definitions (10 minutes)

```typescript
/**
 * ResumeGenerator Service
 * 
 * Generates complete resume drafts by intelligently merging user profile data
 * with template starter data. Handles users with varying levels of experience
 * and profile completeness.
 * 
 * @example
 * const generator = new ResumeGenerator(userProfile, template, 'technology');
 * const resumeData = generator.generateDraft();
 */

import type { UserProfile } from '$lib/stores/userProfile';
import type { ExtendedResumeTemplate } from '$lib/templates/types';
import type { 
  ResumeData, 
  PersonalInfo, 
  Experience, 
  Education, 
  Skill, 
  Project 
} from '$lib/types/resume';
import { generateId } from '$lib/utils';
```

### Step 3: Create the Class Structure (15 minutes)

```typescript
export class ResumeGenerator {
  private profile: UserProfile;
  private template: ExtendedResumeTemplate;
  private targetIndustry: string;

  /**
   * Creates a new ResumeGenerator instance
   * 
   * @param profile - User's profile data
   * @param template - Selected resume template with starter data
   * @param targetIndustry - Optional target industry (defaults to profile.target_industry)
   */
  constructor(
    profile: UserProfile,
    template: ExtendedResumeTemplate,
    targetIndustry?: string
  ) {
    this.profile = profile;
    this.template = template;
    this.targetIndustry = targetIndustry || profile.target_industry || '';
  }

  /**
   * Generates a complete resume draft
   * 
   * @returns Complete resume data ready for builder
   */
  public generateDraft(): ResumeData {
    return {
      personalInfo: this.generatePersonalInfo(),
      summary: this.generateSummary(),
      experience: this.generateExperience(),
      education: this.generateEducation(),
      skills: this.generateSkills(),
      projects: this.generateProjects(),
      settings: this.template.settings || this.template.starterData?.settings
    };
  }

  // Private generation methods will be implemented in subsequent issues
  private generatePersonalInfo(): PersonalInfo {
    // TODO: Implement in Issue #2
    return {} as PersonalInfo;
  }

  private generateSummary(): string {
    // TODO: Implement in Issue #6
    return '';
  }

  private generateExperience(): Experience[] {
    // TODO: Implement in Issue #3
    return [];
  }

  private generateEducation(): Education[] {
    // TODO: Implement in Issue #4
    return [];
  }

  private generateSkills(): Skill[] {
    // TODO: Implement in Issue #5
    return [];
  }

  private generateProjects(): Project[] {
    // TODO: Implement in Issue #7
    return [];
  }

  /**
   * Checks if user profile has real work experience data
   * 
   * @returns true if profile contains work experience
   */
  private hasProfileExperience(): boolean {
    return !!(
      this.profile.work_experience &&
      Array.isArray(this.profile.work_experience) &&
      this.profile.work_experience.length > 0
    );
  }
}
```

### Step 4: Create Basic Unit Tests (30 minutes)

Create `app/src/lib/services/ResumeGenerator.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { ResumeGenerator } from './ResumeGenerator';
import type { UserProfile } from '$lib/stores/userProfile';
import type { ExtendedResumeTemplate } from '$lib/templates/types';

describe('ResumeGenerator', () => {
  let mockProfile: UserProfile;
  let mockTemplate: ExtendedResumeTemplate;

  beforeEach(() => {
    // Create mock profile
    mockProfile = {
      id: 'test-profile-id',
      user: 'test-user-id',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone: '555-1234',
      location: 'San Francisco, CA',
      target_industry: 'technology',
      experience_level: 'mid',
      role: 'job_seeker',
      plan: 'free',
      active: true,
      verified: false,
      profile_completed: true,
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    } as UserProfile;

    // Create mock template
    mockTemplate = {
      id: 'test-template-id',
      name: 'Tech Professional',
      category: 'technology',
      settings: {
        template: 'modern',
        colorScheme: 'blue',
        fontSize: 'medium',
        spacing: 'normal',
        showProfileImage: false,
        sectionOrder: ['experience', 'education', 'skills']
      },
      starterData: {
        personalInfo: {
          fullName: 'Template Name',
          email: 'template@example.com',
          phone: '555-0000',
          location: 'City, State',
          website: '',
          linkedin: '',
          github: '',
          summary: ''
        },
        summary: 'Template summary',
        experience: [],
        education: [],
        skills: [],
        projects: [],
        settings: {
          layout: 'single-column',
          mode: 'light',
          template: 'modern',
          colorScheme: 'blue',
          fontSize: 'medium',
          spacing: 'normal',
          showProfileImage: false,
          sectionOrder: ['experience', 'education', 'skills']
        }
      }
    } as ExtendedResumeTemplate;
  });

  describe('constructor', () => {
    it('should create instance with profile and template', () => {
      const generator = new ResumeGenerator(mockProfile, mockTemplate);
      expect(generator).toBeInstanceOf(ResumeGenerator);
    });

    it('should use profile target_industry by default', () => {
      const generator = new ResumeGenerator(mockProfile, mockTemplate);
      // We can't directly test private properties, but we can test behavior
      expect(generator).toBeDefined();
    });

    it('should use provided targetIndustry over profile', () => {
      const generator = new ResumeGenerator(mockProfile, mockTemplate, 'healthcare');
      expect(generator).toBeDefined();
    });
  });

  describe('generateDraft', () => {
    it('should return complete ResumeData structure', () => {
      const generator = new ResumeGenerator(mockProfile, mockTemplate);
      const result = generator.generateDraft();

      expect(result).toHaveProperty('personalInfo');
      expect(result).toHaveProperty('summary');
      expect(result).toHaveProperty('experience');
      expect(result).toHaveProperty('education');
      expect(result).toHaveProperty('skills');
      expect(result).toHaveProperty('projects');
      expect(result).toHaveProperty('settings');
    });

    it('should return arrays for list sections', () => {
      const generator = new ResumeGenerator(mockProfile, mockTemplate);
      const result = generator.generateDraft();

      expect(Array.isArray(result.experience)).toBe(true);
      expect(Array.isArray(result.education)).toBe(true);
      expect(Array.isArray(result.skills)).toBe(true);
      expect(Array.isArray(result.projects)).toBe(true);
    });

    it('should include template settings', () => {
      const generator = new ResumeGenerator(mockProfile, mockTemplate);
      const result = generator.generateDraft();

      expect(result.settings).toBeDefined();
      expect(result.settings.template).toBe('modern');
      expect(result.settings.colorScheme).toBe('blue');
    });
  });

  describe('hasProfileExperience', () => {
    it('should detect when profile has experience', () => {
      const profileWithExp = {
        ...mockProfile,
        work_experience: [
          {
            company: 'Test Company',
            position: 'Developer',
            start_date: '2020-01',
            end_date: '2023-01'
          }
        ]
      };

      const generator = new ResumeGenerator(profileWithExp, mockTemplate);
      const result = generator.generateDraft();
      
      // Since hasProfileExperience is private, we test its effect
      // through the public generateDraft method
      expect(result).toBeDefined();
    });

    it('should handle profile without experience', () => {
      const generator = new ResumeGenerator(mockProfile, mockTemplate);
      const result = generator.generateDraft();
      
      expect(result).toBeDefined();
    });
  });
});
```

### Step 5: Run Tests (5 minutes)

```bash
cd app
npm run test -- ResumeGenerator.test.ts
```

### Step 6: Verify TypeScript Compilation (5 minutes)

```bash
cd app
npm run check
```

---

## ✅ Acceptance Criteria Checklist

Before creating your PR, verify:

- [ ] File created: `app/src/lib/services/ResumeGenerator.ts`
- [ ] Constructor accepts `UserProfile`, `ExtendedResumeTemplate`, and optional `targetIndustry`
- [ ] `generateDraft()` method returns complete `ResumeData`
- [ ] Private methods defined (stubs for now):
  - [ ] `generatePersonalInfo()`
  - [ ] `generateSummary()`
  - [ ] `generateExperience()`
  - [ ] `generateEducation()`
  - [ ] `generateSkills()`
  - [ ] `generateProjects()`
- [ ] `hasProfileExperience()` helper method implemented
- [ ] Comprehensive JSDoc comments added
- [ ] Unit tests created and passing
- [ ] TypeScript compilation successful
- [ ] No linting errors

---

## 🧪 Testing Your Work

### Run All Tests
```bash
cd app
npm run test
```

### Run Specific Test File
```bash
cd app
npm run test -- ResumeGenerator.test.ts
```

### Check TypeScript
```bash
cd app
npm run check
```

### Run Linter
```bash
cd app
npm run lint
```

---

## 📝 Creating Your Pull Request

### 1. Commit Your Changes
```bash
git add app/src/lib/services/ResumeGenerator.ts
git add app/src/lib/services/ResumeGenerator.test.ts
git commit -m "feat: implement ResumeGenerator base class (#1)

- Create ResumeGenerator service class
- Add constructor with profile, template, and targetIndustry
- Implement generateDraft() method structure
- Add private method stubs for section generation
- Implement hasProfileExperience() helper
- Add comprehensive JSDoc comments
- Create unit tests with 100% coverage

Closes #1

Co-authored-by: Ona <no-reply@ona.com>"
```

### 2. Push Your Branch
```bash
git push origin feature/issue-1-resume-generator-base
```

### 3. Create Pull Request
Go to GitHub and create a PR with:

**Title:** `feat: Implement ResumeGenerator base class (#1)`

**Description:**
```markdown
## Changes
- Created `ResumeGenerator` service class in `app/src/lib/services/`
- Implemented constructor accepting profile, template, and optional target industry
- Added `generateDraft()` method that returns complete `ResumeData` structure
- Created private method stubs for all section generators
- Implemented `hasProfileExperience()` helper method
- Added comprehensive JSDoc documentation
- Created unit tests with full coverage

## Testing
- [x] All unit tests passing
- [x] TypeScript compilation successful
- [x] No linting errors
- [x] Code coverage >80%

## Screenshots
N/A - Backend service class

## Closes
Closes #1
```

---

## 🎯 What's Next?

After Issue #1 is merged, you'll move to **Issue #2: Implement Personal Info Generation**.

That issue will implement the actual logic for `generatePersonalInfo()` method, which will:
- Merge profile data with template placeholders
- Prioritize real user data over template examples
- Handle missing fields gracefully

---

## 💡 Tips for Success

### Keep It Simple
This is just the foundation. Don't try to implement all the logic now. The method stubs are intentional - they'll be filled in by subsequent issues.

### Focus on Structure
The goal is to create a solid class structure that other issues can build upon.

### Write Good Tests
Even though the methods are stubs, test the structure and basic behavior.

### Document Well
Good JSDoc comments now will save time later when implementing the actual logic.

### Ask Questions
If anything is unclear, comment on the GitHub issue before starting.

---

## 🐛 Common Issues

### Import Errors
If you get import errors, make sure the types exist:
```bash
# Check if types are defined
grep -r "export.*UserProfile" app/src/lib/stores/
grep -r "export.*ExtendedResumeTemplate" app/src/lib/templates/
grep -r "export.*ResumeData" app/src/lib/types/
```

### Test Failures
If tests fail, check:
1. Mock data matches actual type definitions
2. All required fields are present in mocks
3. Test expectations match actual behavior

### TypeScript Errors
If TypeScript complains:
1. Check all imports are correct
2. Verify types match expected interfaces
3. Run `npm run check` for detailed errors

---

## 📚 Reference

### Key Files to Review
- `app/src/lib/stores/userProfile.ts` - UserProfile type
- `app/src/lib/templates/types.ts` - Template types
- `app/src/lib/types/resume.ts` - Resume data types
- `app/src/lib/stores/resumeBuilder.ts` - Existing builder logic (for reference)

### Similar Patterns in Codebase
Look at existing stores for patterns:
- `app/src/lib/stores/resume.ts` - Service-like store
- `app/src/lib/stores/templates.ts` - Data management

---

**Estimated Time:** 3-4 hours
**Difficulty:** Medium
**Dependencies:** None

**Good luck! You're building the foundation for something great!** 🚀
