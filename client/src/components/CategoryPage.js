import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from './ProductCard';

const CategoryPage = () => {
  const { categoryName } = useParams(); // Gets 'Sofa' from URL
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // ⚠️ Laptop IP
    axios.get(`${process.env.REACT_APP_API_URL}/api/products`)
      .then(res => {
        // Filter specifically for this category
        const filtered = res.data.filter(p => p.category === categoryName);
        setProducts(filtered);
      })
      .catch(err => console.error(err));
  }, [categoryName]);

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Breadcrumb / Back Link */}
      <Link to="/" style={{textDecoration: 'none', color: '#666', fontSize: '18px', display: 'flex', alignItems: 'center', marginBottom: '20px'}}>
         ‹ Back to Home
      </Link>
      
      <h1 style={{ borderBottom: '1px solid #ddd', paddingBottom: '15px' }}>
        Viewing: <span style={{color: '#007bff'}}>{categoryName}s</span>
      </h1>

      {products.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '80px', color: '#888' }}>
          <h2 style={{ fontSize: '40px', marginBottom: '10px' }}>📦</h2>
          <h3>No {categoryName}s found.</h3>
          <p>We haven't added any yet. Check back soon!</p>
        </div>
      ) : (
        // Grid Layout for this specific page
        <div style={styles.grid}>
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  grid: { 
    display: 'flex', 
    flexWrap: 'wrap', 
    gap: '30px', 
    marginTop: '30px',
    justifyContent: 'center' // Centers items if there are only a few
  }
};

export default CategoryPage;