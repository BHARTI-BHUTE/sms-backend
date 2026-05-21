require('dotenv').config();

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306, // ✅ cast to number

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  connectTimeout: 60000,
  enableKeepAlive: true,         // ✅ prevents idle timeout disconnects
  keepAliveInitialDelay: 30000,  // ✅ send keepalive after 30s idle

  ssl: {
    rejectUnauthorized: false
  }
});

// ✅ catch pool-level errors (e.g. stale connections under load)
pool.on('error', (err) => {
  console.error('Unexpected pool error:', err);
});

pool.getConnection()
  .then(conn => {
    console.log('MySQL connected');
    conn.release();
  })
  .catch(err => {
    console.error('MySQL connection error:', err.message);
    process.exit(1); // ✅ fail fast on startup — don't silently export a broken pool
  });

module.exports = pool;