import pino from 'pino';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// consider adding if enabled trace to env... its alot of data and if not needed we should be able to turn it on and off

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// should logsDir dir path be configurable via env ?
const logsDir = process.env.LOGS_DIR || '/app/logs';

/**
 * Base logger configuration, shared across all loggers
 */
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

/**
 * Provides a transport that writes pretty-printed logs to a file. This is useful for development and debugging, 
 * but may not be ideal for production. Log files should be parsed by log management tools.
 * The transport uses the 'pino-pretty' module to format the logs in a more human readable way,
 * allowing user to see json output in json format.
 * 
 * @param {*} filepath 
 * @returns format
 */

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

/**
 * Writes raw JSON to file, good for production log files that will be parsed by log management tools.
 * 
 * @param {*} filepath 
 * @returns stream
 */

function jsonFileTransport(filepath) {
	return fs.createWriteStream(filepath, { flags: 'a' });
}

// Production: JSON to console + files
// fix , using poroduction now, should change to dev , unsure if trace logs in prod should also be in seperate files
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Creates a logger instance with the specified name and filename.
 * In production, it writes JSON logs to both console and files, toggle can be found in .env.
 * 
 * log.trace will write to a seperate file log.log-trace.log, and log.error will write to error.log, while all logs will be written to filename.log
 * In development, it writes pretty printed logs to files, toggle can also be found in .env.
 * 
 * @param {*} name to distinguish loggers, should be the name of the module using the logger, e.g. 'app', 'DataHarvester', 'database'
 * @param {*} filename filename.log, should be the name of the module using the logger, e.g. 'app.log', 'harvester.log', 'database.log'
 * @returns logger instance
 */
function createLogger(name, filename) {
	const usePretty = process.env.LOG_PRETTY === 'true';
	const fileTransport = usePretty ? prettyFileTransport : jsonFileTransport;

	const streams = [
		{ stream: fileTransport(path.join(logsDir, filename)) }
	];

	if (!isProduction) {
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
