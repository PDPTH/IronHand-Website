const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// 1) CORS ve JSON desteği
app.use(cors());
app.use(express.json());

// 2) Health check endpoint
app.get('/health', (req, res) => res.status(200).send('OK'));

// 3) API route'ları
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));

// 4) Production: Front‑end statik dosyalarını servis et
if (process.env.NODE_ENV === 'production') {
  // front‑end build klasörünüzün yolu (monorepo’da ../front-end/dist olabilir)
  const distPath = path.join(__dirname, '../front-end/dist');
  app.use(express.static(distPath));

  // Her GET isteğinde index.html döner (SPA routing için)
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// 5) Sunucuyu başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API http://localhost:${PORT} üzerinde çalışıyor. NODE_ENV=${process.env.NODE_ENV}`);
});
