const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  products: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true}],
  totalAmount: {type: Number, required: true},
  paymentType: { type: String, required: true },
  deliveryAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  createdAt: {type: Date, default: Date.now},
  customer: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
});

module.exports = mongoose.model("Order", orderSchema);