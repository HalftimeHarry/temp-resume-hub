# Template Importer for Digital Resume Hub

This document explains how to import resume templates for users in the Digital Resume Hub application.

## CSV Template File

The templates are stored in `app/static/templates.csv` in CSV format. Each row represents a template with the following columns:

- `name`: The display name of the template
- `slug`: A unique identifier for the template (used in URLs)
- `description`: A brief description of the template
- `category`: The category of the template (e.g., "entry-level", "professional")
- `is_premium`: Whether the template is premium (true/false)
- `config`: JSON configuration for the template (layout, sections, etc.)

## Import Methods

### 1. API Endpoint (Admin Only)

Admin users can import templates via the API endpoint:

```
POST /api/import-templates/:userId
```

This endpoint is only accessible to admin users and will import all templates from the CSV file for the specified user.

### 2. Direct Script Execution

You can also run the import script directly:

```bash
node backend/import_templates_for_user.js
```

This will import templates for the default user ID specified in the script.

## Template Importer Script

The core logic is in `backend/pb_hooks/template_importer.js` which contains the `importTemplatesForUser(userId)` function. This function:

1. Reads the CSV file from `app/static/templates.csv`
2. Parses each template entry
3. Checks if the template already exists (by slug)
4. Creates new template records in the database
5. Associates templates with the specified user

## Adding New Templates

To add new templates:

1. Add a new row to `app/static/templates.csv`
2. Run the import script or call the API endpoint
3. The new templates will be available in the application

## Error Handling

The importer will skip templates that:
- Have invalid CSV data
- Fail to parse the config JSON
- Already exist in the database (based on slug)

Errors are logged to the console and will not stop the import process for other templates.
## Testing

To test the import functionality, you can:

1. Visit the test page at `/test-import` to manually trigger an import
2. Use the import button on the dashboard (visible only to user "loqpb6u9vfr5jxp")
3. Run the direct script: `node backend/import_templates_for_user.js`

For API testing, you can make a POST request to `/api/import-templates/:userId` with a JSON body containing the CSV data:

```json
{
  "csvData": "name,slug,description,category,is_premium,config\nFirst Job Starter,first-job-starter,\"Perfect for teens...\",\"entry-level\",false,\"{\\\"layout\\\":\\\"single-column\\\",...}\""
}
```
## Testing via Command Line

You can test the import functionality via command line:

1. Run the test script: `node backend/test_api_import.js`

This will make a direct API call to import templates for user "loqpb6u9vfr5jxp".