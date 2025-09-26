#!/usr/bin/env node

/**
 * Script to update the Retail Rockstar template with enhanced quickstarter data
 * This script adds rich quickstarter data to the existing template without breaking anything
 */

const fs = require('fs');
const path = require('path');

// For testing without PocketBase SDK, we'll create the update data
// In production, you can use the PocketBase SDK to actually update

async function updateRetailRockstarTemplate() {
  console.log('🚀 Starting Retail Rockstar template enhancement...');
  
  try {
    // Load the enhanced template data
    const templatePath = path.join(__dirname, 'enhanced_template_retail_rockstar.json');
    const enhancedTemplate = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
    
    console.log('✅ Loaded enhanced template data');
    console.log(`   Name: ${enhancedTemplate.name}`);
    console.log(`   Slug: ${enhancedTemplate.slug}`);
    console.log(`   Target Jobs: ${enhancedTemplate.config.quickstarter.metadata.targetJobs.join(', ')}`);
    
    // Extract the config for database update
    const configForDatabase = enhancedTemplate.config;
    
    // Create SQL update statement (for manual execution)
    const sqlUpdate = `
-- Update Retail Rockstar template with enhanced quickstarter data
UPDATE templates 
SET 
  name = '${enhancedTemplate.name}',
  description = '${enhancedTemplate.description}',
  config = '${JSON.stringify(configForDatabase).replace(/'/g, "''")}'
WHERE slug = '${enhancedTemplate.slug}';

-- If template doesn't exist, insert it
INSERT OR IGNORE INTO templates (
  id, name, slug, description, category, is_premium, config, created, updated
) VALUES (
  '${generateId()}',
  '${enhancedTemplate.name}',
  '${enhancedTemplate.slug}',
  '${enhancedTemplate.description}',
  '${enhancedTemplate.category}',
  ${enhancedTemplate.is_premium ? 1 : 0},
  '${JSON.stringify(configForDatabase).replace(/'/g, "''")}',
  datetime('now'),
  datetime('now')
);`;
    
    // Save SQL to file
    const sqlPath = path.join(__dirname, 'update_retail_rockstar.sql');
    fs.writeFileSync(sqlPath, sqlUpdate);
    console.log(`✅ Generated SQL update script: ${sqlPath}`);
    
    // Create PocketBase API update (for programmatic execution)
    const apiUpdate = {
      method: 'PATCH',
      url: '/api/collections/templates/records/{record_id}',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {admin_token}'
      },
      body: {
        name: enhancedTemplate.name,
        description: enhancedTemplate.description,
        config: configForDatabase
      }
    };
    
    // Save API update to file
    const apiPath = path.join(__dirname, 'api_update_retail_rockstar.json');
    fs.writeFileSync(apiPath, JSON.stringify(apiUpdate, null, 2));
    console.log(`✅ Generated API update script: ${apiPath}`);
    
    // Create test data for client-side verification
    const testData = {
      template: enhancedTemplate,
      quickstarterData: enhancedTemplate.config.quickstarter,
      summaryTemplates: enhancedTemplate.config.quickstarter.starterContent.summaryTemplates,
      skillSuggestions: enhancedTemplate.config.quickstarter.starterContent.skillSuggestions,
      guidance: enhancedTemplate.config.quickstarter.guidance
    };
    
    const testPath = path.join(__dirname, 'test_data_retail_rockstar.json');
    fs.writeFileSync(testPath, JSON.stringify(testData, null, 2));
    console.log(`✅ Generated test data: ${testPath}`);
    
    // Validation
    console.log('\n🔍 Validation Results:');
    console.log(`   ✅ Template has ${enhancedTemplate.config.quickstarter.starterContent.summaryTemplates.length} summary templates`);
    console.log(`   ✅ Template has ${enhancedTemplate.config.quickstarter.starterContent.skillSuggestions.length} skill suggestions`);
    console.log(`   ✅ Template has ${enhancedTemplate.config.quickstarter.starterContent.experienceExamples.length} experience examples`);
    console.log(`   ✅ Template has ${enhancedTemplate.config.quickstarter.guidance.gettingStarted.length} getting started tips`);
    console.log(`   ✅ Template has ${enhancedTemplate.config.quickstarter.starterContent.industryKeywords.length} industry keywords`);
    
    // Backward compatibility check
    const requiredFields = ['layout', 'colorScheme', 'sections'];
    const missingFields = requiredFields.filter(field => !enhancedTemplate.config[field]);
    
    if (missingFields.length === 0) {
      console.log('   ✅ Backward compatibility maintained - all required fields present');
    } else {
      console.log(`   ❌ Missing required fields: ${missingFields.join(', ')}`);
    }
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Review the generated files above');
    console.log('2. Execute the SQL script in your PocketBase admin panel, OR');
    console.log('3. Use the API update script with your PocketBase SDK');
    console.log('4. Test the enhanced template in your application');
    console.log('5. Verify client-side loading works correctly');
    
    return {
      success: true,
      files: {
        sql: sqlPath,
        api: apiPath,
        test: testPath
      },
      template: enhancedTemplate
    };
    
  } catch (error) {
    console.error('❌ Error updating template:', error);
    return { success: false, error: error.message };
  }
}

function generateId() {
  // Generate a 15-character ID similar to PocketBase format
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 15; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Run the script
if (require.main === module) {
  updateRetailRockstarTemplate()
    .then(result => {
      if (result.success) {
        console.log('\n🎉 Template enhancement completed successfully!');
        process.exit(0);
      } else {
        console.error('\n💥 Template enhancement failed:', result.error);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('\n💥 Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { updateRetailRockstarTemplate };