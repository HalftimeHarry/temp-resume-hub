/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("resumes")

  // Add purpose field - describes the specific purpose/role for this resume
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "purpose",
    "name": "purpose",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": 200,
      "pattern": ""
    }
  }))

  // Add target_industry field - the industry this resume is targeting
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "target_industry",
    "name": "target_industry",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": 100,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  // Rollback - remove the fields
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("resumes")

  // Remove purpose field
  collection.schema.removeField("purpose")

  // Remove target_industry field
  collection.schema.removeField("target_industry")

  return dao.saveCollection(collection)
})
