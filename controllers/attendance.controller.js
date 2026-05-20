// ── attendance.controller.js ──────────────────────────────────
const db = require('../config/db');

exports.markAttendance = async (req, res) => {
  try {
    const records = req.body.records; // [{student_id, course_id, date, status}]
    if (!Array.isArray(records) || !records.length)
      return res.status(400).json({ success: false, message: 'records array required' });

    const values = records.map(r => [r.student_id, r.course_id, r.date, r.status, r.remarks||null, req.user.id]);
    await db.query(
      'INSERT INTO attendance (student_id,course_id,date,status,remarks,marked_by) VALUES ? ON DUPLICATE KEY UPDATE status=VALUES(status)',
      [values]);
    res.json({ success: true, message: `${records.length} attendance records saved` });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAttendance = async (req, res) => {
  try {
    const { student_id, course_id, from_date, to_date } = req.query;
    let where = 'WHERE 1=1'; const params = [];
    if (student_id) { where += ' AND a.student_id=?'; params.push(student_id); }
    if (course_id)  { where += ' AND a.course_id=?';  params.push(course_id);  }
    if (from_date)  { where += ' AND a.date >= ?';     params.push(from_date);  }
    if (to_date)    { where += ' AND a.date <= ?';     params.push(to_date);    }

    const [rows] = await db.query(`
      SELECT a.*, s.first_name, s.last_name, s.student_code, c.course_name
      FROM attendance a
      JOIN students s ON a.student_id=s.id
      JOIN courses c ON a.course_id=c.id
      ${where} ORDER BY a.date DESC`, params);
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAttendanceSummary = async (req, res) => {
  try {
    const { student_id, course_id } = req.query;
    const [rows] = await db.query(`
      SELECT course_id, c.course_name,
        COUNT(*) AS total,
        SUM(status='present') AS present,
        SUM(status='absent')  AS absent,
        ROUND(SUM(status='present')*100/COUNT(*),2) AS percentage
      FROM attendance a JOIN courses c ON a.course_id=c.id
      WHERE a.student_id=? ${course_id ? 'AND a.course_id=?' : ''}
      GROUP BY a.course_id`, course_id ? [student_id, course_id] : [student_id]);
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
