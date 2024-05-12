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
        res.status(200).json(result ? result.likes : null);
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
            INSERT {_from: '${userId}', _to: '${id}', likes: ${like}, $label: 'reacts'}
            UPDATE {likes: ${like}}
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
                FILTER edge._to == '${id}' && edge.$label == 'reacts' && edge.likes == 1
                RETURN edge
            )
            LET movieDislikes = (
                FOR edge IN reactions
                FILTER edge._to == '${id}' && edge.$label == 'reacts' && edge.likes == 0
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


exports.collaborativeFiltering = async (req, res) => {
    const { userId, type } = req.params;
    try {
        const query = `
            FOR movie, edge IN 1..1 OUTBOUND @userId @reactions
                LET userA_likes = TO_NUMBER(edge.likes)
                FOR userB, edge2 IN 1..1 INBOUND movie reactions
                    FILTER userB._id != @userId
                    LET userB_likes = TO_NUMBER(edge2.likes)
                    COLLECT userids = userB INTO g KEEP userB_likes, userA_likes

                    LET cos_sim = COSINE_SIMILARITY(g[*].userA_likes, g[*].userB_likes)
                    SORT cos_sim DESC LIMIT 4
                    LET recommended = (
                        FOR entity, e IN 1..1 OUTBOUND userids._id reactions
                            FILTER e.likes == 1 AND
                            entity NOT IN (FOR v IN 1..1 OUTBOUND @userId reactions RETURN v) AND
                            entity.type == @type
                            SORT LENGTH(FOR a IN 1..1 INBOUND entity reactions FILTER TO_NUMBER(a.likes) == 1 RETURN a) DESC
                            LIMIT 3
                            RETURN DISTINCT entity
                        )
                RETURN {
                    similarUserIds: userids,
                    cosine_similarity: cos_sim,
                    userA_likes: g[*].userA_likes,
                    userB_likes: g[*].userB_likes,
                    recommended: recommended
                }
        `;

        const cursor = await db.query(query, { userId: userId, reactions: "reactions", type: type });

        const entities = await cursor.all();
        if (!entities) {
            return res.status(404).json({ error: 'Entities not found' });
        }
        const uniqueEntityIds = new Set();
        const uniqueRecommended = [];
        entities.forEach(result => {
            // remove duplicate
            result.recommended.forEach(recommendedEntity => {
                const entityId = recommendedEntity._id;
                if (!uniqueEntityIds.has(entityId)) {
                    uniqueEntityIds.add(entityId);
                    uniqueRecommended.push(recommendedEntity);
                }
            });
        });
        const users = entities.flatMap(result => result.similarUserIds);


        res.status(200).json({ recommended: uniqueRecommended,  users: users});
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.mostLikesDifference = async (req, res) => {
    const { type } = req.params;

    try {
        const query = `
            FOR entity IN imdb_vertices
                FILTER entity.type == @type
                LET likesOne = LENGTH(FOR v, e IN 1..1 INBOUND entity reactions FILTER e.likes == 1 RETURN v)
                LET likesZero = LENGTH(FOR v, e IN 1..1 INBOUND entity reactions FILTER e.likes == 0 RETURN v)
                LET difference = likesOne - likesZero
                SORT difference DESC
                LIMIT 25
                RETURN entity
        `;

        const cursor = await db.query(query, { type: type });
        const entities = await cursor.all();
        
        res.status(200).json({ entitiesWithMostLikesDifference: entities });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: error.message });
    }
};
