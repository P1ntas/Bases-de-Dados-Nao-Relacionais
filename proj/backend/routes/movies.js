const controller = require('../controllers/movies');
const express = require('express');
const router = express.Router();

router.get('/', controller.getMovies);
router.get('/:id', controller.getMovie);
router.get('/search/:input', controller.searchMovie);
router.get('/similar/:movieId', controller.similarMovies);
router.get('/actorsInCommon/:movieId', controller.moviesWithActorsInCommon);
router.get('/:id/actors', controller.getMovieActors);
router.get('/:id/directors', controller.getMovieDirectors);
router.get('/:id/comment', controller.getComments);
router.post('/:id/comment', controller.postComment);
router.get('/:id/react/:userId', controller.getLikeStatus);
router.post('/:id/react/:userId', controller.postLike);
router.delete('/:id/react/:userId', controller.deleteReaction);
router.get('/:id/genre', controller.getMovieGenre);


module.exports = router; 
