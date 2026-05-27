const { Router } = require('express');
const { giveFeedback, listMySubmissions } = require('../controllers/challengeController');
const { authenticate, requireRole } = require('../middleware/auth');

const router = Router();

router.get('/mine', authenticate, requireRole('student'), listMySubmissions);
router.patch('/:id/feedback', authenticate, requireRole('mentor', 'superadmin'), giveFeedback);

module.exports = router;
