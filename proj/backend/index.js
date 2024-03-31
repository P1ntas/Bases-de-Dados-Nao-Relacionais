const express = require('express');
const { Database } = require('arangojs');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Database connection configuration
const db = new Database({
  url: 'http://localhost:8529',
  databaseName: 'IMDB'
});

app.use(cors());

app.get('/', async (req, res) => {
    try {
        const result = await db.collection('imdb_vertices').count();
        const count = result.count; // Extract count from result
        res.json({ count }); // Send count as JSON
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
