const express = require('express');
const cors = require('cors');
const moviesRoutes = require("./routes/movies");
const authRoutes = require("./routes/auth");
const personRoutes = require("./routes/person");
const userRoutes = require("./routes/user");
const entityRoutes = require("./routes/entity");

const bodyParser = require('body-parser');
require('dotenv').config();


const app = express();
const port = 3000;


app.use(cors());

app.use(bodyParser.json());

app.use("/movies", moviesRoutes);
app.use("/auth", authRoutes);
app.use("/person", personRoutes);
app.use("/user", userRoutes);
app.use("/entity", entityRoutes);



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
