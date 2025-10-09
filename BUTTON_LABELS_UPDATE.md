# Button Labels Update - Context-Aware Actions

## Problem
Button labels showed "Next: [Step Name]" which implied a specific order and confused users about what action they were taking. For example, on the Summary step, the button said "Next: Experience" even though users could navigate in any order.

## Solution
Changed all buttons to context-aware labels that describe the action on the CURRENT step, not the next destination.

## Changes Made

### Updated Button Labels

| Tab | Old Label | New Label |
|-----|-----------|-----------|
| Get Started (Settings) | "Next: Personal Info →" | "Continue →" |
| Personal Info | "Next: Summary" | "Save & Continue" |
| Summary | "Next: Experience" | "Save & Continue" |
| Experience | "Next: Education" | "Save & Continue" |
| Education | "Next: Skills" | "Save & Continue" |
| Skills | "Next: Settings" | "Save & Continue" |
| Projects | N/A (no button) | N/A |
| Preview | "Publish Resume" | "Publish Resume" (unchanged) |

### Files Modified

1. `app/src/lib/components/builder/SettingsTab.svelte`
   - Changed "Next: Personal Info →" to "Continue →"

2. `app/src/lib/components/builder/PersonalInfoTab.svelte`
   - Changed "Next: Summary" to "Save & Continue"

3. `app/src/lib/components/builder/SummaryTab.svelte`
   - Changed "Next: Experience" to "Save & Continue"

4. `app/src/lib/components/builder/ExperienceTab.svelte`
   - Changed "Next: Education" to "Save & Continue"

5. `app/src/lib/components/builder/EducationTab.svelte`
   - Changed "Next: Skills" to "Save & Continue"

6. `app/src/lib/components/builder/SkillsTab.svelte`
   - Changed "Next: Settings" to "Save & Continue"

## Benefits

### ✅ Clearer Intent
**Before**: "Next: Experience" - Implies you MUST go to Experience next
**After**: "Save & Continue" - Describes what happens (save current step, move forward)

### ✅ Order-Agnostic
Users understand they can navigate in any order since the button doesn't prescribe a specific next step.

### ✅ Action-Focused
Button describes the action being taken on the CURRENT step:
- "Save & Continue" = Save this step's data and move forward
- "Continue" = Proceed to the next step (for Get Started)

### ✅ Consistent Pattern
All content steps use the same label, creating a predictable experience.

## User Experience

### Before
```
[Summary Tab]
────────────────────────────
Write your professional summary...

[Previous] [Next: Experience]
```
**Problem**: User thinks "I have to go to Experience next"

### After
```
[Summary Tab]
────────────────────────────
Write your professional summary...

[Previous] [Save & Continue]
```
**Benefit**: User understands "I'm saving my summary and continuing"

## Navigation Flow

Users can now:
1. ✅ Click "Save & Continue" to save and move forward
2. ✅ Click any tab in the sidebar/mobile nav to jump to that step
3. ✅ Click "Previous" to go back
4. ✅ Navigate in any order they prefer

The button label no longer implies a required order.

## Special Cases

### Get Started (Settings)
- Label: "Continue →"
- Reason: This is the initial setup step, not saving content
- Action: Applies industry/template selection and proceeds

### Preview
- Label: "Publish Resume"
- Reason: This is the final action, not continuing to another step
- Action: Publishes the resume

### Projects Tab
- No navigation buttons
- Reason: Optional step, users navigate via sidebar/tabs

## Testing

Visit: [https://5173--0199ae5a-71ce-7717-b925-e9b139a9e66e.us-east-1-01.gitpod.dev/builder](https://5173--0199ae5a-71ce-7717-b925-e9b139a9e66e.us-east-1-01.gitpod.dev/builder)

**Test Each Step**:
1. ✅ Get Started - Shows "Continue →"
2. ✅ Personal Info - Shows "Save & Continue"
3. ✅ Summary - Shows "Save & Continue"
4. ✅ Experience - Shows "Save & Continue"
5. ✅ Education - Shows "Save & Continue"
6. ✅ Skills - Shows "Save & Continue"
7. ✅ Preview - Shows "Publish Resume"

**Verify Behavior**:
- Click "Save & Continue" on any step
- Should save the current step's data
- Should advance to the next step in the tab order
- Can still navigate freely via sidebar/mobile tabs

## Code Pattern

### Standard Content Step
```svelte
<div class="flex justify-end">
  <Button disabled={!isValid} on:click={handleNext}>
    Save & Continue
  </Button>
</div>
```

### Initial Setup Step
```svelte
<button
  on:click={onNext}
  class="bg-green-600 text-white px-6 py-2 rounded-lg"
>
  Continue →
</button>
```

### Final Step
```svelte
<Button
  on:click={handlePublish}
  disabled={!allStepsComplete}
>
  Publish Resume
</Button>
```

## Future Enhancements

- [ ] Add "Save Draft" button (saves without navigating)
- [ ] Add "Skip" button for optional steps
- [ ] Add keyboard shortcuts (Ctrl+Enter to save & continue)
- [ ] Add auto-save indicator
- [ ] Add "Jump to incomplete step" button

## Related Changes

This complements the navigation fix where:
- Users can click any tab at any time
- Mobile horizontal tab navigation added
- No restrictions on step order

Together, these changes create a flexible, non-linear resume building experience.

## Conclusion

Button labels now accurately describe the action being taken on the current step, rather than prescribing the next destination. This makes the interface clearer and reinforces that users can navigate in any order they choose.
