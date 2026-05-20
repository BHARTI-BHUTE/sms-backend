// course.routes.js
const router = require('express').Router();
const db = require('../config/db');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
router.use(verifyToken);
router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT c.*, d.name AS department_name FROM courses c JOIN departments d ON c.department_id=d.id ORDER BY c.semester');
  res.json({ success: true, data: rows });
});
router.post('/', isAdmin, async (req, res) => {
  const { course_name, course_code, department_id, credits, semester, description } = req.body;
  const [r] = await db.query('INSERT INTO courses (course_name,course_code,department_id,credits,semester,description) VALUES (?,?,?,?,?,?)',
    [course_name, course_code, department_id, credits, semester, description]);
  res.status(201).json({ success: true, id: r.insertId });
});
router.put('/:id', isAdmin, async (req, res) => {
  const { course_name, credits, description } = req.body;
  await db.query('UPDATE courses SET course_name=?,credits=?,description=? WHERE id=?', [course_name, credits, description, req.params.id]);
  res.json({ success: true });
});
router.delete('/:id', isAdmin, async (req, res) => {
  await db.query('DELETE FROM courses WHERE id=?', [req.params.id]);
  res.json({ success: true });
});
module.exports = router;
