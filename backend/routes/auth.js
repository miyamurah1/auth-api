const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const { User } = require('../db');                    
const authMiddleware = require('../middleware/auth'); 

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).end();
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).end();
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });
    res.status(201).end();
  } catch (err) {
    res.status(500).end();
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).end();
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).end();
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).end();
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });
    res.status(200).end();
  } catch (err) {
    res.status(500).end();
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).end();
    res.status(200).json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).end();
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).end();
});

module.exports = router;