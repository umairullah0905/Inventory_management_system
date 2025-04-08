const User = require('../models/user.model.js');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")

dotenv.config();

const secret = process.env.JWT_SECRET;
const generateToken = (id) =>
  jwt.sign({ id }, secret, { expiresIn: '7d' });

const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });
  await user.save();
  res.json({ token: generateToken(user._id), user });
};

 const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ message: 'Invalid credentials' });

  res.json({ token: generateToken(user._id), user });
};

 const getProfile = async (req, res) => {
    res.json(req.user); // `req.user` is populated by `protect` middleware
  };

module.exports = {
    register,
    login,
    getProfile
};