const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token string: "Bearer eyJhb..."
      token = req.headers.authorization.split(' ')[1];

      // Decode the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      
      // Inject the decoded user context into the request
      req.user = decoded;
      
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    res.status(401).json({ error: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
