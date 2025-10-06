const express = require('express');
const cors = require('cors');
const { connectToDb } = require('./config/db');
require('dotenv').config();
const ordersRoute = require('./routes/orders');  // Import orders route
const usersRoute = require('./routes/users');



const app = express();
const port = 5000;

// ✅ Updated CORS config to allow any localhost origin
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || origin.startsWith('http://localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST','PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions)); // Apply updated CORS middleware
app.use(express.json());

// Connect to MongoDB
connectToDb();

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoute);  // Use the orders route here
app.use('/api/users', usersRoute);


// Test route
app.get('/test', (req, res) => {
  res.send('Test route is working!');
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
