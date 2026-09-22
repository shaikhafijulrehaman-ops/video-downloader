/**
 * Rate Limiting Middleware
 * Protects backend from abuse and spam (default: 20 requests per IP per 10 minutes)
 */
const rateLimit = require('express-rate-limit');

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 10 * 60 * 1000; // 10 minutes
const max = parseInt(process.env.RATE_LIMIT_MAX, 10) || 20;

const apiLimiter = rateLimit({
  windowMs,
  max,
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,  // Disable `X-RateLimit-*` headers
  message: {
    success: false,
    error: 'Too many requests from this IP. Please try again in a few minutes.'
  },
  handler: (req, res, next, options) => {
    res.status(429).json(options.message);
  }
});

module.exports = { apiLimiter };
