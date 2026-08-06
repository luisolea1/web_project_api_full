const test = require('node:test');
const assert = require('node:assert/strict');
const { getJwtSecret } = require('../config');

test('config usa la clave de desarrollo fuera de producción', () => {
  assert.equal(
    getJwtSecret({ NODE_ENV: 'development' }),
    'around-the-us-development-secret',
  );
});

test('config prioriza JWT_SECRET cuando está definida', () => {
  assert.equal(
    getJwtSecret({ NODE_ENV: 'production', JWT_SECRET: 'production-secret' }),
    'production-secret',
  );
});

test('config impide iniciar producción sin JWT_SECRET', () => {
  assert.throws(
    () => getJwtSecret({ NODE_ENV: 'production' }),
    /JWT_SECRET must be defined in production/,
  );
});
