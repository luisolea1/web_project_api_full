const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const app = require('../app');
const { startServer, stopServer } = require('../server');

test('espera la conexión inicial a MongoDB antes de escuchar', async (t) => {
  const originalConnect = mongoose.connect;
  const originalDisconnect = mongoose.disconnect;
  const originalListen = app.listen;
  const events = [];
  let resolveConnection;

  const connection = new Promise((resolve) => {
    resolveConnection = resolve;
  });
  const fakeServer = {
    listening: true,
    close(callback) {
      events.push('close');
      this.listening = false;
      callback();
    },
  };

  mongoose.connect = () => {
    events.push('connect');
    return connection;
  };
  mongoose.disconnect = async () => {
    events.push('disconnect');
  };
  app.listen = (_port, callback) => {
    events.push('listen');
    setImmediate(() => callback());
    return fakeServer;
  };

  t.after(() => {
    mongoose.connect = originalConnect;
    mongoose.disconnect = originalDisconnect;
    app.listen = originalListen;
  });

  const startup = startServer();
  await new Promise((resolve) => {
    setImmediate(resolve);
  });
  assert.deepEqual(events, ['connect']);

  resolveConnection();
  await startup;
  assert.deepEqual(events, ['connect', 'listen']);

  await stopServer();
  assert.deepEqual(events, ['connect', 'listen', 'close', 'disconnect']);
});

test('no abre el puerto si falla la conexión inicial a MongoDB', async (t) => {
  const originalConnect = mongoose.connect;
  const originalListen = app.listen;
  let listenCalled = false;

  mongoose.connect = async () => {
    throw new Error('MongoDB unavailable');
  };
  app.listen = () => {
    listenCalled = true;
  };

  t.after(() => {
    mongoose.connect = originalConnect;
    app.listen = originalListen;
  });

  await assert.rejects(startServer(), /MongoDB unavailable/);
  assert.equal(listenCalled, false);
});
