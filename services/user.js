import argon2 from "argon2";

import dbConnection from "../config/database/db.js";

/**
 * @constructor
 * Defines the User services.
 */
export default class UserServices {
	/**
	 * @static @public @method
	 * creates and saves new user to the database.
	 * @param {object} user the user object that contains details of the user to create
	 */
	static async createUser({
		email,
		firstName,
		lastName,
		password,
		phoneNumber,
		address,
		role,
		hashedToken,
	}) {
		const tokenExpiresIn = new Date(Date.now() + 60 * 60 * 1000);
		const hashedPassword = await argon2.hash(password);
		const query = `INSERT INTO users (email, first_name, last_name, password, phone_number, address, role, hashed_token, token_expires_in) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING user_id, email, first_name, last_name, phone_number, address, role`;
		const queryParams = [
			email,
			firstName,
			lastName,
			hashedPassword,
			phoneNumber,
			address,
			role,
			hashedToken,
			tokenExpiresIn,
		];
		const result = await dbConnection.queryDB(query, queryParams);
		return result.rows[0];
	}

	static async deleteUser(userId) {
		const query = "DELETE FROM users WHERE user_id = $1";
		await dbConnection.queryDB(query, [userId]);
	}
}
