const { Router } = require('express');
const {
  listMaterials,
  getMaterial,
  createMaterial,
  updateMaterial,
} = require('../controllers/materialController');
const { authenticate, optionalAuthenticate, requireRole } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = Router();

router.get('/', optionalAuthenticate, listMaterials);
router.get('/:idOrSlug', optionalAuthenticate, getMaterial);
router.post('/', authenticate, requireRole('mentor', 'superadmin'), upload.single('thumbnail'), createMaterial);
router.patch('/:id', authenticate, requireRole('mentor', 'superadmin'), upload.single('thumbnail'), updateMaterial);

module.exports = router;
