const db = require('../config/db');

const calcGrade = (pct) => {
  if (pct >= 90) return 'O';
  if (pct >= 80) return 'A+';
  if (pct >= 70) return 'A';
  if (pct >= 60) return 'B+';
  if (pct >= 50) return 'B';
  if (pct >= 40) return 'C';
  return 'F';
};

exports.addMarks = async (req, res) => {
  try {
    const { student_id, course_id, exam_type, max_marks, obtained_marks, semester, year, remarks } = req.body;
    const pct = (obtained_marks / max_marks) * 100;
    const grade = calcGrade(pct);
    const [result] = await db.query(
      'INSERT INTO marks (student_id,course_id,exam_type,max_marks,obtained_marks,grade,semester,year,remarks) VALUES (?,?,?,?,?,?,?,?,?)',
      [student_id, course_id, exam_type, max_marks, obtained_marks, grade, semester, year, remarks]);
    res.status(201).json({ success: true, message: 'Marks added', id: result.insertId, grade });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getMarks = async (req, res) => {
  try {
    const { student_id, course_id, semester, year } = req.query;
    let where = 'WHERE 1=1'; const params = [];
    if (student_id) { where += ' AND m.student_id=?'; params.push(student_id); }
    if (course_id)  { where += ' AND m.course_id=?';  params.push(course_id);  }
    if (semester)   { where += ' AND m.semester=?';   params.push(semester);   }
    if (year)       { where += ' AND m.year=?';       params.push(year);       }

    const [rows] = await db.query(`
      SELECT m.*, s.first_name, s.last_name, s.student_code, c.course_name, c.course_code
      FROM marks m
      JOIN students s ON m.student_id=s.id
      JOIN courses c ON m.course_id=c.id
      ${where} ORDER BY m.created_at DESC`, params);
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getReportCard = async (req, res) => {
  try {
    const { student_id, semester, year } = req.params;
    const [student] = await db.query(`SELECT s.*,d.name AS dept FROM students s JOIN departments d ON s.department_id=d.id WHERE s.id=?`, [student_id]);
    const [marks] = await db.query(`
      SELECT c.course_name, c.course_code, c.credits,
        SUM(m.obtained_marks) AS total_obtained, SUM(m.max_marks) AS total_max,
        ROUND(SUM(m.obtained_marks)/SUM(m.max_marks)*100,2) AS percentage, m.grade
      FROM marks m JOIN courses c ON m.course_id=c.id
      WHERE m.student_id=? AND m.semester=? AND m.year=?
      GROUP BY m.course_id`, [student_id, semester, year]);
    res.json({ success: true, student: student[0], marks, semester, year });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
