const db = require('../config/db');

// GET /api/students
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', department_id } = req.query;
    const offset = (page - 1) * limit;
    let where = 'WHERE 1=1';
    const params = [];
    if (search) { where += ' AND (s.first_name LIKE ? OR s.last_name LIKE ? OR s.student_code LIKE ?)'; params.push(`%${search}%`,`%${search}%`,`%${search}%`); }
    if (department_id) { where += ' AND s.department_id = ?'; params.push(department_id); }

    const [rows] = await db.query(`
      SELECT s.*, d.name AS department_name, u.email
      FROM students s
      JOIN departments d ON s.department_id = d.id
      JOIN users u ON s.user_id = u.id
      ${where} ORDER BY s.created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]);

    const [[{ total }]] = await db.query(`SELECT COUNT(*) AS total FROM students s ${where}`, params);
    res.json({ success: true, data: rows, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// GET /api/students/:id
exports.getOne = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, d.name AS department_name, u.email
      FROM students s JOIN departments d ON s.department_id=d.id JOIN users u ON s.user_id=u.id
      WHERE s.id=?`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// POST /api/students
exports.create = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const { first_name, last_name, email, date_of_birth, gender, phone, address, department_id, current_semester, enrollment_year, password } = req.body;
    const bcrypt = require('bcryptjs');
    const hashed = await bcrypt.hash(password || 'Student@123', 10);
    const name = `${first_name} ${last_name}`;
    const [userRes] = await conn.query('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)', [name,email,hashed,'student']);
    const student_code = 'STU' + Date.now().toString().slice(-6);
    const [stuRes] = await conn.query(
      'INSERT INTO students (user_id,student_code,first_name,last_name,date_of_birth,gender,phone,address,department_id,current_semester,enrollment_year) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
      [userRes.insertId, student_code, first_name, last_name, date_of_birth, gender, phone, address, department_id, current_semester||1, enrollment_year]);
    await conn.commit();
    res.status(201).json({ success: true, message: 'Student created', id: stuRes.insertId, student_code });
  } catch (err) { await conn.rollback(); res.status(500).json({ success: false, message: err.message }); }
  finally { conn.release(); }
};

// PUT /api/students/:id
exports.update = async (req, res) => {
  try {
    const { first_name, last_name, phone, address, department_id, current_semester, gender, date_of_birth } = req.body;
    await db.query('UPDATE students SET first_name=?,last_name=?,phone=?,address=?,department_id=?,current_semester=?,gender=?,date_of_birth=?,updated_at=NOW() WHERE id=?',
      [first_name, last_name, phone, address, department_id, current_semester, gender, date_of_birth, req.params.id]);
    res.json({ success: true, message: 'Student updated' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// DELETE /api/students/:id
exports.remove = async (req, res) => {
  try {
    await db.query('DELETE FROM students WHERE id=?', [req.params.id]);
    res.json({ success: true, message: 'Student deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
