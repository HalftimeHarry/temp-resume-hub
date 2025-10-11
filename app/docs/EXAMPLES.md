# Usage Examples

Practical examples for using the Resume Generation system.

## Table of Contents

- [Basic Usage](#basic-usage)
- [Strategy Examples](#strategy-examples)
- [Advanced Usage](#advanced-usage)
- [Integration Examples](#integration-examples)
- [Common Patterns](#common-patterns)
- [Error Handling](#error-handling)

---

## Basic Usage

### Simple Resume Generation

```typescript
import { ResumeGenerator } from '$lib/services/ResumeGenerator';
import type { UserProfile, ResumeTemplate } from '$lib/types';

// Assume profile and template are loaded from database
const profile: UserProfile = await loadUserProfile(userId);
const template: ResumeTemplate = await loadTemplate('professional');

// Create generator and generate resume
const generator = new ResumeGenerator(profile, template);
const resume = generator.generateDraft();

console.log(resume.personalInfo.name); // "John Doe"
console.log(resume.experience.length); // 3
console.log(resume.metadata.strategy); // "experienced"
```

### With Validation

```typescript
const generator = new ResumeGenerator(profile, template);

// Validate profile first
const validation = generator.validateProfile();

if (!validation.isValid) {
  console.error('Profile validation failed:');
  validation.errors.forEach(error => console.error(`  - ${error}`));
  return;
}

if (validation.warnings.length > 0) {
  console.warn('Profile warnings:');
  validation.warnings.forEach(warning => console.warn(`  - ${warning}`));
}

// Generate resume
const resume = generator.generateDraft();
console.log(`Resume generated with ${validation.completenessScore}% profile completeness`);
```

### Custom Target Industry

```typescript
// Override profile's target industry
const generator = new ResumeGenerator(
  profile, 
  template, 
  'data-science' // Custom industry
);

const resume = generator.generateDraft();
console.log(`Resume targeted for: ${resume.metadata.targetIndustry}`);
```

---

## Strategy Examples

### AutoStrategy (Default)

```typescript
import { ResumeGenerator } from '$lib/services/ResumeGenerator';

// AutoStrategy is used by default
const generator = new ResumeGenerator(profile, template);
const resume = generator.generateDraft();

// Strategy is automatically selected based on profile
console.log(`Selected strategy: ${resume.metadata.strategy}`);
// Output: "experienced", "first-time", or "career-change"
```

### ExperiencedStrategy

```typescript
import { ResumeGenerator } from '$lib/services/ResumeGenerator';
import { ExperiencedStrategy } from '$lib/services/ResumeStrategies';

// For senior professionals
const seniorProfile: UserProfile = {
  id: 'user-123',
  user: 'senior@example.com',
  first_name: 'Sarah',
  last_name: 'Johnson',
  experience_level: 'senior',
  work_experience: JSON.stringify([
    {
      company: 'Tech Corp',
      position: 'Senior Software Engineer',
      startDate: '2020-01',
      endDate: '2024-01',
      highlights: [
        'Led team of 8 engineers',
        'Architected microservices platform',
        'Reduced costs by $500K annually'
      ]
    },
    {
      company: 'StartupXYZ',
      position: 'Software Engineer',
      startDate: '2017-06',
      endDate: '2019-12',
      highlights: [
        'Built core product features',
        'Improved performance by 60%'
      ]
    }
  ]),
  key_skills: 'JavaScript, TypeScript, React, Node.js, AWS, Docker, Kubernetes',
  professional_summary: 'Senior software engineer with 8+ years of experience',
  // ... other fields
};

const generator = new ResumeGenerator(seniorProfile, template);
const resume = generator.generateDraft();

console.log(resume.summary);
// "Senior software engineer with 8+ years of expertise in full-stack development.
//  Led development of microservices platform serving 10M+ users. Proven track 
//  record of delivering high-impact solutions and leading successful projects."

console.log(resume.experience[0].highlights);
// [
//   "Led team of 8 engineers",
//   "Architected microservices platform",
//   "Reduced costs by $500K annually"
// ]
```

### FirstTimeStrategy

```typescript
import { ResumeGenerator } from '$lib/services/ResumeGenerator';

// For recent graduates
const studentProfile: UserProfile = {
  id: 'user-456',
  user: 'student@example.com',
  first_name: 'Alex',
  last_name: 'Chen',
  experience_level: 'entry-level',
  career_stage: 'student',
  education: JSON.stringify([
    {
      institution: 'University of California',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      graduationDate: '2024-05',
      gpa: 3.8,
      honors: ['Dean\'s List', 'CS Department Award'],
      relevantCoursework: [
        'Data Structures',
        'Algorithms',
        'Web Development',
        'Database Systems'
      ]
    }
  ]),
  projects: JSON.stringify([
    {
      name: 'E-Commerce Platform',
      description: 'Full-stack e-commerce application',
      technologies: ['React', 'Node.js', 'MongoDB'],
      url: 'github.com/user/ecommerce',
      highlights: [
        'Implemented user authentication',
        'Built shopping cart functionality',
        'Deployed on AWS'
      ]
    }
  ]),
  key_skills: 'JavaScript, Python, React, Node.js, SQL, Git',
  // ... other fields
};

const generator = new ResumeGenerator(studentProfile, template);
const resume = generator.generateDraft();

console.log(resume.summary);
// "Motivated Computer Science graduate with strong foundation in full-stack 
//  development. Passionate about software engineering and eager to apply 
//  technical skills in a professional environment."

// Education appears first
console.log(resume.education[0]);
// {
//   institution: "University of California",
//   degree: "Bachelor of Science",
//   field: "Computer Science",
//   gpa: 3.8,
//   honors: ["Dean's List", "CS Department Award"]
// }

// Projects are highlighted
console.log(resume.projects[0]);
// {
//   name: "E-Commerce Platform",
//   description: "Full-stack e-commerce application",
//   technologies: ["React", "Node.js", "MongoDB"],
//   url: "github.com/user/ecommerce"
// }
```

### CareerChangeStrategy

```typescript
import { ResumeGenerator } from '$lib/services/ResumeGenerator';

// For career changers
const careerChangeProfile: UserProfile = {
  id: 'user-789',
  user: 'changer@example.com',
  first_name: 'Maria',
  last_name: 'Garcia',
  experience_level: 'mid-level',
  target_industry: 'ux-design',
  work_experience: JSON.stringify([
    {
      company: 'Lincoln High School',
      position: 'High School Teacher',
      startDate: '2018-08',
      endDate: '2023-06',
      highlights: [
        'Designed engaging curriculum for 150+ students',
        'Conducted user research through feedback',
        'Iterated on methods based on data',
        'Collaborated with cross-functional teams'
      ]
    }
  ]),
  certifications: JSON.stringify([
    {
      name: 'Google UX Design Certificate',
      issuer: 'Google',
      issueDate: '2023-08'
    }
  ]),
  projects: JSON.stringify([
    {
      name: 'Mobile Banking App Redesign',
      description: 'UX case study for banking app',
      technologies: ['Figma', 'User Research', 'Prototyping'],
      highlights: [
        'Conducted user interviews with 15 participants',
        'Created wireframes and high-fidelity prototypes',
        'Improved task completion rate by 35%'
      ]
    }
  ]),
  key_skills: 'Figma, Adobe XD, User Research, Prototyping, HTML, CSS',
  professional_summary: 'Transitioning from education to UX design',
  // ... other fields
};

const generator = new ResumeGenerator(careerChangeProfile, template);
const resume = generator.generateDraft();

console.log(resume.summary);
// "Experienced educator transitioning to UX design. Bringing strong 
//  communication, user empathy, and problem-solving skills developed 
//  through 5 years of teaching. Recently completed Google UX Design 
//  Certificate and built portfolio of 3 case studies."

// Skills are prioritized
console.log(resume.skills.slice(0, 5));
// [
//   { name: "Figma", category: "Design Tools", level: "Intermediate" },
//   { name: "User Research", category: "UX Skills", level: "Intermediate" },
//   { name: "Communication", category: "Soft Skills", level: "Advanced" },
//   { name: "Problem Solving", category: "Soft Skills", level: "Advanced" },
//   { name: "Collaboration", category: "Soft Skills", level: "Advanced" }
// ]
```

---

## Advanced Usage

### Generating Individual Sections

```typescript
const generator = new ResumeGenerator(profile, template);

// Generate only specific sections
const personalInfo = generator.generatePersonalInfo();
const summary = generator.generateSummary();
const experience = generator.generateExperience();
const skills = generator.generateSkills();

// Use sections individually
console.log(`Name: ${personalInfo.name}`);
console.log(`Summary: ${summary}`);
console.log(`Experience entries: ${experience.length}`);
console.log(`Skills: ${skills.length}`);
```

### Custom Strategy Usage

```typescript
import { ExperiencedStrategy, FirstTimeStrategy } from '$lib/services/ResumeStrategies';

// Use strategy directly without generator
const strategy = new ExperiencedStrategy();

// Generate summary
const summary = strategy.generateSummary(profile, template);
console.log(summary);

// Get section priorities
const sections = strategy.prioritizeSections(profile);
console.log('Section order:', sections);
// ["experience", "skills", "education", "projects", "certifications"]

// Get recommendations
const recommendations = strategy.getRecommendations(profile);
recommendations.forEach(rec => console.log(`- ${rec}`));
```

### Comparing Strategies

```typescript
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

// Compare summaries from different strategies
strategies.forEach(strategy => {
  const summary = strategy.generateSummary(profile, template);
  console.log(`\n${strategy.name} Strategy:`);
  console.log(summary);
});

// Compare section priorities
strategies.forEach(strategy => {
  const sections = strategy.prioritizeSections(profile);
  console.log(`\n${strategy.name} Section Order:`, sections);
});
```

### Profile Analysis

```typescript
import { ProfileAnalysis } from '$lib/services/ProfileAnalysis';

// Analyze profile
const analysis = ProfileAnalysis.analyzeProfile(profile);

console.log('Profile Analysis:');
console.log(`  Career Stage: ${analysis.careerStage}`);
console.log(`  Years of Experience: ${analysis.yearsOfExperience}`);
console.log(`  Completeness: ${analysis.completenessScore}%`);
console.log(`  Skill Level: ${analysis.skillLevel}`);
console.log(`  Recommended Strategy: ${analysis.recommendedStrategy}`);

if (analysis.missingFields.length > 0) {
  console.log('  Missing Fields:');
  analysis.missingFields.forEach(field => console.log(`    - ${field}`));
}
```

### Template Recommendation

```typescript
import { TemplateRecommendation } from '$lib/services/TemplateRecommendation';

// Get recommended template
const recommendedTemplate = TemplateRecommendation.recommendTemplate(profile);
console.log(`Recommended template: ${recommendedTemplate}`);

// Get templates by industry
const templates = TemplateRecommendation.getTemplatesByIndustry('software-engineering');
console.log('Available templates:', templates);

// Score a specific template
const score = TemplateRecommendation.scoreTemplate(template, profile);
console.log(`Template score: ${score}/100`);
```

---

## Integration Examples

### Svelte Component Integration

```svelte
<script lang="ts">
  import { ResumeGenerator } from '$lib/services/ResumeGenerator';
  import { userProfile } from '$lib/stores/userProfile';
  import { onMount } from 'svelte';
  
  let resume: ResumeBuilderData | null = null;
  let loading = true;
  let error: string | null = null;
  
  onMount(async () => {
    try {
      // Load template
      const template = await fetch('/api/templates/professional').then(r => r.json());
      
      // Generate resume
      const generator = new ResumeGenerator($userProfile, template);
      
      // Validate first
      const validation = generator.validateProfile();
      if (!validation.isValid) {
        error = validation.errors.join(', ');
        return;
      }
      
      // Generate
      resume = generator.generateDraft();
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  });
</script>

{#if loading}
  <p>Generating resume...</p>
{:else if error}
  <p class="error">{error}</p>
{:else if resume}
  <div class="resume">
    <h1>{resume.personalInfo.name}</h1>
    <p>{resume.summary}</p>
    
    <h2>Experience</h2>
    {#each resume.experience as job}
      <div class="job">
        <h3>{job.position} at {job.company}</h3>
        <p>{job.startDate} - {job.endDate || 'Present'}</p>
        <ul>
          {#each job.highlights as highlight}
            <li>{highlight}</li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>
{/if}
```

### API Endpoint Integration

```typescript
// src/routes/api/resume/generate/+server.ts
import { json } from '@sveltejs/kit';
import { ResumeGenerator } from '$lib/services/ResumeGenerator';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    // Get user profile
    const profile = await locals.pb
      .collection('user_profiles')
      .getOne(locals.user.id);
    
    // Get template
    const { templateId } = await request.json();
    const template = await locals.pb
      .collection('resume_templates')
      .getOne(templateId);
    
    // Generate resume
    const generator = new ResumeGenerator(profile, template);
    
    // Validate
    const validation = generator.validateProfile();
    if (!validation.isValid) {
      return json({ 
        error: 'Invalid profile', 
        details: validation.errors 
      }, { status: 400 });
    }
    
    // Generate
    const resume = generator.generateDraft();
    
    // Save to database
    const saved = await locals.pb.collection('resumes').create({
      user: locals.user.id,
      title: `${profile.first_name} ${profile.last_name} Resume`,
      content: resume,
      template: templateId,
      strategy: resume.metadata.strategy
    });
    
    return json({ 
      success: true, 
      resumeId: saved.id,
      resume 
    });
    
  } catch (error) {
    console.error('Resume generation failed:', error);
    return json({ 
      error: 'Generation failed', 
      message: error.message 
    }, { status: 500 });
  }
};
```

### Batch Generation

```typescript
import { ResumeGenerator } from '$lib/services/ResumeGenerator';

async function generateMultipleResumes(
  profile: UserProfile,
  templateIds: string[]
): Promise<ResumeBuilderData[]> {
  const resumes: ResumeBuilderData[] = [];
  
  for (const templateId of templateIds) {
    // Load template
    const template = await loadTemplate(templateId);
    
    // Generate resume
    const generator = new ResumeGenerator(profile, template);
    const resume = generator.generateDraft();
    
    resumes.push(resume);
  }
  
  return resumes;
}

// Usage
const templates = ['professional', 'creative', 'minimal'];
const resumes = await generateMultipleResumes(profile, templates);

console.log(`Generated ${resumes.length} resumes`);
resumes.forEach((resume, i) => {
  console.log(`Resume ${i + 1}: ${resume.metadata.strategy} strategy`);
});
```

---

## Common Patterns

### Validation Before Generation

```typescript
function generateResumeWithValidation(
  profile: UserProfile,
  template: ResumeTemplate
): { success: boolean; resume?: ResumeBuilderData; errors?: string[] } {
  const generator = new ResumeGenerator(profile, template);
  const validation = generator.validateProfile();
  
  if (!validation.isValid) {
    return {
      success: false,
      errors: validation.errors
    };
  }
  
  const resume = generator.generateDraft();
  return {
    success: true,
    resume
  };
}
```

### Progressive Enhancement

```typescript
function generateResumeWithFallbacks(
  profile: UserProfile,
  template: ResumeTemplate
): ResumeBuilderData {
  const generator = new ResumeGenerator(profile, template);
  const resume = generator.generateDraft();
  
  // Enhance with additional data if available
  if (profile.certifications) {
    resume.certifications = generator.generateCertifications();
  }
  
  if (profile.projects) {
    resume.projects = generator.generateProjects();
  }
  
  // Add computed fields
  resume.metadata.enhancedAt = new Date().toISOString();
  resume.metadata.sectionCount = Object.keys(resume).length;
  
  return resume;
}
```

### Caching Strategy

```typescript
class ResumeCache {
  private cache = new Map<string, ResumeBuilderData>();
  
  generateOrGetCached(
    profile: UserProfile,
    template: ResumeTemplate
  ): ResumeBuilderData {
    const cacheKey = `${profile.id}-${template.id}`;
    
    if (this.cache.has(cacheKey)) {
      console.log('Returning cached resume');
      return this.cache.get(cacheKey)!;
    }
    
    console.log('Generating new resume');
    const generator = new ResumeGenerator(profile, template);
    const resume = generator.generateDraft();
    
    this.cache.set(cacheKey, resume);
    return resume;
  }
  
  invalidate(profileId: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(profileId)) {
        this.cache.delete(key);
      }
    }
  }
}

// Usage
const cache = new ResumeCache();
const resume1 = cache.generateOrGetCached(profile, template); // Generated
const resume2 = cache.generateOrGetCached(profile, template); // Cached
```

---

## Error Handling

### Graceful Degradation

```typescript
function generateResumeWithErrorHandling(
  profile: UserProfile,
  template: ResumeTemplate
): ResumeBuilderData {
  const generator = new ResumeGenerator(profile, template);
  
  try {
    return generator.generateDraft();
  } catch (error) {
    console.error('Resume generation failed:', error);
    
    // Return minimal resume with available data
    return {
      personalInfo: generator.generatePersonalInfo(),
      summary: profile.professional_summary || 'Professional summary not available',
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      settings: template.settings,
      metadata: {
        strategy: 'auto',
        completenessScore: 0,
        generatedAt: new Date().toISOString(),
        version: '1.0.0',
        error: error.message
      }
    };
  }
}
```

### Validation with User Feedback

```typescript
async function generateWithUserFeedback(
  profile: UserProfile,
  template: ResumeTemplate
): Promise<void> {
  const generator = new ResumeGenerator(profile, template);
  const validation = generator.validateProfile();
  
  // Show errors
  if (validation.errors.length > 0) {
    console.error('❌ Profile has errors:');
    validation.errors.forEach(error => console.error(`  - ${error}`));
    throw new Error('Profile validation failed');
  }
  
  // Show warnings
  if (validation.warnings.length > 0) {
    console.warn('⚠️  Profile has warnings:');
    validation.warnings.forEach(warning => console.warn(`  - ${warning}`));
    
    const proceed = await confirm('Continue with warnings?');
    if (!proceed) return;
  }
  
  // Show completeness
  console.log(`ℹ️  Profile is ${validation.completenessScore}% complete`);
  
  // Generate
  const resume = generator.generateDraft();
  console.log('✅ Resume generated successfully');
  console.log(`   Strategy: ${resume.metadata.strategy}`);
  console.log(`   Sections: ${Object.keys(resume).length}`);
}
```

### Retry Logic

```typescript
async function generateWithRetry(
  profile: UserProfile,
  template: ResumeTemplate,
  maxRetries = 3
): Promise<ResumeBuilderData> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries}`);
      const generator = new ResumeGenerator(profile, template);
      return generator.generateDraft();
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt < maxRetries) {
        // Wait before retry (exponential backoff)
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }
  }
  
  throw new Error(`Failed after ${maxRetries} attempts: ${lastError.message}`);
}
```

---

## See Also

- [Architecture Overview](./ARCHITECTURE.md)
- [API Reference](./API.md)
- [Strategy Guide](./STRATEGIES.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
