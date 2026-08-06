const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handler');
const { errorLogger, requestLogger } = require('./middlewares/logger');
const { NotFoundError } = require('./errors');
const { createUser, login } = require('./controllers/users');
const {
  validateCreateUser,
  validateLogin,
} = require('./middlewares/validation');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/aroundb';

mongoose.connect(MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

app.use(auth);
app.use(usersRouter);
app.use(cardsRouter);

app.use((req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
