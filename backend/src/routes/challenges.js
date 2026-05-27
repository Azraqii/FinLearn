const { Router } = require('express');
const {
  listChallenges,
  createChallenge,
  updateChallenge,
  submitChallenge,
  listSubmissions,
} = require('../controllers/challengeController');
const { authenticate, optionalAuthenticate, requireRole } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = Router();

router.get('/', optionalAuthenticate, listChallenges);
router.post('/', authenticate, requireRole('mentor', 'superadmin'), upload.single('attachment'), createChallenge);
router.patch('/:id', authenticate, requireRole('mentor', 'superadmin'), upload.single('attachment'), updateChallenge);
router.post('/:id/submissions', authenticate, requireRole('student'), upload.single('attachment'), submitChallenge);
router.get('/:id/submissions', authenticate, requireRole('mentor', 'superadmin'), listSubmissions);

module.exports = router;
