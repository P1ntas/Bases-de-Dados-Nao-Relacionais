const controller = require('../controllers/person');
const express = require('express');
const router = express.Router();

router.get('/:id', controller.getPerson);
router.get('/:id/acted_movies', controller.getActorMovies);
router.get('/:id/directed_movies', controller.getDirectorMovies);


module.exports = router; 
