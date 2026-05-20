// attendance.routes.js
const r1 = require('express').Router();
const a = require('../controllers/attendance.controller');
const { verifyToken, isFacultyOrAdmin } = require('../middleware/auth.middleware');
r1.use(verifyToken);
r1.post('/',           isFacultyOrAdmin, a.markAttendance);
r1.get('/',            a.getAttendance);
r1.get('/summary',     a.getAttendanceSummary);
module.exports = r1;
