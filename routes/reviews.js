const express = require('express');
const db = require('../db/client');
const { authRequired } = require('../middleware/authRequired');

const reviewsRouter = express.Router();

// POST /api/items/:itemId/reviews
reviewsRouter.post('/items/:itemId/reviews', authRequired, async (req, res) => {
  const { text, rating } = req.body;
  const userId = req.user.id;
  const itemId = req.params.itemId;

  try {
    const { rows } = await db.query(
      `INSERT INTO reviews (user_id, item_id, text, rating) VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, itemId, text, rating]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reviews/me
reviewsRouter.get('/reviews/me', authRequired, async (req, res) => {
  try {
    const { rows } = await db.query(`SELECT * FROM reviews WHERE user_id=$1`, [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/:userId/reviews/:reviewId
reviewsRouter.put('/users/:userId/reviews/:reviewId', authRequired, async (req, res) => {
  const { text, rating } = req.body;
  try {
    const { rows } = await db.query(
      `UPDATE reviews SET text=$1, rating=$2, updated_at=NOW() WHERE id=$3 AND user_id=$4 RETURNING *`,
      [text, rating, req.params.reviewId, req.params.userId]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/users/:userId/reviews/:reviewId
reviewsRouter.delete('/users/:userId/reviews/:reviewId', authRequired, async (req, res) => {
  try {
    await db.query(
      `DELETE FROM reviews WHERE id=$1 AND user_id=$2`,
      [req.params.reviewId, req.params.userId]
    );
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { reviewsRouter };
