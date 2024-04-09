// database.js
const { Database } = require('arangojs');

// Database connection configuration
const db = new Database({
  url: 'http://localhost:8529',
  databaseName: 'IMDB'
});

module.exports = db;
