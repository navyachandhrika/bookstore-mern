/**
 * controllers/orderController.js - Order placement, user order history, and admin management.
 * On order creation: decrements book stock, clears user cart, creates snapshot items.
 */
import Order from '../models/Order.js';
import Book from '../models/Book.js';
import Cart from '../models/Cart.js';
import { createError } from '../middleware/errorHandler.js';

// ─── @route  POST /api/orders ─────────────────────────────────────────────────
// ─── @access Private ──────────────────────────────────────────────────────────
export const placeOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod = 'Card', paymentInfo = {} } = req.body;

    // Load cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.book');
    if (!cart || cart.items.length === 0) {
      return next(createError('Cart is empty. Cannot place an order.', 400));
    }

    // Build order items (snapshot) and validate stock
    let totalPrice = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const book = item.book;
      if (!book) continue;

      if (book.stock < item.quantity) {
        return next(
          createError(`Insufficient stock for "${book.title}". Only ${book.stock} left.`, 400)
        );
      }

      orderItems.push({
        book:          book._id,
        title:         book.title,
        coverImageUrl: book.coverImageUrl,
        price:         book.price,
        quantity:      item.quantity,
      });

      totalPrice += book.price * item.quantity;

      // Decrement stock
      await Book.findByIdAndUpdate(book._id, { $inc: { stock: -item.quantity } });
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalPrice: parseFloat(totalPrice.toFixed(2)),
      shippingAddress,
      paymentMethod,
      paymentInfo,
      status: 'Paid', // Assume payment succeeds for this demo
    });

    // Clear the user's cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json({ message: 'Order placed successfully!', order });
  } catch (error) {
    next(error);
  }
};

// ─── @route  GET /api/orders/my-orders ───────────────────────────────────────
// ─── @access Private ──────────────────────────────────────────────────────────
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// ─── @route  GET /api/orders ─────────────────────────────────────────────────
// ─── @access Admin ────────────────────────────────────────────────────────────
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// ─── @route  PUT /api/orders/:id/status ──────────────────────────────────────
// ─── @access Admin ────────────────────────────────────────────────────────────
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return next(createError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400));
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email');

    if (!order) return next(createError('Order not found.', 404));

    res.json({ message: 'Order status updated.', order });
  } catch (error) {
    next(error);
  }
};
