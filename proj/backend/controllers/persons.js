const db = require('../database');

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


