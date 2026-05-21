# FinLearn — Root Context

## Project Overview
FinLearn adalah platform edukasi finansial interaktif berbasis web.
Dibangun sebagai tugas mata kuliah II2210 Teknologi Platform ITB.

## Tema
Education & Learning Tools — fokus pada literasi keuangan personal
untuk pelajar Indonesia.

## Monorepo Structure
```
finlearn/
├── frontend/       # React + Vite (UI, halaman materi, kuis, kalkulator)
├── backend/        # Node.js + Express (REST API, integrasi DB & API eksternal)
├── CONTEXT.md      # File ini
└── README.md
```

## Tech Stack
| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | React 18, Vite, Tailwind CSS      |
| Backend     | Node.js, Express.js               |
| Database    | MySQL (self-hosted via aaPanel)   |
| External API| ExchangeRate-API (kurs real-time) |
| Deployment  | aaPanel + Cloudflare Tunnel       |
| VPS/VM      | VMware + Ubuntu 24.04 LTS         |

## Platform Features
1. Halaman materi edukasi (budgeting, inflasi, compound interest)
2. Kalkulator compound interest interaktif
3. Kuis per topik dengan multiple choice
4. Skor kuis tersimpan di database MySQL
5. Leaderboard skor kuis
6. Tampilan kurs mata uang real-time (via ExchangeRate API)

## API Contract
```
POST   /api/quiz/submit         → simpan hasil kuis { name, topic, score }
GET    /api/quiz/leaderboard    → ambil top 10 skor
GET    /api/currency/rates      → kurs USD/IDR real-time dari API eksternal
GET    /api/health              → health check endpoint
```

## Team
- **Bryant Azraqi** — DevOps + Backend (infra, Express, MySQL, API eksternal)
- **[Partner]** — Frontend (React Vite, UI/UX, koneksi ke backend)

## Deployment Info
- Panel Manajemen: aaPanel (self-hosted di Ubuntu VM)
- Tunnel: Cloudflare Zero Trust Tunnel
- Domain: `*.stei.cloud` atau `*.stei.my.id`
- Frontend port: 5173 (dev) / 80 (prod via aaPanel)
- Backend port: 3000

## Environment Variables
Lihat masing-masing `backend/.env.example` dan `frontend/.env.example`.
Jangan pernah commit file `.env` asli ke repo.

## Deadline
- Pairing form: Rabu, 20 Mei 2026 23.59
- Pengumpulan Tugas 1: Kamis, 21 Mei 2026 09.59