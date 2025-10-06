// routes/users.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// GET /api/users/me - get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/users/me - update current user profile
router.put('/me', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const updates = {};
    const allowed = ['username', 'email', 'profile', 'gender', 'dateOfBirth', 'nationality'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    // Normalize dateOfBirth if present
    if (updates.dateOfBirth) {
      const parsed = new Date(updates.dateOfBirth);
      if (isNaN(parsed)) {
        return res.status(400).json({ message: 'Invalid dateOfBirth' });
      }
      updates.dateOfBirth = parsed;
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields provided' });
    }
    const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
