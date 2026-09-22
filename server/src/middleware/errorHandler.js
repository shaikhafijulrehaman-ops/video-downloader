/**
 * Centralized Error Handler
 * Sanitizes all errors and prevents leaking stack traces or internal paths to clients
 */
const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error('Unhandled request error:', {
    message: err.message,
    path: req.originalUrl,
    method: req.method
  });

  // Check if headers already sent
  if (res.headersSent) {
    return next(err);
  }

  // Determine status code
  const statusCode = err.status || err.statusCode || 500;

  // Friendly error message mapping
  let clientMessage = 'Something went wrong. Please try again in a moment.';
  if (statusCode === 400) {
    clientMessage = err.message || 'Please enter a valid video URL.';
  } else if (statusCode === 404) {
    clientMessage = 'The requested resource could not be found.';
  } else if (statusCode === 429) {
    clientMessage = 'Too many requests. Please try again later.';
  }

  res.status(statusCode).json({
    success: false,
    error: clientMessage
  });
}

module.exports = errorHandler;
