/**
 * routes/cartRoutes.js - Shopping cart endpoints (all protected).
 */
import { Router } from 'express';
import {
  getCart, addToCart, updateCartItem, removeCartItem, clearCart,
} from '../controllers/cartController.js';
import auth from '../middleware/auth.js';

const router = Router();

// All cart routes require authentication
router.use(auth);

router.get('/',           getCart);
router.post('/',          addToCart);
router.put('/',           updateCartItem);
router.delete('/:bookId', removeCartItem);
router.delete('/',        clearCart);

export default router;
