const controller = require('../controllers/auth');
const express = require('express');
const router = express.Router();

router.post('/login', controller.login);
router.post('/register', controller.register);


module.exports = router; 
