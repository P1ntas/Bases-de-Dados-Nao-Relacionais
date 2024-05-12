const db = require('../database');



exports.getLikeStatus = async (req, res) => {
    const { id, userId } = req.params;
    try {
        const query = `
            FOR edge IN reactions
            FILTER edge._from == '${userId}' && edge._to == '${id}' && edge.$label == 'reacts'
            RETURN edge
        `;
        const cursor = await db.query(query);
        const result = await cursor.next();
        res.status(200).json(result ? result.like : null);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteReaction = async (req, res) => {
    const { id, userId } = req.params;
    try {
        const query = `
            FOR edge IN reactions
            FILTER edge._from == '${userId}' && edge._to == '${id}' && edge.$label == 'reacts'
            REMOVE { _key: edge._key } IN reactions
            RETURN OLD
        `;
        await db.query(query);
        res.status(200).json({ message: "Reaction deleted successfully." });
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
            IN reactions
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
                FOR edge IN reactions
                FILTER edge._to == '${id}' && edge.$label == 'reacts' && edge.\`like\` == 1
                RETURN edge
            )
            LET movieDislikes = (
                FOR edge IN reactions
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