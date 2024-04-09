const db = require('../database');

exports.getMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.collection('imdb_vertices').count();
        const count = result.count; // Extract count from result
        res.status(200).json({ count });
        
    } catch (err) {
        res.status(400).send(err);
    }
};