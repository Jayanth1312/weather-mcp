import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import pino from 'pino';
import { weatherRouter } from '../routes/weather.routes';

type Logger = pino.Logger;

const logger: Logger = pino(
  {
    level: process.env["LOG_LEVEL"] || "info",
  },
  pino.destination(2)
);

const createApp = (): Express => {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  });
  app.use(limiter);

  // Logging middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.originalUrl}`);
    next();
  });

  // Health check endpoint
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  app.use('/api/weather', weatherRouter);

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Not Found' });
  });

  // Error handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });

  return app;
};

export { createApp, logger };
