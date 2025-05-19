const Book = require('../models/Book');

// GET /search?query=... - Search books by title or author (partial, case-insensitive)
exports.searchBooks = async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;
    if (!query) return res.status(400).json({ message: 'Query parameter required' });
    const regex = new RegExp(query, 'i');
    const filter = { $or: [ { title: regex }, { author: regex } ] };
    const books = await Book.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Book.countDocuments(filter);
    res.json({
      books,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
