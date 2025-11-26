// routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Category = require('../models/category');
const Account = require('../models/account');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create user
    const user = new User({ name, email, password });
    await user.save();

    // Create default categories for new user
    const defaultCategories = [
      { name: 'Makanan & Minuman', type: 'expense', icon: '🍔', color: '#ef4444', userId: user._id, isDefault: true },
      { name: 'Transport', type: 'expense', icon: '🚗', color: '#f59e0b', userId: user._id, isDefault: true },
      { name: 'Belanja', type: 'expense', icon: '🛍️', color: '#ec4899', userId: user._id, isDefault: true },
      { name: 'Tagihan', type: 'expense', icon: '📄', color: '#8b5cf6', userId: user._id, isDefault: true },
      { name: 'Hiburan', type: 'expense', icon: '🎮', color: '#06b6d4', userId: user._id, isDefault: true },
      { name: 'Kesehatan', type: 'expense', icon: '💊', color: '#10b981', userId: user._id, isDefault: true },
      { name: 'Gaji', type: 'income', icon: '💰', color: '#22c55e', userId: user._id, isDefault: true },
      { name: 'Bonus', type: 'income', icon: '🎁', color: '#3b82f6', userId: user._id, isDefault: true },
    ];
    await Category.insertMany(defaultCategories);

    // Create default account
    const defaultAccount = new Account({
      name: 'Kas',
      type: 'cash',
      balance: 0,
      userId: user._id
    });
    await defaultAccount.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;