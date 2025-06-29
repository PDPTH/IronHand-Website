const express = require('express');
const router = express.Router();
const pool = require('../db');

// Auth middleware (aynı şekilde cart.js'tekiyle kullanılabilir)
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

// Sipariş oluştur
router.post('/', auth, async (req, res) => {
  try {
    const cartItems = await pool.query('SELECT * FROM carts WHERE user_id = $1', [req.user.id]);
    if (!cartItems.rows.length) return res.status(400).json({ error: 'Cart is empty.' });

    let total = 0;
    cartItems.rows.forEach(item => total += item.quantity); // Fiyatı ürün tablosundan da çekebilirsin

    const orderRes = await pool.query(
      'INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING id',
      [req.user.id, total]
    );
    const orderId = orderRes.rows[0].id;

    for (let item of cartItems.rows) {
      await pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.product_id, item.quantity, 0]
      );
    }
    await pool.query('DELETE FROM carts WHERE user_id = $1', [req.user.id]);
    res.json({ message: 'Order created.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Siparişleri listele
router.get('/:userId', auth, async (req, res) => {
  try {
    const orders = await pool.query('SELECT * FROM orders WHERE user_id = $1', [req.params.userId]);
    res.json(orders.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
