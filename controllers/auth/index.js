import Response from "../../helpers/responses.js";
import Email from "../../helpers/email.js";
import httpStatuses from "../../helpers/http_statuses.js";
import Token from "../../helpers/token.js";

import User from "../../models/user.js";
import UserServices from "../../services/user.js";

export async function RegisterUser(req, res, next) {
	if (req.errorExists)
		return Response.error(
			res,
			"validation error. check input values provided.",
			httpStatuses.statusBadRequest,
			{ errors: req.errors }
		);
	const tokenObj = new Token();
	const confirmationToken = tokenObj.generateToken().token;
	const hashedToken = tokenObj.hashToken();
	const confirmationLink = `${req.protocol}://${req.get("host")}${
		process.env.API_VERSION
	}/auth/email_confirmation/${confirmationToken}`;
	const user = new User(req.body);
	user.hashedToken = hashedToken;
	const newUser = await UserServices.createUser(user);
	try {
		await new Email(
			user.email,
			user.firstName,
			confirmationLink
		).sendConfirmationEmail();
		return Response.OK(
			res,
			"confirmation email successfully sent to the email address provided.",
			newUser
		);
	} catch (error) {
		await UserServices.deleteUser(newUser.user_id);
		return Response.error(
			res,
			"unable to send confirmation email. try again in few minutes time.",
			httpStatuses.statusInternalServerError
		);
	}
}
