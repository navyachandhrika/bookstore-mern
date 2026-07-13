/**
 * routes/orderRoutes.js - Order placement, user history, and admin management.
 */
import { Router } from 'express';
import {
  placeOrder, getMyOrders, getAllOrders, updateOrderStatus,
} from '../controllers/orderController.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = Router();

router.use(auth); // All order routes require authentication

router.post('/',             placeOrder);
router.get('/my-orders',     getMyOrders);
router.get('/',              admin, getAllOrders);         // Admin only
router.put('/:id/status',    admin, updateOrderStatus);   // Admin only

export default router;
