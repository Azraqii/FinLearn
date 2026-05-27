const pool = require('../db');
const { publicUploadPath } = require('../middleware/upload');

const CHALLENGE_STATUSES = new Set(['draft', 'published', 'archived']);
const SUBMISSION_STATUSES = new Set(['submitted', 'reviewed', 'accepted', 'needs_revision']);

async function listChallenges(req, res) {
  const { status = 'published', mine } = req.query;
  const filters = [];
  const params = [];

  if (status !== 'all') {
    if (!CHALLENGE_STATUSES.has(status)) {
      return res.status(400).json({ error: 'status must be draft, published, archived, or all' });
    }
    filters.push('c.status = ?');
    params.push(status);
  }
  if (mine === 'true') {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });
    filters.push('c.mentor_id = ?');
    params.push(req.user.id);
  }

  try {
    const [rows] = await pool.execute(
      `SELECT c.id, c.mentor_id, u.name AS mentor_name, c.title, c.description,
              c.due_at, c.attachment_path, c.status, c.created_at, c.updated_at
       FROM challenges c
       JOIN users u ON u.id = c.mentor_id
       ${filters.length ? `WHERE ${filters.join(' AND ')}` : ''}
       ORDER BY c.updated_at DESC`,
      params
    );
    return res.json(rows);
  } catch (err) {
    console.error('[challengeController.listChallenges]', err);
    return res.status(500).json({ error: 'Failed to fetch challenges' });
  }
}

async function createChallenge(req, res) {
  const { title, description, due_at = null, status = 'draft' } = req.body;
  const cleanTitle = String(title || '').trim();
  const cleanDescription = String(description || '').trim();

  if (cleanTitle.length < 3) return res.status(400).json({ error: 'title must be at least 3 characters' });
  if (cleanDescription.length < 10) return res.status(400).json({ error: 'description must be at least 10 characters' });
  if (!CHALLENGE_STATUSES.has(status)) {
    return res.status(400).json({ error: 'status must be draft, published, or archived' });
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO challenges
       (mentor_id, title, description, due_at, attachment_path, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        cleanTitle,
        cleanDescription,
        due_at || null,
        publicUploadPath(req.file),
        status,
      ]
    );
    return res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('[challengeController.createChallenge]', err);
    return res.status(500).json({ error: 'Failed to create challenge' });
  }
}

async function updateChallenge(req, res) {
  const challengeId = Number(req.params.id);
  const { title, description, due_at, status } = req.body;

  if (!Number.isInteger(challengeId) || challengeId <= 0) {
    return res.status(400).json({ error: 'invalid challenge id' });
  }
  if (status !== undefined && !CHALLENGE_STATUSES.has(status)) {
    return res.status(400).json({ error: 'status must be draft, published, or archived' });
  }

  try {
    const [[challenge]] = await pool.execute('SELECT mentor_id FROM challenges WHERE id = ?', [challengeId]);
    if (!challenge) return res.status(404).json({ error: 'Challenge not found' });
    if (req.user.role !== 'superadmin' && challenge.mentor_id !== req.user.id) {
      return res.status(403).json({ error: 'Only owner mentor or superadmin can update this challenge' });
    }

    const fields = [];
    const params = [];
    for (const [column, value] of Object.entries({ title, description, due_at, status })) {
      if (value !== undefined) {
        fields.push(`${column} = ?`);
        params.push(value === '' ? null : String(value).trim());
      }
    }
    if (req.file) {
      fields.push('attachment_path = ?');
      params.push(publicUploadPath(req.file));
    }
    if (!fields.length) return res.status(400).json({ error: 'No fields to update' });

    params.push(challengeId);
    await pool.execute(`UPDATE challenges SET ${fields.join(', ')} WHERE id = ?`, params);
    return res.json({ success: true });
  } catch (err) {
    console.error('[challengeController.updateChallenge]', err);
    return res.status(500).json({ error: 'Failed to update challenge' });
  }
}

async function submitChallenge(req, res) {
  const challengeId = Number(req.params.id);
  const answerText = String(req.body.answer_text || '').trim();

  if (!Number.isInteger(challengeId) || challengeId <= 0) {
    return res.status(400).json({ error: 'invalid challenge id' });
  }
  if (!answerText && !req.file) {
    return res.status(400).json({ error: 'answer_text or attachment is required' });
  }

  try {
    const [[challenge]] = await pool.execute(
      'SELECT id, status, due_at FROM challenges WHERE id = ?',
      [challengeId]
    );
    if (!challenge) return res.status(404).json({ error: 'Challenge not found' });
    if (challenge.status !== 'published') return res.status(400).json({ error: 'Challenge is not published' });
    if (challenge.due_at && new Date(challenge.due_at).getTime() < Date.now()) {
      return res.status(400).json({ error: 'Challenge deadline has passed' });
    }

    const [result] = await pool.execute(
      `INSERT INTO challenge_submissions
       (challenge_id, student_id, answer_text, attachment_path)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         answer_text = VALUES(answer_text),
         attachment_path = VALUES(attachment_path),
         status = 'submitted',
         feedback_text = NULL,
         reviewed_by = NULL,
         reviewed_at = NULL`,
      [challengeId, req.user.id, answerText || null, publicUploadPath(req.file)]
    );
    return res.status(201).json({ success: true, id: result.insertId || null });
  } catch (err) {
    console.error('[challengeController.submitChallenge]', err);
    return res.status(500).json({ error: 'Failed to submit challenge' });
  }
}

async function listSubmissions(req, res) {
  const challengeId = Number(req.params.id);
  if (!Number.isInteger(challengeId) || challengeId <= 0) {
    return res.status(400).json({ error: 'invalid challenge id' });
  }

  try {
    const [[challenge]] = await pool.execute('SELECT mentor_id FROM challenges WHERE id = ?', [challengeId]);
    if (!challenge) return res.status(404).json({ error: 'Challenge not found' });
    if (req.user.role !== 'superadmin' && challenge.mentor_id !== req.user.id) {
      return res.status(403).json({ error: 'Only owner mentor or superadmin can view submissions' });
    }

    const [rows] = await pool.execute(
      `SELECT s.id, s.challenge_id, s.student_id, u.name AS student_name, s.answer_text,
              s.attachment_path, s.status, s.feedback_text, s.reviewed_by, s.reviewed_at,
              s.created_at, s.updated_at
       FROM challenge_submissions s
       JOIN users u ON u.id = s.student_id
       WHERE s.challenge_id = ?
       ORDER BY s.created_at DESC`,
      [challengeId]
    );
    return res.json(rows);
  } catch (err) {
    console.error('[challengeController.listSubmissions]', err);
    return res.status(500).json({ error: 'Failed to fetch submissions' });
  }
}

async function listMySubmissions(req, res) {
  try {
    const [rows] = await pool.execute(
      `SELECT s.id, s.challenge_id, c.title AS challenge_title, s.answer_text,
              s.attachment_path, s.status, s.feedback_text, s.reviewed_by, s.reviewed_at,
              s.created_at, s.updated_at
       FROM challenge_submissions s
       JOIN challenges c ON c.id = s.challenge_id
       WHERE s.student_id = ?
       ORDER BY s.updated_at DESC`,
      [req.user.id]
    );
    return res.json(rows);
  } catch (err) {
    console.error('[challengeController.listMySubmissions]', err);
    return res.status(500).json({ error: 'Failed to fetch submissions' });
  }
}

async function giveFeedback(req, res) {
  const submissionId = Number(req.params.id);
  const { feedback_text, status = 'reviewed' } = req.body;

  if (!Number.isInteger(submissionId) || submissionId <= 0) {
    return res.status(400).json({ error: 'invalid submission id' });
  }
  if (!SUBMISSION_STATUSES.has(status) || status === 'submitted') {
    return res.status(400).json({ error: 'status must be reviewed, accepted, or needs_revision' });
  }
  if (!feedback_text || String(feedback_text).trim().length < 3) {
    return res.status(400).json({ error: 'feedback_text must be at least 3 characters' });
  }

  try {
    const [[submission]] = await pool.execute(
      `SELECT s.id, c.mentor_id
       FROM challenge_submissions s
       JOIN challenges c ON c.id = s.challenge_id
       WHERE s.id = ?`,
      [submissionId]
    );
    if (!submission) return res.status(404).json({ error: 'Submission not found' });
    if (req.user.role !== 'superadmin' && submission.mentor_id !== req.user.id) {
      return res.status(403).json({ error: 'Only owner mentor or superadmin can review this submission' });
    }

    await pool.execute(
      `UPDATE challenge_submissions
       SET status = ?, feedback_text = ?, reviewed_by = ?, reviewed_at = NOW()
       WHERE id = ?`,
      [status, String(feedback_text).trim(), req.user.id, submissionId]
    );
    return res.json({ success: true });
  } catch (err) {
    console.error('[challengeController.giveFeedback]', err);
    return res.status(500).json({ error: 'Failed to save feedback' });
  }
}

module.exports = {
  listChallenges,
  createChallenge,
  updateChallenge,
  submitChallenge,
  listSubmissions,
  listMySubmissions,
  giveFeedback,
};
