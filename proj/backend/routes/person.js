const controller = require('../controllers/person');
const express = require('express');
const router = express.Router();

router.get('/', controller.getPeople);
router.get('/:id', controller.getPerson);
router.get('/:id/acted_movies', controller.getActorMovies);
router.get('/:id/directed_movies', controller.getDirectorMovies);
router.get('/search/:input', controller.searchPerson);

module.exports = router; 
