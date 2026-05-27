const { Router } = require('express');
const { uploadFile } = require('../controllers/uploadController');
const { authenticate, requireRole } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = Router();

router.post('/', authenticate, requireRole('mentor', 'student', 'superadmin'), upload.single('file'), uploadFile);

module.exports = router;
