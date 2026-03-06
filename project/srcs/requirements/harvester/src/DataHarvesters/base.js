export class BaseDataHarvester {
	constructor(config, settings) {
		if (!config) {
			throw new Error('Config object is required to initialize the DataHarvester');
		}
		if (!settings) {
			throw new Error('Settings object is required to initialize the DataHarvester');
		}
		this.config = config;
		this.settings = settings;
		//CHANGED
		//this.name = config.name;
		//this.baseUrl = config.baseUrl;
	}

	// limit is optional, if not provided, it should harvest all plants available on the source
	async getPlantList() {
		throw new Error(`${this.name}: getPlantList() method must be implemented`);
	}

	async harvestPlantData(identifier, options = {}) {
		throw new Error(`${this.name}: harvestPlantData() method must be implemented`);
	}

	buildURl(endpointkey, params = {}) {
		if (!this.config.endpoints || !this.config.endpoints[endpointkey]) {
			throw new Error(`${this.name}: Endpoint ${endpointkey} is not defined in the config`);
		}
		let endpoint = this.config.endpoints[endpointkey];
		for (const [key, value] of Object.entries(params)) {
			endpoint = endpoint.replace(`{${key}}`, value);
		}
		return `${this.config.base_url_api}${endpoint}`;
	}
	
	async sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}