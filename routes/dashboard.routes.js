// dashboard.routes.js
const router = require('express').Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/auth.middleware');
router.use(verifyToken);
router.get('/', async (req, res) => {
  try {
    const [[students]]   = await db.query('SELECT COUNT(*) AS count FROM students');
    const [[courses]]    = await db.query('SELECT COUNT(*) AS count FROM courses');
    const [[faculty]]    = await db.query('SELECT COUNT(*) AS count FROM faculty');
    const [[fees]]       = await db.query('SELECT SUM(CASE WHEN status="paid" THEN amount ELSE 0 END) AS collected, SUM(CASE WHEN status="pending" THEN amount ELSE 0 END) AS pending FROM fees');
    const [notices]      = await db.query('SELECT title, created_at FROM notices WHERE is_active=1 ORDER BY created_at DESC LIMIT 5');
    const [deptCount]    = await db.query('SELECT d.name, COUNT(s.id) AS count FROM departments d LEFT JOIN students s ON d.id=s.department_id GROUP BY d.id');
    res.json({ success: true, data: { students: students.count, courses: courses.count, faculty: faculty.count, fees_collected: fees.collected||0, fees_pending: fees.pending||0, recent_notices: notices, students_by_dept: deptCount }});
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
module.exports = router;
