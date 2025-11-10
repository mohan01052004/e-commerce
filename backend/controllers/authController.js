const { validationResult } = require("express-validator");
const User = require("../models/User");
const { firstNameValidator, lastNameValidator, emailValidator, passwordValidator, confirmPasswordValidator, userTypeValidator } = require("./validations");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY;
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

exports.signup = [
  firstNameValidator,
  lastNameValidator,
  emailValidator,
  passwordValidator,
  confirmPasswordValidator,
  userTypeValidator,
  
  async (req, res, next) => {
    const {firstName, lastName, email, password, userType} = req.body;

    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errorMessages: errors.array().map(err => err.msg),
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({firstName, lastName, email, password: hashedPassword, userType});
      await user.save();
      res.status(201).json({message: "Signup successful"});
    } catch (error) {
      res.status(500).json({errorMessages: [error.message]});
    }
  }
];

exports.login = async (req, res, next) => {
  const {email, password} = req.body;

  try {
    const user = await User.findOne({email});
    if (!user) {
      return res.status(401).json({errorMessages: ["Invalid email."]});
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({errorMessages: ["Invalid password."]});
    }

    const token = jwt.sign(
      {userId: user._id, userType: user.userType},
      process.env.JWT_SECRET,
      {expiresIn: "7d"}
    );

    res.status(200).json({token, userType: user.userType});
  } catch (error) {
    res.status(500).json({errorMessages: [error.message]});
  }
}

exports.checkUserByEmail = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ exists: false, error: 'Email is required.' });
  }
  const user = await User.findOne({ email });
  if (user) {
    return res.status(200).json({ exists: true });
  } else {
    return res.status(404).json({ exists: false, error: 'User not found.' });
  }
}

// Generate and send OTP for password reset
exports.sendOtp = async (req, res, next) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found.' });

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  // Prepare Sendinblue/Brevo transactional email
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.subject = 'Otp for password reset';
  sendSmtpEmail.htmlContent = `<strong>Your otp to reset your password is ${otp} and the otp will be valid for only 10 Minutes</strong>`;
  sendSmtpEmail.sender = { name: 'Bazaar', email: process.env.BREVO_FROM_EMAIL };
  sendSmtpEmail.to = [{ email: user.email }];
  sendSmtpEmail.replyTo = { name: 'Bazaar', email: process.env.BREVO_FROM_EMAIL };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    res.status(200).json({ message: 'OTP sent successfully' });
    console.log('Email sent');
  } catch (error) {
    res.status(400).json({ error: 'error occurred while sending otp' });
    console.error(error);
  }
};

// Verify OTP


exports.resetPassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("error");
    return res.status(422).json({
      error: errors.array().map(err => err.msg+ " "),
    });
  }
  const { email, otp, password } = req.body;
  if (!email || !otp || !password) {
    return res.status(400).json({ error: 'Email, OTP, and password are required.' });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  if (user.otp !== otp) {
    return res.status(400).json({ error: 'Invalid OTP.' });
  }
  if (!user.otpExpiry || user.otpExpiry < new Date()) {
    return res.status(400).json({ error: 'OTP expired.' });
  }
  // Hash and set new password
  const hashedPassword = await bcrypt.hash(password, 12);
  user.password = hashedPassword;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();
  res.status(200).json({ message: 'Password reset successful.' });
};
