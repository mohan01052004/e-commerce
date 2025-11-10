const express = require("express");

const authController = require("../controllers/authController");
const authRouter = express.Router();
const {passwordValidator}=require("../controllers/validations")

authRouter.post("/signup", authController.signup);
authRouter.post("/login", authController.login);
authRouter.post("/check-email", authController.checkUserByEmail);
authRouter.post("/send-otp", authController.sendOtp);
authRouter.post("/reset-password",passwordValidator, authController.resetPassword);

module.exports = authRouter;
