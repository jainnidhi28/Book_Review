const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { updateReview, deleteReview } = require('../controllers/reviewController');

// Update your own review
router.put('/:id', auth, updateReview);

// Delete your own review
router.delete('/:id', auth, deleteReview);

module.exports = router;
