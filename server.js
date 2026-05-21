require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const path     = require('path');

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth',       require('./routes/auth.routes'));
app.use('/api/students',   require('./routes/student.routes'));
app.use('/api/courses',    require('./routes/course.routes'));
app.use('/api/attendance', require('./routes/attendance.routes'));
app.use('/api/marks',      require('./routes/marks.routes'));
app.use('/api/fees',       require('./routes/fees.routes'));
app.use('/api/notices',    require('./routes/notice.routes'));
app.use('/api/dashboard',  require('./routes/dashboard.routes'));

// ── Health Check ──────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'OK', time: new Date() }));

// ── Global Error Handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

console.log('ENV CHECK:', {
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  NODE_ENV: process.env.NODE_ENV,
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SMS API running on http://localhost:${PORT}`));
