const express = require('express');
const router = express.Router();
const pool = require('../db');

// Listeleme + arama + filtre
router.get('/', async (req, res) => {
  let sql = 'SELECT * FROM products';
  const params = [];
  if (req.query.search || req.query.category) {
    sql += ' WHERE';
    if (req.query.search) {
      sql += ' name ILIKE $1';
      params.push(`%${req.query.search}%`);
    }
    if (req.query.category) {
      if (params.length) sql += ' AND';
      sql += ' category = $2';
      params.push(req.query.category);
    }
  }
  try {
    const products = await pool.query(sql, params);
    res.json(products.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (!product.rows.length) return res.status(404).json({ error: 'Product not found' });
    res.json(product.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
