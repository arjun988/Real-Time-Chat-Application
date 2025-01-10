const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Hash the password before saving it
    // const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password });
    
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found with email:", email); // Log if user isn't found
      return res.status(401).json({ error: 'Invalid credentials in email' });
    }

    // Compare the provided password with the hashed password stored in the DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for email:", email); // Log password mismatch
      console.log("Stored password:", user.password);  // Log the stored hashed password
      console.log("Provided password:", password);     // Log the provided password for comparison

      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // If the credentials match, generate the token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.log(error); // Log any errors that occur
    res.status(500).json({ error: error.message });
  }
};
