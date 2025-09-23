// Script to import templates for a specific user
// Usage: node import_templates_for_user.js <userId>

const userId = "loqpb6u9vfr5jxp"; // Default user ID

// Import the template importer module
const templateImporter = require("./pb_hooks/template_importer.js");

// Import templates for the specified user
console.log(`Importing templates for user: ${userId}`);
const result = templateImporter.importTemplatesForUser(userId);

if (result.success) {
  console.log("Template import completed successfully!");
  console.log(result.message);
} else {
  console.error("Template import failed!");
  console.error(result.message);
}