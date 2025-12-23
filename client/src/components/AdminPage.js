import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const [formData, setFormData] = useState({ name: '', price: '', description: '', category: 'Chair' });
  const [imageFile, setImageFile] = useState(null);
  const [modelFile, setModelFile] = useState(null);
  const [products, setProducts] = useState([]);
  
  // 🆕 STATE: To track which item we are editing
  const [editingId, setEditingId] = useState(null); 

  const navigate = useNavigate();

  // 1. FETCH & SECURITY
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'admin') {
      alert("Access Denied");
      navigate('/');
      return;
    }
    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 2. HANDLE DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // 3. 🆕 HANDLE EDIT CLICK
  const handleEdit = (product) => {
    // Fill the form with this product's data
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category
    });
    setEditingId(product._id); // Switch to "Edit Mode"
    
    // Scroll to top to see the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 4. 🆕 CANCEL EDIT
  const resetForm = () => {
    setFormData({ name: '', price: '', description: '', category: 'Chair' });
    setImageFile(null);
    setModelFile(null);
    setEditingId(null); // Switch back to "Add Mode"
  };

  // 5. SUBMIT (Handles BOTH Add and Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('description', formData.description);
    data.append('category', formData.category);
    if (imageFile) data.append('image', imageFile);
    if (modelFile) data.append('model', modelFile);

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } };

      if (editingId) {
        // === UPDATE MODE (PUT) ===
        await axios.put(`${process.env.REACT_APP_API_URL}/api/products/${editingId}`, data, config);
        alert('Product Updated!');
      } else {
        // === CREATE MODE (POST) ===
        await axios.post(`${process.env.REACT_APP_API_URL}/api/products`, data, config);
        alert('Product Added!');
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      alert("Operation Failed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
      
      {/* SECTION 1: FORM (Changes Title based on mode) */}
      <div style={styles.card}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <h2>{editingId ? "✏️ Edit Product" : "➕ Add New Furniture"}</h2>
            
            {/* Show Cancel Button only when editing */}
            {editingId && (
                <button onClick={resetForm} style={{padding:'5px 10px', cursor:'pointer'}}>Cancel Edit</button>
            )}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
                placeholder="Product Name" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                required 
                style={styles.input}
            />
            <input 
                type="number" 
                placeholder="Price (PKR)" 
                value={formData.price} 
                onChange={e => setFormData({...formData, price: e.target.value})} 
                required 
                style={styles.input}
            />
            
            <select 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})} 
                style={styles.input}
            >
                <option value="Chair">Chair</option>
                <option value="Sofa">Sofa</option>
                <option value="Table">Table</option>
                <option value="Bed">Bed</option>
                <option value="Lamp">Lamp</option>
            </select>

            <textarea 
                placeholder="Description" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                style={styles.input}
            />
            
            {/* File Inputs show a note when editing */}
            <div>
                <label>Preview Image: {editingId && <span style={{fontSize:'12px', color:'gray'}}>(Leave empty to keep current)</span>}</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} required={!editingId} />
            </div>
            <div>
                <label>3D Model (.glb): {editingId && <span style={{fontSize:'12px', color:'gray'}}>(Leave empty to keep current)</span>}</label>
                <input type="file" accept=".glb" onChange={e => setModelFile(e.target.files[0])} required={!editingId} />
            </div>

            <button type="submit" style={editingId ? styles.updateButton : styles.addButton}>
                {editingId ? "Update Product" : "Add Product"}
            </button>
        </form>
      </div>

      {/* SECTION 2: LIST */}
      <div style={{ marginTop: '40px' }}>
        <h2 style={{ borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>Manage Inventory ({products.length})</h2>
        
        {products.map(product => (
            <div key={product._id} style={styles.itemRow}>
                <img src={product.imageUrl} alt={product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                
                <div style={{ flex: 1, marginLeft: '15px' }}>
                    <h4 style={{ margin: 0 }}>{product.name}</h4>
                    <p style={{ margin: 0, color: '#666' }}>PKR {product.price}</p>
                </div>

                {/* ACTION BUTTONS */}
                <div style={{display:'flex', gap:'10px'}}>
                    <button 
                        onClick={() => handleEdit(product)} 
                        style={styles.editButton}
                    >
                        EDIT ✏️
                    </button>
                    <button 
                        onClick={() => handleDelete(product._id)} 
                        style={styles.deleteButton}
                    >
                        DELETE 🗑️
                    </button>
                </div>
            </div>
        ))}
      </div>

    </div>
  );
};

const styles = {
  card: { border: '1px solid #ddd', padding: '20px', borderRadius: '10px', backgroundColor: '#f9f9f9' },
  input: { padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' },
  addButton: { padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  updateButton: { padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  itemRow: { display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', padding: '15px 0' },
  deleteButton: { backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' },
  editButton: { backgroundColor: '#ffc107', color: 'black', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }
};

export default AdminPage;