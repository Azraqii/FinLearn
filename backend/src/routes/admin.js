const { Router } = require('express');
const { listUsers, updateUserStatus } = require('../controllers/adminController');
const { authenticate, requireRole } = require('../middleware/auth');

const router = Router();

router.use(authenticate, requireRole('superadmin'));
router.get('/users', listUsers);
router.patch('/users/:id/status', updateUserStatus);
router.patch('/users/:id/approve', (req, _res, next) => {
  req.body = req.body || {};
  req.body.status = 'approved';
  next();
}, updateUserStatus);
router.patch('/users/:id/reject', (req, _res, next) => {
  req.body = req.body || {};
  req.body.status = 'rejected';
  next();
}, updateUserStatus);

module.exports = router;
