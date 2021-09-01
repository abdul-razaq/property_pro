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
}
