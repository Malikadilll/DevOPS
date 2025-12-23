// server/models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  imageUrl: String,      // URL to the 2D image
  modelUrl: String,      // URL to the .glb 3D model
  category: String
});

module.exports = mongoose.model('Product', ProductSchema);