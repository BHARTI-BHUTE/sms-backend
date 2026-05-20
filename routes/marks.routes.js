// marks.routes.js
const router = require('express').Router();
const m = require('../controllers/marks.controller');
const { verifyToken, isFacultyOrAdmin } = require('../middleware/auth.middleware');
router.use(verifyToken);
router.post('/',                                    isFacultyOrAdmin, m.addMarks);
router.get('/',                                     m.getMarks);
router.get('/report/:student_id/:semester/:year',   m.getReportCard);
module.exports = router;
