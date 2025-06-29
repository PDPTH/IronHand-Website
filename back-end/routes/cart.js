const express = require('express');
const router = express.Router();
const pool = require('../db');

// Auth middleware
function auth(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ error: 'Token required.' });
  const token = header.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token missing.' });
  require('jsonwebtoken').verify(token, 'ironhand-secret-key', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });
    req.user = user;
    next();
  });
}

// Sepete ürün ekle
router.post('/', auth, async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    await pool.query(
      `INSERT INTO carts (user_id, product_id, quantity) VALUES ($1, $2, $3)
       ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = carts.quantity + $3`,
      [req.user.id, productId, quantity]
    );
    res.json({ message: 'Product added to cart.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sepeti görüntüle
router.get('/:userId', auth, async (req, res) => {
  try {
    const cart = await pool.query('SELECT * FROM carts WHERE user_id = $1', [req.params.userId]);
    res.json(cart.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sepetten ürün sil
router.delete('/:userId/:productId', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM carts WHERE user_id = $1 AND product_id = $2', [req.params.userId, req.params.productId]);
    res.json({ message: 'Product removed from cart.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
