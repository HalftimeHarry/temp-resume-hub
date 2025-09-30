# Backend Collections Refactor Plan

## Overview
Refactor the backend to better utilize the new `user_profiles` collection for enhanced personalization, smarter template recommendations, and improved user experience.

## Current Collections Analysis

### 1. **user_profiles** ✅ (Already Enhanced)
- **Status**: Production-ready with 12 comprehensive fields
- **Completion**: 85%+ threshold for recommendations
- **Integration**: Ready for template matching and content personalization

### 2. **templates** (Needs Enhancement)
**Current Schema:**
```json
{
  "id": "string",
  "name": "string", 
  "description": "string",
  "category": "string",
  "preview_image": ["array of image URLs"],
  "config": "json",
  "isPremium": "boolean",
  "isActive": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

**Enhanced Schema:**
```json
{
  "id": "string",
  "name": "string",
  "description": "string", 
  "category": "string",
  "preview_image": ["array of image URLs"],
  "config": "json", // Enhanced with targeting data
  "isPremium": "boolean",
  "isActive": "boolean",
  
  // NEW FIELDS FOR PROFILE INTEGRATION
  "target_industries": ["array"], // ["technology", "healthcare", "finance"]
  "target_experience_levels": ["array"], // ["entry", "mid", "senior"]
  "target_job_types": ["array"], // ["software_engineer", "manager", "analyst"]
  "recommended_for": "json", // Complex targeting rules
  "usage_stats": "json", // Track popularity and success
  "ai_tags": ["array"], // Auto-generated tags for better matching
  
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### 3. **resumes** (Needs Major Enhancement)
**Current Schema:**
```json
{
  "id": "string",
  "title": "string",
  "slug": "string", 
  "user": "relation(users)",
  "template": "string",
  "content": "json",
  "is_public": "boolean",
  "view_count": "number",
  "last_viewed": "datetime",
  "role": "string",
  "created": "datetime",
  "updated": "datetime"
}
```

**Enhanced Schema:**
```json
{
  "id": "string",
  "title": "string",
  "slug": "string",
  "user": "relation(users)",
  "template": "relation(templates)", // Change to relation for better queries
  "content": "json", // Enhanced structure
  "is_public": "boolean",
  "view_count": "number", 
  "download_count": "number", // NEW
  "share_count": "number", // NEW
  "last_viewed": "datetime",
  "last_downloaded": "datetime", // NEW
  "last_shared": "datetime", // NEW
  
  // NEW PROFILE-DRIVEN FIELDS
  "profile_snapshot": "json", // Snapshot of user profile when created
  "target_job": "string", // Specific job this resume targets
  "target_company": "string", // Optional company targeting
  "optimization_score": "number", // AI-driven resume quality score
  "completion_percentage": "number", // How complete the resume is
  "personalization_level": "string", // "basic", "enhanced", "ai_optimized"
  
  // ENHANCED METADATA
  "tags": ["array"], // User and AI-generated tags
  "industry_focus": "string", // Primary industry for this resume
  "experience_level": "string", // Experience level when created
  "status": "string", // "draft", "active", "archived"
  "version": "number", // Version tracking for resume iterations
  
  "created": "datetime",
  "updated": "datetime"
}
```

### 4. **user_settings** (Needs Complete Implementation)
**Current Schema:** (Empty/Basic)

**Enhanced Schema:**
```json
{
  "id": "string",
  "user": "relation(users)",
  
  // TEMPLATE PREFERENCES
  "preferred_template_categories": ["array"], // ["modern", "creative", "professional"]
  "template_usage_history": "json", // Track which templates user has tried
  "favorite_templates": ["array"], // Template IDs user has favorited
  
  // BUILDER PREFERENCES  
  "builder_flow_preferences": "json", // Custom step order, auto-save settings
  "default_color_scheme": "string", // User's preferred color scheme
  "auto_populate_from_profile": "boolean", // Auto-fill from profile data
  "skip_completed_steps": "boolean", // Skip steps that are already complete
  
  // PERSONALIZATION SETTINGS
  "ai_suggestions_enabled": "boolean", // Enable AI-powered suggestions
  "content_personalization_level": "string", // "basic", "enhanced", "full"
  "industry_specific_tips": "boolean", // Show industry-specific guidance
  "experience_level_guidance": "boolean", // Show experience-level tips
  
  // PRIVACY & SHARING
  "default_resume_privacy": "string", // "private", "public", "unlisted"
  "allow_template_recommendations": "boolean", // Share usage for better recommendations
  "analytics_enabled": "boolean", // Track resume performance
  
  // NOTIFICATION PREFERENCES
  "email_notifications": "json", // Email notification settings
  "in_app_notifications": "json", // In-app notification settings
  
  // UI PREFERENCES
  "theme": "string", // "light", "dark", "auto"
  "dashboard_layout": "string", // "grid", "list", "compact"
  "preview_mode": "string", // "side", "overlay", "fullscreen"
  
  "created": "datetime",
  "updated": "datetime"
}
```

## Implementation Phases

### Phase 1: Enhanced Template Targeting (Week 1)
1. **Add targeting fields to templates collection**
2. **Implement profile-based template filtering**
3. **Create template recommendation engine**
4. **Update builder to show recommended templates first**

### Phase 2: Smart Content Population (Week 2)
1. **Enhance resume content structure**
2. **Implement profile-template data fusion**
3. **Create intelligent content suggestions**
4. **Add auto-population from profile data**

### Phase 3: User Settings Integration (Week 3)
1. **Implement comprehensive user_settings collection**
2. **Add preference management UI**
3. **Integrate settings with builder flow**
4. **Add personalization controls**

### Phase 4: Advanced Analytics & AI (Week 4)
1. **Add enhanced resume analytics**
2. **Implement optimization scoring**
3. **Create success tracking**
4. **Add AI-powered improvements**

## Key Integration Points

### 1. **Profile → Template Matching**
```javascript
// Enhanced template filtering based on user profile
const getRecommendedTemplates = (userProfile) => {
  return templates.filter(template => {
    const industryMatch = template.target_industries.includes(userProfile.target_industry);
    const experienceMatch = template.target_experience_levels.includes(userProfile.experience_level);
    const jobTypeMatch = template.target_job_types.some(type => 
      userProfile.target_job_titles.toLowerCase().includes(type)
    );
    
    return industryMatch && experienceMatch && jobTypeMatch;
  }).sort((a, b) => calculateMatchScore(b, userProfile) - calculateMatchScore(a, userProfile));
};
```

### 2. **Profile → Content Population**
```javascript
// Smart content pre-population
const populateFromProfile = (templateData, userProfile) => {
  return {
    ...templateData,
    personalInfo: {
      ...templateData.personalInfo,
      fullName: `${userProfile.first_name} ${userProfile.last_name}`,
      location: userProfile.location,
      phone: userProfile.phone,
      linkedin: userProfile.linkedin_url
    },
    summary: generatePersonalizedSummary(templateData.summary, userProfile),
    skills: mergeSkills(templateData.skills, userProfile.key_skills?.split(',') || [])
  };
};
```

### 3. **Settings → Builder Flow**
```javascript
// Customized builder experience
const getBuilderFlow = (userSettings, userProfile) => {
  const steps = ['personal', 'summary', 'experience', 'education', 'skills', 'settings'];
  
  if (userSettings.skip_completed_steps && userProfile.profile_completed) {
    return steps.filter(step => !isStepAutoCompletable(step, userProfile));
  }
  
  return steps;
};
```

## Migration Strategy

### 1. **Backward Compatibility**
- All changes are additive (new fields, not modifications)
- Existing resumes continue to work unchanged
- Gradual feature rollout with feature flags

### 2. **Data Migration**
- Add new fields with sensible defaults
- Migrate existing template data to new structure
- Populate user_settings for existing users

### 3. **Feature Rollout**
- Phase 1: Enhanced template recommendations (immediate value)
- Phase 2: Smart content population (high user impact)
- Phase 3: Comprehensive personalization (advanced features)
- Phase 4: AI-powered optimization (premium features)

## Expected Benefits

### 1. **User Experience**
- ✅ Personalized template recommendations
- ✅ Faster resume creation with smart pre-population
- ✅ Industry-specific guidance and tips
- ✅ Customizable builder experience

### 2. **Business Value**
- ✅ Higher user engagement and completion rates
- ✅ Better template utilization and discovery
- ✅ Data-driven insights for template creation
- ✅ Premium feature differentiation

### 3. **Technical Benefits**
- ✅ Better data relationships and queries
- ✅ Enhanced analytics and reporting
- ✅ Scalable personalization architecture
- ✅ AI-ready data structure

## Next Steps

1. **Review and approve this refactor plan**
2. **Create detailed implementation tickets for Phase 1**
3. **Set up feature flags for gradual rollout**
4. **Begin with template targeting enhancements**
5. **Implement user feedback collection for continuous improvement**

This refactor will transform the resume builder from a template-driven tool into an intelligent, personalized career assistant that leverages rich user profile data to create better resumes faster.