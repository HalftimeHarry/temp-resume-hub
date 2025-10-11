# API Reference

Complete API documentation for the Resume Generation system.

## Table of Contents

- [ResumeGenerator](#resumegenerator)
- [ResumeStrategies](#resumestrategies)
- [ProfileAnalysis](#profileanalysis)
- [TemplateRecommendation](#templaterecommendation)
- [Type Definitions](#type-definitions)

---

## ResumeGenerator

The main class for generating resumes from user profiles and templates.

### Constructor

```typescript
new ResumeGenerator(
  profile: UserProfile,
  template: ResumeTemplate,
  targetIndustry?: string
)
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `profile` | `UserProfile` | Yes | User profile data containing personal info, experience, education, etc. |
| `template` | `ResumeTemplate` | Yes | Resume template with structure and starter content |
| `targetIndustry` | `string` | No | Override for target industry (defaults to `profile.target_industry`) |

**Example:**

```typescript
import { ResumeGenerator } from '$lib/services/ResumeGenerator';

const generator = new ResumeGenerator(userProfile, template);
// With custom industry
const generator = new ResumeGenerator(userProfile, template, 'software-engineering');
```

---

### Methods

#### `generateDraft()`

Generates a complete resume draft with all sections.

```typescript
generateDraft(): ResumeBuilderData
```

**Returns:** `ResumeBuilderData` - Complete resume data structure

**Example:**

```typescript
const generator = new ResumeGenerator(profile, template);
const resume = generator.generateDraft();

console.log(resume.personalInfo.name); // "John Doe"
console.log(resume.experience.length); // 3
console.log(resume.metadata.strategy); // "experienced"
```

**Generated Structure:**

```typescript
{
  personalInfo: PersonalInfo,
  summary: string,
  experience: Experience[],
  education: Education[],
  skills: Skill[],
  projects: Project[],
  certifications: Certification[],
  settings: ResumeSettings,
  metadata: {
    strategy: string,
    completenessScore: number,
    generatedAt: string,
    version: string
  }
}
```

---

#### `validateProfile()`

Validates the user profile for completeness and required fields.

```typescript
validateProfile(): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  completenessScore: number;
}
```

**Returns:** Validation result with errors, warnings, and completeness score

**Example:**

```typescript
const validation = generator.validateProfile();

if (!validation.isValid) {
  console.error('Profile validation failed:', validation.errors);
}

if (validation.warnings.length > 0) {
  console.warn('Profile warnings:', validation.warnings);
}

console.log(`Profile is ${validation.completenessScore}% complete`);
```

**Validation Rules:**

- **Required Fields**: `first_name`, `last_name`, `user` (email)
- **Recommended Fields**: `phone`, `location`, `professional_summary`
- **Completeness Score**: Based on filled fields (0-100%)

---

#### `generatePersonalInfo()`

Generates the personal information section.

```typescript
generatePersonalInfo(): PersonalInfo
```

**Returns:** `PersonalInfo` object with name, contact details, and links

**Example:**

```typescript
const personalInfo = generator.generatePersonalInfo();

console.log(personalInfo);
// {
//   name: "John Doe",
//   email: "john@example.com",
//   phone: "+1-555-0123",
//   location: "San Francisco, CA",
//   linkedin: "linkedin.com/in/johndoe",
//   github: "github.com/johndoe",
//   portfolio: "johndoe.dev"
// }
```

**Features:**
- Merges profile data with template starter data
- Detects and skips placeholder values
- Trims whitespace from all fields
- Validates email format

---

#### `generateSummary()`

Generates the professional summary using the selected strategy.

```typescript
generateSummary(): string
```

**Returns:** Professional summary text

**Example:**

```typescript
const summary = generator.generateSummary();

console.log(summary);
// "Experienced software engineer with 8+ years of expertise in full-stack 
//  development. Proven track record of building scalable applications..."
```

**Strategy Behavior:**
- **Experienced**: Achievement and impact focused
- **First-Time**: Potential and education focused
- **Career-Change**: Transferable skills focused
- **Auto**: Automatically selects best approach

---

#### `generateExperience()`

Generates the work experience section.

```typescript
generateExperience(): Experience[]
```

**Returns:** Array of `Experience` objects

**Example:**

```typescript
const experience = generator.generateExperience();

experience.forEach(job => {
  console.log(`${job.position} at ${job.company}`);
  console.log(`${job.startDate} - ${job.endDate || 'Present'}`);
  job.highlights.forEach(h => console.log(`  • ${h}`));
});
```

**Features:**
- Parses JSON or array format from profile
- Merges with template experience if needed
- Sorts by date (most recent first)
- Formats dates consistently
- Generates unique IDs for each entry

---

#### `generateEducation()`

Generates the education section.

```typescript
generateEducation(): Education[]
```

**Returns:** Array of `Education` objects

**Example:**

```typescript
const education = generator.generateEducation();

education.forEach(edu => {
  console.log(`${edu.degree} in ${edu.field}`);
  console.log(`${edu.institution}, ${edu.graduationDate}`);
  if (edu.gpa) console.log(`GPA: ${edu.gpa}`);
});
```

**Features:**
- Parses JSON or array format
- Handles various date formats
- Includes GPA if available
- Supports honors and achievements
- Sorts by graduation date

---

#### `generateSkills()`

Generates the skills section with categorization.

```typescript
generateSkills(): Skill[]
```

**Returns:** Array of `Skill` objects with categories and proficiency levels

**Example:**

```typescript
const skills = generator.generateSkills();

skills.forEach(skill => {
  console.log(`${skill.name} (${skill.category}) - ${skill.level}`);
});

// Output:
// JavaScript (Programming Languages) - Advanced
// React (Frameworks & Libraries) - Advanced
// PostgreSQL (Databases) - Intermediate
```

**Skill Categories:**
- Programming Languages
- Frameworks & Libraries
- Databases
- Cloud & DevOps
- Soft Skills
- Other

**Proficiency Levels:**
- Beginner (0-1 years experience)
- Intermediate (1-3 years)
- Advanced (3-7 years)
- Expert (7+ years)

---

#### `generateProjects()`

Generates the projects section.

```typescript
generateProjects(): Project[]
```

**Returns:** Array of `Project` objects

**Example:**

```typescript
const projects = generator.generateProjects();

projects.forEach(project => {
  console.log(`${project.name}: ${project.description}`);
  console.log(`Technologies: ${project.technologies.join(', ')}`);
  if (project.url) console.log(`URL: ${project.url}`);
});
```

**Features:**
- Parses academic and personal projects
- Extracts technologies used
- Includes project URLs if available
- Highlights key achievements

---

#### `generateCertifications()`

Generates the certifications section.

```typescript
generateCertifications(): Certification[]
```

**Returns:** Array of `Certification` objects

**Example:**

```typescript
const certifications = generator.generateCertifications();

certifications.forEach(cert => {
  console.log(`${cert.name} - ${cert.issuer}`);
  console.log(`Issued: ${cert.issueDate}`);
  if (cert.expiryDate) console.log(`Expires: ${cert.expiryDate}`);
});
```

---

### Properties

#### `profile`

```typescript
readonly profile: UserProfile
```

The user profile data passed to the constructor.

#### `template`

```typescript
readonly template: ResumeTemplate
```

The resume template passed to the constructor.

#### `strategy`

```typescript
readonly strategy: ResumeStrategy
```

The selected resume generation strategy (auto-selected or manual).

#### `targetIndustry`

```typescript
readonly targetIndustry: string
```

The target industry for resume generation.

---

## ResumeStrategies

Collection of resume generation strategies.

### AutoStrategy

Automatically selects the best strategy based on profile analysis.

```typescript
import { AutoStrategy } from '$lib/services/ResumeStrategies';

const strategy = new AutoStrategy();
const summary = strategy.generateSummary(profile, template);
const sections = strategy.prioritizeSections(profile);
const recommendations = strategy.getRecommendations(profile);
```

**Methods:**

#### `generateSummary(profile, template?)`

Generates a professional summary by delegating to the most appropriate strategy.

**Parameters:**
- `profile: UserProfile` - User profile data
- `template?: ResumeTemplate` - Optional template for context

**Returns:** `string` - Generated summary

#### `prioritizeSections(profile)`

Determines the optimal section order based on profile analysis.

**Parameters:**
- `profile: UserProfile` - User profile data

**Returns:** `string[]` - Ordered array of section names

**Example:**
```typescript
const sections = strategy.prioritizeSections(profile);
// For experienced: ['experience', 'skills', 'education', 'projects']
// For student: ['education', 'projects', 'skills', 'experience']
```

#### `getRecommendations(profile)`

Provides actionable recommendations for improving the resume.

**Parameters:**
- `profile: UserProfile` - User profile data

**Returns:** `string[]` - Array of recommendation strings

**Example:**
```typescript
const recommendations = strategy.getRecommendations(profile);
// [
//   "Add quantifiable achievements to your experience",
//   "Include 2-3 relevant projects",
//   "Add technical certifications"
// ]
```

---

### ExperiencedStrategy

Optimized for professionals with 3+ years of experience.

```typescript
import { ExperiencedStrategy } from '$lib/services/ResumeStrategies';

const strategy = new ExperiencedStrategy();
```

**Focus Areas:**
- Professional achievements and impact
- Leadership and mentorship
- Technical expertise and specializations
- Career progression

**Summary Style:**
- Emphasizes years of experience
- Highlights key accomplishments
- Showcases technical depth
- Mentions leadership roles

**Section Priority:**
1. Experience
2. Skills
3. Education
4. Projects
5. Certifications

---

### FirstTimeStrategy

Optimized for students and entry-level job seekers.

```typescript
import { FirstTimeStrategy } from '$lib/services/ResumeStrategies';

const strategy = new FirstTimeStrategy();
```

**Focus Areas:**
- Education and academic achievements
- Relevant coursework and projects
- Internships and volunteer work
- Potential and eagerness to learn

**Summary Style:**
- Emphasizes education and skills
- Highlights relevant projects
- Shows enthusiasm and potential
- Mentions career goals

**Section Priority:**
1. Education
2. Projects
3. Skills
4. Experience (internships)
5. Certifications

---

### CareerChangeStrategy

Optimized for professionals transitioning to new industries.

```typescript
import { CareerChangeStrategy } from '$lib/services/ResumeStrategies';

const strategy = new CareerChangeStrategy();
```

**Focus Areas:**
- Transferable skills
- Relevant experience from previous career
- New skills and certifications
- Motivation for career change

**Summary Style:**
- Emphasizes transferable skills
- Connects past experience to new field
- Highlights relevant training
- Shows commitment to transition

**Section Priority:**
1. Skills (transferable)
2. Experience (relevant aspects)
3. Education (new training)
4. Projects (in new field)
5. Certifications (new field)

---

## ProfileAnalysis

Service for analyzing user profiles.

```typescript
import { ProfileAnalysis } from '$lib/services/ProfileAnalysis';

const analysis = ProfileAnalysis.analyzeProfile(profile);
```

### Methods

#### `analyzeProfile(profile)`

Performs comprehensive profile analysis.

```typescript
static analyzeProfile(profile: UserProfile): ProfileAnalysisResult
```

**Returns:**

```typescript
{
  careerStage: 'student' | 'entry-level' | 'mid-level' | 'senior' | 'executive',
  yearsOfExperience: number,
  completenessScore: number,
  missingFields: string[],
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert',
  hasProjects: boolean,
  hasCertifications: boolean,
  recommendedStrategy: string
}
```

**Example:**

```typescript
const analysis = ProfileAnalysis.analyzeProfile(profile);

console.log(`Career Stage: ${analysis.careerStage}`);
console.log(`Experience: ${analysis.yearsOfExperience} years`);
console.log(`Profile Completeness: ${analysis.completenessScore}%`);
console.log(`Recommended Strategy: ${analysis.recommendedStrategy}`);
```

---

#### `calculateCompleteness(profile)`

Calculates profile completeness score.

```typescript
static calculateCompleteness(profile: UserProfile): number
```

**Returns:** Number between 0-100 representing completeness percentage

**Scoring Criteria:**
- Required fields: 40 points
- Recommended fields: 30 points
- Optional fields: 30 points

---

#### `determineCareerStage(profile)`

Determines the user's career stage.

```typescript
static determineCareerStage(profile: UserProfile): string
```

**Returns:** Career stage classification

**Classifications:**
- `student`: Currently in school, no professional experience
- `entry-level`: 0-2 years of experience
- `mid-level`: 2-5 years of experience
- `senior`: 5-10 years of experience
- `executive`: 10+ years of experience

---

## TemplateRecommendation

Service for recommending appropriate templates.

```typescript
import { TemplateRecommendation } from '$lib/services/TemplateRecommendation';

const recommended = TemplateRecommendation.recommendTemplate(profile);
```

### Methods

#### `recommendTemplate(profile)`

Recommends the best template based on profile analysis.

```typescript
static recommendTemplate(profile: UserProfile): string
```

**Returns:** Template name (e.g., 'professional', 'creative', 'minimal')

**Recommendation Logic:**
- **Professional**: For corporate and traditional industries
- **Creative**: For design, marketing, and creative fields
- **Minimal**: For tech and modern industries
- **Academic**: For research and academic positions

---

## Type Definitions

### UserProfile

```typescript
interface UserProfile {
  id: string;
  user: string; // Email
  
  // Personal Information
  first_name: string;
  last_name: string;
  phone?: string;
  location?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  github_url?: string;
  
  // Career Information
  target_industry?: string;
  experience_level?: string;
  target_job_titles?: string;
  key_skills?: string;
  career_stage?: string;
  professional_summary?: string;
  
  // Experience & Education (JSON strings or arrays)
  work_experience?: string | any[];
  education?: string | any[];
  projects?: string | any[];
  certifications?: string | any[];
  
  // Account Information
  role: 'job_seeker' | 'moderator' | 'admin';
  plan: 'free' | 'pro' | 'enterprise';
  verified: boolean;
  active: boolean;
  profile_completed: boolean;
}
```

### ResumeBuilderData

```typescript
interface ResumeBuilderData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  settings: ResumeSettings;
  metadata: {
    strategy: string;
    completenessScore: number;
    generatedAt: string;
    version: string;
  };
}
```

### PersonalInfo

```typescript
interface PersonalInfo {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}
```

### Experience

```typescript
interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  highlights: string[];
  technologies?: string[];
}
```

### Education

```typescript
interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa?: number;
  honors?: string[];
  relevantCoursework?: string[];
}
```

### Skill

```typescript
interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}
```

### Project

```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  highlights: string[];
  startDate?: string;
  endDate?: string;
}
```

---

## Error Handling

All methods handle errors gracefully and return sensible defaults:

```typescript
try {
  const generator = new ResumeGenerator(profile, template);
  const resume = generator.generateDraft();
} catch (error) {
  console.error('Resume generation failed:', error);
  // Handle error appropriately
}
```

**Common Errors:**
- Invalid profile data
- Missing required fields
- Malformed JSON in profile fields
- Template parsing errors

---

## Best Practices

### 1. Always Validate Profiles

```typescript
const generator = new ResumeGenerator(profile, template);
const validation = generator.validateProfile();

if (!validation.isValid) {
  // Handle validation errors
  return;
}
```

### 2. Use Appropriate Strategies

```typescript
// Let AutoStrategy decide
const generator = new ResumeGenerator(profile, template);

// Or specify manually for specific use cases
const strategy = new ExperiencedStrategy();
// Use strategy directly if needed
```

### 3. Handle Missing Data

```typescript
const resume = generator.generateDraft();

// Check for empty sections
if (resume.experience.length === 0) {
  console.warn('No experience data available');
}
```

### 4. Cache Generator Instances

```typescript
// Reuse generator for multiple operations
const generator = new ResumeGenerator(profile, template);
const validation = generator.validateProfile();
const resume = generator.generateDraft();
```

---

## Performance Tips

1. **Profile Preprocessing**: Clean and validate profile data before passing to generator
2. **Template Caching**: Cache templates to avoid repeated parsing
3. **Batch Operations**: Generate multiple sections in one call using `generateDraft()`
4. **Lazy Loading**: Only generate sections you need if not using `generateDraft()`

---

## Version History

- **v1.0.0** (2024-01): Initial OOP architecture release
- Strategy pattern implementation
- ProfileAnalysis service
- TemplateRecommendation service
- Comprehensive test coverage

---

## See Also

- [Architecture Overview](./ARCHITECTURE.md)
- [Strategy Guide](./STRATEGIES.md)
- [Usage Examples](./EXAMPLES.md)
- [Contributing Guide](./CONTRIBUTING.md)
