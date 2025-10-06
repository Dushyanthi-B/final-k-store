const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const registerUser = async (req, res) => {
  const { username, email, password, profile, gender, dateOfBirth, nationality } = req.body;

  if (!username || !email || !password || !profile || !gender || !dateOfBirth || !nationality) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 12); // Increased salt rounds for security

    const parsedDateOfBirth = new Date(dateOfBirth);
    if (isNaN(parsedDateOfBirth)) {
      return res.status(400).json({ message: 'Invalid date of birth' });
    }

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profile,
      gender,
      dateOfBirth: parsedDateOfBirth,
      nationality,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};

const loginUser = async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, profile: user.profile },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ token, user });
  } catch (error) {
    console.error('Login error: ', error.message);
    res.status(500).json({ message: 'Login failed. Server error' });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  // Validate the user ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Invalid user ID');
  }

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).send('User not found');
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err.message);
    res.status(500).send('Server error');
  }
};

// Update user by ID
const updateUserById = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  // Validate the user ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Invalid user ID');
  }

  try {
    // Normalize dateOfBirth if present
    if (updatedData.dateOfBirth) {
      const parsed = new Date(updatedData.dateOfBirth);
      if (isNaN(parsed)) {
        return res.status(400).json({ message: 'Invalid dateOfBirth' });
      }
      updatedData.dateOfBirth = parsed;
    }
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).send('User not found');

    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).send('Server error');
  }
};


module.exports = {
  registerUser,
  loginUser,
  getUserById,
  updateUserById,
  async forgotPassword(req, res) {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(200).json({ message: 'If that email exists, a reset link was sent' });
      const token = crypto.randomBytes(20).toString('hex');
      user.resetPasswordToken = token;
      user.resetPasswordExpires = new Date(Date.now() + 60 * 1000); // 1 minute
      await user.save();
      // Create transport (for demo: use ethereal or local SMTP; here we'll log the link)
      try {
        let transporter;
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
          transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.ethereal.email',
            port: parseInt(process.env.SMTP_PORT || '587', 10),
            secure: false,
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
          });
        } else {
          const testAccount = await nodemailer.createTestAccount();
          transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: { user: testAccount.user, pass: testAccount.pass },
          });
          console.log('Using Ethereal test SMTP:', testAccount.user);
        }
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset?token=${token}`;
        const info = await transporter.sendMail({
          from: process.env.MAIL_FROM || 'no-reply@k-books.local',
          to: user.email,
          subject: 'K-Books Password Reset',
          text: `Reset your password: ${resetLink}`,
          html: `<p>Click to reset your password:</p><p><a href=\"${resetLink}\">${resetLink}</a></p>`,
        });
        console.log('Reset email sent', info.messageId);
        const preview = nodemailer.getTestMessageUrl(info);
        if (preview) {
          console.log('Preview email URL:', preview);
        }
      } catch (mailErr) {
        console.warn('Email send failed; continuing with token only.', mailErr);
      }
      return res.json({ message: 'Reset link generated', token });
    } catch (e) {
      console.error('forgotPassword error', e);
      return res.status(500).json({ message: 'Server error' });
    }
  },
  async resetPassword(req, res) {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ message: 'Token and password are required' });
    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() },
      });
      if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
      const bcrypt = require('bcryptjs');
      user.password = await bcrypt.hash(password, 12);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return res.json({ message: 'Password has been reset' });
    } catch (e) {
      console.error('resetPassword error', e);
      return res.status(500).json({ message: 'Server error' });
    }
  },
};
