// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Add bcrypt for password hashing


// Create the Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection URI (replace with your provided connection string)
const mongoURI = 'mongodb+srv://padmesh:%40Bpadmesh04@cluster0.5s5pq.mongodb.net/padmesh?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error:', err));

// Create a user schema and model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// POST request for user registration
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user is already registered
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Already Registered' });
    }

    // Create a new user
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(200).json({ message: 'Registration successful!' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
});


// POST request for user login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the input password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful!' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
