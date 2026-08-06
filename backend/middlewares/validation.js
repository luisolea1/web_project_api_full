const { celebrate, Joi, Segments } = require('celebrate');

const objectIdSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required();
const urlSchema = Joi.string().uri({ scheme: ['http', 'https'] });

const validateCreateUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: urlSchema,
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).required(),
});

const validateLogin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).required(),
});

const validateUserId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: objectIdSchema,
  }),
});

const validateUpdateUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }).required(),
});

const validateUpdateAvatar = celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: urlSchema.required(),
  }).required(),
});

const validateCreateCard = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: urlSchema.required(),
  }).required(),
});

const validateCardId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: objectIdSchema,
  }),
});

module.exports = {
  validateCardId,
  validateCreateCard,
  validateCreateUser,
  validateLogin,
  validateUpdateAvatar,
  validateUpdateUser,
  validateUserId,
};
