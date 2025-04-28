const express = require('express');
const db = require('../db/client');
const { hashPassword, comparePassword } = require('../utils/hash');
const { signToken } = require('../utils/jwt');
const { authRequired } = require('../middleware/authRequired');

const authRouter = express.Router();

// POST /api/auth/register
authRouter.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashed = await hashPassword(password);
    const { rows } = await db.query(
      `INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email`,
      [username, email, hashed]
    );
    const user = rows[0];
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await db.query('SELECT * FROM users WHERE email=$1', [email]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken(user);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
authRouter.get('/me', authRequired, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, username, email FROM users WHERE id=$1', [req.user.id]);
    const user = rows[0];
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { authRouter };

