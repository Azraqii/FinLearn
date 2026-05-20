require('dotenv').config();

const app  = require('./src/app');
const pool = require('./src/db');

const PORT = parseInt(process.env.PORT || '3000', 10);

// Verify DB connectivity before accepting traffic
pool.getConnection()
  .then(conn => {
    conn.release();
    app.listen(PORT, () => {
      console.log(`FinLearn API running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MySQL:', err.message);
    process.exit(1);
  });
