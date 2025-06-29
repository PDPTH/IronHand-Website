-- Kullanıcılar tablosu
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255)
);

-- Ürünler (Roketler) tablosu
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    price NUMERIC(10,2),
    image TEXT,
    category VARCHAR(50),
    stock INTEGER
);

-- Sepet tablosu
CREATE TABLE IF NOT EXISTS carts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER
);

-- Sipariş tablosu
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total_price NUMERIC(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sipariş ürünleri tablosu
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER,
    price NUMERIC(10,2)
);

-- Örnek kullanıcılar
INSERT INTO users (name, email, password) VALUES
('Uzay Mühendisi', 'uzay@rocketmail.com', '$2a$08$Q4j1YQm1TcJ9rFjGfICwBeTkJ0MPtq8I1UeW8/So1n6LzKfO6x1Aq'), -- şifre: 123456
('Roket Seven', 'roket@model.com', '$2a$08$Q4j1YQm1TcJ9rFjGfICwBeTkJ0MPtq8I1UeW8/So1n6LzKfO6x1Aq');   -- şifre: 123456

-- Örnek roket ürünleri
INSERT INTO products (name, description, price, image, category, stock) VALUES
('Model Roket X-1', 'Başlangıç seviyesinde model roket seti. Maksimum irtifa: 300m.', 899.99, 'x1.jpg', 'Başlangıç', 25),
('Model Roket Falcon', 'Yüksek irtifaya çıkan, dayanıklı kompozit gövde.', 1599.50, 'falcon.jpg', 'İleri Seviye', 10),
('Roket Motoru C6-5', 'C tipi model roket motoru. 10’lu paket.', 499.00, 'c6-5.jpg', 'Motor', 50),
('Paraşüt Takımı 18cm', 'Model roketler için yedek paraşüt seti.', 149.00, 'parasut.jpg', 'Aksesuar', 30),
('Başlatıcı Pad Mini', 'Kompakt model roket fırlatma pisti.', 399.00, 'pad-mini.jpg', 'Fırlatma', 20),
('Altimetre Modülü', 'Uçuş yüksekliğini ölçen roket altimetresi.', 990.00, 'altimetre.jpg', 'Elektronik', 8);
