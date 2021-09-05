import dbConnection from "../config/database/db.js";

export default class PropertyServices {
	static async createProperty({
		owner,
		status,
		type,
		price,
		state,
		city,
		address,
		propertyImage,
	}) {
		const query =
			"INSERT INTO properties (owner, status, type, price, state, city, address, property_image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING property_id, status, type, price, state, city, address, property_image, created_on, updated_on";
		try {
			const result = await dbConnection.queryDB(query, [
				owner,
				status,
				type,
				price,
				state,
				city,
				address,
				propertyImage,
			]);
			return result.rows[0];
		} catch (error) {
			throw error;
		}
	}

	static async deleteProperty(propertyId, owner) {
		const query =
			"DELETE FROM properties WHERE property_id = $1 AND owner = $2";
		try {
			const { rowCount } = await dbConnection.queryDB(query, [propertyId, owner]);
			return !!rowCount;
		} catch (error) {
			throw error;
		}
	}
}
