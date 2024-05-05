const controller = require('../controllers/user');
const express = require('express');
const router = express.Router();

router.get('/:id', controller.getUser);


module.exports = router; 
