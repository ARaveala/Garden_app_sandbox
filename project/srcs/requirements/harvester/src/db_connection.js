import mysql from 'mysql2/promise';

let connection = null;

export async function connectToDB() {
	if (!connection) { 
		connection = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
  		});
	}
	return connection;
}

//missing error handling for db connection and insertion, should be added in production code
// missing saftey measures for sql injection, should be added in production code
// missing Promise rejection handling, should be added in production code
// missing validation of input data, should be added in production code
/**
 * 
 * @param {object} data - Harvest data
 * @param {string} data.source - Source of the data (e.g., 'usda')
 * @param {string} data.plant_identifier - Unique identifier for the plant (e.g., 'abbot')
 * @param {string} data.data_type - Type of data being harvested (e.g., 'traits')
 * @param {object} data.raw_json - The raw JSON data harvested from the source 
 * @returns {Promise-boolean>} - Returns true if insertion is successful, 
 * false if duplicate entry is detected, and throws an error for other issues	
 */
export async function insertHarvest(data) {
	const conn = await connectToDB();
	try {
		const [result] = await conn.execute(
			'INSERT INTO raw_harvest (source, plant_identifier, data_type, raw_json) VALUES (?, ?, ?, ?)',
			[data.source, data.plant_identifier, data.data_type, JSON.stringify(data.raw_json)]
		);
		return true;
	} catch (error) {
		if (error.code === 'ER_DUP_ENTRY') {
			console.warn('Duplicate entry detected for source:', data.source, 'plant_identifier:', data.plant_identifier, 'data_type:', data.data_type);
			return false; // Indicate that the insertion was not successful due to a duplicate entry
		}
		console.error('Error inserting harvest data:', error);
		throw error; // Re-raise the error so the caller knows it failed
	}// finally {
	//	await conn.end(); // Ensure connection is closed even if an error occurs
	//}
}

export async function closeDBConnection() {
  if (connection) {
	await connection.end();
	connection = null;
  }
}