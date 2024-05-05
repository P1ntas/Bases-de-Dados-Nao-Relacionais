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
          res.status(200).json({ success: true, message: 'Login successful', user: user});
        } else {
          res.status(404).json({ success: false, message: 'Not found' });
        }
      } catch (error) {
        res.status(500).json({ success: false, message: 'Error during login' });
      }
};