# Resume Generation Strategy Pattern

## Overview

The Resume Generation Strategy Pattern provides a flexible, extensible architecture for generating resumes based on different user profiles and requirements. This implementation follows the classic Strategy design pattern, allowing different resume generation algorithms to be selected at runtime.

## Architecture

### Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                    ResumeStrategy                            │
│                     (Interface)                              │
├─────────────────────────────────────────────────────────────┤
│ + generateResume(profile, template): ResumeBuilderData     │
│ + getStrategyName(): string                                 │
│ + isApplicable(profile): boolean                            │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │
                            │ implements
                            │
┌───────────────────────────┴─────────────────────────────────┐
│                                                               │
│          BaseResumeStrategy                                   │
│          (Abstract Class)                                     │
├───────────────────────────────────────────────────────────────┤
│ # generatePersonalInfo(): PersonalInfo                        │
│ # generateSummary(): string                                   │
│ # generateSettings(): Settings                                │
│ # smartMergeField(): string                                   │
│ # parseStringList(): string[]                                 │
│ # getDefaultSkillLevel(): SkillLevel                          │
│                                                               │
│ Abstract Methods:                                             │
│ # generateExperience(): Experience[]                          │
│ # generateEducation(): Education[]                            │
│ # generateSkills(): Skill[]                                   │
│ # generateProjects(): Project[]                               │
└───────────────────────────────────────────────────────────────┘
                            ▲
                            │
                            │ extends
                            │
        ┌───────────────────┴───────────────────────────────────────────────────────┐
        │               │               │               │               │             │
┌───────┴──────┐ ┌──────┴──────┐ ┌──────┴──────┐ ┌──────┴──────┐ ┌────┴──────────┐
│ Experienced  │ │ Career      │ │ Experienced │ │ FirstTime   │ │ Student       │
│ Professional │ │ Changer     │ │ Job Seeker  │ │ Job Seeker  │ │ Strategy      │
│ Strategy     │ │ Strategy    │ │ Strategy    │ │ Strategy    │ │               │
├──────────────┤ ├─────────────┤ ├─────────────┤ ├─────────────┤ ├───────────────┤
│ Focuses on:  │ │ Focuses on: │ │ Focuses on: │ │ Focuses on: │ │ Focuses on:   │
│ - Senior     │ │ - Industry  │ │ - Profile   │ │ - Template  │ │ - Education   │
│ - Leadership │ │   adapt     │ │   first     │ │   examples  │ │ - Projects    │
│ - Achieve.   │ │ - Transfer. │ │ - Work exp. │ │ - Profile   │ │ - Potential   │
│ - Growth     │ │ - Reframe   │ │ - Growth    │ │   contact   │ │ - Academic    │
└──────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └───────────────┘
```

### Strategy Factory

```
┌─────────────────────────────────────────────────────────────┐
│              ResumeStrategyFactory                           │
├─────────────────────────────────────────────────────────────┤
│ + getStrategy(profile): ResumeStrategy                      │
│ + getStrategyByName(name): ResumeStrategy                   │
│ + registerStrategy(strategy): void                          │
│ + getAllStrategies(): ResumeStrategy[]                      │
└─────────────────────────────────────────────────────────────┘
```

## Usage

### Automatic Strategy Selection with Confidence Scoring

```typescript
import { ResumeStrategyFactory } from '$lib/services/ResumeStrategies';
import type { UserProfile } from '$lib/types';
import type { ExtendedResumeTemplate } from '$lib/templates/types';

// Automatic selection with confidence scoring
const selection = ResumeStrategyFactory.selectStrategy(profile);

console.log(`Selected: ${selection.strategyName}`);
console.log(`Confidence: ${(selection.confidence * 100).toFixed(0)}%`);
console.log(`Reasons: ${selection.reasons.join(', ')}`);

// Generate resume with selected strategy
const resume = selection.strategy.generateResume(profile, template);
```

### Manual Strategy Override

```typescript
// Override automatic selection
const selection = ResumeStrategyFactory.selectStrategy(
  profile,
  'CareerChanger' // Manual override
);

// Confidence will be 1.0 for manual overrides
console.log(selection.confidence); // 1.0
console.log(selection.reasons); // ['Manual override selected']
```

### View All Strategy Scores

```typescript
// Get scores for all strategies
const allScores = ResumeStrategyFactory.getAllStrategyScores(profile);

allScores.forEach(score => {
  console.log(`${score.strategyName}: ${score.confidence.toFixed(2)}`);
  console.log(`  Reasons: ${score.reasons.join(', ')}`);
});

// Output:
// ExperiencedProfessional: 0.95
//   Reasons: Senior level experience, Has substantial work experience
// CareerChanger: 0.00
//   Reasons: Not applicable for this profile
// ...
```

### Basic Usage (Legacy)

```typescript
import { ResumeStrategyFactory } from '$lib/services/ResumeStrategies';
import type { UserProfile } from '$lib/types';
import type { ExtendedResumeTemplate } from '$lib/templates/types';

// Automatic strategy selection
const profile: UserProfile = { /* ... */ };
const template: ExtendedResumeTemplate = { /* ... */ };

const strategy = ResumeStrategyFactory.getStrategy(profile);
const resume = strategy.generateResume(profile, template);
```

### Manual Strategy Selection

```typescript
// Select specific strategy by name
const strategy = ResumeStrategyFactory.getStrategyByName('Student');
const resume = strategy.generateResume(profile, template);
```

### With Target Industry

```typescript
const strategy = ResumeStrategyFactory.getStrategy(profile);
const resume = strategy.generateResume(profile, template, 'software-engineering');
```

## Available Strategies

### 1. ExperiencedProfessionalStrategy

**Purpose**: For senior-level professionals with substantial leadership experience.

**Applicable When**:
- Experience level includes: senior, lead, principal, staff, architect
- Has structured work experience data
- Leadership or advanced technical roles

**Focus Areas**:
- ✅ Work experience (primary focus)
- ✅ Professional achievements
- ✅ Career progression
- ✅ Advanced skill levels
- ✅ Professional projects

**Data Sources**:
- `work_experience` (structured JSON/array)
- `education` (structured JSON/array)
- `key_skills` (comma-separated)
- `projects` (structured JSON/array)
- `professional_summary`

**Example Profile**:
```typescript
{
  experience_level: 'senior',
  work_experience: [
    {
      company: 'Tech Corp',
      position: 'Senior Engineer',
      start_date: '2020-01',
      highlights: ['Led team', 'Improved performance']
    }
  ],
  key_skills: 'JavaScript, React, Node.js, AWS'
}
```

### 2. CareerChangerStrategy

**Purpose**: For professionals transitioning to a new industry who need to adapt their experience.

**Applicable When**:
- Career stage is 'career_change', 'career-change', or includes 'transition'
- Has work experience data (required)
- Has target industry (for transition stage)

**Focus Areas**:
- ✅ Adapt existing experience to target industry
- ✅ Highlight transferable skills
- ✅ Generate career change focused summary
- ✅ Reframe job descriptions for relevance
- ✅ Prioritize transferable achievements

**Data Sources**:
1. Profile work experience → reframed for target industry
2. Profile skills → categorized as transferable
3. Template skills → target industry skills
4. Career change summary → generated or from profile
5. Profile education → used as-is
6. Profile projects → reframed for relevance

**Key Features**:
- **Highlight Reordering**: Sorts highlights to prioritize transferable skills (leadership, problem-solving, communication)
- **Skill Categorization**: Marks profile skills as "Transferable Skills"
- **Industry Adaptation**: Uses target industry from profile or parameter
- **Career Change Summary**: Auto-generates summary emphasizing transition

**Example Profile**:
```typescript
{
  career_stage: 'career_change',
  target_industry: 'software-engineering',
  experience_level: 'mid-level',
  
  professional_summary: 'Transitioning from education to software engineering...',
  
  work_experience: [
    {
      company: 'Lincoln High School',
      position: 'Math Teacher',
      highlights: [
        'Developed curriculum for 150+ students',
        'Led team of 5 teachers',
        'Created data tracking system'
      ]
    }
  ],
  
  key_skills: 'Project Management, Communication, Problem Solving, Leadership'
}
```

### 3. ExperiencedJobSeekerStrategy

**Purpose**: For job seekers with work experience who prioritize profile data over template defaults.

**Applicable When**:
- Has work experience data (JSON string or array)
- Experience level includes: junior, mid-level, intermediate, entry-level
- Career stage is 'professional' or 'entry'
- NOT a student

**Focus Areas**:
- ✅ Profile work experience (prioritized)
- ✅ Profile education (prioritized)
- ✅ Professional summary from profile
- ✅ Merged profile and template skills
- ✅ Profile projects

**Data Sources** (Profile First):
1. `professional_summary` → template summary
2. `work_experience` → template experience
3. `education` → template education
4. `key_skills` merged with template skills
5. `projects` → template projects

**Example Profile**:
```typescript
{
  experience_level: 'mid-level',
  career_stage: 'professional',
  professional_summary: 'Full-stack developer with 4 years experience...',
  work_experience: [
    {
      company: 'Web Agency',
      position: 'Full Stack Developer',
      current: true,
      highlights: ['Built 20+ websites', 'Improved performance']
    }
  ],
  key_skills: 'React, Node.js, MongoDB'
}
```

### 3. FirstTimeJobSeekerStrategy

**Purpose**: For first-time job seekers who need professional resume examples with their contact information.

**Applicable When**:
- Experience level includes: entry-level, first-time
- Career stage is 'entry' or 'first-time'
- Does NOT have work experience data
- NOT a student

**Focus Areas**:
- ✅ Template experience examples (primary)
- ✅ Template skills examples (primary)
- ✅ Profile contact information
- ✅ Academic projects if available
- ✅ Volunteer experience if available
- ✅ Template or profile summary

**Data Sources** (Template First):
1. Template experience → used as-is
2. Template skills → profile skills added
3. Template summary → profile summary if provided
4. Profile contact info (name, phone, location, etc.)
5. `academic_projects` → added to projects
6. `volunteer_experience` → added to projects
7. `personal_projects` → added to projects
8. Profile education → template education

**Example Profile**:
```typescript
{
  experience_level: 'entry-level',
  career_stage: 'entry',
  first_name: 'Alex',
  last_name: 'Johnson',
  phone: '+1-555-0100',
  location: 'Portland, OR',
  
  // No work experience
  work_experience: undefined,
  
  // Has some projects
  academic_projects: 'Built a web application for class project',
  volunteer_experience: 'Helped nonprofit with website',
  key_skills: 'HTML, CSS, JavaScript',
  education_level: 'bachelor'
}
```

### 4. StudentStrategy

**Purpose**: For students, recent graduates, and current students.

**Applicable When**:
- Experience level includes: student, entry, entry-level
- Career stage is 'student'

**Focus Areas**:
- ✅ Education (primary focus)
- ✅ Academic projects
- ✅ Personal projects
- ✅ Volunteer experience
- ✅ Extracurricular activities
- ✅ Potential and learning

**Data Sources**:
- `education` or `education_level`
- `academic_projects` (text)
- `personal_projects` (text)
- `volunteer_experience` (text)
- `extracurricular_activities` (text)
- `technical_proficiencies` (comma-separated)

**Example Profile**:
```typescript
{
  experience_level: 'student',
  education_level: 'bachelor',
  academic_projects: 'Built ML classifier for image recognition',
  personal_projects: 'Created portfolio website',
  technical_proficiencies: 'Python, Java, JavaScript'
}
```

## Creating Custom Strategies

### Step 1: Extend BaseResumeStrategy

```typescript
import { BaseResumeStrategy } from '$lib/services/ResumeStrategies';
import type { Experience, Education, Skill, Project } from '$lib/types/resume';

export class CustomStrategy extends BaseResumeStrategy {
  getStrategyName(): string {
    return 'Custom';
  }

  isApplicable(profile: UserProfile): boolean {
    // Define when this strategy should be used
    return profile.target_industry === 'custom-industry';
  }

  protected generateExperience(): Experience[] {
    // Custom experience generation logic
    return [];
  }

  protected generateEducation(): Education[] {
    // Custom education generation logic
    return [];
  }

  protected generateSkills(): Skill[] {
    // Custom skills generation logic
    return [];
  }

  protected generateProjects(): Project[] {
    // Custom projects generation logic
    return [];
  }
}
```

### Step 2: Register the Strategy

```typescript
import { ResumeStrategyFactory } from '$lib/services/ResumeStrategies';
import { CustomStrategy } from './CustomStrategy';

// Register your custom strategy
ResumeStrategyFactory.registerStrategy(new CustomStrategy());

// Now it will be available for selection
const strategy = ResumeStrategyFactory.getStrategy(profile);
```

### Step 3: Override Common Methods (Optional)

```typescript
export class CustomStrategy extends BaseResumeStrategy {
  // ... required methods ...

  // Override personal info generation
  protected generatePersonalInfo(): PersonalInfo {
    const baseInfo = super.generatePersonalInfo();
    
    // Add custom logic
    return {
      ...baseInfo,
      // Custom modifications
    };
  }

  // Override summary generation
  protected generateSummary(): string {
    const baseSummary = super.generateSummary();
    
    // Add industry-specific keywords
    return this.enhanceWithKeywords(baseSummary);
  }
}
```

## Strategy Selection Logic

The factory uses the following logic to select a strategy:

```typescript
1. Iterate through registered strategies
2. Call isApplicable(profile) on each strategy
3. Return the first applicable strategy
4. If none applicable, return default (ExperiencedProfessionalStrategy)
```

### Priority Order

1. **Custom Strategies** (registered first)
2. **ExperiencedProfessionalStrategy**
3. **CareerChangerStrategy**
4. **ExperiencedJobSeekerStrategy**
5. **FirstTimeJobSeekerStrategy**
6. **StudentStrategy**
7. **Default** (ExperiencedProfessionalStrategy)

### Strategy Selection Priority

The factory evaluates strategies in order:

1. **ExperiencedProfessionalStrategy** - Senior/Lead/Principal/Staff/Architect
2. **CareerChangerStrategy** - Career change/transition with work experience
3. **ExperiencedJobSeekerStrategy** - Junior/Mid-level/Entry with work experience
4. **FirstTimeJobSeekerStrategy** - Entry-level without work experience (not students)
5. **StudentStrategy** - Students or entry-level with student career stage
6. **Default** - Falls back to ExperiencedProfessionalStrategy

### Strategy Selection Flow

```
Profile
  │
  ├─ Senior/Lead/Principal? ──→ ExperiencedProfessionalStrategy
  │
  ├─ Career Change/Transition? ──→ CareerChangerStrategy
  │   (requires work experience)
  │
  ├─ Has work experience?
  │   ├─ Yes (Mid/Junior) ──→ ExperiencedJobSeekerStrategy
  │   └─ No
  │       ├─ Student? ──→ StudentStrategy
  │       └─ Entry-level? ──→ FirstTimeJobSeekerStrategy
  │
  └─ Default ──→ ExperiencedProfessionalStrategy
```

### Strategy Comparison Table

| Feature | ExperiencedProfessional | CareerChanger | ExperiencedJobSeeker | FirstTimeJobSeeker | Student |
|---------|------------------------|---------------|---------------------|-------------------|---------|
| **Target Audience** | Senior/Lead roles | Career transitioners | Mid/Junior with exp. | Entry-level, no exp. | Students/Recent grads |
| **Work Experience** | Required, structured | Required, reframed | Required, profile-first | Template examples | Empty array |
| **Skills** | Merged, advanced | Transferable + target | Profile + template | Template + profile | Technical proficiencies |
| **Summary** | Profile or template | Career change focused | Profile prioritized | Template or profile | Template |
| **Education** | Structured parsing | Profile parsing | Profile prioritized | Profile or level | Structured or level |
| **Projects** | Structured parsing | Reframed | Profile prioritized | Academic + volunteer | Academic + personal |
| **Data Priority** | Profile data | Adaptation | Profile first | Template first | Profile projects |
| **Special Feature** | Advanced skills | Highlight reordering | - | Professional examples | Beginner level |
| **Use Case** | Experienced pros | Industry switchers | Job seekers | First resume | Current students |

## Common Methods in BaseResumeStrategy

### Protected Helper Methods

#### `smartMergeField(profileValue, templateValue, placeholders)`
Intelligently merges profile and template data, avoiding placeholders.

```typescript
const fullName = this.smartMergeField(
  profileFullName,
  templatePersonal?.fullName,
  ['John Doe', 'Jane Smith']
);
```

#### `parseStringList(str)`
Parses comma or newline-separated strings into arrays.

```typescript
const skills = this.parseStringList('JavaScript, React, Node.js');
// Returns: ['JavaScript', 'React', 'Node.js']
```

#### `getDefaultSkillLevel()`
Determines skill level based on experience level.

```typescript
const level = this.getDefaultSkillLevel();
// Returns: 'beginner' | 'intermediate' | 'advanced' | 'expert'
```

#### `parseHighlights(exp)`
Extracts highlights/achievements from experience data.

```typescript
const highlights = this.parseHighlights(experienceItem);
// Handles: arrays, strings, or 'achievements' field
// Returns: string[]
```

## Confidence Scoring

The `StrategySelector` evaluates each strategy and assigns a confidence score (0-1) based on multiple factors:

### Scoring Factors

**CareerChanger Strategy:**
- Base: 0.5 (if applicable)
- +0.3: Explicitly marked as `career_change`
- +0.2: Career stage includes 'transition'
- +0.2: Has target industry specified
- +0.1: Has work experience to adapt

**ExperiencedProfessional Strategy:**
- Base: 0.5 (if applicable)
- +0.3-0.35: Senior/Lead/Principal/Staff/Architect level
- +0.15: Has substantial work experience

**ExperiencedJobSeeker Strategy:**
- Base: 0.5 (if applicable)
- +0.2-0.25: Mid-level/Junior/Intermediate experience
- +0.2: Has work experience
- +0.1: Has professional summary

**FirstTimeJobSeeker Strategy:**
- Base: 0.5 (if applicable)
- +0.2: Entry-level position seeker
- +0.3: No work experience (needs examples)
- +0.1: Has academic or volunteer experience

**Student Strategy:**
- Base: 0.5 (if applicable)
- +0.3: Currently a student
- +0.1: Has education level specified
- +0.15: Has academic or personal projects

### Confidence Interpretation

| Score | Interpretation |
|-------|---------------|
| 0.9-1.0 | Excellent match - highly confident |
| 0.7-0.89 | Good match - confident |
| 0.5-0.69 | Moderate match - applicable but not ideal |
| 0.1-0.49 | Weak match - barely applicable |
| 0.0 | Not applicable |

### Example Output

```typescript
{
  strategyName: 'CareerChanger',
  confidence: 0.9,
  reasons: [
    'Explicitly marked as career changer',
    'Has target industry specified',
    'Has work experience to adapt'
  ],
  strategy: CareerChangerStrategy { ... }
}
```

## Benefits of Strategy Pattern

### 1. **Flexibility**
- Easy to add new resume generation approaches
- No modification to existing code (Open/Closed Principle)

### 2. **Maintainability**
- Each strategy is self-contained
- Clear separation of concerns
- Easy to test independently

### 3. **Extensibility**
- Register custom strategies at runtime
- Override specific methods as needed
- Reuse common logic from base class

### 4. **Testability**
- Test each strategy in isolation
- Mock strategies for integration tests
- Clear interfaces for testing

## Testing Strategies

### Unit Testing

```typescript
import { ExperiencedProfessionalStrategy } from '$lib/services/ResumeStrategies';

describe('ExperiencedProfessionalStrategy', () => {
  it('should be applicable for senior professionals', () => {
    const strategy = new ExperiencedProfessionalStrategy();
    const profile = { experience_level: 'senior', /* ... */ };
    
    expect(strategy.isApplicable(profile)).toBe(true);
  });

  it('should generate resume with work experience', () => {
    const strategy = new ExperiencedProfessionalStrategy();
    const resume = strategy.generateResume(profile, template);
    
    expect(resume.experience.length).toBeGreaterThan(0);
  });
});
```

### Integration Testing

```typescript
import { ResumeStrategyFactory } from '$lib/services/ResumeStrategies';

describe('Strategy Selection', () => {
  it('should select student strategy for students', () => {
    const profile = { experience_level: 'student', /* ... */ };
    const strategy = ResumeStrategyFactory.getStrategy(profile);
    
    expect(strategy.getStrategyName()).toBe('Student');
  });
});
```

## Migration from ResumeGenerator

The existing `ResumeGenerator` class can be refactored to use strategies:

```typescript
// Before
const generator = new ResumeGenerator(profile, template);
const resume = generator.generateDraft();

// After (using strategies)
const strategy = ResumeStrategyFactory.getStrategy(profile);
const resume = strategy.generateResume(profile, template);

// Or keep ResumeGenerator as a facade
class ResumeGenerator {
  constructor(
    private profile: UserProfile,
    private template: ExtendedResumeTemplate,
    private targetIndustry?: string
  ) {}

  generateDraft(): ResumeBuilderData {
    const strategy = ResumeStrategyFactory.getStrategy(this.profile);
    return strategy.generateResume(
      this.profile,
      this.template,
      this.targetIndustry
    );
  }
}
```

## Future Enhancements

### Potential New Strategies

1. **CareerChangerStrategy**
   - For professionals switching industries
   - Emphasizes transferable skills
   - Focuses on relevant projects

2. **FreelancerStrategy**
   - For freelancers and contractors
   - Emphasizes client work and projects
   - Highlights diverse experience

3. **ExecutiveStrategy**
   - For C-level and executives
   - Focuses on leadership and impact
   - Emphasizes strategic achievements

4. **IndustrySpecificStrategies**
   - TechStrategy
   - DesignStrategy
   - MarketingStrategy
   - SalesStrategy

### AI Integration

```typescript
export class AIEnhancedStrategy extends BaseResumeStrategy {
  protected async generateSummary(): Promise<string> {
    const baseSummary = super.generateSummary();
    return await this.enhanceWithAI(baseSummary);
  }

  private async enhanceWithAI(summary: string): Promise<string> {
    // Call AI service to enhance summary
    return aiService.enhance(summary, this.targetIndustry);
  }
}
```

## Best Practices

### 1. Keep Strategies Focused
- Each strategy should have a clear purpose
- Don't try to handle all cases in one strategy

### 2. Reuse Base Class Logic
- Override only what's necessary
- Use helper methods from base class

### 3. Make Strategies Stateless
- Don't store mutable state in strategies
- Use method parameters for data

### 4. Test Thoroughly
- Test applicability logic
- Test each generation method
- Test edge cases

### 5. Document Strategy Purpose
- Clear documentation of when to use
- Example profiles
- Expected output

## Troubleshooting

### Strategy Not Being Selected

**Problem**: Wrong strategy is being used.

**Solution**: Check `isApplicable()` logic and registration order.

```typescript
// Debug strategy selection
const allStrategies = ResumeStrategyFactory.getAllStrategies();
allStrategies.forEach(strategy => {
  console.log(
    strategy.getStrategyName(),
    strategy.isApplicable(profile)
  );
});
```

### Missing Data in Generated Resume

**Problem**: Some sections are empty.

**Solution**: Check if strategy is accessing correct profile fields.

```typescript
// Add logging in strategy
protected generateExperience(): Experience[] {
  console.log('Profile experience:', this.profile.work_experience);
  // ... generation logic
}
```

### Custom Strategy Not Working

**Problem**: Custom strategy not being used.

**Solution**: Ensure it's registered before use.

```typescript
// Register before factory usage
ResumeStrategyFactory.registerStrategy(new CustomStrategy());

// Then use factory
const strategy = ResumeStrategyFactory.getStrategy(profile);
```

## Related Documentation

- [ResumeGenerator Service](./ResumeGenerator.ts)
- [Type Definitions](../types/)
- [Template System](../templates/)
- [Test Suite](../../tests/README.md)
