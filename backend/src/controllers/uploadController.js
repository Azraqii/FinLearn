const { publicUploadPath } = require('../middleware/upload');

function uploadFile(req, res) {
  if (!req.file) return res.status(400).json({ error: 'file is required' });

  return res.status(201).json({
    success: true,
    file: {
      original_name: req.file.originalname,
      mime_type: req.file.mimetype,
      size: req.file.size,
      path: publicUploadPath(req.file),
    },
  });
}

module.exports = { uploadFile };
