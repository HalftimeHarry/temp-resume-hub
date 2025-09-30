# User Profiles Collection - Field Checklist

## Quick Setup Checklist

**Collection Name**: `user_profiles`  
**Collection Type**: `Base`

### Fields to Add (in order):

- [ ] **user** (Relation) → users collection, required, max 1, cascade delete
- [ ] **first_name** (Text) → max 50 chars
- [ ] **last_name** (Text) → max 50 chars  
- [ ] **phone** (Text) → max 20 chars
- [ ] **location** (Text) → max 100 chars
- [ ] **linkedin_url** (URL)
- [ ] **portfolio_url** (URL)
- [ ] **target_industry** (Select) → max 1, values: technology,healthcare,finance,retail,education,manufacturing,hospitality,marketing,sales,consulting,nonprofit,government,media,real_estate,construction,transportation,energy,agriculture,legal,other
- [ ] **experience_level** (Select) → max 1, values: entry,junior,mid,senior,executive,student,career_change
- [ ] **target_job_titles** (Text) → max 500 chars
- [ ] **key_skills** (Text) → max 1000 chars
- [ ] **career_stage** (Select) → max 1, values: first_job,career_growth,career_change,promotion_seeking,industry_switch,returning_to_work,freelance_to_fulltime,executive_level
- [ ] **preferred_work_type** (Select) → max 3, values: remote,hybrid,onsite,contract,freelance,part_time,full_time,internship
- [ ] **salary_expectation_min** (Number) → min 0, integers only
- [ ] **salary_expectation_max** (Number) → min 0, integers only
- [ ] **education_level** (Select) → max 1, values: high_school,some_college,associates,bachelors,masters,doctorate,professional,bootcamp,certification
- [ ] **certifications** (Text) → max 500 chars
- [ ] **willing_to_relocate** (Bool)
- [ ] **template_preferences** (JSON)
- [ ] **onboarding_data** (JSON)
- [ ] **profile_completed** (Bool)
- [ ] **profile_completed_at** (Date)

### API Rules:
- [ ] **List**: `user = @request.auth.id`
- [ ] **View**: `user = @request.auth.id`
- [ ] **Create**: `user = @request.auth.id`
- [ ] **Update**: `user = @request.auth.id`
- [ ] **Delete**: `user = @request.auth.id`

### Test After Creation:
- [ ] Create a test record manually
- [ ] Visit `/test/profile-recommendations` 
- [ ] Click "Create Mock Profile"
- [ ] Verify profile appears in admin

## Common Issues & Solutions:

**"collectionId cannot be blank"** → Make sure the user relation field points to the users collection

**"values cannot be blank"** → For select fields, make sure you've added the values list (comma-separated, no spaces)

**"onCreate/onUpdate must be enabled"** → The created/updated fields are auto-added by PocketBase, don't add them manually

**Connection refused** → Make sure PocketBase is running on port 8090