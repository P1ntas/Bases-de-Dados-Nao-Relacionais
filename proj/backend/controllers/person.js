const db = require('../database');

exports.getPeople = async (req, res) => {
    try {
        const query = `
        FOR doc IN imdb_vertices
        FILTER doc.type == "Person"
        LIMIT 20
        RETURN doc
        `;

        const cursor = await db.query(query);
        const people = await cursor.all();
        res.status(200).json(people);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPerson = async (req, res) => {
    const { id } = req.params;
    
    try {
        const query = `
            FOR person IN imdb_vertices
            FILTER person._id == '${id}'
            RETURN person
        `;
        const cursor = await db.query(query);
        const person = await cursor.next();
        if (!person) {
            return res.status(404).json({ error: 'Person not found' });
        }
        res.status(200).json(person);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getActorMovies = async (req, res) => {
    const { id } = req.params;
    const decodedId = decodeURIComponent(id);
    
    try {
        const query = `
            FOR person IN imdb_vertices
            FILTER person._id == '${decodedId}'
            FOR edge in imdb_edges
                FILTER edge._from == person._id && edge.$label == 'ACTS_IN'
                RETURN DOCUMENT(edge._to)
        `;
        const cursor = await db.query(query);
        const movies = await cursor.all();
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getDirectorMovies = async (req, res) => {
    const { id } = req.params;
    const decodedId = decodeURIComponent(id);
    
    try {
        const query = `
            FOR person IN imdb_vertices
            FILTER person._id == '${decodedId}'
            FOR edge in imdb_edges
                FILTER edge._from == person._id && edge.$label == 'DIRECTED'
                RETURN DOCUMENT(edge._to)
        `;
        const cursor = await db.query(query);
        const movies = await cursor.all();
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.searchPerson = async (req, res) => {
    const { input } = req.params;
    try {
        const query = `
            FOR d IN personView 
            SEARCH ANALYZER(d.name IN TOKENS('${input}', 'name_analyzer'), 'name_analyzer')
            SORT BM25(d) DESC
            RETURN d
        `;
        const cursor = await db.query(query);
        const people = await cursor.all();
        if (!people) {
            return res.status(404).json({ error: 'People not found' });
        }
        res.status(200).json(people);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getLikeStatus = async (req, res) => {
    const { id, userId } = req.params;
    try {
        const query = `
            FOR edge IN imdb_edges
            FILTER edge._from == '${userId}' && edge._to == '${id}' && edge.$label == 'reacts'
            RETURN edge
        `;
        const cursor = await db.query(query);
        const result = await cursor.next();
        res.status(200).json(result ? result.like : 0);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.postLike = async (req, res) => {
    const { id, userId } = req.params;
    const { like } = req.body;
    try {
        const query = `
            UPSERT {_from: '${userId}', _to: '${id}', $label: 'reacts'}
            INSERT {_from: '${userId}', _to: '${id}', \`like\`: ${like}, $label: 'reacts'}
            UPDATE {\`like\`: ${like}}
            IN imdb_edges
        `;
        await db.query(query);
        res.status(200).json({ message: 'Like status updated' });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getLikeDislikeCount = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            LET movieLikes = (
                FOR edge IN imdb_edges
                FILTER edge._to == '${id}' && edge.$label == 'reacts' && edge.\`like\` == 1
                RETURN edge
            )
            LET movieDislikes = (
                FOR edge IN imdb_edges
                FILTER edge._to == '${id}' && edge.$label == 'reacts' && edge.\`like\` == 0
                RETURN edge
            )
            RETURN { 
                likes: LENGTH(movieLikes), 
                dislikes: LENGTH(movieDislikes) 
            }
        `;
        const cursor = await db.query(query);
        const result = await cursor.next();
        if (!result) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.status(200).json(result);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: error.message });
    }
};