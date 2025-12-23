import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPaused, setIsPaused] = useState(false); // 🆕 Pauses scroll on hover
  const navigate = useNavigate();
  
  const productScrollRef = useRef(null);
  const categoryScrollRef = useRef(null);
  const reviewScrollRef = useRef(null);

  const categoryList = [
    { name: "Chair", img: "/chair.jpg" },
    { name: "Sofa",  img: "/sofa.jpg" },
    { name: "Table", img: "/table.jpg" },
    { name: "Lamp",  img: "/lamp.jpg" },
    { name: "Bed",   img: "/bed.jpg" }
  ];

  const reviews = [
    { id: 1, name: "Ali Khan", location: "Lahore", text: "I was skeptical about the AR, but it actually works perfectly. Saw how the sofa looked in my lounge before buying.", rating: 5 },
    { id: 2, name: "Sara Ahmed", location: "Karachi", text: "The quality of the 3D models is insane. It saved me a trip to the showroom. Highly recommended!", rating: 5 },
    { id: 3, name: "Bilal & Co", location: "Islamabad", text: "Great interface, smooth experience. Finally a Pakistani app that feels modern.", rating: 4 },
    { id: 4, name: "Zainab B.", location: "Rawalpindi", text: "Bought a lamp after testing it on my study table using the camera. Fits perfectly.", rating: 5 },
    { id: 5, name: "Usman Y.", location: "Multan", text: "Delivery was fast and the wood quality is top notch. The AR size was 100% accurate.", rating: 5 },
  ];

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/products`)
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  // 🆕 AUTOMATIC SCROLL EFFECT (Ping-Pong)
  useEffect(() => {
    const container = reviewScrollRef.current;
    if (!container) return;

    
    let direction = 1; // 1 = right, -1 = left
    const speed = 1; // Pixels per tick

    const scrollInterval = setInterval(() => {
      if (isPaused) return; // Stop if mouse is hovering

      // Check if we reached the end
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
        direction = -1; // Switch to Left
      } 
      // Check if we are at the start
      else if (container.scrollLeft <= 0) {
        direction = 1; // Switch to Right
      }

      container.scrollLeft += (speed * direction);
    }, 20); // 20ms = Smooth 50fps

    return () => clearInterval(scrollInterval);
  }, [isPaused]); // Re-run if pause state changes

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scrollProdLeft = () => productScrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  const scrollProdRight = () => productScrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  const scrollCatLeft = () => categoryScrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  const scrollCatRight = () => categoryScrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  
  // Manual buttons still work too
  const scrollRevLeft = () => reviewScrollRef.current?.scrollBy({ left: -400, behavior: 'smooth' });
  const scrollRevRight = () => reviewScrollRef.current?.scrollBy({ left: 400, behavior: 'smooth' });

  return (
    <div style={{ backgroundColor: '#E0E0E0', minHeight: '100vh' }}>
      
      {/* 1. HERO BANNER */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={{
              fontSize: '56px', 
              margin: 0, 
              fontWeight: '300',
              textShadow: '2px 2px 8px rgba(0,0,0,0.8)'
          }}>
            Jingulala Furniture
          </h1>
          <p style={{
              fontSize: '20px', 
              marginTop: '15px', 
              fontWeight: '300',
              textShadow: '1px 1px 5px rgba(0,0,0,0.8)'
          }}>
            Redefining comfort, one pixel at a time.
          </p>
        </div>
      </div>

      {/* 2. NEW ARRIVALS */}
      <div style={{ padding: '40px 0', borderBottom: '1px solid #ccc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <div style={styles.actionBar}>
                <h2 style={styles.sectionTitle}>New Arrivals</h2>
                <div style={styles.searchContainer}>
                    <span style={{fontSize: '18px', marginRight: '10px', color: '#888'}}>🔍</span>
                    <input 
                        type="text" 
                        placeholder="Search Jingulala..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>
            </div>
        </div>

        <div style={styles.scrollWrapper}>
            <button onClick={scrollProdLeft} style={styles.scrollButtonLeft}>‹</button>
            <div ref={productScrollRef} style={styles.scrollContainer}>
                {filteredProducts.map(product => (
                    <div key={product._id} style={{ flex: '0 0 auto' }}>
                        <ProductCard product={product} />
                    </div>
                ))}
                <div style={{ width: '20px', flex: '0 0 auto' }}></div>
            </div>
            <button onClick={scrollProdRight} style={styles.scrollButtonRight}>›</button>
        </div>
      </div>

      {/* 3. BROWSE BY CATEGORY */}
      <div style={{ padding: '60px 0', backgroundColor: '#D6D6D6' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
             <h2 style={styles.sectionTitle}>Browse Collection</h2>
        </div>
        
        <div style={styles.scrollWrapper}>
            <button onClick={scrollCatLeft} style={styles.scrollButtonLeft}>‹</button>
            <div ref={categoryScrollRef} style={styles.scrollContainer}>
                {categoryList.map(cat => (
                    <div 
                        key={cat.name} 
                        style={{ flex: '0 0 auto' }} 
                        onClick={() => navigate(`/category/${cat.name}`)}
                    >
                        <div style={styles.categoryCard}>
                            <img src={cat.img} alt={cat.name} style={styles.catImg} />
                            <div style={styles.catOverlay}>
                                <h3 style={{color:'white', margin:0, fontSize: '22px', fontWeight: '500', letterSpacing: '1px'}}>{cat.name}</h3>
                            </div>
                        </div>
                    </div>
                ))}
                <div style={{ width: '20px', flex: '0 0 auto' }}></div>
            </div>
            <button onClick={scrollCatRight} style={styles.scrollButtonRight}>›</button>
        </div>
      </div>

      {/* 4. TESTIMONIALS (AUTO SCROLLING) */}
      <div style={{ padding: '80px 20px', backgroundColor: '#E0E0E0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>What Our Customers Say</h2>
        <div style={{ width: '60px', height: '3px', backgroundColor: '#333', margin: '0 auto 50px auto' }}></div>

        <div 
            style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto' }}
            // 🆕 PAUSE ON HOVER
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <button onClick={scrollRevLeft} style={{...styles.scrollButtonLeft, left: '-20px'}}>‹</button>
            <div ref={reviewScrollRef} style={{...styles.scrollContainer, justifyContent: 'flex-start' }}>
                {reviews.map(review => (
                    <div key={review.id} style={styles.reviewCard}>
                        <div style={styles.quoteIcon}>❝</div>
                        <div style={{ color: '#FFD700', fontSize: '18px', marginBottom: '15px' }}>
                            {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                        </div>
                        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#555', fontStyle: 'italic', marginBottom: '20px', flex: 1 }}>
                            "{review.text}"
                        </p>
                        <div>
                            <h4 style={{ margin: '0', fontSize: '16px', fontWeight: 'bold', color: '#222' }}>{review.name}</h4>
                            <span style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>{review.location}</span>
                        </div>
                    </div>
                ))}
                 <div style={{ width: '20px', flex: '0 0 auto' }}></div>
            </div>
            <button onClick={scrollRevRight} style={{...styles.scrollButtonRight, right: '-20px'}}>›</button>
        </div>
      </div>

      {/* 5. MISSION STATEMENT */}
      <div style={{ backgroundColor: '#212121', color: 'white', padding: '80px 20px', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '36px', marginBottom: '20px', fontWeight: '300', letterSpacing: '1px' }}>Our Mission</h2>
              <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#ccc' }}>
                We at <strong>Jingulala Furniture</strong> aim to revolutionize how you experience comfort. 
                By blending traditional craftsmanship with cutting-edge Augmented Reality, we bridge the gap 
                between imagination and reality. We don't just sell furniture; we help you create a home 
                that tells your story—perfectly fitted, beautifully designed, and uniquely yours.
              </p>
              <div style={{ marginTop: '30px', fontSize: '24px', fontFamily: 'serif', fontStyle: 'italic', color: '#FFD700' }}>
                  — The Jingulala Team
              </div>
          </div>
      </div>

      {/* FOOTER */}
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
  hero: { height: '500px', backgroundColor: '#333', backgroundImage: 'url("/hero-sofa.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textAlign: 'center' },
  heroContent: { width: '100%', padding: '0 20px', zIndex: 2 },
  sectionTitle: { margin: 0, fontSize: '28px', fontWeight: '600', color: '#222' },
  actionBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '20px' },
  searchContainer: { display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '10px 20px', borderRadius: '30px', border: '1px solid #ccc', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  searchInput: { border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '16px', width: '250px' },
  categoryCard: { position: 'relative', width: '300px', height: '200px', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', marginRight: '20px', transition: 'transform 0.3s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  catImg: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' },
  catOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  reviewCard: { flex: '0 0 auto', width: '350px', padding: '40px 30px', marginRight: '30px', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: 'none', display: 'flex', flexDirection: 'column', textAlign: 'center', position: 'relative' },
  quoteIcon: { fontSize: '60px', color: '#f0f0f0', position: 'absolute', top: '10px', left: '20px', fontFamily: 'serif', lineHeight: 1 },
  scrollWrapper: { position: 'relative', maxWidth: '100%' },
  scrollContainer: { display: 'flex', overflowX: 'auto', padding: '20px 50px', scrollBehavior: 'smooth', scrollbarWidth: 'none' },
  scrollButtonLeft: { position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, backgroundColor: 'white', border: 'none', borderRadius: '50%', width: '45px', height: '45px', fontSize: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', color: '#333' },
  scrollButtonRight: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, backgroundColor: 'white', border: 'none', borderRadius: '50%', width: '45px', height: '45px', fontSize: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', color: '#333' },
};

export default HomePage;