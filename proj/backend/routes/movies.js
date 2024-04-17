const controller = require('../controllers/movies');
const express = require('express');
const router = express.Router();

router.get('/', controller.getMovies);
router.get('/:id', controller.getMovie);
router.get('/:id/actors', controller.getMovieActors);
router.get('/:id/comment', controller.getComment);
router.post('/:id/comment', controller.postComment);


module.exports = router; 
