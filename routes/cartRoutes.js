import express from 'express';
import {
  addToCart,
  viewCart,
  removeItemFromCart,
  clearUserCart,
} from '../controllers/cartController.js';

const isAuthenticated = (req, res, next) => {
  console.log("calling middle ware", req.session.user);
  if (req.session.user !== null && req.session.role !== 'admin') {
    console.log("this customer");
    return next(); // Redirect to login if not authenticated
  }
  return res.status(403).json({ error: 'User not logged in' });
};

const router = express.Router();

// Ensure session cart is initialized
router.use((req, res, next) => {
  if (!req.session.cartItems) {
    req.session.cartItems = [];  // Initialize empty cart if undefined
  }
  next();
});

//  Add item to cart (Session-based)
router.post('/addproduct', isAuthenticated, addToCart);

router.post('/add', addToCart);

//  View cart (Session-based)
router.get('/', viewCart);

//  Remove item from cart
router.delete('/remove/:cartId', removeItemFromCart);

//  Clear entire cart
router.delete('/clear', clearUserCart);

export default router;
