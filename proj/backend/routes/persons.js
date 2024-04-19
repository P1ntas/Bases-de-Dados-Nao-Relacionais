const controller = require('../controllers/persons');
const express = require('express');
const router = express.Router();

router.get('/:id', controller.getPerson);


module.exports = router; 
