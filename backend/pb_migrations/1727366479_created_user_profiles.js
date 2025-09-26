/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "pbc_user_profiles",
    "created": "2025-09-26 16:21:19.000Z",
    "updated": "2025-09-26 16:21:19.000Z",
    "name": "user_profiles",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "relation_user",
        "name": "user",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "text_first_name",
        "name": "first_name",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": 50,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "text_last_name",
        "name": "last_name",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": 50,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "text_phone",
        "name": "phone",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": 20,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "text_location",
        "name": "location",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": 100,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "url_linkedin",
        "name": "linkedin_url",
        "type": "url",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "exceptDomains": null,
          "onlyDomains": null
        }
      },
      {
        "system": false,
        "id": "url_portfolio",
        "name": "portfolio_url",
        "type": "url",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "exceptDomains": null,
          "onlyDomains": null
        }
      },
      {
        "system": false,
        "id": "select_industry",
        "name": "target_industry",
        "type": "select",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "technology",
            "healthcare",
            "finance",
            "retail",
            "education",
            "manufacturing",
            "hospitality",
            "marketing",
            "sales",
            "consulting",
            "nonprofit",
            "government",
            "media",
            "real_estate",
            "construction",
            "transportation",
            "energy",
            "agriculture",
            "legal",
            "other"
          ]
        }
      },
      {
        "system": false,
        "id": "select_experience",
        "name": "experience_level",
        "type": "select",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "entry",
            "junior",
            "mid",
            "senior",
            "executive",
            "student",
            "career_change"
          ]
        }
      },
      {
        "system": false,
        "id": "text_job_titles",
        "name": "target_job_titles",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": 500,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "text_skills",
        "name": "key_skills",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": 1000,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "select_career_stage",
        "name": "career_stage",
        "type": "select",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "first_job",
            "career_growth",
            "career_change",
            "promotion_seeking",
            "industry_switch",
            "returning_to_work",
            "freelance_to_fulltime",
            "executive_level"
          ]
        }
      },
      {
        "system": false,
        "id": "select_work_type",
        "name": "preferred_work_type",
        "type": "select",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 3,
          "values": [
            "remote",
            "hybrid",
            "onsite",
            "contract",
            "freelance",
            "part_time",
            "full_time",
            "internship"
          ]
        }
      },
      {
        "system": false,
        "id": "number_salary_min",
        "name": "salary_expectation_min",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 0,
          "max": null,
          "noDecimal": true
        }
      },
      {
        "system": false,
        "id": "number_salary_max",
        "name": "salary_expectation_max",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 0,
          "max": null,
          "noDecimal": true
        }
      },
      {
        "system": false,
        "id": "select_education",
        "name": "education_level",
        "type": "select",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "high_school",
            "some_college",
            "associates",
            "bachelors",
            "masters",
            "doctorate",
            "professional",
            "bootcamp",
            "certification"
          ]
        }
      },
      {
        "system": false,
        "id": "text_certifications",
        "name": "certifications",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": 500,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "bool_willing_relocate",
        "name": "willing_to_relocate",
        "type": "bool",
        "required": false,
        "presentable": false,
        "unique": false
      },
      {
        "system": false,
        "id": "json_preferences",
        "name": "template_preferences",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 2000000
        }
      },
      {
        "system": false,
        "id": "json_onboarding",
        "name": "onboarding_data",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 2000000
        }
      },
      {
        "system": false,
        "id": "bool_profile_complete",
        "name": "profile_completed",
        "type": "bool",
        "required": false,
        "presentable": false,
        "unique": false
      },
      {
        "system": false,
        "id": "date_profile_completed",
        "name": "profile_completed_at",
        "type": "date",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_user_user_profiles` ON `user_profiles` (`user`)",
      "CREATE INDEX `idx_industry_experience_user_profiles` ON `user_profiles` (`target_industry`, `experience_level`)",
      "CREATE INDEX `idx_career_stage_user_profiles` ON `user_profiles` (`career_stage`)"
    ],
    "listRule": "user = @request.auth.id",
    "viewRule": "user = @request.auth.id",
    "createRule": "user = @request.auth.id",
    "updateRule": "user = @request.auth.id",
    "deleteRule": "user = @request.auth.id",
    "options": {}
  })

  return Dao(db).saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("pbc_user_profiles")

  return dao.deleteCollection(collection)
})