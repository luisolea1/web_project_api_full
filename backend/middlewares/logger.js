const path = require('path');
const winston = require('winston');
const expressWinston = require('express-winston');

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
);

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
    new winston.transports.File({
      filename: path.join(__dirname, '..', 'request.log'),
    }),
  ],
  msg: 'HTTP {{req.method}} {{req.url}}',
});

const errorLogger = expressWinston.errorLogger({
  ...commonOptions,
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '..', 'error.log'),
    }),
  ],
});

module.exports = { errorLogger, requestLogger };
