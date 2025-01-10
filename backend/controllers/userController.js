const User = require('../models/User');

exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const users = await User.find({ username: new RegExp(query, 'i') }).select('username');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
