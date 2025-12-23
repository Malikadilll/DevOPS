import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import your pages
import HomePage from './components/HomePage';
import AdminPage from './components/AdminPage';
import ProductDetails from './components/ProductDetails';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import CategoryPage from './components/CategoryPage';
import CheckoutPage from './components/CheckoutPage';

function App() {
  // --- CART STATE ---
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // --- AUTH STATE ---
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  

  const isLoggedIn = !!token;
  const isAdmin = isLoggedIn && role === 'admin';
  

  return (
    <Router>
      <div style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif', color: '#333' }}>
        
        <nav style={styles.nav}>
          <div style={styles.navContainer}>
            <Link to="/" style={styles.logo}>🛋️ Jingulala Furniture</Link>
            
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                
                
                {isAdmin && (
                  <Link to="/admin" style={styles.link}>Admin Panel</Link>
                )}

                {/* --- 1. CART ICON --- */}
                <button 
                  onClick={() => setIsCartOpen(!isCartOpen)} 
                  style={styles.cartIconBtn}
                >
                  🛒 
                  {cartItems.length > 0 && (
                    <span style={styles.cartCount}>{cartItems.length}</span>
                  )}
                </button>

                {/* --- 2. CART DROPDOWN --- */}
                {isCartOpen && (
                  <div style={styles.cartDropdown}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                       <strong>Your Cart</strong>
                       <button onClick={() => setIsCartOpen(false)} style={{cursor: 'pointer', background:'none', border:'none'}}>✖</button>
                    </div>

                    {cartItems.length === 0 ? (
                      <p style={{textAlign: 'center', color: '#888'}}>Empty</p>
                    ) : (
                      <>
                        <div style={styles.cartList}>
                          {cartItems.map((item) => (
                            <div key={item._id} style={styles.cartItem}>
                              <Link to={`/product/${item._id}`} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', flex: 1 }}>
                                  <img src={item.imageUrl} alt={item.name} style={styles.cartImg} />
                                  <div style={{ padding: '0 10px' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{item.name}</div>
                                    <div style={{ fontSize: '12px' }}>${item.price} x {item.quantity}</div>
                                  </div>
                              </Link>
                              <button onClick={() => removeFromCart(item._id)} style={{color:'red', border:'none', background:'none', cursor:'pointer'}}>🗑️</button>
                            </div>
                          ))}
                        </div>
                        <div style={styles.cartTotal}>Total: ${cartTotal.toFixed(2)}</div>
                        
                        <Link to="/checkout" onClick={() => setIsCartOpen(false)}>
                           <button style={styles.checkoutBtn}>Checkout</button>
                        </Link>
                      </>
                    )}
                  </div>
                )}

                {/* --- 3. LOGIN / PROFILE --- */}
                {!isLoggedIn ? (
                    <Link to="/login" style={styles.link}>Login</Link>
                ) : (
                    <button 
                      onClick={() => {
                        localStorage.clear(); 
                        window.location.href = '/'; 
                      }} 
                      style={styles.logoutBtn}
                    >
                      Logout
                    </button>
                )}
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          
          {/* PASS CART FUNCTIONS TO PRODUCT PAGE */}
          <Route 
            path="/product/:id" 
            element={
              <ProductDetails 
                addToCart={addToCart} 
                removeFromCart={removeFromCart} 
                cartItems={cartItems} 
              />
            } 
          />
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          
          {/* PASS CART DATA TO CHECKOUT */}
          <Route 
            path="/checkout" 
            element={<CheckoutPage cartItems={cartItems} total={cartTotal} />} 
          />
        </Routes>

      </div>
    </Router>
  );
}

const styles = {
  nav: { padding: '15px 0', backgroundColor: '#222', color: 'white', position: 'relative', zIndex: 1000 },
  navContainer: { maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' },
  logo: { color: 'white', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold' },
  link: { color: 'white', textDecoration: 'none', marginLeft: '20px', fontSize: '16px', transition: '0.2s' },
  logoutBtn: { marginLeft: '20px', background: 'none', border: '1px solid white', color: 'white', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' },
  
  // CART STYLES
  cartIconBtn: { marginLeft: '20px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', position: 'relative', color: 'white' },
  cartCount: { position: 'absolute', top: '-5px', right: '-10px', background: 'red', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '12px', fontWeight: 'bold' },
  cartDropdown: { position: 'absolute', top: '50px', right: '0', width: '300px', backgroundColor: 'white', color: '#333', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', borderRadius: '8px', padding: '15px', zIndex: 1100 },
  cartList: { maxHeight: '300px', overflowY: 'auto' },
  cartItem: { display: 'flex', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '10px' },
  cartImg: { width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' },
  cartTotal: { fontWeight: 'bold', fontSize: '16px', margin: '15px 0', textAlign: 'right' },
  checkoutBtn: { width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }
};

export default App;