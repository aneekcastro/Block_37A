const express = require('express');
const db = require('../db/client');
const { authRequired } = require('../middleware/authRequired');

const commentsRouter = express.Router();

// POST /api/items/:itemId/reviews/:reviewId/comments
commentsRouter.post('/items/:itemId/reviews/:reviewId/comments', authRequired, async (req, res) => {
  const { text } = req.body;
  const userId = req.user.id;
  const reviewId = req.params.reviewId;

  try {
    const { rows } = await db.query(
      `INSERT INTO comments (review_id, user_id, text) VALUES ($1, $2, $3) RETURNING *`,
      [reviewId, userId, text]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/comments/me
commentsRouter.get('/comments/me', authRequired, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT * FROM comments WHERE user_id=$1`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/:userId/comments/:commentId
commentsRouter.put('/users/:userId/comments/:commentId', authRequired, async (req, res) => {
  const { text } = req.body;
  try {
    const { rows } = await db.query(
      `UPDATE comments SET text=$1, updated_at=NOW() WHERE id=$2 AND user_id=$3 RETURNING *`,
      [text, req.params.commentId, req.params.userId]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/users/:userId/comments/:commentId
commentsRouter.delete('/users/:userId/comments/:commentId', authRequired, async (req, res) => {
  try {
    await db.query(
      `DELETE FROM comments WHERE id=$1 AND user_id=$2`,
      [req.params.commentId, req.params.userId]
    );
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { commentsRouter };

