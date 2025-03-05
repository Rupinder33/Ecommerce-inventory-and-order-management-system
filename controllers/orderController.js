import express from 'express';
import pool from '../config/db.js';

const router = express.Router();
// Orders Controller
export const placeOrder = async (req, res) => {
  const { userId, items } = req.body;
  try {
    const [orderResult] = await pool.query('INSERT INTO orders (user_id, status) VALUES (?, ?)', [userId, 'pending']);
    const orderId = orderResult.insertId;
    for (const item of items) {
      await pool.query(
        'INSERT INTO order_details (order_id, product_id, quantity, subtotal) VALUES (?, ?, ?, ?)',
        [orderId, item.productId, item.quantity, item.subtotal]
      );
    }
    res.status(201).json({ message: 'Order placed successfully', orderId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};  

export const getOrdersByUser = async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders WHERE user_id = ?', [req.params.userId]);
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  try {
    const [result] = await pool.query('UPDATE orders SET status = ? WHERE order_id = ?', [status, orderId]);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Order status updated successfully' });
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
      const [orders] = await pool.query('SELECT * FROM orders');
      res.render('orders', { orders });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

