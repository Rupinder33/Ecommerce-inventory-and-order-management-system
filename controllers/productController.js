import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// Products Controller

export const getAllProducts = async (req, res) => {
  try {
    console.log("===============> Calling me to get all products");
    const [products] = await pool.query('SELECT * FROM products');

    const formattedProducts = products.map(product => ({
      ...product,
      price: Number(product.price),
      stock_quantity: Number(product.stock_quantity)
    }));

    // Get data from shopping carts
    const [shoppingCarts] = await pool.query(`
      SELECT 
        u.name AS userfullname, 
        shcart.cart_id,  
        shcart.quantity, 
        products.name AS productname, 
        products.price, 
        shcart.added_at 
      FROM shoppingcart AS shcart 
      INNER JOIN users AS u ON shcart.user_id = u.user_id 
      INNER JOIN products ON shcart.product_id = products.product_id
    `);

    // Format shopping cart data and calculate total price
    const formattedShoppingCarts = shoppingCarts.map(shoppingCart => ({
      ...shoppingCart,
      price: Number(shoppingCart.price), // Convert price to a number
      quantity: Number(shoppingCart.quantity), // Ensure quantity is a number
      total: Number(shoppingCart.price) * Number(shoppingCart.quantity) // Calculate total price
    }));

    console.log("===> Data returned now ", formattedShoppingCarts);

    res.render('products/index', {
      products: formattedProducts.length ? formattedProducts : [],
      shoppingcarts: formattedShoppingCarts.length ? formattedShoppingCarts : []
    });
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ error: error.message });
  }
};


export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const [product] = await pool.query('SELECT * FROM products WHERE product_id = ?', [id]);

    if (!product || product.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.render('products/detail', { product: product[0] });
  } catch (error) {
    console.error('Error fetching product by ID:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Add this new controller for edit page
export const renderEditPage = async (req, res) => {
  try {
    const { id } = req.params;
    const [product] = await pool.query('SELECT * FROM products WHERE product_id = ?', [id]);

    if (!product || product.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.render('products/edit', { product: product[0] });
  } catch (error) {
    console.error('Error rendering edit page:', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const addProduct = async (req, res) => {
  console.log("calling me to add products");
  const { name, description, categoryId, price, stockQuantity } = req.body;
  console.log(req.body);
  let updatedByAdminId = "1";

  if (!name || !description || !categoryId || !price || !stockQuantity) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    await pool.query(
      'INSERT INTO products (name, description, category_id, price, stock_quantity, updated_by_admin_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, categoryId, price, stockQuantity, updatedByAdminId]
    );

    res.redirect('/products'); // Changed to redirect
  } catch (error) {
    console.error('Error adding product:', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, categoryId, price, stockQuantity, updatedByAdminId } = req.body;

  try {
    // Fetch the current product to get the current stock_quantity
    const [product] = await pool.query(
      'SELECT stock_quantity FROM products WHERE product_id = ?',
      [id]
    );

    if (product.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // If stockQuantity is not provided, use the existing one from the database
    const finalStockQuantity = stockQuantity !== undefined ? stockQuantity : product[0].stock_quantity;

    // Perform the update
    const [result] = await pool.query(
      'UPDATE products SET name = ?, description = ?, category_id = ?, price = ?, stock_quantity = ?, updated_by_admin_id = ? WHERE product_id = ?',
      [name, description, categoryId, price, finalStockQuantity, updatedByAdminId, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.redirect('/products');
  } catch (error) {
    console.error('Error updating product:', error.message);
    res.status(500).json({ error: error.message });
  }
};


export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM products WHERE product_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.redirect('/products');
  } catch (error) {
    console.error('Error deleting product:', error.message);
    res.status(500).json({ error: error.message });
  }
};