import pino from 'pino';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// copy pasted fully from claud bot's logger.js with some adjustments for multiple loggers and file streams
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Base logger configuration
const baseConfig = {
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => {
      return { level: label };
    }
  }
};

// Development: pretty output to console
const devTransport = {
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'HH:MM:ss',
    ignore: 'pid,hostname'
  }
};

// Production: JSON to console + files
const isProduction = process.env.NODE_ENV === 'production';

// Main application logger (goes to console + app.log)
export const logger = pino(
  baseConfig,
  isProduction
    ? pino.multistream([
        { stream: process.stdout },
        { stream: fs.createWriteStream(path.join(logsDir, 'app.log'), { flags: 'a' }) }
      ])
    : pino.transport(devTransport)
);

// Scraping-specific logger (goes to console + scraping.log)
export const scrapingLogger = pino(
  { ...baseConfig, name: 'DataHarvester' },
  isProduction
    ? pino.multistream([
        { stream: process.stdout },
        { stream: fs.createWriteStream(path.join(logsDir, 'scraping.log'), { flags: 'a' }) }
      ])
    : pino.transport(devTransport)
);

// Database logger (goes to console + database.log)
export const dbLogger = pino(
  { ...baseConfig, name: 'database' },
  isProduction
    ? pino.multistream([
        { stream: process.stdout },
        { stream: fs.createWriteStream(path.join(logsDir, 'database.log'), { flags: 'a' }) }
      ])
    : pino.transport(devTransport)
);

// Error logger (only errors, goes to error.log)
export const errorLogger = pino(
  { ...baseConfig, level: 'error', name: 'error' },
  pino.multistream([
    { stream: process.stderr },
    { stream: fs.createWriteStream(path.join(logsDir, 'error.log'), { flags: 'a' }) }
  ])
);