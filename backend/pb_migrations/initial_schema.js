// Initial database schema for Resume Hub
migrate((db) => {
  // Users collection (extends the default users)
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
        "required": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
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
      }
    ],
    "indexes": [],
    "listRule": "id = @request.auth.id",
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

  // Resumes collection
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
          "displayFields": ["email", "name"]
        }
      },
      {
        "id": "content",
        "name": "content",
        "type": "json",
        "system": false,
        "required": false,
        "options": {}
      },
      {
        "id": "template",
        "name": "template",
        "type": "text",
        "system": false,
        "required": false,
        "options": {
          "min": null,
          "max": 50,
          "pattern": ""
        }
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
        "id": "slug",
        "name": "slug",
        "type": "text",
        "system": false,
        "required": false,
        "options": {
          "min": null,
          "max": 100,
          "pattern": "^[a-z0-9-]+$"
        }
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX idx_user_slug ON resumes (user, slug)"
    ],
    "listRule": "user = @request.auth.id || is_public = true",
    "viewRule": "user = @request.auth.id || is_public = true",
    "createRule": "user = @request.auth.id",
    "updateRule": "user = @request.auth.id",
    "deleteRule": "user = @request.auth.id",
    "options": {}
  })

  return Dao(db).saveCollection(users) && Dao(db).saveCollection(resumes)
}, (db) => {
  // Rollback
  return Dao(db).deleteCollection("resumes") && Dao(db).deleteCollection("users")
})