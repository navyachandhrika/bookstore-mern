/**
 * controllers/cartController.js - Shopping cart management for authenticated users.
 * Supports add, update quantity, remove item, clear, and fetch.
 */
import Cart from '../models/Cart.js';
import Book from '../models/Book.js';
import { createError } from '../middleware/errorHandler.js';

// ─── Helper: Populate and return cart ────────────────────────────────────────
const getPopulatedCart = (userId) =>
  Cart.findOne({ user: userId }).populate({
    path: 'items.book',
    select: 'title author price coverImageUrl stock',
  });

// ─── @route  GET /api/cart ────────────────────────────────────────────────────
// ─── @access Private ──────────────────────────────────────────────────────────
export const getCart = async (req, res, next) => {
  try {
    const cart = await getPopulatedCart(req.user._id);
    res.json(cart || { user: req.user._id, items: [] });
  } catch (error) {
    next(error);
  }
};

// ─── @route  POST /api/cart ───────────────────────────────────────────────────
// @body { bookId, quantity }
// ─── @access Private ──────────────────────────────────────────────────────────
export const addToCart = async (req, res, next) => {
  try {
    const { bookId, quantity = 1 } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return next(createError('Book not found.', 404));
    if (book.stock < quantity) {
      return next(createError(`Only ${book.stock} copies available.`, 400));
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      // Create new cart
      cart = await Cart.create({ user: req.user._id, items: [{ book: bookId, quantity }] });
    } else {
      const existingItem = cart.items.find((i) => i.book.toString() === bookId);
      if (existingItem) {
        const newQty = existingItem.quantity + quantity;
        if (newQty > book.stock) {
          return next(createError(`Only ${book.stock} copies available.`, 400));
        }
        existingItem.quantity = newQty;
      } else {
        cart.items.push({ book: bookId, quantity });
      }
      await cart.save();
    }

    const populatedCart = await getPopulatedCart(req.user._id);
    res.json({ message: 'Added to cart.', cart: populatedCart });
  } catch (error) {
    next(error);
  }
};

// ─── @route  PUT /api/cart ────────────────────────────────────────────────────
// @body { bookId, quantity }
// ─── @access Private ──────────────────────────────────────────────────────────
export const updateCartItem = async (req, res, next) => {
  try {
    const { bookId, quantity } = req.body;

    if (quantity < 1) return next(createError('Quantity must be at least 1.', 400));

    const book = await Book.findById(bookId);
    if (!book) return next(createError('Book not found.', 404));
    if (quantity > book.stock) {
      return next(createError(`Only ${book.stock} copies available.`, 400));
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return next(createError('Cart not found.', 404));

    const item = cart.items.find((i) => i.book.toString() === bookId);
    if (!item) return next(createError('Item not in cart.', 404));

    item.quantity = quantity;
    await cart.save();

    const populatedCart = await getPopulatedCart(req.user._id);
    res.json({ message: 'Cart updated.', cart: populatedCart });
  } catch (error) {
    next(error);
  }
};

// ─── @route  DELETE /api/cart/:bookId ─────────────────────────────────────────
// ─── @access Private ──────────────────────────────────────────────────────────
export const removeCartItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return next(createError('Cart not found.', 404));

    cart.items = cart.items.filter((i) => i.book.toString() !== req.params.bookId);
    await cart.save();

    const populatedCart = await getPopulatedCart(req.user._id);
    res.json({ message: 'Item removed from cart.', cart: populatedCart });
  } catch (error) {
    next(error);
  }
};

// ─── @route  DELETE /api/cart ────────────────────────────────────────────────
// ─── @access Private ──────────────────────────────────────────────────────────
export const clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] },
      { new: true }
    );
    res.json({ message: 'Cart cleared.' });
  } catch (error) {
    next(error);
  }
};
