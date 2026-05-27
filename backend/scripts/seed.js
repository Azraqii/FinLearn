require('dotenv').config();

const fs = require('fs/promises');
const path = require('path');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function main() {
  const dbName = process.env.DB_NAME || 'finlearn';
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });

  const schemaPath = path.join(__dirname, '../schema.sql');
  const schemaSql = await fs.readFile(schemaPath, 'utf8');
  await connection.query(schemaSql);
  await connection.query(`USE \`${dbName}\``);

  const passwordHash = await bcrypt.hash('Finlearn123!', 12);

  await connection.execute(
    `INSERT INTO users (id, name, email, password_hash, role, status)
     VALUES
       (1, 'Admin FinLearn', 'admin@finlearn.local', ?, 'superadmin', 'approved'),
       (2, 'Mentor Finansial', 'mentor@finlearn.local', ?, 'mentor', 'approved'),
       (3, 'Student Demo', 'student@finlearn.local', ?, 'student', 'approved'),
       (4, 'Pending Mentor', 'pending-mentor@finlearn.local', ?, 'mentor', 'pending')
     ON DUPLICATE KEY UPDATE
       name = VALUES(name),
       password_hash = VALUES(password_hash),
       role = VALUES(role),
       status = VALUES(status)`,
    [passwordHash, passwordHash, passwordHash, passwordHash]
  );

  await connection.execute(
    `INSERT INTO materials
       (id, mentor_id, title, slug, topic, summary, content, thumbnail_path, status)
     VALUES
       (1, 2, 'Budgeting 50/30/20 untuk Mahasiswa', 'budgeting-503020-demo', 'budgeting',
        'Materi mentor tentang cara membagi uang saku ke kebutuhan, keinginan, dan tabungan.',
        'Budgeting membantu pelajar memberi tugas pada setiap rupiah sebelum uang dibelanjakan. Materi ini menjelaskan metode 50/30/20, contoh penyesuaian untuk mahasiswa, dan kebiasaan evaluasi mingguan.',
        NULL, 'published'),
       (2, 2, 'Inflasi dan Daya Beli', 'inflasi-daya-beli-demo', 'inflasi',
        'Materi tentang dampak inflasi terhadap uang saku dan target keuangan.',
        'Inflasi membuat jumlah uang yang sama membeli barang lebih sedikit dari waktu ke waktu. Materi ini menghubungkan data kurs dan harga aktual dengan keputusan finansial sehari-hari.',
        NULL, 'published')
     ON DUPLICATE KEY UPDATE
       title = VALUES(title),
       topic = VALUES(topic),
       summary = VALUES(summary),
       content = VALUES(content),
       status = VALUES(status)`,
    []
  );

  await connection.execute(
    `INSERT INTO challenges
       (id, mentor_id, title, description, due_at, attachment_path, status)
     VALUES
       (1, 2, 'Buat Budget Mingguan',
        'Susun budget 7 hari dengan kategori kebutuhan, keinginan, dan tabungan. Sertakan asumsi pemasukan dan alasan pembagian.',
        DATE_ADD(NOW(), INTERVAL 14 DAY), NULL, 'published'),
       (2, 2, 'Refleksi Inflasi',
        'Bandingkan dua harga kebutuhan rutin dan jelaskan bagaimana kenaikan harga memengaruhi rencana pengeluaran.',
        DATE_ADD(NOW(), INTERVAL 21 DAY), NULL, 'published')
     ON DUPLICATE KEY UPDATE
       title = VALUES(title),
       description = VALUES(description),
       due_at = VALUES(due_at),
       status = VALUES(status)`,
    []
  );

  await connection.execute(
    `INSERT INTO challenge_submissions
       (challenge_id, student_id, answer_text, attachment_path, status, feedback_text, reviewed_by, reviewed_at)
     VALUES
       (1, 3, 'Budget mingguan saya: 55% kebutuhan, 25% keinginan, 20% tabungan. Pos kebutuhan lebih besar karena transportasi kampus.', NULL, 'reviewed',
        'Pembagian sudah realistis. Tambahkan rincian nominal agar evaluasi mingguan lebih mudah.', 2, NOW())
     ON DUPLICATE KEY UPDATE
       answer_text = VALUES(answer_text),
       status = VALUES(status),
       feedback_text = VALUES(feedback_text),
       reviewed_by = VALUES(reviewed_by),
       reviewed_at = VALUES(reviewed_at)`,
    []
  );

  await connection.execute(
    `INSERT INTO quiz_scores (name, topic, score)
     VALUES
       ('Student Demo', 'budgeting', 90),
       ('Mentor Finansial', 'inflasi', 85),
       ('Bryant', 'compound-interest', 95)`,
    []
  );

  await connection.end();
  console.log('Seed completed.');
  console.log('Demo password for all seeded users: Finlearn123!');
}

main().catch((err) => {
  console.error('Seed failed:', err.message || err.code || err.name || 'Unknown error');
  if (err.errors) {
    for (const child of err.errors) {
      console.error('-', child.code || child.message);
    }
  }
  process.exit(1);
});
