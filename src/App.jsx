
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

const categories = ["Model Roketler", "Roket Motorları", "Roket aksesuarları", "Kurtarma Ekipmanları"];
const products = [
  { id: 1, name: "Roket Seti A", category: "Model Roketler", price: 120 },
  { id: 2, name: "Roket Seti B", category: "Model Roketler", price: 140 },
  { id: 3, name: "Roket Seti C", category: "Model Roketler", price: 160 },
  { id: 4, name: "A Tipi Motor", category: "Roket Motorları", price: 60 },
  { id: 5, name: "B Tipi Motor", category: "Roket Motorları", price: 80 },
  { id: 6, name: "C Tipi Motor", category: "Roket Motorları", price: 100 },
  { id: 7, name: "Atış Rampası", category: "Roket aksesuarları", price: 75 },
  { id: 8, name: "Atış Kumandası", category: "Roket aksesuarları", price: 55 },
  { id: 9, name: "Ateşleme Teli", category: "Roket aksesuarları", price: 35 },
  { id: 10, name: "Paraşüt", category: "Kurtarma Ekipmanları", price: 45 },
  { id: 11, name: "M8 Mapa", category: "Kurtarma Ekipmanları", price: 25 },
  { id: 12, name: "Karabina", category: "Kurtarma Ekipmanları", price: 20 },
  { id: 13, name: "Şok Kordonu", category: "Kurtarma Ekipmanları", price: 30 }
];

import { useNavigate, useParams } from "react-router-dom";

const App = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleAddToCart = (product) => {
    setCart([...cart, product]);
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  return (
    <Router>
      <div className="container py-4">
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4 rounded shadow-sm p-3">
          <Link to="/" className="navbar-brand">IronHandRoket</Link>
          <div className="navbar-nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/cart" className="nav-link">Cart ({cart.length})</Link>
            <Link to="/login" className="nav-link">{isLoggedIn ? "Logout" : "Login"}</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/order" element={<OrderPage cart={cart} onClearCart={() => setCart([])} />} />
          <Route path="/track" element={<OrderTrackingPage orders={orders} />} />
          <Route path="/product/:id" element={<ProductDetailPage onAddToCart={handleAddToCart} />} />
          {categories.map((cat) => (
            <Route
              key={cat}
              path={`/category/${encodeURIComponent(cat)}`}
              element={<CategoryPage category={cat} onAddToCart={handleAddToCart} />}
            />
          ))}
          <Route path="/" element={<HomePage onAddToCart={handleAddToCart} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
          <Route path="/cart" element={<CartPage cart={cart} onRemove={handleRemoveFromCart} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />
        </Routes>
      </div>
    </Router>
  );
};

const HomePage = ({ onAddToCart, searchTerm, setSearchTerm }) => {
  return (
    <div>
      <h2 className="mb-3">Product Categories</h2>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Ürün ara..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="mb-4">
        {categories.map((cat) => (
          <Link to={`/category/${encodeURIComponent(cat)}`} key={cat} className="btn btn-outline-secondary me-2 mb-2">{cat}</Link>
        ))}
      </div>
      <div className="row">
        {products.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase())).map((product) => (
          <div key={product.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title"><Link to={`/product/${product.id}`}>{product.name}</Link></h5>
                <p className="card-text">Category: {product.category}</p>
                <p className="card-text fw-bold">${product.price}</p>
                <button className="btn btn-primary" onClick={() => onAddToCart(product)}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CartPage = ({ cart, onRemove }) => {
  const handleOrder = () => {
    alert("Sipariş verildi!");
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  return (
    <div>
      <h1 className="text-xl mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.id} className="mb-2">
              {item.name} - ${item.price}
              <button onClick={() => onRemove(item.id)} className="ml-2 btn btn-danger btn-sm">
                Remove
              </button>
            </div>
          ))}
          <p className="mt-4 font-bold">Total: ${total}</p>
          <button className="btn btn-success mt-3" onClick={handleOrder}>
            Siparişi Ver
          </button>
        </div>
      )}
    </div>
  );
};

const LoginPage = ({ onLogin }) => {
  const handleLogin = () => {
    onLogin();
    alert("Logged in!");
  };

  return (
    <div className="card p-4 shadow-sm">
      <h2 className="mb-3">Login</h2>
      <input type="email" className="form-control mb-2" placeholder="Email" />
      <input type="password" className="form-control mb-3" placeholder="Password" />
      <button className="btn btn-success" onClick={handleLogin}>Login</button>
    </div>
  );
};

export default App;


const CategoryPage = ({ category, onAddToCart }) => {
  const filtered = products.filter(p => p.category === category);
  return (
    <div>
      <h2 className="mb-3">{category}</h2>
      <div className="row">
        {filtered.map((product) => (
          <div key={product.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title"><Link to={`/product/${product.id}`}>{product.name}</Link></h5>
                <p className="card-text fw-bold">${product.price}</p>
                <button className="btn btn-primary" onClick={() => onAddToCart(product)}>Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


const RegisterPage = () => {
  const handleRegister = () => {
    alert("Registration complete!");
  };

  return (
    <div className="card p-4 shadow-sm">
      <h2 className="mb-3">Register</h2>
      <input type="text" className="form-control mb-2" placeholder="Full Name" />
      <input type="email" className="form-control mb-2" placeholder="Email" />
      <input type="password" className="form-control mb-3" placeholder="Password" />
      <button className="btn btn-primary" onClick={handleRegister}>Register</button>
    </div>
  );
};


const ProductDetailPage = ({ onAddToCart }) => {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));

  if (!product) return <p>Ürün bulunamadı.</p>;

  return (
    <div className="card p-4 shadow-sm">
      <h2>{product.name}</h2>
      <p className="mb-2">Kategori: {product.category}</p>
      <p className="mb-3 fw-bold">Fiyat: ${product.price}</p>
      <button className="btn btn-success" onClick={() => onAddToCart(product)}>Sepete Ekle</button>
    </div>
  );
};


const OrderPage = ({ cart, onClearCart }) => {
  const navigate = useNavigate();

  const handleOrder = () => {
    const newOrder = {
      id: Date.now(),
      items: cart,
      status: "Hazırlanıyor"
    };
    const existing = JSON.parse(localStorage.getItem("orders") || "[]");
    existing.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(existing));
    onClearCart();
    alert("Siparişiniz alındı!");
    navigate("/track");
  };

  if (cart.length === 0) return <p>Sepetiniz boş.</p>;

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="card p-4 shadow-sm">
      <h2 className="mb-3">Sipariş Özeti</h2>
      <ul className="list-group mb-3">
        {cart.map((item, idx) => (
          <li key={idx} className="list-group-item d-flex justify-content-between">
            <span>{item.name}</span>
            <strong>${item.price}</strong>
          </li>
        ))}
      </ul>
      <p className="fw-bold">Toplam: ${total}</p>
      <button className="btn btn-success mt-2" onClick={handleOrder}>Siparişi Ver</button>
    </div>
  );
};

const OrderTrackingPage = () => {
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");

  return (
    <div>
      <h2 className="mb-3">Sipariş Takibi</h2>
      {orders.length === 0 ? (
        <p>Henüz siparişiniz bulunmamaktadır.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="card p-3 mb-3 shadow-sm">
            <h5>Sipariş ID: {order.id}</h5>
            <ul className="list-group mb-2">
              {order.items.map((item, idx) => (
                <li key={idx} className="list-group-item d-flex justify-content-between">
                  <span>{item.name}</span>
                  <strong>${item.price}</strong>
                </li>
              ))}
            </ul>
            <p className="fw-bold text-success">Durum: {order.status}</p>
          </div>
        ))
      )}
    </div>
  );
};


const OrderHistoryPage = () => {
  const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
  const lastOrder = savedOrders[savedOrders.length - 1];

  return (
    <div className="card p-4 shadow-sm">
      <h2 className="mb-3">Last Order</h2>
      {!lastOrder ? (
        <p>No previous orders found.</p>
      ) : (
        <div>
          <p className="fw-bold">Order ID: {lastOrder.id}</p>
          <p>Date: {lastOrder.date}</p>
          <ul className="list-group mb-2">
            {lastOrder.items.map((item, idx) => (
              <li key={idx} className="list-group-item d-flex justify-content-between">
                <span>{item.name}</span>
                <strong>${item.price}</strong>
              </li>
            ))}
          </ul>
          <p className="fw-bold">Total: ${lastOrder.items.reduce((sum, item) => sum + item.price, 0)}</p>
        </div>
      )}
    </div>
  );
};
