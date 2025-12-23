import React, { useState } from 'react';
import axios from 'axios'; // ✅ Back to using axios directly
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // ⚠️ Using your local IP directly since we aren't hosting yet
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, { username, password });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role); 
      localStorage.setItem('username', username); // Crucial for profile icon

      if (res.data.role === 'admin') {
        window.location.href = '/admin'; 
      } else {
        window.location.href = '/'; 
      }

    } catch (err) {
      setError("Invalid credentials. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      
      {/* 1. CENTERED CONTENT WRAPPER */}
      <div style={styles.contentWrap}>
        <div style={styles.card}>
          <div style={{ marginBottom: '30px' }}>
            <h2 style={styles.title}>Welcome Back</h2>
            <p style={styles.subtitle}>Enter your details to access your account</p>
          </div>

          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Username</label>
              <input 
                  type="text" 
                  placeholder="e.g. JohnDoe" 
                  onChange={e => setUsername(e.target.value)} 
                  style={styles.input}
                  required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input 
                  type="password" 
                  placeholder="••••••••" 
                  onChange={e => setPassword(e.target.value)} 
                  style={styles.input}
                  required
              />
            </div>

            {error && <div style={styles.errorBanner}>{error}</div>}

            <button 
              type="submit" 
              style={isLoading ? styles.buttonDisabled : styles.button}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Sign In"}
            </button>
          </form>
          
          <p style={styles.footerText}>
             New customer? <Link to="/signup" style={styles.link}>Create an account</Link>
          </p>
        </div>
      </div>

      {/* 2. JINGULALA FOOTER */}
      <div style={styles.footer}>
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
  pageContainer: { minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f4f4f9', fontFamily: '"Helvetica Neue", sans-serif' },
  contentWrap: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' },
  card: { width: '100%', maxWidth: '420px', backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', textAlign: 'center' },
  title: { margin: '0 0 10px 0', fontSize: '28px', fontWeight: '800', color: '#333' },
  subtitle: { margin: 0, color: '#666', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' },
  inputGroup: { textAlign: 'left' },
  label: { display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#444' },
  input: { width: '100%', padding: '12px 15px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#fafafa', outline: 'none', boxSizing: 'border-box' },
  errorBanner: { backgroundColor: '#ffe6e6', color: '#d93025', padding: '10px', borderRadius: '6px', fontSize: '14px' },
  button: { padding: '14px', backgroundColor: '#222', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' },
  buttonDisabled: { padding: '14px', backgroundColor: '#999', color: 'white', border: 'none', borderRadius: '8px', cursor: 'not-allowed' },
  footerText: { marginTop: '25px', color: '#666', fontSize: '14px' },
  link: { color: '#007bff', textDecoration: 'none', fontWeight: 'bold' },
  footer: { backgroundColor: '#000', color: '#666', padding: '60px 20px', textAlign: 'center', fontSize: '14px', borderTop: '1px solid #111' }
};

export default LoginPage;