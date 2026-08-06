const ERROR_SERVER = 500;

module.exports = (err, req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  const { statusCode = ERROR_SERVER } = err;
  const message = statusCode === ERROR_SERVER
    ? 'An error has occurred on the server'
    : err.message;

  res.status(statusCode).json({ message });
};
