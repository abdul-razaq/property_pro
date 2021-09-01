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
		const hashedPassword = await argon2.hash(password, { saltLength: 10 });
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
		let result;
		try {
			result = await dbConnection.queryDB(query, queryParams);
		} catch (error) {
			throw error;
		}
		return result.rows[0];
	}

	/**
	 * delete a user with the given user id.
	 * @param {string} userId user id to delete a user with
	 */
	static async deleteUser(userId) {
		const query = "DELETE FROM users WHERE user_id = $1";
		await dbConnection.queryDB(query, [userId]);
	}

	/**
	 * find a user with the given hashed token
	 * @param {string} hashedToken hashed token to find the user by
	 */
	static async findUserByToken(hashedToken) {
		const query =
			"SELECT user_id, email, first_name, last_name, phone_number, address, role, date_registered FROM users WHERE hashed_token = $1 AND token_expires_in > $2";
		const result = await dbConnection.queryDB(query, [
			hashedToken,
			new Date(Date.now()),
		]);
		return result.rows[0];
	}

	static async verifyUser(userId) {
		const query =
			"UPDATE users SET hashed_token = $1, token_expires_in = $2, verified = $3 WHERE user_id = $4";
		const params = [null, null, true, userId];
		await dbConnection.queryDB(query, params);
	}
}
