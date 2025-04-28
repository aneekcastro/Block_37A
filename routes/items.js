const express = require('express');
const db = require('../db/client');

const itemsRouter = express.Router();

// GET /api/items
itemsRouter.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM items');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/items/:itemId
itemsRouter.get('/:itemId', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM items WHERE id=$1', [req.params.itemId]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/items/:itemId/reviews
itemsRouter.get('/:itemId/reviews', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT r.*, u.username 
       FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.item_id=$1`,
      [req.params.itemId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { itemsRouter };

