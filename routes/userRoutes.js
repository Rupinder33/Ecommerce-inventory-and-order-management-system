import express from 'express';
import pool from '../config/db.js';
import { registerUser, loginUser, } from '../controllers/userController.js';
import { logoutUser } from '../controllers/userController.js';
import { isAdmin } from '../middleware/authMiddleware.js';
const router = express.Router();

// middleware to check authentication
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

// // Middleware to restrict access to admins
// const isAdmin = (req, res, next) => {
//     if (req.session.user && req.session.user.role === 'admin') {
//         next();
//     } else {
//         res.status(403).json({ error: 'Access denied. Admins only.' });
//     }
// };

// User Routes
// GET routes for rendering registration and login pages
router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

// User Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);

// Admin Dashboard (Only accessible by admins)
router.get('/admin/products', isAuthenticated, isAdmin, async (req, res) => {
    console.log("calling to /admin/products");
    const [products] = await pool.query('SELECT * FROM products');
    // res.render('/products', { products });
    if (req.session.user && req.session.user.role === 'admin') {
        console.log("This is Admin");
        res.render('admin/product', { products });
    } else {
        console.log("This is Normal user");
        res.status(403).json({ error: 'Access denied. Admins only.' });
    }
});

export default router;


// router.get('/', (req, res) => {
//     res.render('login'); // Matches 'views/users/login.ejs'
// });


// // Route to render Register Page
// router.get('/register', (req, res) => {
//     res.render('register'); // Matches 'views/users/register.ejs'
// });

// // Route to render Login Page (Fix for "Cannot GET /users/login")
// router.get('/login', (req, res) => {
//     res.render('login'); // Matches 'views/users/login.ejs'
// });

// router.post('/register', registerUser);
// router.post('/login', loginUser);

// export default router;
