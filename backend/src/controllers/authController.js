const bcrypt = require('bcryptjs');
const pool = require('../db');
const { signToken } = require('../middleware/auth');

const PUBLIC_ROLES = new Set(['mentor', 'student']);

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    created_at: user.created_at,
  };
}

async function register(req, res) {
  const { name, email, password, role = 'student' } = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const requestedRole = String(role || 'student').trim();

  if (!name || String(name).trim().length < 2) {
    return res.status(400).json({ error: 'name must be at least 2 characters' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return res.status(400).json({ error: 'valid email is required' });
  }
  if (!password || String(password).length < 8) {
    return res.status(400).json({ error: 'password must be at least 8 characters' });
  }
  if (!PUBLIC_ROLES.has(requestedRole)) {
    return res.status(400).json({ error: 'role must be mentor or student' });
  }

  try {
    const [[countRow]] = await pool.execute('SELECT COUNT(*) AS count FROM users');
    const isFirstUser = countRow.count === 0;
    const finalRole = isFirstUser ? 'superadmin' : requestedRole;
    const status = isFirstUser ? 'approved' : 'pending';
    const passwordHash = await bcrypt.hash(String(password), 12);

    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?)',
      [String(name).trim(), normalizedEmail, passwordHash, finalRole, status]
    );

    const user = {
      id: result.insertId,
      name: String(name).trim(),
      email: normalizedEmail,
      role: finalRole,
      status,
    };

    return res.status(201).json({
      user: publicUser(user),
      token: status === 'approved' ? signToken(user) : null,
      message: isFirstUser
        ? 'First user created as approved superadmin'
        : 'Registration submitted and waiting for superadmin approval',
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'email is already registered' });
    }
    console.error('[authController.register]', err);
    return res.status(500).json({ error: 'Failed to register user' });
  }
}

async function login(req, res) {
  const normalizedEmail = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (!normalizedEmail || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  try {
    const [rows] = await pool.execute(
      'SELECT id, name, email, password_hash, role, status, created_at FROM users WHERE email = ?',
      [normalizedEmail]
    );
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });
    if (user.status !== 'approved') {
      return res.status(403).json({ error: `User status is ${user.status}` });
    }

    return res.json({
      user: publicUser(user),
      token: signToken(user),
    });
  } catch (err) {
    console.error('[authController.login]', err);
    return res.status(500).json({ error: 'Failed to login' });
  }
}

function me(req, res) {
  return res.json({ user: publicUser(req.user) });
}

module.exports = { register, login, me };
