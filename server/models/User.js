const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // To ensure emails are unique
  },
  password: {
    type: String,
    required: true,
  },
  profile: String,
  gender: String,
  dateOfBirth: Date,
  nationality: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
