const db = require('../database');

exports.getUsers = async (req, res) => {
  try {
      const query = `
      FOR doc IN users
      RETURN doc
      `;

      const cursor = await db.query(query);
      const users = await cursor.all();
      res.status(200).json(users);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

exports.getUser = async (req, res) => {
    const { id } = req.params;

    try {
        const cursor = await db.query(`
          FOR user IN users
          FILTER user._id == @id
          RETURN user
        `, { id });
    
        const user = await cursor.next();
        if (user) {
          res.status(200).json({user: user});
        } else {
          res.status(404).json({ success: false, message: 'Not found' });
        }
      } catch (error) {
        res.status(500).json({ success: false, message: 'Error during login' });
      }
};
exports.getFollowers = async (req, res) => {
  const { id } = req.params;

  try {
      const cursor = await db.query(`
        FOR edge IN follows
        FILTER edge._to == @id && edge.$label == 'follows'
          RETURN DOCUMENT(edge._from)
      `, { id });
  
      const followers = await cursor.all();;
      if (followers) {
        res.status(200).json({followers: followers});
      } else {
        res.status(404).json({ success: false, message: 'Not found' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error during login' });
    }
};

exports.getFollowing = async (req, res) => {
  const { id } = req.params;

  try {
      const cursor = await db.query(`
        FOR edge IN follows
        FILTER edge._from == @id && edge.$label == 'follows'
          RETURN DOCUMENT(edge._to)
      `, { id });
  
      const following = await cursor.all();
      if (following) {
        res.status(200).json({following: following});
      } else {
        res.status(404).json({ success: false, message: 'Not found' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error during login' });
    }
};

exports.follow = async (req, res) => {
  const { followerId, userId } = req.body;
  try {
      const query = `
          INSERT {
              "_from": @followerId,
              "_to": @userId,
              "$label": "follows"
          } INTO follows
      `;
      await db.query(query, { followerId, userId });

      res.status(201).json({ message: 'Follow successful' });
  } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: error.message });
  }
};

exports.unfollow = async (req, res) => {
  const { followerId, userId } = req.body;
  try {
    const query = `
      FOR edge IN follows
      FILTER edge._from == @followerId && edge._to == @userId && edge.$label == "follows"
      REMOVE { _key: edge._key } IN follows
    `;
    const bindVars = { followerId, userId };
    await db.query(query, bindVars);
    res.status(200).json({ message: 'Unfollow successful' });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.searchUser = async (req, res) => {
  const { input } = req.params;
  try {
      const query = `
          FOR d IN userView 
          SEARCH ANALYZER(
            (d.name IN TOKENS('${input}', 'name_analyzer')) OR
            (d.username IN TOKENS('${input}', 'name_analyzer')), 'name_analyzer')
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

exports.getTimeline = async (req, res) => {
  const { id } = req.params;
  const { page } = req.query;
  const pageSize = 30; // Adjust the page size as per your requirement

  try {
    const query = `
      FOR user IN users
        FILTER user._id == @id
        LET following = (
          FOR followingUser IN 1..1 OUTBOUND user follows
          RETURN followingUser._key
        )
        LET activities = (
          FOR followingUser IN users
            FILTER followingUser._key IN following
            LET reactions = (
              FOR reaction IN reactions
              FILTER reaction._from == followingUser._id
              RETURN { action: 'reaction', userId: followingUser._key, username: followingUser.username, movieId: reaction._to, likes: reaction.likes, timestamp: reaction.timestamp }
            )
            LET comments = (
              FOR comment IN comments
              FILTER comment._from == followingUser._id
              RETURN { action: 'comment', userId: followingUser._key, username: followingUser.username, movieId: comment._to, content: comment.content, timestamp: comment.timestamp }
            )
            RETURN APPEND(reactions, comments)
        )
        LET sortedActivities = (
          FOR activity IN FLATTEN(activities) SORT activity.timestamp DESC RETURN activity
        )
        LET paginatedActivities = SLICE(sortedActivities, ${(page - 1) * pageSize}, ${page * pageSize})
        LET activitiesWithVerticesInfo = (
          FOR activity IN paginatedActivities
            LET vertexInfo = DOCUMENT(activity.movieId)
            RETURN MERGE(activity, { vertexType: vertexInfo.type, vertexLabel: vertexInfo.label })
        )
        RETURN { totalDocs: LENGTH(sortedActivities), activities: activitiesWithVerticesInfo }
    `;

    const cursor = await db.query(query, { id });
    const activities = await cursor.all();
    res.status(200).json(activities);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: error.message });
  }
};

