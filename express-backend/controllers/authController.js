const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const secretKey = '123456';

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Simulate user authentication based on email (replace with actual authentication logic)
  const user = await User.findOne({ email, password });

  console.log(user);
  if (user) {
    // Create a JWT token with the user's email and role
    const token = jwt.sign({ email: user.email, role: user.role }, secretKey, {
      expiresIn: '1h', // Token expires in 1 hour (adjust as needed)
    });

    res.cookie('joes', token);

    res.json(user);
  } else {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

exports.logout = async (req, res) => {
  // Implement logout logic if needed
  res.status(200).json({ message: 'Logout successful' });
};
