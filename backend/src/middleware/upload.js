const path = require('path');
const multer = require('multer');

const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads');

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDir),
  filename: (_req, file, callback) => {
    const safeBase = path
      .basename(file.originalname, path.extname(file.originalname))
      .replace(/[^a-z0-9-_]+/gi, '-')
      .toLowerCase()
      .slice(0, 60);
    const ext = path.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${safeBase || 'upload'}${ext}`);
  },
});

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
]);

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return callback(new Error('Only image, gif, webp, and pdf uploads are allowed'));
    }
    callback(null, true);
  },
});

function publicUploadPath(file) {
  return file ? `/uploads/${file.filename}` : null;
}

module.exports = { upload, publicUploadPath, uploadDir };
