const test = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const errorHandler = require('../middlewares/error-handler');

const JWT_SECRET = process.env.JWT_SECRET || 'around-the-us-development-secret';

const createResponse = () => {
  let resolveResponse;
  const completed = new Promise((resolve) => {
    resolveResponse = resolve;
  });

  const res = {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      resolveResponse({ statusCode: this.statusCode, body });
      return this;
    },
  };

  return { res, completed };
};

const handleWithMiddleware = (res) => (err) => {
  errorHandler(err, {}, res, () => {});
};

test('createUser cifra la contraseña y no la devuelve', async (t) => {
  const originalCreate = User.create;
  t.after(() => {
    User.create = originalCreate;
  });

  let savedUser;
  User.create = async (userData) => {
    savedUser = userData;
    return {
      ...userData,
      _id: '507f1f77bcf86cd799439011',
      toObject() {
        return { ...this };
      },
    };
  };

  const { res, completed } = createResponse();
  createUser(
    { body: { email: 'persona@example.com', password: 'segura123' } },
    res,
    handleWithMiddleware(res),
  );
  const response = await completed;

  assert.equal(response.statusCode, 201);
  assert.equal(response.body.email, 'persona@example.com');
  assert.equal(response.body.password, undefined);
  assert.notEqual(savedUser.password, 'segura123');
  assert.equal(await bcrypt.compare('segura123', savedUser.password), true);
});

test('createUser responde 409 si el correo ya existe', async (t) => {
  const originalCreate = User.create;
  t.after(() => {
    User.create = originalCreate;
  });

  User.create = async () => {
    const duplicateError = new Error('duplicate key');
    duplicateError.code = 11000;
    throw duplicateError;
  };

  const { res, completed } = createResponse();
  createUser(
    { body: { email: 'persona@example.com', password: 'segura123' } },
    res,
    handleWithMiddleware(res),
  );
  const response = await completed;

  assert.deepEqual(response, {
    statusCode: 409,
    body: { message: 'Email is already registered' },
  });
});

test('login entrega un JWT válido para credenciales correctas', async (t) => {
  const originalFindOne = User.findOne;
  t.after(() => {
    User.findOne = originalFindOne;
  });

  const passwordHash = await bcrypt.hash('segura123', 10);
  User.findOne = () => ({
    select: () => Promise.resolve({
      _id: '507f1f77bcf86cd799439011',
      password: passwordHash,
    }),
  });

  const { res, completed } = createResponse();
  login(
    { body: { email: 'persona@example.com', password: 'segura123' } },
    res,
    handleWithMiddleware(res),
  );
  const response = await completed;
  const payload = jwt.verify(response.body.token, JWT_SECRET);

  assert.equal(response.statusCode, 200);
  assert.equal(payload._id, '507f1f77bcf86cd799439011');
});

test('login rechaza una contraseña incorrecta', async (t) => {
  const originalFindOne = User.findOne;
  t.after(() => {
    User.findOne = originalFindOne;
  });

  const passwordHash = await bcrypt.hash('segura123', 10);
  User.findOne = () => ({
    select: () => Promise.resolve({
      _id: '507f1f77bcf86cd799439011',
      password: passwordHash,
    }),
  });

  const { res, completed } = createResponse();
  login(
    { body: { email: 'persona@example.com', password: 'incorrecta' } },
    res,
    handleWithMiddleware(res),
  );
  const response = await completed;

  assert.deepEqual(response, {
    statusCode: 401,
    body: { message: 'Incorrect email or password' },
  });
});

test('auth acepta un token Bearer válido', () => {
  const token = jwt.sign({ _id: '507f1f77bcf86cd799439011' }, JWT_SECRET);
  const req = { headers: { authorization: `Bearer ${token}` } };
  const { res } = createResponse();
  let nextCalled = false;

  auth(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(req.user._id, '507f1f77bcf86cd799439011');
  assert.equal(res.body, undefined);
});

test('auth rechaza tokens inválidos o ausentes', () => {
  [undefined, 'Bearer token-invalido'].forEach((authorization) => {
    const req = { headers: { authorization } };
    const { res } = createResponse();

    auth(req, res, handleWithMiddleware(res));

    assert.equal(res.statusCode, 401);
    assert.deepEqual(res.body, { message: 'Authorization required' });
  });
});

test('el manejador central oculta los detalles de errores internos', () => {
  const { res } = createResponse();

  errorHandler(new Error('database unavailable'), {}, res, () => {});

  assert.equal(res.statusCode, 500);
  assert.deepEqual(res.body, { message: 'An error has occurred on the server' });
});
