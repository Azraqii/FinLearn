const pool = require('../db');
const { publicUploadPath } = require('../middleware/upload');
const { slugify } = require('../utils/slug');

const VALID_STATUSES = new Set(['draft', 'published', 'archived']);

async function listMaterials(req, res) {
  const { status = 'published', mine } = req.query;
  const params = [];
  const filters = [];

  if (status !== 'all') {
    if (!VALID_STATUSES.has(status)) {
      return res.status(400).json({ error: 'status must be draft, published, archived, or all' });
    }
    filters.push('m.status = ?');
    params.push(status);
  }

  if (mine === 'true') {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });
    filters.push('m.mentor_id = ?');
    params.push(req.user.id);
  }

  try {
    const [rows] = await pool.execute(
      `SELECT m.id, m.mentor_id, u.name AS mentor_name, m.title, m.slug, m.topic,
              m.summary, m.content, m.thumbnail_path, m.status, m.created_at, m.updated_at
       FROM materials m
       JOIN users u ON u.id = m.mentor_id
       ${filters.length ? `WHERE ${filters.join(' AND ')}` : ''}
       ORDER BY m.updated_at DESC`,
      params
    );
    return res.json(rows);
  } catch (err) {
    console.error('[materialController.listMaterials]', err);
    return res.status(500).json({ error: 'Failed to fetch materials' });
  }
}

async function getMaterial(req, res) {
  try {
    const [rows] = await pool.execute(
      `SELECT m.id, m.mentor_id, u.name AS mentor_name, m.title, m.slug, m.topic,
              m.summary, m.content, m.thumbnail_path, m.status, m.created_at, m.updated_at
       FROM materials m
       JOIN users u ON u.id = m.mentor_id
       WHERE m.slug = ? OR m.id = ?`,
      [req.params.idOrSlug, Number(req.params.idOrSlug) || 0]
    );
    const material = rows[0];
    if (!material) return res.status(404).json({ error: 'Material not found' });
    if (material.status !== 'published' && (!req.user || req.user.role === 'student')) {
      return res.status(403).json({ error: 'Material is not published' });
    }
    return res.json(material);
  } catch (err) {
    console.error('[materialController.getMaterial]', err);
    return res.status(500).json({ error: 'Failed to fetch material' });
  }
}

async function createMaterial(req, res) {
  const { title, topic, summary = '', content, status = 'draft' } = req.body;
  const cleanTitle = String(title || '').trim();
  const cleanTopic = String(topic || '').trim();

  if (cleanTitle.length < 3) return res.status(400).json({ error: 'title must be at least 3 characters' });
  if (!cleanTopic) return res.status(400).json({ error: 'topic is required' });
  if (!content || String(content).trim().length < 20) {
    return res.status(400).json({ error: 'content must be at least 20 characters' });
  }
  if (!VALID_STATUSES.has(status)) {
    return res.status(400).json({ error: 'status must be draft, published, or archived' });
  }

  try {
    const baseSlug = slugify(cleanTitle);
    const slug = `${baseSlug}-${Date.now().toString(36)}`;
    const [result] = await pool.execute(
      `INSERT INTO materials
       (mentor_id, title, slug, topic, summary, content, thumbnail_path, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        cleanTitle,
        slug,
        cleanTopic,
        String(summary || '').trim(),
        String(content).trim(),
        publicUploadPath(req.file),
        status,
      ]
    );
    return res.status(201).json({ success: true, id: result.insertId, slug });
  } catch (err) {
    console.error('[materialController.createMaterial]', err);
    return res.status(500).json({ error: 'Failed to create material' });
  }
}

async function updateMaterial(req, res) {
  const materialId = Number(req.params.id);
  const { title, topic, summary, content, status } = req.body;
  if (!Number.isInteger(materialId) || materialId <= 0) {
    return res.status(400).json({ error: 'invalid material id' });
  }
  if (status !== undefined && !VALID_STATUSES.has(status)) {
    return res.status(400).json({ error: 'status must be draft, published, or archived' });
  }

  try {
    const [[material]] = await pool.execute('SELECT mentor_id FROM materials WHERE id = ?', [materialId]);
    if (!material) return res.status(404).json({ error: 'Material not found' });
    if (req.user.role !== 'superadmin' && material.mentor_id !== req.user.id) {
      return res.status(403).json({ error: 'Only the owner mentor or superadmin can update this material' });
    }

    const fields = [];
    const params = [];
    for (const [column, value] of Object.entries({ title, topic, summary, content, status })) {
      if (value !== undefined) {
        fields.push(`${column} = ?`);
        params.push(String(value).trim());
      }
    }
    if (req.file) {
      fields.push('thumbnail_path = ?');
      params.push(publicUploadPath(req.file));
    }
    if (!fields.length) return res.status(400).json({ error: 'No fields to update' });

    params.push(materialId);
    await pool.execute(`UPDATE materials SET ${fields.join(', ')} WHERE id = ?`, params);
    return res.json({ success: true });
  } catch (err) {
    console.error('[materialController.updateMaterial]', err);
    return res.status(500).json({ error: 'Failed to update material' });
  }
}

module.exports = { listMaterials, getMaterial, createMaterial, updateMaterial };
