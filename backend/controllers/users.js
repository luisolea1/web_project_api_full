const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} = require('../errors');

const JWT_SECRET = process.env.JWT_SECRET || 'around-the-us-development-secret';

const sendUser = (res, user, status = 200) => {
  const safeUser = user.toObject();
  delete safeUser.password;
  return res.status(status).json(safeUser);
};

const getUsers = (req, res, next) => User.find({})
  .then((users) => res.json(users))
  .catch(next);

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User ID not found');
      }
      return res.json(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Invalid user ID'));
        return;
      }
      next(err);
    });
};

const getCurrentUser = (req, res, next) => User.findById(req.user._id)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('User ID not found');
    }
    return res.json(user);
  })
  .catch(next);

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return next(new BadRequestError('Email and password are required'));
  }

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name: name || undefined,
      about: about || undefined,
      avatar: avatar || undefined,
      email,
      password: hash,
    }))
    .then((user) => sendUser(res, user, 201))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid data provided'));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictError('Email is already registered'));
        return;
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return next(new UnauthorizedError('Incorrect email or password'));
  }

  return User.findOne({ email: email.toLowerCase() }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Incorrect email or password');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Incorrect email or password');
          }

          const token = jwt.sign(
            { _id: user._id },
            JWT_SECRET,
            { expiresIn: '7d' },
          );
          return res.json({ token });
        });
    })
    .catch(next);
};

const updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User ID not found');
      }
      return res.json(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid data provided'));
        return;
      }
      next(err);
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User ID not found');
      }
      return res.json(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid data provided'));
        return;
      }
      next(err);
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
