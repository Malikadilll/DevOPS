import React from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function CheckoutPage({ cartItems, total }) {
  const navigate = useNavigate();

  const handleConfirmPurchase = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert("Please login to complete your purchase!");
      navigate('/login');
      return;
    }

    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: total
      };

      // ⚠️ Replace IP if needed
      await axios.post(`${process.env.REACT_APP_API_URL}/api/orders`, orderData, {
        headers: { Authorization: token }
      });

      alert("Order Placed Successfully!");
      window.location.href = '/'; 

    } catch (error) {
      console.error(error);
      alert("Failed to place order. Check console for details.");
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Checkout</h2>
      
      {!cartItems || cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {cartItems.map(item => (
              <li key={item._id} style={styles.itemRow}>
                
                {/* Clickable Link back to Product */}
                <Link to={`/product/${item._id}`} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#333' }}>
                    <img src={item.imageUrl} alt={item.name} style={styles.image} />
                    <span>{item.name} (x{item.quantity})</span>
                </Link>

                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          
          <h3 style={{ marginTop: '20px', textAlign: 'right' }}>
            Total: ${total ? total.toFixed(2) : '0.00'}
          </h3>
          
          <button 
            onClick={handleConfirmPurchase}
            style={styles.button}
          >
            Confirm Purchase
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  itemRow: { borderBottom: '1px solid #ddd', padding: '15px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  image: { width: '60px', height: '60px', objectFit: 'cover', marginRight: '15px', borderRadius: '5px' },
  button: { width: '100%', padding: '15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '30px', fontSize: '18px', fontWeight: 'bold' }
};

export default CheckoutPage;