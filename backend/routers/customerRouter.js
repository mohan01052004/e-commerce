const express = require("express");

const customerController = require("../controllers/customerController");
const customerRouter = express.Router();

const { getPublicProducts } = require('../controllers/customerController');

customerRouter.get("/data", customerController.getData);
customerRouter.post("/cart/:id", customerController.addToCart);
customerRouter.delete("/cart/:id", customerController.removeFromCart);
customerRouter.post("/order", customerController.createOrder);

module.exports = customerRouter;