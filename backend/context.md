# FinLearn — Backend Context

## Overview
Backend FinLearn dibangun dengan Node.js + Express.js.
Menyediakan REST API untuk kuis, leaderboard, dan data kurs mata uang.
Database menggunakan MySQL yang di-host sendiri via aaPanel.

## Stack
- **Runtime**: Node.js (v22+)
- **Framework**: Express.js
- **Database**: MySQL via `mysql2`
- **External API**: ExchangeRate-API (https://www.exchangerate-api.com/)
- **Utilities**: dotenv, cors, axios, nodemon (dev)

## Folder Structure
```
backend/
├── src/
│   ├── routes/
│   │   ├── quiz.js          # POST /api/quiz/submit, GET /api/quiz/leaderboard
│   │   └── currency.js      # GET /api/currency/rates
│   ├── controllers/
│   │   ├── quizController.js
│   │   └── currencyController.js
│   ├── db.js                # MySQL connection pool
│   └── app.js               # Express app setup, middleware, route mounting
├── server.js                # Entry point, listen di PORT
├── .env.example
├── package.json
└── schema.sql               # DDL untuk setup database MySQL
```

## API Endpoints
| Method | Endpoint                  | Deskripsi                              |
|--------|---------------------------|----------------------------------------|
| GET    | /api/health               | Health check                           |
| POST   | /api/quiz/submit          | Simpan hasil kuis ke DB                |
| GET    | /api/quiz/leaderboard     | Ambil top 10 skor dari DB              |
| GET    | /api/currency/rates       | Kurs USD/IDR real-time (cache 1 jam)   |

## Request / Response Shapes
```
POST /api/quiz/submit
Body: { "name": "Bryant", "topic": "budgeting", "score": 80 }
Response: { "success": true, "id": 1 }

GET /api/quiz/leaderboard
Response: [{ "id": 1, "name": "Bryant", "topic": "budgeting", "score": 80, "created_at": "..." }]

GET /api/currency/rates
Response: { "base": "USD", "rates": { "IDR": 16300, "SGD": 1.34, ... }, "updated_at": "..." }
```

## Database Schema
```sql
-- schema.sql
CREATE DATABASE IF NOT EXISTS finlearn;
USE finlearn;

CREATE TABLE IF NOT EXISTS quiz_scores (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  topic       VARCHAR(50)  NOT NULL,
  score       INT          NOT NULL,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);
```
Jalankan `schema.sql` ini di phpMyAdmin (via aaPanel) atau lewat MySQL CLI.

## Environment Variables
```
# backend/.env.example
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=finlearn
EXCHANGE_API_KEY=your_exchangerate_api_key
EXCHANGE_API_URL=https://v6.exchangerate-api.com/v6
```
Daftar API key gratis di https://www.exchangerate-api.com/ (1500 req/bulan).

## Dev Commands
```bash
npm install
npm run dev     # nodemon server.js — auto restart on change
npm start       # node server.js — untuk production di aaPanel
```

## Deployment di aaPanel
- Path: `/www/wwwroot/finlearn-backend`
- Run opt: `start [node server.js]` atau gunakan startup script
- Port: 3000
- Pastikan port 3000 di-allow di UFW: `sudo ufw allow 3000`

## CORS Configuration
Backend harus mengizinkan request dari domain frontend:
```js
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://finlearn.stei.cloud'  // ganti sesuai subdomain aktual
  ]
}))
```

## Notes untuk AI Agent
- Gunakan connection pool (`mysql2/promise`), bukan single connection
- Semua query pakai prepared statements, jangan string concatenation
- Cache response ExchangeRate API di memori (simpan timestamp), jangan hit API setiap request
- Validasi input di setiap endpoint sebelum query ke DB
- Jangan expose stack trace di response error production
- File `.env` tidak boleh di-commit, pastikan ada di `.gitignore`