const controller = require('../controllers/movies');
const express = require('express');
const router = express.Router();

router.get('/', controller.getMovies);
router.get('/:id', controller.getMovie);
router.get('/:id/actors', controller.getMovieActors);
router.get('/:id/directors', controller.getMovieDirectors);
router.get('/:id/comment', controller.getComment);
router.post('/:id/comment', controller.postComment);
router.get('/:id/like', controller.getLikeStatus);
router.post('/:id/like', controller.postLike);


module.exports = router; 
