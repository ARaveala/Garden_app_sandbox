import pino from 'pino';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// consider adding if enabled trace to env... its alot of data and if not needed we should be able to turn it on and off

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// should logsDir dir path be configurable via env ?
const logsDir = process.env.LOGS_DIR || '/app/logs';

const baseConfig = {
	level: process.env.LOG_LEVEL || 'info',
	timestamp: pino.stdTimeFunctions.isoTime,  // ISO 8601 format
	base: null, // Don't include pid and hostname, add back in production if needed
	formatters: {
		level: (label) => {
			return { level: label };
		}
	}
};

// Shows jason output in a more readble form, good for development and debugging, but not ideal for production log files
function  prettyFileTransport(filepath) {
	return pino.transport({
		target: 'pino-pretty',
		options: {
			colorize: false,  // No colors in files
			translateTime: 'yyyy-mm-dd HH:MM:ss',
			ignore: 'pid,hostname',
			singleLine: false,
			destination: filepath  // Will be overridden per stream
		}
	});
}

// Writes raw JSON to file, good for production log files that will be parsed by log management tools
function jsonFileTransport(filepath) {
	return fs.createWriteStream(filepath, { flags: 'a' });
}

// Production: JSON to console + files
// fix , using poroduction now, should change to dev , unsure if trace logs in prod should also be in seperate files
const isProduction = process.env.NODE_ENV === 'production';

function createLogger(name, filename) {
	const usePretty = process.env.LOG_PRETTY === 'true';
	const fileTransport = usePretty ? prettyFileTransport : jsonFileTransport;

	const streams = [
		{ stream: fileTransport(path.join(logsDir, filename)) }
	];

	if (isProduction) {
		streams.push({
			stream: pino.transport({
				target: 'pino-pretty',
				options: {
					colorize: true,
					translateTime: 'HH:mm:ss',
					ignore: 'pid,hostname'
				}
			})
		},
		{
			level: 'trace',
			stream: fileTransport(path.join(logsDir, `${filename}-trace.log`))
		},
		{
			level: 'error',
			stream: fileTransport(path.join(logsDir, 'error.log'))
		}
	);
	} else {
		streams.push({ stream: process.stdout });
	}
	return pino({ ...baseConfig, name }, pino.multistream(streams));
}


export const logger = createLogger('app', 'app.log');
export const scrapingLogger = createLogger('DataHarvester', 'harvester.log');
export const dbLogger = createLogger('database', 'database.log');

export const errorLogger = pino({ ...baseConfig, level: 'error', name: 'error' },
	pino.multistream([
		{ stream: process.stderr },
		{ stream: fs.createWriteStream(path.join(logsDir, 'error.log'), { flags: 'a' }) }
	])
);
