import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '@google/model-viewer'; 

const ProductDetails = ({ addToCart, removeFromCart, cartItems }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if this product is already in the cart
  const isInCart = cartItems ? cartItems.some(item => item._id === id) : false;

  const features = [
    { icon: "🪵", text: "Premium Wood" },
    { icon: "🛡️", text: "5 Year Warranty" },
    { icon: "🚚", text: "Free Shipping" },
    { icon: "♻️", text: "Eco-Friendly" },
  ];

  useEffect(() => {
    // ⚠️ Check IP
    axios.get(`${process.env.REACT_APP_API_URL}/api/products`)
      .then(res => {
        const found = res.data.find(p => p._id === id);
        setProduct(found);
        setLoading(false);
      })
      .catch(err => setLoading(false));
  }, [id]);

  if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}>Loading...</div>;
  if (!product) return <div style={{textAlign:'center', marginTop:'50px'}}>Product not found</div>;

  return (
    <div style={{ backgroundColor: '#E0E0E0', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ flex: 1, padding: '40px 20px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto 20px auto' }}>
              <Link to="/" style={{ textDecoration: 'none', color: '#666', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                ← Back to Browse
              </Link>
          </div>

          <div style={styles.card}>
            
            {/* 3D VIEWER */}
            <div style={styles.viewerSection}>
                <model-viewer 
                    src={product.modelUrl} 
                    poster={product.imageUrl} 
                    alt={product.name}
                    shadow-intensity="1"
                    camera-controls
                    auto-rotate
                    ar
                    ar-modes="webxr scene-viewer quick-look"
                    style={{width: '100%', height: '100%'}} 
                >
                    <button slot="ar-button" style={styles.arButton}>
                        👋 View in your space
                    </button>
                </model-viewer>
                <p style={{textAlign:'center', color:'#888', marginTop:'10px', fontSize: '14px'}}>Tip: Pinch to zoom, drag to rotate.</p>
            </div>

            {/* INFO */}
            <div style={styles.infoSection}>
                <span style={styles.categoryTag}>{product.category} Series</span>
                <h1 style={styles.title}>{product.name}</h1>
                <div style={styles.priceTag}>PKR {product.price}</div>
                <p style={styles.description}>{product.description}</p>

                <div style={styles.featureGrid}>
                    {features.map((f, i) => (
                        <div key={i} style={styles.featureItem}>
                            <span style={{fontSize: '20px'}}>{f.icon}</span>
                            <span style={{fontSize: '14px', color: '#555'}}>{f.text}</span>
                        </div>
                    ))}
                </div>

                {/* CONDITIONAL BUTTON */}
                {isInCart ? (
                    <button 
                      onClick={() => removeFromCart(product._id)} 
                      style={styles.removeButton}
                    >
                      Remove from Cart
                    </button>
                ) : (
                    <button 
                      onClick={() => addToCart(product)} 
                      style={styles.addButton}
                    >
                      Add to Cart
                    </button>
                )}

            </div>
          </div>
      </div>
      
      {/* Footer */}
      <div style={{backgroundColor: '#000', color: '#666', padding: '60px 20px', textAlign: 'center', fontSize: '14px', borderTop: '1px solid #111'}}>
          <h2 style={{color: 'white', marginBottom: '10px', fontSize: '24px'}}>Jingulala Furniture</h2>
          <p>Rawalpindi • Islamabad • Lahore</p>
          <div style={{marginTop: '40px', borderTop: '1px solid #222', paddingTop: '20px'}}>
            &copy; 2025 Jingulala Furniture. All rights reserved.
          </div>
      </div>
    </div>
  );
};

const styles = {
  card: { display: 'flex', flexWrap: 'wrap', maxWidth: '1200px', margin: '0 auto', backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', overflow: 'hidden', minHeight: '600px' },
  viewerSection: { flex: '1 1 500px', backgroundColor: '#F9F9F9', position: 'relative', height: '600px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px' },
  infoSection: { flex: '1 1 400px', padding: '50px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  arButton: { backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '30px', padding: '12px 24px', position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,123,255,0.3)', zIndex: 100 },
  categoryTag: { color: '#888', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' },
  title: { margin: '0 0 15px 0', fontSize: '42px', fontWeight: '800', color: '#222', lineHeight: 1.2 },
  priceTag: { fontSize: '28px', color: '#28a745', fontWeight: '600', marginBottom: '25px' },
  description: { fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '30px' },
  featureGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '40px', paddingBottom: '30px', borderBottom: '1px solid #eee' },
  featureItem: { display: 'flex', alignItems: 'center', gap: '10px' },
  
  addButton: { width: '100%', padding: '18px', backgroundColor: '#222', color: 'white', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' },
  removeButton: { width: '100%', padding: '18px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }
};

export default ProductDetails;