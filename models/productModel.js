import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

// Products Model
export const getAllProducts = async () => {
  const [rows] = await pool.query('SELECT * FROM products');
  return rows;
};

export const getProductById = async (productId) => {
  const [rows] = await pool.query('SELECT * FROM products WHERE product_id = ?', [productId]);
  return rows[0];
};

export const addProduct = async (name, description, categoryId, price, stockQuantity, updatedByAdminId) => {
  const [result] = await pool.query(
    'INSERT INTO products (name, description, category_id, price, stock_quantity, updated_by_admin_id) VALUES (?, ?, ?, ?, ?, ?)',
    [name, description, categoryId, price, stockQuantity, updatedByAdminId]
  );
  return result.insertId;
};

export const updateProduct = async (productId, name, description, categoryId, price, stockQuantity, updatedByAdminId) => {
  const [result] = await pool.query(
    'UPDATE products SET name = ?, description = ?, category_id = ?, price = ?, stock_quantity = ?, updated_by_admin_id = ? WHERE product_id = ?',
    [name, description, categoryId, price, stockQuantity, updatedByAdminId, productId]
  );
  return result.affectedRows;
};

export const deleteProduct = async (productId) => {
  const [result] = await pool.query('DELETE FROM products WHERE product_id = ?', [productId]);
  return result.affectedRows;
};
