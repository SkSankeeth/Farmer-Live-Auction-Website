const rateLimit = require('express-rate-limit');

// Different rate limits for different endpoints
const rateLimits = {
  // Auth endpoints - stricter limits
  auth: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: {
      success: false,
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many authentication attempts, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false
  }),

  // General API endpoints
  general: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: {
      success: false,
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false
  }),

  // Bidding endpoints - very strict
  bidding: rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // 10 bids per minute
    message: {
      success: false,
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many bids, please slow down'
    },
    standardHeaders: true,
    legacyHeaders: false
  }),

  // Upload endpoints
  upload: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 uploads per window
    message: {
      success: false,
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many file uploads, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false
  }),

  // Payment endpoints - strict
  payment: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 payment attempts per window
    message: {
      success: false,
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many payment attempts, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false
  })
};

module.exports = { rateLimits };
