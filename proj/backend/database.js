// database.js
const { Database } = require('arangojs');

// Database connection configuration
const db = new Database({
  url: 'http://arangodb:8529',
  databaseName: 'IMDB'
});

const users = db.collection('users')
users.ensureIndex({ type: "geo", fields: [ "geometry" ], geoJson: true })
users.ensureIndex({ type: "persistent", fields: [ "username" ] })

module.exports = db;
