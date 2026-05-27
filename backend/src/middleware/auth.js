const jwt = require('jsonwebtoken');
const pool = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'finlearn-dev-secret-change-me';

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, status: user.status },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

async function loadUser(id) {
  const [rows] = await pool.execute(
    'SELECT id, name, email, role, status, created_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) return res.status(401).json({ error: 'Authentication required' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await loadUser(payload.id);
    if (!user) return res.status(401).json({ error: 'User not found' });
    if (user.status !== 'approved') return res.status(403).json({ error: 'User is not approved' });

    req.user = user;
    next();
  } catch (_err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

async function optionalAuthenticate(req, _res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next();

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await loadUser(payload.id);
    if (user && user.status === 'approved') req.user = user;
  } catch (_err) {
    // Legacy public endpoints should still work without a valid token.
  }
  next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Role must be one of: ${roles.join(', ')}` });
    }
    next();
  };
}

module.exports = {
  authenticate,
  optionalAuthenticate,
  requireRole,
  signToken,
};
