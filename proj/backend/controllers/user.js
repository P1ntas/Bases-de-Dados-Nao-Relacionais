const db = require('../database');


exports.getUser = async (req, res) => {
    const { id } = req.params;

    try {
        const cursor = await db.query(`
          FOR user IN Users
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
// TODO: change the collection to a new, Interactions
exports.getFollowers = async (req, res) => {
  const { id } = req.params;

  try {
      const cursor = await db.query(`
        FOR edge IN imdb_edges
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
        FOR edge IN imdb_edges
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
          } INTO imdb_edges
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
      FOR edge IN imdb_edges
      FILTER edge._from == @followerId && edge._to == @userId && edge.$label == "follows"
      REMOVE { _key: edge._key } IN imdb_edges
    `;
    const bindVars = { followerId, userId };
    await db.query(query, bindVars);
    res.status(200).json({ message: 'Unfollow successful' });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: error.message });
  }
};
