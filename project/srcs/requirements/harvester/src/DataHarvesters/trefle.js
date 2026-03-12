import { BaseDataHarvester } from "./base.js";
import { scrapingLogger } from '#utils/logger.js';

export class TrefleDataHarvester extends BaseDataHarvester {

    async getPlantList() {
		const token = process.env.TREFLE_TOKEN;
		if (!token) throw new Error('TREFLE_TOKEN environment variable is not set');
		
		const limit = this.settings.plant_limit;
        const slugs = [];
        let page = 1;
        let hasMore = true;

        scrapingLogger.info({ limit }, 'Fetching plant list from Trefle');

        while (hasMore) {
            const url = this.buildURl('plant_list', { token, page });
            scrapingLogger.info({ url, page }, 'Fetching plant list page');

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Trefle plant list returned ${response.status} on page ${page}`);
            }

            const json = await response.json();
            const plants = json.data || [];

            for (const plant of plants) {
                if (plant.slug) slugs.push(plant.slug);
                // stop early in dev
                if (limit > 0 && slugs.length >= limit) {
                    scrapingLogger.info({ count: slugs.length }, 'Dev limit reached');
                    return slugs;
                }
            }

            // check if there is a next page
            hasMore = !!json.links?.next;
            page++;
        }

        scrapingLogger.info({ count: slugs.length }, 'Plant list complete');
        return slugs;
    }

    async harvestPlantData(identifier, options = {}) {
		const token = process.env.TREFLE_TOKEN;
		if (!token) throw new Error('TREFLE_TOKEN environment variable is not set');

        scrapingLogger.info({ identifier }, 'Fetching plant data from Trefle');

        const url = this.buildURl('plant_detail', { slug: identifier, token });
        scrapingLogger.info({ url }, 'Calling species endpoint');

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Trefle species API returned ${response.status} for ${identifier}`);
        }

        const json = await response.json();
        const speciesData = json.data;

        scrapingLogger.trace({ identifier, speciesData }, 'Species data fetched');

        return {
            source: 'trefle',
            plant_identifier: identifier,
            data_type: 'species',
            raw_json: speciesData
        };
    }
}
