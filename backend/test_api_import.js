// Simple test script for API import
// Run with: node backend/test_api_import.js

// Try to import node-fetch, if not available use global fetch
let fetch;
try {
  fetch = require('node-fetch');
} catch (e) {
  // If node-fetch is not available, assume we're in an environment with global fetch
  fetch = global.fetch || require('node-fetch');
}

async function testImport() {
  const csvData = `name,slug,description,category,is_premium,config
First Job Starter,first-job-starter,"Perfect for teens and young adults applying for their first job. Highlights relevant skills and education.","entry-level",false,"{\\"layout\\":\\"single-column\\",\\"colorScheme\\":\\"blue\\",\\"fontFamily\\":\\"Inter\\",\\"sections\\":[\\"personal\\",\\"summary\\",\\"experience\\",\\"education\\",\\"skills\\",\\"volunteer\\"],\\"maxPages\\":1,\\"spacing\\":\\"normal\\"}"
Lifeguard Ready,lifeguard-ready,"Designed specifically for lifeguard positions. Emphasizes safety training, certifications, and responsibility.","entry-level",false,"{\\"layout\\":\\"single-column\\",\\"colorScheme\\":\\"blue\\",\\"fontFamily\\":\\"Inter\\",\\"sections\\":[\\"personal\\",\\"summary\\",\\"certifications\\",\\"experience\\",\\"education\\",\\"skills\\"],\\"maxPages\\":1,\\"spacing\\":\\"normal\\"}"
Hospitality Helper,hospitality-helper,"Great for hostess, server, or other hospitality positions. Highlights customer service skills and availability.","entry-level",false,"{\\"layout\\":\\"single-column\\",\\"colorScheme\\":\\"green\\",\\"fontFamily\\":\\"Inter\\",\\"sections\\":[\\"personal\\",\\"summary\\",\\"experience\\",\\"education\\",\\"skills\\",\\"availability\\"],\\"maxPages\\":1,\\"spacing\\":\\"normal\\"}"
Retail Pro,retail-pro,"Ideal for retail positions like cashier or sales associate. Emphasizes cash handling and customer service skills.","entry-level",false,"{\\"layout\\":\\"single-column\\",\\"colorScheme\\":\\"purple\\",\\"fontFamily\\":\\"Inter\\",\\"sections\\":[\\"personal\\",\\"summary\\",\\"experience\\",\\"education\\",\\"skills\\",\\"achievements\\"],\\"maxPages\\":1,\\"spacing\\":\\"normal\\"}"
Service Star,service-star,"Perfect for gas station attendant, fast food worker, or similar service positions. Highlights reliability and work ethic.","entry-level",false,"{\\"layout\\":\\"single-column\\",\\"colorScheme\\":\\"orange\\",\\"fontFamily\\":\\"Inter\\",\\"sections\\":[\\"personal\\",\\"summary\\",\\"experience\\",\\"education\\",\\"skills\\",\\"references\\"],\\"maxPages\\":1,\\"spacing\\":\\"normal\\"}"`;
  
  // Try multiple possible URLs
  const urls = [
    'http://localhost:8080/api/import-templates/loqpb6u9vfr5jxp',
    'https://pocketbase-production-1493.up.railway.app/api/import-templates/loqpb6u9vfr5jxp'
  ];
  
  for (const url of urls) {
    try {
      console.log('Testing template import with URL:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ csvData }),
      });
      
      const result = await response.json();
      console.log('Import result:', result);
      
      if (result.success) {
        console.log('✅ Import successful!');
        return;
      } else {
        console.log('❌ Import failed:', result.message);
      }
    } catch (error) {
      console.error('Import error with URL', url, ':', error.message);
      continue;
    }
  }
  
  console.log('❌ All import attempts failed');
}

// Run the test
testImport();