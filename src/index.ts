import 'dotenv/config';
import http from 'http';
import { createApp } from './server/app';
import { logger } from './server/app';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      NODE_ENV?: 'development' | 'production' | 'test';
      OPENWEATHER_API_KEY?: string;
    }
  }
}

const PORT = process.env.PORT || 3000;

// Create Express app
const app = createApp();
const server = http.createServer(app);

// Start the server
server.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
});

process.on('unhandledRejection', (reason: unknown) => {
  if (reason instanceof Error) {
    logger.error({ error: reason }, 'Unhandled Rejection');
  } else {
    logger.error({ reason }, 'Unhandled Rejection with non-Error reason');
  }
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err: Error) => {
  logger.error({ error: err }, 'Uncaught Exception');
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
  });
});
