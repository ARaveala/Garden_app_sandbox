import { chromium } from "playwright";
import {BaseDataHarvester} from "./base.js";
import { scrapingLogger} from '#utils/logger.js';


function extractTaxonomy(ancestors) {
  if (!ancestors || !Array.isArray(ancestors)) return {};
  
  const taxonomy = {};
  for (const ancestor of ancestors) {
    const rank = ancestor.Rank?.toLowerCase();
    if (rank && ancestor.Symbol) {
      taxonomy[rank] = {
        symbol: ancestor.Symbol,
        name: ancestor.ScientificName?.replace(/<\/?i>/g, ''),
        commonName: ancestor.CommonName
      };
    }
  }
  return taxonomy;
}


export class USDADataHarvester extends BaseDataHarvester {
	async getPlantList(limit = 10) {
		scrapingLogger.info({ limit }, 'Fetching plant list from USDA API');
		const url = this.buildURl('search_api');
		scrapingLogger.info({ url }, 'Calling API');
  
		const response = await fetch(url);
		console.log('Response status:', response.status);
		const plants = await response.json();

		console.log('Response length:', JSON.stringify(plants).length);
		console.log('First 500 chars:', JSON.stringify(plants).substring(0, 500));
  
		const plantSymbols = plants.map(plant => plant.symbol)
			.filter(Boolean)
			.slice(0, limit);
	
		scrapingLogger.info({ count: plantSymbols.length, symbols: plantSymbols }, 'Symbols extracted');
  
		return plantSymbols;
	}
	
	async harvestPlantData(identifier, options = {}) {
		const dataType = options.dataType || 'full_profile';
  
		scrapingLogger.info({ identifier }, 'Fetching plant data from USDA');
  
  // Call 1: Get profile (includes ID)
		
  		const profileUrl = this.buildURl('plant_traits_api', { symbol: identifier });
		const profileResponse = await fetch(profileUrl);
		
		scrapingLogger.info({ profileUrl }, 'Fetching profile');

		if (!profileResponse.ok) {
			throw new Error(`Profile API returned ${profileResponse.status} for ${identifier}`);
		}
 
		const profileData = await profileResponse.json();
		profileData.taxonomy = extractTaxonomy(profileData.Ancestors);

		// get id for characteristics call
		const plantId = profileData.Id;
		scrapingLogger.trace({ identifier, hasProfile: !!profileData }, 'Profile data fetched');
		// Call 2: Get characteristics using ID from Call 1
		const characteristicsUrl = this.buildURl('plant_characteristics_api', { symbol: plantId });
		const characteristicsResponse = await fetch(characteristicsUrl);
		scrapingLogger.info({characteristicsUrl}, 'Fetching characteristics');

		if (!characteristicsResponse.ok) {
			scrapingLogger.warn({ identifier }, 'Characteristics not available');
		}

		// Some plants might not have characteristics - that's OK
		const characteristicsData = characteristicsResponse.ok 
			? await characteristicsResponse.json() 
			: null;

		scrapingLogger.trace({ identifier, hasCharacteristics: !!characteristicsData }, 'Data fetched');
		console.log('DEBUG profileData:', JSON.stringify(profileData).substring(0, 500));
		console.log('DEBUG characteristicsData:', characteristicsData ? 'exists' : 'null');

  // Minimal cleanup
		const { Ancestors, ...cleanProfile } = profileData;
		const combinedData = {
			profile: {
				...cleanProfile,
			taxonomy: profileData.taxonomy
			},

    // Keep characteristics as-is for now (cleaner will process later)
			characteristics: characteristicsData
  		};
		// show all details beforee return 
		scrapingLogger.info({ identifier, combinedData }, 'Returning combined data');
		return {
			source: 'usda',
			plant_identifier: identifier,  // Store the symbol
			data_type: dataType,
			raw_json: combinedData
	};
}}