# FinLearn — Frontend Context

## Overview
Frontend FinLearn dibangun dengan React 18 + Vite.
Bertanggung jawab atas seluruh tampilan dan interaksi pengguna.

## Stack
- **Framework**: React 18
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router v6

## Folder Structure
```
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/        # Komponen reusable (Navbar, Card, Button, dll)
│   ├── pages/
│   │   ├── Home.jsx       # Landing page
│   │   ├── Learn.jsx      # Halaman daftar materi
│   │   ├── Article.jsx    # Detail artikel per topik
│   │   ├── Quiz.jsx       # Halaman kuis interaktif
│   │   ├── Calculator.jsx # Kalkulator compound interest
│   │   └── Leaderboard.jsx# Leaderboard skor kuis
│   ├── services/
│   │   └── api.js         # Semua axios call ke backend
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── package.json
└── vite.config.js
```

## Pages & Responsibilities
| Page            | Deskripsi                                              |
|-----------------|--------------------------------------------------------|
| Home            | Hero section, ringkasan fitur, CTA ke materi & kuis   |
| Learn           | Grid kartu topik (budgeting, inflasi, compound interest)|
| Article         | Konten materi per topik, static content                |
| Quiz            | Soal multiple choice per topik, submit skor ke backend |
| Calculator      | Input principal, rate, tahun → output grafik/tabel     |
| Leaderboard     | Tabel top 10 skor dari backend                         |

## Environment Variables
```
# frontend/.env.example
VITE_API_BASE_URL=http://localhost:3000
```
Saat production, ganti dengan URL backend yang sudah di-deploy.

## API Integration
Semua call ke backend dilakukan melalui `src/services/api.js`:
```js
// Contoh
export const submitQuiz = (data) => axios.post('/api/quiz/submit', data)
export const getLeaderboard = () => axios.get('/api/quiz/leaderboard')
export const getCurrencyRates = () => axios.get('/api/currency/rates')
```
Gunakan mock data lokal dulu sebelum backend siap.

## Coding Conventions
- Gunakan functional components + hooks
- Satu file per komponen/page
- Nama file: PascalCase untuk komponen, camelCase untuk utilities
- Jangan hardcode URL API, selalu pakai `import.meta.env.VITE_API_BASE_URL`

## Dev Commands
```bash
npm install
npm run dev       # development server di localhost:5173
npm run build     # build untuk production ke folder dist/
npm run preview   # preview build hasil
```

## Notes untuk AI Agent
- Jangan install library berat yang tidak perlu
- Prioritaskan fungsionalitas dulu, styling belakangan
- Semua data kuis dan materi boleh di-hardcode dulu di frontend
- Gunakan Tailwind utility classes, jangan custom CSS kecuali terpaksa
- Komponen harus responsive (mobile-friendly)