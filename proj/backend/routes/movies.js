const controller = require('../controllers/movies');
const express = require('express');
const router = express.Router();

router.get('/:id', controller.getMovie);
