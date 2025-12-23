// MONITORING SETUP
const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics(); // Start collecting CPU, Memory, etc.
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. LOAD ENV VARIABLES
require('dotenv').config(); 

const app = express();
app.use(cors());
app.use(express.json());

// 2. USE ENV VARIABLES
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 5000;

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// DB Connection
mongoose.connect(process.env.MONGO_URI)
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
app.post('/api/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }

    // Hash the password (encrypt it)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user (Default role is 'user')
    const newUser = new User({
      username,
      password: hashedPassword,
      role: 'user', // <--- Important: New signups are NOT admins
      cart: []      // Empty cart ready for later
    });

    await newUser.save();
    res.json({ message: "Signup successful!" });
  } catch (err) {
    res.status(500).json({ error: "Error creating user" });
  }
});
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
// Multer Config
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // 1. If the file field is 'model', upload as RAW (for .glb files)
    if (file.fieldname === 'model') {
      return {
        folder: 'ar-furniture',
        resource_type: 'raw', // <--- This fixes the 3D model corruption
        format: 'glb'         // Force the correct extension
      };
    }
    
    // 2. Otherwise, upload as IMAGE (for .jpg/.png)
    return {
      folder: 'ar-furniture',
      resource_type: 'image',
      allowed_formats: ['jpg', 'png']
    };
  },
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
// ... existing upload route ...

// 6. DELETE ROUTE (Protected by verifyToken)
app.delete('/api/products/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Could not delete product" });
  }
});
// 7. UPDATE ROUTE (PUT)
app.put('/api/products/:id', verifyToken, upload.fields([{ name: 'image' }, { name: 'model' }]), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, category } = req.body;

    // 1. Find the existing product
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // 2. Update text fields
    product.name = name;
    product.price = price;
    product.description = description;
    product.category = category;

    // 3. Update files ONLY if new ones were uploaded
    if (req.files['image']) {
      product.imageUrl = req.files['image'][0].path;
    }
    if (req.files['model']) {
      product.modelUrl = req.files['model'][0].path;
    }

    await product.save();
    res.json(product);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
