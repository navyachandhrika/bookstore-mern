/**
 * controllers/authController.js - Handles user registration, login, and profile.
 */
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { createError } from '../middleware/errorHandler.js';

// ─── Helper: Generate JWT ─────────────────────────────────────────────────────
const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ─── @route  POST /api/auth/register ─────────────────────────────────────────
// ─── @access Public ───────────────────────────────────────────────────────────
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError('An account with this email already exists.', 409));
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route  POST /api/auth/login ────────────────────────────────────────────
// ─── @access Public ───────────────────────────────────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Must explicitly select password field (it's excluded by default)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(createError('Invalid email or password.', 401));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(createError('Invalid email or password.', 401));
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route  GET /api/auth/me ─────────────────────────────────────────────────
// ─── @access Private ──────────────────────────────────────────────────────────
export const getMe = async (req, res, next) => {
  try {
    // req.user is already populated by the auth middleware
    const user = await User.findById(req.user._id);
    if (!user) return next(createError('User not found.', 404));

    res.json({
      id:        user._id,
      name:      user.name,
      email:     user.email,
      role:      user.role,
      createdAt: user.createdAt,
    });
  } catch (error) {
    next(error);
  }
};
