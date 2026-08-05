const jwt = require('jsonwebtoken');

const ERROR_UNAUTHORIZED = 401;
const JWT_SECRET = process.env.JWT_SECRET || 'around-the-us-development-secret';

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(ERROR_UNAUTHORIZED).json({ message: 'Authorization required' });
    return;
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    res.status(ERROR_UNAUTHORIZED).json({ message: 'Authorization required' });
  }
};
