require('dotenv').config();

const mysql = require('mysql2/promise');

const pool = mysql.createPool(process.env.DATABASE_URL);

pool.getConnection()
  .then(conn => {
    console.log('MySQL connected');
    conn.release();
  })
  .catch(err => {
    console.error('MySQL connection error:', err);
  });

module.exports = pool;