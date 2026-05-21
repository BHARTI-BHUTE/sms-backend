if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);

const mysql = require('mysql2/promise');

const isPrivateHost = process.env.DB_HOST?.endsWith('.railway.internal');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  connectTimeout: 60000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 30000,

  ...(isPrivateHost ? {} : { ssl: { rejectUnauthorized: false } }),
});

pool.on('error', (err) => {
  console.error('Unexpected pool error:', err);
});

pool.getConnection()
  .then(conn => {
    console.log('MySQL connected');
    conn.release();
  })
  .catch(err => {
    console.error('MySQL connection error code:', err.code);
    console.error('MySQL connection error message:', err.message);
    console.error('MySQL full error:', JSON.stringify(err, null, 2));
    process.exit(1);
  });

module.exports = pool;