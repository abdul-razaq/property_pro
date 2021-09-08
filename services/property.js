import dbConnection from "../config/database/db.js";

export default class PropertyServices {
	/**
	 * Creates a new property
	 * @param {object} propertyObject the property to create
	 * @returns object - new property object.
	 */
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

	/**
	 * Deletes a specific property
	 * @param {number} propertyId id of property to delete
	 * @param {number} owner id of the property owner
	 * @returns boolean
	 */
	static async deleteProperty(propertyId, owner) {
		const query =
			"DELETE FROM properties WHERE property_id = $1 AND owner = $2";
		try {
			const { rowCount } = await dbConnection.queryDB(query, [
				propertyId,
				owner,
			]);
			return !!rowCount;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Mark a specified property's status as "sold".
	 * @param {number} propertyId id of the property to update
	 * @param {number} owner id of the property owner
	 * @returns boolean
	 */
	static async markPropertyAsSold(propertyId, owner) {
		const query =
			"UPDATE properties SET status = $1 WHERE property_id = $2 AND owner = $3";
		const { rowCount } = await dbConnection.queryDB(query, [
			"sold",
			propertyId,
			owner,
		]);
		return !!rowCount;
	}

	/**
	 * fetch a single property
	 * @param {number} propertyId id of property to fetch.
	 * @returns object
	 */
	static async getProperty(propertyId) {
		const query =
			"SELECT u.first_name, u.last_name, u.email, u.date_registered, u.phone_number, p.property_id, p.status, p.type, p.price, p.state, p.city, p.address, p.created_on, p.property_image, p.updated_on FROM properties AS p INNER JOIN users AS u ON p.owner = u.user_id WHERE p.property_id = $1";
		const result = await dbConnection.queryDB(query, [propertyId]);
		return result.rows[0];
	}

	/**
	 * retrieves all properties of any or a specific type.
	 * @param {string} type the type of properties to retrieve
	 * @returns Array
	 */
	static async getProperties(type) {
		const query = `SELECT u.first_name, u.last_name, u.email, u.date_registered, u.phone_number, p.property_id, p.status, p.type, p.price, p.state, p.city, p.address, p.created_on, p.property_image, p.updated_on FROM properties AS p INNER JOIN users AS u ON p.owner = u.user_id${
			type ? " WHERE type = $1" : ""
		}`;
		const { rows } = await dbConnection.queryDB(
			query,
			type ? [type] : undefined
		);
		return rows;
	}

	/**
	 * flag a specific property
	 * @param {number} propertyId the id of the property to flag
	 * @param {string} reason reason for flagging
	 * @param {string} description description of the flag
	 */
	static async flagProperty(propertyId, reason, description) {
		const query =
			"INSERT INTO flags (property, reason, description) VALUES ($1, $2, $3)";
		const { rowCount } = await dbConnection.queryDB(query, [
			propertyId,
			reason,
			description,
		]);
		return !!rowCount;
	}
}
