# Resume Builder Navigation System

## Overview
The resume builder uses a flexible tab-based navigation system that allows users to move between sections in any order while providing guided sequential navigation through Next/Previous buttons.

## Navigation Methods

### 1. Direct Tab Navigation
Users can click on any tab at any time via:
- **Desktop**: Sidebar navigation on the left
- **Mobile**: Horizontal scrollable tab bar at the top

This allows users to jump to any section regardless of completion status.

### 2. Sequential Navigation
Each tab includes navigation buttons at the bottom:
- **← Previous**: Goes to the previous tab in the sequence
- **Save & Continue** or **Next**: Goes to the next tab in the sequence

## Tab Sequence
1. Personal Information (no Previous button - first step)
2. Summary
3. Experience
4. Education
5. Skills
6. Projects
7. Settings
8. Preview

## Key Functions

### `getNextTab(currentTab: string): string`
Returns the next tab in the sequence. Used by "Save & Continue" buttons.

### `getPreviousTab(currentTab: string): string`
Returns the previous tab in the sequence, **skipping the Personal Information tab** since it's always visible in the sidebar and doesn't need a Previous button navigation.

**Special behavior:**
- From Summary → Returns 'summary' (stays on same tab, no previous)
- From Experience → Returns 'summary'
- From Education → Returns 'experience'
- And so on...

### `handleTabChange(tabId: string)`
Handles all tab navigation, whether from:
- Direct tab clicks
- Next/Previous buttons
- Programmatic navigation

Provides visual feedback via toast notifications.

## Implementation Details

### Tab Components
Each tab component accepts optional props:
```typescript
interface Props {
  onNext?: () => void;
  onPrevious?: () => void;
}
```

### Wiring in Builder Page
```svelte
<ComponentTab 
  onNext={() => handleTabChange(getNextTab('current-tab'))} 
  onPrevious={() => handleTabChange(getPreviousTab('current-tab'))} 
/>
```

### Navigation Buttons Pattern
```svelte
<div class="flex justify-between mt-8 pt-6 border-t">
  <Button variant="outline" on:click={handlePrevious}>
    ← Previous
  </Button>
  <Button on:click={handleNext}>
    Save & Continue
  </Button>
</div>
```

## Progress Tracking
- Each tab validates its content and marks itself complete/incomplete
- Completion status shown via checkmarks in navigation
- Progress bar shows overall completion percentage
- Preview tab requires all core sections to be complete

## User Experience Benefits
1. **Flexibility**: Jump to any section at any time
2. **Guidance**: Clear Next/Previous flow for linear progression
3. **Visual Feedback**: Toast notifications on tab changes
4. **Progress Visibility**: Always see completion status
5. **No Dead Ends**: Previous button intelligently skips personal tab
