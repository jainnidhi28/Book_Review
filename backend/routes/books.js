const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  addBook,
  getBooks,
  getBookById,
  addReviewToBook
} = require('../controllers/bookController');

// Add a new book (auth required)
router.post('/', auth, addBook);

// Get all books (with pagination and filters)
router.get('/', getBooks);

// Get book details by ID (with avg rating and reviews)
router.get('/:id', getBookById);

// Add a review to a book (auth required)
router.post('/:id/reviews', auth, addReviewToBook);

module.exports = router;
