import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import session from 'express-session';
import db from './config/db.js';

// Import Routes
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the views folder path
app.set('views', path.join(__dirname, 'views'));

// SESSION CONFIGURATION (Place this BEFORE defining routes)
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,  // Change this to false to prevent creating empty sessions
}));

// Middleware to make session available in views and initialize cart
app.use((req, res, next) => {
  res.locals.session = req.session; // Make session available in EJS
  next();
});


// Routes
app.use(userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use(orderRoutes);

// Test Database Connection
app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    res.send(`Database Connected! Test Result: ${rows[0].result}`);
  } catch (error) {
    console.error(' Database Connection Failed:', error);
    res.status(500).send('Database Connection Failed');
  }
});

// Home Route
app.get('/', (req, res) => {
  res.render('index');  // This will look for the 'index.ejs' file in the 'views' folder
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
