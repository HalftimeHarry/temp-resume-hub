#!/usr/bin/env node

/**
 * PocketBase Template Enhancement Script
 * 
 * This script updates existing templates in PocketBase to include enhanced
 * quickstarter data while maintaining backward compatibility.
 */

const PocketBase = require('pocketbase/cjs');

// Configuration
const POCKETBASE_URL = process.env.POCKETBASE_URL || 'http://localhost:8090';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123456';

// Enhanced template data
const ENHANCED_TEMPLATES = {
  'retail-rockstar': {
    name: 'Retail Rockstar',
    category: 'Industry Specific',
    description: 'Perfect for retail professionals looking to showcase customer service excellence and sales achievements',
    quickstarter: {
      metadata: {
        targetIndustry: 'retail',
        experienceLevel: 'entry',
        targetJobs: [
          'Sales Associate',
          'Cashier',
          'Customer Service Representative',
          'Retail Assistant',
          'Store Associate',
          'Sales Consultant'
        ],
        keywords: [
          'customer service',
          'sales',
          'retail',
          'cash handling',
          'inventory',
          'teamwork',
          'communication',
          'problem solving'
        ]
      },
      starterContent: {
        summaryTemplates: [
          'Enthusiastic retail professional with a passion for delivering exceptional customer service and driving sales results.',
          'Customer-focused sales associate with proven ability to build rapport with diverse clientele and exceed sales targets.',
          'Dedicated retail team member with strong communication skills and commitment to creating positive shopping experiences.'
        ],
        skillSuggestions: [
          { name: 'Customer Service', category: 'soft', priority: 'high' },
          { name: 'Cash Handling', category: 'technical', priority: 'high' },
          { name: 'Sales Techniques', category: 'professional', priority: 'high' },
          { name: 'Inventory Management', category: 'technical', priority: 'medium' },
          { name: 'Communication', category: 'soft', priority: 'high' },
          { name: 'Teamwork', category: 'soft', priority: 'medium' },
          { name: 'Problem Solving', category: 'soft', priority: 'medium' },
          { name: 'Time Management', category: 'soft', priority: 'medium' },
          { name: 'Product Knowledge', category: 'professional', priority: 'medium' },
          { name: 'POS Systems', category: 'technical', priority: 'medium' }
        ],
        experienceTemplates: [
          {
            title: 'Sales Associate',
            company: '[Company Name]',
            description: 'Provided exceptional customer service while achieving sales targets and maintaining store presentation standards.',
            achievements: [
              'Consistently exceeded monthly sales goals by 15%',
              'Maintained 98% customer satisfaction rating',
              'Processed an average of 100+ transactions daily with accuracy'
            ]
          }
        ]
      },
      guidance: {
        gettingStarted: [
          'Start with a strong summary that highlights your customer service passion',
          'Include specific sales achievements with numbers when possible',
          'Highlight any experience with cash handling or POS systems',
          'Mention your ability to work in fast-paced environments',
          'Include any product knowledge or training certifications'
        ],
        commonMistakes: [
          'Don\'t just list job duties - focus on achievements and impact',
          'Avoid generic statements - be specific about your contributions',
          'Don\'t forget to mention teamwork and collaboration skills',
          'Avoid spelling errors - retail employers value attention to detail'
        ],
        industryTips: [
          'Retail employers value reliability and punctuality - mention perfect attendance',
          'Customer service skills are transferable - highlight them even from other industries',
          'Include any experience with inventory, merchandising, or loss prevention',
          'Mention flexibility with scheduling and willingness to work weekends/holidays'
        ]
      }
    }
  }
};

async function main() {
  console.log('🚀 Starting PocketBase Template Enhancement...\n');
  
  const pb = new PocketBase(POCKETBASE_URL);
  
  try {
    // Authenticate as admin
    console.log('🔐 Authenticating with PocketBase...');
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('✅ Authentication successful\n');
    
    // Get existing templates
    console.log('📋 Fetching existing templates...');
    const existingTemplates = await pb.collection('templates').getFullList();
    console.log(`Found ${existingTemplates.length} existing templates\n`);
    
    // Process each enhanced template
    for (const [templateKey, enhancedData] of Object.entries(ENHANCED_TEMPLATES)) {
      console.log(`🔄 Processing ${enhancedData.name}...`);
      
      // Check if template already exists
      let existingTemplate = existingTemplates.find(t => 
        t.name.toLowerCase().includes('retail') || 
        t.name.toLowerCase() === enhancedData.name.toLowerCase()
      );
      
      if (existingTemplate) {
        console.log(`  📝 Updating existing template: ${existingTemplate.name}`);
        
        // Update with enhanced data while preserving existing structure
        const updateData = {
          name: enhancedData.name,
          description: enhancedData.description,
          category: enhancedData.category,
          quickstarter: JSON.stringify(enhancedData.quickstarter),
          // Preserve existing fields
          config: existingTemplate.config,
          preview_image: existingTemplate.preview_image,
          is_premium: existingTemplate.is_premium || false
        };
        
        await pb.collection('templates').update(existingTemplate.id, updateData);
        console.log(`  ✅ Updated template: ${enhancedData.name}`);
        
      } else {
        console.log(`  🆕 Creating new template: ${enhancedData.name}`);
        
        // Create new enhanced template
        const newTemplateData = {
          name: enhancedData.name,
          description: enhancedData.description,
          category: enhancedData.category,
          quickstarter: JSON.stringify(enhancedData.quickstarter),
          config: JSON.stringify({
            settings: {
              template: 'modern',
              colorScheme: 'blue',
              fontSize: 'medium',
              spacing: 'normal',
              showProfileImage: false,
              sectionOrder: ['experience', 'education', 'skills']
            }
          }),
          is_premium: false
        };
        
        const newTemplate = await pb.collection('templates').create(newTemplateData);
        console.log(`  ✅ Created template: ${enhancedData.name} (ID: ${newTemplate.id})`);
      }
    }
    
    // Verify the updates
    console.log('\n🔍 Verifying updates...');
    const updatedTemplates = await pb.collection('templates').getFullList();
    const enhancedTemplates = updatedTemplates.filter(t => t.quickstarter);
    
    console.log(`📊 Summary:`);
    console.log(`  Total templates: ${updatedTemplates.length}`);
    console.log(`  Enhanced templates: ${enhancedTemplates.length}`);
    
    enhancedTemplates.forEach(template => {
      console.log(`  ✅ ${template.name} - Enhanced with quickstarter data`);
    });
    
    console.log('\n🎉 Template enhancement completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Test the enhanced templates in the application');
    console.log('2. Verify quickstarter functionality works correctly');
    console.log('3. Check that existing templates still function normally');
    
  } catch (error) {
    console.error('❌ Error during template enhancement:', error);
    
    if (error.status === 401) {
      console.error('\n🔐 Authentication failed. Please check:');
      console.error('- POCKETBASE_URL is correct');
      console.error('- ADMIN_EMAIL and ADMIN_PASSWORD are correct');
      console.error('- PocketBase admin account exists');
    } else if (error.status === 404) {
      console.error('\n📋 Collection not found. Please check:');
      console.error('- PocketBase is running');
      console.error('- Templates collection exists');
      console.error('- Collection schema is correct');
    }
    
    process.exit(1);
  }
}

// Helper function to backup existing data
async function backupTemplates(pb) {
  console.log('💾 Creating backup of existing templates...');
  
  try {
    const templates = await pb.collection('templates').getFullList();
    const backup = {
      timestamp: new Date().toISOString(),
      templates: templates
    };
    
    const fs = require('fs');
    const backupFile = `templates-backup-${Date.now()}.json`;
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    
    console.log(`✅ Backup created: ${backupFile}`);
    return backupFile;
  } catch (error) {
    console.error('❌ Backup failed:', error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, ENHANCED_TEMPLATES };