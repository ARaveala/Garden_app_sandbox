import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { USDAScraper } from './scrapers/usda.js';
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
    throw new Error(`Config file not found: ${configPath}`);
  }
  
  const configData = fs.readFileSync(configPath, 'utf8');
  return JSON.parse(configData);
}

/**
 * Main harvesting workflow
 */
async function main() {
  logger.info('========================================');
  logger.info('Starting Plant Data Harvester');
  logger.info('========================================');
  
  try {
    // 1. Test database connection first (fail fast)
    logger.info('Testing database connection...');
    await connectToDB();
    logger.info('✓ Database connection established');
    
    // 2. Load configuration
    logger.info('Loading configuration...');
    const config = loadConfig();
    logger.info('✓ Configuration loaded');
    
    // 3. Initialize USDA scraper
    logger.info('Initializing USDA scraper...');
    const scraper = new USDAScraper(config.usda);
    logger.info('✓ Scraper initialized');
    
    // 4. Get list of plants to scrape
    const PLANT_LIMIT = parseInt(process.env.PLANT_LIMIT || '3');
    logger.info({ limit: PLANT_LIMIT }, 'Fetching plant list...');
    
    const plantSymbols = await scraper.getPlantList(PLANT_LIMIT);
    logger.info({ count: plantSymbols.length, plants: plantSymbols }, '✓ Plant list retrieved');
    
    if (plantSymbols.length === 0) {
      logger.warn('No plants found to scrape');
      return;
    }
    
    // 5. Define data types to scrape per plant
    const dataTypes = ['traits', 'characteristics'];
    
    // 6. Scrape each plant
    logger.info('Starting data collection...');
    
    let totalScraped = 0;
    let totalInserted = 0;
    let totalSkipped = 0;
    let totalErrors = 0;
    
    for (const symbol of plantSymbols) {
      logger.info({ plant: symbol }, `Processing plant: ${symbol}`);
      
      for (const dataType of dataTypes) {
        try {
          // Scrape
          logger.info({ plant: symbol, type: dataType }, `Scraping ${dataType}...`);
          const result = await scraper.scrapePlantData(symbol, { dataType });
          totalScraped++;
          
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
      scraped: totalScraped,
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
//```
//
//---
//
//## Key Features of This index.js
//
//### 1. **Clear Flow**
//```
//Load config → Connect DB → Init scraper → Get plants → Scrape → Insert → Summary
//import mysql from 'mysql2/promise';
//
//import { chromium } from "playwright";
//
//async function main() {
//  // Connect to DB
//  const connection = await mysql.createConnection({
//    host: process.env.DB_HOST,
//    user: process.env.DB_USER,
//    password: process.env.DB_PASS,
//    database: process.env.DB_NAME
//  });
//
//console.log('Connected to database');
//
//const browser = await chromium.launch({
// // executablePath: "/usr/bin/chromium-browser",   // or /usr/bin/chromium
//  headless: true,
//  args: [
//    "--no-sandbox",
////    "--disable-gpu",
////    "--disable-dev-shm-usage",
//   // "--disable-setuid-sandbox",
////    "--disable-software-rasterizer"
//  ]
//});
//
//const page = await browser.newPage();
//
//await page.goto("https://plants.usda.gov/plant-profile/ABBA", {
//  waitUntil: "networkidle"
//});
//
//const traits = await page.evaluate(() => {
//  const rows = Array.from(document.querySelectorAll("tr"));
//  const data = {};
//  for (const row of rows) {
//    const key = row.querySelector("th")?.innerText;
//    const val = row.querySelector("td")?.innerText;
//    if (key && val) data[key] = val;
//  }
//  return data;
//});
//
//console.log('Data scarped:', traits);
//
//
//await browser.close();
//
////insert into DB
//await connection.execute(
//	  'INSERT INTO raw_harvest (source, plant_identifier, data_type, raw_json) VALUES (?, ?, ?, ?)',
//	  ['usda', 'abbot', 'traits', JSON.stringify(traits)]
//);
//
//console.log('Data inserted into database');
//// clean up 
//
//await connection.end();
//console.log("connection closed");
//process.exit(0);
//}
//main().catch(error => {
//  console.error('Error in main function:', error);
//  process.exit(1);
//});
//