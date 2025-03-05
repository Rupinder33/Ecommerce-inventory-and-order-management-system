import express from 'express';
import {
  placeOrder,
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';

const router = express.Router();

// Place a new order
router.post('/place', placeOrder);

// Get all orders for a specific user
router.get('/user/:userId', getOrdersByUser);

// Get all orders (Admin only)
router.get('/all', getAllOrders);

// Update order status (Admin only)
router.put('/status/:orderId', updateOrderStatus);

export default router;