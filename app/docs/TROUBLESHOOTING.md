# Troubleshooting Guide

Solutions to common issues with the Resume Generation system.

## Table of Contents

- [Common Issues](#common-issues)
- [Profile Validation Errors](#profile-validation-errors)
- [Generation Failures](#generation-failures)
- [Strategy Selection Issues](#strategy-selection-issues)
- [Template Problems](#template-problems)
- [Performance Issues](#performance-issues)
- [Data Format Issues](#data-format-issues)
- [Debugging Tips](#debugging-tips)

---

## Common Issues

### Resume Generation Returns Empty Sections

**Symptoms:**
- Generated resume has empty experience, education, or skills arrays
- Sections show as `[]` or contain no data

**Causes:**
1. Profile data is stored as JSON strings but not parsed
2. Profile fields are null or undefined
3. Data format doesn't match expected structure

**Solutions:**

```typescript
// Check if data needs parsing
console.log('Raw experience:', profile.work_experience);
console.log('Type:', typeof profile.work_experience);

// Parse if needed
const experience = typeof profile.work_experience === 'string'
  ? JSON.parse(profile.work_experience)
  : profile.work_experience;

console.log('Parsed experience:', experience);
```

**Fix:**

```typescript
// Ensure data is properly formatted before generation
function prepareProfile(profile: UserProfile): UserProfile {
  return {
    ...profile,
    work_experience: typeof profile.work_experience === 'string'
      ? JSON.parse(profile.work_experience || '[]')
      : profile.work_experience || [],
    education: typeof profile.education === 'string'
      ? JSON.parse(profile.education || '[]')
      : profile.education || [],
    projects: typeof profile.projects === 'string'
      ? JSON.parse(profile.projects || '[]')
      : profile.projects || []
  };
}

const preparedProfile = prepareProfile(rawProfile);
const generator = new ResumeGenerator(preparedProfile, template);
```

---

### "Cannot read property 'X' of undefined"

**Symptoms:**
- Error: `Cannot read property 'first_name' of undefined`
- Error: `Cannot read property 'work_experience' of undefined`

**Causes:**
1. Profile object is null or undefined
2. Required fields are missing
3. Profile not loaded from database

**Solutions:**

```typescript
// Add null checks
if (!profile) {
  throw new Error('Profile is required');
}

if (!profile.first_name || !profile.last_name) {
  throw new Error('Profile missing required fields');
}

// Validate before generation
const generator = new ResumeGenerator(profile, template);
const validation = generator.validateProfile();

if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
  throw new Error('Invalid profile');
}
```

**Prevention:**

```typescript
// Use TypeScript strict mode
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true
  }
}

// Add runtime validation
function validateProfile(profile: any): profile is UserProfile {
  return (
    profile &&
    typeof profile.id === 'string' &&
    typeof profile.first_name === 'string' &&
    typeof profile.last_name === 'string' &&
    typeof profile.user === 'string'
  );
}

if (!validateProfile(profile)) {
  throw new Error('Invalid profile structure');
}
```

---

### Generated Summary is Empty or Generic

**Symptoms:**
- Summary is empty string
- Summary contains only template text
- Summary doesn't reflect user's profile

**Causes:**
1. Profile missing `professional_summary` field
2. Strategy not generating custom content
3. Template has no starter data

**Solutions:**

```typescript
// Check profile data
console.log('Professional summary:', profile.professional_summary);
console.log('Experience level:', profile.experience_level);
console.log('Key skills:', profile.key_skills);

// Check strategy
const generator = new ResumeGenerator(profile, template);
console.log('Selected strategy:', generator.strategy.name);

// Generate with fallback
const summary = generator.generateSummary() || 
                profile.professional_summary || 
                'Professional seeking new opportunities';
```

**Fix:**

```typescript
// Ensure profile has necessary data for summary generation
function enrichProfile(profile: UserProfile): UserProfile {
  return {
    ...profile,
    professional_summary: profile.professional_summary || 
      `${profile.experience_level || 'Professional'} with expertise in ${profile.target_industry || 'various fields'}`,
    experience_level: profile.experience_level || 'mid-level',
    key_skills: profile.key_skills || 'Various professional skills'
  };
}
```

---

## Profile Validation Errors

### "Profile validation failed: Missing required fields"

**Error Details:**
```
Profile validation failed: Missing required fields
Errors: ["first_name is required", "last_name is required", "user is required"]
```

**Solution:**

```typescript
// Check which fields are missing
const validation = generator.validateProfile();
console.log('Missing fields:', validation.errors);

// Provide default values or prompt user
const completeProfile = {
  ...profile,
  first_name: profile.first_name || 'First',
  last_name: profile.last_name || 'Last',
  user: profile.user || 'user@example.com'
};
```

---

### "Profile completeness score too low"

**Symptoms:**
- Warning: Profile is only 30% complete
- Generated resume lacks detail

**Solution:**

```typescript
const validation = generator.validateProfile();
console.log(`Completeness: ${validation.completenessScore}%`);
console.log('Warnings:', validation.warnings);

// Identify missing recommended fields
if (validation.warnings.length > 0) {
  console.log('To improve completeness, add:');
  validation.warnings.forEach(warning => console.log(`  - ${warning}`));
}

// Guide user to complete profile
const missingFields = [
  'phone',
  'location',
  'professional_summary',
  'work_experience',
  'education',
  'key_skills'
].filter(field => !profile[field]);

console.log('Missing recommended fields:', missingFields);
```

---

## Generation Failures

### "JSON.parse error: Unexpected token"

**Error Details:**
```
SyntaxError: Unexpected token o in JSON at position 1
```

**Causes:**
- Trying to parse an object that's already parsed
- Malformed JSON string in profile field

**Solutions:**

```typescript
// Safe JSON parsing
function safeJSONParse<T>(value: any, fallback: T): T {
  if (!value) return fallback;
  if (typeof value !== 'string') return value; // Already parsed
  
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error('JSON parse error:', error);
    return fallback;
  }
}

// Usage
const experience = safeJSONParse(profile.work_experience, []);
const education = safeJSONParse(profile.education, []);
```

---

### "Strategy selection failed"

**Symptoms:**
- Error during strategy selection
- Wrong strategy selected for profile

**Solutions:**

```typescript
// Debug strategy selection
import { ProfileAnalysis } from '$lib/services/ProfileAnalysis';

const analysis = ProfileAnalysis.analyzeProfile(profile);
console.log('Profile Analysis:');
console.log('  Career Stage:', analysis.careerStage);
console.log('  Years Experience:', analysis.yearsOfExperience);
console.log('  Recommended Strategy:', analysis.recommendedStrategy);

// Manual strategy selection if auto-selection fails
import { ExperiencedStrategy } from '$lib/services/ResumeStrategies';

const generator = new ResumeGenerator(profile, template);
// Override strategy if needed
generator.strategy = new ExperiencedStrategy();
```

---

### "Template parsing error"

**Symptoms:**
- Error loading or parsing template
- Template fields are undefined

**Solutions:**

```typescript
// Validate template structure
function validateTemplate(template: any): template is ResumeTemplate {
  return (
    template &&
    typeof template.id === 'string' &&
    typeof template.name === 'string' &&
    template.settings &&
    typeof template.settings === 'object'
  );
}

if (!validateTemplate(template)) {
  console.error('Invalid template structure');
  // Use default template
  template = getDefaultTemplate();
}

// Check template fields
console.log('Template ID:', template.id);
console.log('Template Name:', template.name);
console.log('Has starter data:', !!template.starterData);
```

---

## Strategy Selection Issues

### AutoStrategy Selects Wrong Strategy

**Symptoms:**
- Student profile gets ExperiencedStrategy
- Senior professional gets FirstTimeStrategy

**Debug:**

```typescript
import { ProfileAnalysis } from '$lib/services/ProfileAnalysis';

// Analyze profile to understand selection
const analysis = ProfileAnalysis.analyzeProfile(profile);

console.log('Profile Analysis:');
console.log('  Career Stage:', analysis.careerStage);
console.log('  Years of Experience:', analysis.yearsOfExperience);
console.log('  Has Projects:', analysis.hasProjects);
console.log('  Skill Level:', analysis.skillLevel);
console.log('  Recommended Strategy:', analysis.recommendedStrategy);

// Check experience calculation
const experience = typeof profile.work_experience === 'string'
  ? JSON.parse(profile.work_experience || '[]')
  : profile.work_experience || [];

console.log('Experience entries:', experience.length);
experience.forEach((exp, i) => {
  console.log(`  ${i + 1}. ${exp.position} at ${exp.company}`);
  console.log(`     ${exp.startDate} - ${exp.endDate || 'Present'}`);
});
```

**Fix:**

```typescript
// Manually specify strategy if auto-selection is incorrect
import { FirstTimeStrategy } from '$lib/services/ResumeStrategies';

const generator = new ResumeGenerator(profile, template);

// Override for student profiles
if (profile.career_stage === 'student') {
  generator.strategy = new FirstTimeStrategy();
}
```

---

### Strategy Not Generating Expected Content

**Symptoms:**
- Summary doesn't match strategy style
- Section order is unexpected

**Debug:**

```typescript
// Test strategy directly
import { ExperiencedStrategy } from '$lib/services/ResumeStrategies';

const strategy = new ExperiencedStrategy();

// Test summary generation
const summary = strategy.generateSummary(profile, template);
console.log('Generated summary:', summary);

// Test section prioritization
const sections = strategy.prioritizeSections(profile);
console.log('Section order:', sections);

// Test recommendations
const recommendations = strategy.getRecommendations(profile);
console.log('Recommendations:', recommendations);
```

---

## Template Problems

### Template Not Loading

**Symptoms:**
- Template is null or undefined
- Error: "Cannot read property 'settings' of undefined"

**Solutions:**

```typescript
// Check template loading
async function loadTemplateWithFallback(templateId: string): Promise<ResumeTemplate> {
  try {
    const template = await loadTemplate(templateId);
    if (!template) {
      console.warn(`Template ${templateId} not found, using default`);
      return getDefaultTemplate();
    }
    return template;
  } catch (error) {
    console.error('Template loading failed:', error);
    return getDefaultTemplate();
  }
}

// Provide default template
function getDefaultTemplate(): ResumeTemplate {
  return {
    id: 'default',
    name: 'Default Template',
    settings: {
      fontSize: 12,
      fontFamily: 'Arial',
      margins: { top: 1, right: 1, bottom: 1, left: 1 }
    },
    starterData: {}
  };
}
```

---

### Template Starter Data Not Merging

**Symptoms:**
- Template placeholder text appears in resume
- Profile data not overriding template data

**Debug:**

```typescript
// Check template starter data
console.log('Template starter data:', template.starterData);

// Check merge logic
const personalInfo = generator.generatePersonalInfo();
console.log('Generated personal info:', personalInfo);

// Verify profile data takes precedence
console.log('Profile name:', `${profile.first_name} ${profile.last_name}`);
console.log('Template name:', template.starterData?.personalInfo?.name);
console.log('Final name:', personalInfo.name);
```

**Fix:**

```typescript
// Ensure profile data overrides template
function mergeWithTemplate(profileData: any, templateData: any): any {
  return {
    ...templateData,
    ...profileData,
    // Remove null/undefined values
    ...Object.fromEntries(
      Object.entries(profileData).filter(([_, v]) => v != null)
    )
  };
}
```

---

## Performance Issues

### Slow Resume Generation

**Symptoms:**
- Generation takes >1 second
- UI freezes during generation

**Debug:**

```typescript
// Profile generation time
const start = performance.now();
const resume = generator.generateDraft();
const duration = performance.now() - start;

console.log(`Generation took ${duration.toFixed(2)}ms`);

if (duration > 500) {
  console.warn('⚠️  Slow generation detected');
  
  // Check profile size
  console.log('Profile size:', JSON.stringify(profile).length);
  console.log('Experience entries:', profile.work_experience?.length || 0);
  console.log('Education entries:', profile.education?.length || 0);
  console.log('Skills:', profile.key_skills?.split(',').length || 0);
}
```

**Solutions:**

```typescript
// 1. Use lazy loading
const personalInfo = generator.generatePersonalInfo(); // Fast
const summary = generator.generateSummary(); // Only what's needed

// 2. Cache results
const cache = new Map();
const cacheKey = `${profile.id}-${template.id}`;

if (cache.has(cacheKey)) {
  return cache.get(cacheKey);
}

const resume = generator.generateDraft();
cache.set(cacheKey, resume);

// 3. Preprocess profile
const preprocessed = preprocessProfile(profile);
const generator = new ResumeGenerator(preprocessed, template);
```

See [Performance Guide](./PERFORMANCE.md) for more optimization strategies.

---

### Memory Issues with Batch Generation

**Symptoms:**
- Memory usage grows continuously
- Out of memory errors with large batches

**Solutions:**

```typescript
// Process in chunks
async function generateBatch(
  profiles: UserProfile[],
  template: ResumeTemplate,
  chunkSize = 10
): Promise<ResumeBuilderData[]> {
  const results = [];
  
  for (let i = 0; i < profiles.length; i += chunkSize) {
    const chunk = profiles.slice(i, i + chunkSize);
    
    const chunkResults = await Promise.all(
      chunk.map(profile => {
        const generator = new ResumeGenerator(profile, template);
        return generator.generateDraft();
      })
    );
    
    results.push(...chunkResults);
    
    // Allow garbage collection
    await new Promise(resolve => setTimeout(resolve, 0));
    
    console.log(`Processed ${i + chunk.length}/${profiles.length}`);
  }
  
  return results;
}
```

---

## Data Format Issues

### Date Format Problems

**Symptoms:**
- Dates display as "Invalid Date"
- Date parsing errors

**Solutions:**

```typescript
// Normalize date formats
function normalizeDate(date: string | Date): string {
  if (!date) return '';
  
  // Handle various formats
  const formats = [
    /^\d{4}-\d{2}$/, // YYYY-MM
    /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    /^\d{2}\/\d{4}$/, // MM/YYYY
  ];
  
  if (typeof date === 'string') {
    // Check if already in correct format
    if (formats.some(format => format.test(date))) {
      return date;
    }
    
    // Try to parse and reformat
    try {
      const parsed = new Date(date);
      if (!isNaN(parsed.getTime())) {
        return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}`;
      }
    } catch (error) {
      console.error('Date parsing error:', error);
    }
  }
  
  return '';
}

// Usage
const experience = profile.work_experience.map(exp => ({
  ...exp,
  startDate: normalizeDate(exp.startDate),
  endDate: exp.endDate ? normalizeDate(exp.endDate) : null
}));
```

---

### Skill Categorization Issues

**Symptoms:**
- Skills not categorized correctly
- All skills in "Other" category

**Debug:**

```typescript
// Check skill categorization
const skills = generator.generateSkills();

const categories = skills.reduce((acc, skill) => {
  acc[skill.category] = (acc[skill.category] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

console.log('Skills by category:', categories);

// Check if skills are recognized
const unrecognized = skills.filter(s => s.category === 'Other');
console.log('Unrecognized skills:', unrecognized.map(s => s.name));
```

**Fix:**

```typescript
// Add custom skill categories
const customCategories = {
  'React': 'Frameworks & Libraries',
  'Vue': 'Frameworks & Libraries',
  'Angular': 'Frameworks & Libraries',
  // Add more mappings
};

// Extend categorization logic
function categorizeSkill(skillName: string): string {
  const normalized = skillName.toLowerCase().trim();
  
  // Check custom categories first
  for (const [skill, category] of Object.entries(customCategories)) {
    if (normalized.includes(skill.toLowerCase())) {
      return category;
    }
  }
  
  // Fall back to default categorization
  return defaultCategorize(skillName);
}
```

---

## Debugging Tips

### Enable Debug Logging

```typescript
// Add debug flag
const DEBUG = true;

function debugLog(...args: any[]) {
  if (DEBUG) {
    console.log('[DEBUG]', ...args);
  }
}

// Use throughout code
debugLog('Profile:', profile);
debugLog('Strategy selected:', generator.strategy.name);
debugLog('Generated resume:', resume);
```

### Inspect Generated Data

```typescript
// Pretty print resume
console.log(JSON.stringify(resume, null, 2));

// Check specific sections
console.log('Personal Info:', resume.personalInfo);
console.log('Summary length:', resume.summary.length);
console.log('Experience count:', resume.experience.length);
console.log('Skills count:', resume.skills.length);

// Validate structure
function validateResume(resume: ResumeBuilderData): boolean {
  const required = [
    'personalInfo',
    'summary',
    'experience',
    'education',
    'skills',
    'metadata'
  ];
  
  const missing = required.filter(field => !(field in resume));
  
  if (missing.length > 0) {
    console.error('Missing required fields:', missing);
    return false;
  }
  
  return true;
}
```

### Test with Minimal Profile

```typescript
// Create minimal test profile
const minimalProfile: UserProfile = {
  id: 'test-123',
  user: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  role: 'job_seeker',
  plan: 'free',
  verified: true,
  active: true,
  profile_completed: false
};

// Test generation
try {
  const generator = new ResumeGenerator(minimalProfile, template);
  const resume = generator.generateDraft();
  console.log('✅ Minimal profile works');
} catch (error) {
  console.error('❌ Minimal profile failed:', error);
}
```

### Compare Strategies

```typescript
// Generate with different strategies
import { 
  ExperiencedStrategy, 
  FirstTimeStrategy, 
  CareerChangeStrategy 
} from '$lib/services/ResumeStrategies';

const strategies = [
  new ExperiencedStrategy(),
  new FirstTimeStrategy(),
  new CareerChangeStrategy()
];

strategies.forEach(strategy => {
  console.log(`\n=== ${strategy.name} ===`);
  
  const summary = strategy.generateSummary(profile, template);
  console.log('Summary:', summary);
  
  const sections = strategy.prioritizeSections(profile);
  console.log('Section order:', sections);
  
  const recommendations = strategy.getRecommendations(profile);
  console.log('Recommendations:', recommendations);
});
```

---

## Getting Help

If you're still experiencing issues:

1. **Check Documentation**
   - [Architecture Overview](./ARCHITECTURE.md)
   - [API Reference](./API.md)
   - [Strategy Guide](./STRATEGIES.md)
   - [Examples](./EXAMPLES.md)

2. **Search Issues**
   - Check GitHub Issues for similar problems
   - Search closed issues for solutions

3. **Create Issue**
   - Provide minimal reproduction code
   - Include error messages and stack traces
   - Describe expected vs actual behavior
   - Include environment details (Node version, OS, etc.)

4. **Contact Support**
   - Email: support@resumehub.com
   - Discord: [Join our community]
   - GitHub Discussions: Ask questions

---

## Issue Template

When reporting issues, please include:

```markdown
**Description**
Brief description of the issue

**Steps to Reproduce**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior**
What you expected to happen

**Actual Behavior**
What actually happened

**Code Sample**
```typescript
// Minimal code to reproduce
```

**Error Message**
```
Full error message and stack trace
```

**Environment**
- Node version: X.X.X
- Package version: X.X.X
- OS: Windows/Mac/Linux
- Browser (if applicable): Chrome/Firefox/Safari

**Additional Context**
Any other relevant information
```

---

## See Also

- [Architecture Overview](./ARCHITECTURE.md)
- [API Reference](./API.md)
- [Performance Guide](./PERFORMANCE.md)
- [Contributing Guide](./CONTRIBUTING.md)
