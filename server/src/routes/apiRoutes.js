const express = require('express');
const router = express.Router();

const { ssrfGuardMiddleware } = require('../middleware/ssrfGuard');
const { apiLimiter } = require('../middleware/rateLimiter');
const { processVideo } = require('../controllers/processController');
const { streamMedia } = require('../controllers/streamController');
const { getSupportedPlatformsList } = require('../platforms');

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'DownloadHub API' });
});

// List supported platforms
router.get('/platforms', (req, res) => {
  res.status(200).json({
    success: true,
    platforms: getSupportedPlatformsList()
  });
});

// Main process endpoint
router.post('/process', apiLimiter, ssrfGuardMiddleware, processVideo);

// Stream download endpoint
router.get('/download', apiLimiter, streamMedia);

module.exports = router;
