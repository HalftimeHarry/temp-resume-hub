// Test script for template import
const fs = require('fs');

// Read the sample CSV data
const csvData = fs.readFileSync('./sample_templates_data.csv', 'utf8');

console.log('Testing template import with CSV data:');
console.log(csvData);

// Make a request to the API endpoint
fetch('http://localhost:8080/api/import-templates/loqpb6u9vfr5jxp', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ csvData }),
})
  .then(response => response.json())
  .then(data => {
    console.log('Import result:', data);
  })
  .catch(error => {
    console.error('Import error:', error);
  });