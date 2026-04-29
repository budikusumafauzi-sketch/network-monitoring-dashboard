const log = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  log.error(err.stack); // Log the error stack for debugging

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong on the server.';

  res.status(statusCode).json({
    success: false,
    message: message,
    // In production, avoid sending stack traces to the client
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { errorHandler };
