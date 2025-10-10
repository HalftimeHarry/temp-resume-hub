# GitHub Issues Plan: Object-Oriented Architecture

## Milestone: Object-Oriented Architecture
**Description:** Refactor resume builder to use object-oriented patterns for streamlined, industry-targeted, multi-resume generation. Foundation for scalable resume creation platform.

**Goals:**
- Implement ResumeGenerator service class
- Add strategy pattern for different user types
- Enable one-click resume generation
- Support multi-resume creation with industry targeting

---

## Phase 1: Foundation - ResumeGenerator Service Class

### Issue #1: Create ResumeGenerator Base Class
**Title:** Create ResumeGenerator service class foundation

**Labels:** `enhancement`, `architecture`, `phase-1`

**Description:**
Create the core `ResumeGenerator` class that will serve as the foundation for intelligent resume generation.

**Acceptance Criteria:**
- [ ] Create `app/src/lib/services/ResumeGenerator.ts`
- [ ] Implement constructor accepting `UserProfile`, `ExtendedResumeTemplate`, and optional `targetIndustry`
- [ ] Implement `generateDraft()` method that returns complete `ResumeData`
- [ ] Add private methods for each section generation:
  - `generatePersonalInfo()`
  - `generateSummary()`
  - `generateExperience()`
  - `generateEducation()`
  - `generateSkills()`
  - `generateProjects()`
- [ ] Add helper method `hasProfileExperience()` to detect real vs. template data
- [ ] Add comprehensive JSDoc comments
- [ ] Write unit tests for basic functionality

**Technical Details:**
```typescript
export class ResumeGenerator {
  private profile: UserProfile;
  private template: ExtendedResumeTemplate;
  private targetIndustry: string;
  
  constructor(
    profile: UserProfile, 
    template: ExtendedResumeTemplate, 
    targetIndustry?: string
  ) {
    this.profile = profile;
    this.template = template;
    this.targetIndustry = targetIndustry || profile.target_industry;
  }
  
  public generateDraft(): ResumeData {
    // Implementation
  }
}
```

**Dependencies:** None

**Estimated Time:** 3-4 hours

---

### Issue #2: Implement Personal Info Generation
**Title:** Implement smart personal info generation in ResumeGenerator

**Labels:** `enhancement`, `phase-1`

**Description:**
Implement the `generatePersonalInfo()` method to intelligently merge profile data with template placeholders.

**Acceptance Criteria:**
- [ ] Always prioritize profile data over template placeholders
- [ ] Handle missing profile fields gracefully
- [ ] Merge user email from auth if not in profile
- [ ] Support all PersonalInfo fields:
  - fullName, email, phone, location
  - linkedin, website, github, summary
- [ ] Add validation for required fields
- [ ] Write unit tests with various profile completeness scenarios

**Technical Details:**
- Use existing `smartMergeProfileAndTemplate` logic as reference
- Ensure placeholder detection (e.g., "john.doe@email.com", "Your City, State")
- Return complete PersonalInfo object

**Dependencies:** Issue #1

**Estimated Time:** 2 hours

---

### Issue #3: Implement Experience Detection and Generation
**Title:** Add experience detection and smart generation logic

**Labels:** `enhancement`, `phase-1`

**Description:**
Implement logic to detect if user has real experience and generate appropriate experience section.

**Acceptance Criteria:**
- [ ] Implement `hasProfileExperience()` method
- [ ] Implement `generateExperience()` method
- [ ] If profile has work_experience, parse and use it
- [ ] If no profile experience, use template starter data
- [ ] Handle JSON parsing for stored experience data
- [ ] Map profile experience fields to Resume Experience type
- [ ] Generate unique IDs for each experience entry
- [ ] Write unit tests for both scenarios (with/without experience)

**Technical Details:**
```typescript
private hasProfileExperience(): boolean {
  return this.profile.work_experience && 
         Array.isArray(this.profile.work_experience) &&
         this.profile.work_experience.length > 0;
}

private generateExperience(): Experience[] {
  if (this.hasProfileExperience()) {
    return this.adaptProfileExperience();
  }
  return this.template.starterData.experience;
}
```

**Dependencies:** Issue #1

**Estimated Time:** 3 hours

---

### Issue #4: Implement Education Generation
**Title:** Implement education section generation

**Labels:** `enhancement`, `phase-1`

**Description:**
Add logic to generate education section from profile or template data.

**Acceptance Criteria:**
- [ ] Implement `generateEducation()` method
- [ ] Prioritize profile education if available
- [ ] Fall back to template education examples
- [ ] Handle JSON parsing for stored education data
- [ ] Map profile education fields to Resume Education type
- [ ] Support education_level field from profile
- [ ] Generate unique IDs for each education entry
- [ ] Write unit tests

**Dependencies:** Issue #1

**Estimated Time:** 2 hours

---

### Issue #5: Implement Skills Generation
**Title:** Implement smart skills generation and merging

**Labels:** `enhancement`, `phase-1`

**Description:**
Create intelligent skills generation that merges profile skills with template examples.

**Acceptance Criteria:**
- [ ] Implement `generateSkills()` method
- [ ] Parse profile `key_skills` (comma-separated string)
- [ ] Merge with template skills
- [ ] Remove duplicates
- [ ] Categorize skills appropriately
- [ ] Assign skill levels based on experience_level
- [ ] Generate unique IDs for each skill
- [ ] Write unit tests

**Technical Details:**
- Profile skills are stored as comma-separated string
- Template skills have category and level
- Merge strategy: profile skills + template skills (deduplicated)

**Dependencies:** Issue #1

**Estimated Time:** 2-3 hours

---

### Issue #6: Implement Summary Generation
**Title:** Add professional summary generation logic

**Labels:** `enhancement`, `phase-1`

**Description:**
Implement summary generation that uses profile summary or template default.

**Acceptance Criteria:**
- [ ] Implement `generateSummary()` method
- [ ] Use profile `professional_summary` if available
- [ ] Fall back to template summary
- [ ] Consider adding industry-specific keywords (future enhancement)
- [ ] Write unit tests

**Dependencies:** Issue #1

**Estimated Time:** 1 hour

---

### Issue #7: Implement Projects Generation
**Title:** Add projects section generation

**Labels:** `enhancement`, `phase-1`

**Description:**
Generate projects section from profile or template data, especially important for first-time job seekers.

**Acceptance Criteria:**
- [ ] Implement `generateProjects()` method
- [ ] Use profile `academic_projects` or `personal_projects` if available
- [ ] Parse and structure project data
- [ ] Fall back to template projects
- [ ] Generate unique IDs for each project
- [ ] Write unit tests

**Dependencies:** Issue #1

**Estimated Time:** 2 hours

---

### Issue #8: Add ResumeGenerator Unit Tests
**Title:** Comprehensive unit tests for ResumeGenerator

**Labels:** `testing`, `phase-1`

**Description:**
Create comprehensive test suite for ResumeGenerator class.

**Acceptance Criteria:**
- [ ] Test with complete profile (experienced user)
- [ ] Test with minimal profile (first-time job seeker)
- [ ] Test with no profile data
- [ ] Test industry targeting
- [ ] Test all section generation methods
- [ ] Test edge cases (null values, empty arrays, etc.)
- [ ] Achieve >80% code coverage
- [ ] Add test fixtures for profiles and templates

**Dependencies:** Issues #1-7

**Estimated Time:** 3-4 hours

---

## Phase 2: Strategy Pattern Implementation

### Issue #9: Create Resume Strategy Interface
**Title:** Define ResumeStrategy interface and base implementation

**Labels:** `enhancement`, `architecture`, `phase-2`

**Description:**
Create the strategy pattern interface for different resume generation approaches.

**Acceptance Criteria:**
- [ ] Create `app/src/lib/services/ResumeStrategies.ts`
- [ ] Define `ResumeStrategy` interface
- [ ] Create abstract base class with common logic
- [ ] Add strategy selection logic
- [ ] Write documentation for strategy pattern usage

**Technical Details:**
```typescript
interface ResumeStrategy {
  generateResume(
    profile: UserProfile, 
    template: ExtendedResumeTemplate
  ): ResumeData;
}

abstract class BaseResumeStrategy implements ResumeStrategy {
  abstract generateResume(profile, template): ResumeData;
  
  protected generatePersonalInfo(profile): PersonalInfo {
    // Common logic
  }
}
```

**Dependencies:** Phase 1 complete

**Estimated Time:** 2 hours

---

### Issue #10: Implement ExperiencedJobSeekerStrategy
**Title:** Create strategy for experienced job seekers

**Labels:** `enhancement`, `phase-2`

**Description:**
Implement strategy that prioritizes profile experience data.

**Acceptance Criteria:**
- [ ] Create `ExperiencedJobSeekerStrategy` class
- [ ] Use profile work experience as primary source
- [ ] Use profile education
- [ ] Merge profile and template skills
- [ ] Use profile professional summary
- [ ] Add logic to detect if user qualifies for this strategy
- [ ] Write unit tests

**Dependencies:** Issue #9

**Estimated Time:** 2-3 hours

---

### Issue #11: Implement FirstTimeJobSeekerStrategy
**Title:** Create strategy for first-time job seekers

**Labels:** `enhancement`, `phase-2`

**Description:**
Implement strategy that uses template examples with profile contact info.

**Acceptance Criteria:**
- [ ] Create `FirstTimeJobSeekerStrategy` class
- [ ] Use template experience examples
- [ ] Use template skills examples
- [ ] Adapt template summary for first-timer context
- [ ] Include academic projects if available
- [ ] Include volunteer experience if available
- [ ] Add logic to detect if user qualifies for this strategy
- [ ] Write unit tests

**Dependencies:** Issue #9

**Estimated Time:** 2-3 hours

---

### Issue #12: Implement CareerChangerStrategy
**Title:** Create strategy for career changers

**Labels:** `enhancement`, `phase-2`

**Description:**
Implement strategy that adapts existing experience to new industry.

**Acceptance Criteria:**
- [ ] Create `CareerChangerStrategy` class
- [ ] Adapt profile experience to target industry
- [ ] Highlight transferable skills
- [ ] Generate career change summary
- [ ] Reframe job descriptions for new industry
- [ ] Add logic to detect if user qualifies for this strategy
- [ ] Write unit tests

**Technical Details:**
- Detect career change: `profile.career_stage === 'career_change'`
- Compare `profile.target_industry` with experience industries
- Use industry keywords from template

**Dependencies:** Issue #9

**Estimated Time:** 3-4 hours

---

### Issue #13: Add Strategy Selector
**Title:** Implement automatic strategy selection logic

**Labels:** `enhancement`, `phase-2`

**Description:**
Create logic to automatically select the best strategy based on profile data.

**Acceptance Criteria:**
- [ ] Create `StrategySelector` class
- [ ] Implement `selectStrategy(profile)` method
- [ ] Priority order:
  1. Career changer (if career_stage or industry mismatch)
  2. Experienced (if has work_experience)
  3. First-time (default)
- [ ] Add confidence scoring
- [ ] Allow manual strategy override
- [ ] Write unit tests

**Dependencies:** Issues #10-12

**Estimated Time:** 2 hours

---

## Phase 3: Builder Integration

### Issue #14: Add Quick Generate UI to Builder
**Title:** Add "Quick Generate" button and modal to resume builder

**Labels:** `enhancement`, `ui`, `phase-3`

**Description:**
Add UI components for one-click resume generation in the builder.

**Acceptance Criteria:**
- [ ] Add "Quick Generate from Profile" button to builder header
- [ ] Create modal/dialog for generation options
- [ ] Add checkboxes for sections to generate:
  - Contact Info, Summary, Experience, Education, Skills, Projects
- [ ] Add industry selector dropdown
- [ ] Add "Generate" and "Cancel" buttons
- [ ] Show loading state during generation
- [ ] Show success/error toast notifications
- [ ] Mobile responsive design

**Dependencies:** Phase 2 complete

**Estimated Time:** 3-4 hours

---

### Issue #15: Connect ResumeGenerator to Builder Store
**Title:** Integrate ResumeGenerator with resumeBuilder store

**Labels:** `enhancement`, `phase-3`

**Description:**
Connect the ResumeGenerator service to the existing builder store.

**Acceptance Criteria:**
- [ ] Create `generateFromProfile()` function in resumeBuilder store
- [ ] Accept generation options (sections, industry, strategy)
- [ ] Call appropriate ResumeGenerator/Strategy
- [ ] Update builderData store with generated content
- [ ] Mark generated steps as complete
- [ ] Preserve any existing user edits
- [ ] Handle errors gracefully
- [ ] Add loading state management

**Technical Details:**
```typescript
export async function generateFromProfile(options: {
  sections: string[];
  targetIndustry?: string;
  strategy?: 'auto' | 'experienced' | 'first-time' | 'career-change';
}): Promise<void> {
  // Implementation
}
```

**Dependencies:** Issue #14

**Estimated Time:** 3 hours

---

### Issue #16: Add Generation Options Persistence
**Title:** Save user's generation preferences

**Labels:** `enhancement`, `phase-3`

**Description:**
Remember user's preferred generation options for future use.

**Acceptance Criteria:**
- [ ] Save generation preferences to localStorage
- [ ] Include: selected sections, preferred strategy, target industry
- [ ] Auto-populate options on next generation
- [ ] Add "Reset to defaults" option
- [ ] Clear preferences on logout

**Dependencies:** Issue #15

**Estimated Time:** 1-2 hours

---

## Phase 4: Smart Detection & Enhancement

### Issue #17: Add Industry Keyword Adaptation
**Title:** Implement industry-specific keyword adaptation

**Labels:** `enhancement`, `ai-enhancement`, `phase-4`

**Description:**
Add logic to adapt job descriptions and summaries with industry-specific keywords.

**Acceptance Criteria:**
- [ ] Create industry keyword mappings
- [ ] Implement keyword replacement in summaries
- [ ] Adapt experience descriptions for target industry
- [ ] Maintain original meaning while updating terminology
- [ ] Add configuration for keyword intensity
- [ ] Write unit tests

**Dependencies:** Phase 3 complete

**Estimated Time:** 4-5 hours

---

### Issue #18: Add Template Recommendation Engine
**Title:** Suggest best templates based on profile and target industry

**Labels:** `enhancement`, `phase-4`

**Description:**
Automatically recommend templates that match user's profile and target industry.

**Acceptance Criteria:**
- [ ] Implement template scoring algorithm
- [ ] Consider: industry, experience level, job type
- [ ] Sort templates by relevance score
- [ ] Show "Recommended" badge on top matches
- [ ] Add "Why recommended?" tooltip
- [ ] Write unit tests

**Dependencies:** Phase 3 complete

**Estimated Time:** 3-4 hours

---

### Issue #19: Add Profile Completeness Checker
**Title:** Detect and suggest profile improvements for better generation

**Labels:** `enhancement`, `phase-4`

**Description:**
Analyze profile and suggest what data would improve resume generation.

**Acceptance Criteria:**
- [ ] Check for missing critical fields
- [ ] Suggest adding work experience
- [ ] Suggest adding skills
- [ ] Show completeness percentage
- [ ] Link to profile edit page
- [ ] Show before generation modal
- [ ] Write unit tests

**Dependencies:** Phase 3 complete

**Estimated Time:** 2-3 hours

---

## Phase 5: Multi-Resume Management

### Issue #20: Add Resume Purpose/Target Field
**Title:** Add purpose and target industry fields to resumes

**Labels:** `enhancement`, `database`, `phase-5`

**Description:**
Allow users to specify the purpose and target industry for each resume.

**Acceptance Criteria:**
- [ ] Add `purpose` field to Resume model (e.g., "Frontend Developer - Tech")
- [ ] Add `target_industry` field to Resume model
- [ ] Update resume creation to capture these fields
- [ ] Show in resume list/cards
- [ ] Add to resume metadata
- [ ] Update database schema
- [ ] Write migration script

**Dependencies:** Phase 4 complete

**Estimated Time:** 2-3 hours

---

### Issue #21: Add Quick Duplicate with Industry Change
**Title:** Enable quick resume duplication with industry targeting

**Labels:** `enhancement`, `phase-5`

**Description:**
Allow users to duplicate a resume and retarget it for a different industry.

**Acceptance Criteria:**
- [ ] Add "Duplicate for Different Industry" button
- [ ] Show industry selector modal
- [ ] Copy resume data
- [ ] Re-run generation with new industry
- [ ] Update purpose/title
- [ ] Adapt keywords for new industry
- [ ] Save as new resume
- [ ] Show success message

**Dependencies:** Issue #20

**Estimated Time:** 3-4 hours

---

### Issue #22: Enhanced Resume List View
**Title:** Improve dashboard resume list with industry/purpose info

**Labels:** `enhancement`, `ui`, `phase-5`

**Description:**
Update the dashboard resume list to show purpose and target industry.

**Acceptance Criteria:**
- [ ] Show resume purpose prominently
- [ ] Show target industry badge
- [ ] Add filter by industry
- [ ] Add sort by date/industry/purpose
- [ ] Show "Duplicate for different industry" action
- [ ] Update mobile view
- [ ] Write component tests

**Dependencies:** Issue #20

**Estimated Time:** 2-3 hours

---

## Phase 6: Testing & Documentation

### Issue #23: Integration Tests for Resume Generation
**Title:** End-to-end tests for complete generation flow

**Labels:** `testing`, `phase-6`

**Description:**
Create integration tests for the entire resume generation workflow.

**Acceptance Criteria:**
- [ ] Test complete generation flow from UI to database
- [ ] Test all three strategies
- [ ] Test with various profile completeness levels
- [ ] Test error handling
- [ ] Test with different templates
- [ ] Test multi-resume creation
- [ ] Achieve >70% integration test coverage

**Dependencies:** Phase 5 complete

**Estimated Time:** 4-5 hours

---

### Issue #24: Developer Documentation
**Title:** Document OOP architecture and usage

**Labels:** `documentation`, `phase-6`

**Description:**
Create comprehensive documentation for the new architecture.

**Acceptance Criteria:**
- [ ] Architecture overview diagram
- [ ] Class diagrams for ResumeGenerator and Strategies
- [ ] Usage examples for each strategy
- [ ] API documentation
- [ ] Contributing guidelines for new strategies
- [ ] Performance considerations
- [ ] Troubleshooting guide

**Dependencies:** Phase 5 complete

**Estimated Time:** 3-4 hours

---

### Issue #25: User Guide for Quick Generation
**Title:** Create user-facing documentation for quick generation feature

**Labels:** `documentation`, `user-guide`, `phase-6`

**Description:**
Document the new quick generation features for end users.

**Acceptance Criteria:**
- [ ] Step-by-step guide with screenshots
- [ ] Video tutorial (optional)
- [ ] FAQ section
- [ ] Tips for best results
- [ ] Troubleshooting common issues
- [ ] Add to help center

**Dependencies:** Phase 5 complete

**Estimated Time:** 2-3 hours

---

## Summary

**Total Issues:** 25
**Total Estimated Time:** 65-85 hours
**Phases:** 6

**Phase Breakdown:**
- **Phase 1 (Foundation):** 8 issues, ~20 hours
- **Phase 2 (Strategy Pattern):** 5 issues, ~13 hours
- **Phase 3 (Builder Integration):** 3 issues, ~8 hours
- **Phase 4 (Smart Detection):** 3 issues, ~10 hours
- **Phase 5 (Multi-Resume):** 3 issues, ~9 hours
- **Phase 6 (Testing & Docs):** 3 issues, ~10 hours

**Priority Order:**
1. Start with Phase 1 (Foundation) - Issues #1-8
2. Complete Phase 2 (Strategy Pattern) - Issues #9-13
3. Integrate with UI in Phase 3 - Issues #14-16
4. Enhance with Phase 4 - Issues #17-19
5. Add multi-resume in Phase 5 - Issues #20-22
6. Finalize with Phase 6 - Issues #23-25

---

## How to Use This Plan

1. **Create Milestone in GitHub:**
   - Go to your repo → Issues → Milestones → New Milestone
   - Title: "Object-Oriented Architecture"
   - Description: Copy from top of this document
   - Due date: Set based on your timeline

2. **Create Issues:**
   - Copy each issue section
   - Create new issue in GitHub
   - Add title, description, labels
   - Assign to milestone
   - Add to project board

3. **Track Progress:**
   - Use GitHub Projects for kanban board
   - Move issues through: Backlog → In Progress → Review → Done
   - Link PRs to issues with "Closes #X"

4. **Iterate:**
   - Complete Phase 1 before moving to Phase 2
   - Get feedback after each phase
   - Adjust remaining issues based on learnings

---

**Created by:** Ona AI Assistant
**Date:** 2025-10-10
**Repository:** HalftimeHarry/temp-resume-hub
