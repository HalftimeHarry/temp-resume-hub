# Client-Only Template System

All resume templates are now managed client-side for simplicity and better version control.

## Quick Start

```typescript
import { templateStore } from '$lib/stores/templates';
import { templates } from '$lib/stores/templates';

// Load all templates (synchronous)
templateStore.loadTemplates();

// Access templates via store
$templates // Array of all templates

// Get specific template
const template = await templateStore.getTemplate('first-job-starter');

// Search templates
const results = templateStore.searchTemplates('retail');

// Get categories
const categories = templateStore.getCategories();

// Get tags
const tags = templateStore.getPopularTags();
```

## Adding New Templates

### 1. Add to configurations

Edit `app/src/lib/templates/additional-templates.ts`:

```typescript
export const ADDITIONAL_TEMPLATES: Record<string, ClientTemplateConfig> = {
  'your-template-id': {
    name: 'Your Template Name',
    description: 'Template description',
    category: 'Entry Level', // or Modern, Creative, etc.
    thumbnail: '/templates/your-template.svg',
    previewImages: ['/templates/your-template-preview.png'],
    isPremium: false,
    tags: ['entry-level', 'first-job', 'student'],
    settings: {
      template: 'your-template-id',
      colorScheme: 'blue',
      fontSize: 'medium' as 'medium',
      spacing: 'normal' as 'normal',
      showProfileImage: false,
      sectionOrder: ['personal', 'summary', 'experience', 'education', 'skills']
    },
    starterData: {
      personalInfo: { /* ... */ },
      summary: 'Default summary text',
      experience: [],
      education: [],
      skills: [],
      projects: [],
      settings: { /* ... */ }
    },
    targeting: {
      industries: ['retail', 'food-service'],
      experience_levels: ['student', 'entry'],
      job_types: ['part-time', 'full-time']
    }
  }
};
```

### 2. Add thumbnail image

Place SVG or PNG in `app/static/templates/your-template.svg`

### 3. Test

```bash
cd app
npm run dev
# Visit http://localhost:5173/templates
```

## Template Structure

### Required Fields
- `name`: Display name
- `description`: Short description
- `category`: Template category
- `thumbnail`: Path to thumbnail image
- `isPremium`: Boolean flag
- `tags`: Array of searchable tags
- `settings`: Template configuration
- `starterData`: Default content

### Optional Fields
- `previewImages`: Additional preview images
- `targeting`: Industry/experience targeting for recommendations

## Available Stores

```typescript
import {
  templates,              // All templates
  featuredTemplates,      // First 6 templates
  filteredTemplates,      // Filtered by current filters
  recommendedTemplates,   // Based on user profile
  favoriteTemplates,      // User's favorites
  recentTemplates,        // Recently used
  templateFilters,        // Current filter state
  isLoadingTemplates      // Loading state
} from '$lib/stores/templates';
```

## Template Operations

### Load Templates
```typescript
templateStore.loadTemplates(); // Synchronous, no await needed
```

### Get Template
```typescript
const template = await templateStore.getTemplate('template-id', trackUsage = true);
```

### Search
```typescript
const results = templateStore.searchTemplates('query');
```

### Toggle Favorite
```typescript
await templateStore.toggleFavorite('template-id');
```

### Get Recommendations
```typescript
const recommended = templateStore.getPersonalizedRecommendations();
```

## Categories

Current categories:
- Entry Level
- Modern
- Creative
- Professional
- Minimal
- Academic

Add new categories by using them in template configurations.

## Color Schemes

Available color schemes:
- `blue`
- `green`
- `purple`
- `orange`
- `teal`
- `black`

## Spacing Options

- `compact`: Tight spacing
- `normal`: Standard spacing
- `relaxed`: Loose spacing

## Font Sizes

- `small`: 10-11pt
- `medium`: 11-12pt (default)
- `large`: 12-13pt

## Best Practices

1. **Keep templates focused**: Each template should target specific use cases
2. **Provide starter data**: Help users get started quickly
3. **Use targeting**: Enable smart recommendations
4. **Add meaningful tags**: Improve searchability
5. **Test thoroughly**: Verify all sections render correctly

## Migration Notes

This system was migrated from a hybrid (database + client) approach to client-only for:
- Simpler architecture
- Better version control
- Easier deployment
- Faster performance

See `MIGRATION_CLIENT_ONLY_TEMPLATES.md` for full migration details.
