const router = require('express').Router();
const f = require('../controllers/fees.controller');
const { verifyToken, isAdmin, isFacultyOrAdmin } = require('../middleware/auth.middleware');
router.use(verifyToken);
router.get('/',           f.getFees);
router.get('/summary',    f.getFeeSummary);
router.post('/',          isFacultyOrAdmin, f.addFee);
router.put('/:id/pay',    isFacultyOrAdmin, f.payFee);
module.exports = router;
