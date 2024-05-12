const controller = require('../controllers/entity');
const express = require('express');
const router = express.Router();

router.get('/:id/react/:userId', controller.getLikeStatus);
router.post('/:id/react/:userId', controller.postLike);
router.delete('/:id/react/:userId', controller.deleteReaction);
router.get('/:id/reactions', controller.getLikeDislikeCount);
router.get('/recommend/:userId/:type', controller.collaborativeFiltering);
router.get('/mostLikes/:type', controller.mostLikesDifference);



module.exports = router; 
