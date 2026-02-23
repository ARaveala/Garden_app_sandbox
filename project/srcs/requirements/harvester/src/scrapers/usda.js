import { chromium } from "playwright";
import {BaseScraper} from "./base.js";
import { scrapingLogger } from '#utils/logger.js';

export class USDAScraper extends BaseScraper {
	async getPlantList(limit = 10) {
  scrapingLogger.info({ limit }, 'Fetching plant list from USDA API');
  
  const url = `${this.config.baseurl2}/api/characteristicSearchResults`;
  scrapingLogger.info({ url }, 'Calling API');
  
  const response = await fetch(url);
    console.log('Response status:', response.status);
  //console.log('Response headers:', response.headers.raw());
  const plants = await response.json();
  
    console.log('Response length:', JSON.stringify(plants).length);
  console.log('First 500 chars:', JSON.stringify(plants).substring(0, 500));
  
  // Parse XML to extract symbols
 // const symbolMatches = xmlText.matchAll(/<Symbol>(.*?)<\/Symbol>/g);
  const plantSymbols = plants.map(plant => plant.symbol)
    .filter(Boolean)
    .slice(0, limit);
  
  scrapingLogger.info({ count: plantSymbols.length, symbols: plantSymbols }, 'Symbols extracted');
  
  return plantSymbols;
}
//	async getPlantList(limit = 10) {
//  scrapingLogger.info({ limit }, 'Fetching plant list from USDA');
//  
//  const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
//  const page = await browser.newPage();
//  
//  //const url = this.buildURl('browse');
//  const url = `${this.config.base_url}/api/characteristicSearchResults`
////  const url = 'https://plants.usda.gov/browse.html'; 
//  await page.goto(url, { waitUntil: "networkidle" });
//  
//  scrapingLogger.info({ url }, 'Page loaded successfully');
//  
//  // DEBUG: Try multiple selectors
//  const testSelectors = [
//    "table tbody tr th[scope='row'] a",
//    "table tr th a",
//    "table a",
//    "a[href*='plant-profile']",
//    "a[href*='symbol']",
//    "tbody tr",
//    "table"
//  ];
//  
//  for (const sel of testSelectors) {
//    const count = await page.evaluate((selector) => {
//      return document.querySelectorAll(selector).length;
//    }, sel);
//    console.log(`Selector "${sel}": ${count} matches`);
//  }
//  
//  // DEBUG: Get all hrefs on the page
//  const allLinks = await page.evaluate(() => {
//    return Array.from(document.querySelectorAll('a'))
//      .map(a => a.href)
//      .filter(href => href.includes('plant') || href.includes('symbol'))
//      .slice(0, 10);
//  });
//  console.log('Sample plant-related links:', allLinks);
//  
//  await browser.close();
//  return [];
//}
	//async getPlantList(limit) {
	//	const browser = await chromium.launch({
	//		headless: true,
	//		args: [
	//	    	"--no-sandbox",
	//		//    "--disable-gpu",
	//		//    "--disable-dev-shm-usage",
	//		// "--disable-setuid-sandbox",
	//		//    "--disable-software-rasterizer"
	//		]
	//	});
//
	//	const page = await browser.newPage();
	//	scrapingLogger.info({ limit }, `Launching browser to get plant list with limit`);
	//	const url = this.buildURl('browse');
	//	await page.goto(url, {
	//		waitUntil: "networkidle"
	//	});
	//	scrapingLogger.info({url}, `Navigated to plant list page`);
	//	const selector = this.config.selectors.plant_list_links;
	//	scrapingLogger.info({ selector }, `Using plant list selector to extract plant symbols`);
	//	const plantSymbols = await page.evaluate((args) => {
	//		const { selector, limit } = args;
	//		 console.log('Selector:', selector);
	//		//scrapingLogger.info({ selector}, 'Evaluating plant list selector');
	//		const links = Array.from(document.querySelectorAll(selector));
	//	  console.log('Found links:', links.length);
//	//		scrapingLogger.info({ count: links.length }, `Found ${links.length} plant links on the page`);
	//		return links.slice(0, limit).map(link => {
	//			const match = link.href.match(/plant-profile\/([A-Z0-9]+)/);
	//			return match ? match[1] : null;
	//		}).filter(Boolean);
	//	}, {selector, limit});
//
	//	await browser.close();
	//	return plantSymbols;
	//}

	//async scrapePlantData(identifier, options = {}) {
	//	const browser = await chromium.launch({
	//		headless: true,
	//		args: [
	//	    	"--no-sandbox",
	//		//    "--disable-gpu",
	//		//    "--disable-dev-shm-usage",
	//		// "--disable-setuid-sandbox",
	//		//    "--disable-software-rasterizer"
	//		]
	//	});
	//	const page = await browser.newPage();
//	//	const endpoint = this.config
// t//his must eb adjusted so that we have charactaristics also , based on data type
	//	const url = this.buildURl('plant_traits', { identifier });
	//	await page.goto(url, {
	//		waitUntil: "networkidle"
	//	});
	//	scrapingLogger.info({url:  url, id: identifier }, `Navigated to plant profile page for identifier`);
	//	const selector = this.config.selectors.trait_table_rows;
	//	const traits = await page.evaluate((selector) => {
	//		const rows = Array.from(document.querySelectorAll(selector));
	//		const data = {};
	//		for (const row of rows) {
	//			const key = row.querySelector("th")?.innerText;
	//			const val = row.querySelector("td")?.innerText;
	//			if (key && val) data[key] = val;
	//		}
	//		return data;
	//	}, selector);
	//	scrapingLogger.info({ traits }, `Scraped traits for plant identifier`);
	//	await browser.close();
	//	return traits;
	//}
//
async scrapePlantData(identifier, options = {}) {
  const dataType = options.dataType || 'profile';
  
  scrapingLogger.info({ identifier, dataType }, 'Fetching plant data from API');
  
  // Use the API instead of scraping HTML!
  const url = `https://plantsservices.sc.egov.usda.gov/api/PlantProfile?symbol=${identifier}`;
  scrapingLogger.info({ url }, 'Calling PlantProfile API');
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`API returned ${response.status} for ${identifier}`);
  }
  
  const xmlText = await response.text();
  
  // Parse the XML to extract the actual plant data
  // For now, let's just store the whole thing and parse it later
  const plantData = {
    xmlResponse: xmlText,
    // We can add parsed fields here later
  };
  
  scrapingLogger.info({ identifier }, 'Plant data fetched successfully');
  
  return {
    source: 'usda',
    plant_identifier: identifier,
    data_type: dataType,
    raw_json: plantData  // ← This is NOT undefined
  };
}
}