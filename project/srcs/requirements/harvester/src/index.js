import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { USDADataHarvester } from './DataHarvesters/usda.js';
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
	logger.info(`limit: ${settings?.usda?.[env]?.plant_limit}`);

	// 3. Initialize USDA DataHarvester
	logger.info('Initializing USDA DataHarvester...');
	const DataHarvester = new USDADataHarvester(config.usda, settings.usda[env]);
	logger.info('✓ DataHarvester initialized');

	// 4. Get list of plants to harvest
	const plantSymbols = await DataHarvester.getPlantList();
	logger.trace({ count: plantSymbols.length, plants: plantSymbols }, '✓ Plant list retrieved');

	if (plantSymbols.length === 0) {
	  logger.warn('No plants found to harvest');
	  return;
	}

	// 5. Define data types to harvest per plant
	const dataTypes = ['traits', 'characteristics'];

	// 6. Harvest each plant, this needs adjustment, usda collects both at the same time now
	logger.info('Starting data collection...');

	let totalHarvested = 0;
	let totalInserted = 0;
	let totalSkipped = 0;
	let totalErrors = 0;

	// should create collect from, source and provide different source harvesting methods here 
	for (const symbol of plantSymbols) {
	  logger.info({ plant: symbol }, `Processing plant: ${symbol}`);
	  for (const dataType of dataTypes) {
	    try {
	      // Harvest
	      logger.info({ plant: symbol, type: dataType }, `Scraping ${dataType}...`);
	      const result = await DataHarvester.harvestPlantData(symbol, { dataType });
	      totalHarvested++;
		
	      // Insert into database
	      const inserted = await insertHarvest(result);
		
	      if (inserted) {
	        totalInserted++;
	        logger.info({ plant: symbol, type: dataType }, `✓ Saved ${symbol} - ${dataType}`);
	      } else {
	        totalSkipped++;
	        logger.info({ plant: symbol, type: dataType }, `⊘ ${symbol} - ${dataType} already exists`);
	      }
	  
	      // Rate limiting (respect the source)
	      const delayMs = 1000 / (config.usda.rate_limit?.requests_per_second || 1);
	      await new Promise(resolve => setTimeout(resolve, delayMs));
	  
	    } catch (err) {
	      totalErrors++;
	      errorLogger.error({ 
	        err, 
	        plant: symbol, 
	        dataType,
	        message: err.message,
	        stack: err.stack 
	      }, `Failed to process ${symbol} - ${dataType}`);
	  
	      // Continue with next data type instead of crashing
	      logger.warn({ plant: symbol, type: dataType }, 'Continuing to next item...');
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
