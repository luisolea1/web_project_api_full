const path = require('path');
const winston = require('winston');
const expressWinston = require('express-winston');

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
);

const MAX_LOG_SIZE = 5 * 1024 * 1024;
const MAX_LOG_FILES = 5;

const createFileTransport = (filename) => new winston.transports.File({
  filename: path.join(__dirname, '..', filename),
  maxsize: MAX_LOG_SIZE,
  maxFiles: MAX_LOG_FILES,
  tailable: true,
});

const commonOptions = {
  format: logFormat,
  meta: true,
  requestWhitelist: [
    'url',
    'headers',
    'method',
    'httpVersion',
    'originalUrl',
    'query',
  ],
  headerBlacklist: ['authorization', 'cookie'],
};

const requestLogger = expressWinston.logger({
  ...commonOptions,
  transports: [
    createFileTransport('request.log'),
  ],
  msg: 'HTTP {{req.method}} {{req.url}}',
});

const errorLogger = expressWinston.errorLogger({
  ...commonOptions,
  transports: [
    createFileTransport('error.log'),
  ],
});

module.exports = { errorLogger, requestLogger };
