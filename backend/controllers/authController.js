import crypto from 'crypto';
import User from '../models/User.js';
import Customer from '../models/Customer.js';
import Worker from '../models/Worker.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendEmail, welcomeEmail, forgotPasswordEmail,passwordChangedEmail, } from '../services/emailService.js';


// @desc    Register user
// @route   POST /api/auth/register
export const register = asyncHandler(async (req, res) => {

  const { name, email, password, role, phone } = req.body;
  
  const exists = await User.findOne({ email });
  
  if (exists) {
  
  res.status(400);
  throw new Error("User already exists");
  
  }
  
  const totalUsers = await User.countDocuments();
  
  let userRole = "customer";
  
  // First user becomes admin automatically
  if(totalUsers===0){
  
  userRole="admin";
  
  }
  
  // Other users
  else if(
  ["customer","worker"].includes(role)
  ){
  
  userRole=role;
  
  }
  
  const user=await User.create({
  
  name,
  email,
  password,
  role:userRole,
  phone
  
  });
  
  if(userRole==="customer"){
  
  await Customer.create({
  
  user:user._id
  
  });
  
  }
  
  else if(userRole==="worker"){
  
  await Worker.create({
  
  user:user._id
  
  });
  
  }
  try {
  await sendEmail({
    to: user.email,
    ...welcomeEmail(user),
  });
} catch (err) {
  console.error("Welcome email failed:", err.message);
}
  res.status(201).json({
  
  _id:user._id,
  
  name:user.name,
  
  email:user.email,
  
  role:user.role,
  
  token:generateToken(
  user._id
  )
  
  });
  
  });
// @desc    Login user
// @route   POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    avatar: user.avatar,
    token: generateToken(user._id),
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  let profile = null;

  if (user.role === 'customer') {
    profile = await Customer.findOne({ user: user._id });
  } else if (user.role === 'worker') {
    profile = await Worker.findOne({ user: user._id });
  }

  res.json({ user, profile });
});

// @desc    Forgot password — send reset token
// @route   POST /api/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.json({ message: 'If that email exists, a reset link was sent.' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
 await sendEmail({
  to: user.email,
  ...forgotPasswordEmail(user, resetUrl),
});

  res.json({ message: 'If that email exists, a reset link was sent.', resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined });
});

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
export const resetPassword = asyncHandler(async (req, res) => {
  const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpire +password');

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired reset token');
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  try {
  await sendEmail({
    to: user.email,
    ...passwordChangedEmail(user),
  });
} catch (err) {
  console.error("Password changed email failed:", err.message);
}

  res.json({
    message: 'Password updated successfully',
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});
