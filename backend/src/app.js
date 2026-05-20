const express = require('express');
const cors    = require('cors');

const quizRoutes     = require('./routes/quiz');
const currencyRoutes = require('./routes/currency');

const app = express();

// CORS — in development allow any localhost port (Vite may pick any free port)
//        in production use CORS_ORIGINS env var (comma-separated)
const isProduction = process.env.NODE_ENV === 'production';

const productionOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

function corsOrigin(origin, callback) {
  // Non-browser requests (curl, Postman, server-to-server) have no origin
  if (!origin) return callback(null, true);

  if (!isProduction) {
    // Allow any localhost / 127.0.0.1 port during development
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
  }

  if (productionOrigins.includes(origin)) {
    return callback(null, true);
  }

  callback(new Error(`CORS: origin not allowed — ${origin}`));
}

app.use(cors({ origin: corsOrigin }));

// Parse JSON request bodies
app.use(express.json());

// Health check — no DB or external calls, always fast
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Feature routes
app.use('/api/quiz',     quizRoutes);
app.use('/api/currency', currencyRoutes);

// 404 handler for unmatched routes
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Central error handler — never expose stack traces in production
app.use((err, _req, res, _next) => {
  console.error('[unhandled error]', err);
  const body = { error: 'Internal server error' };
  if (process.env.NODE_ENV === 'development') body.detail = err.message;
  res.status(500).json(body);
});

module.exports = app;
