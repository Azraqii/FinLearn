-- FinLearn database schema (MySQL)
-- Run once in phpMyAdmin (aaPanel) or MySQL CLI before starting the server

CREATE DATABASE IF NOT EXISTS finlearn;
USE finlearn;

CREATE TABLE IF NOT EXISTS quiz_scores (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  topic      VARCHAR(50)  NOT NULL,
  score      INT          NOT NULL,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);
