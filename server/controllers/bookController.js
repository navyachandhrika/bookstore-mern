/**
 * controllers/bookController.js - CRUD for books, with filters, pagination,
 * and review management (add review, recalculate rating).
 */
import Book from '../models/Book.js';
import Review from '../models/Review.js';
import { createError } from '../middleware/errorHandler.js';

// ─── @route  GET /api/books ───────────────────────────────────────────────────
// ─── @access Public ───────────────────────────────────────────────────────────
export const getBooks = async (req, res, next) => {
  try {
    const {
      search, genre, author, language,
      minPrice, maxPrice,
      sort = '-createdAt',
      page = 1, limit = 12,
      featured,
    } = req.query;

    const query = {};

    // Full-text search on title, author, description
    if (search) {
      query.$text = { $search: search };
    }

    if (genre)    query.genre    = { $regex: genre,    $options: 'i' };
    if (author)   query.author   = { $regex: author,   $options: 'i' };
    if (language) query.language = { $regex: language, $options: 'i' };
    if (featured) query.featured = true;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const skip     = (Number(page) - 1) * Number(limit);
    const total    = await Book.countDocuments(query);
    const books    = await Book.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .select('-reviews'); // Omit heavy reviews array from list

    res.json({
      books,
      pagination: {
        total,
        page:       Number(page),
        limit:      Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route  GET /api/books/:id ───────────────────────────────────────────────
// ─── @access Public ───────────────────────────────────────────────────────────
export const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate({
      path: 'reviews',
      options: { sort: { createdAt: -1 }, limit: 20 },
    });

    if (!book) return next(createError('Book not found.', 404));
    res.json(book);
  } catch (error) {
    next(error);
  }
};

// ─── @route  POST /api/books ──────────────────────────────────────────────────
// ─── @access Admin ────────────────────────────────────────────────────────────
export const createBook = async (req, res, next) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({ message: 'Book created successfully.', book });
  } catch (error) {
    next(error);
  }
};

// ─── @route  PUT /api/books/:id ───────────────────────────────────────────────
// ─── @access Admin ────────────────────────────────────────────────────────────
export const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) return next(createError('Book not found.', 404));
    res.json({ message: 'Book updated successfully.', book });
  } catch (error) {
    next(error);
  }
};

// ─── @route  DELETE /api/books/:id ────────────────────────────────────────────
// ─── @access Admin ────────────────────────────────────────────────────────────
export const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return next(createError('Book not found.', 404));

    // Clean up orphaned reviews
    await Review.deleteMany({ book: req.params.id });

    res.json({ message: 'Book deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// ─── @route  GET /api/books/:id/reviews ──────────────────────────────────────
// ─── @access Public ───────────────────────────────────────────────────────────
export const getBookReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ book: req.params.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// ─── @route  POST /api/books/:id/reviews ─────────────────────────────────────
// ─── @access Private (authenticated users) ────────────────────────────────────
export const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const bookId = req.params.id;

    const book = await Book.findById(bookId);
    if (!book) return next(createError('Book not found.', 404));

    // One review per user per book
    const alreadyReviewed = await Review.findOne({ user: req.user._id, book: bookId });
    if (alreadyReviewed) {
      return next(createError('You have already reviewed this book.', 409));
    }

    const review = await Review.create({
      user:     req.user._id,
      userName: req.user.name,
      book:     bookId,
      rating:   Number(rating),
      comment,
    });

    // Push reference and recalculate average rating
    book.reviews.push(review._id);
    book.numReviews = book.reviews.length;

    const allReviews = await Review.find({ book: bookId });
    book.rating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await book.save();

    res.status(201).json({ message: 'Review submitted successfully.', review });
  } catch (error) {
    next(error);
  }
};
