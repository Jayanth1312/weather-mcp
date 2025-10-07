import { type Express } from 'express';
import pino from 'pino';
type Logger = pino.Logger;
declare const logger: Logger;
declare const createApp: () => Express;
export { createApp, logger };
