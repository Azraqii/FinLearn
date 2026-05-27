# FinLearn — Backend Context

## Overview
Backend FinLearn dibangun dengan Node.js + Express.js.
Menyediakan REST API untuk auth/role, approval admin, materi, challenge, submission,
kuis, leaderboard, upload file, dan data kurs mata uang.
Database menggunakan MySQL yang di-host sendiri via aaPanel.

## Stack
- **Runtime**: Node.js (v22+)
- **Framework**: Express.js
- **Database**: MySQL via `mysql2`
- **External API**: CoinGecko API
- **Utilities**: dotenv, cors, axios, bcryptjs, jsonwebtoken, multer, nodemon (dev)

## Folder Structure
```
backend/
├── src/
│   ├── routes/
│   │   ├── auth.js          # register/login/me
│   │   ├── admin.js         # approval user
│   │   ├── materials.js     # materi mentor
│   │   ├── challenges.js    # challenge mentor dan submit student
│   │   ├── submissions.js   # feedback submission
│   │   ├── uploads.js       # upload file non-teks
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
| POST   | /api/auth/register        | Registrasi user; user pertama jadi superadmin |
| POST   | /api/auth/login           | Login dan ambil JWT                    |
| GET    | /api/auth/me              | Profil user login                      |
| GET    | /api/admin/users          | Superadmin melihat user                |
| PATCH  | /api/admin/users/:id/status | Superadmin approve/reject user       |
| GET    | /api/materials            | Daftar materi                          |
| POST   | /api/materials            | Mentor/superadmin membuat materi      |
| PATCH  | /api/materials/:id        | Mentor/superadmin mengubah materi     |
| GET    | /api/challenges           | Daftar challenge                       |
| POST   | /api/challenges           | Mentor/superadmin membuat challenge   |
| PATCH  | /api/challenges/:id       | Mentor/superadmin mengubah challenge  |
| POST   | /api/challenges/:id/submissions | Student submit challenge       |
| GET    | /api/challenges/:id/submissions | Mentor melihat submission       |
| GET    | /api/submissions/mine     | Student melihat feedback submission   |
| PATCH  | /api/submissions/:id/feedback | Mentor memberi feedback          |
| POST   | /api/uploads              | Upload gambar/gif/pdf                 |
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
Tabel utama MS2: `users`, `materials`, `quiz_scores`, `quiz_attempts`,
`challenges`, dan `challenge_submissions`. Lihat `schema.sql` untuk DDL lengkap.
Jalankan `schema.sql` ini di phpMyAdmin (via aaPanel) atau lewat MySQL CLI.

## Environment Variables
```
# backend/.env.example
PORT=3000
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=7d
UPLOAD_DIR=./uploads
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=finlearn
COINGECKO_API_URL=https://api.coingecko.com/api/v3/simple/price?ids=usd-coin,bitcoin,ethereum&vs_currencies=usd,idr,sgd,myr,jpy
```

## Dev Commands
```bash
npm install
npm run dev     # nodemon server.js — auto restart on change
npm start       # node server.js — untuk production di aaPanel
npm run seed    # apply schema.sql dan isi data demo MS2
npm run test:endpoints # smoke test endpoint dengan mock DB lokal
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
- Cache response CoinGecko API di memori (simpan timestamp), jangan hit API setiap request
- Validasi input di setiap endpoint sebelum query ke DB
- Jangan expose stack trace di response error production
- File `.env` tidak boleh di-commit, pastikan ada di `.gitignore`
