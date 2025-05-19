const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper to generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// POST /signup
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log('Signup attempt:', { username, email });
    if (!username || !email || !password) {
      console.log('Signup error: missing fields');
      return res.status(400).json({ message: 'All fields are required' });
    }
    const query = { $or: [{ email }, { username }] };
    console.log('Signup query:', JSON.stringify(query));
    const exists = await User.findOne(query);
    console.log('Signup exists result:', exists);
    if (exists) {
      console.log('Signup error: User already exists');
      return res.status(409).json({ message: 'User already exists' });
    }
    const user = new User({ username, email, password });
    await user.save();
    const token = generateToken(user);
    console.log('Signup success for:', username);
    res.status(201).json({ token });
  } catch (err) {
    console.error('Signup server error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
