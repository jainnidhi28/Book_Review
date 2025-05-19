require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middlewares
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Import routes
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
app.use(authRoutes);
app.use('/books', bookRoutes);

const reviewRoutes = require('./routes/reviews');
app.use('/reviews', reviewRoutes);

const searchRoutes = require('./routes/search');
app.use('/search', searchRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Book Review API is running');
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  // Start server only after DB is connected
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('MongoDB connection error:', err);
});
