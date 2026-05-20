// notice.routes.js
const router = require('express').Router();
const db = require('../config/db');
const { verifyToken, isFacultyOrAdmin } = require('../middleware/auth.middleware');
router.use(verifyToken);
router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT n.*, u.name AS posted_by_name FROM notices n JOIN users u ON n.posted_by=u.id WHERE n.is_active=1 ORDER BY n.created_at DESC LIMIT 20');
  res.json({ success: true, data: rows });
});
router.post('/', isFacultyOrAdmin, async (req, res) => {
  const { title, content, target_role } = req.body;
  const [r] = await db.query('INSERT INTO notices (title,content,posted_by,target_role) VALUES (?,?,?,?)', [title, content, req.user.id, target_role||'all']);
  res.status(201).json({ success: true, id: r.insertId });
});
module.exports = router;
