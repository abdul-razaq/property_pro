import { UnImplementedError } from "./app_error.js";

/**
 * @abstract @interface @class
 *
 * Abstract Interface Validation class
 */
class AbstractValidator {
	constructor() {}
	/**
	 * Checks whether argument passed is of type String.
	 * @param {*} value
	 *
	 * @returns {boolean}
	 */
	isString(value) {
		throw new UnImplementedError(this.isString.name);
	}

	/**
	 * Checks whether argument passed is of type Number.
	 * @param {*} value
	 *
	 * @returns {boolean}
	 */
	isNumber(value) {
		throw new UnImplementedError(this.isNumber.name);
	}

	/**
	 * Checks whether argument passed is of type boolean.
	 * @param {*} value
	 *
	 * @returns {boolean}
	 */
	isBoolean(value) {
		throw new UnImplementedError(this.isBoolean.name);
	}

	/**
	 * Checks whether argument passed is of type function.
	 * @param {*} value
	 *
	 * @returns {boolean}
	 */
	isFunction(value) {
		throw new UnImplementedError(this.isFunction.name);
	}

	/**
	 * Checks to see whether argument passed contains number.
	 * @param {string} value
	 *
	 * @returns {boolean}
	 */
	containsNumber(value) {
		throw new UnImplementedError(this.isBoolean.name);
	}

	/**
	 * Checks to see whether argument passed is an empty value.
	 * @param {string} value
	 *
	 * @returns {boolean}
	 */
	isEmpty(value) {
		throw new UnImplementedError(this.isEmpty.name);
	}

	/**
	 * Checks to see whether argument passed is 11 digits long and contains only numbers.
	 * @param {string} phoneNumber
	 *
	 * @returns {boolean}
	 */
	isValidPhoneNumber(phoneNumber) {
		throw new UnImplementedError(this.isValidPhoneNumber.name);
	}

	/**
	 * Checks to see whether argument passed contains special characters, i.e if argument contains any of the following characters +/*$^()[]{}\|~`&!@#%_=:;"'<>,.?).
	 * @param {string} phoneNumber
	 *
	 * @returns {boolean}
	 */
	containsInvalidSpecialCharacters(phoneNumber) {
		throw new UnImplementedError(this.containsInvalidSpecialCharacters.name);
	}
}

class AbstractAuthValidator extends AbstractValidator {
	constructor() {
		super();
	}
	/**
	 * Checks to see whether argument passed is a valid email address.
	 * @param {string} email
	 *
	 * @returns {boolean}
	 */
	isValidEmail(email) {
		throw new UnImplementedError(this.isValidEmail.name);
	}

	/**
	 * Checks to see whether argument passed is a valid password.
	 * @param {string} password
	 *
	 * @returns {boolean}
	 */
	isValidPassword(password) {
		throw new UnImplementedError(this.isValidPassword.name);
	}

	/**
	 * Checks to see if argument passed contains any bad password combination.
	 * @param {string} password
	 * @returns {boolean} boolean
	 */
	containsBadPassword(password) {
		throw new UnImplementedError(this.containsBadPassword.name);
	}
}

export class Validator extends AbstractValidator {
	constructor() {
		super();
	}

	/**
	 * Checks whether argument passed is of type string.
	 * @param {*} value
	 *
	 * @returns {boolean}
	 */
	isString(value) {
		return typeof value === "string";
	}

	/**
	 * Checks whether argument passed is of type Number.
	 * @param {*} value
	 *
	 * @returns {boolean}
	 */
	isNumber(value) {
		return typeof value === "number" && /^\d+(\.\d+)?$/.test(value);
	}

	/**
	 * Checks whether argument passed is of type boolean.
	 * @param {*} value
	 *
	 * @returns {boolean}
	 */
	isBoolean(value) {
		return typeof value === "boolean";
	}

	/**
	 * Checks whether argument passed is of type function.
	 * @param {*} value
	 *
	 * @returns {boolean}
	 */
	isFunction(value) {
		return typeof value === "function";
	}

	/**
	 * Checks to see whether argument passed contains number.
	 * @param {string} value
	 *
	 * @returns {boolean}
	 */
	containsNumber(value) {
		return this.isString(value) && /\d/.test(value);
	}

	/**
	 * Checks to see whether argument passed is an empty value.
	 * @param {*} value
	 *
	 * @returns {boolean}
	 */
	isEmpty(value) {
		if (value === undefined || value === null) return true;
		if (
			typeof value === "object" &&
			(!Object.keys(value).length || !value.length)
		)
			return true;
		if (this.isString(value) && !value.trim()) return true;
		return false;
	}

	/**
	 * Checks to see whether argument passed is 11 digits long and contains only numbers.
	 * @param {string} phoneNumber
	 *
	 * @returns {boolean}
	 */
	isValidPhoneNumber(phoneNumber) {
		return super.isString(phoneNumber) && /^\d{11}$/.test(phoneNumber);
	}

	/**
	 * Checks to see whether argument passed contains special characters, i.e if argument contains any of the following characters +/*$^()[]{}\|~`&!@#%_=:;"'<>,.?).
	 * @param {string} value
	 *
	 * @returns {boolean}
	 */
	containsInvalidSpecialCharacters(value) {
		const badCharRegExp =
			/[+/*$^()[\]{}\\|~`&!@#%_=:;"'<>,.?]|(^-)|(-$)|(^-$)|(-{2,})/g;
		return badCharRegExp.test(value);
	}
}

export class AuthValidator extends AbstractAuthValidator {
	constructor() {
		super();
	}

	/**
	 * Checks to see if argument passed is a valid email address.
	 * @param {string} email
	 *
	 * @returns {boolean} boolean
	 */
	isValidEmail(email) {
		const emailRegExp =
			/^(\D)+(\w)*((\.(\w)+)?)+@(\D)+(\w)*((\.(\D)+(\w)*)+)?(\.)[a-z]{2,}$/;
		return super.isString(email) && emailRegExp.test(email);
	}

	/**
	 * Checks to see if argument passed is a valid password that contains at least 8 characters.
	 * @param {string} password
	 * @returns {boolean} boolean.
	 */
	isValidPassword(password) {
		return super.isString(password) && password.trim().length >= 8;
	}

	/**
	 * Checks to see if argument passed contains any bad password combination.
	 * @param {string} password
	 * @returns {boolean} boolean
	 */
	containsBadPassword(password) {
		const badPasswords = [
			"password",
			"pass",
			"pass123",
			"pass1234",
			"password123",
			"password1234",
			"test",
			"test1234",
			"admin",
			"admin123",
			"admin1234",
			"root",
			"toor",
		];
		return badPasswords.includes(password);
	}
}
