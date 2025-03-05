import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

// Users Model
export const createUser = async (name, email, password, role = 'customer') => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, role]
  );
  return result.insertId;
};

export const findUserByEmail = async (email) => {
  const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return users.length ? users[0] : null;
};

export const verifyPassword = async (inputPassword, hashedPassword) => {
  return await bcrypt.compare(inputPassword, hashedPassword);
};