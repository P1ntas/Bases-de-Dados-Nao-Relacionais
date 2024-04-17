const express = require('express');
const cors = require('cors');
const moviesRoutes = require("./routes/movies");
const authRoutes = require("./routes/auth");
const bodyParser = require('body-parser');
require('dotenv').config();

const db = require('./database');

const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.json());

app.get('/', async (req, res) => {
    try {
        const result = await db.collection('imdb_vertices').count();
        const count = result.count; // Extract count from result
        res.json({ count }); // Send count as JSON
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.use("/movies", moviesRoutes);
app.use("/auth", authRoutes);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
