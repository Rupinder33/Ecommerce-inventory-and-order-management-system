import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import express from 'express';


const router = express.Router();

// Users Controller
export const registerUser = async (req, res) => {
  const { name, email, password, role = 'customer' } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );
    res.redirect('/login');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// import {findUserByEmail, verifypassword } from '../models/userModel.js'

// user login - store session
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (!users.length) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Store user info in session
    req.session.userid = user.user_id;
    req.session.user = { id: user.user_id, role: user.role };
    req.session.currentuserid = user.user_id;
    console.log("return data ==============");
    console.log(req.session.user);
    console.log(req.session.user.id);
    console.log(req.session.user.role);
    console.log("USer ID now : ", req.session.currentuserid);

    // Redirect based on role
    if (user.role === 'admin') {
      res.redirect('/products');
    } else {
      res.redirect('/products');
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// User Logout - Destroy session
export const logoutUser = (req, res) => {
  try {
    console.log("calling to logout");
    req.session.destroy(() => {
      res.redirect('/');
    });
  } catch (error) {
    console.log(error);
  }

};

//     res.status(200).json({ message: 'Login successful', user });
//     const [products] = await pool.query('SELECT * FROM products');

//     const formattedProducts = products.map(product => ({
//       ...product,
//       price: Number(product.price),
//       stock_quantity: Number(product.stock_quantity)
//     }));
//     console.log("=== check point ");
//     console.log(formattedProducts);

//     res.render('products/index', {
//       products: formattedProducts.length ? formattedProducts : []
//     });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
