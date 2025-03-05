import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

// Shopping Cart Model
export const addToCart = async (userId, productId, quantity) => {
  const [result] = await pool.query('INSERT INTO shoppingcart (user_id, product_id, quantity) VALUES (?, ?, ?)', [userId, productId, quantity]);
  return result.insertId;
};

export const getCartItems = async (userId) => {
  const [rows] = await pool.query('SELECT * FROM shoppingcart WHERE user_id = ?', [userId]);
  return rows;
};

export const removeFromCart = async (cartId) => {
  const [result] = await pool.query('DELETE FROM shoppingcart WHERE cart_id = ?', [cartId]);
  return result.affectedRows;
};

export const clearCart = async (userId) => {
  const [result] = await pool.query('DELETE FROM shoppingcart WHERE user_id = ?', [userId]);
  return result.affectedRows;
};
