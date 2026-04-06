require('dotenv').config();
const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./src/routes/uploadRoutes');
const queryRoutes = require('./src/routes/queryRoutes');
const authRoutes = require('./src/routes/authRoutes');
const { protect } = require('./src/middlewares/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); // Public endpoints for login/registration

// Protected Routes
app.use('/api/upload', protect, uploadRoutes);
app.use('/api/query', protect, queryRoutes);

app.get('/', (req, res) => {
  res.send('AI Data Analyst Backend is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
