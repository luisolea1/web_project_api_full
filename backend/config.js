const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.join(__dirname, '.env'),
  quiet: true,
});

const DEVELOPMENT_JWT_SECRET = 'around-the-us-development-secret';

const getJwtSecret = (environment = process.env) => {
  if (environment.JWT_SECRET && environment.JWT_SECRET.trim()) {
    return environment.JWT_SECRET;
  }

  if (environment.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be defined in production');
  }

  return DEVELOPMENT_JWT_SECRET;
};

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/aroundb';
const JWT_SECRET = getJwtSecret();

module.exports = {
  getJwtSecret,
  JWT_SECRET,
  MONGO_URL,
  PORT,
};
