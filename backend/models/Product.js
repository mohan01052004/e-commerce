const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {type: String, required: true},
  brand: {type: String, required: true},
  price: {type: Number, required: true},
  description: {type: String, required: true},
  imageUrl: {type: String, required: true},
  category: {
    type: String,
    required: true,
    enum: [
      'Electronics',
      'Fashion',
      'Home & Kitchen',
      'Books',
      'Beauty & Personal Care',
      'Sports & Outdoors',
      'Toys & Games',
      'Automotive',
      'Grocery',
      'Health',
      'Office Supplies',
      'Pet Supplies',
      'Jewelry',
      'Shoes',
      'Baby Products',
      'Garden & Outdoors',
      'Other'
    ]
  },
  rating: {type: Number, required: true},
  createdAt: {type: Date, default: Date.now},
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

module.exports = mongoose.model("Product", productSchema);