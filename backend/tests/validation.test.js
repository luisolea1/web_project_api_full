const test = require('node:test');
const assert = require('node:assert/strict');
const { isCelebrateError } = require('celebrate');
const {
  validateCardId,
  validateCreateCard,
  validateCreateUser,
  validateLogin,
  validateUpdateAvatar,
  validateUpdateUser,
  validateUserId,
} = require('../middlewares/validation');

const validate = (middleware, requestData) => new Promise((resolve) => {
  const req = {
    method: 'POST',
    headers: {},
    params: {},
    query: {},
    ...requestData,
  };

  middleware(req, {}, (err) => resolve(err));
});

const assertValid = async (middleware, requestData) => {
  const err = await validate(middleware, requestData);
  assert.equal(err == null, true);
};

const assertInvalid = async (middleware, requestData) => {
  const err = await validate(middleware, requestData);
  assert.equal(isCelebrateError(err), true);
};

test('registro acepta datos válidos y rechaza correo o URL inválidos', async () => {
  await assertValid(validateCreateUser, {
    body: {
      name: 'Persona',
      about: 'Exploradora',
      avatar: 'https://example.com/avatar.jpg',
      email: 'persona@example.com',
      password: 'segura123',
    },
  });

  await assertInvalid(validateCreateUser, {
    body: { email: 'correo-invalido', password: 'segura123' },
  });
  await assertInvalid(validateCreateUser, {
    body: {
      avatar: 'ftp://example.com/avatar.jpg',
      email: 'persona@example.com',
      password: 'segura123',
    },
  });
});

test('login exige correo y contraseña', async () => {
  await assertValid(validateLogin, {
    body: { email: 'persona@example.com', password: 'segura123' },
  });
  await assertInvalid(validateLogin, {
    body: { email: 'persona@example.com' },
  });
  await assertInvalid(validateLogin, {});
});

test('perfil y avatar respetan longitudes y protocolos permitidos', async () => {
  await assertValid(validateUpdateUser, {
    body: { name: 'Persona', about: 'Exploradora' },
  });
  await assertInvalid(validateUpdateUser, {
    body: { name: 'P', about: 'Exploradora' },
  });
  await assertValid(validateUpdateAvatar, {
    body: { avatar: 'https://example.com/avatar.jpg' },
  });
  await assertInvalid(validateUpdateAvatar, {
    body: { avatar: 'not-a-url' },
  });
});

test('tarjetas exigen nombre y enlace HTTP o HTTPS', async () => {
  await assertValid(validateCreateCard, {
    body: { name: 'Yosemite', link: 'https://example.com/yosemite.jpg' },
  });
  await assertInvalid(validateCreateCard, {
    body: { name: 'Y', link: 'https://example.com/yosemite.jpg' },
  });
  await assertInvalid(validateCreateCard, {
    body: { name: 'Yosemite', link: 'mailto:persona@example.com' },
  });
});

test('parámetros de usuarios y tarjetas deben ser ObjectId válidos', async () => {
  const validId = '507f1f77bcf86cd799439011';

  await assertValid(validateUserId, { params: { userId: validId } });
  await assertInvalid(validateUserId, { params: { userId: 'id-invalido' } });
  await assertValid(validateCardId, { params: { cardId: validId } });
  await assertInvalid(validateCardId, { params: { cardId: 'id-invalido' } });
});
