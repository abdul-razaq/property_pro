import Response from "../../helpers/responses.js";
import Email from "../../helpers/email.js";
import httpStatuses from "../../helpers/http_statuses.js";
import Token from "../../helpers/token.js";

export async function RegisterUser(req, res, next) {
	if (req.errorExists)
		return Response.error(
			res,
			"validation error. check input values provided.",
			httpStatuses.statusBadRequest,
			{ errors: req.errors }
		);
	// TODO: Create a User model and instantiate the userDetails object with the User model passing in the signIn Input details.
	const tokenObj = new Token();
	const confirmationToken = tokenObj.generateToken().token;
	const hashedToken = tokenObj.hashToken();
	const confirmationLink = `${req.protocol}://${req.get("host")}${
		process.env.API_VERSION
	}/auth/email_confirmation/${confirmationToken}`;
	const userDetails = {};
	try {
		await new Email(userDetails, confirmationLink).sendConfirmationEmail();
		return Response.OK(
			res,
			"confirmation email successfully sent to the email address provided."
		);
	} catch (error) {
		// TODO: Talk to the User Service to delete this newly created account since sending email confirmation failed.
		return Response.error(
			res,
			"unable to send confirmation email. try again in few minutes time.",
			httpStatuses.statusInternalServerError
		);
	}
	// talk to the service to call db function to create a new user.
	// If the service returns an error, send 500 internal server error back to the client and ask them to try again.
	// if successful, grab the returned data returned from the service and send it back to the client.
}
