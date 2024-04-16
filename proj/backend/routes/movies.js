const controller = require('../controllers/movies');
const express = require('express');
const router = express.Router();

router.get('/', controller.getMovies);
router.get('/:id', controller.getMovie);
router.get('/:id/actors', controller.getMovieActors);
router.get('/:id/comment', controller.getMovie);


module.exports = router; 
