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
	let newUser;
	try {
		newUser = await UserServices.createUser(user);
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
		if (error.message.includes("unique_email"))
			return Response.error(
				res,
				"email address already in use.",
				httpStatuses.statusForbidden
			);
		await UserServices.deleteUser(newUser?.user_id);
		return Response.error(
			res,
			"unable to send confirmation email. try again in few minutes time.",
			httpStatuses.statusInternalServerError
		);
	}
}

export async function verifyEmail(req, res, next) {
	const hashedToken = new Token().hashToken(req.params.token);
	const user = await UserServices.findUserByToken(hashedToken);
	if (!user)
		return Response.error(
			res,
			"token is invalid or has expired.",
			httpStatuses.statusBadRequest
		);
	await UserServices.verifyUser(user.user_id);
	const jwt = User.generateJWT(user.user_id, user.email);
	const jwtCookieOptions = {
		expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
		httpOnly: true,
		secure: req.secure || req.headers["x-forwarded-proto"] === "https",
	};
	res.cookie("jwt", jwt, jwtCookieOptions);
	const welcomeLink = `${req.protocol}://${req.get("host")}/${
		process.env.API_VERSION
	}/users/profile`;
	try {
		await new Email(
			user.email,
			user.first_name,
			welcomeLink
		).sendWelcomeEmail();
	} catch (e) {
	} finally {
		Response.OK(res, "email confirmation successful.", { token: jwt, user });
	}
}

export async function loginUser(req, res, next) {
	if (req.errorExists)
		return Response.error(
			res,
			"validation failed. check input values provided.",
			httpStatuses.statusBadRequest,
			{ errors: req.errors }
		);
	const { email, password } = req.body;
	const user = await UserServices.findUser(null, email);
	if (!user)
		return Response.error(
			res,
			"user with this email address does not exist.",
			httpStatuses.statusForbidden
		);
	if (!(await User.isValidPassword(email, password)))
		return Response.error(
			res,
			"invalid email address or password.",
			httpStatuses.statusForbidden
		);
	const jwt = User.generateJWT(user.user_id, email);
	Response.OK(res, "login successful", { token: jwt, user });
}

export async function updatePassword(req, res, next) {
	if (req.errorExists)
		return Response.error(
			res,
			"validation failed. check input provided.",
			httpStatuses.statusBadRequest,
			{ errors: req.errors }
		);
	if (!(await User.isValidPassword(req.user.email, req.body.old_password))) {
		return Response.error(
			res,
			"previous password provided is invalid.",
			httpStatuses.statusForbidden
		);
	}
	if (
		!(await UserServices.updateUserPassword(
			req.user.user_id,
			req.body.new_password
		))
	) {
		return Response.error(res, "unable to update password.");
	}
	Response.OK(res, "password updated successfully.");
}

export async function forgotPassword(req, res, next) {
	if (req.errorExists)
		return Response.error(
			res,
			"validation failed. check email address provided.",
			httpStatuses.statusBadRequest,
			{ errors: req.errors }
		);
	const user = await UserServices.findUser(null, req.body.email);
	if (!user)
		return Response.error(
			res,
			"user with this email address does not exist.",
			httpStatuses.statusForbidden
		);
	const tokenObj = new Token().generateToken();
	const passwordResetToken = tokenObj.token;
	const hashedToken = tokenObj.hashToken();
	const passwordResetUrl = `${req.protocol}://${req.get("host")}${
		process.env.API_VERSION
	}/auth/password_reset/${passwordResetToken}`;
	try {
		await UserServices.userForgotPassword(user.user_id, hashedToken);
		await new Email(
			user.email,
			user.first_name,
			passwordResetUrl
		).sendPasswordResetEmail();
	} catch (error) {
		await UserServices.resetUserToken(user.user_id);
		return Response.error(
			res,
			"error sending password reset token. try again later."
		);
	}
	Response.OK(res, "password reset token sent to email address.");
}

export async function resetPassword(req, res, next) {
	if (req.errorExists)
		return Response.error(
			res,
			"validation failed. check password value provided.",
			httpStatuses.statusBadRequest,
			{ errors: req.errors }
		);
	const hashedToken = new Token().hashToken(req.params.token);
	const user = await UserServices.findUserByToken(hashedToken);
	if (!user)
		return Response.error(
			res,
			"invalid token or token has expired.",
			httpStatuses.statusUnauthorized
		);
	if (
		!(await UserServices.updateUserPassword(user.user_id, req.body.password))
	) {
		return Response.error(res, "unable to update password. try again later.");
	}
	await UserServices.resetUserToken(user.user_id);
	Response.OK(res, "password updated successfully.");
}
