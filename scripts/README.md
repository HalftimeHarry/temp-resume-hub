# Utility Scripts

This folder contains utility scripts for database management and setup.

## Scripts

### Database Migration & Setup
- `migrate-resumes-collection.js` - Migrate resume collection schema
- `update-pocketbase-templates.js` - Update template data in PocketBase
- `verify-enhanced-templates.js` - Verify template data integrity

### Usage

Most scripts are designed to be run from the backend directory:

```bash
cd backend
node ../scripts/script-name.js
```

**⚠️ Warning**: These scripts modify database data. Always backup your database before running them in production.

## Configuration Files

Configuration files have been moved to `docs/archive/` for reference:
- `FIELD_CONFIGURATIONS.json` - Field validation configurations
- `user_profiles_collection_import.json` - User profile collection schema
- `railway.minimal.json` - Railway deployment configuration