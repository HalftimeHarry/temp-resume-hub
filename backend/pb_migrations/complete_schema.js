// Complete Digital Resume Hub schema migration
migrate((db) => {
  // Enhanced Users collection
  const users = new Collection({
    "id": "users",
    "name": "users",
    "type": "auth",
    "system": false,
    "schema": [
      {
        "id": "name",
        "name": "name",
        "type": "text",
        "system": false,
        "required": true,
        "options": {
          "min": 1,
          "max": 100,
          "pattern": ""
        }
      },
      {
        "id": "username",
        "name": "username",
        "type": "text",
        "system": false,
        "required": true,
        "options": {
          "min": 3,
          "max": 30,
          "pattern": "^[a-zA-Z0-9-_]+$"
        }
      },
      {
        "id": "avatar",
        "name": "avatar",
        "type": "file",
        "system": false,
        "required": false,
        "options": {
          "maxSelect": 1,
          "maxSize": 5242880,
          "mimeTypes": [
            "image/jpeg",
            "image/png",
            "image/svg+xml",
            "image/gif",
            "image/webp"
          ],
          "thumbs": null
        }
      },
      {
        "id": "bio",
        "name": "bio",
        "type": "text",
        "system": false,
        "required": false,
        "options": {
          "min": null,
          "max": 500,
          "pattern": ""
        }
      },
      {
        "id": "website",
        "name": "website",
        "type": "url",
        "system": false,
        "required": false,
        "options": {
          "exceptDomains": null,
          "onlyDomains": null
        }
      },
      {
        "id": "plan",
        "name": "plan",
        "type": "select",
        "system": false,
        "required": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "free",
            "pro",
            "enterprise"
          ]
        }
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX idx_users_username ON users (username)"
    ],
    "listRule": "",
    "viewRule": "id = @request.auth.id",
    "createRule": "",
    "updateRule": "id = @request.auth.id",
    "deleteRule": "id = @request.auth.id",
    "options": {
      "allowEmailAuth": true,
      "allowOAuth2Auth": true,
      "allowUsernameAuth": false,
      "exceptEmailDomains": null,
      "manageRule": null,
      "minPasswordLength": 8,
      "onlyEmailDomains": null,
      "requireEmail": false
    }
  })

  // Resume Templates collection
  const templates = new Collection({
    "id": "templates",
    "name": "templates",
    "type": "base",
    "system": false,
    "schema": [
      {
        "id": "name",
        "name": "name",
        "type": "text",
        "system": false,
        "required": true,
        "options": {
          "min": 1,
          "max": 100,
          "pattern": ""
        }
      },
      {
        "id": "slug",
        "name": "slug",
        "type": "text",
        "system": false,
        "required": true,
        "options": {
          "min": 1,
          "max": 50,
          "pattern": "^[a-zA-Z0-9-_]+$"
        }
      },
      {
        "id": "description",
        "name": "description",
        "type": "text",
        "system": false,
        "required": false,
        "options": {
          "min": null,
          "max": 500,
          "pattern": ""
        }
      },
      {
        "id": "preview_image",
        "name": "preview_image",
        "type": "file",
        "system": false,
        "required": false,
        "options": {
          "maxSelect": 1,
          "maxSize": 2097152,
          "mimeTypes": [
            "image/jpeg",
            "image/png"
          ],
          "thumbs": null
        }
      },
      {
        "id": "category",
        "name": "category",
        "type": "select",
        "system": false,
        "required": true,
        "options": {
          "maxSelect": 1,
          "values": [
            "professional",
            "creative",
            "minimal",
            "modern",
            "academic"
          ]
        }
      },
      {
        "id": "is_premium",
        "name": "is_premium",
        "type": "bool",
        "system": false,
        "required": false,
        "options": {}
      },
      {
        "id": "config",
        "name": "config",
        "type": "json",
        "system": false,
        "required": true,
        "options": {}
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX idx_templates_slug ON templates (slug)"
    ],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "options": {}
  })

  // Enhanced Resumes collection
  const resumes = new Collection({
    "id": "resumes",
    "name": "resumes",
    "type": "base",
    "system": false,
    "schema": [
      {
        "id": "title",
        "name": "title",
        "type": "text",
        "system": false,
        "required": true,
        "options": {
          "min": 1,
          "max": 200,
          "pattern": ""
        }
      },
      {
        "id": "slug",
        "name": "slug",
        "type": "text",
        "system": false,
        "required": false,
        "options": {
          "min": 3,
          "max": 50,
          "pattern": "^[a-zA-Z0-9-_]+$"
        }
      },
      {
        "id": "user",
        "name": "user",
        "type": "relation",
        "system": false,
        "required": true,
        "options": {
          "collectionId": "users",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": ["name", "email"]
        }
      },
      {
        "id": "template",
        "name": "template",
        "type": "relation",
        "system": false,
        "required": true,
        "options": {
          "collectionId": "templates",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": ["name"]
        }
      },
      {
        "id": "content",
        "name": "content",
        "type": "json",
        "system": false,
        "required": true,
        "options": {}
      },
      {
        "id": "is_public",
        "name": "is_public",
        "type": "bool",
        "system": false,
        "required": false,
        "options": {}
      },
      {
        "id": "view_count",
        "name": "view_count",
        "type": "number",
        "system": false,
        "required": false,
        "options": {
          "min": 0,
          "max": null
        }
      },
      {
        "id": "last_viewed",
        "name": "last_viewed",
        "type": "date",
        "system": false,
        "required": false,
        "options": {
          "min": "",
          "max": ""
        }
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX idx_resumes_user_slug ON resumes (user, slug)",
      "CREATE INDEX idx_resumes_public ON resumes (is_public)"
    ],
    "listRule": "user = @request.auth.id",
    "viewRule": "user = @request.auth.id || is_public = true",
    "createRule": "user = @request.auth.id",
    "updateRule": "user = @request.auth.id",
    "deleteRule": "user = @request.auth.id",
    "options": {}
  })

  // Resume Views collection (for analytics)
  const resumeViews = new Collection({
    "id": "resume_views",
    "name": "resume_views",
    "type": "base",
    "system": false,
    "schema": [
      {
        "id": "resume",
        "name": "resume",
        "type": "relation",
        "system": false,
        "required": true,
        "options": {
          "collectionId": "resumes",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": ["title"]
        }
      },
      {
        "id": "viewer_ip",
        "name": "viewer_ip",
        "type": "text",
        "system": false,
        "required": false,
        "options": {
          "min": null,
          "max": 45,
          "pattern": ""
        }
      },
      {
        "id": "user_agent",
        "name": "user_agent",
        "type": "text",
        "system": false,
        "required": false,
        "options": {
          "min": null,
          "max": 500,
          "pattern": ""
        }
      },
      {
        "id": "referrer",
        "name": "referrer",
        "type": "url",
        "system": false,
        "required": false,
        "options": {
          "exceptDomains": null,
          "onlyDomains": null
        }
      },
      {
        "id": "country",
        "name": "country",
        "type": "text",
        "system": false,
        "required": false,
        "options": {
          "min": null,
          "max": 100,
          "pattern": ""
        }
      },
      {
        "id": "city",
        "name": "city",
        "type": "text",
        "system": false,
        "required": false,
        "options": {
          "min": null,
          "max": 100,
          "pattern": ""
        }
      },
      {
        "id": "device_type",
        "name": "device_type",
        "type": "select",
        "system": false,
        "required": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "desktop",
            "mobile",
            "tablet"
          ]
        }
      },
      {
        "id": "view_duration",
        "name": "view_duration",
        "type": "number",
        "system": false,
        "required": false,
        "options": {
          "min": 0,
          "max": null
        }
      }
    ],
    "indexes": [
      "CREATE INDEX idx_resume_views_resume ON resume_views (resume)",
      "CREATE INDEX idx_resume_views_created ON resume_views (created)"
    ],
    "listRule": "resume.user = @request.auth.id",
    "viewRule": "resume.user = @request.auth.id",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "resume.user = @request.auth.id",
    "options": {}
  })

  // User Settings collection
  const userSettings = new Collection({
    "id": "user_settings",
    "name": "user_settings",
    "type": "base",
    "system": false,
    "schema": [
      {
        "id": "user",
        "name": "user",
        "type": "relation",
        "system": false,
        "required": true,
        "options": {
          "collectionId": "users",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": ["name"]
        }
      },
      {
        "id": "theme",
        "name": "theme",
        "type": "select",
        "system": false,
        "required": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "light",
            "dark",
            "auto"
          ]
        }
      },
      {
        "id": "email_notifications",
        "name": "email_notifications",
        "type": "bool",
        "system": false,
        "required": false,
        "options": {}
      },
      {
        "id": "analytics_enabled",
        "name": "analytics_enabled",
        "type": "bool",
        "system": false,
        "required": false,
        "options": {}
      },
      {
        "id": "public_profile",
        "name": "public_profile",
        "type": "bool",
        "system": false,
        "required": false,
        "options": {}
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX idx_user_settings_user ON user_settings (user)"
    ],
    "listRule": "user = @request.auth.id",
    "viewRule": "user = @request.auth.id",
    "createRule": "user = @request.auth.id",
    "updateRule": "user = @request.auth.id",
    "deleteRule": "user = @request.auth.id",
    "options": {}
  })

  return Dao(db).saveCollection(users) && 
         Dao(db).saveCollection(templates) &&
         Dao(db).saveCollection(resumes) && 
         Dao(db).saveCollection(resumeViews) &&
         Dao(db).saveCollection(userSettings);
}, (db) => {
  // Rollback
  return Dao(db).deleteCollection("user_settings") &&
         Dao(db).deleteCollection("resume_views") &&
         Dao(db).deleteCollection("resumes") && 
         Dao(db).deleteCollection("templates") &&
         Dao(db).deleteCollection("users");
});