// routes/auth.routes.js
const router = require('express').Router();
const ctrl   = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');
router.post('/login',    ctrl.login);
router.post('/register', ctrl.register);
router.get('/profile',   verifyToken, ctrl.getProfile);
module.exports = router;
