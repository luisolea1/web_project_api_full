const mongoose = require('mongoose');
const app = require('./app');
const { MONGO_URL, PORT } = require('./config');

let httpServer;
let shutdownPromise;

const listen = () => new Promise((resolve, reject) => {
  httpServer = app.listen(PORT, (error) => {
    if (error) {
      httpServer = undefined;
      reject(error);
      return;
    }

    console.log(`Server running on http://localhost:${PORT}`);
    resolve(httpServer);
  });
});

const startServer = async () => {
  await mongoose.connect(MONGO_URL);
  console.log('Connected to MongoDB');

  const server = await listen();

  if (typeof process.send === 'function') {
    process.send('ready');
  }

  return server;
};

const closeHttpServer = () => new Promise((resolve, reject) => {
  if (!httpServer || !httpServer.listening) {
    httpServer = undefined;
    resolve();
    return;
  }

  httpServer.close((error) => {
    httpServer = undefined;

    if (error) {
      reject(error);
      return;
    }

    resolve();
  });
});

const stopServer = async () => {
  await closeHttpServer();
  await mongoose.disconnect();
};

const releaseProcess = () => {
  if (process.connected) {
    process.disconnect();
  }
};

const shutdown = (signal) => {
  if (shutdownPromise) {
    return shutdownPromise;
  }

  console.log(`Received ${signal}. Shutting down gracefully.`);
  shutdownPromise = stopServer()
    .then(() => {
      console.log('Server and MongoDB connections closed');
      process.exitCode = 0;
    })
    .catch((error) => {
      console.error('Graceful shutdown failed:', error);
      process.exitCode = 1;
    })
    .finally(releaseProcess);

  return shutdownPromise;
};

const handleStartupError = async (error) => {
  console.error('Server startup failed:', error);

  try {
    await stopServer();
  } catch (shutdownError) {
    console.error('Startup cleanup failed:', shutdownError);
  }

  process.exitCode = 1;
  releaseProcess();
};

if (require.main === module) {
  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
  startServer().catch(handleStartupError);
}

module.exports = { startServer, stopServer };
