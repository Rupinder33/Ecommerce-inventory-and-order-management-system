import express from 'express';
import pool from '../config/db.js';

const router = express.Router();



// //  Add item to cart (Database-based)
// export const addToCart = async (req, res) => {
//   const userId = req.session.currentuserid;
//   if (!userId) {
//     return res.status(401).json({ error: "User not logged in" });
//   }

//   let { quantity, product_id } = req.body;
//   console.log("Received body:", req.body); // Debugging log
//   console.log("Received quantity:", quantity);
//   console.log("Received product_id:", product_id);

//   if (!quantity || isNaN(parseInt(quantity, 10)) || parseInt(quantity, 10) <= 0) {
//     return res.status(400).json({ error: "Invalid quantity value" });
//   }

//   try {
//     await pool.query(
//       'INSERT INTO shoppingcart (user_id, product_id, quantity) VALUES (?, ?, ?)',
//       [userId, product_id, parseInt(quantity, 10)]
//     );
//     res.redirect('/products');
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// import { pool } from '../config/db.js'; // Ensure correct database connection

export const addToCart = async (req, res) => {
  console.log("calling to add to cart");
  const { product_id, stockQuantity } = req.body;
  try {
    // Log the incoming data for debugging purposes
    console.log(req.body);
    let updatedByAdminId = "1";
    let user_id = req.session.currentuserid;



    if (!product_id || !stockQuantity) {
      return res.status(400).json({ error: 'all fields are required' });
    }
    try {
      await pool.query(
        'INSERT INTO shoppingcart (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [user_id, product_id, stockQuantity]
      );

      return res.redirect('/products'); // Return to prevent further execution
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: error.message });
    }



    // // Check if the product already exists in the cart for the user
    // const [existing] = await pool.query(
    //   'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
    //   [user_id, product_id]
    // );

    // if (existing.length > 0) {
    //   // If the product already exists, update the quantity
    //   await pool.query(
    //     'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
    //     [quantity, user_id, product_id]
    //   );
    // } else {
    //   // Otherwise, insert a new entry into the cart
    //   await pool.query(
    //     'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
    //     [user_id, product_id, quantity]
    //   );
    // }

    // Send a response back (or redirect if required)
    res.json({ message: 'Item added to cart successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};




//  View cart (Ensures user session exists)
export const viewCart = async (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ error: "User not logged in" });
  }

  try {
    const [cartItems] = await pool.query(
      'SELECT * FROM shoppingcart WHERE user_id = ?',
      [userId]
    );
    res.status(200).json({ cartItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Remove item from cart
export const removeItemFromCart = async (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ error: "User not logged in" });
  }

  try {
    await pool.query('DELETE FROM shoppingcart WHERE cart_id = ? AND user_id = ?', [
      req.params.cartId,
      userId,
    ]);
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Clear user's cart
export const clearUserCart = async (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ error: "User not logged in" });
  }

  try {
    await pool.query('DELETE FROM shoppingcart WHERE user_id = ?', [userId]);
    res.status(200).json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
