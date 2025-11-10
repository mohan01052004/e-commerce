const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");



exports.getData = async (req, res, next) => {
  const userId = req.userId;
  const user = await User.findById(userId).populate({
    path: 'orders',
    populate: { path: 'products' }
  });
  const products = await Product.find();

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json({products, cart: user.cart, orders: user.orders});
}

exports.addToCart = async (req, res, next) => {
  const productId = req.params.id;
  const userId = req.userId;
  const user = await User.findById(userId);
  user.cart.push(productId);
  await user.save();
  res.status(200).json(user.cart);
}

exports.removeFromCart = async (req, res, next) => {
  const productId = req.params.id;
  const userId = req.userId;
  const user = await User.findById(userId);
  user.cart = user.cart.filter(id => id.toString() !== productId);
  await user.save();
  res.status(200).json(user.cart);
}

exports.createOrder = async (req, res, next) => {
  const userId = req.userId;
  const user = await User.findById(userId).populate('cart');
  let totalAmount = 0;
  for (const product of user.cart) {
    totalAmount += product.price;
  }
  const { paymentType, deliveryAddress } = req.body;
  if (!paymentType || !deliveryAddress) {
    return res.status(400).json({ error: 'Payment type and delivery address are required.' });
  }
  const order = new Order({
    products: user.cart,
    totalAmount,
    customer: userId,
    paymentType,
    deliveryAddress
  });
  await order.save();
  user.orders.push(order._id);
  user.cart = [];
  await user.save();
  res.status(200).json(order);
}