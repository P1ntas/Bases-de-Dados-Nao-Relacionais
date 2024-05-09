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
            SEARCH ANALYZER(d.name IN TOKENS('${input}', 'person_name_analyzer'), 'person_name_analyzer')
            SORT BM25(d) DESC
            LIMIT 10
            RETURN d
        `;
        const cursor = await db.query(query);
        const people = await cursor.all();
        if (!people) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.status(200).json(people);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: error.message });
    }
};