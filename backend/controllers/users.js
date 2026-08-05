const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ERROR_NOT_FOUND = 404;
const ERROR_SERVER = 500;
const ERROR_BAD_REQUEST = 400;
const ERROR_UNAUTHORIZED = 401;
const ERROR_CONFLICT = 409;
const JWT_SECRET = process.env.JWT_SECRET || 'around-the-us-development-secret';

const sendServerError = (res) => res
  .status(ERROR_SERVER)
  .json({ message: 'An error has occurred on the server' });

const sendUser = (res, user, status = 200) => {
  const safeUser = user.toObject();
  delete safeUser.password;
  return res.status(status).json(safeUser);
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.json(users))
    .catch(() => res.status(ERROR_SERVER).json({ message: 'An error has occurred on the server' }));
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).json({ message: 'User ID not found' });
        return;
      }
      res.json(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).json({ message: 'Invalid user ID' });
        return;
      }
      sendServerError(res);
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).json({ message: 'User ID not found' });
        return;
      }
      res.json(user);
    })
    .catch(() => sendServerError(res));
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    res.status(ERROR_BAD_REQUEST).json({ message: 'Email and password are required' });
    return;
  }

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => sendUser(res, user, 201))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).json({ message: 'Invalid data provided' });
        return;
      }
      if (err.code === 11000) {
        res.status(ERROR_CONFLICT).json({ message: 'Email is already registered' });
        return;
      }
      sendServerError(res);
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(ERROR_UNAUTHORIZED).json({ message: 'Incorrect email or password' });
    return;
  }

  User.findOne({ email: email.toLowerCase() }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Unauthorized'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Unauthorized'));
          }

          const token = jwt.sign(
            { _id: user._id },
            JWT_SECRET,
            { expiresIn: '7d' },
          );
          return res.json({ token });
        });
    })
    .catch((err) => {
      if (err.message === 'Unauthorized') {
        res.status(ERROR_UNAUTHORIZED).json({ message: 'Incorrect email or password' });
        return;
      }
      sendServerError(res);
    });
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).json({ message: 'User ID not found' });
        return;
      }
      res.json(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).json({ message: 'Invalid data provided' });
        return;
      }
      sendServerError(res);
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).json({ message: 'User ID not found' });
        return;
      }
      res.json(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).json({ message: 'Invalid data provided' });
        return;
      }
      sendServerError(res);
    });
};

module.exports = {
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  login,
  updateUserProfile,
  updateUserAvatar,
};
