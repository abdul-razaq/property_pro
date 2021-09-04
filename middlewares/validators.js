import {
	Validator as BasicValidator,
	AuthValidator,
} from "../helpers/validators.js";
import filterObject from "../helpers/filter_object.js";

const basicValidator = new BasicValidator();
const authValidator = new AuthValidator();

/**
 * @class defines generic validator methods.
 */
class Validator {
	/**
	 * Validates the input email
	 * @param {string} email Input email.
	 *
	 * Calls @method isEmpty validator method to check if email field is empty.
	 * Calls @method isValidEmail validator method to check if email is a valid email address.
	 */
	static validateEmail(email) {
		const errors = [];
		if (!email || basicValidator.isEmpty(email)) {
			errors.push("Email field cannot be empty.");
		}
		if (email && !authValidator.isValidEmail(email)) {
			errors.push("Invalid email address.");
		}
		return errors;
	}

	/**
	 * Validates the input password
	 * @param {string} password Input password.
	 * @param {string} confirmPassword Password confirmation.
	 *
	 * Calls @method isEmpty validator method to check if password field is empty.
	 * Calls @method isValidPassword validator method to check if password is a valid password.
	 * Calls @method isNumber validator method to check if password contains only numbers.
	 * Calls @method containsBadPassword validator method to check if password contains forbidden passwords.
	 */
	static validatePassword(password, confirmPassword) {
		const errors = [];
		if (!password || basicValidator.isEmpty(password)) {
			errors.push("password field cannot be empty.");
		}
		if (password && !basicValidator.containsNumber(password)) {
			errors.push("password value must contain letters and numbers.");
		}
		if (password && !authValidator.isValidPassword(password)) {
			errors.push("password field must contain 8 characters or more.");
		}
		if (password && authValidator.containsBadPassword(password)) {
			errors.push(`password field cannot contain the value '${password}'.`);
		}
		if (confirmPassword && confirmPassword !== password) {
			errors.push("password and confirm_password fields must match.");
		}
		return errors;
	}

	/**
	 * Validates any input name
	 * @param {string} name Input first_name or last_name.
	 * @param {string} nameType name type e.g first_name or last_name.
	 *
	 * Calls @method isEmpty validator method to check if name is empty.
	 * Calls @method isString validator method to check if name is a string type.
	 * Calls @method containsNumber validator method to check if name includes any number.
	 * Calls @method containsInvalidSpecialCharacters validator method to check if name includes any unwanted special characters.
	 */

	static validateName(name, nameType) {
		const errors = [];
		if (!name || basicValidator.isEmpty(name)) {
			errors.push(`${nameType} field cannot be empty.`);
		}
		if (!basicValidator.isString(name)) {
			errors.push(`${nameType} field must be a string value.`);
		}
		if (basicValidator.containsNumber(name)) {
			errors.push(`${nameType} field cannot contain numbers.`);
		}
		if (basicValidator.containsInvalidSpecialCharacters(name)) {
			errors.push(`${nameType} field must not include invalid characters.`);
		}
		return errors;
	}

	/**
	 * Validates the input agent address
	 * @param {string} address Input agent address.
	 * @param {string} role User role.
	 *
	 * Calls @method isEmpty validator method to check if address is empty.
	 * Calls @method isString validator method to check if address is a string type.
	 * Calls @method isNumber validator method to check if address contains only numbers.
	 */

	static validateAgentAddress(address, role) {
		const errors = [];
		if (
			role &&
			role === "agent" &&
			(!address || basicValidator.isEmpty(address))
		) {
			errors.push("address field is required for agent roles.");
		}
		if (address && !basicValidator.isString(address)) {
			errors.push("address field must be a string value.");
		}
		if (address && basicValidator.isNumber(address)) {
			errors.push("address field cannot contain only numbers.");
		}
		return errors;
	}

	/**
	 * Validates the input phone number
	 * @param {string} phoneNumber Input phone number.
	 * @param {string} role User role.
	 *
	 * Calls @method isEmpty validator methods to check if phone number is empty.
	 * Calls @method isString validator methods to check if phone number is a string type.
	 * Calls @method isValidPhoneNumber validator methods to check if phone number is a valid phone number.
	 */

	static validatePhoneNumber(phoneNumber, role) {
		const errors = [];
		if (
			role &&
			role === "agent" &&
			(!phoneNumber || basicValidator.isEmpty(phoneNumber))
		) {
			errors.push("phone_number field is required for agent roles.");
		}
		if (phoneNumber && !basicValidator.isString(phoneNumber)) {
			errors.push("phone_number field must be a string value.");
		}
		if (phoneNumber && !basicValidator.isValidPhoneNumber(phoneNumber)) {
			errors.push("phone_number field must be a valid 11 digits phone number.");
		}
		return errors;
	}
}

/**
 * @class defines user validation middlewares.
 */
export class UserValidator {
	/**
	 * @method
	 * Middleware that validates user signUp input details.
	 * @param {Request} req HTTP Request Object
	 * @param {Response} res HTTP Response object
	 * @param {NextFunction} next Function to call next middleware in the middleware stack.
	 *
	 * Calls @method Validator.validateEmail to validate the input email
	 * Calls @method Validator.validatePassword to validate the password
	 * Calls @method Validator.validateName to validate any name input.
	 * Calls @method Validator.validateAgentAddress to validate the Agent address
	 * Calls @method Validator.validatePhoneNumber to validate the phone number.
	 */
	static validateSignUp(req, res, next) {
		const errors = {
			email: [],
			password: [],
			firstName: [],
			lastName: [],
			address: [],
			phoneNumber: [],
			role: [],
		};
		const reqBody = { ...req.body };
		const unwantedFields = [
			"user_id",
			"avatar",
			"bio",
			"date_registered",
			"active",
			"verified",
			"token",
			"hashed_token",
			"token_expires_in",
		];
		const signUpFields = filterObject(reqBody, unwantedFields);
		let {
			email,
			password,
			confirm_password,
			first_name,
			last_name,
			address,
			phone_number,
			role,
		} = signUpFields;

		errors.email = Validator.validateEmail(email);
		errors.password = Validator.validatePassword(password, confirm_password);
		errors.firstName = Validator.validateName(first_name, "first_name");
		errors.lastName = Validator.validateName(last_name, "last_name");
		errors.address = Validator.validateAgentAddress(address, role);
		errors.phoneNumber = Validator.validatePhoneNumber(phone_number, role);
		const validRoles = ["agent", "user"];
		if (role && !validRoles.includes(role)) {
			errors.role.push("role field must be either 'user' or 'agent'.");
			role = "user";
		}
		for (let key in errors) {
			if (!errors[key].length) delete errors[key];
		}
		req.errors = errors;
		req.errorExists = !!Object.keys(errors).length;
		req.body = signUpFields;
		next();
	}
	/**
	 * @method
	 * Middleware that validates user signIn input details.
	 * @param {Request} req HTTP Request Object
	 * @param {Response} res HTTP Response object
	 * @param {NextFunction} next Function to call next middleware in the middleware stack.
	 *
	 * Calls @method Validator.validateEmail to validate the input email
	 * Calls @method Validator.validatePassword to validate the password
	 */
	static validateSignIn(req, res, next) {
		const errors = {
			email: [],
			password: [],
		};
		errors.email = Validator.validateEmail(req.body.email);
		errors.password = Validator.validatePassword(req.body.password, null);

		for (let key in errors) {
			if (!errors[key].length) delete errors[key];
		}
		req.errors = errors;
		req.errorExists = !!Object.keys(errors).length;
		next();
	}

	/**
	 * @method
	 * Middleware that validates user details for updating password.
	 * @param {Request} req HTTP Request Object
	 * @param {Response} res HTTP Response object
	 * @param {NextFunction} next Function to call next middleware in the middleware stack.
	 *
	 * Calls @method Validator.validatePassword to validate the password
	 */
	static validatePasswordUpdate(req, res, next) {
		const errors = {
			oldPassword: [],
			newPassword: [],
		};
		const { old_password, new_password, confirm_new_password } = req.body;
		errors.oldPassword = Validator.validatePassword(old_password);
		errors.newPassword = Validator.validatePassword(
			new_password,
			confirm_new_password
		);
		for (let key in errors) {
			if (!errors[key].length) delete errors[key];
		}
		req.errors = errors;
		req.errorExists = !!Object.keys(errors).length;
		next();
	}

	/**
	 * @method
	 * Middleware that validates email address provided when user forgets password.
	 * @param {Request} req HTTP Request Object
	 * @param {Response} res HTTP Response object
	 * @param {NextFunction} next Function to call next middleware in the middleware stack.
	 *
	 * Calls @method Validator.validateEmail to validate the email address provided.
	 */
	static validateForgotPassword(req, res, next) {
		const errors = {
			email: [],
		};
		errors.email = Validator.validateEmail(req.body.email);
		for (let key in errors) {
			if (!errors[key].length) delete errors[key];
		}
		req.errors = errors;
		req.errorExists = !!Object.keys(errors).length;
		next();
	}

	/**
	 * @method
	 * Middleware that validates user details for resetting password.
	 * @param {Request} req HTTP Request Object
	 * @param {Response} res HTTP Response object
	 * @param {NextFunction} next Function to call next middleware in the middleware stack.
	 *
	 * Calls @method Validator.validatePassword to validate the password
	 */
	static validateResetPassword(req, res, next) {
		const errors = {
			password: [],
		};
		const { password, confirm_password } = req.body;
		errors.password = Validator.validatePassword(password, confirm_password);
		for (let key in errors) {
			if (!errors[key].length) delete errors[key];
		}
		req.errors = errors;
		req.errorExists = !!Object.keys(errors).length;
		next();
	}
}

/**
 * @class defines property validation middlewares.
 */
export class PropertyValidator {
	static _validateType(type) {
		const errors = [];
		if (!type || basicValidator.isEmpty(type)) {
			errors.push("Type field cannot be empty.");
		}
		if (type && !basicValidator.isString(type)) {
			errors.push("Type field must be a string value.");
		}
		if (type && basicValidator.isNumber(type)) {
			errors.push("Type field cannot contain only numbers.");
		}
		return errors;
	}

	static _validateState(state) {
		const errors = [];
		if (!state || basicValidator.isEmpty(state)) {
			errors.push("State field cannot be empty.");
		}
		if (state && !basicValidator.isString(state)) {
			errors.push("State field must be a string value.");
		}
		if (
			state &&
			(basicValidator.isNumber(state) || basicValidator.containsNumber(state))
		) {
			errors.push("State field cannot contain numbers.");
		}
		return errors;
	}

	static _validateCity(city) {
		const errors = [];
		if (!city || basicValidator.isEmpty(city)) {
			errors.push("City field cannot be empty.");
		}
		if (city && !basicValidator.isString(city)) {
			errors.push("City field must be a string value.");
		}
		if (
			city &&
			(basicValidator.isNumber(city) || basicValidator.containsNumber(city))
		) {
			errors.push("City field cannot contain numbers.");
		}
		return errors;
	}

	static _validateAddress(address) {
		const errors = [];
		if (!address || basicValidator.isEmpty(address)) {
			errors.push("Address field cannot be empty.");
		}
		if (address && !basicValidator.isString(address)) {
			errors.push("Address field must be a string value.");
		}
		if (address && basicValidator.isNumber(address)) {
			errors.push("Address field cannot contain only numbers.");
		}
		return errors;
	}

	static _validatePrice(price) {
		const errors = [];
		if (!price || basicValidator.isEmpty(price)) {
			errors.push("Price field cannot be empty.");
		}
		if (price && (!basicValidator.isNumber(price) || !parseFloat(price))) {
			errors.push(
				"Price field must be a floating point number greater than 0.0"
			);
		}
		return errors;
	}

	static validateCreateProperty(req, res, next) {
		const errors = {};
		const { type, state, price, city, address } = req.body;

		errors.type = PropertyValidator._validateType(type);
		errors.state = PropertyValidator._validateState(state);
		errors.price = PropertyValidator._validatePrice(parseFloat(price));
		errors.city = PropertyValidator._validateCity(city);
		errors.address = PropertyValidator._validateAddress(address);
		errors.image =
			!req.file && (errors.image = "An image for the property is required.");

		for (let err in errors) {
			if (!errors[err].length) delete errors[err];
		}
		req.errors = errors;
		req.errorsExists = !!Object.keys(errors).length;
		next();
	}

	static validateUpdateProperty(req, res, next) {}
}
