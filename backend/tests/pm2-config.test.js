const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const ecosystem = require('../ecosystem.config');

test('PM2 ejecuta una instancia de la API en modo producción', () => {
  assert.equal(ecosystem.apps.length, 1);

  const [api] = ecosystem.apps;
  assert.equal(api.name, 'around-api');
  assert.equal(api.script, 'server.js');
  assert.equal(api.cwd, path.resolve(__dirname, '..'));
  assert.equal(api.instances, 1);
  assert.equal(api.exec_mode, 'fork');
  assert.equal(api.autorestart, true);
  assert.equal(api.exp_backoff_restart_delay, 100);
  assert.equal(api.wait_ready, true);
  assert.equal(api.listen_timeout, 40000);
  assert.equal(api.kill_timeout, 5000);
  assert.equal(api.watch, false);
  assert.deepEqual(api.env_production, { NODE_ENV: 'production' });
  assert.equal(Object.hasOwn(api.env_production, 'JWT_SECRET'), false);
});
