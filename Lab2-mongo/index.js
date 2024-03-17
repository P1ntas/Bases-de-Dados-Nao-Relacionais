const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;
const client = new MongoClient('mongodb://localhost:27017');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware to connect to MongoDB
app.use(async (req, res, next) => {
    await client.connect();
    req.dbClient = client;
    req.db = client.db('miniforum');
    next();
});



// GET request to list topics or show a specific topic
app.get('/', async (req, res) => {
    const { topic } = req.query;
    if (topic) {
        const topicId = new ObjectId(topic);
        const topicData = await req.db.collection('topics').findOne({ _id: topicId });
        res.send(`
            <h1>MiniForum</h1>
            <a href="/">Home</a> |
            <a href="/new_topic">Start a new topic!</a>
            <h2>${topicData.title}</h2>
            <p>${topicData.body}</p>
            <p>-- ${topicData.author}</p>
            <h3>Comments:</h3>
            <ul>
                ${topicData.comments.map(comment => `<li>${comment.text} | ${comment.author}</li>`).join('')}
            </ul>
            <form action="/new_comment" method="POST">
                <input type="hidden" name="topic" value="${topic}">
                <label for="comment">Comment:</label><br>
                <textarea id="comment" name="comment" rows="4" required></textarea><br><br>
                <label for="author">Author:</label>
                <input type="text" id="author" name="author" required><br>
                <br>
                <button type="submit">Add new comment!</button>
            </form>
        `);
    } else {
        const topics = await req.db.collection('topics').find().toArray();
        res.send(`
        <h1>MiniForum</h1> 
        <a href="/">Home</a> |
        <a href="/new_topic">Start a new topic!</a>
        <h2>Topics</h2>
        <ul>
            ${topics.map(topic => `<li><a href="/?topic=${topic._id}">${topic.title}</a>(${topic.comments.length} comments)</li>`).join('')}
        </ul>
        
    `);
    }
});


app.get('/new_topic', (req, res) => {
    res.sendFile(__dirname + '/new_topic.html');
});

// POST request to add a new topic
app.post('/new_topic', async (req, res) => {
    const { title, body, author } = req.body;
    await req.db.collection('topics').insertOne({ title, body, author, comments: [] });
    res.redirect('/');
});

// POST request to add a new comment
app.post('/new_comment', async (req, res) => {
    const { topic, comment, author } = req.body;
    const topicId = new ObjectId(topic);
    await req.db.collection('topics').updateOne({ _id: topicId }, { $push: { comments: { text: comment, author: author } } });
    res.redirect(`/?topic=${topic}`);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


