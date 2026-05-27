-- FinLearn database schema (MySQL)
-- Run once in phpMyAdmin (aaPanel) or MySQL CLI before starting the server

CREATE DATABASE IF NOT EXISTS finlearn;
USE finlearn;

CREATE TABLE IF NOT EXISTS users (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(100) NOT NULL,
  email           VARCHAR(150) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  role            ENUM('superadmin', 'mentor', 'student') NOT NULL DEFAULT 'student',
  status          ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_scores (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  topic      VARCHAR(50)  NOT NULL,
  score      INT          NOT NULL,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS materials (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  mentor_id       INT NOT NULL,
  title           VARCHAR(160) NOT NULL,
  slug            VARCHAR(180) NOT NULL UNIQUE,
  topic           VARCHAR(80) NOT NULL,
  summary         TEXT,
  content         LONGTEXT NOT NULL,
  thumbnail_path  VARCHAR(255),
  status          ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (mentor_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NULL,
  name        VARCHAR(100) NOT NULL,
  topic       VARCHAR(50) NOT NULL,
  score       INT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS challenges (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  mentor_id        INT NOT NULL,
  title            VARCHAR(160) NOT NULL,
  description      TEXT NOT NULL,
  due_at           DATETIME NULL,
  attachment_path  VARCHAR(255),
  status           ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (mentor_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS challenge_submissions (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  challenge_id     INT NOT NULL,
  student_id       INT NOT NULL,
  answer_text      TEXT,
  attachment_path  VARCHAR(255),
  status           ENUM('submitted', 'reviewed', 'accepted', 'needs_revision') NOT NULL DEFAULT 'submitted',
  feedback_text    TEXT,
  reviewed_by      INT NULL,
  reviewed_at      DATETIME NULL,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY uq_challenge_student (challenge_id, student_id)
);
