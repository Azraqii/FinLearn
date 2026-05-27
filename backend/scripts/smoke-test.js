process.env.JWT_SECRET = process.env.JWT_SECRET || 'smoke-test-secret';
process.env.COINGECKO_API_URL = process.env.COINGECKO_API_URL || 'https://example.invalid';

const http = require('http');
const bcrypt = require('bcryptjs');

const users = [];
const materials = [];
const challenges = [];
const submissions = [];
const quizScores = [];
let nextUserId = 1;
let nextMaterialId = 1;
let nextChallengeId = 1;
let nextSubmissionId = 1;
let nextQuizScoreId = 1;

function now() {
  return new Date().toISOString();
}

function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    created_at: user.created_at,
  };
}

const mockPool = {
  async execute(sql, params = []) {
    const compact = sql.replace(/\s+/g, ' ').trim();

    if (compact.startsWith('SELECT COUNT(*) AS count FROM users')) {
      return [[{ count: users.length }]];
    }

    if (compact.startsWith('INSERT INTO users')) {
      const [name, email, passwordHash, role, status] = params;
      if (users.some((user) => user.email === email)) {
        const error = new Error('Duplicate entry');
        error.code = 'ER_DUP_ENTRY';
        throw error;
      }
      const user = { id: nextUserId++, name, email, password_hash: passwordHash, role, status, created_at: now() };
      users.push(user);
      return [{ insertId: user.id, affectedRows: 1 }];
    }

    if (compact.includes('FROM users WHERE email = ?')) {
      return [[users.find((user) => user.email === params[0])].filter(Boolean)];
    }

    if (compact.includes('FROM users WHERE id = ?')) {
      return [[publicUser(users.find((user) => user.id === params[0]))].filter(Boolean)];
    }

    if (compact.startsWith('SELECT id, name, email, role, status, created_at FROM users WHERE status = ?')) {
      return [users.filter((user) => user.status === params[0]).map(publicUser)];
    }

    if (compact.startsWith('SELECT id, name, email, role, status, created_at FROM users ORDER BY')) {
      return [users.map(publicUser)];
    }

    if (compact.startsWith('UPDATE users SET status = ? WHERE id = ?')) {
      const [status, id] = params;
      const user = users.find((entry) => entry.id === id);
      if (!user) return [{ affectedRows: 0 }];
      user.status = status;
      return [{ affectedRows: 1 }];
    }

    if (compact.startsWith('UPDATE users SET role = ? WHERE id = ?')) {
      const [role, id] = params;
      const user = users.find((entry) => entry.id === id);
      if (!user) return [{ affectedRows: 0 }];
      user.role = role;
      return [{ affectedRows: 1 }];
    }

    if (compact.startsWith('INSERT INTO materials')) {
      const [mentorId, title, slug, topic, summary, content, thumbnailPath, status] = params;
      const material = {
        id: nextMaterialId++,
        mentor_id: mentorId,
        mentor_name: users.find((user) => user.id === mentorId)?.name,
        title,
        slug,
        topic,
        summary,
        content,
        thumbnail_path: thumbnailPath,
        status,
        created_at: now(),
        updated_at: now(),
      };
      materials.push(material);
      return [{ insertId: material.id, affectedRows: 1 }];
    }

    if (compact.includes('FROM materials m JOIN users u ON u.id = m.mentor_id')) {
      if (compact.includes('WHERE m.slug = ? OR m.id = ?')) {
        const [slug, id] = params;
        return [[materials.find((material) => material.slug === slug || material.id === id)].filter(Boolean)];
      }
      return [materials.filter((material) => !params.length || material.status === params[0])];
    }

    if (compact.startsWith('SELECT mentor_id FROM materials WHERE id = ?')) {
      return [[materials.find((material) => material.id === params[0])].filter(Boolean)];
    }

    if (compact.startsWith('UPDATE materials SET')) {
      return [{ affectedRows: 1 }];
    }

    if (compact.startsWith('INSERT INTO challenges')) {
      const [mentorId, title, description, dueAt, attachmentPath, status] = params;
      const challenge = {
        id: nextChallengeId++,
        mentor_id: mentorId,
        mentor_name: users.find((user) => user.id === mentorId)?.name,
        title,
        description,
        due_at: dueAt,
        attachment_path: attachmentPath,
        status,
        created_at: now(),
        updated_at: now(),
      };
      challenges.push(challenge);
      return [{ insertId: challenge.id, affectedRows: 1 }];
    }

    if (compact.includes('FROM challenges c JOIN users u ON u.id = c.mentor_id')) {
      return [challenges.filter((challenge) => !params.length || challenge.status === params[0])];
    }

    if (compact.startsWith('SELECT id, status, due_at FROM challenges WHERE id = ?')) {
      return [[challenges.find((challenge) => challenge.id === params[0])].filter(Boolean)];
    }

    if (compact.startsWith('SELECT mentor_id FROM challenges WHERE id = ?')) {
      return [[challenges.find((challenge) => challenge.id === params[0])].filter(Boolean)];
    }

    if (compact.startsWith('UPDATE challenges SET')) {
      return [{ affectedRows: 1 }];
    }

    if (compact.startsWith('INSERT INTO challenge_submissions')) {
      const [challengeId, studentId, answerText, attachmentPath] = params;
      let submission = submissions.find((entry) => entry.challenge_id === challengeId && entry.student_id === studentId);
      if (!submission) {
        submission = {
          id: nextSubmissionId++,
          challenge_id: challengeId,
          student_id: studentId,
          answer_text: answerText,
          attachment_path: attachmentPath,
          status: 'submitted',
          created_at: now(),
          updated_at: now(),
        };
        submissions.push(submission);
      } else {
        Object.assign(submission, {
          answer_text: answerText,
          attachment_path: attachmentPath,
          status: 'submitted',
          feedback_text: null,
          reviewed_by: null,
          reviewed_at: null,
        });
      }
      return [{ insertId: submission.id, affectedRows: 1 }];
    }

    if (compact.includes('FROM challenge_submissions s JOIN users u ON u.id = s.student_id')) {
      return [submissions
        .filter((submission) => submission.challenge_id === params[0])
        .map((submission) => ({
          ...submission,
          student_name: users.find((user) => user.id === submission.student_id)?.name,
        }))];
    }

    if (compact.includes('FROM challenge_submissions s JOIN challenges c ON c.id = s.challenge_id WHERE s.id = ?')) {
      const submission = submissions.find((entry) => entry.id === params[0]);
      const challenge = submission && challenges.find((entry) => entry.id === submission.challenge_id);
      return [[submission && { id: submission.id, mentor_id: challenge.mentor_id }].filter(Boolean)];
    }

    if (compact.startsWith('UPDATE challenge_submissions')) {
      const [status, feedbackText, reviewedBy, id] = params;
      const submission = submissions.find((entry) => entry.id === id);
      Object.assign(submission, { status, feedback_text: feedbackText, reviewed_by: reviewedBy, reviewed_at: now() });
      return [{ affectedRows: 1 }];
    }

    if (compact.includes('FROM challenge_submissions s JOIN challenges c ON c.id = s.challenge_id WHERE s.student_id = ?')) {
      return [submissions.filter((submission) => submission.student_id === params[0])];
    }

    if (compact.startsWith('INSERT INTO quiz_scores')) {
      const [name, topic, score] = params;
      quizScores.push({ id: nextQuizScoreId++, name, topic, score, created_at: now() });
      return [{ insertId: nextQuizScoreId - 1, affectedRows: 1 }];
    }

    if (compact.startsWith('INSERT INTO quiz_attempts')) {
      return [{ insertId: 1, affectedRows: 1 }];
    }

    if (compact.includes('FROM quiz_scores WHERE topic = ?')) {
      return [quizScores.filter((score) => score.topic === params[0])];
    }

    if (compact.includes('FROM quiz_scores ORDER BY')) {
      return [quizScores];
    }

    throw new Error(`Unhandled SQL in smoke test: ${compact}`);
  },
};

require.cache[require.resolve('../src/db')] = {
  id: require.resolve('../src/db'),
  filename: require.resolve('../src/db'),
  loaded: true,
  exports: mockPool,
};

const app = require('../src/app');

async function request(baseUrl, method, path, { token, body } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      ...(body ? { 'content-type': 'application/json' } : {}),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`${method} ${path} -> ${response.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

async function main() {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  try {
    await request(baseUrl, 'GET', '/api/health');

    const admin = await request(baseUrl, 'POST', '/api/auth/register', {
      body: { name: 'Admin FinLearn', email: 'admin@finlearn.local', password: 'Finlearn123!', role: 'student' },
    });
    const mentorPending = await request(baseUrl, 'POST', '/api/auth/register', {
      body: { name: 'Mentor Finansial', email: 'mentor@finlearn.local', password: 'Finlearn123!', role: 'mentor' },
    });
    const studentPending = await request(baseUrl, 'POST', '/api/auth/register', {
      body: { name: 'Student Demo', email: 'student@finlearn.local', password: 'Finlearn123!', role: 'student' },
    });

    await request(baseUrl, 'PATCH', `/api/admin/users/${mentorPending.user.id}/approve`, { token: admin.token });
    await request(baseUrl, 'PATCH', `/api/admin/users/${studentPending.user.id}/approve`, { token: admin.token });
    await request(baseUrl, 'PATCH', `/api/admin/users/${studentPending.user.id}/role`, {
      token: admin.token,
      body: { role: 'student' },
    });
    await request(baseUrl, 'GET', '/api/admin/users?status=approved', { token: admin.token });

    const mentor = await request(baseUrl, 'POST', '/api/auth/login', {
      body: { email: 'mentor@finlearn.local', password: 'Finlearn123!' },
    });
    const student = await request(baseUrl, 'POST', '/api/auth/login', {
      body: { email: 'student@finlearn.local', password: 'Finlearn123!' },
    });

    const material = await request(baseUrl, 'POST', '/api/materials', {
      token: mentor.token,
      body: {
        title: 'Budgeting 50/30/20 untuk Mahasiswa',
        topic: 'budgeting',
        summary: 'Demo materi MS2',
        content: 'Materi ini menjelaskan budgeting mahasiswa dengan contoh kebutuhan, keinginan, dan tabungan.',
        status: 'published',
      },
    });
    await request(baseUrl, 'GET', '/api/materials');
    await request(baseUrl, 'GET', `/api/materials/${material.slug}`);

    const challenge = await request(baseUrl, 'POST', '/api/challenges', {
      token: mentor.token,
      body: {
        title: 'Buat Budget Mingguan',
        description: 'Susun budget 7 hari dengan kategori kebutuhan, keinginan, dan tabungan.',
        status: 'published',
      },
    });
    await request(baseUrl, 'GET', '/api/challenges');
    await request(baseUrl, 'POST', `/api/challenges/${challenge.id}/submissions`, {
      token: student.token,
      body: { answer_text: '55% kebutuhan, 25% keinginan, 20% tabungan.' },
    });
    const submissionList = await request(baseUrl, 'GET', `/api/challenges/${challenge.id}/submissions`, { token: mentor.token });
    await request(baseUrl, 'PATCH', `/api/submissions/${submissionList[0].id}/feedback`, {
      token: mentor.token,
      body: { status: 'reviewed', feedback_text: 'Sudah bagus, tambahkan nominal per kategori.' },
    });
    await request(baseUrl, 'GET', '/api/submissions/mine', { token: student.token });

    await request(baseUrl, 'POST', '/api/quiz/submit', {
      token: student.token,
      body: { name: 'Student Demo', topic: 'compound-interest', score: 95 },
    });
    await request(baseUrl, 'GET', '/api/quiz/leaderboard?topic=compound-interest');

    console.log('Endpoint smoke test passed.');
    console.log(JSON.stringify({
      users: users.length,
      materials: materials.length,
      challenges: challenges.length,
      submissions: submissions.length,
      quizScores: quizScores.length,
      passwordHashWorks: await bcrypt.compare('Finlearn123!', users[0].password_hash),
    }, null, 2));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
