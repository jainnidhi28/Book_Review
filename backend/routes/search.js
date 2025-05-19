const express = require('express');
const router = express.Router();
const { searchBooks } = require('../controllers/searchController');

// GET /search - Search books by title or author (partial, case-insensitive)
router.get('/', searchBooks);

module.exports = router;
