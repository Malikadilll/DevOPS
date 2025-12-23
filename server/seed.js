const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
// 1. NEW IMPORTS
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = "super_secret_fyp_key_123"; // In real life, hide this in .env

// CLOUDINARY CONFIG (Keep your existing keys!)
cloudinary.config({
  cloud_name: 'PASTE_YOUR_CLOUD_NAME_HERE',
  api_key: 'PASTE_YOUR_API_KEY_HERE',
  api_secret: 'PASTE_YOUR_API_SECRET_HERE'
});

// DB Connection
mongoose.connect('mongodb+srv://admin:admin123@cluster0.k4rkrpb.mongodb.net/furnitureDB?appName=Cluster0')
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ DB Error:", err));

// --- SCHEMAS ---

// 2. USER SCHEMA (With Cart Support for later)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }, // 'admin' or 'customer'
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 }
    }
  ]
});
const User = mongoose.model('User', userSchema);

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  category: String,
  imageUrl: String, 
  modelUrl: String  
});
const Product = mongoose.model('Product', productSchema);

// --- MIDDLEWARE (The Security Guard) ---
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], JWT_SECRET);
    req.user = decoded;
    // Check if Admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }
    next(); // Allowed!
  } catch (err) {
    return res.status(401).json({ error: "Invalid Token" });
  }
};

// --- ROUTES ---

// 3. LOGIN ROUTE
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  
  if (!user) return res.status(400).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid password" });

  // Create Token
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, role: user.role, cart: user.cart });
});

// Get All Products (Public)
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Multer Config
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: 'ar-furniture', resource_type: 'auto', allowed_formats: ['jpg', 'png', 'glb'] },
});
const upload = multer({ storage: storage });

// 4. PROTECTED UPLOAD ROUTE (Added 'verifyToken')
app.post('/api/products', verifyToken, upload.fields([{ name: 'image' }, { name: 'model' }]), async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    const newProduct = new Product({
      name, price, description, category,
      imageUrl: req.files['image'][0].path, 
      modelUrl: req.files['model'][0].path
    });
    await newProduct.save();
    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Upload failed: " + error.message });
  }
});

// 5. ONE-TIME SETUP: Create Admin User (Run this route once in browser to setup)
app.get('/setup-admin', async (req, res) => {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = new User({ username: "admin", password: hashedPassword, role: "admin" });
  try {
    await admin.save();
    res.send("Admin Created! You can now login.");
  } catch(e) { res.send("Admin already exists."); }
});

app.listen(5000, () => console.log('Server running on port 5000'));