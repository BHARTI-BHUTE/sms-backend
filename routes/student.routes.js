const router = require('express').Router();
const ctrl = require('../controllers/student.controller');
const { verifyToken, isAdmin, isFacultyOrAdmin } = require('../middleware/auth.middleware');

router.use(verifyToken);
router.get('/',      ctrl.getAll);
router.get('/:id',   ctrl.getOne);
router.post('/',     isFacultyOrAdmin, ctrl.create);
router.put('/:id',   isFacultyOrAdmin, ctrl.update);
router.delete('/:id', isAdmin, ctrl.remove);
module.exports = router;
