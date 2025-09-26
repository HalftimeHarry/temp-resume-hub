#!/usr/bin/env node

/**
 * Enhanced Template System Verification Script
 * 
 * This script verifies that the enhanced template system is working correctly
 * by checking file structure, imports, and basic functionality.
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Enhanced Template System Verification\n');

const checks = [
  {
    name: 'Enhanced Templates Store',
    path: 'app/src/lib/stores/enhancedTemplates.ts',
    required: true
  },
  {
    name: 'Enhanced Template Test Component',
    path: 'app/src/lib/components/test/EnhancedTemplateTest.svelte',
    required: true
  },
  {
    name: 'Backward Compatibility Test Component',
    path: 'app/src/lib/components/test/BackwardCompatibilityTest.svelte',
    required: true
  },
  {
    name: 'Test Route',
    path: 'app/src/routes/test/enhanced-templates/+page.svelte',
    required: true
  },
  {
    name: 'PocketBase Update Script',
    path: 'update-pocketbase-templates.js',
    required: true
  },
  {
    name: 'Testing Documentation',
    path: 'ENHANCED_TEMPLATE_TESTING.md',
    required: true
  }
];

let allPassed = true;

console.log('📁 File Structure Verification:');
checks.forEach(check => {
  const exists = fs.existsSync(check.path);
  const status = exists ? '✅' : (check.required ? '❌' : '⚠️');
  console.log(`  ${status} ${check.name}: ${check.path}`);
  
  if (check.required && !exists) {
    allPassed = false;
  }
});

console.log('\n🔍 Content Verification:');

// Check enhanced templates store content
try {
  const enhancedStoreContent = fs.readFileSync('app/src/lib/stores/enhancedTemplates.ts', 'utf8');
  
  const requiredExports = [
    'enhancedTemplates',
    'quickstarters',
    'isLoadingEnhanced',
    'enhancedTemplateStore'
  ];
  
  const requiredMethods = [
    'loadTemplates',
    'getRecommendations',
    'testEnhancedTemplate'
  ];
  
  console.log('  Enhanced Templates Store:');
  requiredExports.forEach(exportName => {
    const hasExport = enhancedStoreContent.includes(`export const ${exportName}`) || 
                     enhancedStoreContent.includes(`export { ${exportName}`);
    console.log(`    ${hasExport ? '✅' : '❌'} Export: ${exportName}`);
    if (!hasExport) allPassed = false;
  });
  
  requiredMethods.forEach(method => {
    const hasMethod = enhancedStoreContent.includes(`${method}(`);
    console.log(`    ${hasMethod ? '✅' : '❌'} Method: ${method}`);
    if (!hasMethod) allPassed = false;
  });
  
} catch (error) {
  console.log('  ❌ Could not verify enhanced templates store content');
  allPassed = false;
}

// Check test component content
try {
  const testComponentContent = fs.readFileSync('app/src/lib/components/test/EnhancedTemplateTest.svelte', 'utf8');
  
  const requiredFeatures = [
    'enhancedTemplateStore',
    'testResults',
    'runTests',
    'testRecommendations'
  ];
  
  console.log('  Enhanced Template Test Component:');
  requiredFeatures.forEach(feature => {
    const hasFeature = testComponentContent.includes(feature);
    console.log(`    ${hasFeature ? '✅' : '❌'} Feature: ${feature}`);
    if (!hasFeature) allPassed = false;
  });
  
} catch (error) {
  console.log('  ❌ Could not verify test component content');
  allPassed = false;
}

// Check backward compatibility test
try {
  const compatTestContent = fs.readFileSync('app/src/lib/components/test/BackwardCompatibilityTest.svelte', 'utf8');
  
  const requiredFeatures = [
    'templateStore',
    'enhancedTemplateStore',
    'runCompatibilityTest',
    'checkStructureCompatibility'
  ];
  
  console.log('  Backward Compatibility Test Component:');
  requiredFeatures.forEach(feature => {
    const hasFeature = compatTestContent.includes(feature);
    console.log(`    ${hasFeature ? '✅' : '❌'} Feature: ${feature}`);
    if (!hasFeature) allPassed = false;
  });
  
} catch (error) {
  console.log('  ❌ Could not verify backward compatibility test content');
  allPassed = false;
}

console.log('\n📋 Integration Verification:');

// Check if original templates store is preserved
try {
  const originalStoreContent = fs.readFileSync('app/src/lib/stores/templates.ts', 'utf8');
  
  const originalFeatures = [
    'templateStore',
    'loadTemplates',
    'getTemplate',
    'searchTemplates'
  ];
  
  console.log('  Original Templates Store (preserved):');
  originalFeatures.forEach(feature => {
    const hasFeature = originalStoreContent.includes(feature);
    console.log(`    ${hasFeature ? '✅' : '❌'} Feature: ${feature}`);
    if (!hasFeature) allPassed = false;
  });
  
} catch (error) {
  console.log('  ❌ Could not verify original templates store');
  allPassed = false;
}

console.log('\n🎯 Summary:');
if (allPassed) {
  console.log('✅ All verification checks passed!');
  console.log('\n📝 Next Steps:');
  console.log('1. Start the development server: cd app && npm run dev');
  console.log('2. Navigate to /test/enhanced-templates to run tests');
  console.log('3. Verify both Enhanced Template Test and Backward Compatibility Test');
  console.log('4. Check console for any runtime errors');
  console.log('5. Test template selection and quickstarter features');
} else {
  console.log('❌ Some verification checks failed. Please review the issues above.');
  process.exit(1);
}

console.log('\n🔗 Test URLs:');
console.log('- Enhanced Template Test: /test/enhanced-templates');
console.log('- Main Templates Page: /templates');
console.log('- Resume Builder: /builder');

console.log('\n📚 Documentation:');
console.log('- Testing Guide: ENHANCED_TEMPLATE_TESTING.md');
console.log('- PocketBase Update: update-pocketbase-templates.js');

console.log('\n🧪 Manual Testing Checklist:');
console.log('□ Enhanced templates load correctly');
console.log('□ Quickstarter data is valid and useful');
console.log('□ Backward compatibility maintained');
console.log('□ Recommendation system works');
console.log('□ Original template functionality preserved');
console.log('□ No console errors or warnings');
console.log('□ Performance is acceptable');
console.log('□ Mobile responsiveness maintained');