// fees.controller.js
const db = require('../config/db');

exports.addFee = async (req, res) => {
  try {
    const { student_id, fee_type, amount, due_date, semester, year } = req.body;
    const [r] = await db.query('INSERT INTO fees (student_id,fee_type,amount,due_date,semester,year) VALUES (?,?,?,?,?,?)',
      [student_id, fee_type, amount, due_date, semester, year]);
    res.status(201).json({ success: true, message: 'Fee record created', id: r.insertId });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.payFee = async (req, res) => {
  try {
    const { payment_method, transaction_id } = req.body;
    await db.query('UPDATE fees SET status="paid", paid_date=CURDATE(), payment_method=?, transaction_id=? WHERE id=?',
      [payment_method, transaction_id, req.params.id]);
    res.json({ success: true, message: 'Payment recorded' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getFees = async (req, res) => {
  try {
    const { student_id, status } = req.query;
    let where = 'WHERE 1=1'; const params = [];
    if (student_id) { where += ' AND f.student_id=?'; params.push(student_id); }
    if (status)     { where += ' AND f.status=?';      params.push(status);     }
    const [rows] = await db.query(`
      SELECT f.*, s.first_name, s.last_name, s.student_code
      FROM fees f JOIN students s ON f.student_id=s.id ${where} ORDER BY f.due_date DESC`, params);
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getFeeSummary = async (req, res) => {
  try {
    const [[summary]] = await db.query(`
      SELECT
        SUM(amount) AS total_fees,
        SUM(CASE WHEN status='paid' THEN amount ELSE 0 END) AS collected,
        SUM(CASE WHEN status='pending' THEN amount ELSE 0 END) AS pending,
        SUM(CASE WHEN status='overdue' THEN amount ELSE 0 END) AS overdue
      FROM fees`);
    res.json({ success: true, data: summary });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
