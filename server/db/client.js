const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost/review_site';

const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
