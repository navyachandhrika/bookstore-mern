/**
 * routes/bookRoutes.js - Book CRUD + review endpoints.
 */
import { Router } from 'express';
import { body } from 'express-validator';
import {
  getBooks, getBookById, createBook, updateBook, deleteBook,
  getBookReviews, addReview,
} from '../controllers/bookController.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import validate from '../middleware/validate.js';

const router = Router();

const bookRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('author').trim().notEmpty().withMessage('Author is required'),
  body('genre').trim().notEmpty().withMessage('Genre is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
];

const reviewRules = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().isLength({ min: 5 }).withMessage('Comment must be at least 5 characters'),
];

// ─── Book routes ──────────────────────────────────────────────────────────────
router.get('/',    getBooks);
router.get('/:id', getBookById);
router.post('/',   auth, admin, bookRules, validate, createBook);
router.put('/:id', auth, admin, updateBook);
router.delete('/:id', auth, admin, deleteBook);

// ─── Review sub-routes ────────────────────────────────────────────────────────
router.get('/:id/reviews',  getBookReviews);
router.post('/:id/reviews', auth, reviewRules, validate, addReview);

export default router;
