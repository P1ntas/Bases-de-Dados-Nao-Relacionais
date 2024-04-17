const db = require('../database');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, password, email } = req.body;
    try {
        // Check if username already exists
        const existingUser = await db.query(`
          FOR user IN Users
          FILTER user.username == @username
          RETURN user
        `, { username });
    
        if (await existingUser.next()) {
          return res.status(400).json({ success: false, message: 'Username already exists' });
        }
    
        // Insert new user
        const newUser = await db.query(`
          INSERT {
            username: @username,
            password: @password,
            email: @email
          } INTO Users
          RETURN NEW
        `, { username, password, email });
    
        res.json({ success: true, message: 'Registration successful' });
      } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const cursor = await db.query(`
          FOR user IN Users
          FILTER user.username == @username && user.password == @password
          RETURN user
        `, { username, password });
    
        const user = await cursor.next();
        if (user) {
          const token = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
          console.log(username)

          res.status(200).json({ success: true, message: 'Login successful', token: token});
        } else {
          res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
      } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Error during login' });
      }
};