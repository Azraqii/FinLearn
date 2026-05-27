const pool = require('../db');

const VALID_TOPICS = ['budgeting', 'inflasi', 'compound', 'compound-interest', 'aset-digital'];

// POST /api/quiz/submit
async function submitQuiz(req, res) {
  const { name, topic, score } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'name is required' });
  }
  if (!VALID_TOPICS.includes(topic)) {
    return res.status(400).json({
      error: `topic must be one of: ${VALID_TOPICS.join(', ')}`,
    });
  }
  const numericScore = Number(score);
  if (!Number.isInteger(numericScore) || numericScore < 0 || numericScore > 100) {
    return res.status(400).json({ error: 'score must be an integer between 0 and 100' });
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO quiz_scores (name, topic, score) VALUES (?, ?, ?)',
      [name.trim(), topic, numericScore]
    );
    if (req.user) {
      await pool.execute(
        'INSERT INTO quiz_attempts (user_id, name, topic, score) VALUES (?, ?, ?, ?)',
        [req.user.id, name.trim(), topic, numericScore]
      );
    }
    return res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('[quizController.submitQuiz]', err);
    return res.status(500).json({ error: 'Failed to save quiz result' });
  }
}

// GET /api/quiz/leaderboard?topic=budgeting
async function getLeaderboard(req, res) {
  const { topic } = req.query;

  if (topic !== undefined && !VALID_TOPICS.includes(topic)) {
    return res.status(400).json({
      error: `topic must be one of: ${VALID_TOPICS.join(', ')}`,
    });
  }

  try {
    let rows;
    if (topic) {
      [rows] = await pool.execute(
        'SELECT id, name, topic, score, created_at FROM quiz_scores WHERE topic = ? ORDER BY score DESC, created_at ASC LIMIT 10',
        [topic]
      );
    } else {
      [rows] = await pool.execute(
        'SELECT id, name, topic, score, created_at FROM quiz_scores ORDER BY score DESC, created_at ASC LIMIT 10'
      );
    }
    return res.json(rows);
  } catch (err) {
    console.error('[quizController.getLeaderboard]', err);
    return res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
}

module.exports = { submitQuiz, getLeaderboard };
