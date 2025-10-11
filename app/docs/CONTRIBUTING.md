# Contributing to Resume Generation System

Thank you for your interest in contributing! This guide will help you add new strategies, improve existing code, and maintain the quality of the resume generation system.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Adding New Strategies](#adding-new-strategies)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Code Review Guidelines](#code-review-guidelines)

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Basic understanding of TypeScript
- Familiarity with the Strategy Pattern
- Understanding of resume writing best practices

### Repository Structure

```
app/
├── src/
│   ├── lib/
│   │   ├── services/
│   │   │   ├── ResumeGenerator.ts       # Main generator class
│   │   │   ├── ResumeStrategies.ts      # Strategy implementations
│   │   │   ├── ProfileAnalysis.ts       # Profile analysis service
│   │   │   └── TemplateRecommendation.ts # Template recommendation
│   │   └── types/
│   │       └── index.ts                  # Type definitions
│   └── tests/
│       ├── ResumeGenerator.test.ts       # Generator tests
│       ├── ResumeStrategies.test.ts      # Strategy tests
│       ├── fixtures/
│       │   └── profiles.ts               # Test fixtures
│       └── integration/
│           └── resume-generation.test.ts # Integration tests
└── docs/
    ├── ARCHITECTURE.md                   # Architecture overview
    ├── API.md                            # API reference
    ├── STRATEGIES.md                     # Strategy guide
    ├── EXAMPLES.md                       # Usage examples
    ├── CONTRIBUTING.md                   # This file
    └── TROUBLESHOOTING.md                # Troubleshooting guide
```

---

## Development Setup

### 1. Clone and Install

```bash
git clone https://github.com/your-org/resume-hub.git
cd resume-hub/app
npm install
```

### 2. Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- ResumeStrategies.test.ts

# Run with coverage
npm test -- --coverage
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Build

```bash
npm run build
```

---

## Adding New Strategies

### Step 1: Plan Your Strategy

Before coding, answer these questions:

1. **Who is the target audience?**
   - Career stage (student, professional, executive)
   - Industry or role type
   - Specific needs or challenges

2. **What makes this strategy unique?**
   - How does it differ from existing strategies?
   - What specific problems does it solve?
   - What content should it emphasize?

3. **When should it be used?**
   - What profile characteristics trigger this strategy?
   - Should it be auto-selected or manual only?

### Step 2: Create Strategy File

Create a new file in `src/lib/services/strategies/`:

```typescript
// src/lib/services/strategies/IndustrySpecificStrategy.ts
import type { ResumeStrategy, UserProfile, ResumeTemplate } from '$lib/types';

/**
 * Strategy for [specific industry/role]
 * 
 * Target Audience:
 * - [Description of target users]
 * 
 * Focus Areas:
 * - [Key focus area 1]
 * - [Key focus area 2]
 * - [Key focus area 3]
 * 
 * When to Use:
 * - [Criteria 1]
 * - [Criteria 2]
 */
export class IndustrySpecificStrategy implements ResumeStrategy {
  name = 'industry-specific';
  
  /**
   * Generates professional summary tailored for [industry/role]
   */
  generateSummary(profile: UserProfile, template?: ResumeTemplate): string {
    // Extract relevant data
    const experience = this.extractExperience(profile);
    const skills = this.extractKeySkills(profile);
    const achievements = this.extractAchievements(profile);
    
    // Build summary
    let summary = '';
    
    // Add experience context
    if (experience.years > 0) {
      summary += `${profile.experience_level || 'Professional'} with ${experience.years}+ years `;
      summary += `of experience in ${profile.target_industry || 'the industry'}. `;
    }
    
    // Add key skills
    if (skills.length > 0) {
      summary += `Expertise in ${skills.slice(0, 3).join(', ')}. `;
    }
    
    // Add achievements
    if (achievements.length > 0) {
      summary += achievements[0] + '. ';
    }
    
    // Add value proposition
    summary += 'Committed to [specific value proposition for this industry].';
    
    return summary.trim();
  }
  
  /**
   * Prioritizes sections based on [industry/role] best practices
   */
  prioritizeSections(profile: UserProfile): string[] {
    const sections: string[] = [];
    
    // Determine priority based on profile
    if (this.hasRelevantExperience(profile)) {
      sections.push('experience');
    }
    
    sections.push('skills');
    
    if (this.hasRelevantEducation(profile)) {
      sections.push('education');
    }
    
    sections.push('projects', 'certifications');
    
    return sections;
  }
  
  /**
   * Provides recommendations specific to [industry/role]
   */
  getRecommendations(profile: UserProfile): string[] {
    const recommendations: string[] = [];
    
    // Check for industry-specific requirements
    if (!this.hasIndustryKeywords(profile)) {
      recommendations.push('Add industry-specific keywords and terminology');
    }
    
    if (!this.hasQuantifiableAchievements(profile)) {
      recommendations.push('Include quantifiable achievements with metrics');
    }
    
    if (!this.hasRelevantCertifications(profile)) {
      recommendations.push('Consider adding relevant industry certifications');
    }
    
    return recommendations;
  }
  
  // Private helper methods
  
  private extractExperience(profile: UserProfile): { years: number; roles: string[] } {
    // Implementation
    return { years: 0, roles: [] };
  }
  
  private extractKeySkills(profile: UserProfile): string[] {
    // Implementation
    return [];
  }
  
  private extractAchievements(profile: UserProfile): string[] {
    // Implementation
    return [];
  }
  
  private hasRelevantExperience(profile: UserProfile): boolean {
    // Implementation
    return false;
  }
  
  private hasRelevantEducation(profile: UserProfile): boolean {
    // Implementation
    return false;
  }
  
  private hasIndustryKeywords(profile: UserProfile): boolean {
    // Implementation
    return false;
  }
  
  private hasQuantifiableAchievements(profile: UserProfile): boolean {
    // Implementation
    return false;
  }
  
  private hasRelevantCertifications(profile: UserProfile): boolean {
    // Implementation
    return false;
  }
}
```

### Step 3: Export Strategy

Add your strategy to `src/lib/services/ResumeStrategies.ts`:

```typescript
// Export new strategy
export { IndustrySpecificStrategy } from './strategies/IndustrySpecificStrategy';
```

### Step 4: Update AutoStrategy (Optional)

If your strategy should be auto-selected, update `AutoStrategy`:

```typescript
// In AutoStrategy.detectBestStrategy()
private detectBestStrategy(profile: UserProfile): ResumeStrategy {
  // Add logic to detect when to use your strategy
  if (this.shouldUseIndustrySpecific(profile)) {
    return new IndustrySpecificStrategy();
  }
  
  // ... existing logic
}

private shouldUseIndustrySpecific(profile: UserProfile): boolean {
  // Define criteria for auto-selection
  return profile.target_industry === 'specific-industry' &&
         profile.experience_level === 'mid-level';
}
```

### Step 5: Write Tests

Create comprehensive tests in `src/tests/strategies/`:

```typescript
// src/tests/strategies/IndustrySpecificStrategy.test.ts
import { describe, it, expect } from 'vitest';
import { IndustrySpecificStrategy } from '$lib/services/strategies/IndustrySpecificStrategy';
import { experiencedProfile, studentProfile } from '../fixtures/profiles';

describe('IndustrySpecificStrategy', () => {
  const strategy = new IndustrySpecificStrategy();
  
  describe('generateSummary', () => {
    it('should generate industry-appropriate summary', () => {
      const summary = strategy.generateSummary(experiencedProfile);
      
      expect(summary).toBeTruthy();
      expect(summary).toContain('experience');
      expect(summary.length).toBeGreaterThan(50);
    });
    
    it('should handle profiles with limited experience', () => {
      const summary = strategy.generateSummary(studentProfile);
      
      expect(summary).toBeTruthy();
      expect(summary).not.toContain('years of experience');
    });
    
    it('should incorporate template context', () => {
      const template = {
        starterData: {
          summary: 'Template context'
        }
      };
      
      const summary = strategy.generateSummary(experiencedProfile, template);
      expect(summary).toBeTruthy();
    });
  });
  
  describe('prioritizeSections', () => {
    it('should prioritize experience for experienced profiles', () => {
      const sections = strategy.prioritizeSections(experiencedProfile);
      
      expect(sections[0]).toBe('experience');
    });
    
    it('should prioritize education for students', () => {
      const sections = strategy.prioritizeSections(studentProfile);
      
      expect(sections).toContain('education');
      expect(sections.indexOf('education')).toBeLessThan(3);
    });
  });
  
  describe('getRecommendations', () => {
    it('should provide relevant recommendations', () => {
      const recommendations = strategy.getRecommendations(experiencedProfile);
      
      expect(recommendations).toBeInstanceOf(Array);
      expect(recommendations.length).toBeGreaterThan(0);
      recommendations.forEach(rec => {
        expect(rec).toBeTruthy();
        expect(typeof rec).toBe('string');
      });
    });
    
    it('should identify missing industry keywords', () => {
      const profileWithoutKeywords = {
        ...experiencedProfile,
        key_skills: ''
      };
      
      const recommendations = strategy.getRecommendations(profileWithoutKeywords);
      expect(recommendations).toContain(
        expect.stringContaining('industry-specific keywords')
      );
    });
  });
});
```

### Step 6: Add Integration Tests

Add integration tests in `src/tests/integration/`:

```typescript
// In resume-generation.test.ts
describe('IndustrySpecificStrategy Integration', () => {
  it('should generate complete resume with industry-specific strategy', () => {
    const profile = {
      ...experiencedProfile,
      target_industry: 'specific-industry'
    };
    
    const generator = new ResumeGenerator(profile, template);
    const resume = generator.generateDraft();
    
    expect(resume.metadata.strategy).toBe('industry-specific');
    expect(resume.summary).toContain('industry-specific content');
    expect(resume.experience.length).toBeGreaterThan(0);
  });
});
```

### Step 7: Document Your Strategy

Add documentation to `docs/STRATEGIES.md`:

````markdown
### IndustrySpecificStrategy

**Purpose**: Optimized for [specific industry/role]

**Target Audience:**
- [Description of target users]

**Focus Areas:**
- [Key focus area 1]
- [Key focus area 2]

**Example:**

```typescript
import { IndustrySpecificStrategy } from '$lib/services/ResumeStrategies';

const strategy = new IndustrySpecificStrategy();
const summary = strategy.generateSummary(profile);
```

**Example Output:**

```
[Example of generated summary]
```
````

---

## Code Standards

### TypeScript Guidelines

1. **Use Strong Typing**

```typescript
// ✅ Good
function generateSummary(profile: UserProfile): string {
  return profile.professional_summary || '';
}

// ❌ Avoid
function generateSummary(profile: any): any {
  return profile.professional_summary || '';
}
```

2. **Use Interfaces for Contracts**

```typescript
// ✅ Good
interface ResumeStrategy {
  name: string;
  generateSummary(profile: UserProfile, template?: ResumeTemplate): string;
}

// ❌ Avoid
class ResumeStrategy {
  // No interface contract
}
```

3. **Prefer Const Over Let**

```typescript
// ✅ Good
const summary = generateSummary(profile);

// ❌ Avoid (unless reassignment needed)
let summary = generateSummary(profile);
```

### Naming Conventions

- **Classes**: PascalCase (`ExperiencedStrategy`)
- **Functions/Methods**: camelCase (`generateSummary`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- **Interfaces**: PascalCase with 'I' prefix optional (`ResumeStrategy`)
- **Private Methods**: camelCase with underscore prefix (`_helperMethod`)

### Code Organization

1. **Group Related Methods**

```typescript
class Strategy {
  // Public interface methods first
  generateSummary() { }
  prioritizeSections() { }
  getRecommendations() { }
  
  // Private helper methods last
  private extractData() { }
  private formatContent() { }
}
```

2. **Keep Methods Focused**

```typescript
// ✅ Good: Single responsibility
private extractExperience(profile: UserProfile): Experience[] {
  return JSON.parse(profile.work_experience || '[]');
}

private formatExperience(experience: Experience[]): string {
  return experience.map(e => e.position).join(', ');
}

// ❌ Avoid: Multiple responsibilities
private processExperience(profile: UserProfile): string {
  const exp = JSON.parse(profile.work_experience || '[]');
  return exp.map(e => e.position).join(', ');
}
```

3. **Use Descriptive Names**

```typescript
// ✅ Good
const hasRelevantExperience = this.checkExperienceRelevance(profile);

// ❌ Avoid
const flag = this.check(profile);
```

### Comments and Documentation

1. **Document Public APIs**

```typescript
/**
 * Generates a professional summary tailored for experienced professionals
 * 
 * @param profile - User profile containing work history and skills
 * @param template - Optional template for context and examples
 * @returns Formatted professional summary text
 * 
 * @example
 * ```typescript
 * const strategy = new ExperiencedStrategy();
 * const summary = strategy.generateSummary(profile);
 * ```
 */
generateSummary(profile: UserProfile, template?: ResumeTemplate): string {
  // Implementation
}
```

2. **Explain Complex Logic**

```typescript
// Calculate years of experience by finding the earliest start date
// and comparing to current date or most recent end date
const yearsOfExperience = this.calculateYears(experience);
```

3. **Avoid Obvious Comments**

```typescript
// ❌ Avoid
// Set name to first name plus last name
const name = `${profile.first_name} ${profile.last_name}`;

// ✅ Better (no comment needed)
const name = `${profile.first_name} ${profile.last_name}`;
```

---

## Testing Requirements

### Test Coverage Goals

- **New Strategies**: 90%+ coverage
- **Modified Code**: Maintain or improve existing coverage
- **Integration Tests**: Cover all major workflows

### Test Structure

```typescript
describe('StrategyName', () => {
  // Setup
  const strategy = new StrategyName();
  
  describe('generateSummary', () => {
    it('should handle experienced profiles', () => {
      // Test implementation
    });
    
    it('should handle entry-level profiles', () => {
      // Test implementation
    });
    
    it('should handle edge cases', () => {
      // Test implementation
    });
  });
  
  describe('prioritizeSections', () => {
    // Section priority tests
  });
  
  describe('getRecommendations', () => {
    // Recommendation tests
  });
});
```

### Test Best Practices

1. **Use Descriptive Test Names**

```typescript
// ✅ Good
it('should generate summary with years of experience for senior profiles', () => {
  // Test
});

// ❌ Avoid
it('works', () => {
  // Test
});
```

2. **Test One Thing Per Test**

```typescript
// ✅ Good
it('should include years of experience', () => {
  const summary = strategy.generateSummary(profile);
  expect(summary).toContain('8+ years');
});

it('should include key skills', () => {
  const summary = strategy.generateSummary(profile);
  expect(summary).toContain('JavaScript');
});

// ❌ Avoid
it('should generate correct summary', () => {
  const summary = strategy.generateSummary(profile);
  expect(summary).toContain('8+ years');
  expect(summary).toContain('JavaScript');
  expect(summary).toContain('leadership');
  // Too many assertions
});
```

3. **Use Test Fixtures**

```typescript
// ✅ Good
import { experiencedProfile, studentProfile } from '../fixtures/profiles';

it('should handle experienced profiles', () => {
  const summary = strategy.generateSummary(experiencedProfile);
  expect(summary).toBeTruthy();
});

// ❌ Avoid
it('should handle experienced profiles', () => {
  const profile = {
    id: '123',
    first_name: 'John',
    // ... 50 more lines of profile data
  };
  const summary = strategy.generateSummary(profile);
});
```

---

## Documentation

### Required Documentation

When adding a new strategy, update:

1. **STRATEGIES.md**: Detailed strategy documentation
2. **API.md**: API reference if adding new methods
3. **EXAMPLES.md**: Usage examples
4. **README.md**: Update strategy list if needed

### Documentation Template

```markdown
### StrategyName

**Purpose**: [One-line description]

**Target Audience:**
- [Audience description]

**Focus Areas:**
- [Focus area 1]
- [Focus area 2]

**When to Use:**
- [Criteria 1]
- [Criteria 2]

**Example:**

\`\`\`typescript
// Code example
\`\`\`

**Example Output:**

\`\`\`
[Example output]
\`\`\`
```

---

## Pull Request Process

### 1. Before Submitting

- [ ] All tests pass (`npm test`)
- [ ] Code follows style guidelines
- [ ] New code has tests (90%+ coverage)
- [ ] Documentation is updated
- [ ] No console.log or debug code
- [ ] Commit messages are clear

### 2. PR Title Format

```
[Type] Brief description

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation only
- test: Adding tests
- refactor: Code refactoring
- perf: Performance improvement
```

Examples:
- `feat: Add IndustrySpecificStrategy for healthcare`
- `fix: Handle null values in experience parsing`
- `docs: Update strategy selection documentation`

### 3. PR Description Template

```markdown
## Description
[Brief description of changes]

## Type of Change
- [ ] New strategy
- [ ] Bug fix
- [ ] Enhancement
- [ ] Documentation
- [ ] Refactoring

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Documentation
- [ ] API documentation updated
- [ ] Strategy guide updated
- [ ] Examples added
- [ ] README updated (if needed)

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] Coverage maintained/improved
- [ ] No breaking changes (or documented)
```

### 4. Review Process

1. **Automated Checks**: CI/CD runs tests and linting
2. **Code Review**: At least one maintainer reviews
3. **Feedback**: Address review comments
4. **Approval**: Maintainer approves PR
5. **Merge**: Squash and merge to main

---

## Code Review Guidelines

### For Contributors

- **Be Responsive**: Address feedback promptly
- **Ask Questions**: If feedback is unclear, ask
- **Be Open**: Consider alternative approaches
- **Test Thoroughly**: Verify fixes work

### For Reviewers

- **Be Constructive**: Suggest improvements, don't just criticize
- **Be Specific**: Point to exact lines and explain why
- **Be Timely**: Review within 2 business days
- **Be Thorough**: Check code, tests, and documentation

### Review Checklist

- [ ] Code is clear and maintainable
- [ ] Tests are comprehensive
- [ ] Documentation is complete
- [ ] No security issues
- [ ] Performance is acceptable
- [ ] Follows existing patterns
- [ ] Error handling is appropriate

---

## Getting Help

### Resources

- **Documentation**: Read [ARCHITECTURE.md](./ARCHITECTURE.md) and [STRATEGIES.md](./STRATEGIES.md)
- **Examples**: Check [EXAMPLES.md](./EXAMPLES.md) for patterns
- **Tests**: Look at existing tests for guidance

### Questions

- **GitHub Issues**: Open an issue for questions
- **Discussions**: Use GitHub Discussions for general questions
- **Email**: Contact maintainers at dev@resumehub.com

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

## Thank You!

Your contributions help make the Resume Generation system better for everyone. We appreciate your time and effort!
