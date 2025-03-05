import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

// Orders Model
export const createOrder = async (userId) => {
  const [result] = await pool.query('INSERT INTO orders (user_id, status) VALUES (?, ?)', [userId, 'pending']);
  return result.insertId;
};

export const addOrderDetails = async (orderId, productId, quantity, subtotal) => {
  const [result] = await pool.query('INSERT INTO order_details (order_id, product_id, quantity, subtotal) VALUES (?, ?, ?, ?)', [orderId, productId, quantity, subtotal]);
  return result.insertId;
};

export const getOrdersByUser = async (userId) => {
  const [rows] = await pool.query('SELECT * FROM orders WHERE user_id = ?', [userId]);
  return rows;
};

export const getAllOrders = async () => {
  const [rows] = await pool.query('SELECT * FROM orders');
  return rows;
};

export const updateOrderStatus = async (orderId, status) => {
  const [result] = await pool.query('UPDATE orders SET status = ? WHERE order_id = ?', [status, orderId]);
  return result.affectedRows;
};
