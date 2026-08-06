const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors');

const JWT_SECRET = process.env.JWT_SECRET || 'around-the-us-development-secret';

module.exports = (req, _res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Authorization required'));
    return;
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    next(new UnauthorizedError('Authorization required'));
  }
};
