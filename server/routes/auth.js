const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUserById, forgotPassword, resetPassword } = require('../controllers/authController');
const User = require('../models/User');  // or wherever your User model is located


// POST /api/auth/register
router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/user/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password'); // exclude password
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err });
    }
  });
  


// PUT /api/auth/user/email/:email
router.put('/user/:id', updateUserById);

// Password reset
router.post('/forgot', forgotPassword);
router.post('/reset', resetPassword);



module.exports = router;


