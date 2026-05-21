# FinLearn

FinLearn is a financial literacy learning platform built to help Indonesian students understand basic personal finance concepts in a simple and practical way. The platform focuses on three core topics: **Budgeting**, **Inflation**, and **Compound Interest**.

This project was developed as part of a Teknologi Platform assignment. The goal is not only to build a working educational website, but also to demonstrate an end-to-end platform development process, including frontend development, backend API, database integration, Linux server setup, aaPanel configuration, deployment with Nginx, and public access through Cloudflare Tunnel.

---

## Project Overview

FinLearn provides a simple learning flow for users who want to understand basic financial concepts without needing to create an account. Users can read short learning materials, take topic-based quizzes, calculate compound interest, view real-time financial data, and check quiz scores on the leaderboard.

The platform does not use login or registration. Users only enter their name before taking a quiz, making the experience lightweight and suitable for a student project with a clear scope.

Live platform:

```txt
https://app-finlearn.stei.my.id
````

---

## Main Features

### Learning Materials

FinLearn includes three financial literacy topics:

* **Budgeting**
  Explains how to manage income and expenses, including the 50/30/20 budgeting method.

* **Inflation**
  Explains what inflation is, why prices increase, and how inflation affects purchasing power.

* **Compound Interest**
  Explains how compound interest works, why time matters, and how money can grow over the long term.

Each topic is presented as an article page with a reading progress indicator.

---

### Interactive Quiz

Each topic has a quiz with 5 multiple-choice questions. Users enter their name before starting, answer questions one by one, and receive their final score after completing all questions.

Quiz flow:

1. Choose a topic.
2. Enter name.
3. Answer 5 questions.
4. View final score.
5. Review correct and incorrect answers.
6. Submit score to backend.
7. View leaderboard.

If the backend is unavailable, the frontend can temporarily store quiz scores using local browser storage for demo purposes.

---

### Compound Interest Calculator

The calculator helps users simulate how money grows with compound interest.

Inputs:

* Initial principal
* Annual interest rate
* Time period
* Compounding frequency

Outputs:

* Final value
* Total interest earned
* Yearly growth table
* Simple growth visualization

Formula used:

```txt
A = P(1 + r/n)^(nt)
```

---

### Currency and Market Widget

The Home page includes a real-time financial data widget. The data is retrieved from the backend, which integrates with CoinGecko API.

Displayed data includes:

* USD to IDR exchange estimate
* Bitcoin price
* Ethereum price
* Last updated timestamp

This feature connects the learning content with real financial data, especially for topics such as inflation and exchange rates.

---

### Leaderboard

The leaderboard displays top quiz scores.

Displayed columns:

* Rank
* Name
* Topic
* Score
* Date

The leaderboard data is taken from the backend and stored in the database.

---

## Tech Stack

### Frontend

| Technology      | Purpose                           |
| --------------- | --------------------------------- |
| React 18        | Main frontend framework           |
| Vite            | Development server and build tool |
| Tailwind CSS    | Styling and responsive layout     |
| React Router v6 | Page routing                      |
| Axios           | API communication                 |

### Backend

| Technology      | Purpose                         |
| --------------- | ------------------------------- |
| Node.js         | Backend runtime                 |
| Express.js      | REST API framework              |
| MySQL / MariaDB | Database                        |
| mysql2          | Database connection             |
| Axios           | External API request            |
| dotenv          | Environment variable management |

### Deployment and Platform

| Technology        | Purpose                                     |
| ----------------- | ------------------------------------------- |
| VMware Fusion     | Virtual machine environment                 |
| Ubuntu Linux      | Server operating system                     |
| aaPanel           | Server management panel                     |
| Nginx             | Serving frontend production build           |
| Cloudflare Tunnel | Public access without exposing server ports |
| CoinGecko API     | External financial data                     |
| Claude Code CLI   | Vibe-coding assistant                       |
| GPT Codex         | Vibe-coding assistant for code refinement   |

---

## Project Structure

```txt
FinLearn/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── db.js
│   ├── schema.sql
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env.example
│
└── README.md
```

---

## Frontend Routes

| Route                 | Description                     |
| --------------------- | ------------------------------- |
| `/`                   | Home page                       |
| `/learn`              | List of learning topics         |
| `/learn/:topic`       | Article page for selected topic |
| `/quiz`               | Quiz topic selection            |
| `/quiz/:topic`        | Quiz play page                  |
| `/quiz/:topic/result` | Quiz result page                |
| `/calculator`         | Compound interest calculator    |
| `/leaderboard`        | Quiz leaderboard                |

---

## Backend API

### Health Check

```http
GET /api/health
```

Used to check whether the backend server is running.

---

### Submit Quiz Score

```http
POST /api/quiz/submit
```

Request body:

```json
{
  "name": "Stephanie",
  "topic": "budgeting",
  "score": 80
}
```

Used to save quiz scores into the database.

---

### Get Leaderboard

```http
GET /api/quiz/leaderboard
```

Used to retrieve top quiz scores.

---

### Get Currency Data

```http
GET /api/currency/rates
```

Used to retrieve currency and crypto market data from the backend.

---

## Database

The database uses MySQL/MariaDB.

Main table:

```sql
CREATE TABLE IF NOT EXISTS quiz_scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  topic VARCHAR(50) NOT NULL,
  score INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

The `quiz_scores` table stores user quiz results, including name, topic, score, and submission time.

---

## Deployment Overview

The platform is deployed inside an Ubuntu virtual machine.

Deployment flow:

1. Frontend is built using Vite.
2. The production build is copied to `/var/www/html/`.
3. Nginx serves the frontend through port 80.
4. Express backend runs on port 3000.
5. MariaDB stores quiz score data.
6. Cloudflare Tunnel exposes the platform publicly through a domain.

Build frontend:

```bash
cd frontend
npm run build
sudo cp -r dist/* /var/www/html/
```

Public access is handled through Cloudflare Tunnel:

```txt
https://app-finlearn.stei.my.id
```

---

## Vibe-Coding Workflow

FinLearn was developed with support from AI coding assistants, mainly Claude Code CLI and GPT Codex. These tools helped speed up development, code refinement, debugging, and UI improvements.

The generated code was still reviewed and adjusted manually to match the project requirements, repository structure, deployment setup, and application logic.

---

## Notes

* This project is made for learning purposes.
* The platform does not include authentication.
* Quiz scores are submitted using a simple name input.
* Financial learning content is stored directly in the frontend.
* Backend handles quiz score submission, leaderboard data, and external API integration.
* CoinGecko API is used for real-time financial data.
* The calculator is for educational simulation only.

---

## Disclaimer

FinLearn is an educational project. The content, calculator output, and financial data shown in the platform should not be treated as financial advice or investment recommendations.

```
```