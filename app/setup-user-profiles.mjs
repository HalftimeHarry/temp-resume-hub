#!/usr/bin/env node

/**
 * User Profile Collection Setup Script
 * 
 * This script creates the user_profiles collection in PocketBase
 * and sets up the necessary structure for enhanced template recommendations.
 */

import PocketBase from 'pocketbase';
import fs from 'fs';

// Configuration
const POCKETBASE_URL = process.env.POCKETBASE_URL || 'http://localhost:8090';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123456';

async function main() {
  console.log('🚀 Setting up user_profiles collection...\n');
  
  const pb = new PocketBase(POCKETBASE_URL);
  
  try {
    // Authenticate as admin
    console.log('🔐 Authenticating with PocketBase...');
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('✅ Authentication successful\n');
    
    // Check if user_profiles collection already exists
    console.log('🔍 Checking for existing user_profiles collection...');
    try {
      const existingCollection = await pb.collections.getOne('user_profiles');
      console.log('⚠️  user_profiles collection already exists');
      console.log('   Collection ID:', existingCollection.id);
      console.log('   Created:', existingCollection.created);
      return;
    } catch (error) {
      if (error.status === 404) {
        console.log('✅ user_profiles collection does not exist, proceeding with creation');
      } else {
        throw error;
      }
    }
    
    // Load the collection schema
    console.log('📋 Loading user_profiles schema...');
    const schemaPath = '../backend/user_profile_schema.json';
    
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found: ${schemaPath}`);
    }
    
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    console.log('✅ Schema loaded successfully');
    
    // Create the collection using a simpler approach
    console.log('🏗️  Creating user_profiles collection...');
    
    const collectionData = {
      name: "user_profiles",
      type: "base",
      schema: [
        {
          name: "user",
          type: "relation",
          required: true,
          options: {
            collectionId: "_pb_users_auth_",
            cascadeDelete: true,
            minSelect: 1,
            maxSelect: 1
          }
        },
        {
          name: "first_name",
          type: "text",
          required: false,
          options: {
            max: 50
          }
        },
        {
          name: "last_name",
          type: "text", 
          required: false,
          options: {
            max: 50
          }
        },
        {
          name: "phone",
          type: "text",
          required: false,
          options: {
            max: 20
          }
        },
        {
          name: "location",
          type: "text",
          required: false,
          options: {
            max: 100
          }
        },
        {
          name: "linkedin_url",
          type: "url",
          required: false
        },
        {
          name: "portfolio_url",
          type: "url",
          required: false
        },
        {
          name: "target_industry",
          type: "select",
          required: false,
          options: {
            maxSelect: 1,
            values: ["technology", "healthcare", "finance", "retail", "education", "manufacturing", "hospitality", "marketing", "sales", "consulting", "nonprofit", "government", "media", "real_estate", "construction", "transportation", "energy", "agriculture", "legal", "other"]
          }
        },
        {
          name: "experience_level",
          type: "select",
          required: false,
          options: {
            maxSelect: 1,
            values: ["entry", "junior", "mid", "senior", "executive", "student", "career_change"]
          }
        },
        {
          name: "target_job_titles",
          type: "text",
          required: false,
          options: {
            max: 500
          }
        },
        {
          name: "key_skills",
          type: "text",
          required: false,
          options: {
            max: 1000
          }
        },
        {
          name: "career_stage",
          type: "select",
          required: false,
          options: {
            maxSelect: 1,
            values: ["first_job", "career_growth", "career_change", "promotion_seeking", "industry_switch", "returning_to_work", "freelance_to_fulltime", "executive_level"]
          }
        },
        {
          name: "preferred_work_type",
          type: "select",
          required: false,
          options: {
            maxSelect: 3,
            values: ["remote", "hybrid", "onsite", "contract", "freelance", "part_time", "full_time", "internship"]
          }
        },
        {
          name: "salary_expectation_min",
          type: "number",
          required: false,
          options: {
            min: 0,
            noDecimal: true
          }
        },
        {
          name: "salary_expectation_max",
          type: "number",
          required: false,
          options: {
            min: 0,
            noDecimal: true
          }
        },
        {
          name: "education_level",
          type: "select",
          required: false,
          options: {
            maxSelect: 1,
            values: ["high_school", "some_college", "associates", "bachelors", "masters", "doctorate", "professional", "bootcamp", "certification"]
          }
        },
        {
          name: "certifications",
          type: "text",
          required: false,
          options: {
            max: 500
          }
        },
        {
          name: "willing_to_relocate",
          type: "bool",
          required: false
        },
        {
          name: "template_preferences",
          type: "json",
          required: false
        },
        {
          name: "onboarding_data",
          type: "json",
          required: false
        },
        {
          name: "profile_completed",
          type: "bool",
          required: false
        },
        {
          name: "profile_completed_at",
          type: "date",
          required: false
        }
      ],
      listRule: "user = @request.auth.id",
      viewRule: "user = @request.auth.id",
      createRule: "user = @request.auth.id",
      updateRule: "user = @request.auth.id",
      deleteRule: "user = @request.auth.id"
    };
    
    const newCollection = await pb.collections.create(collectionData);
    console.log('✅ user_profiles collection created successfully!');
    console.log('   Collection ID:', newCollection.id);
    console.log('   Name:', newCollection.name);
    console.log('   Type:', newCollection.type);
    
    // Verify the collection structure
    console.log('\n🔍 Verifying collection structure...');
    const verifyCollection = await pb.collections.getOne('user_profiles');
    
    console.log('📊 Collection Details:');
    console.log(`   Fields: ${verifyCollection.schema.length}`);
    console.log(`   Indexes: ${verifyCollection.indexes?.length || 0}`);
    console.log(`   List Rule: ${verifyCollection.listRule}`);
    console.log(`   Create Rule: ${verifyCollection.createRule}`);
    
    // List key fields
    console.log('\n📝 Key Fields:');
    const keyFields = [
      'user', 'first_name', 'last_name', 'target_industry', 
      'experience_level', 'career_stage', 'target_job_titles'
    ];
    
    keyFields.forEach(fieldName => {
      const field = verifyCollection.schema.find(f => f.name === fieldName);
      if (field) {
        console.log(`   ✅ ${fieldName} (${field.type})`);
      } else {
        console.log(`   ❌ ${fieldName} - MISSING`);
      }
    });
    
    console.log('\n🎉 User profiles collection setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Update registration process to create user profiles');
    console.log('2. Enhance template recommendations using profile data');
    console.log('3. Create user profile management interface');
    console.log('4. Test profile creation and template matching');
    
  } catch (error) {
    console.error('❌ Error setting up user_profiles collection:', error);
    
    if (error.status === 401) {
      console.error('\n🔐 Authentication failed. Please check:');
      console.error('- POCKETBASE_URL is correct');
      console.error('- ADMIN_EMAIL and ADMIN_PASSWORD are correct');
      console.error('- PocketBase admin account exists');
    } else if (error.status === 400) {
      console.error('\n📋 Collection creation failed. Please check:');
      console.error('- Schema file is valid JSON');
      console.error('- Field definitions are correct');
      console.error('- No naming conflicts exist');
    }
    
    process.exit(1);
  }
}

// Helper function to create sample user profile data
async function createSampleProfiles(pb) {
  console.log('📝 Creating sample user profiles...');
  
  const sampleProfiles = [
    {
      target_industry: 'technology',
      experience_level: 'entry',
      career_stage: 'first_job',
      target_job_titles: 'Software Developer, Frontend Developer, Web Developer',
      key_skills: 'JavaScript, React, HTML, CSS, Git',
      education_level: 'bachelors',
      preferred_work_type: ['remote', 'hybrid'],
      profile_completed: true,
      profile_completed_at: new Date().toISOString()
    },
    {
      target_industry: 'retail',
      experience_level: 'entry',
      career_stage: 'first_job',
      target_job_titles: 'Sales Associate, Cashier, Customer Service Representative',
      key_skills: 'Customer Service, Cash Handling, Communication, Teamwork',
      education_level: 'high_school',
      preferred_work_type: ['part_time', 'full_time'],
      profile_completed: true,
      profile_completed_at: new Date().toISOString()
    },
    {
      target_industry: 'healthcare',
      experience_level: 'mid',
      career_stage: 'career_growth',
      target_job_titles: 'Registered Nurse, Nurse Practitioner, Healthcare Administrator',
      key_skills: 'Patient Care, Medical Knowledge, Communication, Critical Thinking',
      education_level: 'bachelors',
      preferred_work_type: ['full_time'],
      profile_completed: true,
      profile_completed_at: new Date().toISOString()
    }
  ];
  
  // Note: These would need actual user IDs to create
  console.log(`📊 Sample profile templates prepared (${sampleProfiles.length} profiles)`);
  console.log('   These can be used as templates when users register');
}

// Run the script
main().catch(console.error);