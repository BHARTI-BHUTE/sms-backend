const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET || 'sms_secret_2024', (err, decoded) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    req.user = decoded;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ success: false, message: 'Admin access required' });
  next();
};

const isFacultyOrAdmin = (req, res, next) => {
  if (!['admin','faculty'].includes(req.user.role))
    return res.status(403).json({ success: false, message: 'Faculty or Admin access required' });
  next();
};

module.exports = { verifyToken, isAdmin, isFacultyOrAdmin };
