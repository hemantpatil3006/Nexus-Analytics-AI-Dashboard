const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// DUMMY DATABASE FOR SPRINT 5
// (In Sprint 6 we could replace this with PostgreSQL/MongoDB)
const users = []; 

// Generate JWT Helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Please add all fields' });
  }

  // Check if user exists
  const userExists = users.find((u) => u.username === username);
  if (userExists) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Hash password securely
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Store in memory
  const user = {
    id: users.length + 1,
    username,
    password: hashedPassword,
  };
  users.push(user);

  if (user) {
    res.status(201).json({
      _id: user.id,
      username: user.username,
      token: generateToken(user.id),
    });
  } else {
    res.status(400).json({ error: 'Invalid user data' });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Check for user
  const user = users.find((u) => u.username === username);

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      username: user.username,
      token: generateToken(user.id),
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
