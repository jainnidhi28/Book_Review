const Book = require('../models/Book');
const Review = require('../models/Review');
const mongoose = require('mongoose');

// POST /books - Add a new book
exports.addBook = async (req, res) => {
  try {
    const { title, author, genre, description } = req.body;
    if (!title || !author) {
      return res.status(400).json({ message: 'Title and author are required' });
    }
    const book = new Book({ title, author, genre, description });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /books - Get all books (pagination, filter by author/genre)
exports.getBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, author, genre } = req.query;
    const filter = {};
    if (author) filter.author = new RegExp(author, 'i');
    if (genre) filter.genre = new RegExp(genre, 'i');
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

// GET /books/:id - Get book details by ID (average rating, reviews with pagination)
exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewPage = 1, reviewLimit = 5 } = req.query;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }
    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    // Get reviews for this book
    const reviews = await Review.find({ book: id })
      .populate('user', 'username')
      .skip((reviewPage - 1) * reviewLimit)
      .limit(Number(reviewLimit));
    // Calculate average rating
    const avgResult = await Review.aggregate([
      { $match: { book: new mongoose.Types.ObjectId(id) } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    const avgRating = avgResult.length ? avgResult[0].avgRating : null;
    const totalReviews = await Review.countDocuments({ book: id });
    res.json({
      book,
      averageRating: avgRating,
      reviews,
      reviewPage: Number(reviewPage),
      totalReviewPages: Math.ceil(totalReviews / reviewLimit),
      totalReviews,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /books/:id/reviews - Add a review (auth, one per user per book)
exports.addReviewToBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }
    if (!rating) {
      return res.status(400).json({ message: 'Rating is required' });
    }
    // Check if user already reviewed
    const existing = await Review.findOne({ book: id, user: req.user.id });
    if (existing) {
      return res.status(409).json({ message: 'You have already reviewed this book' });
    }
    const review = new Review({
      book: id,
      user: req.user.id,
      rating,
      comment
    });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'You have already reviewed this book' });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
