import jwt from "jsonwebtoken";

import UserServices from "../services/user.js";

/**
 * @constructor
 * Defines the User model.
 */
export default class User {
	constructor(userDetails) {
		this.email = userDetails.email;
		this.firstName = userDetails.first_name;
		this.lastName = userDetails.last_name;
		this.password = userDetails.password;
		this.phoneNumber = userDetails.phone_number;
		this.address = userDetails.address;
		this.role = userDetails.role;
		this.hashedToken = userDetails.hashedToken;
	}
	/**
	 * sign and generate jwt token.
	 * @param {string} userId user id to encode in the token string
	 * @param {string} email email address to encode in the token string
	 * @returns signed jwt token.
	 */
	static generateJWT(userId, email) {
		const jwtToken = jwt.sign({ userId, email }, process.env.JWT_SECRET, {
			expiresIn: "30d",
		});
		return jwtToken;
	}
	/**
	 * check to see if user has changed their password after jwt has been issued.
	 * @param {string} userId user id
	 * @param {string} jwtIat jwt issued at time
	 * @returns boolean
	 */
	static async hasChangedPassword(userId, jwtIat) {
		return await UserServices.hasChangedPassword(userId, jwtIat);
	}
}
