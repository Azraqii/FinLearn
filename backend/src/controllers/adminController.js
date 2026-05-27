const pool = require('../db');

const VALID_STATUSES = new Set(['pending', 'approved', 'rejected']);

async function listUsers(req, res) {
  const { status } = req.query;
  if (status !== undefined && !VALID_STATUSES.has(status)) {
    return res.status(400).json({ error: 'status must be pending, approved, or rejected' });
  }

  try {
    const sql = status
      ? 'SELECT id, name, email, role, status, created_at FROM users WHERE status = ? ORDER BY created_at DESC'
      : 'SELECT id, name, email, role, status, created_at FROM users ORDER BY created_at DESC';
    const params = status ? [status] : [];
    const [rows] = await pool.execute(sql, params);
    return res.json(rows);
  } catch (err) {
    console.error('[adminController.listUsers]', err);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
}

async function updateUserStatus(req, res) {
  const userId = Number(req.params.id);
  const { status } = req.body;

  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ error: 'invalid user id' });
  }
  if (!VALID_STATUSES.has(status)) {
    return res.status(400).json({ error: 'status must be pending, approved, or rejected' });
  }
  if (userId === req.user.id && status !== 'approved') {
    return res.status(400).json({ error: 'superadmin cannot reject their own account' });
  }

  try {
    const [result] = await pool.execute('UPDATE users SET status = ? WHERE id = ?', [status, userId]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });

    const [[user]] = await pool.execute(
      'SELECT id, name, email, role, status, created_at FROM users WHERE id = ?',
      [userId]
    );
    return res.json(user);
  } catch (err) {
    console.error('[adminController.updateUserStatus]', err);
    return res.status(500).json({ error: 'Failed to update user status' });
  }
}

module.exports = { listUsers, updateUserStatus };
