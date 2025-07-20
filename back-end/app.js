const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
// Health check
app.get('/health', (req, res) => res.status(200).send('OK'));


// Route'ları ekle
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API http://localhost:${PORT} üzerinde çalışıyor.`));
