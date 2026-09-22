const app = require('./app');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  logger.info(`DownloadHub API server running on port ${PORT}`);
  logger.info(`Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, closing HTTP server gracefully');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, closing HTTP server gracefully');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});
