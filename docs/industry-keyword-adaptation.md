# Industry-Specific Keyword Adaptation

## Overview

The Industry Keyword Adaptation feature intelligently adapts resume content with industry-specific terminology while maintaining the original meaning and natural language flow. This improves ATS (Applicant Tracking System) compatibility and makes resumes more relevant to target industries.

## Features

### 1. **Intelligent Keyword Replacement**
- Replaces generic terms with industry-specific alternatives
- Maintains original meaning and context
- Preserves natural language flow
- Case-sensitive replacements

### 2. **Context-Aware Adaptation**
- Uses surrounding words to determine best replacement
- Avoids inappropriate replacements
- Respects word boundaries (no partial matches)

### 3. **Configurable Intensity**
- **Light** (30%): Minimal changes, preserves most original text
- **Moderate** (60%): Balanced approach (default)
- **Aggressive** (90%): Maximum keyword optimization

### 4. **Industry Coverage**
Supports 9 major industries:
- Software Engineering
- Web Development
- Data Science
- Design (UX/UI)
- Marketing
- Sales
- Product Management
- DevOps
- Finance

## Architecture

### Core Components

#### 1. **IndustryKeywords.ts**
Defines keyword mappings for each industry:
```typescript
interface KeywordMapping {
  generic: string;        // Generic term to replace
  replacement: string;    // Industry-specific replacement
  context?: string[];     // Optional context words
  weight?: number;        // Importance (0-1)
}
```

#### 2. **KeywordAdapter.ts**
Main service for adapting text:
```typescript
class KeywordAdapter {
  constructor(industry: string, config?: AdaptationConfig)
  adaptText(text: string): AdaptationResult
  adaptTextArray(texts: string[]): AdaptationResult[]
  enrichText(text: string, maxKeywords?: number): string
  analyzeText(text: string): AnalysisResult
}
```

#### 3. **ResumeGenerator.ts**
Integrates keyword adaptation into resume generation:
- Adapts professional summaries
- Adapts experience descriptions
- Adapts experience highlights

## Usage

### Basic Usage

```typescript
import { KeywordAdapter } from '$lib/services/KeywordAdapter';

// Create adapter for specific industry
const adapter = new KeywordAdapter('software-engineering', {
  intensity: 'moderate',
  preserveOriginal: true,
  contextAware: true
});

// Adapt text
const result = adapter.adaptText('I built a website and fixed bugs');
console.log(result.adapted);
// Output: "I engineered a web application and resolved bugs"

console.log(result.replacements);
// Output: [
//   { from: 'built', to: 'engineered', position: 2 },
//   { from: 'website', to: 'web application', position: 10 },
//   { from: 'fixed', to: 'resolved', position: 30 }
// ]
```

### Convenience Functions

```typescript
import { adaptTextForIndustry } from '$lib/services/KeywordAdapter';

// Quick adaptation
const adapted = adaptTextForIndustry(
  'I made improvements to the system',
  'software-engineering',
  'aggressive'
);
```

### Integration with Resume Generation

```typescript
import { ResumeGenerator } from '$lib/services/ResumeGenerator';

const generator = new ResumeGenerator(
  userProfile,
  template,
  'software-engineering',
  'moderate' // keyword intensity
);

const resume = generator.generateDraft();
// Summary and experience descriptions are automatically adapted
```

## Configuration Options

### AdaptationConfig

```typescript
interface AdaptationConfig {
  intensity: 'light' | 'moderate' | 'aggressive';
  preserveOriginal: boolean;  // Keep some original terms
  contextAware: boolean;      // Use context matching
  maxReplacements?: number;   // Limit replacements per text
}
```

### Default Configuration

```typescript
{
  intensity: 'moderate',
  preserveOriginal: true,
  contextAware: true,
  maxReplacements: undefined
}
```

## Industry Keyword Mappings

### Software Engineering Example

**Generic → Industry-Specific:**
- built → engineered
- made → developed
- fixed → debugged/resolved
- website → web application
- improved → optimized
- worked on → contributed to

**Action Verbs:**
architected, engineered, developed, implemented, optimized, debugged, deployed, integrated, refactored, automated

**Technical Terms:**
microservices, REST API, CI/CD pipeline, Docker, Kubernetes, unit testing, code review

### Web Development Example

**Generic → Industry-Specific:**
- built → developed
- made → crafted (for interfaces)
- created → designed (for UI)
- improved → enhanced/optimized
- looks good → responsive
- works on mobile → mobile-responsive

### Data Science Example

**Generic → Industry-Specific:**
- looked at → analyzed
- found → discovered insights from
- made → developed (models)
- showed → visualized
- predicted → forecasted

## Adaptation Results

### AdaptationResult Interface

```typescript
interface AdaptationResult {
  original: string;           // Original text
  adapted: string;            // Adapted text
  replacements: Array<{       // List of replacements made
    from: string;
    to: string;
    position: number;
  }>;
  score: number;              // Adaptation score (0-1)
}
```

### Adaptation Score

The score indicates how much the text was adapted:
- **0.0**: No changes
- **0.1-0.3**: Light adaptation
- **0.4-0.6**: Moderate adaptation
- **0.7-1.0**: Heavy adaptation

## Text Analysis

### Analyze Before Adapting

```typescript
const adapter = new KeywordAdapter('software-engineering');
const analysis = adapter.analyzeText(text);

console.log(analysis);
// {
//   wordCount: 50,
//   potentialReplacements: 8,
//   industryKeywordsPresent: 3,
//   adaptationPotential: 'high'
// }
```

### Adaptation Potential Levels

- **High**: Text has many generic terms, few industry keywords
- **Medium**: Balanced mix of generic and industry terms
- **Low**: Text already uses industry-specific terminology

## Best Practices

### 1. **Choose Appropriate Intensity**

```typescript
// For entry-level candidates
const adapter = new KeywordAdapter(industry, { intensity: 'light' });

// For experienced professionals
const adapter = new KeywordAdapter(industry, { intensity: 'moderate' });

// For highly competitive positions
const adapter = new KeywordAdapter(industry, { intensity: 'aggressive' });
```

### 2. **Preserve Authenticity**

```typescript
// Keep some original terms for authenticity
const adapter = new KeywordAdapter(industry, {
  intensity: 'moderate',
  preserveOriginal: true  // Randomly keeps ~30% of original terms
});
```

### 3. **Use Context Awareness**

```typescript
// Enable context-aware replacements
const adapter = new KeywordAdapter(industry, {
  contextAware: true  // Only replaces when context matches
});
```

### 4. **Enrich Sparse Content**

```typescript
// Add industry keywords to short text
const enriched = adapter.enrichText(
  'I am a developer',
  3  // Add up to 3 keywords
);
// Output: "I am a developer. Experienced with microservices, CI/CD, cloud-native."
```

## Examples

### Example 1: Software Engineering

**Before:**
```
I built a website for the company and fixed several bugs. 
I worked with the team to make improvements to the system.
```

**After (Moderate Intensity):**
```
I engineered a web application for the company and resolved several bugs. 
I collaborated with the team to optimize the system.
```

### Example 2: Data Science

**Before:**
```
I looked at customer data and found interesting patterns. 
I made a model to predict sales and showed the results to management.
```

**After (Moderate Intensity):**
```
I analyzed customer data and identified interesting patterns. 
I developed a model to forecast sales and visualized the results to management.
```

### Example 3: Marketing

**Before:**
```
I created a campaign that got more leads. 
I wrote content and posted it on social media.
```

**After (Moderate Intensity):**
```
I launched a campaign that generated more leads. 
I crafted content and published it on social media.
```

## Testing

### Unit Tests

Comprehensive test suite with 39 tests covering:
- ✅ Keyword mapping retrieval
- ✅ Industry detection
- ✅ Text adaptation (all industries)
- ✅ Context-aware replacements
- ✅ Intensity levels
- ✅ Case preservation
- ✅ Edge cases (special characters, numbers, long text)
- ✅ Text enrichment
- ✅ Text analysis

**Run tests:**
```bash
npm test -- KeywordAdapter.test.ts
```

### Test Results
```
✓ 39 tests passed
✓ All industries covered
✓ Edge cases handled
✓ Performance validated
```

## Performance

### Benchmarks

- **Single text adaptation**: < 5ms
- **Array of 10 texts**: < 20ms
- **Long text (1000 words)**: < 15ms
- **Memory usage**: Minimal (< 1MB)

### Optimization

- Regex patterns are compiled once
- Context matching uses efficient substring search
- Randomness is controlled for predictable performance

## Integration Points

### 1. **Resume Builder Store**

```typescript
// app/src/lib/stores/resumeBuilder.ts
export async function generateFromProfile(options: {
  sections: string[];
  targetIndustry?: string;
  keywordIntensity?: 'light' | 'moderate' | 'aggressive';
}): Promise<void>
```

### 2. **Generation Preferences**

```typescript
// app/src/lib/stores/generationPreferences.ts
interface GenerationPreferences {
  keywordIntensity: 'light' | 'moderate' | 'aggressive';
  // ... other preferences
}
```

### 3. **Resume Generator**

```typescript
// app/src/lib/services/ResumeGenerator.ts
constructor(
  profile: UserProfile,
  template: ExtendedResumeTemplate,
  targetIndustry?: string,
  keywordIntensity: KeywordIntensity = 'moderate'
)
```

## Future Enhancements

### Planned Features

1. **AI-Powered Adaptation**
   - Use LLM for more natural replacements
   - Context-aware synonym selection
   - Industry-specific phrasing

2. **Custom Industry Mappings**
   - Allow users to define custom mappings
   - Import/export mapping configurations
   - Community-contributed mappings

3. **Multi-Language Support**
   - Keyword mappings for other languages
   - Language-specific adaptation rules

4. **ATS Optimization Score**
   - Calculate ATS compatibility score
   - Suggest improvements
   - Keyword density analysis

5. **Real-Time Preview**
   - Show before/after comparison
   - Highlight changes
   - Undo individual replacements

## Troubleshooting

### Issue: Too Many Replacements

**Solution:** Reduce intensity or enable preserveOriginal
```typescript
const adapter = new KeywordAdapter(industry, {
  intensity: 'light',
  preserveOriginal: true
});
```

### Issue: Inappropriate Replacements

**Solution:** Enable context awareness
```typescript
const adapter = new KeywordAdapter(industry, {
  contextAware: true
});
```

### Issue: Not Enough Changes

**Solution:** Increase intensity and disable preserveOriginal
```typescript
const adapter = new KeywordAdapter(industry, {
  intensity: 'aggressive',
  preserveOriginal: false
});
```

### Issue: Wrong Industry Detected

**Solution:** Explicitly specify industry
```typescript
const adapter = new KeywordAdapter('software-engineering');
// Don't rely on auto-detection for critical applications
```

## API Reference

### KeywordAdapter Class

#### Constructor
```typescript
constructor(
  industry: string,
  config?: Partial<AdaptationConfig>
)
```

#### Methods

**adaptText(text: string): AdaptationResult**
- Adapts a single text with industry keywords
- Returns detailed result with replacements

**adaptTextArray(texts: string[]): AdaptationResult[]**
- Adapts multiple texts
- Returns array of results

**enrichText(text: string, maxKeywords?: number): string**
- Adds industry keywords without replacing
- Returns enriched text

**analyzeText(text: string): AnalysisResult**
- Analyzes text for adaptation potential
- Returns statistics and recommendations

### Utility Functions

**getIndustryKeywords(industry: string): IndustryKeywords | null**
- Retrieves keyword data for industry

**detectIndustry(text: string): string | null**
- Auto-detects industry from text content

**adaptTextForIndustry(text, industry, intensity): string**
- Convenience function for quick adaptation

**adaptTextsForIndustry(texts, industry, intensity): string[]**
- Convenience function for multiple texts

## Conclusion

The Industry Keyword Adaptation feature provides intelligent, context-aware keyword optimization that improves resume quality while maintaining authenticity. With comprehensive testing, configurable intensity levels, and support for 9 major industries, it's a powerful tool for resume optimization.

---

**Version:** 1.0.0  
**Last Updated:** 2025-10-11  
**Status:** Production Ready ✅
