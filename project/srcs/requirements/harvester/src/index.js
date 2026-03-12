import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { USDADataHarvester } from './DataHarvesters/usda.js';
import { TrefleDataHarvester } from './DataHarvesters/trefle.js';
import { connectToDB, insertHarvest, closeDBConnection } from './db_connection.js';
import { logger, errorLogger } from '#utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Load configuration from sources.json
 * @returns {Object} Configuration object
 */
function loadConfig() {
	const configPath = path.join(__dirname, '../config/sources.json');
	if (!fs.existsSync(configPath)) {
		logger.error({configPath}, ': not found');
		throw new Error(`Config file not found: ${configPath}`);
	}
  	const configData = fs.readFileSync(configPath, 'utf8');
  	return JSON.parse(configData);
}

function loadSettings() {
	const settingsPath = path.join(__dirname, '../config/settings.json');
	if (!fs.existsSync(settingsPath)) {
		logger.error({settingsPath}, ': not found');
		throw new Error(`Config file not found: ${settingsPath}`);
	}
	const settingsData = fs.readFileSync(settingsPath, 'utf8');
  	return JSON.parse(settingsData);

}
/**
 * Main harvesting workflow
 */
async function main() {
	
	const env = process.env.NODE_ENV || 'dev';
	logger.info('========================================');
	logger.info(`Starting Plant Data Harvester in ( ${env} ) mode`);
	logger.info('========================================');
	try {
	// 1. Test database connection first (fail fast)
	logger.info('Testing database connection...');
	await connectToDB();
	logger.info('✓ Database connection established');

	// 2. Load configuration
	logger.info('Loading configuration...');
	const config = loadConfig();
	const settings = loadSettings();
	logger.info('✓ Configuration loaded');
	logger.debug(`limit: ${settings?.usda?.[env]?.plant_limit}`);
	logger.debug(`limit: ${settings?.trefle?.[env]?.plant_limit}`);

	//Initialize USDA DataHarvester
	logger.info('Initializing DataHarvesters...');

	let totalHarvested = 0;
	let totalInserted = 0;
	let totalSkipped = 0;
	let totalErrors = 0;
	const harvesters = [
		new USDADataHarvester(config.usda, settings.usda[env]),
		new TrefleDataHarvester(config.trefle, settings.trefle[env])
	]

	logger.info('✓ DataHarvesters initialized , starting data collection');
	for (const harvester of harvesters) {
  		const list = await harvester.getPlantList()
  		for (const identifier of list) {
    		logger.info({ plant: identifier }, `Processing `);
			try {
				const result = await harvester.harvestPlantData(identifier)
				totalHarvested++;
				const inserted = await insertHarvest(result);
				if (inserted) { 
					totalInserted++;
					logger.debug({plant: identifier, harvester: harvester.config.name}, `✓ Saved`);
				}
				else { 
					totalSkipped++; 
					logger.debug({plant: identifier, harvester: harvester.config.name}, `⊘ already in database`);
				}
				const delayMs = 1000 / (harvester.config.rate_limit?.requests_per_second || 1);
				await new Promise(resolve => setTimeout(resolve, delayMs));
			}
			catch (err) {
				totalErrors++;
				errorLogger.error({ 
					err, 
					plant: identifier, 
					harvester: harvester.config.name,
					message: err.message,
					stack: err.stack 
				}, `Failed to process ${identifier} - ${harvester.config.name}`);
				// Continue with next data type instead of crashing
				logger.warn({ plant: identifier, harvester: harvester.config.name }, 'Continuing to next item...');
			}
  		}
	}
	// 7. Summary
    logger.info('========================================');
    logger.info('Harvesting Complete');
    logger.info({ 
      harvestd: totalHarvested,
      inserted: totalInserted,
      skipped: totalSkipped,
      errors: totalErrors
    }, 'Summary');
    logger.info('========================================');
    
  } catch (err) {
    errorLogger.error({ 
      err, 
      message: err.message,
      stack: err.stack 
    }, 'Fatal error in main workflow');
    throw err;
    
  } finally {
    // Always close database connection
    await closeDBConnection();
  }
}

// Execute main and handle process exit
main()
  .then(() => {
    logger.info('Exiting successfully');
    process.exit(0);
  })
  .catch((err) => {
    errorLogger.error({ err }, 'Application crashed');
    process.exit(1);
  });
