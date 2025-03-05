import mysql from 'mysql2';

// Creating a connection pool
const pool = mysql.createPool({
  host: 'localhost',  
  user: 'root',       
  password: 'Gursehaj05jan@', 
  database: 'ecommercedb1', 
  waitForConnections: true,
  connectionLimit: 10,  
  queueLimit: 0
});

// Testing the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Connection error:', err);
  } else {
    console.log('Connected to MySQL');
    connection.release(); 
  }
});

export default pool.promise();
