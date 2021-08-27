import crypto from "crypto";

import AppError from "../helpers/token.js";

/**
 * @constructor
 * Defines methods for generating and hashing tokens.
 */
export default class Token {
	constructor() {}

	/**
	 * @public @getter
	 * returns the generated token.
	 */
	get token() {
		return this._token;
	}

	set token(_) {
		throw new AppError("cannot set token.");
	}

  get hashedToken() {
    return this._hashedToken;
  }

  set hashedToken(_) {
    throw new AppError("cannot set hashed token.")
  }

	/**
	 * @public @method
	 * Generates a new token of the provided size.
	 * @param {number} byteSize the size of the generated token.
	 * @param {string} outputFormat the output format for the generated token
	 * @returns Token object
	 */
	generateToken(byteSize = 32, outputFormat = "hex") {
		this._token = crypto.randomBytes(byteSize).toString(outputFormat);
		return this;
	}

	/**
	 * @public @method
	 * Hash the previously generated or provided token.
	 * @param {string} token the token to hash.
	 * @param {string} algorithm the algorithm to use in hashing the token.
	 * @param {string} outputFormat the output format for the hashed token.
	 * @returns
	 */
	hashToken(token = this._token, algorithm = "sha256", outputFormat = "hex") {
		this._hashedToken = crypto
			.createHmac(algorithm, process.env.TOKEN_SECRET)
			.update(token)
			.digest(outputFormat);
		return this._hashedToken;
	}

	/**
	 * Checks to see whether provided plain token and hashed token match.
	 * @param {string} token plain token to compare
	 * @param {string} hashedToken hashed token to compare plain token with
	 * @returns boolean
	 */
	isValidToken(token, hashedToken) {
		return hashedToken === this.hashToken(token);
	}
}
