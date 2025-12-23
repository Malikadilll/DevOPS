import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      to={`/product/${product._id}`} 
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div 
        style={{
          ...styles.card,
          ...(isHovered ? styles.cardHover : {})
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        
        {/* IMAGE CONTAINER (with zoom effect) */}
        <div style={styles.imageContainer}>
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            style={{
              ...styles.image,
              ...(isHovered ? styles.imageHover : {})
            }} 
          />
          
          {/* "View AR" Badge overlay */}
          <div style={styles.arBadge}>
            🧊 View in AR
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div style={styles.details}>
          {/* Category Tag (Small & Uppercase) */}
          <span style={styles.categoryTag}>{product.category}</span>
          
          {/* Product Name */}
          <h3 style={styles.name}>{product.name}</h3>
          
          {/* Price & Action Row */}
          <div style={styles.bottomRow}>
            <span style={styles.price}>PKR {product.price}</span>
            <span style={styles.arrowBtn}>→</span>
          </div>
        </div>

      </div>
    </Link>
  );
};

const styles = {
  // CARD CONTAINER
  card: {
    width: '280px',
    backgroundColor: 'white',
    borderRadius: '16px',
    overflow: 'hidden', // Keeps the zooming image inside the rounded corners
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)', // Subtle start shadow
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative',
    border: '1px solid #f0f0f0'
  },
  cardHover: {
    transform: 'translateY(-8px)', // Lifts up
    boxShadow: '0 15px 30px rgba(0,0,0,0.15)', // Deep shadow on hover
  },

  // IMAGE
  imageContainer: {
    width: '100%',
    height: '220px',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#f9f9f9'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease', // Smooth zoom
  },
  imageHover: {
    transform: 'scale(1.08)', // Slight zoom in
  },

  // AR BADGE
  arBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '5px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#333',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(4px)'
  },

  // TEXT CONTENT
  details: {
    padding: '20px',
    textAlign: 'left',
  },
  categoryTag: {
    display: 'block',
    fontSize: '12px',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '5px',
    fontWeight: '600'
  },
  name: {
    margin: '0 0 10px 0',
    fontSize: '18px',
    fontWeight: '700',
    color: '#222',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  
  // PRICE ROW
  bottomRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '15px',
    borderTop: '1px solid #eee',
    paddingTop: '15px'
  },
  price: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#28a745' // Green for price, or use #333 for classic black
  },
  arrowBtn: {
    fontSize: '18px',
    color: '#ccc',
    fontWeight: 'bold'
  }
};

export default ProductCard;