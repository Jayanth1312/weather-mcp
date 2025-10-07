import express from 'express';
import rateLimit from 'express-rate-limit';
import pino from 'pino';
import { weatherRouter } from '../routes/weather.routes';
const logger = pino({
    level: process.env["LOG_LEVEL"] || "info",
}, pino.destination(2));
const createApp = () => {
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
    app.use((req, res, next) => {
        logger.info(`${req.method} ${req.originalUrl}`);
        next();
    });
    // Health check endpoint
    app.get('/health', (req, res) => {
        res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    // API routes
    app.use('/api/weather', weatherRouter);
    // 404 handler
    app.use((req, res) => {
        res.status(404).json({ error: 'Not Found' });
    });
    // Error handler
    app.use((err, req, res, next) => {
        logger.error(err.stack);
        res.status(500).json({ error: 'Something went wrong!' });
    });
    return app;
};
export { createApp, logger };
//# sourceMappingURL=app.js.map