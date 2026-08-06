const express = require('express');
const {
  getUsers,
  getUserById,
  getCurrentUser,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');
const {
  validateUpdateAvatar,
  validateUpdateUser,
  validateUserId,
} = require('../middlewares/validation');

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/me', getCurrentUser);
router.get('/users/:userId', validateUserId, getUserById);
router.patch('/users/me/avatar', validateUpdateAvatar, updateUserAvatar);
router.patch('/users/me', validateUpdateUser, updateUserProfile);

module.exports = router;
