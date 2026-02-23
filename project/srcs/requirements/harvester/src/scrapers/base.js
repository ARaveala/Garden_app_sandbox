export class BaseScraper {
	constructor(config) {
		if (!config) {
			throw new Error('Config object is required to initialize the scraper');
		}

		this.config = config;
		this.name = config.name;
		this.baseUrl = config.baseUrl;
	}

	// limit is optional, if not provided, it should scrape all plants available on the source
	async getPlantList(limit) {
		throw new Error(`${this.name}: getPlantList() method must be implemented`);
	}

	async scrapePlantData(identifier, options = {}) {
		throw new Error(`${this.name}: scrapePlantData() method must be implemented`);
	}

	buildURl(endpointkey, params = {}) {
		if (!this.config.endpoints || !this.config.endpoints[endpointkey]) {
			throw new Error(`${this.name}: Endpoint ${endpointkey} is not defined in the config`);
		}
		let endpoint = this.config.endpoints[endpointkey];
		for (const [key, value] of Object.entries(params)) {
			endpoint = endpoint.replace(`{${key}}`, value);
		}
		return `${this.baseUrl}${endpoint}`;
	}

	async sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}