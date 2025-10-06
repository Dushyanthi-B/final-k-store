const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Extract token from Authorization header
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });  // Return error if token is missing
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token using JWT_SECRET from .env
    req.user = decoded;  // Attach decoded user info to the request object for later use
    next();  // Call next middleware or route handler
  } catch (err) {
    console.error('Invalid token:', err);
    res.status(401).json({ message: 'Invalid or expired token' });  // Return error if token is invalid or expired
  }
};

module.exports = authMiddleware;
